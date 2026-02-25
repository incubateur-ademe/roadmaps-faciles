"use client";

import { fr } from "@codegouvfr/react-dsfr";
import Alert from "@codegouvfr/react-dsfr/Alert";
import Badge from "@codegouvfr/react-dsfr/Badge";
import Button from "@codegouvfr/react-dsfr/Button";
import Card from "@codegouvfr/react-dsfr/Card";
import Tag from "@codegouvfr/react-dsfr/Tag";
import { cx } from "@codegouvfr/react-dsfr/tools/cx";
import Avatar from "@mui/material/Avatar";
import * as Sentry from "@sentry/nextjs";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import {
  type PropsWithChildren,
  startTransition,
  useCallback,
  useEffect,
  useOptimistic,
  useRef,
  useState,
  useTransition,
} from "react";
import { MarkdownHooks } from "react-markdown";

import { getMaterialAvatarProps } from "@/components/img/InitialsAvatar";
import { Loader } from "@/components/utils/Loader";
import { MarkdownEditor } from "@/dsfr/base/client/MarkdownEditor";
import { Text } from "@/dsfr/base/Typography";
import { type Comment, type User } from "@/prisma/client";
import { UserRole } from "@/prisma/enums";
import { formatDateHour } from "@/utils/date";
import { reactMarkdownConfig } from "@/utils/react-markdown";

import { uploadImage } from "../../../upload-image";
import { deleteComment, editComment, getReplies, sendComment } from "./actions";
import { type CommentActivity } from "./activityHelpers";
import style from "./CommentContent.module.scss";

type ReplyWithUser = { user: User } & Comment;

const ELEVATED_ROLES: Partial<Record<UserRole, "info" | "new" | "warning">> = {
  [UserRole.OWNER]: "warning",
  [UserRole.ADMIN]: "info",
  [UserRole.MODERATOR]: "new",
};

const ROLE_LABEL_KEYS: Partial<Record<UserRole, string>> = {
  [UserRole.OWNER]: "roleOwner",
  [UserRole.ADMIN]: "roleAdmin",
  [UserRole.MODERATOR]: "roleModerator",
};

const AuthorBadges = ({
  authorUserId,
  currentUserId,
  postAuthorId,
  roleMap,
  t,
}: {
  authorUserId: string;
  currentUserId?: string;
  postAuthorId?: string;
  roleMap: Record<string, UserRole>;
  t: ReturnType<typeof useTranslations<"post">>;
}) => {
  const role = roleMap[authorUserId];
  const severity = role ? ELEVATED_ROLES[role] : undefined;
  const labelKey = role ? ROLE_LABEL_KEYS[role] : undefined;
  const isMe = currentUserId === authorUserId;
  const isPostAuthor = postAuthorId === authorUserId;

  if (!severity && !isMe && !isPostAuthor) return null;

  return (
    <span className="flex items-center gap-1 flex-wrap">
      {severity && labelKey && (
        <Badge as="span" small noIcon severity={severity}>
          {t(labelKey as Parameters<typeof t>[0])}
        </Badge>
      )}
      {isPostAuthor && <Tag small>{t("tagAuthor")}</Tag>}
      {isMe && <Tag small>{t("tagYou")}</Tag>}
    </span>
  );
};

interface CommentContentProps {
  activity: CommentActivity;
  isAdmin: boolean;
  postAuthorId?: string;
  roleMap: Record<string, UserRole>;
  userId?: string;
  userImage?: string;
  userName?: string;
}

export const CommentContent = ({
  activity,
  userId,
  userName,
  userImage,
  roleMap: initialRoleMap,
  postAuthorId,
  isAdmin,
}: CommentContentProps) => {
  const t = useTranslations("post");
  const locale = useLocale();
  const comment = activity.comment;
  const [showInput, setShowInput] = useState(false);
  const [replies, setReplies] = useState(comment.replies as ReplyWithUser[]);
  const [showReplies, setShowReplies] = useState(false);
  const [firstOpen, setFirstOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [roleMap, setRoleMap] = useState(initialRoleMap);

  // Edit state for the main comment
  const [isEditing, setIsEditing] = useState(false);
  const [commentBody, setCommentBody] = useState(comment.body);
  const [wasEdited, setWasEdited] = useState(comment.updatedAt > comment.createdAt);
  const editBodyRef = useRef(comment.body ?? "");
  const [editKey, setEditKey] = useState(0);
  const [editPending, setEditPending] = useState(false);
  const [editError, setEditError] = useState<null | string>(null);
  const [isDeleted, setIsDeleted] = useState(false);

  // Optimistic replies
  const [optimisticReplies, addOptimisticReply] = useOptimistic(replies, (currentReplies, newReply: ReplyWithUser) => [
    ...currentReplies,
    newReply,
  ]);

  // Reply form state
  const replyBodyRef = useRef("");
  const [editorKey, setEditorKey] = useState(0);
  const [isPending, startReplyTransition] = useTransition();
  const [replyError, setReplyError] = useState<null | string>(null);

  // Scroll to reply input when opened
  const replyInputRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (showInput && replyInputRef.current) {
      replyInputRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [showInput]);

  const handleReplyChange = useCallback((value: string) => {
    replyBodyRef.current = value;
  }, []);

  const handleEditChange = useCallback((value: string) => {
    editBodyRef.current = value;
  }, []);

  const canEditComment = userId === comment.userId;
  const canDeleteComment = userId === comment.userId || isAdmin;

  const handleEditSave = async () => {
    const body = editBodyRef.current.trim();
    if (!body) return;
    setEditPending(true);
    setEditError(null);
    const result = await editComment({ commentId: comment.id, body });
    if (result.ok) {
      setCommentBody(body);
      setWasEdited(true);
      setIsEditing(false);
      setEditKey(k => k + 1);
    } else {
      setEditError(result.error);
    }
    setEditPending(false);
  };

  const handleDelete = async () => {
    if (!confirm(t("deleteCommentConfirm"))) return;
    const result = await deleteComment(comment.id);
    if (result.ok) {
      setIsDeleted(true);
    }
  };

  const handleReplyEdit = (replyId: number, newBody: string) => {
    setReplies(prev => prev.map(r => (r.id === replyId ? { ...r, body: newBody, updatedAt: new Date() } : r)));
  };

  const handleReplyDelete = (replyId: number) => {
    setReplies(prev => prev.filter(r => r.id !== replyId));
  };

  const handleReplySubmit = () => {
    const body = replyBodyRef.current.trim();
    if (!body || !userId) return;

    setReplyError(null);

    const optimisticReply = {
      body,
      createdAt: new Date(),
      id: -Date.now(),
      isPostUpdate: false,
      parentId: comment.id,
      postId: comment.postId,
      tenantId: comment.tenantId,
      updatedAt: new Date(),
      user: { id: userId, image: userImage ?? null, name: userName ?? null } as User,
      userId,
    } satisfies ReplyWithUser;

    startReplyTransition(async () => {
      addOptimisticReply(optimisticReply);
      const result = await sendComment({
        body,
        parentId: comment.id,
        postId: comment.postId,
        tenantId: comment.tenantId,
      });

      if (result.ok) {
        // If replies weren't fully loaded yet, fetch them all now
        if (firstOpen) {
          const fullReplies = await getReplies(comment.id);
          if (fullReplies.ok) {
            setReplies(fullReplies.data.replies);
            setRoleMap(prev => ({ ...prev, ...fullReplies.data.roleMap }));
          } else {
            const realReply = result.data as unknown as ReplyWithUser;
            setReplies(prev => [...prev, realReply]);
          }
        } else {
          const realReply = result.data as unknown as ReplyWithUser;
          setReplies(prev => [...prev, realReply]);
        }
        replyBodyRef.current = "";
        setEditorKey(k => k + 1);
        setShowInput(false);
        setShowReplies(true);
        setFirstOpen(false);
      } else {
        setReplyError(result.error);
      }
    });
  };

  const handleFirstOpen = () => {
    if (loading) return;
    setLoading(true);
    startTransition(async () => {
      try {
        const response = await getReplies(comment.id);
        if (response.ok) {
          setReplies(response.data.replies);
          setRoleMap(prev => ({ ...prev, ...response.data.roleMap }));
          setFirstOpen(false);
          setShowReplies(true);
        } else {
          Sentry.captureMessage(`Failed to fetch replies: ${response.error}`, "error");
        }
      } catch (error) {
        Sentry.captureException(error);
      }
      setLoading(false);
    });
  };

  if (isDeleted) return null;

  const hasMoreReplies = comment._count.replies > 1;
  const firstReply = optimisticReplies[0];
  const displayReplies = optimisticReplies;

  const badgeProps = { currentUserId: userId, postAuthorId, roleMap, t };

  return (
    <>
      <Card
        shadow
        data-comment-id={activity.comment.id}
        size="medium"
        horizontal
        title={
          <div className="flex justify-between items-center gap-[1rem]">
            <div className="flex items-center gap-2">
              <Avatar
                {...getMaterialAvatarProps(activity.comment.user.name ?? t("anonymous"))}
                alt={`Avatar ${activity.comment.user.name ?? t("anonymous")}`}
                src={activity.comment.user.image ?? undefined}
              />
              <Text inline variant={["sm", "bold"]} className={cx("text-nowrap", fr.cx("fr-mb-0"))}>
                {activity.comment.user.name}
              </Text>
              <AuthorBadges authorUserId={activity.comment.userId} {...badgeProps} />
              {wasEdited && (
                <Text inline variant={["xs", "light"]} className={fr.cx("fr-mb-0")}>
                  {t("edited")}
                </Text>
              )}
            </div>
            {(canEditComment || canDeleteComment) && !isEditing && (
              <span className="flex gap-1">
                {canEditComment && (
                  <Button
                    type="button"
                    size="small"
                    priority="tertiary no outline"
                    iconId="fr-icon-edit-line"
                    title={t("editComment")}
                    onClick={() => {
                      editBodyRef.current = commentBody ?? "";
                      setIsEditing(true);
                    }}
                  />
                )}
                {canDeleteComment && (
                  <Button
                    type="button"
                    size="small"
                    priority="tertiary no outline"
                    iconId="fr-icon-delete-line"
                    title={t("deleteComment")}
                    onClick={() => void handleDelete()}
                  />
                )}
              </span>
            )}
          </div>
        }
        desc={
          isEditing ? (
            <>
              <MarkdownEditor
                key={editKey}
                defaultValue={commentBody ?? ""}
                onChangeAction={handleEditChange}
                uploadImageAction={uploadImage}
                disabled={editPending}
              />
              {editError && <Alert small severity="error" description={editError} className={fr.cx("fr-mt-1w")} />}
              <div className={cx(fr.cx("fr-mt-1w"), "flex justify-end gap-2")}>
                <Button
                  type="button"
                  size="small"
                  priority="secondary"
                  disabled={editPending}
                  onClick={() => setIsEditing(false)}
                >
                  {t("cancelEdit")}
                </Button>
                <Button type="button" size="small" disabled={editPending} onClick={() => void handleEditSave()}>
                  {t("saveComment")}
                </Button>
              </div>
            </>
          ) : (
            <MarkdownHooks {...reactMarkdownConfig}>{commentBody}</MarkdownHooks>
          )
        }
        endDetail={
          <span className="flex justify-between items-center gap-[1rem] w-full">
            <span className="flex items-center gap-2">
              <Text inline variant={["xs", "light"]} className={fr.cx("fr-mb-0")}>
                {formatDateHour(activity.comment.createdAt, locale)}
              </Text>
              {activity.comment._count.replies > 0 && (
                <Text inline variant={["xs"]} className={fr.cx("fr-mb-0")}>
                  {`${activity.comment._count.replies} réponse(s)`}
                </Text>
              )}
            </span>
            <Button
              type="button"
              size="small"
              priority="tertiary no outline"
              iconId="ri-reply-fill"
              onClick={() => setShowInput(!showInput)}
              className={cx({
                invisible: showInput,
              })}
            >
              {t("reply")}
            </Button>
          </span>
        }
      />

      {(displayReplies.length > 0 || showInput) && (
        <div className={cx(fr.cx("fr-mb-2w"), style.thread)}>
          {displayReplies.length > 0 &&
            (firstOpen ? (
              <ThreadEntity>
                {hasMoreReplies && (
                  <Loader
                    className={fr.cx("fr-mb-2w")}
                    loading={loading}
                    text={
                      <Button size="small" priority="tertiary no outline" type="button" onClick={handleFirstOpen}>
                        {t("viewPreviousReplies")}
                      </Button>
                    }
                  ></Loader>
                )}
                <Reply
                  reply={firstReply}
                  isAdmin={isAdmin}
                  onEditAction={handleReplyEdit}
                  onDeleteAction={handleReplyDelete}
                  {...badgeProps}
                />
              </ThreadEntity>
            ) : showReplies ? (
              <>
                {displayReplies.map(reply => (
                  <ThreadEntity key={reply.id}>
                    <Reply
                      reply={reply}
                      isAdmin={isAdmin}
                      onEditAction={handleReplyEdit}
                      onDeleteAction={handleReplyDelete}
                      {...badgeProps}
                    />
                  </ThreadEntity>
                ))}
                <ThreadEntity actions>
                  <div className="flex items-center justify-between">
                    <Button
                      size="small"
                      priority="tertiary no outline"
                      type="button"
                      onClick={() => {
                        setShowReplies(false);
                        document
                          .querySelector(`[data-comment-id="${comment.id}"]`)
                          ?.scrollIntoView({ behavior: "smooth", block: "center" });
                      }}
                    >
                      {t("collapseReplies")}
                    </Button>
                    <Button
                      type="button"
                      size="small"
                      priority="tertiary no outline"
                      iconId="ri-reply-fill"
                      onClick={() => setShowInput(!showInput)}
                      className={cx({
                        invisible: showInput,
                      })}
                    >
                      {t("reply")}
                    </Button>
                  </div>
                </ThreadEntity>
              </>
            ) : (
              <ThreadEntity actions>
                <Button size="small" priority="tertiary no outline" type="button" onClick={() => setShowReplies(true)}>
                  {t("viewReplies", { count: displayReplies.length })}
                </Button>
              </ThreadEntity>
            ))}
          {showInput && (
            <ThreadEntity>
              <div ref={replyInputRef}>
                {!userId ? (
                  <Alert
                    small
                    closable
                    className={fr.cx("fr-pb-2v")}
                    onClose={() => setShowInput(false)}
                    severity="info"
                    description={
                      <>
                        {t.rich("loginToComment", {
                          link: chunks => <Link href="/login">{chunks}</Link>,
                        })}
                      </>
                    }
                  />
                ) : (
                  <>
                    <MarkdownEditor
                      key={editorKey}
                      label={t("reply")}
                      onChangeAction={handleReplyChange}
                      uploadImageAction={uploadImage}
                      disabled={isPending}
                    />
                    {replyError && (
                      <Alert small severity="error" description={replyError} className={fr.cx("fr-mt-1w")} />
                    )}
                    <div className={cx(fr.cx("fr-mt-1w"), "flex justify-end gap-2")}>
                      <Button
                        type="button"
                        size="small"
                        priority="secondary"
                        disabled={isPending}
                        onClick={() => setShowInput(false)}
                      >
                        {t("cancelReply")}
                      </Button>
                      <Button
                        type="button"
                        size="small"
                        iconId="fr-icon-send-plane-fill"
                        disabled={isPending}
                        onClick={handleReplySubmit}
                      >
                        {t("submitReply")}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </ThreadEntity>
          )}
        </div>
      )}
    </>
  );
};

export const ThreadEntity = ({
  children,
  id,
  row,
  actions,
}: PropsWithChildren<{ actions?: boolean; id?: string; row?: boolean }>) => (
  <div className={cx(style["thread-entity"])} id={id}>
    <div className={style["threadline"]}>
      <div aria-hidden className={style["threadline-line"]}></div>
      <div aria-hidden className={style["threadline-end"]}></div>
    </div>
    <div
      className={cx(
        actions ? style["thread-entity-actions"] : style["thread-entity-content"],
        row && style["thread-entity--row"],
      )}
    >
      {children}
    </div>
  </div>
);

interface ReplyProps {
  currentUserId?: string;
  isAdmin: boolean;
  onDeleteAction: (replyId: number) => void;
  onEditAction: (replyId: number, newBody: string) => void;
  postAuthorId?: string;
  reply: ReplyWithUser;
  roleMap: Record<string, UserRole>;
  t: ReturnType<typeof useTranslations<"post">>;
}

export const Reply = ({
  reply,
  roleMap,
  currentUserId,
  postAuthorId,
  isAdmin,
  onEditAction,
  onDeleteAction,
  t,
}: ReplyProps) => {
  const locale = useLocale();
  const [isEditing, setIsEditing] = useState(false);
  const [editPending, setEditPending] = useState(false);
  const [editError, setEditError] = useState<null | string>(null);
  const editBodyRef = useRef(reply.body ?? "");
  const [editKey, setEditKey] = useState(0);

  const canEdit = currentUserId === reply.userId;
  const canDelete = currentUserId === reply.userId || isAdmin;
  const wasEdited = reply.updatedAt > reply.createdAt;

  const handleEditChange = useCallback((value: string) => {
    editBodyRef.current = value;
  }, []);

  const handleEditSave = async () => {
    const body = editBodyRef.current.trim();
    if (!body) return;
    setEditPending(true);
    setEditError(null);
    const result = await editComment({ commentId: reply.id, body });
    if (result.ok) {
      onEditAction(reply.id, body);
      setIsEditing(false);
      setEditKey(k => k + 1);
    } else {
      setEditError(result.error);
    }
    setEditPending(false);
  };

  const handleDelete = async () => {
    if (!confirm(t("deleteCommentConfirm"))) return;
    const result = await deleteComment(reply.id);
    if (result.ok) {
      onDeleteAction(reply.id);
    }
  };

  return (
    <Card
      shadow
      size="small"
      horizontal
      classes={{
        end: "hidden",
      }}
      title={
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <Avatar
              {...getMaterialAvatarProps(reply.user.name ?? t("anonymous"))}
              alt={`Avatar ${reply.user.name ?? t("anonymous")}`}
              src={reply.user.image ?? undefined}
            />
            <Text inline variant={["sm", "bold"]} className={cx("text-nowrap", fr.cx("fr-mb-0"))}>
              {reply.user.name}
            </Text>
            <AuthorBadges
              authorUserId={reply.userId}
              currentUserId={currentUserId}
              postAuthorId={postAuthorId}
              roleMap={roleMap}
              t={t}
            />
            {wasEdited && (
              <Text inline variant={["xs", "light"]} className={fr.cx("fr-mb-0")}>
                {t("edited")}
              </Text>
            )}
            <Text inline variant={["xs", "light"]} className={cx("text-nowrap", fr.cx("fr-mb-0"))}>
              {formatDateHour(reply.createdAt, locale)}
            </Text>
          </div>
          {(canEdit || canDelete) && !isEditing && (
            <span className="flex gap-1">
              {canEdit && (
                <Button
                  type="button"
                  size="small"
                  priority="tertiary no outline"
                  iconId="fr-icon-edit-line"
                  title={t("editComment")}
                  onClick={() => {
                    editBodyRef.current = reply.body ?? "";
                    setIsEditing(true);
                  }}
                />
              )}
              {canDelete && (
                <Button
                  type="button"
                  size="small"
                  priority="tertiary no outline"
                  iconId="fr-icon-delete-line"
                  title={t("deleteComment")}
                  onClick={() => void handleDelete()}
                />
              )}
            </span>
          )}
        </div>
      }
      desc={
        isEditing ? (
          <>
            <MarkdownEditor
              key={editKey}
              defaultValue={reply.body ?? ""}
              onChangeAction={handleEditChange}
              uploadImageAction={uploadImage}
              disabled={editPending}
            />
            {editError && <Alert small severity="error" description={editError} className={fr.cx("fr-mt-1w")} />}
            <div className={cx(fr.cx("fr-mt-1w"), "flex justify-end gap-2")}>
              <Button
                type="button"
                size="small"
                priority="secondary"
                disabled={editPending}
                onClick={() => setIsEditing(false)}
              >
                {t("cancelEdit")}
              </Button>
              <Button type="button" size="small" disabled={editPending} onClick={() => void handleEditSave()}>
                {t("saveComment")}
              </Button>
            </div>
          </>
        ) : (
          <MarkdownHooks {...reactMarkdownConfig}>{reply.body}</MarkdownHooks>
        )
      }
    />
  );
};

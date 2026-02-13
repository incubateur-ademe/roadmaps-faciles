"use client";

import { fr } from "@codegouvfr/react-dsfr";
import Alert from "@codegouvfr/react-dsfr/Alert";
import Button from "@codegouvfr/react-dsfr/Button";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import Card from "@codegouvfr/react-dsfr/Card";
import { cx } from "@codegouvfr/react-dsfr/tools/cx";
import Avatar from "@mui/material/Avatar";
import * as Sentry from "@sentry/nextjs";
import { useLocale } from "next-intl";
import Link from "next/link";
import { type PropsWithChildren, startTransition, useState } from "react";
import { MarkdownHooks } from "react-markdown";

import { getMaterialAvatarProps } from "@/components/img/InitialsAvatar";
import { Loader } from "@/components/utils/Loader";
import { HighlightedTextarea } from "@/dsfr/base/client/HighlightedTextarea";
import { Text } from "@/dsfr/base/Typography";
import { type Comment, type User } from "@/prisma/client";
import { formatDateHour } from "@/utils/date";
import { reactMarkdownConfig } from "@/utils/react-markdown";

import { getReplies } from "./actions";
import { type CommentActivity } from "./activityHelpers";
import style from "./CommentContent.module.scss";

export const CommentContent = ({ activity, userId }: { activity: CommentActivity; userId?: string }) => {
  const comment = activity.comment;
  const [showInput, setShowInput] = useState(false);
  const [_content, setContent] = useState("");
  const [replies, setReplies] = useState(comment.replies as Array<{ user: User } & Comment>);
  const [showReplies, setShowReplies] = useState(false);
  const [firstOpen, setFirstOpen] = useState(true);
  const [loading, setLoading] = useState(false);

  // const [optimisticReplies, addOptimisticReply] = useOptimistic<CommentActivity["comment"]["replies"], string>(
  //   activity.comment.replies,
  //   (state, newReply) => [
  //     {
  //       body: newReply,
  //       createdAt: new Date(),
  //       id: Math.random(),
  //       postId: activity.comment.postId,
  //       parentId: activity.comment.id,
  //       tenantId: activity.comment.tenantId,
  //       userId: "cmb9jvx830000xhce8yhuqjzf",
  //       isPostUpdate: false,
  //       updatedAt: new Date(),
  //       // user: {
  //       //   id: "cmb9jvx830000xhce8yhuqjzf",
  //       // },
  //     },
  //     ...state,
  //   ],
  // );

  if (replies.length === 0) {
    return null;
  }

  const handleFirstOpen = () => {
    if (loading) return; // Prevent multiple clicks while loading
    setLoading(true);
    startTransition(async () => {
      try {
        const response = await getReplies(comment.id);
        if (response.ok) {
          setReplies(response.data);
          setFirstOpen(false);
          setShowReplies(true);
        } else {
          Sentry.captureMessage(`Failed to fetch replies: ${response.error}`, "error");
        }
      } catch (error) {
        Sentry.captureException(error);
        setLoading(false);
      }
      setLoading(false);
    });
  };

  const hasMoreReplies = comment._count.replies > 1;
  const firstReply = replies[0];

  return (
    <>
      <Card
        shadow
        data-comment-id={activity.comment.id}
        size="medium"
        horizontal
        title={
          <div className="flex justify-between items-center gap-[1rem]">
            <div className="flex items-center gap-[1rem]">
              <Avatar
                {...getMaterialAvatarProps(activity.comment.user.name!)}
                alt={`Avatar ${activity.comment.user.name!}`}
                src={activity.comment.user.image!}
              />
              <Text inline variant={["sm", "bold"]} className={cx("text-nowrap", fr.cx("fr-mb-0"))}>
                {activity.comment.user.name}
              </Text>
            </div>
          </div>
        }
        desc={<MarkdownHooks {...reactMarkdownConfig}>{activity.comment.body}</MarkdownHooks>}
        endDetail={
          <span className="flex justify-between items-center gap-[1rem] w-full">
            <span>
              {activity.comment._count.replies > 0 ? `${activity.comment._count.replies} réponse(s)` : undefined}
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
              Répondre
            </Button>
          </span>
        }
      />

      <div className={cx(fr.cx("fr-mb-2w"), style.thread)}>
        {firstOpen ? (
          <ThreadEntity>
            {hasMoreReplies && (
              <Loader
                className={fr.cx("fr-mb-2w")}
                loading={loading}
                text={
                  <Button size="small" priority="tertiary no outline" type="button" onClick={handleFirstOpen}>
                    Voir les réponses précédentes
                  </Button>
                }
              ></Loader>
            )}
            <Reply reply={firstReply} />
          </ThreadEntity>
        ) : showReplies ? (
          <>
            {replies.map(reply => (
              <ThreadEntity key={reply.id}>
                <Reply reply={reply} />
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
                  Replier les réponses
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
                  Répondre
                </Button>
              </div>
            </ThreadEntity>
          </>
        ) : (
          <ThreadEntity actions>
            <Button size="small" priority="tertiary no outline" type="button" onClick={() => setShowReplies(true)}>
              Voir les {replies.length} réponses
            </Button>
          </ThreadEntity>
        )}
        {showInput && (
          <ThreadEntity id={`reply-input-${activity.comment.id}`}>
            {userId ? (
              <Alert
                small
                closable
                className={fr.cx("fr-pb-2v")}
                onClose={() => setShowInput(false)}
                severity="info"
                description={
                  <>
                    Vous devez être <Link href="/login">connecté</Link> pour répondre.
                  </>
                }
              />
            ) : (
              <>
                <HighlightedTextarea
                  hintText={
                    <>
                      <Link
                        href="https://www.markdownguide.org/basic-syntax/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Markdown
                      </Link>{" "}
                      est supporté
                    </>
                  }
                  label="Répondre"
                  classes={{ nativeInputOrTextArea: "resize-y" }}
                  previewButton
                  hightlighted
                  nativeTextAreaProps={{
                    onInput: e => setContent(e.currentTarget.value),
                  }}
                />
                <ButtonsGroup
                  alignment="right"
                  buttonsEquisized
                  inlineLayoutWhen="lg and up"
                  className={fr.cx("fr-mt-2w")}
                  buttons={[
                    {
                      children: "Annuler",
                      priority: "secondary",
                      size: "small",
                      onClick: () => setShowInput(false),
                    },
                    {
                      children: "Répondre",
                      priority: "primary",
                      size: "small",
                      type: "button",
                      onClick: () => {
                        // TODO: handle optimistic update
                        alert("Réponse envoyée (optimistic update not implemented yet)");
                        // void sendComment({
                        //   body: content,
                        //   postId: activity.comment.postId,
                        //   parentId: activity.comment.id,
                        //   tenantId: activity.comment.tenantId,
                        // }).then(() => setShowInput(false));
                      },
                    },
                  ]}
                />
              </>
            )}

            {(() => {
              setTimeout(() => {
                const el = document.querySelector(`#reply-input-${activity.comment.id}`);
                el?.scrollIntoView({ behavior: "smooth", block: "end" });
              }, 0);
              return null;
            })()}
          </ThreadEntity>
        )}
      </div>
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

export const Reply = ({ reply }: { reply: { user: User } & Comment }) => {
  const locale = useLocale();

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
          <div className="flex gap-[1rem]">
            <Avatar
              {...getMaterialAvatarProps(reply.user.name!)}
              alt={`Avatar ${reply.user.name!}`}
              src={reply.user.image!}
            />
            <Text inline variant={["sm", "bold"]} className={cx("text-nowrap", fr.cx("fr-mb-0"))}>
              {reply.user.name}
            </Text>
          </div>
          <Text inline variant={["xs", "light"]} className={cx("text-nowrap", fr.cx("fr-mb-0"))}>
            {formatDateHour(reply.createdAt, locale)}
          </Text>
        </div>
      }
      desc={<MarkdownHooks {...reactMarkdownConfig}>{reply.body}</MarkdownHooks>}
    />
  );
};

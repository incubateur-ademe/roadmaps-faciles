"use client";

import { fr } from "@codegouvfr/react-dsfr";
import Alert from "@codegouvfr/react-dsfr/Alert";
import Badge, { type BadgeProps } from "@codegouvfr/react-dsfr/Badge";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import Pagination from "@codegouvfr/react-dsfr/Pagination";
import { Select } from "@codegouvfr/react-dsfr/SelectNext";
import Tag from "@codegouvfr/react-dsfr/Tag";
import { cx } from "@codegouvfr/react-dsfr/tools/cx";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";

import { Icon } from "@/dsfr/base/Icon";
import { TableCustom, type TableCustomHeadColProps } from "@/dsfr/base/TableCustom";
import tableStyle from "@/dsfr/base/TableCustom.module.css";
import { type UserOnTenantWithUser } from "@/lib/repo/IUserOnTenantRepo";
import { UserRole, UserStatus } from "@/prisma/enums";
import { type ServerActionResponse } from "@/utils/next";

const PAGE_SIZE_OPTIONS = [5, 10, 25, 50] as const;
const DEFAULT_PAGE_SIZE = 10;

export interface MembersListActions {
  onRemove: (data: { userId: string }) => Promise<ServerActionResponse>;
  onUpdateRole: (data: { role: UserRole; userId: string }) => Promise<ServerActionResponse>;
  onUpdateStatus: (data: { status: UserStatus; userId: string }) => Promise<ServerActionResponse>;
}

export interface MembersListProps extends MembersListActions {
  currentUserId: string;
  members: UserOnTenantWithUser[];
  superAdminIds?: string[];
}

const STATUS_BADGE_SEVERITY: Record<UserStatus, BadgeProps["severity"]> = {
  ACTIVE: "success",
  BLOCKED: "warning",
  DELETED: "error",
};

const ROLE_WEIGHT: Record<UserRole, number> = {
  OWNER: 0,
  ADMIN: 1,
  MODERATOR: 2,
  USER: 3,
  INHERITED: 4,
};

const STATUS_WEIGHT: Record<UserStatus, number> = {
  ACTIVE: 0,
  BLOCKED: 1,
  DELETED: 2,
};

const ASSIGNABLE_ROLES = [UserRole.USER, UserRole.MODERATOR, UserRole.ADMIN, UserRole.OWNER] as const;

const FILTERABLE_ROLES = [UserRole.OWNER, UserRole.ADMIN, UserRole.MODERATOR, UserRole.USER] as const;

/** For INHERITED members, the effective role is the root (User) role. */
const getEffectiveRole = (member: UserOnTenantWithUser): UserRole =>
  member.role === UserRole.INHERITED ? member.user.role : member.role;

type SortDirection = string & TableCustomHeadColProps["orderDirection"];
type SortKey = "email" | "joinedAt" | "name" | "role" | "status";

export const MembersList = ({
  members: initialMembers,
  currentUserId,
  superAdminIds = [],
  onUpdateRole,
  onUpdateStatus,
  onRemove,
}: MembersListProps) => {
  const t = useTranslations("domainAdmin.users");
  const tr = useTranslations("roles");
  const ts = useTranslations("memberStatus");
  const tc = useTranslations("common");
  const locale = useLocale();
  const dateFormatter = useMemo(() => new Intl.DateTimeFormat(locale, { dateStyle: "medium" }), [locale]);

  const ROLE_LABELS: Record<UserRole, string> = {
    OWNER: tr("OWNER"),
    ADMIN: tr("ADMIN"),
    MODERATOR: tr("MODERATOR"),
    USER: tr("USER"),
    INHERITED: tr("INHERITED"),
  };

  const STATUS_LABELS: Record<UserStatus, string> = {
    ACTIVE: ts("ACTIVE"),
    BLOCKED: ts("BLOCKED"),
    DELETED: ts("DELETED"),
  };

  const [members, setMembers] = useState(initialMembers);
  const [error, setError] = useState<null | string>(null);
  const [loadingId, setLoadingId] = useState<null | string>(null);
  const [copiedId, setCopiedId] = useState<null | string>(null);
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDirection>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<null | number>(DEFAULT_PAGE_SIZE);
  const [filterRole, setFilterRole] = useState<null | UserRole>(null);
  const [filterStatus, setFilterStatus] = useState<null | UserStatus>(null);

  const ownerCount = useMemo(
    () => members.filter(m => m.role === UserRole.OWNER && m.status === UserStatus.ACTIVE).length,
    [members],
  );
  const isLastOwner = (member: UserOnTenantWithUser) => member.role === UserRole.OWNER && ownerCount <= 1;

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(prev => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setCurrentPage(1);
  };

  const filteredMembers = useMemo(() => {
    return members.filter(m => {
      if (filterRole && getEffectiveRole(m) !== filterRole) return false;
      if (filterStatus && m.status !== filterStatus) return false;
      return true;
    });
  }, [members, filterRole, filterStatus]);

  const sortedMembers = useMemo(() => {
    return [...filteredMembers].sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "name":
          cmp = (a.user.name ?? "").localeCompare(b.user.name ?? "");
          break;
        case "email":
          cmp = a.user.email.localeCompare(b.user.email);
          break;
        case "role":
          cmp = ROLE_WEIGHT[getEffectiveRole(a)] - ROLE_WEIGHT[getEffectiveRole(b)];
          break;
        case "status":
          cmp = STATUS_WEIGHT[a.status] - STATUS_WEIGHT[b.status];
          break;
        case "joinedAt":
          cmp = new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime();
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filteredMembers, sortKey, sortDir]);

  const totalPages = pageSize ? Math.ceil(sortedMembers.length / pageSize) : 1;
  const paginatedMembers = pageSize
    ? sortedMembers.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : sortedMembers;

  const copyTimeoutRef = useRef<null | ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    };
  }, []);

  const handleCopyId = (userId: string) => {
    void navigator.clipboard.writeText(userId);
    setCopiedId(userId);
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    copyTimeoutRef.current = setTimeout(() => setCopiedId(null), 1500);
  };

  const handleRoleChange = async (userId: string, role: UserRole) => {
    setLoadingId(userId);
    setError(null);
    const result = await onUpdateRole({ userId, role });
    if (result.ok) {
      setMembers(prev => prev.map(m => (m.userId === userId ? { ...m, role } : m)));
    } else if (!result.ok) {
      setError(result.error);
    }
    setLoadingId(null);
  };

  const handleToggleStatus = async (userId: string, currentStatus: UserStatus) => {
    const newStatus = currentStatus === UserStatus.BLOCKED ? UserStatus.ACTIVE : UserStatus.BLOCKED;
    setLoadingId(userId);
    setError(null);
    const result = await onUpdateStatus({ userId, status: newStatus });
    if (result.ok) {
      setMembers(prev => prev.map(m => (m.userId === userId ? { ...m, status: newStatus } : m)));
    } else if (!result.ok) {
      setError(result.error);
    }
    setLoadingId(null);
  };

  const handleRemove = async (userId: string) => {
    if (!confirm(t("removeConfirm"))) return;
    setLoadingId(userId);
    setError(null);
    const result = await onRemove({ userId });
    if (result.ok) {
      setMembers(prev => prev.filter(m => m.userId !== userId));
    } else if (!result.ok) {
      setError(result.error);
    }
    setLoadingId(null);
  };

  const isSelf = (member: UserOnTenantWithUser) => member.userId === currentUserId;

  const sortHeader = (label: string, key: SortKey): TableCustomHeadColProps => ({
    children: label,
    onClick: () => toggleSort(key),
    orderDirection: sortKey === key && sortDir,
  });

  return (
    <>
      {error && (
        <Alert
          className={fr.cx("fr-mb-2w")}
          severity="error"
          title={tc("error")}
          description={error}
          closable
          onClose={() => setError(null)}
        />
      )}

      <div className={cx(fr.cx("fr-mb-2w"), "flex items-end justify-between flex-wrap gap-4")}>
        <p className={fr.cx("fr-mb-1v")}>
          {t("memberCount", {
            filtered: filteredMembers.length === members.length ? "same" : String(filteredMembers.length),
            total: members.length,
          })}
        </p>
        <div className="flex items-end flex-wrap gap-4 [&_.fr-select-group]:!mb-0">
          <Select
            label={t("role")}
            options={[
              { value: "all", label: tc("all") },
              ...FILTERABLE_ROLES.map(role => ({ value: role, label: ROLE_LABELS[role] })),
            ]}
            nativeSelectProps={{
              value: filterRole ?? "all",
              onChange: e => {
                setFilterRole(e.target.value === "all" ? null : (e.target.value as UserRole));
                setCurrentPage(1);
              },
            }}
          />
          <Select
            label={t("status")}
            options={[
              { value: "all", label: tc("all") },
              ...Object.values(UserStatus).map(status => ({ value: status, label: STATUS_LABELS[status] })),
            ]}
            nativeSelectProps={{
              value: filterStatus ?? "all",
              onChange: e => {
                setFilterStatus(e.target.value === "all" ? null : (e.target.value as UserStatus));
                setCurrentPage(1);
              },
            }}
          />
          <Select
            className="ml-auto"
            label={tc("perPage")}
            options={[
              ...PAGE_SIZE_OPTIONS.map(size => ({ value: String(size), label: String(size) })),
              { value: "all", label: tc("all") },
            ]}
            nativeSelectProps={{
              value: pageSize ? String(pageSize) : "all",
              onChange: e => {
                const val = e.target.value;
                setPageSize(val === "all" ? null : Number(val));
                setCurrentPage(1);
              },
            }}
          />
        </div>
      </div>

      {members.length > 0 ? (
        <>
          <TableCustom
            classes={{
              "col-0": tableStyle.colShrink,
              "col-3": tableStyle.colShrink,
              "col-6": tableStyle.colShrink,
            }}
            header={[
              { children: t("id") },
              sortHeader(t("name"), "name"),
              sortHeader(t("email"), "email"),
              sortHeader(t("role"), "role"),
              sortHeader(t("status"), "status"),
              sortHeader(t("joinedAt"), "joinedAt"),
              { children: tc("actions") },
            ]}
            body={paginatedMembers.map(member => [
              {
                children: (
                  <Icon
                    icon={copiedId === member.userId ? "fr-icon-check-line" : "fr-icon-file-text-line"}
                    onClick={() => handleCopyId(member.userId)}
                    size="sm"
                    title={member.userId}
                  />
                ),
              },
              {
                children: (
                  <span className="flex items-center gap-2">
                    {member.user.name ?? "—"}
                    {isSelf(member) && <Tag small>{t("you")}</Tag>}
                    {superAdminIds.includes(member.userId) && <Tag small>{t("superAdmin")}</Tag>}
                  </span>
                ),
              },
              { children: member.user.email },
              {
                children:
                  isLastOwner(member) || isSelf(member) || member.role === UserRole.INHERITED ? (
                    <span className="flex items-center gap-2">
                      <Badge as="span" small noIcon severity="info">
                        {ROLE_LABELS[getEffectiveRole(member)]}
                      </Badge>
                      {member.role === UserRole.INHERITED && (
                        <Badge as="span" small noIcon severity="new">
                          {t("inherited")}
                        </Badge>
                      )}
                    </span>
                  ) : (
                    <Select
                      className="min-w-48"
                      label={<span className="sr-only">{t("role")}</span>}
                      options={ASSIGNABLE_ROLES.map(role => ({ value: role, label: ROLE_LABELS[role] }))}
                      nativeSelectProps={{
                        value: member.role,
                        onChange: e => void handleRoleChange(member.userId, e.target.value as UserRole),
                      }}
                      disabled={loadingId === member.userId}
                    />
                  ),
              },
              {
                children: (
                  <Badge as="span" small noIcon severity={STATUS_BADGE_SEVERITY[member.status]}>
                    {STATUS_LABELS[member.status]}
                  </Badge>
                ),
              },
              { children: dateFormatter.format(new Date(member.joinedAt)) },
              {
                children:
                  isLastOwner(member) || isSelf(member) ? null : (
                    <ButtonsGroup
                      inlineLayoutWhen="always"
                      buttonsSize="small"
                      className="min-w-64"
                      buttons={[
                        {
                          children: t("remove"),
                          priority: "secondary",
                          disabled: loadingId === member.userId,
                          onClick: () => void handleRemove(member.userId),
                        },
                        {
                          children: member.status === UserStatus.BLOCKED ? t("unblock") : t("block"),
                          priority: "tertiary",
                          disabled: loadingId === member.userId,
                          onClick: () => void handleToggleStatus(member.userId, member.status),
                        },
                      ]}
                    />
                  ),
              },
            ])}
          />
          <Pagination
            className={fr.cx("fr-mt-2w")}
            count={totalPages}
            defaultPage={currentPage}
            getPageLinkProps={page => ({
              href: "#",
              onClick: (e: React.MouseEvent) => {
                e.preventDefault();
                setCurrentPage(page);
              },
            })}
          />
        </>
      ) : (
        <Alert severity="info" title={t("noMembers")} description={t("noMembersDescription")} small />
      )}
    </>
  );
};

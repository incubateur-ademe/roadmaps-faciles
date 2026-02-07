"use client";

import { fr } from "@codegouvfr/react-dsfr";
import Alert from "@codegouvfr/react-dsfr/Alert";
import Badge, { type BadgeProps } from "@codegouvfr/react-dsfr/Badge";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import Pagination from "@codegouvfr/react-dsfr/Pagination";
import { Select } from "@codegouvfr/react-dsfr/SelectNext";
import Tooltip from "@codegouvfr/react-dsfr/Tooltip";
import { useEffect, useMemo, useRef, useState } from "react";

import { Icon } from "@/dsfr/base/Icon";
import { TableCustom } from "@/dsfr/base/TableCustom";
import tableStyle from "@/dsfr/base/TableCustom.module.css";
import { type UserOnTenantWithUser } from "@/lib/repo/IUserOnTenantRepo";
import { UserRole, UserStatus } from "@/prisma/enums";

import { removeMember, updateMemberRole, updateMemberStatus } from "./actions";

const PAGE_SIZE = 20;

interface MembersListProps {
  currentUserId: string;
  members: UserOnTenantWithUser[];
}

const dateFormatter = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" });

const ROLE_LABELS: Record<UserRole, string> = {
  OWNER: "Propriétaire",
  ADMIN: "Administrateur",
  MODERATOR: "Modérateur",
  USER: "Utilisateur",
  INHERITED: "Hérité",
};

const STATUS_LABELS: Record<UserStatus, string> = {
  ACTIVE: "Actif",
  BLOCKED: "Bloqué",
  DELETED: "Supprimé",
};

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

const ASSIGNABLE_ROLES = [UserRole.USER, UserRole.MODERATOR, UserRole.ADMIN] as const;
type AssignableRole = (typeof ASSIGNABLE_ROLES)[number];

type SortDirection = "asc" | "desc";
type SortKey = "email" | "joinedAt" | "name" | "role" | "status";

export const MembersList = ({ members: initialMembers, currentUserId }: MembersListProps) => {
  const [members, setMembers] = useState(initialMembers);
  const [error, setError] = useState<null | string>(null);
  const [loadingId, setLoadingId] = useState<null | string>(null);
  const [copiedId, setCopiedId] = useState<null | string>(null);
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDirection>("asc");
  const [currentPage, setCurrentPage] = useState(1);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(prev => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setCurrentPage(1);
  };

  const sortedMembers = useMemo(() => {
    return [...members].sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "name":
          cmp = (a.user.name ?? "").localeCompare(b.user.name ?? "");
          break;
        case "email":
          cmp = a.user.email.localeCompare(b.user.email);
          break;
        case "role":
          cmp = ROLE_WEIGHT[a.role] - ROLE_WEIGHT[b.role];
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
  }, [members, sortKey, sortDir]);

  const totalPages = Math.ceil(sortedMembers.length / PAGE_SIZE);
  const paginatedMembers = sortedMembers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

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
    const result = await updateMemberRole({ userId, role });
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
    const result = await updateMemberStatus({ userId, status: newStatus });
    if (result.ok) {
      setMembers(prev => prev.map(m => (m.userId === userId ? { ...m, status: newStatus } : m)));
    } else if (!result.ok) {
      setError(result.error);
    }
    setLoadingId(null);
  };

  const handleRemove = async (userId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir retirer ce membre ?")) return;
    setLoadingId(userId);
    setError(null);
    const result = await removeMember({ userId });
    if (result.ok) {
      setMembers(prev => prev.filter(m => m.userId !== userId));
    } else if (!result.ok) {
      setError(result.error);
    }
    setLoadingId(null);
  };

  const isOwner = (member: UserOnTenantWithUser) => member.role === UserRole.OWNER;
  const isSelf = (member: UserOnTenantWithUser) => member.userId === currentUserId;

  const sortHeader = (label: string, key: SortKey) => ({
    children: label,
    onClick: () => toggleSort(key),
    orderDirection: (sortKey === key && sortDir) as "asc" | "desc" | false,
  });

  return (
    <>
      {error && (
        <Alert
          className={fr.cx("fr-mb-2w")}
          severity="error"
          title="Erreur"
          description={error}
          closable
          onClose={() => setError(null)}
        />
      )}

      <p className={fr.cx("fr-mb-2w")}>{members.length} membre(s)</p>

      {members.length > 0 ? (
        <>
          <TableCustom
            classes={{
              "col-0": tableStyle.colShrink,
              "col-3": tableStyle.colShrink,
              "col-6": tableStyle.colShrink,
            }}
            header={[
              { children: "ID" },
              sortHeader("Nom", "name"),
              sortHeader("Email", "email"),
              sortHeader("Rôle", "role"),
              sortHeader("Statut", "status"),
              sortHeader("Date d'ajout", "joinedAt"),
              { children: "Actions" },
            ]}
            body={paginatedMembers.map(member => [
              {
                children: (
                  <Tooltip title={member.userId}>
                    <Icon
                      icon={copiedId === member.userId ? "fr-icon-check-line" : "fr-icon-file-text-line"}
                      onClick={() => handleCopyId(member.userId)}
                      size="sm"
                    />
                  </Tooltip>
                ),
              },
              { children: member.user.name ?? "—" },
              { children: member.user.email },
              {
                children:
                  isOwner(member) || isSelf(member) ? (
                    <Badge as="span" small noIcon severity="info">
                      {ROLE_LABELS[member.role]}
                    </Badge>
                  ) : (
                    <Select
                      label={<span className="sr-only">Rôle</span>}
                      options={ASSIGNABLE_ROLES.map(role => ({ value: role, label: ROLE_LABELS[role] }))}
                      nativeSelectProps={{
                        value: member.role as AssignableRole,
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
                  isOwner(member) || isSelf(member) ? null : (
                    <ButtonsGroup
                      inlineLayoutWhen="sm and up"
                      buttonsSize="small"
                      alignment="right"
                      buttons={[
                        {
                          children: member.status === UserStatus.BLOCKED ? "Débloquer" : "Bloquer",
                          priority: "secondary",
                          disabled: loadingId === member.userId,
                          onClick: () => void handleToggleStatus(member.userId, member.status),
                        },
                        {
                          children: "Retirer",
                          priority: "tertiary no outline",
                          disabled: loadingId === member.userId,
                          onClick: () => void handleRemove(member.userId),
                        },
                      ]}
                    />
                  ),
              },
            ])}
          />
          {totalPages > 1 && (
            <Pagination
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
          )}
        </>
      ) : (
        <Alert severity="info" title="Aucun membre" description="Aucun membre dans ce tenant." small />
      )}
    </>
  );
};

"use client";

import { fr } from "@codegouvfr/react-dsfr";
import Alert from "@codegouvfr/react-dsfr/Alert";
import Badge, { type BadgeProps } from "@codegouvfr/react-dsfr/Badge";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import Pagination from "@codegouvfr/react-dsfr/Pagination";
import { Select } from "@codegouvfr/react-dsfr/SelectNext";
import Tag from "@codegouvfr/react-dsfr/Tag";
import { cx } from "@codegouvfr/react-dsfr/tools/cx";
import { useMemo, useState } from "react";

import { TableCustom, type TableCustomHeadColProps } from "@/dsfr/base/TableCustom";
import tableStyle from "@/dsfr/base/TableCustom.module.css";
import { type UserWithTenantCount } from "@/lib/repo/IUserRepo";
import { UserRole, UserStatus } from "@/prisma/enums";

import { updateUserRole, updateUserStatus } from "./actions";

const PAGE_SIZE_OPTIONS = [5, 10, 25, 50] as const;
const DEFAULT_PAGE_SIZE = 10;

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

const FILTERABLE_ROLES = [UserRole.ADMIN, UserRole.MODERATOR, UserRole.USER] as const;

type SortDirection = string & TableCustomHeadColProps["orderDirection"];
type SortKey = "createdAt" | "email" | "name" | "role" | "status" | "tenants";

interface GlobalUsersListProps {
  currentUserId: string;
  superAdminIds: string[];
  users: UserWithTenantCount[];
}

export const GlobalUsersList = ({ users: initialUsers, currentUserId, superAdminIds }: GlobalUsersListProps) => {
  const [users, setUsers] = useState(initialUsers);
  const [error, setError] = useState<null | string>(null);
  const [loadingId, setLoadingId] = useState<null | string>(null);
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDirection>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<null | number>(DEFAULT_PAGE_SIZE);
  const [filterRole, setFilterRole] = useState<null | UserRole>(null);
  const [filterStatus, setFilterStatus] = useState<null | UserStatus>(null);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(prev => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setCurrentPage(1);
  };

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      if (filterRole && u.role !== filterRole) return false;
      if (filterStatus && u.status !== filterStatus) return false;
      return true;
    });
  }, [users, filterRole, filterStatus]);

  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "name":
          cmp = (a.name ?? "").localeCompare(b.name ?? "");
          break;
        case "email":
          cmp = a.email.localeCompare(b.email);
          break;
        case "role":
          cmp = ROLE_WEIGHT[a.role] - ROLE_WEIGHT[b.role];
          break;
        case "status":
          cmp = STATUS_WEIGHT[a.status] - STATUS_WEIGHT[b.status];
          break;
        case "tenants":
          cmp = a._count.memberships - b._count.memberships;
          break;
        case "createdAt":
          cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filteredUsers, sortKey, sortDir]);

  const totalPages = pageSize ? Math.ceil(sortedUsers.length / pageSize) : 1;
  const paginatedUsers = pageSize
    ? sortedUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : sortedUsers;

  const handleRoleChange = async (userId: string, role: UserRole) => {
    setLoadingId(userId);
    setError(null);
    const result = await updateUserRole({ userId, role });
    if (result.ok) {
      setUsers(prev => prev.map(u => (u.id === userId ? { ...u, role } : u)));
    } else if (!result.ok) {
      setError(result.error);
    }
    setLoadingId(null);
  };

  const handleToggleStatus = async (userId: string, currentStatus: UserStatus) => {
    const newStatus = currentStatus === UserStatus.BLOCKED ? UserStatus.ACTIVE : UserStatus.BLOCKED;
    setLoadingId(userId);
    setError(null);
    const result = await updateUserStatus({ userId, status: newStatus });
    if (result.ok) {
      setUsers(prev => prev.map(u => (u.id === userId ? { ...u, status: newStatus } : u)));
    } else if (!result.ok) {
      setError(result.error);
    }
    setLoadingId(null);
  };

  const isSelf = (userId: string) => userId === currentUserId;

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
          title="Erreur"
          description={error}
          closable
          onClose={() => setError(null)}
        />
      )}

      <div className={cx(fr.cx("fr-mb-2w"), "flex items-end justify-between flex-wrap gap-4")}>
        <p className={fr.cx("fr-mb-1v")}>
          {filteredUsers.length === users.length
            ? `${users.length} utilisateur(s)`
            : `${filteredUsers.length} / ${users.length} utilisateur(s)`}
        </p>
        <div className="flex items-end flex-wrap gap-4 [&_.fr-select-group]:!mb-0">
          <Select
            label="Rôle"
            options={[
              { value: "all", label: "Tous" },
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
            label="Statut"
            options={[
              { value: "all", label: "Tous" },
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
            label="Par page"
            options={[
              ...PAGE_SIZE_OPTIONS.map(size => ({ value: String(size), label: String(size) })),
              { value: "all", label: "Tous" },
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

      {users.length > 0 ? (
        <>
          <TableCustom
            classes={{
              "col-5": tableStyle.colShrink,
            }}
            header={[
              sortHeader("Nom", "name"),
              sortHeader("Email", "email"),
              sortHeader("Rôle", "role"),
              sortHeader("Statut", "status"),
              sortHeader("Tenants", "tenants"),
              sortHeader("Inscrit le", "createdAt"),
              { children: "Actions" },
            ]}
            body={paginatedUsers.map(user => [
              {
                children: (
                  <span className="flex items-center gap-2">
                    {user.name ?? "—"}
                    {isSelf(user.id) && <Tag small>Vous</Tag>}
                    {superAdminIds.includes(user.id) && <Tag small>Super Admin</Tag>}
                  </span>
                ),
              },
              { children: user.email },
              {
                children: isSelf(user.id) ? (
                  <Badge as="span" small noIcon severity="info">
                    {ROLE_LABELS[user.role]}
                  </Badge>
                ) : (
                  <Select
                    className="min-w-48"
                    label={<span className="sr-only">Rôle</span>}
                    options={ASSIGNABLE_ROLES.map(role => ({ value: role, label: ROLE_LABELS[role] }))}
                    nativeSelectProps={{
                      value: user.role as AssignableRole,
                      onChange: e => void handleRoleChange(user.id, e.target.value as UserRole),
                    }}
                    disabled={loadingId === user.id}
                  />
                ),
              },
              {
                children: (
                  <Badge as="span" small noIcon severity={STATUS_BADGE_SEVERITY[user.status]}>
                    {STATUS_LABELS[user.status]}
                  </Badge>
                ),
              },
              { children: user._count.memberships },
              { children: dateFormatter.format(new Date(user.createdAt)) },
              {
                children: isSelf(user.id) ? null : (
                  <ButtonsGroup
                    inlineLayoutWhen="always"
                    buttonsSize="small"
                    buttons={[
                      {
                        children: "Éditer",
                        priority: "secondary",
                        linkProps: { href: `/admin/users/${user.id}` },
                      },
                      {
                        children: user.status === UserStatus.BLOCKED ? "Débloquer" : "Bloquer",
                        priority: "tertiary",
                        disabled: loadingId === user.id,
                        onClick: () => void handleToggleStatus(user.id, user.status),
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
        <Alert severity="info" title="Aucun utilisateur" description="Aucun utilisateur trouvé." small />
      )}
    </>
  );
};

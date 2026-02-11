"use client";

import { fr } from "@codegouvfr/react-dsfr";
import Alert from "@codegouvfr/react-dsfr/Alert";
import Badge from "@codegouvfr/react-dsfr/Badge";
import Button from "@codegouvfr/react-dsfr/Button";
import { Select } from "@codegouvfr/react-dsfr/SelectNext";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { Grid, GridCol } from "@/dsfr";
import { EmailAutocomplete } from "@/dsfr/base/EmailAutocomplete";
import { TableCustom } from "@/dsfr/base/TableCustom";
import { type Invitation } from "@/prisma/client";
import { UserRole } from "@/prisma/enums";
import { type InvitationRole } from "@/useCases/invitations/SendInvitation";

import { revokeInvitation, searchUsersForInvitation, sendInvitation } from "./actions";

interface InvitationsListProps {
  invitations: Invitation[];
  isOwner: boolean;
}

const INVITE_ROLES = [UserRole.USER, UserRole.MODERATOR, UserRole.ADMIN] as const;
const INVITE_ROLES_WITH_OWNER = [UserRole.USER, UserRole.MODERATOR, UserRole.ADMIN, UserRole.OWNER] as const;

export const InvitationsList = ({ invitations: initialInvitations, isOwner }: InvitationsListProps) => {
  const t = useTranslations("domainAdmin.invitations");
  const tr = useTranslations("roles");
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

  const [invitations, setInvitations] = useState(initialInvitations);
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<InvitationRole>("USER");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<null | string>(null);

  const availableRoles = isOwner ? INVITE_ROLES_WITH_OWNER : INVITE_ROLES;

  const handleSend = async () => {
    setSending(true);
    setError(null);
    const result = await sendInvitation({ email: newEmail, role: newRole });
    if (result.ok && result.data) {
      setInvitations([result.data, ...invitations]);
      setNewEmail("");
      setNewRole("USER");
    } else if (!result.ok) {
      setError(result.error);
    }
    setSending(false);
  };

  const handleRevoke = async (id: number) => {
    if (!confirm(tc("areYouSure"))) return;
    const result = await revokeInvitation({ id });
    if (result.ok) {
      setInvitations(invitations.filter(i => i.id !== id));
      setError(null);
    } else if (!result.ok) {
      setError(result.error);
    }
  };

  return (
    <div>
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

      {invitations.length > 0 ? (
        <TableCustom
          className={fr.cx("fr-mb-3w")}
          header={[
            { children: t("email") },
            { children: t("role") },
            { children: t("status") },
            { children: t("createdAt") },
            { children: tc("actions") },
          ]}
          body={invitations.map(invitation => [
            { children: invitation.email },
            {
              children: (
                <Badge as="span" small noIcon severity="info">
                  {ROLE_LABELS[invitation.role]}
                </Badge>
              ),
            },
            {
              children: invitation.acceptedAt ? (
                <Badge as="span" noIcon severity="success">
                  {t("accepted")}
                </Badge>
              ) : (
                <Badge as="span" noIcon severity="info">
                  {t("pending")}
                </Badge>
              ),
            },
            { children: dateFormatter.format(new Date(invitation.createdAt)) },
            {
              children: !invitation.acceptedAt ? (
                <Button size="small" priority="secondary" onClick={() => void handleRevoke(invitation.id)}>
                  {tc("revoke")}
                </Button>
              ) : null,
            },
          ])}
        />
      ) : (
        <Alert
          className={fr.cx("fr-mb-3w")}
          severity="info"
          title={t("noInvitations")}
          description={t("noInvitationsDescription")}
          small
        />
      )}

      <h2>{t("sendInvitation")}</h2>
      <Grid haveGutters valign="bottom" className="[&_.fr-select-group]:!mb-0">
        <GridCol md={6}>
          <EmailAutocomplete
            clearOnSelect={false}
            label={t("email")}
            searchAction={searchUsersForInvitation}
            value={newEmail}
            onSelectAction={setNewEmail}
          />
        </GridCol>
        <GridCol md={3}>
          <Select
            label={t("role")}
            options={availableRoles.map(role => ({ value: role, label: ROLE_LABELS[role] }))}
            nativeSelectProps={{
              value: newRole,
              onChange: e => setNewRole(e.target.value),
            }}
          />
        </GridCol>
        <GridCol md={3}>
          <Button className={fr.cx("fr-mb-3w")} onClick={() => void handleSend()} disabled={!newEmail || sending}>
            {sending ? t("sending") : t("send")}
          </Button>
        </GridCol>
      </Grid>
    </div>
  );
};

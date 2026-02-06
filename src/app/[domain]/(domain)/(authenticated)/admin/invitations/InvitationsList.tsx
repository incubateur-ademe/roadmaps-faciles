"use client";

import { fr } from "@codegouvfr/react-dsfr";
import Alert from "@codegouvfr/react-dsfr/Alert";
import Button from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";
import { useState } from "react";

import { TableCustom } from "@/dsfr/base/TableCustom";
import { type Invitation } from "@/prisma/client";

import { revokeInvitation, sendInvitation } from "./actions";

interface InvitationsListProps {
  invitations: Invitation[];
}

const dateFormatter = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" });

export const InvitationsList = ({ invitations: initialInvitations }: InvitationsListProps) => {
  const [invitations, setInvitations] = useState(initialInvitations);
  const [newEmail, setNewEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<null | string>(null);

  const handleSend = async () => {
    setSending(true);
    setError(null);
    const result = await sendInvitation({ email: newEmail });
    if (result.ok && result.data) {
      setInvitations([result.data, ...invitations]);
      setNewEmail("");
    } else if (!result.ok) {
      setError(result.error);
    }
    setSending(false);
  };

  const handleRevoke = async (id: number) => {
    if (!confirm("Êtes-vous sûr ?")) return;
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
          title="Erreur"
          description={error}
          closable
          onClose={() => setError(null)}
        />
      )}

      {invitations.length > 0 ? (
        <TableCustom
          className={fr.cx("fr-mb-3w")}
          header={[
            { children: "Email" },
            { children: "Statut" },
            { children: "Date de création" },
            { children: "Actions" },
          ]}
          body={invitations.map(invitation => [
            { children: invitation.email },
            {
              children: invitation.acceptedAt ? (
                <span className={fr.cx("fr-badge", "fr-badge--success")}>Acceptée</span>
              ) : (
                <span className={fr.cx("fr-badge", "fr-badge--info")}>En attente</span>
              ),
            },
            { children: dateFormatter.format(new Date(invitation.createdAt)) },
            {
              children: !invitation.acceptedAt ? (
                <Button size="small" priority="secondary" onClick={() => void handleRevoke(invitation.id)}>
                  Révoquer
                </Button>
              ) : null,
            },
          ])}
        />
      ) : (
        <Alert
          className={fr.cx("fr-mb-3w")}
          severity="info"
          title="Aucune invitation"
          description="Aucune invitation n'a été envoyée pour ce tenant."
          small
        />
      )}

      <h2>Envoyer une invitation</h2>
      <Input
        label="Email"
        nativeInputProps={{
          type: "email",
          value: newEmail,
          onChange: e => setNewEmail(e.target.value),
          autoComplete: "off",
          name: "email",
        }}
      />
      <Button onClick={() => void handleSend()} disabled={!newEmail || sending}>
        {sending ? "Envoi…" : "Envoyer"}
      </Button>
    </div>
  );
};

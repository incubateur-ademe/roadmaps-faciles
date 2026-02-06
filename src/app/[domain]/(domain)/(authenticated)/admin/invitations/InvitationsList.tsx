"use client";

import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";
import { useState } from "react";

import { type Invitation } from "@/prisma/client";

import { revokeInvitation, sendInvitation } from "./actions";

interface InvitationsListProps {
  invitations: Invitation[];
}

export const InvitationsList = ({ invitations: initialInvitations }: InvitationsListProps) => {
  const [invitations, setInvitations] = useState(initialInvitations);
  const [newEmail, setNewEmail] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    setSending(true);
    const result = await sendInvitation({ email: newEmail });
    if (result.ok && result.data) {
      setInvitations([result.data, ...invitations]);
      setNewEmail("");
    } else if (!result.ok) {
      alert(result.error);
    }
    setSending(false);
  };

  const handleRevoke = async (id: number) => {
    if (!confirm("Êtes-vous sûr ?")) return;
    const result = await revokeInvitation({ id });
    if (result.ok) {
      setInvitations(invitations.filter(i => i.id !== id));
    } else if (!result.ok) {
      alert(result.error);
    }
  };

  return (
    <div>
      <table className={fr.cx("fr-table")}>
        <thead>
          <tr>
            <th>Email</th>
            <th>Statut</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {invitations.map(invitation => (
            <tr key={invitation.id}>
              <td>{invitation.email}</td>
              <td>
                {invitation.acceptedAt ? (
                  <span className={fr.cx("fr-badge", "fr-badge--success")}>Acceptée</span>
                ) : (
                  <span className={fr.cx("fr-badge", "fr-badge--info")}>En attente</span>
                )}
              </td>
              <td>{new Date(invitation.createdAt).toLocaleDateString()}</td>
              <td>
                {!invitation.acceptedAt && (
                  <Button size="small" priority="secondary" onClick={() => void handleRevoke(invitation.id)}>
                    Révoquer
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Envoyer une invitation</h2>
      <Input label="Email" nativeInputProps={{ value: newEmail, onChange: e => setNewEmail(e.target.value) }} />
      <Button onClick={() => void handleSend()} disabled={!newEmail || sending}>
        {sending ? "Envoi..." : "Envoyer"}
      </Button>
    </div>
  );
};

"use client";

import { useEffect, useRef } from "react";

import { bridgeSignIn } from "./bridgeSignIn";

export interface BridgeAutoLoginProps {
  token: string;
}

export const BridgeAutoLogin = ({ token }: BridgeAutoLoginProps) => {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    formRef.current?.requestSubmit();
  }, []);

  return (
    <form ref={formRef} action={bridgeSignIn}>
      <input type="hidden" name="token" value={token} />
      <p>Connexion en cours...</p>
    </form>
  );
};

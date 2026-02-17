import { LoginFormClient, type LoginFormClientProps } from "./LoginFormClient";

export type LoginFormProps = {
  domain?: string;
} & LoginFormClientProps;

export const LoginForm = ({ loginWithEmail, defaultEmail }: LoginFormProps) => {
  return <LoginFormClient loginWithEmail={loginWithEmail} defaultEmail={defaultEmail} />;
};

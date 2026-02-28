import { RootSystemMessage, VALID_ROOT_SYSTEM_CODES } from "../RootSystemMessage";

interface ErrorPageProps {
  searchParams: Promise<{
    source?: `login-${"AccessDenied" | "AuthorizedCallbackError"}`;
  }>;
}

const Error = async ({ searchParams }: ErrorPageProps) => {
  const { source } = await searchParams;
  return <RootSystemMessage code={source && VALID_ROOT_SYSTEM_CODES.has(source) ? source : "500"} />;
};

export default Error;

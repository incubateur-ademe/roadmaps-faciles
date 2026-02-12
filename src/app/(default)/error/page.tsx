import { SystemMessageDisplay, VALID_SYSTEM_CODES } from "../../SystemMessageDisplay";

interface ErrorPageProps {
  searchParams: Promise<{
    source?: `login-${"AccessDenied" | "AuthorizedCallbackError"}`;
  }>;
}

const Error = async ({ searchParams }: ErrorPageProps) => {
  const { source } = await searchParams;
  return <SystemMessageDisplay code={source && VALID_SYSTEM_CODES.has(source) ? source : "500"} />;
};

export default Error;

import { isBrowser } from "@/utils/browser";
import { illogical } from "@/utils/error";

import { getInstanceFn } from "./getInstance";
import { CurrentService } from "./server/CurrentService";

const isomorphicServices = {} as const;
export const getService = getInstanceFn(isomorphicServices);

export const getServerService = getInstanceFn(
  {
    ...isomorphicServices,
    current: CurrentService,
  } as const,
  () => isBrowser && illogical("Should not be called on the client side"),
);

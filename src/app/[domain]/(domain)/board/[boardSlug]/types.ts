import { type FrIconClassName } from "@codegouvfr/react-dsfr";

export const ORDER_ENUM = {
  trending: "trending",
  top: "top",
  new: "new",
} as const;
export const ORDER_OPTIONS = {
  trending: {
    label: "Tendance",
    icon: "fr-icon-star-s-line",
    default: true,
  },
  top: {
    label: "Top",
    icon: "fr-icon-arrow-right-up-line",
    default: false,
  },
  new: {
    label: "Nouveau",
    icon: "fr-icon-sparkling-2-line",
    default: false,
  },
} as const satisfies Record<Order, { default: boolean; icon: FrIconClassName; label: string }>;
export const defaultOrder = Object.keys(ORDER_OPTIONS).find(key => ORDER_OPTIONS[key as Order].default) as Order;
export type Order = keyof typeof ORDER_ENUM;

export const VIEW_ENUM = {
  cards: "cards",
  list: "list",
} as const;
export type View = keyof typeof VIEW_ENUM;
export const defaultView: View = "cards";

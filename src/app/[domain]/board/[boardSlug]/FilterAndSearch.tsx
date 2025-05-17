"use client";

import { fr, type FrIconClassName } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import SearchBar from "@codegouvfr/react-dsfr/SearchBar";
import { SegmentedControl, type SegmentedControlProps } from "@codegouvfr/react-dsfr/SegmentedControl";
import { cx } from "@codegouvfr/react-dsfr/tools/cx";
import { useRouter } from "next/navigation";

export const ORDER_ENUM = {
  trending: "trending",
  top: "top",
  new: "new",
} as const;
const ORDER_OPTIONS = {
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

export interface FilterAndSearchProps {
  order: Order;
}

export const FilterAndSearch = ({ order }: FilterAndSearchProps) => {
  const router = useRouter();
  const handleOrderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedOrder = event.target.value as Order;
    router.push(`?order=${selectedOrder}`);
  };

  return (
    <>
      <SegmentedControl
        legend="Trier par"
        hideLegend
        small
        className={cx(fr.cx("fr-mb-2w"), "w-full")}
        classes={{
          elements: "grow justify-between",
        }}
        name="order"
        segments={
          Object.entries(ORDER_OPTIONS).map<SegmentedControlProps.Segment>(([key, { label, icon }]) => ({
            iconId: icon,
            label,
            nativeInputProps: {
              value: key,
              defaultChecked: order === key,
              onChange: handleOrderChange,
            },
          })) as SegmentedControlProps.Segments
        }
      />
      <div className="flex gap-[1rem] justify-between">
        <Button title="Filtre" iconId="fr-icon-filter-line" priority="secondary" />
        <SearchBar className="grow" />
      </div>
    </>
  );
};

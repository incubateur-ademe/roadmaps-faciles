"use client";

import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import SearchBar from "@codegouvfr/react-dsfr/SearchBar";
import { SegmentedControl, type SegmentedControlProps } from "@codegouvfr/react-dsfr/SegmentedControl";
import { cx } from "@codegouvfr/react-dsfr/tools/cx";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { defaultOrder, type Order, ORDER_OPTIONS } from "./types";

export interface FilterAndSearchProps {
  order: Order;
  search?: string;
}

export const FilterAndSearch = ({ order, search }: FilterAndSearchProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const handleOrderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedOrder = event.target.value as Order;
    const params = new URLSearchParams(searchParams.toString());
    if (selectedOrder == defaultOrder) {
      params.delete("order");
    } else {
      params.set("order", selectedOrder);
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleSearch = (currentSearch: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (currentSearch) {
      params.set("search", currentSearch);
    } else {
      params.delete("search");
    }
    router.replace(`${pathname}?${params.toString()}`);
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
        <Button disabled title="Arrive prochainement" iconId="fr-icon-filter-line" priority="secondary" />
        <SearchBar className="grow" allowEmptySearch onButtonClick={handleSearch} defaultValue={search} />
      </div>
    </>
  );
};

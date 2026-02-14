"use client";

import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import SearchBar from "@codegouvfr/react-dsfr/SearchBar";
import { SegmentedControl, type SegmentedControlProps } from "@codegouvfr/react-dsfr/SegmentedControl";
import { cx } from "@codegouvfr/react-dsfr/tools/cx";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { defaultOrder, defaultView, type Order, ORDER_OPTIONS, type View } from "./types";

export interface FilterAndSearchProps {
  order: Order;
  search?: string;
  view: View;
}

export const FilterAndSearch = ({ order, search, view }: FilterAndSearchProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const t = useTranslations("board");
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

  const handleViewChange = (selectedView: View) => {
    const params = new URLSearchParams(searchParams.toString());
    if (selectedView === defaultView) {
      params.delete("view");
    } else {
      params.set("view", selectedView);
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const ORDER_LABELS: Record<Order, string> = {
    trending: t("trending"),
    top: t("top"),
    new: t("new"),
  };

  return (
    <>
      <SegmentedControl
        legend={t("sortBy")}
        hideLegend
        small
        className={cx(fr.cx("fr-mb-2w"), "w-full")}
        classes={{
          elements: "grow justify-between",
        }}
        name="order"
        segments={
          Object.entries(ORDER_OPTIONS).map<SegmentedControlProps.Segment>(([key, { icon }]) => ({
            iconId: icon,
            label: ORDER_LABELS[key as Order],
            nativeInputProps: {
              value: key,
              defaultChecked: order === key,
              onChange: handleOrderChange,
            },
          })) as SegmentedControlProps.Segments
        }
      />
      <div className="flex gap-[1rem] justify-between">
        <Button disabled title={t("filterComing")} iconId="fr-icon-filter-line" priority="secondary" />
        <SearchBar className="grow" allowEmptySearch onButtonClick={handleSearch} defaultValue={search} />
        <div className="flex">
          <Button
            title={t("viewCards")}
            iconId="fr-icon-layout-grid-line"
            priority={view === "cards" ? "secondary" : "tertiary no outline"}
            size="small"
            onClick={() => handleViewChange("cards")}
          />
          <Button
            title={t("viewList")}
            iconId="fr-icon-list-unordered"
            priority={view === "list" ? "secondary" : "tertiary no outline"}
            size="small"
            onClick={() => handleViewChange("list")}
          />
        </div>
      </div>
    </>
  );
};

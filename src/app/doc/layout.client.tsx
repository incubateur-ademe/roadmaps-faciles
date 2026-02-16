"use client";

import { fr } from "@codegouvfr/react-dsfr";
import { type Separator } from "fumadocs-core/page-tree";

export const CustomSeparator = ({ item }: { item: Separator }) => (
  <div id={item.$id} className={fr.cx("fr-text--bold", "fr-mt-2w")}>
    {item.name}
  </div>
);

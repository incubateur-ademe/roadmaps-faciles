import { type FrIconClassName } from "@codegouvfr/react-dsfr";
import { cx } from "@codegouvfr/react-dsfr/tools/cx";
import { loader, type LoaderPlugin } from "fumadocs-core/source";
import { docs } from "fumadocs-mdx:collections/server";
import { createElement } from "react";

/**
 * Icons referenced in content/docs meta.json files.
 * Listed here so `react-dsfr update-icons` detects them (it only scans .ts/.tsx/.mdx, not .json).
 */
const _usedDocIcons: FrIconClassName[] = [
  "fr-icon-lightbulb-line",
  "fr-icon-book-2-line",
  "fr-icon-shield-line",
  "fr-icon-settings-5-line",
  "fr-icon-code-line",
];

/**
 * Fumadocs plugin that converts DSFR icon class names (from meta.json/frontmatter)
 * into rendered DSFR icon spans.
 */
function dsfrIconPlugin(): LoaderPlugin {
  function replaceIcon<T extends { icon?: React.ReactNode | string }>(node: T): T {
    if (typeof node.icon === "string") {
      node.icon = createElement("span", {
        className: cx(node.icon as FrIconClassName, "nd-dsfr-icon"),
        "aria-hidden": "true",
      });
    }
    return node;
  }

  return {
    name: "dsfr-icons",
    transformPageTree: {
      file: replaceIcon,
      folder: replaceIcon,
      separator: replaceIcon,
    },
  };
}

export const docsSource = loader({
  baseUrl: "/doc",
  source: docs.toFumadocsSource(),
  plugins: [dsfrIconPlugin()],
});

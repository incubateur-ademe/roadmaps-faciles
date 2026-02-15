import defaultMdxComponents from "fumadocs-ui/mdx";
import { type MDXComponents } from "mdx/types";

import { anchorHeadingMDXComponents } from "@/mdx-components";

import { dsfrMdxComponents } from "./mdx-dsfr";

export function getDocMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ...anchorHeadingMDXComponents,
    ...dsfrMdxComponents,
    ...components,
  };
}

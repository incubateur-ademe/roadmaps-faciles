import defaultMdxComponents from "fumadocs-ui/mdx";
import { type MDXComponents } from "mdx/types";

import { ImageWithTheme } from "./ImageWithTheme";
import { dsfrMdxComponents } from "./mdx-dsfr";

export function getDocMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ...dsfrMdxComponents,
    ImageWithTheme,
    ...components,
  };
}

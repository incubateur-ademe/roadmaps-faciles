import { type Options } from "react-markdown";
import remarkDirective from "remark-directive";
import remarkDirectiveRehype from "remark-directive-rehype";
import remarkGfm from "remark-gfm";

export const reactMarkdownConfig: Options = {
  remarkPlugins: [remarkGfm, remarkDirective, remarkDirectiveRehype],
  unwrapDisallowed: true,
  disallowedElements: ["p"],
  allowElement: elt => elt.tagName !== "p",
  components: {
    ["search-mark" as "div"]: ({ children }) => {
      return <mark>{children}</mark>;
    },
    img: ({ src, alt }) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt ?? ""} style={{ maxWidth: "100%", height: "auto", borderRadius: "4px" }} />
    ),
  },
};

export const reactMarkdownPreviewConfig: Options = {
  remarkPlugins: [remarkGfm, remarkDirective, remarkDirectiveRehype],
  components: reactMarkdownConfig.components,
};

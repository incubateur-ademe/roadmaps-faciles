import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/page";
import { type Metadata } from "next";
import { notFound } from "next/navigation";

import { docsSource } from "@/lib/source";

import { getDocMDXComponents } from "../mdx-components";

const Page = async (props: { params: Promise<{ slug?: string[] }> }) => {
  const params = await props.params;
  const page = docsSource.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <DocsPage toc={page.data.toc}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX components={getDocMDXComponents()} />
      </DocsBody>
    </DocsPage>
  );
};

export default Page;

export const generateStaticParams = () => {
  return docsSource.generateParams();
};

export const generateMetadata = async (props: { params: Promise<{ slug?: string[] }> }): Promise<Metadata> => {
  const params = await props.params;
  const page = docsSource.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
};

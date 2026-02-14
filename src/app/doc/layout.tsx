import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { RootProvider } from "fumadocs-ui/provider/next";
import { type ReactNode } from "react";

import { docsSource } from "@/lib/source";

import { DefaultFooter } from "../(default)/DefaultFooter";
import { DocHeader } from "./DocHeader";
import "./docs.css";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <RootProvider>
      <DocHeader />
      <DocsLayout
        tree={docsSource.pageTree}
        nav={{ enabled: false }}
        sidebar={{
          collapsible: true,
        }}
      >
        {children}
      </DocsLayout>
      <DefaultFooter id="footer" />
    </RootProvider>
  );
};

export default Layout;

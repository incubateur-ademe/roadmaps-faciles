import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { RootProvider } from "fumadocs-ui/provider/next";
import { type ReactNode } from "react";

import { docsSource } from "@/lib/source";

import { DefaultFooter } from "../(default)/DefaultFooter";
import { DefaultHeader } from "../(default)/DefaultHeader";
import "./docs.css";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <RootProvider
      theme={{
        attribute: "class",
        defaultTheme: "light",
        enableSystem: true,
        storageKey: "theme",
        enableColorScheme: false,
      }}
    >
      <DefaultHeader />
      <DocsLayout tree={docsSource.pageTree} nav={{ enabled: false }} sidebar={{ collapsible: true }}>
        {children}
      </DocsLayout>
      <DefaultFooter id="footer" />
    </RootProvider>
  );
};

export default Layout;

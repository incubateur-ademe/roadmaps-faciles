import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { RootProvider } from "fumadocs-ui/provider/next";
import { type ReactNode } from "react";

import { docsSource } from "@/lib/source";

import { DefaultFooter } from "../(default)/DefaultFooter";
import { DocHeader } from "./DocHeader";
import "./docs.css";
import { CustomSeparator } from "./layout.client";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <RootProvider theme={{ enabled: false }}>
      <DocHeader />
      <DocsLayout
        tree={docsSource.pageTree}
        nav={{ enabled: false }}
        sidebar={{
          collapsible: true,
          components: {
            Separator: CustomSeparator,
          },
        }}
        themeSwitch={{ enabled: false }}
        searchToggle={{
          enabled: true,
        }}
      >
        {children}
      </DocsLayout>
      <DefaultFooter id="footer" />
    </RootProvider>
  );
};

export default Layout;

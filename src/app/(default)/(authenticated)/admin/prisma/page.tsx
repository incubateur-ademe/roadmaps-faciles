"use client";

import "@prisma/studio-core/ui/index.css";
import { fr } from "@codegouvfr/react-dsfr";
import { createStudioBFFClient } from "@prisma/studio-core/data/bff";
import { createPostgresAdapter } from "@prisma/studio-core/data/postgres-core";
import dynamic from "next/dynamic";
import { Suspense, useMemo } from "react";

import { Box, Container } from "@/dsfr";

// Dynamically import Studio with no SSR to avoid hydration issues
const Studio = dynamic(() => import("@prisma/studio-core/ui").then(mod => mod.Studio), {
  ssr: false,
});

const StudioLoading = () => (
  <div className="flex items-center justify-center h-full">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">Loading Studio...</p>
    </div>
  </div>
);

// Client-only Studio component
const ClientOnlyStudio = () => {
  const adapter = useMemo(() => {
    // Create the HTTP client that communicates with our API endpoint
    const executor = createStudioBFFClient({
      url: "/api/studio",
      fetch,
    });

    // Create the Postgres adapter using the executor
    return createPostgresAdapter({ executor });
  }, []);
  fr.cx("fr-m-1-5v");

  return <Studio adapter={adapter} />;
};

export default function PrismaPage() {
  return (
    <Suspense fallback={<StudioLoading />}>
      <Container className="max-w-7xl mx-auto bisou">
        <Box className="h-[calc(100vh-80px)] coucou">
          <ClientOnlyStudio />
        </Box>
      </Container>
    </Suspense>
  );
}

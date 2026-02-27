import { ArrowRight } from "lucide-react";
import { type Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

import { ImgHero } from "@/components/img/ImgHero";
import { config } from "@/config";
import { cn } from "@/ui/cn";
import { Button } from "@/ui/shadcn/button";

import { sharedMetadata } from "../shared-metadata";
import styles from "./index.module.scss";

const url = "/";

export const metadata: Metadata = {
  ...sharedMetadata,
  openGraph: {
    ...sharedMetadata.openGraph,
    url,
  },
  alternates: {
    canonical: url,
  },
};

const Home = async (_: PageProps<"/">) => {
  const t = await getTranslations("home");

  return (
    <section className={cn("pb-8 pt-20", styles.hero)}>
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          <div className="my-auto lg:col-span-7">
            <h1 className="mb-4 text-4xl font-bold tracking-tight">{t("title")}</h1>
            <p className="mb-6 text-lg text-muted-foreground">
              {t.rich("description", {
                brandName: config.brand.name,
                strong: chunks => <strong>{chunks}</strong>,
                u: chunks => <u>{chunks}</u>,
              })}
            </p>
            <Button asChild size="lg">
              <Link href="/tenant">
                {t("cta")}
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
          <div className="mx-auto md:col-span-6 lg:col-span-5">
            <ImgHero />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;

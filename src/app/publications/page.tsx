import { getPublications, getSiteConfig } from "@/lib/dataStore";
import PublicationsPageClient from "./PublicationsPageClient";

export const dynamic = "force-dynamic";

export default async function PublicationsPage() {
  const [publications, siteConfig] = await Promise.all([
    getPublications(),
    getSiteConfig(),
  ]);

  return (
    <PublicationsPageClient
      publications={publications}
      totalCitations={siteConfig?.totalPublicationCitations || ""}
    />
  );
}

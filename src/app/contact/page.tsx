import { getSiteConfig } from "@/lib/dataStore";
import ContactPageClient from "./ContactPageClient";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const config = await getSiteConfig();
  return <ContactPageClient config={config} />;
}

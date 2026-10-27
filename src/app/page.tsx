import { getProfile } from "@/lib/dataStore";
import HomePageClient from "./HomePageClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const profile = await getProfile();
  return <HomePageClient profile={profile} />;
}

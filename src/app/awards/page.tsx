import { getAwards } from "@/lib/dataStore";
import AwardsPageClient from "./AwardsPageClient";

export const dynamic = "force-dynamic";

export default async function AwardsPage() {
  const awards = await getAwards();
  return <AwardsPageClient awards={awards} />;
}

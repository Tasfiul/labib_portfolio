import { getResumeCategories } from "@/lib/dataStore";
import ResumePageClient from "./ResumePageClient";

export const dynamic = "force-dynamic";

export default async function ResumePage() {
  const categories = await getResumeCategories();
  return <ResumePageClient categories={categories} />;
}

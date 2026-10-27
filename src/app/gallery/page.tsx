import { getGalleryItems, getGalleryCategories } from "@/lib/dataStore";
import GalleryPageClient from "./GalleryPageClient";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const [items, categories] = await Promise.all([
    getGalleryItems(),
    getGalleryCategories(),
  ]);
  return <GalleryPageClient items={items} categories={categories} />;
}

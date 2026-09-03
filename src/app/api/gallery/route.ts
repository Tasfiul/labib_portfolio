import { NextRequest, NextResponse } from "next/server";
import {
  getGalleryCategories,
  saveGalleryCategories,
  getGalleryItems,
  saveGalleryItems,
} from "@/lib/dataStore";
import { verifyAdminSession } from "@/lib/auth";

export async function GET() {
  try {
    const [categories, items] = await Promise.all([
      getGalleryCategories(),
      getGalleryItems(),
    ]);
    return NextResponse.json({ categories, items });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch gallery";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const isAdmin = await verifyAdminSession();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { categories, items } = await req.json();
    let savedCategories = null;
    let savedItems = null;

    if (categories) {
      savedCategories = await saveGalleryCategories(categories);
    }
    if (items) {
      savedItems = await saveGalleryItems(items);
    }

    return NextResponse.json({
      categories: savedCategories || (await getGalleryCategories()),
      items: savedItems || (await getGalleryItems()),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update gallery";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

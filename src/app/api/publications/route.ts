import { NextRequest, NextResponse } from "next/server";
import {
  getPublications,
  savePublications,
  getSiteConfig,
  updateSiteConfig,
} from "@/lib/dataStore";
import { verifyAdminSession } from "@/lib/auth";

export async function GET() {
  try {
    const publications = await getPublications();
    const siteConfig = await getSiteConfig();
    return NextResponse.json({
      publications,
      totalCitations: siteConfig.totalPublicationCitations || "145+",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch publications";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const isAdmin = await verifyAdminSession();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();

    let pubsToSave = body;
    if (body && typeof body === "object" && !Array.isArray(body)) {
      if (body.totalCitations !== undefined) {
        await updateSiteConfig({
          totalPublicationCitations: String(body.totalCitations),
        });
      }
      pubsToSave = body.publications || [];
    }

    const updated = await savePublications(pubsToSave);
    const siteConfig = await getSiteConfig();
    return NextResponse.json({
      publications: updated,
      totalCitations: siteConfig.totalPublicationCitations || "145+",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update publications";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

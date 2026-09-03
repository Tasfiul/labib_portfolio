import { NextRequest, NextResponse } from "next/server";
import { getPublications, savePublications } from "@/lib/dataStore";
import { verifyAdminSession } from "@/lib/auth";

export async function GET() {
  try {
    const publications = await getPublications();
    return NextResponse.json(publications);
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
    const updated = await savePublications(body);
    return NextResponse.json(updated);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update publications";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

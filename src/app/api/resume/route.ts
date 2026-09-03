import { NextRequest, NextResponse } from "next/server";
import { getResumeCategories, saveResumeCategories } from "@/lib/dataStore";
import { verifyAdminSession } from "@/lib/auth";

export async function GET() {
  try {
    const categories = await getResumeCategories();
    return NextResponse.json(categories);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch resume categories";
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
    const updated = await saveResumeCategories(body);
    return NextResponse.json(updated);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update resume categories";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

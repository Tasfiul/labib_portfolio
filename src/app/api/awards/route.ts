import { NextRequest, NextResponse } from "next/server";
import { getAwards, saveAwards } from "@/lib/dataStore";
import { verifyAdminSession } from "@/lib/auth";

export async function GET() {
  try {
    const awards = await getAwards();
    return NextResponse.json(awards);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch awards";
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
    const updated = await saveAwards(body);
    return NextResponse.json(updated);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update awards";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

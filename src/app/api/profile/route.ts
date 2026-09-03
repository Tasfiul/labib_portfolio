import { NextRequest, NextResponse } from "next/server";
import { getProfile, updateProfile } from "@/lib/dataStore";
import { verifyAdminSession } from "@/lib/auth";

export async function GET() {
  try {
    const profile = await getProfile();
    return NextResponse.json(profile);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch profile";
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
    const updated = await updateProfile(body);
    return NextResponse.json(updated);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update profile";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

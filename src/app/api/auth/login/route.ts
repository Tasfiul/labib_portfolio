import { NextRequest, NextResponse } from "next/server";
import { verifyPasscode, createAdminToken, COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { passcode } = await req.json();

    if (!passcode || !verifyPasscode(passcode)) {
      return NextResponse.json({ error: "Invalid admin passcode" }, { status: 401 });
    }

    const token = createAdminToken();

    const response = NextResponse.json({ success: true, message: "Logged in successfully" });

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Authentication failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

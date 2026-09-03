import { NextRequest, NextResponse } from "next/server";
import { addMessage } from "@/lib/dataStore";

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    const saved = await addMessage({
      name,
      email,
      subject: subject || "No Subject",
      message,
    });

    return NextResponse.json({
      success: true,
      message: "Your message has been sent successfully!",
      id: saved.id,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to send message";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

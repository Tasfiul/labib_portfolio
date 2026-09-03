import { NextRequest, NextResponse } from "next/server";
import { processAndSaveImage } from "@/lib/imageProcessor";
import { verifyAdminSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const isAdmin = await verifyAdminSession();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await processAndSaveImage(buffer, file.name || "image");

    return NextResponse.json({
      success: true,
      url: result.url,
      filename: result.filename,
      width: result.width,
      height: result.height,
      format: result.format,
      size: result.size,
    });
  } catch (error: unknown) {
    console.error("Upload error:", error);
    const message = error instanceof Error ? error.message : "Failed to process image";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

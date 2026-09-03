import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { GridFSBucket } from "mongodb";
import { connectDB } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    await connectDB();

    const { filename } = await params;

    const db = mongoose.connection.db;
    if (!db) {
      return NextResponse.json({ error: "Database not connected" }, { status: 503 });
    }

    const bucket = new GridFSBucket(db, { bucketName: "uploads" });

    // Find the file metadata
    const files = await bucket.find({ filename }).toArray();
    if (files.length === 0) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    const file = files[0];
    const contentType = (file.metadata?.contentType as string) || "image/webp";

    // Stream the file from GridFS into a buffer
    const chunks: Buffer[] = [];
    const downloadStream = bucket.openDownloadStreamByName(filename);

    await new Promise<void>((resolve, reject) => {
      downloadStream.on("data", (chunk: Buffer) => chunks.push(chunk));
      downloadStream.on("end", resolve);
      downloadStream.on("error", reject);
    });

    const imageBuffer = Buffer.concat(chunks);

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": imageBuffer.length.toString(),
        // Cache for 1 year — images are content-addressed by timestamp in filename
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Image serve error:", error);
    return NextResponse.json({ error: "Failed to serve image" }, { status: 500 });
  }
}

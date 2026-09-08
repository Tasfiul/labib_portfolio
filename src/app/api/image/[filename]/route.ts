import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { GridFSBucket } from "mongodb";
import { connectDB } from "@/lib/db";
import fs from "fs";
import path from "path";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    await connectDB();

    const { filename } = await params;
    const isDownload = req.nextUrl.searchParams.get("download") === "1";

    const db = mongoose.connection.db;
    if (db) {
      const bucket = new GridFSBucket(db, { bucketName: "uploads" });

      // Find the file metadata
      const files = await bucket.find({ filename }).toArray();
      if (files.length > 0) {
        const file = files[0];
        const contentType =
          (file.metadata?.contentType as string) ||
          (filename.endsWith(".pdf") ? "application/pdf" : "image/webp");

        // Stream the file from GridFS into a buffer
        const chunks: Buffer[] = [];
        const downloadStream = bucket.openDownloadStreamByName(filename);

        await new Promise<void>((resolve, reject) => {
          downloadStream.on("data", (chunk: Buffer) => chunks.push(chunk));
          downloadStream.on("end", resolve);
          downloadStream.on("error", reject);
        });

        const buffer = Buffer.concat(chunks);

        const headers: Record<string, string> = {
          "Content-Type": contentType,
          "Content-Length": buffer.length.toString(),
          "Cache-Control": "public, max-age=31536000, immutable",
        };

        if (isDownload || filename.endsWith(".pdf")) {
          headers["Content-Disposition"] = `attachment; filename="${filename}"`;
        }

        return new NextResponse(buffer, {
          status: 200,
          headers,
        });
      }
    }

    // Disk fallback check in public/uploads
    const diskPath = path.join(process.cwd(), "public", "uploads", filename);
    if (fs.existsSync(diskPath)) {
      const buffer = await fs.promises.readFile(diskPath);
      const isPdf = filename.endsWith(".pdf");
      const contentType = isPdf ? "application/pdf" : "image/webp";

      const headers: Record<string, string> = {
        "Content-Type": contentType,
        "Content-Length": buffer.length.toString(),
        "Cache-Control": "public, max-age=31536000, immutable",
      };

      if (isDownload || isPdf) {
        headers["Content-Disposition"] = `attachment; filename="${filename}"`;
      }

      return new NextResponse(buffer, {
        status: 200,
        headers,
      });
    }

    return NextResponse.json({ error: "File not found" }, { status: 404 });
  } catch (error) {
    console.error("File serve error:", error);
    return NextResponse.json({ error: "Failed to serve file" }, { status: 500 });
  }
}

import sharp from "sharp";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { GridFSBucket } from "mongodb";
import { Readable } from "stream";

export interface ProcessedImageResult {
  url: string;
  filename: string;
  width?: number;
  height?: number;
  format: string;
  size: number;
}

function getGridFSBucket(): GridFSBucket {
  const db = mongoose.connection.db;
  if (!db) throw new Error("MongoDB not connected");
  return new GridFSBucket(db, { bucketName: "uploads" });
}

async function uploadToGridFS(
  buffer: Buffer,
  filename: string,
  contentType: string
): Promise<void> {
  const bucket = getGridFSBucket();

  // Delete any existing file with the same name to avoid duplicates
  const existing = await bucket.find({ filename }).toArray();
  for (const file of existing) {
    await bucket.delete(file._id);
  }

  return new Promise((resolve, reject) => {
    const readable = Readable.from(buffer);
    const uploadStream = bucket.openUploadStream(filename, {
      metadata: { contentType, uploadedAt: new Date().toISOString() },
    });
    readable.pipe(uploadStream);
    uploadStream.on("finish", resolve);
    uploadStream.on("error", reject);
  });
}

export async function processAndSaveImage(
  buffer: Buffer,
  originalFilename: string
): Promise<ProcessedImageResult> {
  await connectDB();

  const cleanName = require("path")
    .parse(originalFilename)
    .name.replace(/[^a-zA-Z0-9_-]/g, "_")
    .toLowerCase()
    .slice(0, 40);
  const timestamp = Date.now();
  const ext = require("path").extname(originalFilename).toLowerCase();

  // SVG handling — store as-is
  if (ext === ".svg") {
    const filename = `${cleanName}-${timestamp}.svg`;
    await uploadToGridFS(buffer, filename, "image/svg+xml");
    return {
      url: `/api/image/${filename}`,
      filename,
      format: "svg",
      size: buffer.length,
    };
  }

  // Optimize and convert to high-quality WebP using Sharp
  const sharpInstance = sharp(buffer);
  const metadata = await sharpInstance.metadata();

  const filename = `${cleanName}-${timestamp}.webp`;

  const processedBuffer = await sharpInstance
    .webp({
      quality: 95,
      lossless: false,
      effort: 4,
      smartSubsample: true,
    })
    .toBuffer();

  await uploadToGridFS(processedBuffer, filename, "image/webp");

  return {
    url: `/api/image/${filename}`,
    filename,
    width: metadata.width,
    height: metadata.height,
    format: "webp",
    size: processedBuffer.length,
  };
}

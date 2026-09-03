import sharp from "sharp";
import path from "path";
import fs from "fs/promises";

export interface ProcessedImageResult {
  url: string;
  filename: string;
  width?: number;
  height?: number;
  format: string;
  size: number;
}

export async function processAndSaveImage(
  buffer: Buffer,
  originalFilename: string
): Promise<ProcessedImageResult> {
  const uploadDir = path.join(process.cwd(), "public", "uploads");

  // Ensure upload directory exists
  try {
    await fs.mkdir(uploadDir, { recursive: true });
  } catch {
    // directory exists
  }

  const cleanName = path
    .parse(originalFilename)
    .name.replace(/[^a-zA-Z0-9_-]/g, "_")
    .toLowerCase()
    .slice(0, 40);
  const timestamp = Date.now();
  const ext = path.extname(originalFilename).toLowerCase();

  // SVG handling
  if (ext === ".svg") {
    const filename = `${cleanName}-${timestamp}.svg`;
    const filepath = path.join(uploadDir, filename);
    await fs.writeFile(filepath, buffer);
    return {
      url: `/uploads/${filename}`,
      filename,
      format: "svg",
      size: buffer.length,
    };
  }

  // Optimize and convert to pristine high-quality WebP using Sharp
  const sharpInstance = sharp(buffer);
  const metadata = await sharpInstance.metadata();

  const filename = `${cleanName}-${timestamp}.webp`;
  const filepath = path.join(uploadDir, filename);

  // Use Sharp with near-lossless / high quality 95+ to preserve maximum clarity and crispness
  const processedBuffer = await sharpInstance
    .webp({
      quality: 95,
      lossless: false,
      effort: 4,
      smartSubsample: true,
    })
    .toBuffer();

  await fs.writeFile(filepath, processedBuffer);

  return {
    url: `/uploads/${filename}`,
    filename,
    width: metadata.width,
    height: metadata.height,
    format: "webp",
    size: processedBuffer.length,
  };
}

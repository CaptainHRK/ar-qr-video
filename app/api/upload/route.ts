import { NextResponse } from "next/server";
import cloudinary from "cloudinary";
import { writeFile } from "fs/promises";
import os from "os";
import path from "path";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("video") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const tempFilePath = path.join(os.tmpdir(), file.name);
  await writeFile(tempFilePath, buffer);

  const uploadResult = await cloudinary.v2.uploader.upload(tempFilePath, {
    resource_type: "video",
  });

  return NextResponse.json({
    videoUrl: uploadResult.secure_url,
  });
}

import formidable from "formidable";
import { v2 as cloudinary } from "cloudinary";

export const config = {
  api: {
    bodyParser: false,
  },
};

/* Cloudinary config */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    /* ✅ CORRECT FOR FORMIDABLE v3 */
    const form = new formidable.IncomingForm({
      keepExtensions: true,
      multiples: false,
    });

    const { files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const file = Array.isArray(files.video)
      ? files.video[0]
      : files.video;

    if (!file || !file.filepath) {
      return res.status(400).json({ error: "No video file received" });
    }

    const result = await cloudinary.uploader.upload(file.filepath, {
      resource_type: "video",
    });

    return res.status(200).json({
      videoUrl: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);

    return res.status(500).json({
      error: "Upload failed",
      details: error.message,
    });
  }
}

import formidable from "formidable";
import cloudinary from "cloudinary";

export const config = {
  api: {
    bodyParser: false,
  },
};

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: err.message });

    const file = files.video;

    try {
      const result = await cloudinary.v2.uploader.upload(file.filepath, {
        resource_type: "video",
      });

      res.status(200).json({
        videoUrl: result.secure_url,
        id: result.public_id,
      });
    } catch (error) {
      res.status(500).json({ error: "Upload failed" });
    }
  });
}

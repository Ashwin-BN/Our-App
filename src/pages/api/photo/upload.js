import formidable from "formidable";
import cloudinary from "@/lib/cloudinary";
import { PrismaClient } from "@prisma/client";

export const config = {
  api: { bodyParser: false },
};

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const form = formidable({ multiples: false });

  try {
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const uploadedFile = files.file;
    if (!uploadedFile) return res.status(400).json({ error: "No file uploaded" });

    const fileObj = Array.isArray(uploadedFile) ? uploadedFile[0] : uploadedFile;

    // Make sure userId is a string
    const userId = Array.isArray(fields.userId) ? fields.userId[0] : fields.userId;
    const albumId = fields.albumId ? (Array.isArray(fields.albumId) ? fields.albumId[0] : fields.albumId) : null;

    if (!userId) return res.status(400).json({ error: "userId is required" });

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(fileObj.filepath, {
      folder: "ourapp/albums",
    });

    // Save in DB
    const photo = await prisma.photo.create({
      data: {
        url: result.secure_url,
        userId,
        albumId,
      },
    });

    res.status(200).json(photo);
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: err.message });
  }
}

import formidable from "formidable";
import cloudinary from "@/";
import { PrismaClient } from "@prisma/client";

export const config = {
  api: { bodyParser: false }, // required for formidable
};

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: "Upload error" });

    try {
      const file = files.file[0]; // uploaded photo
      const result = await cloudinary.uploader.upload(file.filepath, {
        folder: "ourapp/albums",
      });

      const photo = await prisma.photo.create({
        data: {
          url: result.secure_url,
          userId: fields.userId,   // pass from frontend
          albumId: fields.albumId || null,
        },
      });

      res.status(200).json(photo);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
}

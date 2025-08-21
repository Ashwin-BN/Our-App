// src/pages/api/photo/[id].js
import { PrismaClient } from "@prisma/client";
import cloudinary from "@/lib/cloudinary";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "DELETE") {
    try {
      // Find the photo
      const photo = await prisma.photo.findUnique({ where: { id } });
      if (!photo) return res.status(404).json({ error: "Photo not found" });

      // Optionally delete from Cloudinary
      // Extract public_id from URL
      const parts = photo.url.split("/");
      const filename = parts[parts.length - 1].split(".")[0];
      const folder = parts.slice(parts.indexOf("ourapp") + 1, parts.length - 1).join("/");
      const publicId = `${folder}/${filename}`;
      await cloudinary.uploader.destroy(publicId);

      // Delete from database
      await prisma.photo.delete({ where: { id } });

      res.status(200).json({ message: "Photo deleted" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

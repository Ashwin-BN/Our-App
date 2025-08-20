import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { name, description, cover, userId } = req.body;

      if (!name || !userId) {
        return res.status(400).json({ error: "Name and userId are required" });
      }

      const album = await prisma.album.create({
        data: {
          name,
          description,
          cover,
          userId,
        },
      });

      res.status(201).json(album);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === "GET") {
    try {
      const albums = await prisma.album.findMany({
        include: { photos: true },
      });
      res.status(200).json(albums);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

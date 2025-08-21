import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { name, description, cover, userId } = req.body;
      console.log("sdsdsdsdsdsd",name, userId)

      // Validate required fields
      if (!name?.trim() || !userId?.trim()) {
        return res.status(400).json({ error: "Name and userId are required" });
      }

      const album = await prisma.album.create({
        data: {
          name,
          description: description || null,
          cover: cover || null,
          userId,
        },
      });

      return res.status(201).json(album);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Server error: " + error.message });
    }
  } else if (req.method === "GET") {
    try {
      const albums = await prisma.album.findMany({
        include: { photos: true },
      });
      return res.status(200).json(albums);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Server error: " + error.message });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}

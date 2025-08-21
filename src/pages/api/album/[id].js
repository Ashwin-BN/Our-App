import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const album = await prisma.album.findUnique({
        where: { id },
        include: { photos: true },
      });

      if (!album) return res.status(404).json({ error: "Album not found" });
      res.status(200).json(album);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === "DELETE") {
    try {
      await prisma.album.delete({ where: { id } });
      res.status(200).json({ message: "Album deleted" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === "PATCH") {
  try {
    const { name, description, cover } = req.body;
    const updated = await prisma.album.update({
      where: { id },
      data: { name, description, cover },
    });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}  else {
    res.status(405).json({ error: "Method not allowed" });
  }
}


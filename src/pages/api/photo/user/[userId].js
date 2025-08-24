import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { userId } = req.query;

  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    const photos = await prisma.photo.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    const favourites = photos.filter((p) => p.favourite);

    res.status(200).json({ all: photos, favourites });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}


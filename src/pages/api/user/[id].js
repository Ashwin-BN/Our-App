import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function handler(req, res) {
  const { id } = req.query;

  // ✅ Ensure user is authenticated
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "GET") {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          friends: true,
          partner: true,
        },
      });

      if (!user) return res.status(404).json({ error: "User not found" });

      res.status(200).json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  }

  else if (req.method === "PUT") {
    try {
      const { name, image } = req.body;

      // Only allow self-edit
      if (session.user.id !== id) {
        return res.status(403).json({ error: "Forbidden" });
      }

      const updatedUser = await prisma.user.update({
        where: { id },
        data: { name, image },
      });

      res.status(200).json(updatedUser);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to update user" });
    }
  }

  else {
    res.setHeader("Allow", ["GET", "PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

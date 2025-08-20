import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) return res.status(401).json({ error: "Not authenticated" });

    const { password } = req.body;
    if (!password || password.length < 6)
      return res.status(400).json({ error: "Password must be at least 6 characters" });

    const hashed = bcrypt.hashSync(password, 10);

    await prisma.user.update({
      where: { email: session.user.email },
      data: { password: hashed },
    });

    return res.json({ success: true });
  } catch (err) {
    console.error("Set password error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

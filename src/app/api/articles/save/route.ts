import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, url, imageUrl, description } = await req.json();

    // Find or create the user
    let user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: { email: session.user.email },
      });
    }

    const savedArticle = await prisma.article.create({
      data: {
        title,
        url,
        imageUrl,
        description: description || "No description available.", // ✅ Ensure default value
        userId: user.id,
      },
    });
    

    return NextResponse.json(savedArticle);
  } catch (error) {
    console.error("Error saving article:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

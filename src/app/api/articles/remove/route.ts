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

    const { url } = await req.json();

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { savedArticles: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find the article in the user's saved articles
    const article = await prisma.article.findFirst({
      where: { url, userId: user.id },
    });

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    // Remove the article from the database
    await prisma.article.delete({
      where: { id: article.id },
    });

    return NextResponse.json({ message: "Article removed successfully" });
  } catch (error) {
    console.error("Error removing article:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

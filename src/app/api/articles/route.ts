import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { savedArticles: true },
    });

    return NextResponse.json(user?.savedArticles || []);
  } catch (error) {
    console.error("Error fetching saved articles:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

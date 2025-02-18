import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// NextAuth requires you to export both GET and POST as a function
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

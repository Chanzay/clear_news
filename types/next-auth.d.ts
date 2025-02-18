import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

// ✅ Extend the `Session` type
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string; 
  }
}

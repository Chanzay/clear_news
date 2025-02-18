"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex justify-between items-center shadow-md">
      <h1 className="text-2xl font-extrabold tracking-wide">Clear News</h1>

      {session ? (
        <div className="flex items-center space-x-4">
          <p className="text-lg">
            Welcome, <span className="font-semibold">{session.user?.name}</span>
            !
          </p>
          <button
            onClick={() => signOut()}
            className="bg-red-500 hover:bg-red-700 transition px-4 py-2 rounded shadow-lg"
          >
            Logout
          </button>
        </div>
      ) : (
        <button
          onClick={() => signIn("google")}
          className="bg-green-500 hover:bg-green-700 transition px-4 py-2 rounded shadow-lg"
        >
          Login with Google
        </button>
      )}
    </nav>
  );
}

"use client";

import { useSession, signIn, signOut } from "next-auth/react";

const handleLogout = async () => {
  await signOut({ redirect: false });
  localStorage.clear();
  sessionStorage.clear();
  document.cookie =
    "next-auth.session-token=; Max-Age=0; path=/; domain=" +
    window.location.hostname;
  window.location.href = "/";
};

const handleLogin = async () => {
  await signIn("google", {
    prompt: "select_account",
    redirect: true,
    callbackUrl: "/",
  });
};

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex justify-between items-center shadow-md">
      <h1
        className="text-2xl font-extrabold tracking-wide cursor-pointer"
        onClick={() => (window.location.href = "/")}
      >
        Clear News
      </h1>

      {session ? (
        <div className="flex items-center space-x-4">
          <p className="text-lg">
            Welcome, <span className="font-semibold">{session.user?.name}</span>
            !
          </p>
          <button
            onClick={() => (window.location.href = "/saved")}
            className="bg-yellow-500 hover:bg-yellow-700 transition px-4 py-2 rounded shadow-lg"
          >
            View Saved
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      ) : (
        <button
          onClick={handleLogin}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          Login
        </button>
      )}
    </nav>
  );
}

import React from "react";
import Link from "next/link";
import Header from "./components/Header";

export default function NotFound() {
  return (
    <div>
      <Header />
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-r from-blue-100 via-blue-50 to-blue-200">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md text-center my-8">
          <h1 className="text-5xl font-extrabold mb-4 text-gray-800">404</h1>
          <p className="text-xl font-medium text-gray-700 mb-6">
            Page Not Found
          </p>
          <p className="text-base text-gray-600 mb-6">
            The page you&apos;re looking for doesn&apos;t exist or might have
            been moved.
          </p>
          <Link
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
          >
            Go back home
          </Link>
        </div>
      </div>
    </div>
  );
}

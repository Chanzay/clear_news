"use client";

import { useEffect, useState } from "react";
import Header from "../components/Header";

type Article = {
  title: string;
  url: string;
  imageUrl?: string;
  description?: string;
};

export default function SavedArticles() {
  const [searchQuery, setSearchQuery] = useState("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [summaries, setSummaries] = useState<{ [key: string]: string }>({});

  const removeSavedArticle = async (url: string) => {
    try {
      const res = await fetch("/api/articles/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      if (!res.ok) throw new Error("Failed to remove article");
      setArticles((prevArticles) =>
        prevArticles.filter((article) => article.url !== url)
      );
    } catch (error) {
      console.error("Error removing article:", error);
    }
  };

  const summarizeArticle = async (url: string, text?: string) => {
    if (!text?.trim()) {
      alert("This article has no description available to summarize.");
      return;
    }
    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error("Failed to summarize article");
      const data = await res.json();
      setSummaries((prev) => ({ ...prev, [url]: data.summary }));
    } catch (error) {
      console.error("Error summarizing article:", error);
    }
  };

  useEffect(() => {
    const fetchSavedArticles = async () => {
      try {
        const res = await fetch("/api/articles");
        if (!res.ok) throw new Error("Failed to fetch articles");
        const data: Article[] = await res.json();
        setArticles(data);
      } catch (error) {
        console.error("Error fetching saved articles:", error);
      }
    };
    fetchSavedArticles();
  }, []);

  return (
    <div>
      <Header />
      <div className="p-4">
        <input
          type="text"
          placeholder="Search saved articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      {articles.length === 0 ? (
        <p className="text-center text-gray-500 italic">
          No saved articles yet. Start exploring!
        </p>
      ) : (
        <ul className="space-y-6">
          {articles
            .filter(
              (article) =>
                article.title
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase()) ||
                (article.description &&
                  article.description
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()))
            )
            .map((article, index) => (
              <li key={index} className="p-4 bg-white rounded-lg shadow-lg">
                {article.imageUrl && (
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
                {article.description && (
                  <p className="mt-2 text-gray-800">{article.description}</p>
                )}
                <div className="flex space-x-2 mt-3">
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-all"
                  >
                    Read More
                  </a>
                  <button
                    onClick={() =>
                      summarizeArticle(article.url, article.description || "")
                    }
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 transition-all"
                  >
                    Summarize
                  </button>
                  <button
                    onClick={() => removeSavedArticle(article.url)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition-all"
                  >
                    Remove
                  </button>
                </div>
                {summaries[article.url] && (
                  <p className="mt-2 text-gray-800 bg-gray-100 p-2 rounded shadow-inner">
                    {summaries[article.url]}
                  </p>
                )}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}

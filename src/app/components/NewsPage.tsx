"use client";

import { useEffect, useState } from "react";

interface Article {
  title: string;
  url: string;
  urlToImage?: string;
  description: string;
}

const categories = [
  "general",
  "business",
  "technology",
  "sports",
  "health",
  "entertainment",
];

export default function NewsPage() {
  const [news, setNews] = useState<Article[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("general");
  const [searchQuery, setSearchQuery] = useState("");
  const [summaries, setSummaries] = useState<{ [key: number]: string }>({}); // Store summaries

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(
          `/api/news?category=${selectedCategory}&search=${searchQuery}`
        );
        const data = await res.json();
        setNews(data.articles);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    const timeout = setTimeout(() => {
      fetchNews();
    }, 500);

    return () => clearTimeout(timeout);
  }, [selectedCategory, searchQuery]);

  // Function to summarize an article
  const summarizeArticle = async (index: number, text: string) => {
    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();
      setSummaries((prev) => ({ ...prev, [index]: data.summary }));
    } catch (error) {
      console.error("Error summarizing article:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-6">
        Latest News
      </h1>

      {/* Search Bar */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search for news..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-lg p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Category Tabs */}
      <div className="flex justify-center space-x-4 mb-6">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-5 py-2 rounded-full font-medium transition-all duration-300 ${
              selectedCategory === category
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {news.map((article, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 p-5 rounded-lg shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105"
          >
            {article.urlToImage && (
              <img
                src={article.urlToImage}
                alt={article.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {article.title}
            </h2>
            <p className="text-sm text-gray-600 mb-3">{article.description}</p>

            {/* Summarize Button */}
            <button
              onClick={() => summarizeArticle(index, article.description)}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-all"
            >
              Summarize
            </button>

            {/* Display Summary */}
            {summaries[index] && (
              <p className="mt-2 text-gray-800 bg-gray-100 p-2 rounded shadow-inner">
                {summaries[index]}
              </p>
            )}

            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-blue-600 hover:text-blue-800 mt-3 font-medium"
            >
              Read more →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

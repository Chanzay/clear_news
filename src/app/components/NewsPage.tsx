"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

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
  const { data: session } = useSession(); // Get logged-in user session
  const [news, setNews] = useState<Article[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("general");
  const [searchQuery, setSearchQuery] = useState("");
  const [summaries, setSummaries] = useState<{ [key: string]: string }>({});
  const [savedArticles, setSavedArticles] = useState<{
    [key: string]: boolean;
  }>({}); // Track saved articles

  // Fetch news based on category and search
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

  // Fetch saved articles when the page loads
  useEffect(() => {
    const fetchSavedArticles = async () => {
      try {
        const res = await fetch("/api/articles");
        const data = await res.json();

        // Convert array of saved articles into a lookup object
        const savedMap = data.reduce(
          (acc: { [key: string]: boolean }, article: Article) => {
            acc[article.url] = true;
            return acc;
          },
          {}
        );

        setSavedArticles(savedMap);
      } catch (error) {
        console.error("Error fetching saved articles:", error);
      }
    };

    if (session) {
      fetchSavedArticles();
    }
  }, [session]);

  // Function to summarize an article
  const summarizeArticle = async (url: string, text: string) => {
    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();
      setSummaries((prev) => ({ ...prev, [url]: data.summary }));
    } catch (error) {
      console.error("Error summarizing article:", error);
    }
  };

  // Function to toggle save/remove article
  const toggleSaveArticle = async (article: Article) => {
    if (!session) {
      alert("You must be logged in to save articles.");
      return;
    }

    if (savedArticles[article.url]) {
      // Remove the article if already saved
      console.log("Removing article:", article.url);

      const res = await fetch("/api/articles/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: article.url }),
      });

      if (res.ok) {
        setSavedArticles((prev) => ({ ...prev, [article.url]: false }));
      } else {
        alert("Failed to remove article.");
      }
    } else {
      // Save the article if not saved
      console.log("Saving article:", article);

      const res = await fetch("/api/articles/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: article.title,
          url: article.url,
          imageUrl: article.urlToImage,
          description: article.description,
        }),
      });

      if (res.ok) {
        setSavedArticles((prev) => ({ ...prev, [article.url]: true }));
      } else {
        alert("Failed to save article.");
      }
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
              <Image
                src={article.urlToImage}
                alt={article.title}
                width={500} // Add width
                height={300} // Add height
                className="w-full h-48 object-cover rounded-lg mb-4"
                unoptimized // Use this if images are from an external source like NewsAPI
              />
            )}
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {article.title}
            </h2>
            <p className="text-sm text-gray-600 mb-3">{article.description}</p>

            {/* Summarize Button */}
            <button
              onClick={() => summarizeArticle(article.url, article.description)}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-all"
            >
              Summarize
            </button>

            {/* Save/Remove Article Button */}
            <button
              onClick={() => toggleSaveArticle(article)}
              className={`mt-2 px-4 py-2 ml-2 rounded ${
                savedArticles[article.url] ? "bg-gray-500" : "bg-green-500"
              } text-white`}
            >
              {savedArticles[article.url] ? "Saved" : "Save"}
            </button>

            {/* Display Summary */}
            {summaries[article.url] && (
              <p className="mt-2 text-gray-800 bg-gray-100 p-2 rounded shadow-inner">
                {summaries[article.url]}
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

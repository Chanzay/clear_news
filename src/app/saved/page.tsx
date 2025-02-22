"use client";

import { useEffect, useState } from "react";
import Header from "../components/Header";
import Image from "next/image";
import { SavedPage } from "../components/SavedPage";

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
      <SavedPage />
    </div>
  );
}

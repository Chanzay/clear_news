import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "general"; // Default category
    const searchQuery = searchParams.get("search") || ""; // Search query

    const API_KEY = process.env.NEWS_API_KEY;
    
    // If there is a search query, fetch relevant articles
    let API_URL = searchQuery
      ? `https://newsapi.org/v2/everything?q=${searchQuery}&language=en&apiKey=${API_KEY}`
      : `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${API_KEY}`;

    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Failed to fetch news");

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

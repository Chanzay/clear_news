import React from "react";
import Image from "next/image";

function SavedPage() {
  return (
    <div>
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
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    width={500} // Add width
                    height={300} // Add height
                    className="w-full h-48 object-cover rounded-lg mb-4"
                    unoptimized // Use this if images are from an external source like NewsAPI
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

export default SavedPage;

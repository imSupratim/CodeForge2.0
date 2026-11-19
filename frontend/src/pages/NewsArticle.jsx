import React from "react";
import { useEffect, useState } from "react";
import api from "../api/axios.js";
import { Code, Code2, Code2Icon, ExternalLink, NewspaperIcon } from "lucide-react";
import NewsCard from "../components/NewsCard.jsx";


const NewsArticle = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/news")
      .then((res) => setArticles(res.data))
      .finally(() => setLoading(false));
  }, []);

  
  return (
     <div className="min-h-screen bg-[#0d1117] p-6">

      <h1 className="text-3xl flex gap-2 font-bold items-center text-white mb-2">
        Developer Magazine <NewspaperIcon className="size-7 text-indigo-500"/>
      </h1>

      <p className="text-gray-400 mb-6">
        Fresh articles on AI, Web Dev, Careers & Coding
      </p>

      {loading ? (
        <p className="text-gray-400">Loading articles...</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map(article => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsArticle;

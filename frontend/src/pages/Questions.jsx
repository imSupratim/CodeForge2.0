import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import { Code2, Trophy, Clock, ChevronRight } from "lucide-react";

export default function Questions() {
  const [questions, setQuestions] = useState([]);
  const [selectedTag, setSelectedTag] = useState("all");

  useEffect(() => {
    api.get("/questions").then((res) => setQuestions(res.data));
  }, []);

  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      medium: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      hard: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    };
    return colors[difficulty?.toLowerCase()] || colors.medium;
  };

  const allTags = ["all", ...new Set(questions.flatMap((q) => q.tags || []))];
  const filteredQuestions =
    selectedTag === "all"
      ? questions
      : questions.filter((q) => q.tags?.includes(selectedTag));

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="md:flex">
        {/* Header Section */}
        <div className="border-b flex-1 border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div className="p-1.5 sm:p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                <Code2 className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Problem Set
              </h1>
            </div>
            <p className="text-slate-400 text-sm sm:text-lg">
              Master your coding skills through carefully curated challenges
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-4 sm:mt-6">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 sm:px-4 py-1.5 rounded-full cursor-pointer text-xs sm:text-sm font-medium border transition-all
      ${
        selectedTag === tag
          ? "bg-indigo-500/15 text-indigo-400 border-indigo-500/40"
          : "bg-slate-800/40 text-slate-400 border-slate-700 hover:border-slate-500"
      }
    `}
                >
                  {tag === "all" ? "All" : tag}
                </button>
              ))}
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-4 sm:gap-6 mt-4 sm:mt-6">
              <div className="flex items-center gap-2 text-slate-300">
                <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                <span className="text-xs sm:text-sm">
                  {questions.length} Problems
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
                <span className="text-xs sm:text-sm">Practice Mode</span>
              </div>
            </div>
          </div>
        </div>

        {/* Questions Grid */}
        <div className="max-w-5xl md:overflow-y-auto md:h-[90vh] flex-1 mx-auto px-6 py-10">
          <div className="grid gap-4">
            {filteredQuestions.map((q, index) => (
              <Link
                key={q._id}
                to={`/questions/${q._id}`}
                className="group relative bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6 hover:border-indigo-500/50 hover:bg-slate-900/80 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10"
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>

                <div className="relative flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-slate-500 font-mono text-sm">
                        #{String(index + 1).padStart(3, "0")}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(q.difficulty)}`}
                      >
                        {q.difficulty}
                      </span>
                    </div>

                    <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                      {q.title}
                    </h2>

                    {q.tags && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {q.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-slate-800/50 border border-slate-700/50 rounded text-xs text-slate-400"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-800/50 border border-slate-700 group-hover:border-indigo-500/50 group-hover:bg-indigo-500/10 transition-all duration-300">
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredQuestions.length === 0 && (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800/50 border border-slate-700 mb-4">
                <Code2 className="w-8 h-8 text-slate-600" />
              </div>
              <p className="text-slate-400 text-lg">
                No problems found for this tag
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

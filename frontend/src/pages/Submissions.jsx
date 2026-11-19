import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function Submissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, accepted, failed

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await api.get("/submissions/my");
        setSubmissions(res.data.submissions);
      } catch (error) {
        console.error("Failed to fetch submissions", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  const filteredSubmissions = submissions.filter((sub) => {
    if (filter === "all") return true;
    if (filter === "accepted") return sub.status === "Accepted";
    if (filter === "failed") return sub.status !== "Accepted";
    return true;
  });

  const stats = {
    total: submissions.length,
    accepted: submissions.filter((s) => s.status === "Accepted").length,
    failed: submissions.filter((s) => s.status !== "Accepted").length,
  };

  const getLanguageColor = (lang) => {
    const colors = {
      javascript: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      python: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      cpp: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      java: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    };
    return colors[lang?.toLowerCase()] || "bg-slate-500/10 text-slate-400 border-slate-500/20";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800/50 border border-slate-700 mb-4 animate-pulse">
            <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-slate-400 text-lg">Loading submissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                  <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">My Submissions</h1>
              </div>
              <p className="text-slate-400">Track your coding journey and progress</p>
            </div>

            {/* Stats Cards */}
            <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0">
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 min-w-[100px]">
                <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Total</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-4 py-3 min-w-[100px]">
                <p className="text-xs text-emerald-400 uppercase font-semibold mb-1">Accepted</p>
                <p className="text-2xl font-bold text-emerald-400">{stats.accepted}</p>
              </div>
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg px-4 py-3 min-w-[100px]">
                <p className="text-xs text-rose-400 uppercase font-semibold mb-1">Failed</p>
                <p className="text-2xl font-bold text-rose-400">{stats.failed}</p>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mt-6 overflow-x-auto pb-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                filter === "all"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                  : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-300"
              }`}
            >
              All Submissions
            </button>
            <button
              onClick={() => setFilter("accepted")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                filter === "accepted"
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                  : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-300"
              }`}
            >
              Accepted
            </button>
            <button
              onClick={() => setFilter("failed")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                filter === "failed"
                  ? "bg-rose-600 text-white shadow-lg shadow-rose-500/20"
                  : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-300"
              }`}
            >
              Failed
            </button>
          </div>
        </div>
      </div>

      {/* Submissions List */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10">
        {filteredSubmissions.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800/50 border border-slate-700 mb-4">
              <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-slate-400 text-lg mb-2">
              {filter === "all" ? "No submissions yet" : `No ${filter} submissions`}
            </p>
            <p className="text-slate-500 text-sm">
              {filter === "all" ? "Start solving problems to see your submission history" : "Try a different filter"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredSubmissions.map((sub) => (
              <Link
                to={`/submissions/${sub._id}`}
                key={sub._id}
                className="group block bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-4 md:p-5 hover:border-indigo-500/50 hover:bg-slate-900/80 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left Section */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <h2 className="text-base md:text-lg font-semibold text-white group-hover:text-indigo-300 transition-colors truncate">
                          {sub.question?.title || "Deleted Question"}
                        </h2>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <span className={`px-2 py-1 rounded text-xs font-semibold border ${getLanguageColor(sub.language)}`}>
                            {sub.language?.toUpperCase()}
                          </span>
                          <span className="text-slate-400 text-xs">•</span>
                          <span className="text-slate-400 text-xs font-medium">
                            {sub.passed}/{sub.total} test cases
                          </span>
                          {sub.executionTime && (
                            <>
                              <span className="text-slate-400 text-xs">•</span>
                              <span className="text-slate-400 text-xs">{sub.executionTime}ms</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {new Date(sub.createdAt).toLocaleString()}
                    </div>
                  </div>

                  {/* Right Section - Status */}
                  <div className="flex items-center gap-3">
                    {/* Progress Circle */}
                    <div className="hidden sm:flex items-center justify-center">
                      <svg className="w-12 h-12 transform -rotate-90">
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                          className="text-slate-800"
                        />
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 20}`}
                          strokeDashoffset={`${2 * Math.PI * 20 * (1 - sub.passed / sub.total)}`}
                          className={sub.status === "Accepted" ? "text-emerald-500" : "text-rose-500"}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute text-xs font-bold text-slate-300">
                        {Math.round((sub.passed / sub.total) * 100)}%
                      </span>
                    </div>

                    {/* Status Badge */}
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-medium text-sm ${
                      sub.status === "Accepted"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                    }`}>
                      <span className="w-2 h-2 rounded-full bg-current"></span>
                      {sub.status}
                    </div>

                    {/* Arrow */}
                    <svg className="w-5 h-5 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
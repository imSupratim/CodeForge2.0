import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import Editor from "@monaco-editor/react";
import {
  Play,
  Loader2,
  CheckCircle2,
  XCircle,
  Timer,
  Pause,
  RotateCcw,
} from "lucide-react";

export default function QuestionDetail() {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("java");
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState("description"); // For mobile: description or editor
  const [time, setTime] = useState(0); // seconds
const [isTimerRunning, setIsTimerRunning] = useState(false);

useEffect(() => {
  let interval = null;

  if (isTimerRunning) {
    interval = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);
  } else if (!isTimerRunning && interval) {
    clearInterval(interval);
  }

  return () => clearInterval(interval);
}, [isTimerRunning]);



  useEffect(() => {
    api.get(`/questions/${id}`).then((res) => setQuestion(res.data));
  }, [id]);

  const submit = async () => {
    if (isRunning) return;

    setIsRunning(true);
    setResult(null);

    try {
      const res = await api.post("/submissions/submit", {
        questionId: id,
        language,
        code,
      });
      setResult(res.data);
    } catch (err) {
      setResult({
        status: "Error",
        passed: 0,
        total: 0,
        executionTime: 0,
        memoryUsed: "N/A",
      });
    } finally {
      setIsRunning(false);
    }
  };

  const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

  const getDifficultyColor = (difficulty) => {
    const colors = {
      Easy: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      Medium: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      Hard: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    };
    return colors[difficulty] || colors.Medium;
  };

  if (!question) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800/50 border border-slate-700 mb-4 animate-pulse">
            <svg
              className="w-8 h-8 text-indigo-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              />
            </svg>
          </div>
          <p className="text-slate-400 text-lg">Loading problem...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-800 px-4 md:px-6 py-4 sticky top-0 z-20">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
          <h1 className="text-lg md:text-xl font-bold text-white truncate">
            {question.title}
          </h1>
          <div className="flex items-center gap-3">
            {/* Stopwatch */}
            <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2">
              <Timer className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-mono text-slate-200">
                {formatTime(time)}
              </span>

              {!isTimerRunning ? (
                <button
                  onClick={() => setIsTimerRunning(true)}
                  className="text-emerald-400 hover:text-emerald-300 transition"
                  title="Start"
                >
                  <Play className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => setIsTimerRunning(false)}
                  className="text-amber-400 hover:text-amber-300 transition"
                  title="Pause"
                >
                  <Pause className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={() => {
                  setIsTimerRunning(false);
                  setTime(0);
                }}
                className="text-rose-400 hover:text-rose-300 transition"
                title="Reset"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <select
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
            </select>
            <button
              onClick={submit}
              disabled={isRunning}
              className={`flex cursor-pointer items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all active:scale-95
    ${
      isRunning
        ? "bg-indigo-500/50 cursor-not-allowed"
        : "bg-indigo-600 hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20"
    }`}
            >
              {isRunning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Running</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span className="hidden sm:inline">Submit</span>
                  <span className="sm:hidden">Run</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Tab Navigation */}
      <div className="lg:hidden bg-slate-900/50 border-b border-slate-800 flex">
        <button
          onClick={() => setActiveTab("description")}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === "description"
              ? "text-indigo-400 border-b-2 border-indigo-500 bg-slate-800/50"
              : "text-slate-400 hover:text-slate-300"
          }`}
        >
          Description
        </button>
        <button
          onClick={() => setActiveTab("editor")}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === "editor"
              ? "text-indigo-400 border-b-2 border-indigo-500 bg-slate-800/50"
              : "text-slate-400 hover:text-slate-300"
          }`}
        >
          Code Editor
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Side: Question Info (Hidden on mobile when editor tab is active) */}
        <div
          className={`w-full lg:w-1/2 overflow-y-auto ${activeTab === "editor" ? "hidden lg:block" : "block"}`}
        >
          <div className="p-4 md:p-6 space-y-6">
            {/* Difficulty Badge */}
            <div>
              <span
                className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(question.difficulty)}`}
              >
                {question.difficulty}
              </span>
            </div>

            {/* Description */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-4 md:p-6">
              <h2 className="text-lg font-semibold text-white mb-3 ">
                Description
              </h2>
              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                {question.description}
              </p>
            </div>

            {/* Input/Output/Constraints */}
            <div className="space-y-3">
              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-4">
                <p className="text-sm font-semibold text-indigo-400 mb-2">
                  Input Format
                </p>
                <p className="text-slate-300 text-sm">{question.inputFormat}</p>
              </div>
              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-4">
                <p className="text-sm font-semibold text-indigo-400 mb-2">
                  Output Format
                </p>
                <p className="text-slate-300 text-sm">
                  {question.outputFormat}
                </p>
              </div>
              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-4">
                <p className="text-sm font-semibold text-indigo-400 mb-2">
                  Constraints
                </p>
                <code className="text-rose-400 text-sm font-mono">
                  {question.constraints}
                </code>
              </div>
            </div>

            {/* Example Test Cases */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-4 md:p-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                Example Test Cases
              </h2>
              <div className="space-y-4">
                {question.testcases.slice(0, 2).map((tc, index) => (
                  <div key={tc._id || index} className="space-y-3">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Example {index + 1}
                    </p>
                    <div className="space-y-2">
                      <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-3">
                        <p className="text-xs font-bold text-slate-500 uppercase mb-2">
                          Input
                        </p>
                        <pre className="text-sm font-mono text-slate-300 whitespace-pre-wrap break-all">
                          {tc.input}
                        </pre>
                      </div>
                      <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-3">
                        <p className="text-xs font-bold text-slate-500 uppercase mb-2">
                          Output
                        </p>
                        <pre className="text-sm font-mono text-slate-300 whitespace-pre-wrap break-all">
                          {tc.output}
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Editor & Results (Hidden on mobile when description tab is active) */}
        <div
          className={`w-full lg:w-1/2 flex flex-col border-l border-slate-800 ${activeTab === "description" ? "hidden lg:flex" : "flex"}`}
        >
          {/* Editor */}
          <div className="flex-1 bg-slate-950 relative">
            <Editor
              height="100%"
              language={language}
              value={code}
              theme="vs-dark"
              onChange={setCode}
              options={{
                minimap: { enabled: false },
                fontSize: 18,
                scrollBeyondLastLine: false,
                padding: { top: 16 },
                lineNumbers: "on",
                folding: true,
                wordWrap: "on",
              }}
            />
          </div>

          {/* Result Panel */}
          <div className="h-auto max-h-80 lg:h-1/3 overflow-y-auto p-4 bg-slate-950 border-t border-slate-800">
            <div className="flex justify-between items-center mb-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-indigo-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span className="text-slate-400 uppercase text-xs font-bold tracking-wider">
                  Console Output
                </span>
              </div>
              {result && (
                <span
                  className={`flex items-center gap-1.5 text-xs font-semibold ${
                    result.status === "Accepted"
                      ? "text-emerald-400"
                      : "text-rose-400"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                  {result.status === "Accepted" ? "Passed" : "Failed"}
                </span>
              )}
            </div>

            {result ? (
              <div className="space-y-4">
                {/* Status Card */}
                <div
                  className={`rounded-lg overflow-hidden border ${
                    result.status === "Accepted"
                      ? "bg-emerald-500/5 border-emerald-500/20"
                      : "bg-rose-500/5 border-rose-500/20"
                  }`}
                >
                  <div className="px-4 py-3 flex justify-between items-center">
                    <span
                      className={`text-base font-bold ${
                        result.status === "Accepted"
                          ? "text-emerald-400"
                          : "text-rose-400"
                      }`}
                    >
                      {result.status}
                    </span>
                    <span className="text-xs text-slate-400">
                      {result.executionTime}ms
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-900 h-1">
                    <div
                      className={`h-full transition-all duration-500 ${
                        result.status === "Accepted"
                          ? "bg-emerald-500"
                          : "bg-rose-500"
                      }`}
                      style={{
                        width: `${(result.passed / result.total) * 100}%`,
                      }}
                    ></div>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 divide-x divide-slate-800/50">
                    <div className="px-3 py-3 text-center">
                      <p className="text-xs text-slate-500 uppercase font-semibold mb-1">
                        Tests
                      </p>
                      <p className="text-lg font-bold text-slate-200">
                        {result.passed}/{result.total}
                      </p>
                    </div>
                    <div className="px-3 py-3 text-center">
                      <p className="text-xs text-slate-500 uppercase font-semibold mb-1">
                        Memory
                      </p>
                      <p className="text-lg font-bold text-slate-200">
                        {result.memoryUsed}
                      </p>
                    </div>
                    <div className="px-3 py-3 text-center">
                      <p className="text-xs text-slate-500 uppercase font-semibold mb-1">
                        Runtime
                      </p>
                      <p className="text-lg font-bold text-slate-200">
                        {result.executionTime}ms
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <svg
                  className="w-12 h-12 text-slate-700 mx-auto mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-slate-500 text-sm">
                  Run your code to see results
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import { Play, Code2, Terminal, ChevronDown, IndentIncrease, Plus, Minus } from "lucide-react";

const languages = [
  {
    label: "Java",
    language: "java",
    languageId: 62,
    monaco: "java",
    boilerplate: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}`,
  },
  {
    label: "Python",
    language: "python",
    languageId: 71,
    monaco: "python",
    boilerplate: `num = int(input())
print(num)`,
  },
  {
    label: "JavaScript",
    language: "javascript",
    languageId: 63,
    monaco: "javascript",
    boilerplate: `console.log("Hello World")`,
  },
];

export default function Playground() {
  const [selectedLang, setSelectedLang] = useState(languages[0]);
  const [code, setCode] = useState(languages[0].boilerplate);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [font, setFont] = useState(13);

  useEffect(() => {
    const lang = languages[0];
    setSelectedLang(lang);
    setCode(lang.boilerplate);
    setInput("");
    setOutput("");
  }, []);

  const JUDGE0_URL = "https://ce.judge0.com";

  const runCode = async () => {
    setLoading(true);
    setOutput("Running your code...");

    try {
      // Step 1: Create submission
      const submission = await axios.post(
        `${JUDGE0_URL}/submissions?base64_encoded=false&wait=false`,
        {
          source_code: code,
          language_id: selectedLang.languageId,
          stdin: input,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const token = submission.data.token;

      if (!token) {
        throw new Error("Failed to create submission");
      }

      // Step 2: Poll for execution result

      let result;

      for (let attempt = 0; attempt < 30; attempt++) {
        const response = await axios.get(`${JUDGE0_URL}/submissions/${token}`, {
          params: {
            base64_encoded: false,
          },
        });

        result = response.data;

        if (result.status.id > 2) {
          break;
        }

        if (attempt === 29) {
          throw new Error("Execution timed out. Please try again.");
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      // Step 3: Display output
      const finalOutput =
        result.stdout ||
        result.stderr ||
        result.compile_output ||
        result.message ||
        result.status.description ||
        "No output";

      setOutput(finalOutput);
    } catch (err) {
      console.error("Judge0 Error:", err);

      setOutput(
        err.response?.data?.error || err.message || "Error executing code",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (e) => {
    const lang = languages.find((l) => l.language === e.target.value);
    setSelectedLang(lang);
    setCode(lang.boilerplate);
    setInput("");
    setOutput("");
  };

  const increaseFont = () =>{
    setFont(prev => prev+1);
  }
  const decreaseFont =()=>{
    setFont(prev => prev-1);  
  }

  return (
    <div className="h-screen bg-[#0f172a] text-slate-300 flex flex-col font-sans">
      {/* Premium Header */}
      <header className="bg-[#1e293b]/50 backdrop-blur-md border-b border-slate-700/50 px-8 py-4 flex items-center justify-between ">
        <h1 className=" font-bold bg-linear-to-r text-xs md:text-xl from-white to-slate-400 bg-clip-text ">
          Playground
        </h1>

        <div className="flex items-center ml-1 gap-4">
          <div className="relative group">
            <select
              value={selectedLang.language}
              onChange={handleLanguageChange}
              className="appearance-none bg-slate-800 border border-slate-700 rounded-lg md:px-4 md:py-2 py-1 px-1 pr-10 text-xs font-medium text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all cursor-pointer hover:bg-slate-700"
            >
              {languages.map((lang) => (
                <option key={lang.language} value={lang.language}>
                  {lang.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          <button
            onClick={runCode}
            disabled={loading}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white md:px-6 md:py-2 py-1 px-2 rounded-lg text-xs md:text-sm font-semibold transition-all shadow-lg shadow-indigo-500/25 active:scale-95"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Play className="w-4 h-4 fill-current" />
            )}
            {loading ? "Compiling..." : "Run Code"}
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1  flex flex-col md:flex-row gap-0 overflow-hidden">
        {/* Editor Section */}
        <section className="md:flex-1 h-[40vh] md:h-screen flex flex-col border-r border-slate-800">
          <div className="flex items-center justify-between px-6 py-2 bg-[#1e293b]/30 border-b border-slate-800">
            <span className="text-xs md:text-sm">
              {selectedLang.language === "java"
                ? "Main.java"
                : selectedLang.language === "python"
                  ? "Main.py"
                  : "Main.js"}
            </span>
            <span className="text-xs flex gap-3">
              <button className="bg-gray-600/50 rounded-2xl cursor-pointer active:scale-90" onClick={increaseFont}><Plus/></button>
              <button className="bg-gray-600/50 rounded-2xl cursor-pointer active:scale-90" onClick={decreaseFont}><Minus/></button>
            </span>
          </div>
          <div className="flex-1 bg-[#1e293b]/20">
            <Editor
              height="100%"
              language={selectedLang.monaco}
              value={code}
              theme="vs-dark"
              onChange={(val) => setCode(val)}
              options={{
                fontSize: font,
                fontFamily: "'Fira Code', monospace",
                minimap: { enabled: false },
                automaticLayout: true,
                padding: { top: 20 },
                lineNumbers: "on",
                cursorSmoothCaretAnimation: "on",
                smoothScrolling: true,
              }}
            />
          </div>
        </section>

        {/* Console / IO Section */}
        <section className="w-full lg:w-[450px]  flex  flex-col bg-[#0f172a]">
          {/* Input Area */}
          <div className="h-1/2 flex flex-col border-b border-slate-800">
            <div className="flex items-center gap-2 px-6 py-3 bg-[#1e293b]/30 border-b border-slate-800">
              <Terminal className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Standard Input
              </span>

              
            </div>

              

            <textarea
              className="flex-1 w-full bg-[#0f172a] p-6 text-sm font-mono text-indigo-300 focus:outline-none resize-none placeholder:text-slate-700"
              placeholder="Input goes here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>

          {/* Output Area */}
          <div className="h-1/2 flex flex-col">
            <div className="flex items-center gap-2 px-6 py-3 bg-[#1e293b]/30 border-b border-slate-800">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Terminal Output
              </span>
            </div>
            <pre
              className={`flex-1 p-6 text-sm font-mono overflow-auto ${
                output.includes("❌") ? "text-rose-400" : "text-emerald-400"
              }`}
            >
              {output || (
                <span className="text-slate-700 italic">
                  Ready to execute...
                </span>
              )}
            </pre>
          </div>
        </section>
      </main>
    </div>
  );
}

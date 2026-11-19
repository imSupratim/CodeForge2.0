import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Code2, Rocket, CheckCircle } from "lucide-react";
import ShootingStars from "../components/ShootingStars";
import { motion, AnimatePresence } from "framer-motion";

const Home = () => {
  const userName = localStorage.getItem("name");
  const navigate = useNavigate();
  const [launching, setLaunching] = useState(false);

  const handleLaunch = () => {
    setLaunching(true);
    setTimeout(() => {
      navigate("/questions");
    }, 1200);
  };
  return (
    <div className="relative min-h-screen bg-[#0d1117] text-gray-200 overflow-hidden ">
      {/* ⭐ Background Animation */}
      <ShootingStars />

      <motion.div
        animate={launching ? { scale: 1.02, filter: "blur(2px)" } : {}}
        transition={{ duration: 0.4 }}
      >
        {/* Content */}
        <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
          <div className="max-w-4xl w-full text-center mt-4 md:mt-0">
            {userName ? (
              <>
                <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
                  Welcome back,
                  <span className="text-blue-400">
                    {" "}
                    {userName.split(" ")[0]}
                  </span>
                </h1>

                <p className="text-gray-400 text-lg md:text-xl mb-6">
                  Ready to solve some problems and sharpen your coding skills
                  today?
                </p>

                <div className="mb-8 flex flex-wrap justify-center gap-3 text-sm">
                  <span className="px-4 py-2 bg-blue-600/10 border border-blue-600/30 rounded-full text-blue-400">
                    💻 Practice daily
                  </span>
                  <span className="px-4 py-2 bg-green-600/10 border border-green-600/30 rounded-full text-green-400">
                    ✅ Improve accuracy
                  </span>
                  <span className="px-4 py-2 bg-purple-600/10 border border-purple-600/30 rounded-full text-purple-400">
                    🚀 Crack interviews
                  </span>
                </div>
              </>
            ) : (
              <>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Practice Coding.{" "}
                  <span className="text-blue-400">Get Better.</span>
                </h1>

                <p className="text-gray-400 text-lg md:text-xl mb-8">
                  A coding practice platform where you can solve problems,
                  submit code, and track your performance — just like a real
                  coding interview.
                </p>
              </>
            )}

            <p className="text-gray-400 text-lg md:text-xl mb-8">
              A coding practice platform where you can solve problems, submit
              code, and track your performance — just like a real coding
              interview.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              <Feature
                icon={<Code2 size={22} />}
                title="Solve Problems"
                desc="Practice curated coding questions with multiple test cases."
              />
              <Feature
                icon={<CheckCircle size={22} />}
                title="Instant Verdict"
                desc="Get Accepted, Wrong Answer, or Runtime Error instantly."
              />
              <Feature
                icon={<Rocket size={22} />}
                title="Track Progress"
                desc="View submission history and improve step by step."
              />
            </div>

            <div className="relative flex justify-center mb-17">
              <AnimatePresence>
                {!launching ? (

                  
                  <motion.button
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLaunch}
                    className="flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl text-lg font-semibold shadow-lg"
                  >
                    Continue Solving <Rocket className="w-5 h-5" />
                  </motion.button>


                ) : (
                  <motion.div
                    className="flex flex-col items-center"
                    initial={{ y: 0, opacity: 1 }}
                    animate={{ y: -300, opacity: 0 }}
                    transition={{ duration: 1.1, ease: "easeIn" }}
                  >
                    <Rocket className="w-16 h-16 text-blue-400 animate-pulse" />
                    <span className="mt-2 text-sm text-gray-400">
                      Launching...
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
      <div className="absolute mb-17 bottom-4 right-6 z-20 opacity-60 hover:opacity-100 transition-opacity duration-300">
        <p className="text-[10px] md:text-xs font-medium tracking-wide text-gray-500">
          Made with <span className="text-red-500/80">❤</span> by <span className="text-gray-400">Supratim Mandal</span>
        </p>
      </div>
    </div>
  );
};

const Feature = ({ icon, title, desc }) => (
  <div className="bg-white/10 backdrop-blur-sm backdrop-filter border border-white/20 rounded-xl p-6 hover:border-gray-700 transition">
    <div className="flex justify-center mb-3 text-blue-400">{icon}</div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-sm text-gray-400">{desc}</p>
  </div>
);

export default Home;

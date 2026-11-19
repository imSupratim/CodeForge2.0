import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Code2,
  Home,
  Database,
  Terminal,
  LogOut,
  Menu,
  X,
  UserPlus,
  LogIn,
  Newspaper,
  Code,
  Brain,
  Laptop2,
} from "lucide-react";

export default function Navbar() {
  const userName = localStorage.getItem("name");
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isLoggedIn = !!localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    navigate("/login");
    setIsMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: "Home", path: "/", icon: <Home className="w-4 h-4" /> },
    {
      name: "Problems",
      path: "/questions",
      icon: <Terminal className="w-4 h-4" />,
    },
    {
      name: "Submissions",
      path: "/submissions",
      icon: <Database className="w-4 h-4" />,
    },
    {
      name: "DevNews",
      path: "/getnews",
      icon: <Newspaper className="size-4" />
    },
    {
      name: "Playground",
      path: "/playground",
      icon: <Laptop2 className="size-4" />
    },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-800 px-6 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Left - Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Code2 className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white  sm:block">
            Code<span className="text-indigo-400">Forge</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {isLoggedIn ? (
            <>
              <div className="flex items-center space-x-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive(link.path)
                        ? "bg-slate-800 text-white"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                    }`}
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="flex items-center gap-4">
                {/* User Badge */}
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-800/60 rounded-xl border border-slate-700">
                  <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                    {userName?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-slate-200 font-medium">
                    {userName}
                  </span>
                </div>

                {/* Logout */}
                <button
                  onClick={logout}
                  className="flex items-center gap-2 text-slate-400 hover:text-red-400 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="text-slate-300 hover:text-white px-4 py-2 text-sm font-medium transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 transition-all hover:-translate-y-0.5"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#1e293b]  border-b border-slate-800 py-4 px-6 animate-in slide-in-from-top duration-200 transition-all ease-in-out">
          <div className="flex flex-col  space-y-4">
            {isLoggedIn ? (
              <>
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-3 p-3 rounded-xl text-base font-medium ${
                      isActive(link.path)
                        ? "bg-indigo-600/10 text-indigo-400"
                        : "text-slate-300"
                    }`}
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                ))}
                <hr className="border-slate-800" />
                <div className="flex items-center gap-3 p-3 bg-slate-800/60 rounded-xl border border-slate-700">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                    {userName?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm text-slate-200 font-semibold">
                      {userName}
                    </p>
                    <p className="text-xs text-slate-400">Logged in</p>
                  </div>
                </div>

                <button
                  onClick={logout}
                  className="flex items-center gap-3 p-3 text-red-400 font-medium"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 p-3 text-slate-300 font-medium"
                >
                  <LogIn className="w-5 h-5" /> Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 p-3 bg-indigo-600 rounded-xl text-white font-medium text-center justify-center"
                >
                  <UserPlus className="w-5 h-5" /> Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

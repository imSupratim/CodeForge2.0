import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, UserPlus, Rocket } from "lucide-react";
import api from "../api/axios";
import ShootingStars from "../components/ShootingStars";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/auth/register", formData);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center px-4">
      <ShootingStars />

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/10 backdrop-filter backdrop-blur-sm border-white/50 border  rounded-2xl p-8 shadow-xl relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white flex gap-2 justify-center items-center">
            Join the Arena <Rocket className="size-7" />
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Create an account to start solving problems
          </p>
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-400 text-sm mb-4 text-center">{error}</p>
        )}

        {/* Name */}
        <div className="mb-4">
          <label className="text-sm text-gray-400">Name</label>
          <div className="flex items-center bg-[#0d1117]/40 border border-gray-700 rounded-lg px-3 mt-1">
            <User size={16} className="text-gray-500" />
            <input
              name="name"
              className="bg-transparent outline-none text-white w-full p-2"
              placeholder="John Doe"
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="text-sm text-gray-400">Email</label>
          <div className="flex items-center bg-[#0d1117]/40 border border-gray-700 rounded-lg px-3 mt-1">
            <Mail size={16} className="text-gray-500" />
            <input
              name="email"
              type="email"
              className="bg-transparent outline-none text-white w-full p-2"
              placeholder="you@example.com"
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="text-sm text-gray-400">Password</label>
          <div className="flex items-center bg-[#0d1117]/40 border border-gray-700 rounded-lg px-3 mt-1">
            <Lock size={16} className="text-gray-500" />
            <input
              name="password"
              type="password"
              className="bg-transparent outline-none text-white w-full p-2"
              placeholder="••••••••"
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Button */}
        <button
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white py-2 rounded-lg font-semibold transition"
        >
          <UserPlus size={18} />
          {loading ? "Creating account..." : "Register"}
        </button>

        {/* Footer */}
        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

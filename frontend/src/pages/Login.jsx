import { useState } from "react"
import api from "../api/axios"
import { useNavigate, Link } from "react-router-dom"
import { LogIn, Mail, Lock, Laptop } from "lucide-react"
import ShootingStars from "../components/ShootingStars"
import toast from "react-hot-toast"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const res = await api.post("/auth/login", { email, password })
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("name", res.data.name);
      toast.success("Logged in successfully")
      navigate("/")
    } catch (err) {
      toast.error(err.response.data.message);
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center px-4">
      <ShootingStars/>
      <form
        onSubmit={submit}
        className="w-full max-w-md bg-white/10 backdrop-filter backdrop-blur-sm border-white/50 border  rounded-2xl p-8 shadow-xl relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white flex justify-center items-center gap-2">Welcome Back <Laptop className="size-7 text-blue-600"/> </h1>
          <p className="text-gray-400 text-sm mt-1">
            Login to continue solving problems
          </p>
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="text-sm text-gray-400">Email</label>
          <div className="flex items-center bg-[#0d1117]/40 border border-gray-700 rounded-lg px-3 mt-1">
            <Mail size={16} className="text-gray-500" />
            <input
              className="bg-transparent outline-none text-white w-full p-2"
              placeholder="you@example.com"
              onChange={(e) => setEmail(e.target.value)}
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
              type="password"
              className="bg-transparent outline-none text-white w-full p-2"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Button */}
        <button
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-blue-600/70 hover:bg-blue-600 cursor-pointer disabled:opacity-50 text-white py-2 rounded-lg font-semibold transition"
        >
          <LogIn size={18} />
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Footer */}
        <p className="text-center text-sm text-gray-400 mt-6">
          New here?{" "}
          <Link to="/register" className="text-blue-400 hover:underline">
            Create an account
          </Link>
        </p>
      </form>
      
    </div>
  )
}

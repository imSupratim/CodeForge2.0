import React, { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import api from "../api/axios.js"
import Editor from "@monaco-editor/react"
import { 
  Code2, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Database, 
  Calendar, 
  Trophy,
  ChevronLeft
} from "lucide-react"

const SubmissionDetails = () => {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [submission, setSubmission] = useState(null)

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        setLoading(true)
        const res = await api.get(`/submissions/my/${id}`)
        setSubmission(res.data)
      } catch (error) {
        console.error("Error fetching submission details:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchSubmission()
  }, [id])

  if (loading) return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  )

  if (!submission) return (
    <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center">
      <p className="text-xl opacity-50">No submission found</p>
    </div>
  )

  const isAccepted = submission.status === "Accepted"

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation/Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <Link
            to="/submissions"
             className="flex items-center text-slate-400 hover:text-white transition-colors mb-2 text-sm group">
              <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
              Back to Submissions
            </Link>
            <h1 className="text-3xl font-bold tracking-tight text-white">Submission Details</h1>
          </div>

          <div className={`flex items-center px-4 py-2 rounded-lg border ${
            isAccepted 
            ? "bg-green-500/10 border-green-500/20 text-green-400" 
            : "bg-red-500/10 border-red-500/20 text-red-400"
          }`}>
            {isAccepted ? <CheckCircle2 className="w-5 h-5 mr-2" /> : <XCircle className="w-5 h-5 mr-2" />}
            <span className="font-bold uppercase tracking-wider text-sm">{submission.status}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard 
            label="Language" 
            value={submission.language.toUpperCase()} 
            icon={<Code2 className="text-blue-400" />} 
          />
          <StatCard 
            label="Test Cases" 
            value={`${submission.passed} / ${submission.total}`} 
            icon={<Trophy className="text-yellow-400" />} 
          />
          <StatCard 
            label="Runtime" 
            value={submission.executionTime ? `${submission.executionTime}ms` : "N/A"} 
            icon={<Clock className="text-purple-400" />} 
          />
          <StatCard 
            label="Memory" 
            value={submission.memoryUsed ? `${submission.memoryUsed}` : "N/A"} 
            icon={<Database className="text-emerald-400" />} 
          />
        </div>

        {/* Info & Code Section */}
        <div className="space-y-4">
          <div className="flex items-center text-slate-400 text-sm">
            <Calendar className="w-4 h-4 mr-2" />
            <span>Submitted on {new Date(submission.createdAt).toLocaleString(undefined, {
              dateStyle: 'long',
              timeStyle: 'short'
            })}</span>
          </div>

          <div className="rounded-2xl overflow-hidden border border-slate-700 shadow-2xl bg-[#1e293b]">
            <div className="bg-[#1e293b] border-b border-slate-700 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/40"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/40"></div>
                </div>
                <span className="ml-4 text-xs font-mono text-slate-400 uppercase tracking-widest">
                  main.{submission.language}
                </span>
              </div>
            </div>

            <div className="relative">
              <Editor
                height="500px"
                language={submission.language}
                value={submission.code}
                theme="vs-dark"
                options={{
                  readOnly: true,
                  minimap: { enabled: true },
                  fontSize: 15,
                  padding: { top: 20 },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
                  renderLineHighlight: "all",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const StatCard = ({ label, value, icon }) => (
  <div className="bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm p-5 rounded-2xl hover:border-slate-500 transition-colors group">
    <div className="flex items-center justify-between mb-3">
      <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</span>
      <div className="p-2 bg-slate-900 rounded-lg group-hover:scale-110 transition-transform">
        {icon}
      </div>
    </div>
    <p className="text-xl font-bold text-white">{value}</p>
  </div>
)

export default SubmissionDetails
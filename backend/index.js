import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import { protect } from "./middlewares/authMiddleware.js";
import judgeRoutes from "./routes/judgeRoutes.js";
import submissionRoutes from "./routes/submissionRoutes.js";
import newsRoute from "./routes/newsRoutes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    // origin: "http://localhost:5173",
    origin: "https://code-forge2-0.vercel.app",
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running..");
});

app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: "You are authorized",
    user: req.user,
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/judge", judgeRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/news", newsRoute);

connectDB();
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});

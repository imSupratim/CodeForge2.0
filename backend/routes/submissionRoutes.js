import express from "express";
import { getDetailsOfOneSubmission, getMySubmissions, submitCode } from "../controllers/submissionController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/submit", protect ,submitCode);
router.get("/my", protect, getMySubmissions);
router.get("/my/:id" , protect, getDetailsOfOneSubmission );

export default router;

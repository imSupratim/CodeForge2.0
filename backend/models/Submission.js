import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false // add auth later
    },

    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true
    },

    language: {
      type: String,
      required: true
    },

    code: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: [
        "Accepted",
        "Wrong Answer",
        "Time Limit Exceeded",
        "Runtime Error",
        "Compilation Error"
      ],
      required: true
    },

    passed: Number,
    total: Number,

    executionTime: String,
    memoryUsed: String
  },
  { timestamps: true }
);

export default mongoose.model("Submission", submissionSchema);

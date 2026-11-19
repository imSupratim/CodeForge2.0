import mongoose from "mongoose"

const testCaseSchema = new mongoose.Schema({
  input: {
    type: String,
    required: true
  },
  output: {
    type: String,
    required: true
  },
  hidden: Boolean,
})


const questionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true
    },
    inputFormat: String,
    outputFormat: String,
    constraints: String,
    sampleInput: String,
    sampleOutput: String,
    tags: [String],
    testcases: [testCaseSchema],
  },
  { timestamps: true }
)

const Question = mongoose.model("Question", questionSchema)


export default Question;
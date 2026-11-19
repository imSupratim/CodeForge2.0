import Question from "../models/Question.js"

export const getAllQuestions = async (req, res) => {
  const questions = await Question.find().select("title difficulty tags")
  res.json(questions)
}

export const getQuestionById = async (req, res) => {
  const question = await Question.findById(req.params.id)
  if (!question)
    return res.status(404).json({ message: "Question not found" })

  res.json(question)
}


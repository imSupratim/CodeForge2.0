import Question from "../models/Question.js";
import Submission from "../models/Submission.js";
import { runCodeOnJudge0 } from "../services/judge0Service.js";
import { runCodeOnPiston } from "../services/pistonServices.js";

const saveSubmission = async ({
  user,
  question,
  language,
  code,
  status,
  passed,
  total,
  executionTime,
  memoryUsed,
}) => {
  await Submission.create({
    user,
    question,
    language,
    code,
    status,
    passed,
    total,
    executionTime,
    memoryUsed,
  });
};

export const submitCode = async (req, res) => {
  try {
    const { questionId, language, code } = req.body;
    const userId = req.user.id;

    // 1. Validate request
    if (!questionId || !language || !code?.trim()) {
      return res.status(400).json({
        message: "Missing fields",
      });
    }

    const supportedLanguages = ["javascript", "python", "cpp", "java"];

    if (!supportedLanguages.includes(language)) {
      return res.status(400).json({
        message: "Unsupported programming language",
      });
    }

    // 2. Fetch question
    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    const total = question.testcases.length;

    let passed = 0;
    let maxTime = 0;
    let maxMemory = 0;

    // 3. Execute code against every testcase
    for (let i = 0; i < total; i++) {
      const testcase = question.testcases[i];

      const result = await runCodeOnJudge0({
        language,
        code,
        input: testcase.input,
      });

      const statusId = result.status?.id;

      // Convert Judge0 execution metrics
      const executionTime = Number(result.time || 0);
      const memory = Number(result.memory || 0);

      maxTime = Math.max(maxTime, executionTime);
      maxMemory = Math.max(maxMemory, memory);

      const executionTimeMs = Number((maxTime * 1000).toFixed(2));

      const memoryMB = Number((maxMemory / 1024).toFixed(2));

      // 4. Compilation Error
      if (statusId === 6) {
        await saveSubmission({
          user: userId,
          question: question._id,
          language,
          code,
          status: "Compilation Error",
          passed,
          total,
          executionTime: "N/A",
          memoryUsed: "N/A",
        });

        return res.json({
          status: "Compilation Error",
          error: result.compile_output || "Compilation failed",
          passed,
          total,
          executionTime: executionTimeMs,
          memoryUsed: `${memoryMB} MB`,
        });
      }

      // 5. Time Limit Exceeded
      if (statusId === 5) {
        await saveSubmission({
          user: userId,
          question: question._id,
          language,
          code,
          status: "Time Limit Exceeded",
          passed,
          total,
          executionTime: "TLE",
          memoryUsed: `${memoryMB} MB`,
        });

        return res.json({
          status: "Time Limit Exceeded",
          passed,
          total,
          executionTime: executionTimeMs,
          memoryUsed: `${memoryMB} MB`,
        });
      }

      // 6. Runtime Error
      if (statusId >= 7 && statusId <= 12) {
        await saveSubmission({
          user: userId,
          question: question._id,
          language,
          code,
          status: "Runtime Error",
          passed,
          total,
          executionTime: executionTimeMs,
          memoryUsed: `${memoryMB} MB`,
        });

        return res.json({
          status: "Runtime Error",
          error: result.stderr || result.message || result.status.description,
          passed,
          total,
          executionTime: executionTimeMs,
          memoryUsed: `${memoryMB} MB`,
        });
      }

      // 7. Judge0 Internal / Execution Error
      if (statusId !== 3) {
        throw new Error(
          result.message ||
            result.status?.description ||
            "Judge0 execution failed",
        );
      }

      // 8. Compare actual output with expected output
      const stdout = (result.stdout || "").trim();
      const expected = testcase.output.trim();

      // Wrong Answer
      if (stdout !== expected) {
        await saveSubmission({
          user: userId,
          question: question._id,
          language,
          code,
          status: "Wrong Answer",
          passed,
          total,
          executionTime: executionTimeMs,
          memoryUsed: `${memoryMB} MB`,
        });

        return res.json({
          status: "Wrong Answer",
          failedTestcase: testcase.hidden ? "Hidden Testcase" : testcase.input,
          expected: testcase.hidden ? "Hidden" : expected,
          received: stdout,
          passed,
          total,
          executionTime: executionTimeMs,
          memoryUsed: `${memoryMB} MB`,
        });
      }

      // 9. Testcase passed
      passed++;
    }

    // 10. All testcases passed
    const executionTimeMs = Number((maxTime * 1000).toFixed(2));

    const memoryMB = Number((maxMemory / 1024).toFixed(2));

    await saveSubmission({
      user: userId,
      question: question._id,
      language,
      code,
      status: "Accepted",
      passed,
      total,
      executionTime: `${executionTimeMs} ms`,
      memoryUsed: `${memoryMB} MB`,
    });

    return res.json({
      status: "Accepted",
      passed,
      total,
      executionTime: executionTimeMs,
      memoryUsed: `${memoryMB} MB`,
    });
  } catch (error) {
    console.error("Submission Error:", error);

    return res.status(500).json({
      status: "Error",
      message: "Code execution failed",
    });
  }
};

export const getMySubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ user: req.user.id })
      .populate("question", "title difficulty")
      .sort({ createdAt: -1 });

    res.json({
      count: submissions.length,
      submissions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch submissions" });
  }
};

export const getDetailsOfOneSubmission = async (req, res) => {
  const submission = await Submission.findById(req.params.id);
  if (!submission) {
    return res.status(404).json({ message: "Submission not found" });
  }

  res.json(submission);
};

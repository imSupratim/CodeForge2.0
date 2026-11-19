import axios from "axios";

export const runCode = async (req, res) => {
  try {
    const { source_code, language, stdin } = req.body;

    const versions = {
      javascript: "18.15.0",
      python: "3.10.0",
      cpp: "10.2.0",
      java: "15.0.2",
    };

    if (!source_code || !language) {
      return res.status(400).json({ message: "Code and language required" });
    }

    const response = await axios.post(
      "https://emkc.org/api/v2/piston/execute",
      {
        language,
        version: versions[language],
        files: [
          {
            content: source_code,
          },
        ],
        stdin,
      },
    );

    res.json({
      stdout: response.data.run.stdout,
      stderr: response.data.run.stderr,
      exitCode: response.data.run.code,
    });
  } catch (error) {
    console.error(error.response.data.message);
    res.status(500).json({ message: "Execution failed" });
  }
};


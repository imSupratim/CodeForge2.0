
import axios from "axios";

const JUDGE0_URL =
  process.env.JUDGE0_URL || "https://ce.judge0.com";

const languageIds = {
  javascript: 63,
  python: 71,
  cpp: 54,
  java: 62,
};

// Wait for Judge0 to finish executing the submission
const waitForResult = async (token) => {
  const maxAttempts = 30;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const response = await axios.get(
      `${JUDGE0_URL}/submissions/${token}`,
      {
        params: {
          base64_encoded: false,
        },
        timeout: 10000,
      }
    );

    const result = response.data;

    // Status 1 = In Queue
    // Status 2 = Processing
    // Status 3 onwards = Finished
    if (result.status?.id > 2) {
      return result;
    }

    if (attempt === maxAttempts - 1) {
      throw new Error("Judge0 execution polling timed out");
    }

    // Wait 1 second before checking again
    await new Promise((resolve) =>
      setTimeout(resolve, 1000)
    );
  }
};

// Submit code and get the execution result
export const runCodeOnJudge0 = async ({
  language,
  code,
  input,
}) => {
  const languageId = languageIds[language];

  if (!languageId) {
    throw new Error("Unsupported programming language");
  }

  // Step 1: Create a submission
  const submissionResponse = await axios.post(
    `${JUDGE0_URL}/submissions`,
    {
      source_code: code,
      language_id: languageId,
      stdin: input,
    },
    {
      params: {
        base64_encoded: false,
        wait: false,
      },
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 10000,
    }
  );

  const token = submissionResponse.data.token;

  if (!token) {
    throw new Error("Judge0 did not return a submission token");
  }

  // Step 2: Wait for execution result
  const result = await waitForResult(token);

  // Step 3: Return result to controller
  return result;
};

import axios from "axios";

export const runCodeOnPiston = async ({ language, version, code, input }) => {
  const response = await axios.post("https://emkc.org/api/v2/piston/execute", {
    language,
    version,
    files: [
      {
        name: "main",
        content: code,
      },
    ],
    stdin: input,
    run_timeout: 10000 // 10 seconds
  });

  return response.data;
};

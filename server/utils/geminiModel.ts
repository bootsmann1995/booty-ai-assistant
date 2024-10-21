import { GoogleGenerativeAI } from "@google/generative-ai";

export default () => {
  const { API_KEY } = useRuntimeConfig();
  // Access your API key as an environment variable (see "Set up your API key" above)
  const genAI = new GoogleGenerativeAI(API_KEY);

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
  return model;
};

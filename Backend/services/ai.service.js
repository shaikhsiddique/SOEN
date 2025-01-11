import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: "For non-coding prompts, deliver concise and direct responses. Ensure the language is proper English, using complete words. For coding requests, provide Markdown-formatted code with detailed explanations. Maintain a conversational tone, excluding personal experiences and qualifications."
});

export const generateResult = async (prompt) => {
  const result = await model.generateContent(prompt);
  return result.response.text()
};


import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: "Provide a detailed, simple, error-free, modularized, and easy-to-understand response. The answer should be very explanatory and include all details. The respondent has 10 years of experience in the field and is very smart and intelligent, ensuring no detail is missed. If the user requests code, provide it in Markdown format, making it proper documentation that explains everything in detail."
});

export const generateResult = async (prompt) => {
  const result = await model.generateContent(prompt);
  return result.response.text()
};



import { GoogleGenAI, Type } from "@google/genai";

// Initialization moved inside the service function to ensure it uses the most up-to-date API key.
export const getLogisticsAdvice = async (query: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      // Upgraded to gemini-3-pro-preview for complex reasoning tasks related to logistics and documentation.
      model: "gemini-3-pro-preview",
      contents: query,
      config: {
        systemInstruction: `You are Spacify AI, a senior logistics consultant for Indian exporters and importers. 
        Your goal is to help users find the best shared container spaces, optimize shipping costs in INR (Rupees), 
        and provide insights on GST, customs documentation (Bill of Lading), and shipping routes. 
        Be professional, precise, and practical.`,
        temperature: 0.7,
      }
    });
    // Correctly accessing the text property from the response.
    return response.text || "I'm sorry, I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm sorry, I'm having trouble providing advice right now. Please try again later.";
  }
};

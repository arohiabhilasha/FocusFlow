
import { GoogleGenAI, Type } from "@google/genai";

// Lazy-initialize AI to ensure process.env is ready
let aiInstance: GoogleGenAI | null = null;

const getAI = () => {
  if (!aiInstance) {
    const apiKey = (window as any).process?.env?.API_KEY || "";
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
};

export const suggestTasks = async (userInput: string): Promise<string[]> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Suggest 5 concise, actionable daily goals based on this intent: "${userInput}". Keep them short (under 40 characters).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["suggestions"]
        }
      },
    });

    const text = response.text || "{}";
    const data = JSON.parse(text);
    return data.suggestions || [];
  } catch (error) {
    console.error("Error suggesting tasks:", error);
    // Fallback static suggestions if API fails
    return [
      "Read for 15 mins",
      "Short morning stretch",
      "Organize desk space",
      "Drink 2L of water",
      "Plan tomorrow's top 3"
    ];
  }
};

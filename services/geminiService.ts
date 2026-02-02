
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const suggestTasks = async (userInput: string): Promise<string[]> => {
  try {
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

    const data = JSON.parse(response.text);
    return data.suggestions || [];
  } catch (error) {
    console.error("Error suggesting tasks:", error);
    return ["Read for 15 mins", "Stretch session", "Inbox zero", "Drink 2L water", "Plan tomorrow"];
  }
};

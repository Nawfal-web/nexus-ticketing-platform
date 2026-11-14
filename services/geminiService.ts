import { GoogleGenAI } from "@google/genai";

// Safely access process.env to avoid ReferenceError in browser ESM environments
const getApiKey = () => {
  try {
    return (typeof process !== 'undefined' && process.env && process.env.API_KEY) || '';
  } catch (e) {
    return '';
  }
};

const apiKey = getApiKey();

const ai = new GoogleGenAI({ apiKey });

export const generateEventDescription = async (title: string, category: string, keywords: string): Promise<string> => {
  if (!apiKey) {
    console.warn("API Key missing for Gemini");
    return "AI generation unavailable without API Key. Please configure process.env.API_KEY.";
  }

  try {
    const prompt = `Write a catchy, professional, and exciting description (max 100 words) for an event titled "${title}" in the category "${category}". Keywords to include: ${keywords}. return only the text.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || 'No description generated.';
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Failed to generate description via AI.";
  }
};

export const chatWithAI = async (message: string, contextData: string): Promise<string> => {
  if (!apiKey) {
    return "I'm currently offline (API Key missing). Please contact support manually.";
  }

  try {
    const systemInstruction = `You are "NexusBot", a helpful, polite, and professional customer service AI for the "Nexus Tickets" website. 
    You help users with event information, booking guidance, payment issues, and refunds.
    
    Here is the current event data available on the platform:
    ${contextData}
    
    Guidelines:
    - Be concise and friendly.
    - If a user asks about an event, check the provided data.
    - If asked about payments: "We accept all major credit cards. Payments are secure."
    - If asked about refunds: "Refunds are available for cancellations made 48 hours before the event."
    - Do not invent events that are not in the data.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: message,
        config: {
            systemInstruction: systemInstruction,
        }
    });

    return response.text || "I didn't catch that. Could you please repeat?";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "I'm having trouble connecting to my brain right now. Please try again later.";
  }
}
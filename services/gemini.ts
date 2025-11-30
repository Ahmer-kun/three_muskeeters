import { GoogleGenAI } from "@google/genai";

// Use environment variable
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const FALLBACK_POEM = `
🎉 Happy Birthday to the amazing trio! 🎉

Maheen, Masaid, and Maaz - three stars so bright,
Born on December 17th, shining with light!
Through all the seasons, through thick and thin,
A bond of cousins that will always win!

May your day be filled with laughter and cheer,
With cake and presents, and all you hold dear!
This birthday wish comes straight from the heart,
For an awesome new year and a fresh new start!

✨ (AI is taking a break, but the love is real!) ✨
`;

const FALLBACK_FACTS = `
📅 **December 17th Fun Facts:**

• **1903:** Wright Brothers' first successful flight!
• **1989:** The Simpsons TV series premiered
• **Festive Season:** Perfect time for birthday celebrations
• **Winter Magic:** Snow, holidays, and triple the cake!
`;

export const generateBirthdayPoem = async (userPrompt: string): Promise<string> => {
  console.log('🎯 AI Poet called with prompt:', userPrompt);
  
  // If no API key or prompt, return fallback
  if (!apiKey || !userPrompt.trim()) {
    return FALLBACK_POEM;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `Create a fun, creative birthday poem based on this request: "${userPrompt}". Keep it under 150 words.`
    });

    return response.text || FALLBACK_POEM;
  } catch (error) {
    console.error("❌ Gemini API Error:", error);
    return FALLBACK_POEM;
  }
};

export const getDayFacts = async (): Promise<string> => {
  if (!apiKey) {
    return FALLBACK_FACTS;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: "Give me 3 interesting facts about December 17th in short bullet points."
    });
    
    return response.text || FALLBACK_FACTS;
  } catch (error) {
    console.error("Gemini Facts Error:", error);
    return FALLBACK_FACTS;
  }
};

import { GoogleGenAI } from "@google/genai";

// API Key - Production ke liye environment variable se
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyBnKU3_doDt4jviS_oVSMbKCwpyer88lTM';
const ai = new GoogleGenAI({ apiKey });

const MODEL_NAME = 'gemini-2.0-flash'; // Updated model name

// Fallback content
const FALLBACK_POEM = `
Roses are red, violets are blue,
It's your birthday, and we're happy for you!
Maheen, Masaid, and Maaz - what a crew,
Here's a birthday wish, especially for you!

May your day be filled with laughter and cheer,
With cake and presents, and all you hold dear.
Though the AI is taking a little break,
The love in this message is not fake!

Happy Birthday to the legendary three,
From all of your family, with love and glee!
`;

const FALLBACK_FACTS = `
* **1903:** Wright Brothers' first successful flight
* **1989:** The Simpsons TV series premiered
* **Birthstones:** Turquoise and Zircon
* **Famous Birthdays:** Pope Francis, Milla Jovovich
`;

/**
 * Generates a personalized birthday poem
 */
export const generateBirthdayPoem = async (userPrompt: string): Promise<string> => {
  console.log('🚀 AI Poet called with prompt:', userPrompt);
  console.log('🔑 API Key exists:', !!apiKey);
  
  // If no API key or prompt, return fallback
  if (!apiKey || !userPrompt.trim()) {
    console.warn('❌ No API key or prompt');
    return FALLBACK_POEM;
  }

  try {
    console.log('📡 Calling Gemini API...');
    
    const finalPrompt = `
      You are a creative poet writing for a birthday celebration.
      The user wants a poem based on: "${userPrompt}"
      
      Context: This is for three cousins - Maheen, Masaid, and Maaz - celebrating their birthday on December 17th.
      
      Requirements:
      - Make it fun, creative, and birthday-themed
      - Keep it under 150 words
      - Add some humor if appropriate
      - Make it personal and engaging
      
      Write the poem now:
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: finalPrompt,
    });

    console.log('✅ AI Response received');
    
    // Safely extract text from response
    const poemText = response.text || FALLBACK_POEM;
    return poemText;

  } catch (error) {
    console.error("❌ Gemini API Error:", error);
    return FALLBACK_POEM;
  }
};

/**
 * Generates fun facts about December 17th
 */
export const getDayFacts = async (): Promise<string> => {
  if (!apiKey) {
    return FALLBACK_FACTS;
  }

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: "Give me 3-4 interesting historical or pop culture facts about December 17th. Keep them short and engaging. Format as bullet points.",
    });
    
    return response.text || FALLBACK_FACTS;
  } catch (error) {
    console.error("Gemini Facts Error:", error);
    return FALLBACK_FACTS;
  }
};

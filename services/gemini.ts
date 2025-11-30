import { GoogleGenAI } from "@google/genai";

// Ensure API key is available
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const MODEL_NAME = 'gemini-2.5-flash';

// Fallback content in case API fails or key is missing during the party
const FALLBACK_POEM = `
Upon the seventeenth of cold December,
A triple birthday we shall remember!
For Maheen, Masaid, and Maaz are here,
To bring us joy and holiday cheer.
The cake is sweet, the candles glow,
For the coolest cousins that we know.
Happy Birthday to the legendary crew,
May all your wishes and dreams come true!
(Note: AI is taking a nap, but the love is real!)
`;

const FALLBACK_FACTS = `
*   **Wright Brothers Day:** On December 17, 1903, the Wright Brothers made their first successful flight!
*   **The Simpsons:** The very first episode of The Simpsons aired on this day in 1989.
*   **Saturnalia:** In ancient Rome, the festival of Saturnalia (the inspiration for many holiday traditions) began on Dec 17.
`;

/**
 * Generates a personalized birthday poem based on user prompt.
 */
export const generateBirthdayPoem = async (userPrompt: string): Promise<string> => {
  console.log('🔑 API Key exists:', !!apiKey);
  console.log('📝 User prompt:', userPrompt);
  
  if (!apiKey) {
    console.warn("❌ API Key missing, using fallback poem.");
    return FALLBACK_POEM;
  }

  try {
    console.log('🚀 Making API call to Gemini...');
    
    const finalPrompt = `
      You are an expert poet for a birthday website.
      The user wants you to write a poem based on the following request: "${userPrompt}".
      
      Context: The birthday celebration is for three cousins: Maheen, Masaid, and Maaz (born Dec 17).
      Make it creative, rhythmically pleasing, and fun. Keep it under 200 words.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: finalPrompt,
    });

    console.log('✅ API Response:', response);
    console.log('📜 Generated poem:', response.text);
    
    return response.text || FALLBACK_POEM;
  } catch (error) {
    console.error("❌ Gemini API Error:", error);
    return FALLBACK_POEM;
  }
};


/**
 * Generates fun facts about December 17th.
 */
export const getDayFacts = async (): Promise<string> => {
  if (!apiKey) {
    return FALLBACK_FACTS;
  }

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: "Give me 3 short, fascinating historical or pop-culture facts about December 17th. Format them as a bulleted list.",
    });
    return response.text || FALLBACK_FACTS;
  } catch (error) {
    console.error("Gemini API Error (Facts):", error);
    return FALLBACK_FACTS;
  }
};

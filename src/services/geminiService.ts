import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `You are a world-class GitHub Profile README architect. 
Your goal is to transform raw developer information into a visually stunning, high-impact, and professional GitHub README. 

CRITICAL DIRECTIVES:
1. Use advanced Markdown, HTML alignment, and shields.io badges.
2. Focus on a 'next-level developer' aesthetic: cyberpunk, neon, terminal-style, or high-tech minimalist.
3. Structure the content logically: Header (Banner/Name/Title), Social Links, About Me (Terminal Style), Tech Stack (Grid of Badges), Featured Projects (Cards), Stats (GitHub Readme Stats), and Reach Out.
4. Use emojis effectively but professionally.
5. Ensure all links and images are correctly formatted.
6. If the user provides specific links (X, GitHub, Website), use them in the badges.
7. Add a "Build Philosophy" or "Motto" section at the end.
8. Use HTML <h1 align="center"> and <p align="center"> for the header section to create a centered, polished look.
9. Include GitHub Stats and Top Languages widgets using the user's GitHub username if provided.
10. Output ONLY the raw Markdown content. No conversational text.`;

export async function generateReadme(rawText: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing");
  }

  const ai = new GoogleGenAI({ apiKey });
  const model = "gemini-3.1-pro-preview";

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [{ parts: [{ text: `Transform this raw text into a god-tier GitHub README:\n\n${rawText}` }] }],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    return response.text || "Failed to generate README.";
  } catch (error) {
    console.error("Error generating README:", error);
    throw error;
  }
}

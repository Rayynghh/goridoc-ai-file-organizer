"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
// Provide a dummy mock response if no API key is present for testing 
const isMockMode = !apiKey;

export async function categorizeDocument(formData: FormData): Promise<{ category: string | null, error?: string }> {
  const file = formData.get("file") as File | null;
  const filename = file ? file.name : (formData.get("filename") as string) || "Unknown File";
  const existingCategoriesStr = formData.get("existingCategories") as string | null;
  const existingCategories = existingCategoriesStr ? JSON.parse(existingCategoriesStr) : [];

  if (isMockMode) {
    console.log(`[MOCK MODE] Categorizing: ${filename}`);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simple mock logic for dynamic categories
    const lowerName = filename.toLowerCase();
    if (lowerName.includes("code") || lowerName.includes("js") || lowerName.includes("py")) {
      return { category: "Source Code" };
    }
    if (lowerName.includes("assign") || lowerName.includes("hw") || lowerName.includes("task")) {
      return { category: "Homework" };
    }
    if (lowerName.includes("help") || lowerName.includes("guide") || lowerName.includes("manual")) {
      return { category: "Documentation" };
    }
    if (lowerName.includes("tax") || lowerName.includes("receipt") || lowerName.includes("invoice")) {
      return { category: "Financial" };
    }
    return { category: "Misc Files" };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey!);

    let inlineData: any = undefined;
    if (file && file.size > 0) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const base64Data = Buffer.from(arrayBuffer).toString("base64");
        inlineData = {
          inlineData: {
            data: base64Data,
            mimeType: file.type || "text/plain",
          }
        };
      } catch (e) {
        console.error("Failed to read file for Gemini:", e);
      }
    }

    const prompt = `
You are an expert file organizer, similar to a high-end AI research assistant.
I have a file named: "${filename}"
${inlineData ? "I have also provided the file contents." : "I could not provide the file contents, so you must rely on the filename."}

Task: Categorize this file into a broad, overarching category or folder name (1 to 3 words max).

Rules:
1. ONLY return the folder name. Do not explain. Do not use quotes.
2. Capitalize the first letter of each word (Title Case).
3. EXISTING CATEGORIES: ${existingCategories.length > 0 ? existingCategories.join(', ') : "None yet."}
   - If the file CLEARLY belongs in one of these existing categories, return the EXACT name of that existing category.
   - Do NOT force a file into an existing category if they are unrelated. If it's a different topic, create a new broad category.
4. Group related concepts together under a shared, broad category. For example:
   - If files are "algoritma pembentuk garis" and "algoritma pembentuk lingkaran", group them both under a new or existing "Algorithms" category.
   - If files are "math homework 1" and "algebra test", group them under "Mathematics".
   - If files are "Q1 Taxes" and "Invoice #123", group them under "Financials".
5. Keep categories broad enough to hold multiple related files, but specific enough to be useful.
6. If the file is completely ambiguous and the content doesn't help, return "Miscellaneous".
`;

    const requestParts = inlineData ? [prompt, inlineData] : [prompt];

    let text = "";
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const attemptGenerate = async (parts: any[]) => {
      let retries = 5;
      while (retries > 0) {
        try {
          const result = await model.generateContent(parts);
          return result.response.text().trim();
        } catch (apiError: any) {
          const isOverloaded = apiError?.status === 503 || apiError?.message?.includes("503") || apiError?.message?.includes("overloaded");
          
          if (isOverloaded) {
            console.warn("Model overloaded, retrying in 5 seconds...");
            await new Promise(resolve => setTimeout(resolve, 5000));
            retries--;
            continue;
          }
          
          // Bubble up other errors immediately
          throw apiError;
        }
      }
      throw new Error("Max retries exceeded after model overloaded.");
    };

    try {
      text = await attemptGenerate(requestParts);
    } catch (apiError: any) {
      if (inlineData) {
        console.warn("Failed with inlineData (possibly unsupported mime type or too large), falling back to prompt only.", apiError.message);
        text = await attemptGenerate([prompt]);
      } else {
        throw apiError;
      }
    }
    
    // Strip quotes just in case the AI didn't listen
    const cleanText = text.replace(/^["']|["']$/g, '');
    
    return { category: cleanText || "Uncategorized" };
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    let errorMessage = "Failed to categorize document.";
    
    if (error?.status === 429) {
      errorMessage = "Rate limit exceeded (Too Many Requests). Please check your API quota or try again later.";
    } else if (error?.status === 400 || error?.message?.toLowerCase().includes("api key")) {
      errorMessage = "API key is invalid or expired. Please use a valid Google AI Studio key.";
    } else {
      errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
    }
    
    return { category: null, error: errorMessage };
  }
}

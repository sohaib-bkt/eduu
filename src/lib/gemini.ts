import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");

export async function analyzeLessonMedia(mediaUrl: string, mediaType: 'video' | 'audio' | 'pdf') {
  if (!import.meta.env.VITE_GEMINI_API_KEY) {
    throw new Error("Gemini API Key is missing. Please add VITE_GEMINI_API_KEY to your .env file.");
  }

  
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    // Enforcing JSON output via generationConfig
    generationConfig: {
      responseMimeType: "application/json",
    }
  });

  const prompt = `
    Analyze the following ${mediaType} material located at this URL: ${mediaUrl}
    
    CRITICAL INSTRUCTION: You must base your summary and quiz STRICTLY and ONLY on the actual content provided in the material. Do not hallucinate or use external knowledge. The summary and the quiz must precisely reflect the information, concepts, and details presented in the media.
    
    Provide:
    1. A detailed summary of the lesson (roughly 300-500 words) that accurately captures the specific content provided.
    2. A quiz consisting of 5 multiple-choice questions based strictly on the content provided. Each question should have 4 options and one correct answer.

    Return the result in JSON format with the following structure:
    {
      "summary": "...",
      "quiz": {
        "title": "Lesson Quiz",
        "description": "Quiz based strictly on the lesson content",
        "questions": [
          {
            "question_text": "...",
            "options": [
              {"text": "...", "is_correct": true},
              {"text": "...", "is_correct": false}
            ]
          }
        ]
      }
    }
  `;

  try {
    const mediaResponse = await fetch(mediaUrl);
    if (!mediaResponse.ok) {
      throw new Error(`Failed to fetch media: ${mediaResponse.statusText}`);
    }
    const blob = await mediaResponse.blob();
    
    // Convert blob to base64
    const base64Data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        // Check if there is a comma before splitting
        if (result.includes(',')) {
          resolve(result.split(',')[1]);
        } else {
          resolve(result); // Fallback
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

    let mimeType = blob.type;
    if (!mimeType) {
      if (mediaType === 'video') mimeType = 'video/mp4';
      else if (mediaType === 'audio') mimeType = 'audio/mpeg';
      else mimeType = 'application/pdf';
    }

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType
        }
      }
    ]);
    const aiResponse = await result.response;
    const text = aiResponse.text();

    try {
      return JSON.parse(text);
    } catch (e) {
      // Fallback for non-json responses if any
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error("Failed to parse AI response as JSON");
    }
  } catch (error) {
    console.error("Error analyzing media with Gemini:", error);
    throw error;
  }
}

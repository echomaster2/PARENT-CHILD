import { GoogleGenAI, Type, Modality } from "@google/genai";
import type { ChildProfile, Guidance, Mood, Tone } from "../types";
import { getZodiacSign } from "../utils/astrology";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const guidanceSchema = {
  type: Type.OBJECT,
  properties: {
    cheatCode: {
      type: Type.STRING,
      description: "A short, fun, and actionable 'cheat code' for the day. Connect it to their astrological profile (e.g., 'Mercury in Leo means big feelings need a big stage. Let them direct a family play today.').",
    },
    explanation: {
      type: Type.STRING,
      description: "A slightly longer, insightful explanation of the astrological or behavioral pattern at play.",
    },
    parentingTip: {
      type: Type.STRING,
      description: "A practical parenting tip related to the day's theme.",
    },
    snackRec: {
      type: Type.STRING,
      description: "A fun and simple snack recommendation that fits the day's energy.",
    },
    meltdownDecoder: {
      type: Type.STRING,
      description: "A humorous but helpful take on what might trigger a meltdown today and how to navigate it.",
    },
    gamifiedFeedback: {
        type: Type.STRING,
        description: "A short, encouraging, gamified message for the parent (e.g., 'You've decoded the cosmic kid-code! Level up!')."
    }
  },
  required: ["cheatCode", "explanation", "parentingTip", "snackRec", "meltdownDecoder", "gamifiedFeedback"],
};


export const getDailyGuidance = async (
  profile: ChildProfile,
  parentMood: Mood,
  childMood: Mood,
  tone: Tone
): Promise<Guidance> => {
  const zodiacSign = getZodiacSign(profile.dob);

  const prompt = `
    Act as a witty, insightful parenting expert with deep knowledge of astrology and child psychology. You are creating a 'daily cheat code' for a parent.

    **Child's Details:**
    Name: ${profile.name}
    Date of Birth: ${profile.dob}
    Zodiac Sign: ${zodiacSign}
    Birthstone: ${profile.birthstone}

    **Today's Vibe:**
    Parent's Mood: ${parentMood}
    Child's Mood: ${childMood}

    **Your Task:**
    Generate a JSON object that adheres to the provided schema. The advice should be personalized based on all the provided details, especially the child's zodiac sign and birthstone.

    **Tone:**
    Write the entire response in a **${tone}** tone. Be playful but genuinely helpful.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: guidanceSchema,
      },
    });

    const jsonText = response.text.trim();
    const guidanceData = JSON.parse(jsonText);
    
    return guidanceData as Guidance;

  } catch (error) {
    console.error("Error fetching daily guidance:", error);
    throw new Error("Failed to generate guidance. The cosmos might be busy. Please try again.");
  }
};

export const textToSpeech = async (text: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Say it in a professional, warm, and reassuring narrator voice: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }, // A calm, professional voice
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      throw new Error("No audio data returned from API.");
    }
    return base64Audio;
  } catch (error) {
    console.error("Error generating speech:", error);
    throw new Error("Failed to generate narration.");
  }
};

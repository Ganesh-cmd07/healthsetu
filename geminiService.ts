
import { GoogleGenAI, Type } from "@google/genai";
import { PrescriptionData, MigraineRiskResponse, MoodAnalysisResponse } from "./types";

let ai: GoogleGenAI | null = null;
const getAI = () => {
  if (!ai && process.env.API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};

export const decodePrescription = async (): Promise<PrescriptionData> => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  return {
    doctor: "Dr. AI Extraction",
    date: new Date().toLocaleDateString(),
    meds: [
      { name: "Augmentin 625", dose: "625mg", type: "Antibiotic", freq: "1-0-1", duration: "5 days", icon: "💊", time: "09:00 AM" },
      { name: "Dolo 650", dose: "650mg", type: "Painkiller", freq: "SOS", duration: "3 days", icon: "🌡️", time: "02:00 PM" },
      { name: "Warfarin", dose: "5mg", type: "Blood Thinner", freq: "0-0-1", duration: "30 days", icon: "🩸", time: "09:00 PM" }
    ]
  };
};

export const chatWithAugust = async (userMessage: string, cycleDay: number, history: { role: 'user' | 'model', parts: { text: string }[] }[]) => {
  try {
    const client = getAI();
    if (!client) {
      return "I'm currently offline because no API key is configured. Please add your Gemini API key to .env.local to enable AI responses.";
    }
    const response = await client.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [
        ...history,
        { role: 'user', parts: [{ text: userMessage }] }
      ],
      config: {
        systemInstruction: `You are August, a specialized AI Health Counselor for women's health, focusing on PCOD and Migraines. 
        The current user is on Day ${cycleDay} of their cycle. 
        Your tone is empathetic, professional, and clinical but accessible.
        Always correlate symptoms to hormonal phases (Menstrual, Follicular, Ovulation, Luteal).
        Keep responses concise (under 3 sentences). 
        IMPORTANT: Always end your response with a supportive follow-up question to keep the patient engaged in their wellness journey.`,
        temperature: 0.7,
      }
    });
    return response.text;
  } catch (error) {
    console.error("August AI Error:", error);
    return "I'm having a slight sync issue with the medical grid, but I'm here. Could you tell me more about your specific symptoms today?";
  }
};

export const checkInteraction = (medicines: string[]) => {
  const lowerMeds = medicines.map(m => m.toLowerCase());
  if (lowerMeds.includes("aspirin") && lowerMeds.includes("warfarin")) {
    return { status: "DANGER", message: "CRITICAL: High Bleeding Risk. Do not mix!" };
  }
  return { status: "SAFE", message: "No interactions found." };
};

export const findGeneric = (brandName: string) => {
  const dictionary: Record<string, { generic: string, price: string, savings: string, savingsVal: number }> = {
    "Dolo 650": { generic: "Paracetamol 650", price: "₹10", savings: "₹20", savingsVal: 20 },
    "Augmentin 625": { generic: "Amoxyclav 625", price: "₹60", savings: "₹140", savingsVal: 140 }
  };
  return dictionary[brandName] || null;
};

export const predictMigraineRisk = async (day: number): Promise<MigraineRiskResponse> => {
  if (day > 22 || day < 4) {
    return {
      risk_level: "HIGH",
      cause: "Luteal Phase Hormone Drop",
      advice: "Start hydration protocol. Avoid caffeine."
    };
  }
  return {
    risk_level: "LOW",
    cause: "Stable Estrogen Levels",
    advice: "Maintain regular exercise."
  };
};

export const analyzeMoodJournal = async (text: string): Promise<MoodAnalysisResponse> => {
  const lowerText = text.toLowerCase();
  const keywords = ["tired", "sad", "anxious", "crying"];
  const hasLowKeywords = keywords.some(k => lowerText.includes(k));
  if (hasLowKeywords) {
    return {
      mood: "Hormonal Low",
      suggestion: "Try 10 mins of Meditation + Dark Chocolate (Magnesium)."
    };
  }
  return {
    mood: "Neutral/Good",
    suggestion: "Great day for cardio!"
  };
};

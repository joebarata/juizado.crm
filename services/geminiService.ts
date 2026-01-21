
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const translateLegalToNatural = async (legalUpdate: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Traduza o seguinte andamento processual jurídico para uma linguagem extremamente simples e amigável que um cliente leigo possa entender em uma frase curta: "${legalUpdate}"`,
      config: {
        temperature: 0.3,
        systemInstruction: "Você é um assistente jurídico especializado em comunicação com o cliente. Seja breve e evite termos técnicos."
      }
    });
    return response.text || "Andamento em processamento...";
  } catch (error) {
    console.error("AI Translation Error:", error);
    return "Houve uma atualização no seu processo. Entre em contato para detalhes.";
  }
};

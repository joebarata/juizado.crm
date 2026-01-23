
import { GoogleGenAI } from "@google/genai";

export const translateLegalToNatural = async (legalUpdate: string): Promise<string> => {
  const apiKey = (window as any).process?.env?.API_KEY || '';
  
  if (!apiKey) {
    console.warn("juizado.com AI: Chave de API não configurada no ambiente.");
    return "A análise inteligente está temporariamente em manutenção.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: `Explique este andamento processual de forma simples para um leigo: "${legalUpdate}"` }] }],
      config: {
        temperature: 0.2,
        systemInstruction: "Você é o assistente virtual do juizado.com. Traduza termos jurídicos para uma linguagem empática e clara."
      }
    });

    return response.text || "Andamento registrado com sucesso.";
  } catch (error) {
    console.error("AI Service Error:", error);
    return "Houve uma atualização no processo. Nossa equipe analisará os detalhes em breve.";
  }
};

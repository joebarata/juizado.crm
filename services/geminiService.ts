
import { GoogleGenAI } from "@google/genai";

export const translateLegalToNatural = async (legalUpdate: string): Promise<string> => {
  const apiKey = process.env.API_KEY || (window as any).lexflowConfig?.apiKey;
  
  if (!apiKey) {
    console.error("Gemini API Key missing.");
    return "Erro: Chave de API não configurada no painel LexFlow.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
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

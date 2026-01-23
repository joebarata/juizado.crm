import { GoogleGenAI } from "@google/genai";

export const translateLegalToNatural = async (legalUpdate: string): Promise<string> => {
  // Em ambiente de produção, o API_KEY é injetado pelo host
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    console.error("LexFlow AI: Chave de API não detectada no ambiente.");
    return "Erro: Configuração de IA pendente no servidor.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: `Traduza este andamento processual para uma linguagem simples e humana (máximo 1 frase): "${legalUpdate}"` }] }],
      config: {
        temperature: 0.3,
        systemInstruction: "Você é um consultor jurídico de elite. Transforme o 'juridiquês' técnico em uma mensagem clara e tranquilizadora para o cliente final."
      }
    });

    return response.text || "Andamento processual registrado. Estamos acompanhando os prazos.";
  } catch (error) {
    console.error("AI Service Error:", error);
    return "Houve uma movimentação no seu processo. Nossa equipe fará a análise técnica em breve.";
  }
};
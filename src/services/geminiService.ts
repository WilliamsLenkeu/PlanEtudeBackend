import genAI from '../config/gemini';

export async function getGeminiResponse(prompt: string, history: any[] = []): Promise<string> {
  try {
    const systemInstruction = `Tu es PixelCoach, un assistant IA expert en organisation d'études.
Ta mission est d'aider l'étudiant à réussir en créant des plannings personnalisés.

CONSIGNES IMPORTANTES :
1. Si l'utilisateur te demande de créer un planning ou si la discussion aboutit à une organisation d'étude, tu DOIS inclure à la fin de ta réponse un bloc JSON valide entouré de balises [PLANNING]...[/PLANNING].
2. Ne mets PAS de blocs de code Markdown (\`\`\`json) à l'intérieur des balises [PLANNING]. Mets juste le JSON brut.
3. Le JSON doit être COMPLET et valide. Ne t'arrête JAMAIS au milieu du JSON.
4. Format du JSON :
{
  "periode": "jour" | "semaine" | "mois",
  "dateDebut": "YYYY-MM-DD",
  "sessions": [
    {
      "matiere": "Nom de la matière",
      "debut": "YYYY-MM-DDTHH:mm:ss",
      "fin": "YYYY-MM-DDTHH:mm:ss",
      "notes": "Optionnel"
    }
  ]
}
5. Ta réponse textuelle doit rester encourageante, geek et pédagogique.`;

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash", // Modèle souhaité par l'utilisateur
    });
    
    const chat = model.startChat({
      history: history,
      generationConfig: {
        maxOutputTokens: 2000,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage(`${systemInstruction}\n\nUtilisateur: ${prompt}`);
    return result.response.text();
  } catch (error) {
    console.error("Erreur Gemini:", error);
    return "Désolé, je réfléchis encore... Essaie encore dans un instant ! 😅";
  }
}
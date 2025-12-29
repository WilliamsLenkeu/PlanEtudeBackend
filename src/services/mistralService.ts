import mistral from '../config/mistral';
import logger from '../utils/logger';

// Simple in-memory circuit-breaker and metrics
const metrics = {
  calls: 0,
  successes: 0,
  failures: 0,
  totalLatencyMs: 0,
};

const circuit = {
  failures: 0,
  lastFailureAt: 0,
  open: false,
  openUntil: 0,
};

function isCircuitOpen() {
  if (!circuit.open) return false;
  if (Date.now() > circuit.openUntil) {
    circuit.open = false;
    circuit.failures = 0;
    return false;
  }
  return true;
}

export function getMistralMetrics() {
  return { ...metrics, circuit: { ...circuit } };
}

export async function getMistralResponse(prompt: string, history: any[] = [], userContext: any = {}): Promise<string> {
  metrics.calls += 1;

  if (isCircuitOpen()) {
    metrics.failures += 1;
    logger.warn('Mistral circuit open — returning fallback');
    return "Désolé, le service d'assistance est temporairement indisponible. Réessaie dans un instant.";
  }

  const { name, gender, gamification, preferences } = userContext;
  
  let contextStr = "";
  if (name) {
    const level = gamification?.level || 1;
    const xp = gamification?.xp || 0;
    const streak = gamification?.streak || 0;
    contextStr = `Tu parles à ${name} (Genre: ${gender || 'Non spécifié'}). 
Niveau: ${level}, XP: ${xp}, Streak actuel: ${streak} jours d'étude consécutifs.
Ses matières préférées: ${preferences?.matieres?.join(', ') || 'Non spécifiées'}.`;
  }

  const systemInstruction = `Tu es PixelCoach, un assistant IA expert en organisation d'études.
Ta mission est d'aider l'étudiant à réussir en créant des plannings personnalisés et en lui donnant des conseils de motivation.

${contextStr}

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
5. Ta réponse textuelle doit rester encourageante, geek et pédagogique. Utilise les infos de son profil (XP, Niveau, Streak) pour le motiver ou le féliciter !`;

  try {
    const mistralMessages = [
      { role: 'system' as const, content: systemInstruction },
      ...history.map((h: any) => ({
        role: (h.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
        content: h.content || h.text || '',
      })),
      { role: 'user' as const, content: prompt }
    ];

    const start = Date.now();
    const result = await mistral.chat.complete({
      model: 'mistral-large-latest',
      messages: mistralMessages,
      temperature: 0.7,
      maxTokens: 2000,
    });
    
    const latency = Date.now() - start;
    metrics.totalLatencyMs += latency;

    if (!result.choices || result.choices.length === 0) {
        throw new Error('Mistral response is empty');
    }

    const aiText = result.choices[0].message.content as string;
    
    metrics.successes += 1;
    circuit.failures = 0; // Reset failures on success
    
    return aiText;
  } catch (error) {
    metrics.failures += 1;
    circuit.failures += 1;
    circuit.lastFailureAt = Date.now();
    
    if (circuit.failures >= 5) {
      circuit.open = true;
      circuit.openUntil = Date.now() + 60000; // Open for 1 minute
      logger.error('Mistral circuit opened due to multiple failures');
    }
    
    logger.error("Erreur Mistral:", error);
    return "Désolé, je réfléchis encore... Essaie encore dans un instant ! 😅";
  }
}

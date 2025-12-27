import genAI from '../config/gemini';
import sanitizer from './aiSanitizer';
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

export function getGeminiMetrics() {
  return { ...metrics, circuit: { ...circuit } };
}

export async function getGeminiResponse(prompt: string, history: any[] = [], userContext: any = null): Promise<string> {
  metrics.calls += 1;

  if (isCircuitOpen()) {
    metrics.failures += 1;
    logger.warn('Gemini circuit open — returning fallback');
    return "Désolé, le service d'assistance est temporairement indisponible. Réessaie dans un instant.";
  }

  // Sanitize context to avoid sending PII
  const sanitized = sanitizer.buildSanitizedContext(userContext?.user, userContext?.planning, prompt, history);

  const systemInstruction = 'Tu es PixelCoach, un assistant IA expert en organisation d\'études.\n' +
    'Ta mission est d\'aider l\'étudiant à réussir en créant des plannings personnalisés.\n\n' +
    'CONSIGNES IMPORTANTES :\n' +
    '1. Si l\'utilisateur te demande de créer un planning ou si la discussion aboutit à une organisation d\'étude, tu DOIS inclure à la fin de ta réponse un bloc JSON valide entouré de balises [PLANNING]...[/PLANNING].\n' +
    '2. Ne mets PAS de blocs de code Markdown (```json) à l\'intérieur des balises [PLANNING]. Mets juste le JSON brut.\n' +
    '3. Le JSON doit être COMPLET et valide. Ne t\'arrête JAMAIS au milieu du JSON.\n' +
    '4. Format du JSON :\n' +
    '{\n' +
    '  "periode": "jour" | "semaine" | "mois",\n' +
    '  "dateDebut": "YYYY-MM-DD",\n' +
    '  "sessions": [\n' +
    '    {\n' +
    '      "matiere": "Nom de la matière",\n' +
    '      "debut": "YYYY-MM-DDTHH:mm:ss",\n' +
    '      "fin": "YYYY-MM-DDTHH:mm:ss",\n' +
    '      "notes": "Optionnel"\n' +
    '    }\n' +
    '  ]\n' +
    '}\n' +
    '5. RÉPONDS EN FRANÇAIS et garde un ton encourageant et pédagogique.';

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Convert history to proper format for Gemini API
    const geminiHistory = history.map((h: any) => ({
      role: h.role === 'user' ? 'user' : 'model',
      parts: [{ text: h.content || h.text || '' }],
    }));

    const chat = model.startChat({
      history: geminiHistory,
      generationConfig: { maxOutputTokens: 2000, temperature: 0.7 },
    });

    const fullPrompt = systemInstruction + '\n\nContexte: ' + sanitized.promptContext + '\n\nUtilisateur: ' + sanitized.sanitizedMessage;

    const start = Date.now();
    const result = await chat.sendMessage(fullPrompt);
    const latency = Date.now() - start;

    metrics.successes += 1;
    metrics.totalLatencyMs += latency;

    // reset circuit on success
    circuit.failures = 0;
    circuit.open = false;

    const text = result.response.text();
    logger.info('Gemini call success', { latency, user: userContext?.user?._id });
    return text;
  } catch (error: any) {
    metrics.failures += 1;
    circuit.failures += 1;
    circuit.lastFailureAt = Date.now();
    logger.error('Erreur Gemini:', error);

    // Open circuit if failures spike
    if (circuit.failures >= 5) {
      circuit.open = true;
      circuit.openUntil = Date.now() + 60 * 1000; // open 60s
      logger.warn('Gemini circuit opened for 60s');
    }

    // Fallback message
    return "Désolé, je ne peux pas répondre pour le moment. Essaie de nouveau dans quelques instants.";
  }
}

export default { getGeminiResponse, getGeminiMetrics };

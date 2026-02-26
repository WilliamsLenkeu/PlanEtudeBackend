import { Mistral } from '@mistralai/mistralai';
import { config } from '../core/config/appConfig';
import logger from '../utils/logger';

/** Normalise la réponse IA : gère { "Titre": { "sessions": [...] } } ou { "titre": "...", "sessions": [...] } */
function normalizeAIResponse(parsed: any): { titre?: string; sessions?: any[] } | null {
  if (!parsed || typeof parsed !== 'object') return null;

  // Format attendu : { titre, sessions }
  if (Array.isArray(parsed.sessions)) {
    return {
      titre: parsed.titre || 'Mon Planning',
      sessions: parsed.sessions,
    };
  }

  // Format alternatif : { "Clé": { sessions, titre? } } — une seule clé = wrapper
  const keys = Object.keys(parsed);
  if (keys.length === 1) {
    const inner = parsed[keys[0]];
    if (inner && typeof inner === 'object' && Array.isArray(inner.sessions)) {
      return {
        titre: inner.titre || keys[0],
        sessions: inner.sessions,
      };
    }
  }

  return null;
}

const client = new Mistral({
  apiKey: config.mistralApiKey,
});

export const generateAIPanning = async (promptData: any, onSessionGenerated?: (session: any) => void) => {
  const startTime = Date.now();
  console.log(`\n[${new Date().toISOString()}] 🤖 APPEL API MISTRAL (STREAMING) lancé...`);
  console.log(`   - Période: ${promptData.periode} (${promptData.nombre})`);
  console.log(`   - Matières: ${promptData.matieres.join(', ')}`);

  try {
    const stream = await client.chat.stream({
      model: 'open-mistral-7b',
      messages: [
        {
          role: 'system',
          content: `Tu es PixelCoach, un expert en neurosciences. Génère un planning d'étude JSON strict.
          
          RÈGLES CRITIQUES :
          1. Utilise UNIQUEMENT les matières (sujets d'étude) fournies dans la liste "matieres". Chaque élément de cette liste est une matière que l'élève doit réviser.
          2. Si "matieres" est vide ou absent, tu DOIS utiliser "Révisions Générales" comme matière par défaut. Ne laisse JAMAIS le tableau de sessions vide.
          3. Génère au moins 4 sessions par jour pour toute la période demandée, en alternant intelligemment entre les matières fournies.
          4. Techniques : Pomodoro (pratique), Deep Work (90min, apprentissage).
          5. Format OBLIGATOIRE : Retourne UNIQUEMENT un objet JSON à la racine avec EXACTEMENT cette structure (pas de clé wrapper) :
             {
               "titre": "string (3 mots maximum)",
               "sessions": [
                 { 
                   "matiere": "string (nom exact de la matière fournie)", 
                   "debut": "string (format ISO 8601, ex: 2024-01-10T09:00:00.000Z)", 
                   "fin": "string (format ISO 8601, ex: 2024-01-10T10:30:00.000Z)", 
                   "type": "LEARNING | REVIEW | PRACTICE | MOCK_EXAM | BUFFER | PAUSE", 
                   "method": "POMODORO | DEEP_WORK | CLASSIC", 
                   "priority": "LOW | MEDIUM | HIGH", 
                   "notes": "string (conseil court et motivant)" 
                 }
               ]
             }
             IMPORTANT : L'objet racine doit avoir directement "titre" et "sessions", sans être imbriqué sous une autre clé.`
        },
        {
          role: 'user',
          content: `Données : ${JSON.stringify(promptData)}
          Génère au moins 4 sessions par jour. Réponse JSON uniquement.`
        }
      ],
      responseFormat: { type: 'json_object' }
    });

    let fullContent = '';
    let buffer = '';
    let sessionCount = 0;
    let braceCount = 0;
    let startIndex = -1;

    for await (const chunk of stream) {
      const delta = chunk.data.choices[0].delta.content || '';
      fullContent += delta;
      
      for (const char of delta) {
        buffer += char;
        if (char === '{') {
          braceCount++;
          if (braceCount === 2) {
            // Début d'un objet session
            startIndex = buffer.length - 1;
          }
        } else if (char === '}') {
          braceCount--;
          if (braceCount === 1 && startIndex !== -1) {
            // Fin d'un objet session
            const potentialSessionStr = buffer.substring(startIndex);
            try {
              const parsed = JSON.parse(potentialSessionStr);
              if (parsed.matiere && onSessionGenerated) {
                sessionCount++;
                onSessionGenerated(parsed);
              }
            } catch (e) {
              // JSON invalide, on ignore
            }
            startIndex = -1;
            // On ne vide pas tout le buffer car on a besoin de garder la structure parente
            // mais on peut nettoyer ce qui a déjà été traité pour économiser de la mémoire
          }
        }
      }
    }

    const duration = Date.now() - startTime;
    console.log(`[${new Date().toISOString()}] ✅ STREAM IA terminé en ${duration}ms (${sessionCount} sessions extraites)`);

    let parsed: any;
    try {
      parsed = JSON.parse(fullContent);
    } catch (parseErr) {
      console.error('[AI] Erreur parse JSON final:', parseErr);
      if (sessionCount === 0) {
        console.log('--- DEBUG : CONTENU COMPLET REÇU ---');
        console.log(fullContent);
        console.log('--- FIN DEBUG ---');
      }
      throw parseErr;
    }

    // Normaliser la structure : l'IA peut renvoyer { "Titre": { "sessions": [...] } } au lieu de { "titre": "...", "sessions": [...] }
    const normalized = normalizeAIResponse(parsed);
    if (!normalized) {
      if (sessionCount === 0) {
        console.log('--- DEBUG : CONTENU COMPLET REÇU ---');
        console.log(fullContent);
        console.log('--- FIN DEBUG ---');
      }
      return parsed;
    }

    // Fallback : si le stream n'a extrait aucune session, pousser les sessions du JSON final
    const sessionsToPush = normalized.sessions ?? [];
    if (sessionCount === 0 && sessionsToPush.length > 0 && onSessionGenerated) {
      console.log(`[AI] Fallback : ${sessionsToPush.length} sessions extraites du JSON final`);
      for (const session of sessionsToPush) {
        if (session.matiere) {
          try {
            const sessionToPush = { ...session, statut: session.statut || 'planifie' };
            await onSessionGenerated(sessionToPush);
          } catch (e) {
            console.error('[AI] Erreur fallback session:', e);
          }
        }
      }
    }

    return normalized;
  } catch (error) {
    logger.error('Erreur Mistral AI Streaming:', error);
    throw error;
  }
};

import { Mistral } from '@mistralai/mistralai';
import { config } from '../config/env';
import logger from '../utils/logger';

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
          1. Utilise UNIQUEMENT les matières fournies dans "matieres". 
          2. Si "matieres" est vide ou absent, tu DOIS utiliser "Révisions Générales" comme matière par défaut. Ne laisse JAMAIS le tableau de sessions vide.
          3. Génère au moins 4 sessions par jour pour toute la période demandée.
          4. Techniques : Pomodoro (pratique), Deep Work (90min, apprentissage).
          5. Format : Retourne UNIQUEMENT un objet JSON avec cette structure exacte et ces types de valeurs :
             {
               "titre": "string (3 mots maximum)",
               "sessions": [
                 { 
                   "matiere": "string (nom exact de la matière fournie)", 
                   "debut": "string (format ISO 8601, ex: '2024-01-10T09:00:00.000Z')", 
                   "fin": "string (format ISO 8601, ex: '2024-01-10T10:30:00.000Z')", 
                   "type": "string (valeurs autorisées: 'LEARNING', 'REVIEW', 'PRACTICE', 'MOCK_EXAM', 'BUFFER', 'PAUSE')", 
                   "method": "string (valeurs autorisées: 'POMODORO', 'DEEP_WORK', 'CLASSIC')", 
                   "priority": "string (valeurs autorisées: 'LOW', 'MEDIUM', 'HIGH')", 
                   "notes": "string (conseil court et motivant)" 
                 }
               ]
             }`
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
    
    // Debug si aucune session n'est extraite
    if (sessionCount === 0) {
      console.log('--- DEBUG : CONTENU COMPLET REÇU ---');
      console.log(fullContent);
      console.log('--- FIN DEBUG ---');
    }

    return JSON.parse(fullContent);
  } catch (error) {
    logger.error('Erreur Mistral AI Streaming:', error);
    throw error;
  }
};

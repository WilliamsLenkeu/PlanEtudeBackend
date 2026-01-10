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
    let totalBraceCount = 0;

    for await (const chunk of stream) {
      const delta = chunk.data.choices[0].delta.content || '';
      fullContent += delta;
      buffer += delta;

      // Logique d'extraction par profondeur d'accolades
      let i = 0;
      while (i < buffer.length) {
        const char = buffer[i];
        
        if (char === '{') {
          totalBraceCount++;
          // Si on ouvre une accolade à la profondeur 2, c'est potentiellement une session
          // Structure attendue : { "titre": "...", "sessions": [ { session1 }, { session2 } ] }
          if (totalBraceCount === 2) {
            // On a trouvé le début d'une session, on garde tout ce qui suit à partir d'ici
            buffer = buffer.substring(i);
            i = 0; // On repart du début du nouveau buffer
          }
        } else if (char === '}') {
          totalBraceCount--;
          // Si on ferme une accolade qui était à la profondeur 2
          if (totalBraceCount === 1) {
            const potentialSessionStr = buffer.substring(0, i + 1);
            try {
              const parsed = JSON.parse(potentialSessionStr);
              if (parsed.matiere && onSessionGenerated) {
                sessionCount++;
                onSessionGenerated(parsed);
              }
            } catch (e) {
              // JSON incomplet ou invalide, on ignore
            }
            // On nettoie le buffer jusqu'à la fin de cette session
            buffer = buffer.substring(i + 1);
            i = -1; // On recommencera à 0 après l'incrément i++
          }
        }
        i++;
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

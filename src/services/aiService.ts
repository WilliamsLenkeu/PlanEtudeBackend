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
          1. Utilise UNIQUEMENT les matières fournies dans "matieres". Ne crée JAMAIS de nouvelles matières.
          2. Si "matieres" est vide, utilise "Révisions Générales".
          3. Techniques : Pomodoro (pratique), Deep Work (90min, apprentissage).
          4. Format : JSON strict avec un tableau "sessions".`
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

    for await (const chunk of stream) {
      const delta = chunk.data.choices[0].delta.content || '';
      fullContent += delta;
      buffer += delta;

      // Tentative d'extraire une session complète du buffer
      // On cherche des objets { ... } qui ressemblent à une session
      // C'est une approche simplifiée, mais efficace pour du JSON structuré
      while (true) {
        const startIdx = buffer.indexOf('{');
        if (startIdx === -1) break;

        let braceCount = 0;
        let endIdx = -1;
        let inString = false;

        for (let i = startIdx; i < buffer.length; i++) {
          const char = buffer[i];
          if (char === '"' && buffer[i - 1] !== '\\') inString = !inString;
          if (!inString) {
            if (char === '{') braceCount++;
            else if (char === '}') braceCount--;

            if (braceCount === 0) {
              endIdx = i;
              break;
            }
          }
        }

        if (endIdx !== -1) {
          const potentialSessionStr = buffer.substring(startIdx, endIdx + 1);
          try {
            const parsed = JSON.parse(potentialSessionStr);
            // Vérifier si c'est bien une session (possède le champ 'matiere')
            if (parsed.matiere && onSessionGenerated) {
              sessionCount++;
              onSessionGenerated(parsed);
            }
          } catch (e) {
            // Pas un JSON valide ou session incomplète, on attend plus de données
          }
          buffer = buffer.substring(endIdx + 1);
        } else {
          break; // Objet non terminé dans le buffer actuel
        }
      }
    }

    const duration = Date.now() - startTime;
    console.log(`[${new Date().toISOString()}] ✅ STREAM IA terminé en ${duration}ms (${sessionCount} sessions extraites)`);
    
    return JSON.parse(fullContent);
  } catch (error) {
    logger.error('Erreur Mistral AI Streaming:', error);
    throw error;
  }
};

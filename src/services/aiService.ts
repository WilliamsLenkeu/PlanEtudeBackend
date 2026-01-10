import { Mistral } from '@mistralai/mistralai';
import { config } from '../config/env';
import logger from '../utils/logger';

const client = new Mistral({
  apiKey: config.mistralApiKey,
});

export const generateAIPanning = async (promptData: any) => {
  try {
    const response = await client.chat.complete({
      model: 'mistral-small-latest',
      messages: [
        {
          role: 'system',
          content: `Tu es PixelCoach, un expert en neurosciences et en méthodologies d'apprentissage (Spaced Repetition, Pomodoro, Active Recall).
          Ton but est de générer un planning d'étude optimisé au format JSON strict.
          
          Règles d'organisation :
          1. Utilise la technique Pomodoro (25/5 ou 50/10) pour les tâches de pratique.
          2. Utilise le Deep Work (sessions de 90 min) pour l'apprentissage de nouveaux concepts.
          3. Alterne les matières pour éviter la fatigue cognitive (Interleaving).
          4. Prévois des pauses déjeuner et des buffers de fin de journée.
          5. Les dates et heures doivent être au format ISO 8601.
          
          Format JSON attendu :
          {
            "titre": "string (3 mots maximum, exemple: 'Objectif Concours Médecine')",
            "sessions": [
              {
                "matiere": "string",
                "debut": "ISOString",
                "fin": "ISOString",
                "type": "LEARNING | REVIEW | PRACTICE | MOCK_EXAM | BUFFER | PAUSE",
                "method": "POMODORO | DEEP_WORK | CLASSIC",
                "priority": "LOW | MEDIUM | HIGH",
                "notes": "string (conseil spécifique basé sur la méthode choisie)"
              }
            ]
          }`
        },
        {
          role: 'user',
          content: `Génère un planning pour les données suivantes : ${JSON.stringify(promptData)}`
        }
      ],
      responseFormat: { type: 'json_object' }
    });

    const content = response.choices?.[0]?.message?.content;
    if (typeof content === 'string') {
        return JSON.parse(content);
    }
    throw new Error('Réponse vide de Mistral AI');
  } catch (error) {
    logger.error('Erreur Mistral AI:', error);
    throw error;
  }
};

import { Request, Response } from 'express';
import { getMistralResponse, getMistralMetrics } from '../services/mistralService';
import User from '../models/User.model';
import Planning from '../models/Planning.model';
import Progress from '../models/Progress.model';
import ChatHistory from '../models/ChatHistory.model';

interface AuthRequest extends Request {
  user?: any;
}

export const chat = async (req: AuthRequest, res: Response) => {
  const { message } = req.body;
  
  if (!req.user) {
    return res.status(401).json({ message: "Non autorisé" });
  }
  
  const userId = req.user.id;

  try {
    // 1. Récupérer l'historique récent (10 derniers messages)
    const historyData = await ChatHistory.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10);
    
    // Formatter pour Mistral (ordre chronologique)
    const history = historyData.reverse().map(h => ({
      role: h.role === 'user' ? 'user' : 'assistant',
      content: h.content
    }));

    // 2. Récupérer le contexte utilisateur
    const user = await User.findById(userId);
    const currentPlanning = await Planning.findOne({ userId }).sort({ createdAt: -1 });
    
    // 3. Obtenir la réponse de l'IA
    const aiResponseText = await getMistralResponse(message, history, { 
      name: user?.name,
      gender: user?.gender,
      gamification: user?.gamification,
      preferences: user?.preferences,
      currentPlanning
    });

    // 4. Sauvegarder l'interaction dans l'historique
    await ChatHistory.create([
      { userId, role: 'user', content: message },
      { userId, role: 'model', content: aiResponseText }
    ]);

    // 5. Détecter et extraire un éventuel planning JSON
    let createdPlanning = null;
    const planningMatch = aiResponseText.match(/\[PLANNING\]([\s\S]*?)\[\/PLANNING\]/);
    
    if (planningMatch) {
      try {
        let jsonStr = planningMatch[1].trim();
        // Nettoyer si l'IA a mis des blocs de code markdown
        jsonStr = jsonStr.replace(/```json/g, "").replace(/```/g, "").trim();
        
        const planningData = JSON.parse(jsonStr);
        
        // Créer le planning en base de données
        createdPlanning = await Planning.create({
          userId,
          ...planningData
        });
        
        console.log("✅ Planning généré et enregistré automatiquement !");
      } catch (e) {
        console.error("❌ Erreur lors du parsing du planning généré:", e);
      }
    }

    // Nettoyer la réponse textuelle pour ne pas afficher le tag [PLANNING] brut à l'utilisateur
    const cleanResponse = aiResponseText.replace(/\[PLANNING\][\s\S]*?\[\/PLANNING\]/, "").trim();

    res.json({ 
      response: cleanResponse,
      planningCreated: !!createdPlanning,
      planning: createdPlanning
    });

  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors du traitement du chat' });
  }
};

export const getMetrics = async (req: AuthRequest, res: Response) => {
  try {
    const metrics = getMistralMetrics();
    res.json(metrics);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
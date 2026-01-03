  import { Request, Response } from 'express';
import * as seedService from '../services/seedService';
import Theme from '../models/Theme.model';
import Subject from '../models/Subject.model';
import LofiTrack from '../models/LofiTrack.model';
import User from '../models/User.model';
import Planning from '../models/Planning.model';

export const renderDashboard = (req: Request, res: Response) => {
  res.render('admin/dashboard');
};

export const streamSeed = async (req: Request, res: Response) => {
  const { themes, subjects, lofi } = req.query;

  // Set headers for SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const sendLog = (message: string, type: 'info' | 'success' | 'error' | 'warn' = 'info') => {
    const data = JSON.stringify({ message, type, timestamp: new Date().toLocaleTimeString() });
    res.write(`data: ${data}\n\n`);
  };

  try {
    sendLog('🚀 Démarrage du processus de seeding...', 'info');

    if (themes === 'true') {
      sendLog('🎨 Nettoyage et injection des thèmes pastel...', 'info');
      const result = await seedService.seedThemes();
      sendLog(`✅ ${result.length} thèmes injectés avec succès.`, 'success');
    }

    if (subjects === 'true') {
      sendLog('📚 Préparation des matières (Lycée France)...', 'info');
      const result = await seedService.seedSubjects();
      sendLog(`✅ ${result.length} matières globales ajoutées à la base.`, 'success');
    }

    if (lofi === 'true') {
      sendLog('🎵 Connexion à l\'API Jamendo pour les pistes Lo-Fi...', 'info');
      const result = await seedService.seedLofi();
      if (result.length > 0) {
        sendLog(`✅ ${result.length} pistes musicales récupérées et indexées.`, 'success');
      } else {
        sendLog('⚠️ Aucune piste récupérée (vérifiez la connexion API).', 'warn');
      }
    }

    sendLog('✨ Processus terminé avec succès !', 'success');
    res.write('event: end\ndata: done\n\n');
  } catch (error: any) {
    sendLog(`❌ Erreur fatale : ${error.message}`, 'error');
  } finally {
    res.end();
  }
};

export const getMongoStats = async (req: Request, res: Response) => {
  try {
    const stats = {
      themes: await Theme.countDocuments(),
      subjects: await Subject.countDocuments(),
      lofi: await LofiTrack.countDocuments(),
      users: await User.countDocuments(),
      plannings: await Planning.countDocuments()
    };
    
    // Récupérer les 10 derniers plannings créés pour la gestion
    const recentPlannings = await Planning.find()
      .populate('userId', 'username email')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({ 
      success: true, 
      data: {
        stats,
        recentPlannings
      }
    });
  } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
};

export const deletePlanning = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Planning.findByIdAndDelete(id);
    res.json({ success: true, message: 'Planning supprimé avec succès' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const clearDatabase = async (req: Request, res: Response) => {
  const { type } = req.body;
  try {
    switch (type) {
      case 'users': await User.deleteMany({}); await Planning.deleteMany({}); break;
      case 'plannings': await Planning.deleteMany({}); break;
      case 'subjects': await Subject.deleteMany({}); break;
      case 'all': 
        await User.deleteMany({}); 
        await Planning.deleteMany({}); 
        await Subject.deleteMany({}); 
        await Theme.deleteMany({}); 
        await LofiTrack.deleteMany({});
        break;
      default: return res.status(400).json({ success: false, message: 'Type de nettoyage invalide' });
    }
    res.json({ success: true, message: `Collection ${type} nettoyée` });
  } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
};

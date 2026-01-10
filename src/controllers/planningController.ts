import { Request, Response, NextFunction } from 'express';
import Planning from '../models/Planning.model';
import User from '../models/User.model';
import PDFDocument from 'pdfkit';
import { generateHybridPlanning } from '../services/planningService';
import { AppError } from '../middleware/errorHandler';

interface AuthRequest extends Request {
  user?: any;
}

// @desc    Générer un planning hybride optimisé
// @route   POST /api/planning/generate
// @access  Private
export const generatePlanning = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { periode, dateDebut } = req.body;
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return next(new AppError('Utilisateur non trouvé - Session expirée ou compte inexistant', 404));
    }

    const sessions = generateHybridPlanning({
      periode,
      dateDebut: new Date(dateDebut),
      matieres: user.preferences?.matieres || [],
      userMastery: user.studyStats?.subjectMastery || []
    });

    res.json({ success: true, data: sessions });
  } catch (error: any) {
    next(new AppError(`Erreur lors de la génération du planning: ${error.message}`, 500));
  }
};

// @desc    Mettre à jour le statut d'une session (ex: passer à 'termine')
// @route   PATCH /api/plannings/:id/sessions/:sessionId
// @access  Private
export const updateSessionStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id, sessionId } = req.params;
    const { statut, notes } = req.body;

    const planning = await Planning.findById(id);
    if (!planning) {
      return next(new AppError('Planning non trouvé - L\'ID fourni est incorrect', 404));
    }
    
    if (planning.userId.toString() !== req.user.id) {
      return next(new AppError('Non autorisé - Vous ne pouvez pas modifier le planning d\'un autre utilisateur', 401));
    }

    const session = (planning.sessions as any).id(sessionId);
    if (!session) {
      return next(new AppError('Session non trouvée dans ce planning', 404));
    }

    session.statut = statut || session.statut;
    if (notes) session.notes = notes;

    await planning.save();

    res.json({ success: true, data: planning });
  } catch (error: any) {
    next(new AppError(`Erreur lors de la mise à jour de la session: ${error.message}`, 500));
  }
};

export const getPlannings = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 10, periode, sort = '-createdAt' } = req.query;
    const query: any = { userId: req.user.id };

    if (periode) {
      query.periode = periode;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const plannings = await Planning.find(query)
      .sort(sort as string)
      .skip(skip)
      .limit(Number(limit));

    const total = await Planning.countDocuments(query);

    res.json({
      success: true,
      plannings,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error: any) {
    next(new AppError(`Erreur lors de la récupération des plannings: ${error.message}`, 500));
  }
};

export const createPlanning = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { periode, dateDebut, sessions } = req.body;

  try {
    const planning = await Planning.create({
      userId: req.user.id,
      periode,
      dateDebut,
      sessions,
    });
    res.status(201).json({ success: true, data: planning });
  } catch (error: any) {
    next(new AppError(`Erreur lors de la création du planning: ${error.message}`, 400));
  }
};

export const updatePlanning = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const planning = await Planning.findById(req.params.id);

    if (!planning) {
      return next(new AppError('Planning non trouvé', 404));
    }

    if (planning.userId.toString() !== req.user.id) {
      return next(new AppError('Non autorisé', 401));
    }

    const updatedPlanning = await Planning.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({ success: true, data: updatedPlanning });
  } catch (error: any) {
    next(new AppError(`Erreur lors de la modification du planning: ${error.message}`, 400));
  }
};

export const deletePlanning = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const planning = await Planning.findById(req.params.id);

    if (!planning) {
      return next(new AppError('Planning non trouvé', 404));
    }

    if (planning.userId.toString() !== req.user.id) {
      return next(new AppError('Non autorisé', 401));
    }

    await planning.deleteOne();
    res.json({ success: true, message: 'Planning supprimé avec succès' });
  } catch (error: any) {
    next(new AppError(`Erreur lors de la suppression du planning: ${error.message}`, 500));
  }
};

export const exportIcal = async (req: AuthRequest, res: Response) => {
  try {
    const planning = await Planning.findById(req.params.id);
    if (!planning) return res.status(404).json({ message: 'Planning non trouvé' });
    if (planning.userId.toString() !== req.user.id) return res.status(401).json({ message: 'Non autorisé' });

    const lines = [];
    lines.push('BEGIN:VCALENDAR');
    lines.push('VERSION:2.0');
    lines.push('PRODID:-//PlanEtude//EN');

    planning.sessions.forEach((s: any, idx: number) => {
      const uid = `${planning._id}-${idx}@planetude.local`;
      const dtstart = new Date(s.debut).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      const dtend = new Date(s.fin).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      lines.push('BEGIN:VEVENT');
      lines.push(`UID:${uid}`);
      lines.push(`DTSTAMP:${dtstart}`);
      lines.push(`DTSTART:${dtstart}`);
      lines.push(`DTEND:${dtend}`);
      lines.push(`SUMMARY:${s.matiere}`);
      if (s.notes) lines.push(`DESCRIPTION:${s.notes}`);
      lines.push('END:VEVENT');
    });

    lines.push('END:VCALENDAR');

    const content = lines.join('\r\n');
    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename=planning-${planning._id}.ics`);
    res.send(content);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const exportPdf = async (req: AuthRequest, res: Response) => {
  try {
    const planning = await Planning.findById(req.params.id);
    if (!planning) return res.status(404).json({ message: 'Planning non trouvé' });
    if (planning.userId.toString() !== req.user.id) return res.status(401).json({ message: 'Non autorisé' });

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=planning-${planning._id}.pdf`);
    doc.pipe(res);

    doc.fontSize(18).text(`Planning ${planning.periode}`, { align: 'center' });
    doc.moveDown();

    planning.sessions.forEach((s: any) => {
      doc.fontSize(12).text(`${s.matiere} — ${new Date(s.debut).toLocaleString()} → ${new Date(s.fin).toLocaleString()}`);
      if (s.notes) doc.fontSize(10).text(`Notes: ${s.notes}`);
      doc.moveDown(0.5);
    });

    doc.end();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
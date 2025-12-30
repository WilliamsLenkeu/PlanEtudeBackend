import { Request, Response } from 'express';
import Planning from '../models/Planning.model';
import PDFDocument from 'pdfkit';
import { addExperience } from '../utils/gamification';

interface AuthRequest extends Request {
  user?: any;
}

// @desc    Mettre à jour le statut d'une session (ex: passer à 'termine')
// @route   PATCH /api/plannings/:id/sessions/:sessionId
// @access  Private
export const updateSessionStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id, sessionId } = req.params;
    const { statut, notes } = req.body;

    const planning = await Planning.findById(id);
    if (!planning) return res.status(404).json({ success: false, message: 'Planning non trouvé' });
    if (planning.userId.toString() !== req.user.id) return res.status(401).json({ success: false, message: 'Non autorisé' });

    const session = (planning.sessions as any).id(sessionId);
    if (!session) return res.status(404).json({ success: false, message: 'Session non trouvée' });

    const oldStatus = session.statut;
    session.statut = statut || session.statut;
    if (notes) session.notes = notes;

    await planning.save();

    // Si la session vient d'être terminée, on ajoute de l'XP et de la maîtrise
    if (oldStatus !== 'termine' && statut === 'termine') {
      const durationMinutes = Math.floor((new Date(session.fin).getTime() - new Date(session.debut).getTime()) / (1000 * 60));
      const xpToGain = Math.floor(durationMinutes / 2) + 10; // 10 XP base + 1 XP par 2 min

      const gamification = await addExperience(req.user.id, xpToGain, durationMinutes, session.matiere);

      return res.json({
        success: true,
        message: `Session terminée ! +${xpToGain} XP gagnés. ✨`,
        data: { planning, gamification }
      });
    }

    res.json({ success: true, data: planning });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPlannings = async (req: AuthRequest, res: Response) => {
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
      plannings,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createPlanning = async (req: AuthRequest, res: Response) => {
  const { periode, dateDebut, sessions } = req.body;

  try {
    const planning = await Planning.create({
      userId: req.user.id,
      periode,
      dateDebut,
      sessions,
    });
    res.status(201).json(planning);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updatePlanning = async (req: AuthRequest, res: Response) => {
  try {
    const planning = await Planning.findById(req.params.id);

    if (!planning) {
      return res.status(404).json({ message: 'Planning non trouvé' });
    }

    if (planning.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Non autorisé' });
    }

    const updatedPlanning = await Planning.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedPlanning);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deletePlanning = async (req: AuthRequest, res: Response) => {
  try {
    const planning = await Planning.findById(req.params.id);

    if (!planning) {
      return res.status(404).json({ message: 'Planning non trouvé' });
    }

    if (planning.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Non autorisé' });
    }

    await planning.deleteOne();
    res.json({ message: 'Planning supprimé' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
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
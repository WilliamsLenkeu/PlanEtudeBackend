  import { Request, Response } from 'express';
import * as seedService from '../services/seedService';
import Theme from '../models/Theme.model';
import Subject from '../models/Subject.model';
import LofiTrack from '../models/LofiTrack.model';
import User from '../models/User.model';
import Planning from '../models/Planning.model';

export const renderDashboard = (req: Request, res: Response) => {
  const html = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <title>PlanÉtude | Admin Simple</title>
        <style>
            body { font-family: sans-serif; padding: 20px; line-height: 1.6; max-width: 800px; margin: 0 auto; background: #f4f4f4; }
            .card { background: white; padding: 20px; border: 1px solid #ccc; margin-bottom: 20px; border-radius: 8px; }
            .danger { border-color: red; background: #fff5f5; }
            .console { background: #222; color: #0f0; padding: 15px; height: 300px; overflow-y: auto; font-family: monospace; border-radius: 4px; }
            button { padding: 10px 15px; cursor: pointer; margin-right: 5px; margin-bottom: 5px; }
            .btn-seed { background: #4CAF50; color: white; border: none; font-weight: bold; }
            .btn-danger { background: #f44336; color: white; border: none; }
            .stats span { font-weight: bold; color: #333; margin-right: 15px; }
        </style>
    </head>
    <body>
        <h1>Administration PlanÉtude</h1>
        
        <div class="card">
            <h3>Statistiques</h3>
            <p class="stats">
                Utilisateurs: <span id="stat-users">...</span>
                Matières: <span id="stat-subjects">...</span>
                Thèmes: <span id="stat-themes">...</span>
                Musiques: <span id="stat-lofi">...</span>
            </p>
            <button onclick="updateStats()">Rafraîchir les stats</button>
        </div>

        <div class="card">
            <h3>Initialisation (Seed)</h3>
            <p>
                <input type="checkbox" id="themes" checked> <label for="themes">Thèmes</label><br>
                <input type="checkbox" id="subjects" checked> <label for="subjects">Matières</label><br>
                <input type="checkbox" id="lofi" checked> <label for="lofi">Musiques (Lo-Fi)</label>
            </p>
            <button id="runSeedBtn" class="btn-seed">Lancer le seeding</button>
        </div>

        <div class="card danger">
            <h3>Zone de Danger</h3>
            <button onclick="clearCollection('users')" class="btn-danger">Vider Utilisateurs</button>
            <button onclick="clearCollection('plannings')" class="btn-danger">Vider Plannings</button>
            <button onclick="clearCollection('subjects')" class="btn-danger">Vider Matières</button>
            <button onclick="clearCollection('all')" class="btn-danger">RESET TOTAL</button>
        </div>

        <div class="card">
            <h3>Console de logs</h3>
            <button onclick="document.getElementById('log-console').innerHTML = ''">Effacer</button>
            <div id="log-console" class="console"></div>
        </div>

        <script>
            async function updateStats() {
                try {
                    const response = await fetch('/api/admin/stats');
                    const result = await response.json();
                    if (result.success) {
                        document.getElementById('stat-themes').innerText = result.data.themes;
                        document.getElementById('stat-subjects').innerText = result.data.subjects;
                        document.getElementById('stat-lofi').innerText = result.data.lofi;
                        document.getElementById('stat-users').innerText = result.data.users;
                    }
                } catch (err) { console.error('Stats failed'); }
            }

            function addLog(message, type = 'info') {
                const console = document.getElementById('log-console');
                const div = document.createElement('div');
                const time = new Date().toLocaleTimeString();
                div.style.color = type === 'error' ? 'red' : (type === 'success' ? 'lightgreen' : (type === 'warn' ? 'orange' : '#0f0'));
                div.innerHTML = \`[\${time}] \${message}\`;
                console.appendChild(div);
                console.scrollTop = console.scrollHeight;
            }

            document.getElementById('runSeedBtn').addEventListener('click', function() {
                const themes = document.getElementById('themes').checked;
                const subjects = document.getElementById('subjects').checked;
                const lofi = document.getElementById('lofi').checked;

                if (!themes && !subjects && !lofi) {
                    alert('Sélectionnez au moins une option');
                    return;
                }

                this.disabled = true;
                this.innerText = 'Seeding en cours...';
                
                const eventSource = new EventSource(\`/api/admin/seed-stream?themes=\${themes}&subjects=\${subjects}&lofi=\${lofi}\`);
                
                eventSource.onmessage = (event) => {
                    const data = JSON.parse(event.data);
                    addLog(data.message, data.type);
                };

                eventSource.addEventListener('end', (event) => {
                    eventSource.close();
                    this.disabled = false;
                    this.innerText = 'Lancer le seeding';
                    alert('Terminé !');
                    updateStats();
                });

                eventSource.onerror = (err) => {
                    eventSource.close();
                    addLog('Erreur SSE', 'error');
                    this.disabled = false;
                    this.innerText = 'Lancer le seeding';
                };
            });

            async function clearCollection(type) {
                if (!confirm(\`Confirmer suppression : \${type} ?\`)) return;
                try {
                    const response = await fetch('/api/admin/clear', {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ type })
                    });
                    const result = await response.json();
                    if (result.success) {
                        alert('Réussi !');
                        updateStats();
                    } else { alert(result.message); }
                } catch (err) { alert('Erreur'); }
            }

            updateStats();
        </script>
    </body>
    </html>
  `;
  res.send(html);
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
    res.json({ success: true, data: stats });
  } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
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

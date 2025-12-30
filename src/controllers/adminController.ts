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
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>PlanÉtude | Admin Dashboard</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <style>
            * { font-family: 'Plus Jakarta Sans', sans-serif; }
            body { background-color: #f8fafc; color: #1e293b; margin: 0; }
            .soft-shadow { box-shadow: 0 10px 30px -10px rgba(0,0,0,0.04), 0 4px 10px -5px rgba(0,0,0,0.02); }
            .sidebar-link.active { background-color: #f1f5f9; color: #6366f1; }
            .action-card:hover { transform: translateY(-2px); transition: all 0.2s; }
            .scrollbar-hide::-webkit-scrollbar { display: none; }
            .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        </style>
        <script>
            tailwind.config = {
                theme: {
                    extend: {
                        fontFamily: { sans: ['Plus Jakarta Sans', 'sans-serif'] },
                        colors: {
                            indigo: {
                                50: '#f5f7ff',
                                100: '#ebf0fe',
                                200: '#ced9fd',
                                600: '#6366f1',
                                700: '#4f46e5',
                            },
                            slate: {
                                50: '#f8fafc',
                                100: '#f1f5f9',
                                300: '#cbd5e1',
                                400: '#94a3b8',
                                500: '#64748b',
                                600: '#475569',
                                800: '#1e293b',
                                900: '#0f172a',
                            }
                        }
                    }
                }
            }
        </script>
    </head>
    <body class="min-h-screen flex">
        <!-- Sidebar -->
        <aside class="w-64 bg-white border-r border-slate-100 flex flex-col p-6 fixed h-full">
            <div class="flex items-center gap-3 mb-10 px-2">
                <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">P</div>
                <span class="font-bold text-xl tracking-tight">PlanÉtude</span>
            </div>
            
            <nav class="space-y-1 flex-1">
                <a href="#" class="sidebar-link active flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                    Dashboard
                </a>
                <a href="#database" class="sidebar-link flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-slate-500 hover:bg-slate-50 transition-all">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
                    Base de données
                </a>
            </nav>

            <div class="mt-auto p-4 bg-slate-50 rounded-2xl">
                <p class="text-xs font-semibold text-slate-400 uppercase mb-2">Statut Serveur</p>
                <div class="flex items-center gap-2">
                    <span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    <span class="text-sm font-medium text-slate-600">En ligne (v1.0.0)</span>
                </div>
            </div>
        </aside>

        <!-- Main Content -->
        <main class="ml-64 flex-1 p-10">
            <header class="flex justify-between items-center mb-10">
                <div>
                    <h2 class="text-3xl font-bold text-slate-800">Admin Console</h2>
                    <p class="text-slate-500 mt-1">Gérez vos données et supervisez l'application PlanÉtude.</p>
                </div>
            </header>

            <!-- Stats Grid -->
            <div class="grid grid-cols-4 gap-6 mb-10">
                <div class="bg-white p-6 rounded-3xl soft-shadow border border-slate-50">
                    <p class="text-sm font-medium text-slate-400 mb-1 uppercase tracking-wider">Utilisateurs</p>
                    <h3 class="text-3xl font-bold text-slate-800" id="stat-users">-</h3>
                </div>
                <div class="bg-white p-6 rounded-3xl soft-shadow border border-slate-50">
                    <p class="text-sm font-medium text-slate-400 mb-1 uppercase tracking-wider">Matières</p>
                    <h3 class="text-3xl font-bold text-slate-800" id="stat-subjects">-</h3>
                </div>
                <div class="bg-white p-6 rounded-3xl soft-shadow border border-slate-50">
                    <p class="text-sm font-medium text-slate-400 mb-1 uppercase tracking-wider">Thèmes</p>
                    <h3 class="text-3xl font-bold text-slate-800" id="stat-themes">-</h3>
                </div>
                <div class="bg-white p-6 rounded-3xl soft-shadow border border-slate-50">
                    <p class="text-sm font-medium text-slate-400 mb-1 uppercase tracking-wider">Pistes Lo-Fi</p>
                    <h3 class="text-3xl font-bold text-slate-800" id="stat-lofi">-</h3>
                </div>
            </div>

            <!-- Management Section -->
            <div class="grid grid-cols-2 gap-8 mb-8">
                <!-- Seeding Card -->
                <div class="bg-white p-8 rounded-[2rem] soft-shadow border border-slate-50">
                    <div class="flex items-center gap-4 mb-8">
                        <div class="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <h4 class="text-xl font-bold">Initialisation (Seed)</h4>
                    </div>
                    
                    <div class="space-y-3 mb-8">
                        <label class="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 border border-slate-100 cursor-pointer hover:bg-slate-50 transition-all">
                            <span class="font-medium text-slate-700 text-sm">Thèmes Pastel</span>
                            <input type="checkbox" id="themes" checked class="w-5 h-5 accent-indigo-600">
                        </label>
                        <label class="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 border border-slate-100 cursor-pointer hover:bg-slate-50 transition-all">
                            <span class="font-medium text-slate-700 text-sm">Matières (Lycée France Complet)</span>
                            <input type="checkbox" id="subjects" checked class="w-5 h-5 accent-indigo-600">
                        </label>
                        <label class="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 border border-slate-100 cursor-pointer hover:bg-slate-50 transition-all">
                            <span class="font-medium text-slate-700 text-sm">Lo-Fi (Jamendo API)</span>
                            <input type="checkbox" id="lofi" checked class="w-5 h-5 accent-indigo-600">
                        </label>
                    </div>

                    <button id="runSeedBtn" class="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-200 active:scale-95">
                        Exécuter le Seeding
                    </button>
                </div>

                <!-- Danger Zone Card -->
                <div class="bg-white p-8 rounded-[2rem] soft-shadow border border-red-50">
                    <div class="flex items-center gap-4 mb-8 text-red-600">
                        <div class="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </div>
                        <h4 class="text-xl font-bold">Zone de Danger</h4>
                    </div>

                    <p class="text-slate-500 text-sm mb-8 leading-relaxed">Attention : Ces actions sont irréversibles. Le nettoyage supprimera les données sélectionnées définitivement de MongoDB.</p>
                    
                    <div class="grid grid-cols-2 gap-3 mb-8">
                        <button onclick="clearCollection('users')" class="p-4 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-xs transition-all text-center">Nettoyer Users</button>
                        <button onclick="clearCollection('plannings')" class="p-4 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-xs transition-all text-center">Nettoyer Plannings</button>
                        <button onclick="clearCollection('subjects')" class="p-4 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-xs transition-all text-center">Nettoyer Matières</button>
                        <button onclick="clearCollection('all')" class="p-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-all text-center">Reset Complet</button>
                    </div>
                </div>
            </div>

            <!-- Interactive Log Console -->
            <div class="bg-slate-900 rounded-[2rem] soft-shadow p-8 overflow-hidden border border-slate-800">
                <div class="flex items-center justify-between mb-6">
                    <div class="flex items-center gap-3">
                        <div class="flex gap-1.5">
                            <div class="w-3 h-3 rounded-full bg-red-500/80"></div>
                            <div class="w-3 h-3 rounded-full bg-amber-500/80"></div>
                            <div class="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                        </div>
                        <span class="text-slate-400 font-mono text-sm ml-2 tracking-tight">seed-activity.log</span>
                    </div>
                    <button onclick="document.getElementById('log-console').innerHTML = ''" class="text-slate-500 hover:text-slate-300 text-xs font-medium transition-colors">Effacer la console</button>
                </div>
                <div id="log-console" class="font-mono text-sm h-64 overflow-y-auto space-y-2 scrollbar-hide text-slate-300">
                    <div class="text-slate-500 italic">// Prêt pour l'initialisation...</div>
                </div>
            </div>

            <!-- Global Status Indicator -->
            <div id="status" class="fixed bottom-10 right-10 z-50 transition-all opacity-0 pointer-events-none translate-y-4">
                <div class="bg-white border border-slate-100 soft-shadow rounded-2xl px-6 py-4 flex items-center gap-4" id="statusContent">
                    <!-- Status injected here -->
                </div>
            </div>
        </main>

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

            function showStatus(message, type = 'success') {
                const status = document.getElementById('status');
                const content = document.getElementById('statusContent');
                const icon = type === 'success' 
                    ? '<svg class="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>'
                    : '<svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>';
                
                content.innerHTML = \`\${icon}<span class="font-bold text-slate-800">\${message}</span>\`;
                status.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
                
                setTimeout(() => {
                    status.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
                }, 4000);
            }

            function addLog(message, type = 'info') {
                const console = document.getElementById('log-console');
                const div = document.createElement('div');
                const colors = {
                    info: 'text-slate-300',
                    success: 'text-emerald-400',
                    error: 'text-red-400',
                    warn: 'text-amber-400'
                };
                const time = new Date().toLocaleTimeString();
                div.className = \`\${colors[type]} flex gap-3\`;
                div.innerHTML = \`<span class="text-slate-600 font-bold">[\${time}]</span> <span>\${message}</span>\`;
                console.appendChild(div);
                console.scrollTop = console.scrollHeight;
            }

            document.getElementById('runSeedBtn').addEventListener('click', function() {
                const themes = document.getElementById('themes').checked;
                const subjects = document.getElementById('subjects').checked;
                const lofi = document.getElementById('lofi').checked;

                if (!themes && !subjects && !lofi) {
                    showStatus('Sélectionnez au moins une option', 'error');
                    return;
                }

                this.disabled = true;
                this.innerHTML = '<span class="flex items-center justify-center gap-2"><svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Seeding en cours...</span>';
                
                const eventSource = new EventSource(\`/api/admin/seed-stream?themes=\${themes}&subjects=\${subjects}&lofi=\${lofi}\`);
                
                eventSource.onmessage = (event) => {
                    const data = JSON.parse(event.data);
                    addLog(data.message, data.type);
                };

                eventSource.addEventListener('end', (event) => {
                    eventSource.close();
                    this.disabled = false;
                    this.innerHTML = 'Exécuter le Seeding';
                    showStatus('Processus terminé !');
                    updateStats();
                });

                eventSource.onerror = (err) => {
                    eventSource.close();
                    addLog('Erreur de connexion au serveur de logs', 'error');
                    this.disabled = false;
                    this.innerHTML = 'Exécuter le Seeding';
                };
            });

            async function clearCollection(type) {
                if (!confirm(\`Êtes-vous sûr de vouloir supprimer \${type === 'all' ? 'TOUTES les données' : 'la collection ' + type} ?\`)) return;
                
                try {
                    const response = await fetch('/api/admin/clear', {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ type })
                    });
                    const result = await response.json();
                    if (result.success) {
                        showStatus(\`Nettoyage (\${type}) réussi !\`);
                        updateStats();
                    } else { showStatus(result.message, 'error'); }
                } catch (err) { showStatus('Erreur lors du nettoyage', 'error'); }
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

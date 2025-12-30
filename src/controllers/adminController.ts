  import { Request, Response } from 'express';
import * as seedService from '../services/seedService';

export const renderSeedUI = (req: Request, res: Response) => {
  const html = `
    <!DOCTYPE html>
    <html lang="fr" class="dark">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>PlanÉtude | Admin Console</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <script>
            tailwind.config = {
                darkMode: 'class',
                theme: {
                    extend: {
                        colors: {
                            brand: {
                                primary: '#3b82f6',
                                secondary: '#1e293b',
                                accent: '#60a5fa',
                                bg: '#0f172a'
                            }
                        },
                        fontFamily: {
                            sans: ['Inter', 'sans-serif'],
                        }
                    }
                }
            }
        </script>
        <style>
            body { background-color: #0f172a; color: #f8fafc; }
            .glass {
                background: rgba(30, 41, 59, 0.7);
                backdrop-filter: blur(12px);
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            .shimmer {
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent);
                background-size: 200% 100%;
                animation: shimmer 2s infinite;
            }
            @keyframes shimmer {
                0% { background-position: -200% 0; }
                100% { background-position: 200% 0; }
            }
        </style>
    </head>
    <body class="min-h-screen flex items-center justify-center p-6 antialiased">
        <div class="max-w-xl w-full glass rounded-3xl p-8 shadow-2xl overflow-hidden relative">
            <!-- Header -->
            <div class="mb-10 text-center">
                <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-primary/10 text-brand-primary mb-4 ring-1 ring-brand-primary/20">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                </div>
                <h1 class="text-3xl font-bold tracking-tight text-white mb-2">Admin Console</h1>
                <p class="text-slate-400 text-sm">Gestion des données et initialisation système</p>
            </div>

            <!-- Content -->
            <div class="space-y-4">
                <label class="group flex items-center justify-between p-4 rounded-2xl bg-slate-800/50 border border-slate-700 hover:border-brand-primary/50 transition-all cursor-pointer">
                    <div class="flex items-center gap-4">
                        <div class="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.172-1.172a4 4 0 115.656 5.656L10 21.657" />
                            </svg>
                        </div>
                        <div>
                            <span class="block font-semibold text-slate-200">Thèmes & Design</span>
                            <span class="text-xs text-slate-500">Configuration visuelle et palettes pastel</span>
                        </div>
                    </div>
                    <input type="checkbox" id="themes" checked class="w-5 h-5 rounded border-slate-700 bg-slate-900 text-brand-primary focus:ring-brand-primary focus:ring-offset-slate-900">
                </label>

                <label class="group flex items-center justify-between p-4 rounded-2xl bg-slate-800/50 border border-slate-700 hover:border-brand-primary/50 transition-all cursor-pointer">
                    <div class="flex items-center gap-4">
                        <div class="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <div>
                            <span class="block font-semibold text-slate-200">Matières Lycée</span>
                            <span class="text-xs text-slate-500">Curriculum complet (1ère & Terminale)</span>
                        </div>
                    </div>
                    <input type="checkbox" id="subjects" checked class="w-5 h-5 rounded border-slate-700 bg-slate-900 text-brand-primary focus:ring-brand-primary focus:ring-offset-slate-900">
                </label>

                <label class="group flex items-center justify-between p-4 rounded-2xl bg-slate-800/50 border border-slate-700 hover:border-brand-primary/50 transition-all cursor-pointer">
                    <div class="flex items-center gap-4">
                        <div class="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                            </svg>
                        </div>
                        <div>
                            <span class="block font-semibold text-slate-200">Musique Lo-Fi</span>
                            <span class="text-xs text-slate-500">Sync avec Jamendo API (30 tracks)</span>
                        </div>
                    </div>
                    <input type="checkbox" id="lofi" checked class="w-5 h-5 rounded border-slate-700 bg-slate-900 text-brand-primary focus:ring-brand-primary focus:ring-offset-slate-900">
                </label>
            </div>

            <!-- Footer Action -->
            <div class="mt-10">
                <button id="runSeedBtn" class="w-full h-14 bg-brand-primary hover:bg-brand-accent text-white font-bold rounded-2xl transition-all shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-3 active:scale-[0.98]">
                    <span>Initialiser la base de données</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </button>
                <div id="status" class="mt-6 min-h-[40px] flex items-center justify-center text-sm font-medium"></div>
            </div>
        </div>

        <script>
            document.getElementById('runSeedBtn').addEventListener('click', async function() {
                const btn = this;
                const statusDiv = document.getElementById('status');
                const options = {
                    themes: document.getElementById('themes').checked,
                    subjects: document.getElementById('subjects').checked,
                    lofi: document.getElementById('lofi').checked
                };

                // Loading State
                btn.disabled = true;
                btn.classList.add('opacity-50', 'cursor-not-allowed');
                statusDiv.innerHTML = \`
                    <div class="flex items-center gap-3 text-brand-accent">
                        <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Seeding en cours...</span>
                    </div>
                \`;
                
                try {
                    const response = await fetch('/api/admin/seed', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(options)
                    });
                    const result = await response.json();
                    
                    if (result.success) {
                        statusDiv.innerHTML = \`
                            <div class="flex items-center gap-2 text-emerald-400">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Initialisation terminée avec succès</span>
                            </div>
                        \`;
                    } else {
                        statusDiv.innerHTML = \`
                            <div class="flex items-center gap-2 text-red-400">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Erreur: \${result.message}</span>
                            </div>
                        \`;
                    }
                } catch (err) {
                    statusDiv.innerHTML = \`
                        <div class="flex items-center gap-2 text-red-400">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Erreur de connexion réseau</span>
                        </div>
                    \`;
                } finally {
                    btn.disabled = false;
                    btn.classList.remove('opacity-50', 'cursor-not-allowed');
                }
            });
        </script>
    </body>
    </html>
  `;
  res.send(html);
};

export const runSeed = async (req: Request, res: Response) => {
  const { themes, subjects, lofi } = req.body;
  const results: any = {};

  try {
    if (themes) {
      results.themes = await seedService.seedThemes();
    }
    if (subjects) {
      results.subjects = await seedService.seedSubjects();
    }
    if (lofi) {
      results.lofi = await seedService.seedLofi();
    }

    res.json({
      success: true,
      message: 'Seeding completed successfully',
      data: results
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

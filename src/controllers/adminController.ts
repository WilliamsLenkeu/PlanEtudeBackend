import { Request, Response } from 'express';
import * as seedService from '../services/seedService';

export const renderSeedUI = (req: Request, res: Response) => {
  const html = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Admin - Seed Database</title>
        <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600&display=swap" rel="stylesheet">
        <style>
            body {
                font-family: 'Quicksand', sans-serif;
                background-color: #FFF0F5;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
            }
            .container {
                background: white;
                padding: 2rem;
                border-radius: 20px;
                box-shadow: 0 10px 25px rgba(255, 182, 193, 0.3);
                width: 400px;
                text-align: center;
            }
            h1 { color: #FF69B4; margin-bottom: 1.5rem; }
            .option {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0.8rem;
                border-bottom: 1px solid #eee;
            }
            .option:last-child { border-bottom: none; }
            button {
                background: #FF69B4;
                color: white;
                border: none;
                padding: 1rem 2rem;
                border-radius: 50px;
                cursor: pointer;
                font-weight: 600;
                margin-top: 1.5rem;
                width: 100%;
                transition: transform 0.2s;
            }
            button:hover { transform: scale(1.02); background: #FF1493; }
            #status { margin-top: 1rem; font-size: 0.9rem; }
            .success { color: #4CAF50; }
            .error { color: #f44336; }
            .loading { color: #FF8C00; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🌸 Seed Database</h1>
            <div id="options">
                <div class="option">
                    <span>Thèmes Pastel</span>
                    <input type="checkbox" id="themes" checked>
                </div>
                <div class="option">
                    <span>Matières Lycée France</span>
                    <input type="checkbox" id="subjects" checked>
                </div>
                <div class="option">
                    <span>Musique Lo-Fi (Jamendo)</span>
                    <input type="checkbox" id="lofi" checked>
                </div>
            </div>
            <button onclick="runSeed()">Lancer le Seeding ✨</button>
            <div id="status"></div>
        </div>

        <script>
            async function runSeed() {
                const statusDiv = document.getElementById('status');
                const options = {
                    themes: document.getElementById('themes').checked,
                    subjects: document.getElementById('subjects').checked,
                    lofi: document.getElementById('lofi').checked
                };

                statusDiv.innerHTML = '<span class="loading">Seeding en cours... ⏳</span>';
                
                try {
                    const response = await fetch('/api/admin/seed', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(options)
                    });
                    const result = await response.json();
                    
                    if (result.success) {
                        statusDiv.innerHTML = '<span class="success">Seed terminé avec succès ! ✅</span>';
                    } else {
                        statusDiv.innerHTML = '<span class="error">Erreur: ' + result.message + '</span>';
                    }
                } catch (err) {
                    statusDiv.innerHTML = '<span class="error">Erreur de connexion ❌</span>';
                }
            }
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

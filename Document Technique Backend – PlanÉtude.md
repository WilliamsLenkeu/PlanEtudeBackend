**Projet :** PlanÉtude  
**Version :** 1.0  
**Date :** 25 décembre 2025  
**Technologies Principales :** Node.js avec Express.js, TypeScript (fortement recommandé), MongoDB avec Mongoose, Intégration Gemini 2.5 Flash via SDK Google Generative AI.

#### 1. Structure du Projet Backend
```
src/
├── config/               # Configurations (DB, env, Gemini)
│   └── db.ts
│   └── gemini.ts
├── controllers/          # Logique métier
│   ├── authController.ts
│   ├── chatController.ts     # Gestion du chat IA
│   ├── planningController.ts
│   ├── progressController.ts
│   └── userController.ts
├── middleware/           # Middlewares
│   ├── authMiddleware.ts # Vérification JWT
│   ├── errorHandler.ts
│   └── rateLimiter.ts    # Pour limiter appels Gemini
├── models/               # Schémas Mongoose
│   ├── User.model.ts
│   ├── Planning.model.ts
│   ├── Progress.model.ts
│   └── ChatHistory.model.ts (optionnel pour historisation)
├── routes/               # Routes API
│   ├── auth.routes.ts
│   ├── chat.routes.ts
│   ├── planning.routes.ts
│   └── progress.routes.ts
├── services/             # Logique réutilisable
│   ├── geminiService.ts  # Appels à l'API Gemini
│   └── planningService.ts # Algorithmes de suggestion basique (fallback)
├── utils/                # Helpers (validation, error, etc.)
├── types/                # Types TypeScript (express, etc.)
├── app.ts                # Configuration Express
├── server.ts             # Lancement serveur
└── .env                  # Variables d'environnement
```

#### 2. Bibliothèques Principales
- **Express.js** : Serveur HTTP.
- **Mongoose** : ODM pour MongoDB.
- **@google/generative-ai** : SDK officiel pour Gemini 2.5 Flash.
- **jsonwebtoken** : Gestion JWT pour authentification.
- **bcryptjs** : Hashage des mots de passe.
- **dotenv** : Gestion variables d’environnement.
- **cors** : Autoriser le frontend.
- **express-rate-limit** : Limiter les requêtes (protection quotas Gemini).
- **helmet** : Sécurité HTTP headers.
- **zod** ou **joi** : Validation des requêtes.
- **winston** ou **pino** : Logging.

#### 3. Variables d’Environnement (.env)
```
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/planetude
JWT_SECRET=une_clé_très_secrète_et_longue
GEMINI_API_KEY=ta_clé_pour_gemini_2.5_flash
NODE_ENV=development
```

#### 4. Modèles MongoDB (Mongoose)
- **User.model.ts**
  ```typescript
  interface User {
    email: string;
    password: string; // hashé
    name: string;
    preferences: { themes: string[]; matieres: string[] };
    createdAt: Date;
  }
  ```

- **Planning.model.ts**
  ```typescript
  interface Planning {
    userId: ObjectId;
    periode: 'jour' | 'semaine' | 'mois' | 'semestre';
    dateDebut: Date;
    sessions: {
      matiere: string;
      debut: Date;
      fin: Date;
      statut: 'planifie' | 'en_cours' | 'termine' | 'rate';
      notes?: string;
    }[];
    createdAt: Date;
  }
  ```

- **Progress.model.ts**
  ```typescript
  interface Progress {
    userId: ObjectId;
    date: Date;
    sessionsCompletees: number;
    tempsEtudie: number; // en minutes
    notes: string;
  }
  ```

#### 5. Service Gemini (services/geminiService.ts)
```typescript
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function getGeminiResponse(prompt: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    // Safety settings pour rester éducatif
    const safetySettings = [
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
      // etc.
    ];

    const result = await model.generateContent(prompt, { safetySettings });
    return result.response.text();
  } catch (error) {
    console.error("Erreur Gemini:", error);
    return "Désolé, je réfléchis encore... Essaie encore dans un instant ! 😅";
  }
}
```

#### 6. Controller Chat (controllers/chatController.ts)
- Endpoint principal : `POST /api/chat`
- Body : `{ message: string, context?: object }`
- Logique :
  1. Récupérer userId via JWT.
  2. Charger contexte (progrès récents, planning actuel) depuis MongoDB.
  3. Construire prompt riche :
     ```
     Tu es PixelCoach, un assistant amical et motivant avec un style pixelisé rétro. 
     Tu aides les étudiants à planifier leurs études. 
     Contexte utilisateur : [résumé des progrès et planning].
     Message utilisateur : {message}
     Réponds de manière naturelle, encourageante, et propose des plannings ou ajustements si pertinent.
     Utilise un ton joyeux et des emojis pixel-friendly.
     ```
  4. Appeler geminiService.
  5. Sauvegarder l’échange (optionnel) et retourner la réponse.

#### 7. Routes API Principales
- **Auth** : `/api/auth/register`, `/api/auth/login`
- **Chat** : `/api/chat` (POST)
- **Planning** : 
  - GET `/api/planning` (liste)
  - POST `/api/planning` (créer via IA ou manuel)
  - PUT `/api/planning/:id` (modifier)
  - DELETE
- **Progress** : POST `/api/progress` (marquer session terminée)

#### 8. Sécurité et Bonnes Pratiques
- JWT dans httpOnly cookie ou Authorization Bearer.
- Validation stricte des inputs (zod).
- Rate limiting sur /chat (ex. : 20 requêtes/minute par user pour éviter dépassement quota Gemini).
- Jamais exposer la clé Gemini au frontend.
- Logging des erreurs et des appels Gemini (sans données sensibles).
- CORS limité au domaine frontend.

#### 9. Déploiement
- Hébergement : Render, Railway, Vercel (serverless) ou VPS.
- MongoDB : Atlas (gratuit pour début).
- CI/CD : GitHub Actions pour tests et déploiement.

#### 10. Tests
- Jest + Supertest pour tests API.
- Tests unitaires pour geminiService (mock des appels).
- Tests d’intégration pour auth et planning.

Ce document backend complète parfaitement le frontend. Avec ces deux documents, tu as une base solide et détaillée pour développer PlanÉtude entièrement.  

Si tu veux des exemples de code plus complets (un endpoint entier, configuration Express, etc.) ou un repo GitHub starter, dis-le-moi !
**Nom du Produit :** PlanÉtude  
**Version :** 2.0 (Intégration IA complète)  
**Date :** 25 décembre 2025  
**Description Générale :** PlanÉtude est une application web dédiée à aider les élèves et étudiants à organiser leurs sessions d'étude de manière autonome. L'interface adopte un style moderne, épuré et intuitif, mettant l'accent sur la création manuelle et le contrôle total de l'utilisateur sur son emploi du temps. Un assistant virtuel conversationnel ("PixelCoach") agit comme un compagnon de soutien, offrant des conseils d'optimisation, des encouragements et une aide ponctuelle pour ajuster le planning selon les besoins de l'utilisateur. L'intégration de l'IA via l'API Gemini 2.5 Flash vient enrichir l'expérience sans jamais se substituer à l'initiative de l'élève.  
**Objectif Principal :** Offrir un outil de planification puissant et autonome, soutenu par une assistance intelligente pour favoriser la discipline et la réussite académique.

#### 1. Public Cible
- Élèves du secondaire (12-18 ans) et étudiants universitaires (18-25 ans).  
- Besoins : Planification flexible, motivation via interactions amicales, accessibilité multi-plateformes.  
- Focus initial : Utilisateurs francophones (France, Belgique, Canada, Afrique francophone).

#### 2. Objectifs du Produit
- **Fonctionnels :** Gestion manuelle complète des plannings (ajout, modification, suppression), suivi des progrès, assistance IA pour l'optimisation, rappels et gamification.  
- **Non Fonctionnels :** Fluidité (animations sans lag), sécurité (RGPD), scalabilité (jusqu'à 10 000 utilisateurs simultanés), performance rapide grâce à Gemini 2.5 Flash (modèle optimisé pour vitesse et coût).

#### 3. Fonctionnalités Clés
- **Inscription et Connexion :** Email, Google ou Apple. Données stockées dans MongoDB.

- **Gestion Autonome des Plannings (Cœur de l'application) :** 
  - Création manuelle de sessions d'étude via une interface de calendrier intuitive.
  - Édition fluide : Drag-and-drop, redimensionnement des sessions.
  - Personnalisation complète des matières et des durées.
  - Visualisation multi-périodes : Jour, semaine, mois.

- **Assistant PixelCoach (Support Intelligent) :** 
  - Chat d'assistance disponible pour répondre aux questions et proposer des ajustements.
  - Suggestions d'optimisation basées sur le planning créé par l'utilisateur (ex: "Tu as beaucoup de maths lundi, veux-tu insérer une pause de 15 min ?").
  - Détection de charge de travail et conseils bien-être.
  - Aide à la répartition des tâches complexes sur demande explicite.

- **Suivi et Analyse :** 
  - Timer intégré, marquage des sessions complétées.
  - Rapports motivants générés par IA (graphiques pixelisés + résumés textuels empathiques).
  - Rappels push/web personnalisés.

- **Gamification et Personnalisation :** 
  - Badges, streaks, thèmes pixelisés.
  - Messages IA humoristiques et encourageants.

- **Intégrations :** Export PDF/iCal, partage social.

#### 4. Exigences Techniques
- **Backend :** 
  - Node.js recommandé.
  - Base de Données : MongoDB.
    - Collections : Users, Plannings (avec user_id, période, sessions), Progres.
  - API : RESTful pour frontend-backend.

- **Intégration IA :** 
  - Modèle : Gemini 2.5 Flash (via Google Generative AI API).
  - SDK : `@google/generative-ai`.
  - Configuration exemple :
    ```javascript
    const { GoogleGenerativeAI } = require("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    async function generateResponse(userInput, context) {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const prompt = `Tu es PixelCoach, un assistant amical et motivant en style pixelisé pour planifier des études. Contexte utilisateur : ${context}. Réponds à : ${userInput} de manière naturelle, encourageante et propose un planning si pertinent.`;
      const result = await model.generateContent(prompt);
      return result.response.text();
    }
    ```
  - Enrichissement prompt : Inclure données MongoDB (progrès passés) pour personnalisation.
  - Sécurité : Clé API en variables d'environnement, appels depuis backend seulement.
  - Gestion quotas/erreurs : Rate limiting, fallback sur réponses prédéfinies.
  - Avantages de Gemini 2.5 Flash : Vitesse élevée, coût bas, reasoning amélioré pour suggestions intelligentes.

- **Frontend :** 
  - React.js pour fluidité.
  - Style pixelisé : CSS custom ou libs comme Pixelify.
  - Animations : Framer Motion.
  - Chat : Interface type chatbot avec avatar pixelisé et indicateur "pensée" pendant appel IA.

- **Déploiement :** Vercel/Heroku, MongoDB Atlas.

#### 5. UX/UI Design
- Style : Pixel art 8/16-bit, couleurs vives et pastels.
- Flow : Inscription → Chat initial IA pour setup → Création planning conversationnelle → Visualisation/édition → Suivi quotidien.
- Accessibilité : Responsive, support daltoniens.

#### 6. Roadmap
- **MVP :** Inscription, chat IA basique (Gemini 2.5 Flash), planning hebdomadaire, visualisation pixelisée (1-2 mois).
- **Phase 2 :** Périodes multiples, gamification, rappels (+1 mois).
- **Phase 3 :** Analyses avancées IA, intégrations (+1 mois).
- **Risques :** Dépendance API externe (gérer downtime), confidentialité données envoyées à Google (anonymiser).

#### 7. Mesures de Succès
- Rétention (30% à 1 mois), plannings créés (>5/semaine/utilisateur), engagement chat IA (>5 messages/session), NPS (>8/10).

Ce PRD est maintenant complet et intègre pleinement Gemini 2.5 Flash comme demandé. Si tu veux ajouter des détails (ex. : prompts spécifiques, wireframes, ou code supplémentaire), fais-le moi savoir !
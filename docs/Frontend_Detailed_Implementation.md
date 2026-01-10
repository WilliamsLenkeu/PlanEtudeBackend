# Guide d'Implémentation Frontend Détaillé - PlanÉtude 🎨

Ce document fournit une spécification technique et fonctionnelle complète pour le développement du frontend. Il est conçu pour être utilisé comme une feuille de route par les développeurs frontend.

---

## 1. Module d'Authentification & Sécurité 🔒

### A. Pages Login & Register
- **Formulaire d'Inscription** :
  - Champs : `name`, `email`, `password`, `gender` (M/F).
  - Validation : Email valide, mot de passe de min. 6 caractères.
- **Formulaire de Connexion** :
  - Champs : `email`, `password`.
  - Option "Se souvenir de moi" (pour gérer la persistance du Refresh Token).
- **Google Auth** :
  - Bouton "Continuer avec Google".
  - Intégration du SDK Google Identity Services.

### B. Gestion de Session (Auth Service)
- **Stockage** : Access Token en mémoire (State), Refresh Token en `httpOnly` cookie ou `localStorage` (selon politique sécurité).
- **Intercepteur Axios** : 
  - Ajouter `Authorization: Bearer <token>` à chaque requête sortante.
  - Gérer l'erreur 401 : Si un appel échoue avec 401, appeler automatiquement `/api/auth/refresh`, mettre à jour le token et re-tenter la requête initiale.

---

## 2. Gestion des Matières (Onboarding) 📚

### A. Écran de Gestion des Matières
- **Liste des matières** : Affichage sous forme de cartes élégantes avec le nom et une icône.
- **Ajout/Édition** : Modal avec champ texte pour le nom.
- **Suppression** : Confirmation avant suppression (attention : supprimer une matière peut impacter les plannings associés).

### B. Impact Algorithmique
- Expliquer à l'utilisateur que plus il ajoute de matières, plus son planning sera diversifié.

---

## 3. Le Générateur de Planning Hybride 🤖

### A. Écran de Configuration
- **Saisie** : Un titre (ex: "Semaine de partiels"), une date de début, et une durée (7 jours par défaut).
- **Appel API** : `POST /api/planning/generate`. Afficher un loader "L'algorithme analyse vos besoins...".

### B. Vue Calendrier (Visualisation)
- **Composant** : Grille horaire (ex: 08:00 à 22:00).
- **Code Couleur** : Attribuer une couleur pastel unique à chaque matière.
- **Interaction** : Cliquer sur une session pour voir les détails (Méthode Pomodoro, priorité).
- **Validation** : Bouton "Sauvegarder mon planning" qui envoie la structure finale à `POST /api/planning`.

---

## 4. Mode Focus & Productivité ⏱️

### A. Le Minuteur Pomodoro
- **Interface** : Un grand cercle de progression (Progress Circle).
- **États** : Travail (25m), Pause Courte (5m), Pause Longue (15m).
- **Notifications** : Signal sonore et notification navigateur à la fin du temps.

### B. Lecteur Lo-Fi Intégré
- **Fonctionnalités** : Play/Pause, Volume, Suivant.
- **Streaming** : Utiliser l'URL `audioUrl` fournie par `GET /api/lofi`.
- **Visuel** : Afficher le titre de la piste et une petite animation d'ondes sonores.

### C. Finalisation de Session
- **Notes** : À la fin d'une session, proposer un champ "Notes de session" (ex: "J'ai fini le chapitre 3").
- **API** : Appeler `PATCH /api/planning/:id/sessions/:sessionId` avec `statut: 'termine'` et les notes.

---

## 5. Statistiques & Gamification 📈

### A. Dashboard de Progression
- **Score de Maîtrise** : Graphique Radar (Spider Chart) montrant l'équilibre entre les matières.
- **Temps Total** : Un compteur "Total d'heures d'étude" (donnée `totalStudyTime`).
- **Niveau XP** : Barre de progression stylisée (ex: "Niveau 5 - Expert en révisions").

### B. Historique
- Liste des sessions terminées avec les XP gagnés pour chaque session.

---

## 6. Personnalisation & Thèmes 🎀

### A. Sélecteur de Thème (Theme Picker)
- **Interface** : Grille de prévisualisation des thèmes (Rose Pastel, Bleu Ciel, Menthe Douce).
- **Application Immédiate** : Changer les variables CSS globales lors du clic.
- **Persistance** : Appeler `PATCH /api/users/preferences` pour que le thème soit sauvegardé sur le compte.

---

## 7. Exports & Mobilité 📱

### A. Export PDF
- Bouton "Télécharger mon planning (PDF)".
- Ouvrir l'URL `GET /api/planning/:id/export.pdf` dans un nouvel onglet.

### B. Synchronisation Calendrier
- Bouton "Ajouter à mon agenda".
- Utiliser l'URL `GET /api/planning/:id/export.ical`.

---

## 🛠️ Stack Technique Recommandée
- **Framework** : React (avec Vite) ou Next.js.
- **Style** : Tailwind CSS + DaisyUI (pour les thèmes et composants).
- **Icônes** : Lucide React.
- **Charts** : Recharts ou Chart.js.
- **State Management** : TanStack Query (React Query) pour les appels API et le cache.

---

## 🔌 Documentation Détaillée des Endpoints & Flux de Données

Cette section détaille les schémas JSON exacts pour les requêtes (Request) et les réponses (Response).

### 1. Flux d'Authentification (Auth Flow)

1.  **Inscription** (`POST /api/auth/register`)
    - **Request Body** :
      ```json
      {
        "name": "Jean Dupont",
        "email": "jean@example.com",
        "password": "mypassword123",
        "gender": "M" 
      }
      ```
    - **Response (201 Created)** :
      ```json
      {
        "success": true,
        "token": "eyJhbGciOiJIUzI1...",
        "refreshToken": "def456...",
        "user": {
          "id": "659f...",
          "name": "Jean Dupont",
          "email": "jean@example.com",
          "role": "user"
        }
      }
      ```

2.  **Connexion** (`POST /api/auth/login`)
    - **Request Body** :
      ```json
      {
        "email": "jean@example.com",
        "password": "mypassword123"
      }
      ```
    - **Response (200 OK)** : (Même structure que l'inscription)

3.  **Rafraîchissement du Token** (`POST /api/auth/refresh`)
    - **Request Body** :
      ```json
      { "refreshToken": "def456..." }
      ```
    - **Response (200 OK)** :
      ```json
      {
        "success": true,
        "token": "new_access_token_..."
      }
      ```

### 2. Gestion des Matières

1.  **Lister les matières** (`GET /api/subjects`)
    - **Response (200 OK)** :
      ```json
      [
        {
          "_id": "sub_01",
          "name": "Mathématiques",
          "color": "#FFD1DC"
        }
      ]
      ```

2.  **Ajouter une matière** (`POST /api/subjects`)
    - **Request Body** :
      ```json
      {
        "name": "Physique-Chimie",
        "color": "#B2E2F2"
      }
      ```

### 3. Flux Planning & Sessions

1.  **Génération de Planning** (`POST /api/planning/generate`)
    - **Request Body** :
      ```json
      {
        "periode": "semaine",
        "dateDebut": "2026-01-12T08:00:00.000Z"
      }
      ```
    - **Response (200 OK)** :
      ```json
      {
        "success": true,
        "data": [
          {
            "matiere": "Mathématiques",
            "debut": "2026-01-12T08:00:00Z",
            "fin": "2026-01-12T10:00:00Z",
            "type": "LEARNING",
            "method": "POMODORO",
            "priority": "HIGH"
          }
        ]
      }
      ```

2.  **Sauvegarder le Planning** (`POST /api/planning`)
    - **Request Body** :
      ```json
      {
        "periode": "semaine",
        "dateDebut": "2026-01-12T08:00:00Z",
        "sessions": [
          {
            "matiere": "Mathématiques",
            "debut": "2026-01-12T08:00:00Z",
            "fin": "2026-01-12T10:00:00Z",
            "statut": "a_faire"
          }
        ]
      }
      ```

3.  **Lister les Plannings** (`GET /api/planning`)
    - **Response (200 OK)** :
      ```json
      {
        "plannings": [
          { "_id": "659...", "periode": "semaine", "dateDebut": "..." }
        ],
        "pagination": { "total": 1, "page": 1, "pages": 1 }
      }
      ```

4.  **Supprimer un Planning** (`DELETE /api/planning/:id`)
    - **Response (200 OK)** :
      ```json
      { "message": "Planning supprimé" }
      ```

5.  **Mettre à jour une session** (`PATCH /api/planning/:id/sessions/:sessionId`)
    - **Request Body** :
      ```json
      {
        "statut": "termine",
        "notes": "Exercices 1 à 10 complétés"
      }
      ```
    - **Response (200 OK)** :
      ```json
      {
        "success": true,
        "data": { "updatedPlanningObject..." }
      }
      ```

### 4. Statistiques & Progression

1.  **Résumé Global (XP, Niveau)** (`GET /api/progress/summary`)
    - **Response (200 OK)** :
      ```json
      {
        "success": true,
        "data": {
          "totalXP": 1250,
          "level": 12,
          "xpToNextLevel": 150,
          "rank": "Maître de la Concentration 🏆",
          "streak": 5
        }
      }
      ```

2.  **Statistiques par Matière** (`GET /api/stats/subjects`)
    - **Response (200 OK)** :
      ```json
      {
        "success": true,
        "data": [
          { "subject": "Mathématiques", "totalMinutes": 450, "percentage": 45 },
          { "subject": "Physique", "totalMinutes": 200, "percentage": 20 }
        ]
      }
      ```

3.  **Données Heatmap (Calendrier)** (`GET /api/stats/heatmap`)
    - **Response (200 OK)** :
      ```json
      {
        "success": true,
        "data": [
          { "date": "2026-01-01", "intensity": 3 },
          { "date": "2026-01-02", "intensity": 5 }
        ]
      }
      ```

4.  **Enregistrer une Session Manuelle** (`POST /api/progress`)
    - **Request Body** :
      ```json
      {
        "subjectId": "658bc...",
        "durationMinutes": 45,
        "notes": "Révision intense"
      }
      ```

### 5. Profil & Paramètres

1.  **Récupérer le Profil Complet** (`GET /api/users/profile`)
    - **Response (200 OK)** :
      ```json
      {
        "success": true,
        "data": {
          "name": "Jean Dupont",
          "email": "jean@example.com",
          "gender": "M",
          "preferences": { "matieres": ["Maths", "Physique"] },
          "themeConfig": { "primary": "#FFB6C1", "font": "Quicksand" }
        }
      }
      ```

2.  **Modifier le Mot de Passe** (`PUT /api/users/change-password`)
    - **Request Body** :
      ```json
      {
        "oldPassword": "current_password",
        "newPassword": "new_secure_password"
      }
      ```

### 6. Personnalisation (Thèmes)

1.  **Lister les Thèmes** (`GET /api/themes`)
    - **Response (200 OK)** :
      ```json
      [
        { "key": "classic-pink", "name": "Rose Classique", "colors": { "primary": "#FFB6C1" } },
        { "key": "ocean-blue", "name": "Bleu Océan", "colors": { "primary": "#B2E2F2" } }
      ]
      ```

2.  **Appliquer un Thème** (`PUT /api/themes/set/:key`)
    - **Example** : `PUT /api/themes/set/ocean-blue`
    - **Response (200 OK)** :
      ```json
      { "success": true, "theme": { "key": "ocean-blue", "config": { ... } } }
      ```

### 7. Mode Focus & LoFi

1.  **Liste des Pistes Audio** (`GET /api/lofi`)
    - **Response (200 OK)** :
      ```json
      {
        "success": true,
        "data": [
          {
            "title": "Matin Calme",
            "artist": "Lofi Girl",
            "audioUrl": "https://...",
            "thumbnail": "https://..."
          }
        ]
      }
      ```

### 8. Administration (Dashboard)

- **Accès UI** : `GET /api/admin/` (Rendu côté serveur via EJS).
- **Fonctions** : Vue d'ensemble des plannings, nettoyage de la base de données, statistiques techniques MongoDB.

---

## 🔄 Résumé de la Communication entre Endpoints

| Action Utilisateur | Flux de données |
| :--- | :--- |
| **S'inscrire** | `Auth` → `User Profile` (Initialisé) |
| **Ajouter Matière** | `Subject` → `User Preferences` (Mis à jour) |
| **Générer Planning** | `User Mastery (Stats)` + `Subjects` → `Planning Algorithm` → `Preview UI` |
| **Sauver Planning** | `Preview UI` → `Planning Store (DB)` |
| **Terminer Session** | `Planning Store` → `User Stats (XP/Mastery)` → `Progress Store` |
| **Voir Dashboard** | `User Stats` + `Progress Store` → `Charts UI` |

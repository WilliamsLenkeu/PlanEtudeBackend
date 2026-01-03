# Plan de Conception Frontend - PlanÉtude 🚀

Ce document détaille l'architecture et l'implémentation du frontend pour l'application PlanÉtude, en expliquant comment consommer l'API backend optimisée.

## 1. Architecture Globale & Authentification 🔐

### Fonctionnalités
- Inscription et Connexion (Classique & Google Auth).
- Gestion des sessions utilisateur persistantes via JWT (Access & Refresh Tokens).
- Protection des routes (Middleware frontend).

### Intégration API
- **Inscription** : `POST /api/auth/register` (Envoyer `name`, `email`, `password`, `gender: M|F`).
- **Connexion** : `POST /api/auth/login` -> Stocker l'Access Token en mémoire (State) et le Refresh Token en `localStorage` ou Cookie sécurisé.
- **Google Auth** : Utiliser la bibliothèque Google Identity Services pour obtenir un `idToken`, puis l'envoyer à `POST /api/auth/google`.
- **Rafraîchissement** : Si une erreur 401 survient, appeler `POST /api/auth/refresh` avec le Refresh Token.

---

## 2. Le Cœur : Planning Hybride Intelligent 📅

Le frontend doit implémenter une interface de gestion du temps basée sur la méthode hybride (Time Blocking, Pomodoro, Spaced Repetition).

### Fonctionnalités
- **Génération Automatique** : Formulaire pour définir la période (jour/semaine) et la date de début.
- **Visualisation Calendrier** : Affichage des sessions planifiées avec codes couleurs par matière.
- **Gestion des Sessions** : Possibilité de marquer une session comme "En cours" ou "Terminée".

### Intégration API
- **Générer** : `POST /api/planning/generate` (Envoie la période et la date). L'API renvoie une liste de sessions optimisées selon la maîtrise de l'utilisateur.
- **Enregistrer** : `POST /api/planning` pour sauvegarder le planning généré.
- **Mettre à jour** : `PATCH /api/planning/:id/sessions/:sessionId` pour changer le statut.
- **Exports** :
    - `GET /api/planning/:id/export.pdf` : Ouvre le PDF généré dans un nouvel onglet.
    - `GET /api/planning/:id/export.ical` : Télécharge le fichier pour calendrier externe.

---

## 3. Mode Focus & Musique Lo-Fi 🎵

C'est l'écran principal lors des phases d'étude.

### Fonctionnalités
- **Minuteur Pomodoro** : Cycle 25 min travail / 5 min pause (géré en frontend).
- **Lecteur Lo-Fi** : Streaming de pistes musicales relaxantes.
- **Notes de session** : Prise de notes rapide durant l'étude.

### Intégration API
- **Musique** : `GET /api/lofi` pour récupérer la liste des pistes. Utiliser l'URL `audioUrl` dans un élément `<audio>` HTML5.
- **Notes** : Envoyer les notes via le `PATCH` de statut de session en fin de cycle.

---

## 4. Statistiques & Profil 📊

Visualisation de la progression pour rester motivé.

### Fonctionnalités
- **Dashboard de Maîtrise** : Graphiques (Radar ou Barres) montrant le niveau dans chaque matière.
- **Temps d'étude** : Compteur global du temps passé à réviser.
- **Thèmes Pastel** : Sélecteur de thèmes (entièrement gratuits).

### Intégration API
- **Stats** : `GET /api/stats` pour récupérer les données de maîtrise et le temps total.
- **Profil** : `GET /api/users/profile` pour les infos de base.
- **Thèmes** : `GET /api/themes` pour lister les thèmes disponibles et `PATCH /api/users/preferences` pour changer le thème courant.

---

## 5. Administration (Dashboard) 👑

Interface réservée aux administrateurs pour la maintenance.

### Fonctionnalités
- **Stats Globales** : Nombre d'utilisateurs, plannings, etc.
- **Maintenance** : Seeding de la base de données (Thèmes, Matières, Musiques).
- **Gestion** : Suppression de plannings obsolètes ou problématiques.

### Intégration API
- **Dashboard** : `GET /api/admin` (Interface EJS pré-construite côté backend).
- **Actions** : Les requêtes vers `/api/admin/*` sont protégées par le rôle `admin` en base de données.

---

## 6. Recommandations Techniques Frontend 🛠️

- **Framework** : React, Vue 3 ou Next.js.
- **UI Library** : Tailwind CSS + Headless UI (ou DaisyUI pour matcher avec le dashboard admin).
- **State Management** : TanStack Query (React Query) est fortement recommandé pour gérer le cache de l'API et les rafraîchissements automatiques.
- **Charts** : Chart.js ou Recharts pour les statistiques de maîtrise.

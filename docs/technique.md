# Documentation Technique - API PlanÉtude 🎀

Cette documentation détaille l'architecture, les choix techniques et les optimisations mis en œuvre pour assurer la performance et la sécurité de l'API.

## 🏗️ Architecture Technique

L'API est construite avec **Node.js** et **Express**, en utilisant **TypeScript** pour un typage strict et une maintenance facilitée.

### 📂 Structure des Dossiers
- `/src/controllers` : Logique métier et gestion des requêtes.
- `/src/models` : Schémas Mongoose pour MongoDB.
- `/src/routes` : Définition des endpoints.
- `/src/middleware` : Middlewares de sécurité (Auth, Error handling, Validation).
- `/src/schemas` : Validation des données avec **Zod**.
- `/src/services` : Services tiers (Planning, Lofi, etc.).

## 🔐 Sécurité & Authentification

### Authentification Hybride (JWT + Refresh Tokens)
- **JWT (Access Token)** : Utilisé pour les requêtes authentifiées (expire après 30 jours).
- **Refresh Token** : Stocké en base de données avec un index TTL pour une suppression automatique après expiration.
- **Rotation des Tokens** : À chaque rafraîchissement, un nouveau couple Access/Refresh est généré, invalidant l'ancien.

### Protections Implémentées
- **Helmet** : Sécurisation des headers HTTP.
- **Rate Limiting** : Protection contre les attaques par force brute (100 requêtes / 15 min par IP).
- **Password Hashing** : Utilisation de **bcryptjs** avec 10 rounds de sel via des hooks `pre-save` sur le modèle User.
- **User Validation** : Le middleware `protect` vérifie systématiquement que l'utilisateur existe toujours en base de données.

## 🚀 Optimisations de Performance

### Mise en Cache (Node-Cache)
- Les données peu changeantes comme les pistes **Lo-Fi** sont mises en cache pendant 1 heure pour réduire les appels aux APIs tierces (Jamendo) et à la base de données.

### Compression
- Utilisation du middleware **compression** (Gzip) pour réduire la taille des réponses JSON envoyées au client.

### Indexation MongoDB
- Indexation sur `email` et `googleId` pour l'authentification.
- Indexation sur `userId` et `dateDebut` pour les plannings afin d'accélérer les statistiques et les recherches.

## 📅 Algorithme de Planning Hybride

Le système de planification intègre trois techniques professionnelles :
1. **Time Blocking** : Organisation de la journée en blocs thématiques.
2. **Pomodoro/Deep Work** : Assignation automatique de la méthode d'exécution selon la complexité du sujet.
3. **Spaced Repetition** : Priorisation des matières en fonction du score de maîtrise (`subjectMastery`) de l'utilisateur.

---
*Dernière mise à jour : 3 Janvier 2026*

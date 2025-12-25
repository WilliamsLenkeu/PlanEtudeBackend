# 📚 Documentation API - PlanÉtude Backend

Bienvenue dans la documentation technique du backend **PlanÉtude**. Ce document est destiné à l'équipe frontend pour faciliter l'intégration des fonctionnalités.

---

## 🚀 Informations Générales

- **URL de Base** : `http://localhost:5000/api`
- **Format des Données** : JSON
- **Authentification** : JWT (Bearer Token)
- **IA Intégrée** : Google Gemini 2.5 Flash ("PixelCoach")

---

## 🔐 Authentification (`/auth`)

### 1. Inscription
- **Endpoint** : `POST /auth/register`
- **Corps de la requête** :
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "votre_mot_de_passe",
    "gender": "M" 
  }
  ```
- **Genre** : `M` (Homme), `F` (Femme), `O` (Autre). Utilisé par l'IA pour personnaliser les réponses.
- **Réponse (201)** : Retourne les infos utilisateur + un `token`.

### 2. Connexion Classique
- **Endpoint** : `POST /auth/login`
- **Corps de la requête** :
  ```json
  {
    "email": "john@example.com",
    "password": "votre_mot_de_passe"
  }
  ```
- **Réponse (200)** : Retourne les infos utilisateur + un `token`.

### 3. Connexion Google
- **Endpoint** : `POST /auth/google`
- **Corps de la requête** :
  ```json
  {
    "idToken": "GOOGLE_ID_TOKEN_RECU_DU_FRONTEND"
  }
  ```

---

## 👤 Utilisateur (`/users`)
*Nécessite le header `Authorization: Bearer <token>`*

### Récupérer le Profil
- **Endpoint** : `GET /users/profile`

### Mettre à jour le Profil/Préférences
- **Endpoint** : `PUT /users/profile`
- **Corps possible** : `name`, `email`, `preferences` (objet), `avatar`.

---

## 🤖 IA PixelCoach (`/chat`)
*Nécessite le header `Authorization: Bearer <token>`*

### Discuter avec l'IA
- **Endpoint** : `POST /chat`
- **Corps de la requête** :
  ```json
  {
    "message": "PixelCoach, crée-moi un planning pour demain : Maths de 8h à 10h et TypeScript de 13h à 15h."
  }
  ```
- **Fonctionnement Spécial** :
  - **Mémoire** : L'IA se souvient des 10 derniers messages de la conversation.
  - **Contexte** : L'IA connaît votre nom, votre genre et votre planning actuel.
  - **Génération Automatique** : Si vous demandez un planning, PixelCoach le génère et le **sauvegarde automatiquement** en base de données.
- **Réponse** :
  ```json
  {
    "response": "Salut John ! Super initiative...",
    "planningCreated": true,
    "planning": {
      "periode": "jour",
      "sessions": [...]
    }
  }
  ```
- **Note** : Le champ `planningCreated` indique si un nouveau planning a été généré et enregistré suite à votre message.

---

## 📅 Planning (`/planning`)
*Nécessite le header `Authorization: Bearer <token>`*

### 1. Récupérer les plannings
- **Endpoint** : `GET /planning`

### 2. Créer un planning
- **Endpoint** : `POST /planning`
- **Corps** :
  ```json
  {
    "periode": "jour",
    "dateDebut": "2025-12-25",
    "sessions": [
      {
        "matiere": "Physique",
        "debut": "2025-12-25T09:00:00Z",
        "fin": "2025-12-25T11:00:00Z",
        "statut": "planifie"
      }
    ]
  }
  ```

### 3. Modifier/Supprimer
- `PUT /planning/:id`
- `DELETE /planning/:id`

---

## 📈 Progrès (`/progress`)
*Nécessite le header `Authorization: Bearer <token>`*

### Enregistrer une session terminée
- **Endpoint** : `POST /progress`
- **Corps** :
  ```json
  {
    "sessionsCompletees": 1,
    "tempsEtudie": 120,
    "notes": "Bien compris le chapitre sur l'optique."
  }
  ```

### Récupérer le résumé
- **Endpoint** : `GET /progress/summary`

---

## 🚀 Déploiement sur Koyeb

Le backend est optimisé pour être déployé sur **Koyeb**.

### 1. Configuration des Variables d'Environnement
Lors de la création de votre service sur Koyeb, vous **devez** configurer les variables suivantes :

| Variable | Description |
| :--- | :--- |
| `MONGODB_URI` | L'URL de connexion à votre base de données MongoDB Atlas. |
| `JWT_SECRET` | Une clé secrète longue et complexe pour sécuriser les tokens. |
| `GEMINI_API_KEY` | Votre clé API Google Gemini. |
| `NODE_ENV` | Mettre à `production`. |
| `GOOGLE_CLIENT_ID` | (Optionnel) Pour le Google Login. |

### 2. Port
Le backend utilise automatiquement la variable `PORT` fournie par Koyeb. Vous n'avez pas besoin de fixer le port manuellement à 5000 dans la configuration Koyeb, laissez-le détecter le port par défaut ou configurez-le sur 8000 si Koyeb le demande.

### 3. Santé (Health Check)
Le endpoint `/` (GET) retourne un message de bienvenue et peut être utilisé par Koyeb pour vérifier que le service est bien en ligne.

---

## 🐳 Déploiement avec Docker

Le projet est entièrement dockerisé pour faciliter le déploiement.

### 1. Pré-requis
- Docker installé
- Docker Compose installé

### 2. Lancement
Pour construire l'image et lancer le conteneur :
```bash
docker-compose up --build -d
```

### 3. Arrêt
```bash
docker-compose down
```

### 4. Logs
Pour voir les logs en temps réel :
```bash
docker logs -f planetude-backend
```

---

## �🛠 Codes d'Erreur Communs

- `400 Bad Request` : Erreur de validation (Zod). Vérifiez le format des données.
- `401 Unauthorized` : Token manquant ou invalide.
- `404 Not Found` : Ressource non trouvée.
- `500 Internal Server Error` : Erreur serveur.

---

## 📦 Environnement de Développement

Le serveur tourne avec `nodemon` et `ts-node`. Pour lancer les tests API fournis :
```bash
npx ts-node src/test-api.ts
```

*Note : Assurez-vous d'avoir configuré le `.env` avec les clés API nécessaires.*
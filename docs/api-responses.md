# 🍭 Guide Complet de l'API - PlanÉtude Girly ✨

Bienvenue dans la documentation technique de l'API PlanÉtude. Ce guide détaille tous les endpoints, les formats de requêtes et les réponses JSON pour une intégration parfaite avec ton interface Hello Kitty Style. 🎀

---

## 🔐 1. Authentification (`/auth`)

### Inscription (`POST /register`)
**Request Body :**
```json
{
  "name": "Sakura",
  "email": "sakura@love.com",
  "password": "monSecretRose123",
  "gender": "F"
}
```

### Connexion (`POST /login`)
**Réponse :**
```json
{
  "_id": "...",
  "token": "eyJhbG...",
  "refreshToken": "...",
  "preferences": {
    "currentTheme": "classic-pink",
    "unlockedThemes": ["classic-pink"]
  }
}
```

---

## 🎨 2. Boutique de Thèmes (`/themes`)

Personnalise ton app avec des couleurs pastel ! 🍭

### Liste des Thèmes (`GET /`)
Récupère tous les thèmes disponibles avec l'état de déblocage pour l'utilisateur actuel. ✨

**Réponse (200 OK) :**
```json
{
  "success": true,
  "data": [
    {
      "key": "classic-pink",
      "name": "Classique Rose 🎀",
      "description": "Le thème original tout doux",
      "priceXP": 0,
      "isUnlocked": true,
      "isCurrent": true,
      "config": {
        "primaryColor": "#FFB6C1",
        "secondaryColor": "#FFD1DC",
        "backgroundColor": "#FFF0F5",
        "accentColor": "#FF69B4",
        "textColor": "#4A4A4A",
        "fontFamily": "'Quicksand', sans-serif",
        "borderRadius": "20px"
      }
    },
    {
      "key": "strawberry-milk",
      "name": "Lait Fraise 🍓",
      "description": "Un délice sucré pour tes yeux",
      "priceXP": 500,
      "isUnlocked": false,
      "isCurrent": false,
      "config": { ... }
    }
  ]
}
```

### Débloquer un Thème (`POST /unlock/:key`)
Débloque un thème en utilisant l'XP de l'utilisateur.

**Réponse (200 OK) :**
```json
{
  "success": true,
  "message": "Bravo ! Tu as débloqué le thème Lait Fraise 🍓 ! 🍭",
  "data": {
    "unlockedThemes": ["classic-pink", "strawberry-milk"],
    "remainingXP": 150,
    "themeConfig": { ... }
  }
}
```

### Appliquer un Thème (`PUT /set/:key`)
Applique un thème déjà débloqué. Renvoie la configuration complète pour mise à jour immédiate du frontend. 🌸

**Réponse (200 OK) :**
```json
{
  "success": true,
  "message": "Thème mis à jour ! 🌸",
  "data": {
    "currentTheme": "strawberry-milk",
    "themeConfig": {
      "primaryColor": "#FFB6C1",
      "backgroundColor": "#FFF0F5",
      "accentColor": "#FF69B4",
      "textColor": "#4A4A4A",
      "fontFamily": "'Quicksand', sans-serif",
      "borderRadius": "20px"
    }
  }
}
```

### Mise à jour du Profil (`PUT /api/users/profile`)
Permet de modifier les informations personnelles. ✨

**Corps de la requête :**
```json
{
  "name": "Sakura Pink",
  "gender": "F",
  "avatar": "https://...",
  "preferences": {
    "matieres": ["Maths", "Design"]
  }
}
```

**Réponse (200 OK) :**
```json
{
  "success": true,
  "message": "Profil mis à jour avec succès ! ✨",
  "data": {
    "name": "Sakura Pink",
    "email": "sakura@love.com",
    "gender": "F",
    "preferences": { ... },
    "themeConfig": { ... }
  }
}
```

### Changement de Mot de Passe (`PUT /api/users/change-password`)
**Corps de la requête :**
```json
{
  "oldPassword": "ancienMotDePasse",
  "newPassword": "nouveauMotDePasse123"
}
```

**Réponse (200 OK) :**
```json
{
  "success": true,
  "message": "Mot de passe modifié avec succès ! 🍭"
}
```

---

### 🎵 Lecteur Lo-Fi

#### `GET /api/lofi`
Récupère une liste de pistes Lo-Fi mixant les pistes de la base de données et celles récupérées en temps réel via l'API Jamendo. ✨

**Réponse (200 OK) :**
```json
{
  "success": true,
  "count": 32,
  "data": [
    {
      "_id": "658f...",
      "title": "Matin Calme 🌸",
      "artist": "PlanÉtude Records",
      "url": "https://...",
      "thumbnail": "https://...",
      "category": "focus"
    },
    {
      "title": "Ambient Chill",
      "artist": "Jamendo Artist",
      "url": "https://prod-1.storage.jamendo.com/...",
      "thumbnail": "https://...",
      "category": "relax",
      "id": "123456"
    }
  ]
}
```

#### `POST /api/lofi`
Ajoute une nouvelle piste personnalisée à la bibliothèque (Admin).

**Corps de la requête :**
```json
{
  "title": "Étude sous la pluie 🌧️",
  "artist": "Lofi Girl",
  "url": "https://...",
  "thumbnail": "https://...",
  "category": "relax"
}
```

---

## 📅 4. Plannings (`/planning`)
... (Voir Swagger pour les détails complets `/api-docs`)

---

## 🚨 5. Gestion des Erreurs
Toutes les erreurs suivent ce format :
```json
{
  "status": "error",
  "message": "Oups ! Une petite erreur est survenue 🎀"
}
```

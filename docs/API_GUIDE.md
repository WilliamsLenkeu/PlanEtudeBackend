# Guide d'Intégration API v2.1 — PlanÉtude Backend

## 📋 Vue d'Ensemble

Le backend PlanÉtude expose une API RESTful complète pour gérer plannings, sessions d'étude, chats IA, rappels et badges.

**Base URL :** `https://api.planetude.app` (ou `http://localhost:3000`)

---

## 🔐 Authentification

### 1. Inscription (Email)
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Dupont",
    "email": "alice@example.com",
    "password": "SecurePass123!",
    "gender": "F"
  }'
```

**Réponse :**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Alice Dupont",
  "email": "alice@example.com",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "a1b2c3d4e5f6g7h8i9j0..."
}
```

### 2. Connexion (Email)
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "SecurePass123!"
  }'
```

### 3. Connexion Google OAuth
```bash
curl -X POST http://localhost:3000/api/auth/google \
  -H "Content-Type: application/json" \
  -d '{
    "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjEx..."
  }'
```
> IdToken obtenu côté frontend via SDK Google Sign-In.

### 4. Rafraîchir le Token d'Accès
```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "token": "a1b2c3d4e5f6g7h8i9j0..."
  }'
```

**Réponse :**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "x9y8z7w6v5u4t3s2r1q0..."
}
```

---

## 📅 Planning

### 1. Créer un Planning
```bash
curl -X POST http://localhost:3000/api/planning \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -d '{
    "periode": "semaine",
    "dateDebut": "2025-12-29",
    "sessions": [
      {
        "matiere": "Mathématiques",
        "debut": "2025-12-29T09:00:00",
        "fin": "2025-12-29T10:30:00",
        "notes": "Chapitres 1-3"
      }
    ]
  }'
```

### 2. Lister Ses Plannings
```bash
curl -X GET http://localhost:3000/api/planning \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

### 3. Modifier un Planning
```bash
curl -X PUT http://localhost:3000/api/planning/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -d '{
    "sessions": [
      { "matiere": "Français", "debut": "...", "fin": "..." }
    ]
  }'
```

### 4. Supprimer un Planning
```bash
curl -X DELETE http://localhost:3000/api/planning/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

### 5. Exporter en iCal
```bash
curl -X GET http://localhost:3000/api/planning/507f1f77bcf86cd799439011/export.ical \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -o planning.ics
```
> Importer dans Google Calendar, Outlook, Apple Calendar, etc.

### 6. Exporter en PDF
```bash
curl -X GET http://localhost:3000/api/planning/507f1f77bcf86cd799439011/export.pdf \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -o planning.pdf
```

---

## 💬 Chat IA (PixelCoach)

### Poser une Question & Générer Planning
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -d '{
    "message": "J'\''ai un examen de maths la semaine prochaine, peux-tu m'\''aider à créer un planning?"
  }'
```

**Réponse :**
```json
{
  "response": "Bien sûr ! Je vais t'aider à organiser tes révisions. Voici un planning que je propose...",
  "planningCreated": true,
  "planning": {
    "_id": "507f1f77bcf86cd799439022",
    "userId": "507f1f77bcf86cd799439011",
    "periode": "semaine",
    "sessions": [...]
  }
}
```

> **Note :** L'IA reçoit un contexte **anonymisé** (nom hashé, résumé du planning, historique).

### Consulter les Métriques IA
```bash
curl -X GET http://localhost:3000/api/chat/metrics \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

**Réponse :**
```json
{
  "calls": 156,
  "successes": 150,
  "failures": 6,
  "totalLatencyMs": 45200,
  "circuit": {
    "failures": 0,
    "lastFailureAt": 1703770800000,
    "open": false,
    "openUntil": 0
  }
}
```

> **Interprétation :** 150 appels réussis sur 156 (96%), latence moyenne ~300ms, circuit fermé (opérationnel).

---

## 📊 Suivi de Progrès

### 1. Créer une Entrée de Progrès
```bash
curl -X POST http://localhost:3000/api/progress \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -d '{
    "date": "2025-12-29",
    "sessionsCompletees": 3,
    "tempsEtudie": 180,
    "notes": "Bien concentré, 2h de révisions maths + 1h physique"
  }'
```

### 2. Lister Son Historique
```bash
curl -X GET http://localhost:3000/api/progress \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

### 3. Résumé Statistiques
```bash
curl -X GET http://localhost:3000/api/progress/summary \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

**Réponse :**
```json
{
  "totalSessions": 42,
  "totalTemps": 12600,
  "count": 14
}
```

---

## 🔔 Rappels (Notifications)

### 1. Créer un Rappel
```bash
curl -X POST http://localhost:3000/api/reminders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -d '{
    "title": "Réviser chapitres 1-3 maths",
    "date": "2025-12-30T08:00:00",
    "planningId": "507f1f77bcf86cd799439022"
  }'
```

### 2. Lister les Rappels
```bash
curl -X GET http://localhost:3000/api/reminders \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

### 3. Supprimer un Rappel
```bash
curl -X DELETE http://localhost:3000/api/reminders/507f1f77bcf86cd799439033 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

> **Note :** Chaque minute, un worker serveur marque les rappels dus comme notifiés. Intégration avec Firebase Cloud Messaging (FCM) ou WebPush à venir.

---

## 🏅 Badges (Gamification)

### 1. Attribuer un Badge
```bash
curl -X POST http://localhost:3000/api/badges \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -d '{
    "key": "first_planning",
    "name": "Planificateur",
    "description": "Créé son premier planning"
  }'
```

### 2. Lister les Badges
```bash
curl -X GET http://localhost:3000/api/badges \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

> **Futurs :** Logique auto pour badges ("5 jours consécutifs" = "Persévérant", etc.).

---

## 👤 Profil Utilisateur

### 1. Récupérer le Profil
```bash
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

### 2. Mettre à Jour le Profil
```bash
curl -X PUT http://localhost:3000/api/users/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -d '{
    "name": "Alice Dupont (Maj)",
    "gender": "F",
    "preferences": {
      "matieres": ["Maths", "Français"],
      "themes": ["dark"]
    }
  }'
```

---

## 🛡️ Sécurité & Bonnes Pratiques

### Authorization Header
Tous les endpoints protégés (marqués `[PROTECTED]`) exigent :
```
Authorization: Bearer <token>
```

### Rate-Limiting
- Limité à **100 requêtes par 15 minutes** par IP.
- Le circuit-breaker IA se ferme après **5 appels échoués** (60s recovery).

### Anonymisation IA
- Avant envoi à Gemini, les données sont :
  - **Noms :** hashés (SHA-256).
  - **IDs :** anonymisés.
  - **Historique :** limité à 200 caractères par message.
- Respect **RGPD** — aucune PII non-chiffrée ne part vers Google.

### Validation
- Tous les payloads sont validés (Zod).
- Erreurs 400 si données invalides.

---

## 🔗 Exemple Frontend (JavaScript)

```javascript
// Authentification
async function login(email, password) {
  const res = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return res.json();
}

// Chat IA
async function askPixelCoach(message, token) {
  const res = await fetch('http://localhost:3000/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ message })
  });
  return res.json();
}

// Créer un planning
async function createPlanning(planning, token) {
  const res = await fetch('http://localhost:3000/api/planning', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(planning)
  });
  return res.json();
}

// Exporter en iCal
async function downloadIcal(planningId, token) {
  const url = `http://localhost:3000/api/planning/${planningId}/export.ical`;
  window.location.href = `${url}?token=${token}`;
  // Ou utiliser fetch + Blob si besoin granulaire
}
```

---

## 🚀 Déploiement

### Variables d'Environnement Requises
```
NODE_ENV=production
PORT=3000
DATABASE_URL=mongodb+srv://...
JWT_SECRET=your_secret_key_here
GEMINI_API_KEY=your_gemini_key_here
GOOGLE_CLIENT_ID=your_google_client_id
```

### Docker
```bash
docker build -t planetude-backend .
docker run -p 3000:3000 --env-file .env planetude-backend
```

### Heroku / Koyeb
```bash
git push heroku main
heroku logs --tail
```

---

## 📞 Support

Erreurs courantes :

| Code | Cause | Solution |
|------|-------|----------|
| 401 | Token absent/expiré | Utiliser `/auth/refresh` |
| 400 | Validation échouée | Vérifier format JSON |
| 500 | Erreur serveur | Consulter logs serveur |

---

**Dernière mise à jour :** 27 décembre 2025

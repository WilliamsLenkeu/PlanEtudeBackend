# Configuration d'Environnement — PlanÉtude Backend v2.1

## 📋 Variables Requises

```bash
# MongoDB
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/planetude?retryWrites=true

# JWT Tokens
JWT_SECRET=your_long_random_secret_key_minimum_32_chars

# Google Gemini API
GEMINI_API_KEY=AIzaSyDxxxx...

# Google OAuth (optionnel mais recommandé pour login)
GOOGLE_CLIENT_ID=123456789-abcdefg.apps.googleusercontent.com

# Server
NODE_ENV=production
PORT=3000
```

## 📊 Variables Optionnelles (Futures)

```bash
# Firebase Cloud Messaging (pour push notifications)
FCM_SERVER_KEY=AAAAx...

# Sentry (monitoring erreurs)
SENTRY_DSN=https://key@sentry.io/123456

# Datadog / Custom Metrics
METRICS_ENABLED=true
METRICS_ENDPOINT=https://api.datadoghq.com/...

# Apple Sign-In (version 2.2+)
APPLE_TEAM_ID=xxxxx
APPLE_KEY_ID=xxxxx
APPLE_BUNDLE_ID=com.planetude.app
```

## 🔐 Sécurité

### JWT_SECRET
- **Minimum 32 caractères aléatoires.**
- Générer avec : `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- Stocker uniquement dans vault (Koyeb Secrets, AWS Secrets Manager, etc.).
- **Jamais** dans le code ou .git.

### GEMINI_API_KEY
- Obtenir via [Google AI Studio](https://aistudio.google.com/apikey).
- Stocker comme secret en production.
- Rate-limit par Google : vérifier quotas.

### GOOGLE_CLIENT_ID
- Créer via [Google Cloud Console](https://console.cloud.google.com/).
- Utiliser pour valider tokens IdToken OAuth.

## 📦 Fichier .env.example

Copier dans `.env` et remplir :

```bash
cp .env.example .env
```

```bash
# .env.example
MONGODB_URI=mongodb+srv://dev:devpass@dev-cluster.mongodb.net/planetude-dev?retryWrites=true
JWT_SECRET=dev_secret_key_never_use_in_production_12345
GEMINI_API_KEY=your_api_key_here
GOOGLE_CLIENT_ID=your_google_client_id
NODE_ENV=development
PORT=3000
```

## 🚀 Déploiement Koyeb

1. **Créer les secrets :** Koyeb Dashboard → Settings → Secrets
2. **Variables à ajouter :**
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `GEMINI_API_KEY`
   - `GOOGLE_CLIENT_ID`
   - `NODE_ENV=production`

3. **Dans le formulaire de déploiement :**
   - Image : `node:20-alpine`
   - Build command : `pnpm install && pnpm build`
   - Run command : `pnpm start`

## 🐳 Déploiement Docker

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

CMD ["pnpm", "start"]
```

```bash
# Build et run
docker build -t planetude-backend .
docker run -p 3000:3000 \
  -e MONGODB_URI=$MONGODB_URI \
  -e JWT_SECRET=$JWT_SECRET \
  -e GEMINI_API_KEY=$GEMINI_API_KEY \
  -e GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID \
  planetude-backend
```

## 🔄 Rotation Secrets (Production)

**Tous les 90 jours :**
- Régénérer `JWT_SECRET`
- Créer un déploiement avec nouveau secret
- Les tokens actifs restent valides jusqu'à expiration (30j)

---

**Dernière mise à jour :** 27 décembre 2025


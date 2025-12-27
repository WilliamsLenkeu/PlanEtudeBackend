# Backend PlanÉtude

Backend de l'application PlanÉtude, propulsé par Node.js, Express, MongoDB et Google Gemini 2.5 Flash.

## 📚 Documentation

**➡️ [Commencer par la documentation](./docs/QUICK_START.md)** ou voir [Index Documentation](./docs/DOCS_INDEX.md)

- **[QUICK_START.md](./docs/QUICK_START.md)** — Vue d'ensemble v2.1 (5 min)
- **[API_GUIDE.md](./docs/API_GUIDE.md)** — Tous les endpoints + exemples
- **[ENV_GUIDE.md](./docs/ENV_GUIDE.md)** — Configuration & déploiement
- **[DOCS_INDEX.md](./docs/DOCS_INDEX.md)** — Index par rôle

Voir dossier [docs/](./docs/) pour toute la documentation.

## Prérequis

- Node.js (v22+)
- MongoDB (Atlas ou local)
- pnpm (v10+) ou npm

## Installation

```bash
pnpm install
pnpm build
pnpm dev
```

## Configuration

Voir [docs/ENV_GUIDE.md](./docs/ENV_GUIDE.md) pour le détail complet.

```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=votre_secret_jwt
GEMINI_API_KEY=votre_cle_api_gemini
GOOGLE_CLIENT_ID=votre_google_client_id
NODE_ENV=development
PORT=3000
```

## Lancement

```bash
# Développement
pnpm dev

# Build production
pnpm build

# Production
pnpm start
```

## Tests

```bash
bash tests/TEST_API.sh
```

## Structure

```
src/
├── controllers/   — Logique endpoints
├── models/       — Schémas MongoDB
├── routes/       — Routes API
├── services/     — Logique métier (IA, sanitization, etc.)
├── middleware/   — Auth, validation, erreurs
├── worker/       — Background jobs
├── utils/        — Logger, validation
└── config/       — DB, env, Gemini
```

## 🚀 Déploiement

Voir [docs/ENV_GUIDE.md](./docs/ENV_GUIDE.md) pour :
- Koyeb
- Docker
- Heroku
- Configuration secrets

## 📞 Support

- **Développeurs** → [docs/API_GUIDE.md](./docs/API_GUIDE.md)
- **DevOps** → [docs/ENV_GUIDE.md](./docs/ENV_GUIDE.md)
- **QA** → [tests/README.md](./tests/README.md)
- **Managers** → [docs/DELIVERY_SUMMARY.md](./docs/DELIVERY_SUMMARY.md)

## 📝 Changements v2.1

✅ **10 nouvelles fonctionnalités implémentées :**
- Anonymisation IA (RGPD)
- Circuit-breaker résilience
- Exports iCal/PDF
- Notifications & rappels
- Gamification (badges)
- Refresh tokens
- Métriques monitoring
- Rate-limiting
- Documentation complète
- Suite d'intégration

Voir [docs/CHANGELOG.md](./docs/CHANGELOG.md) pour détail complet.
- `src/models` : Schémas de base de données
- `src/routes` : Définition des routes API
- `src/services` : Services externes (Gemini)

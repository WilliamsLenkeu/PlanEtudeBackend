# 📁 Structure du Projet — PlanÉtude Backend v2.1

```
PlanEtudeBackend/
│
├── 📄 Fichiers Root
│   ├── README.md                    ← Lire en premier
│   ├── PROJECT_STRUCTURE.md         ← Organization guide (ce fichier)
│   ├── PRD.md                       ← Spécifications originales
│   ├── package.json                 ← Dépendances (pnpm)
│   ├── tsconfig.json                ← Config TypeScript
│   ├── docker-compose.yml           ← Docker local
│   ├── Dockerfile                   ← Image production
│   └── .env                         ← Variables d'environnement
│
├── 📚 docs/                         ← DOCUMENTATION COMPLÈTE
│   ├── README.md                    ← Points d'entrée doc
│   ├── QUICK_START.md               ⭐ COMMENCER ICI (5 min)
│   ├── DOCS_INDEX.md                ← Navigation par rôle
│   │
│   ├── 📖 Guides Techniques
│   │   ├── API_GUIDE.md             ← Tous endpoints + 30+ exemples
│   │   └── ENV_GUIDE.md             ← Config + déploiement
│   │
│   ├── 📊 Récapitulatifs
│   │   ├── CHANGELOG.md             ← Détail changements v2.1
│   │   ├── IMPLEMENTATION_SUMMARY.md ← Architecture complète
│   │   ├── DELIVERY_SUMMARY.md      ← Livraison finale
│   │   └── API_DOCUMENTATION.md     ← Référence API
│   │
│   └── 📋 Structure
│       └── (Tous accessibles via README.md)
│
├── 🧪 tests/                        ← SUITES DE TEST
│   ├── README.md                    ← Guide tests
│   └── TEST_API.sh                  ← Test suite exécutable (350 lignes)
│
├── 📦 src/                          ← CODE SOURCE
│   ├── app.ts                       ← Express app + routes mounting
│   ├── server.ts                    ← Startup + worker init
│   │
│   ├── config/
│   │   ├── db.ts                    ← MongoDB connection
│   │   ├── env.ts                   ← Environment validation
│   │   └── gemini.ts                ← Google Gemini config
│   │
│   ├── controllers/                 ← Business Logic
│   │   ├── authController.ts        ← Login + refresh tokens
│   │   ├── chatController.ts        ← IA chat + metrics
│   │   ├── planningController.ts    ← Planning CRUD + exports
│   │   ├── progressController.ts    ← Progress tracking
│   │   ├── userController.ts        ← Profile management
│   │   ├── reminderController.ts    ← Reminders (NEW)
│   │   └── badgeController.ts       ← Badges/Gamification (NEW)
│   │
│   ├── models/                      ← MongoDB Schemas
│   │   ├── User.model.ts
│   │   ├── Planning.model.ts
│   │   ├── Progress.model.ts
│   │   ├── ChatHistory.model.ts
│   │   ├── Reminder.model.ts        ← (NEW)
│   │   ├── Badge.model.ts           ← (NEW)
│   │   └── RefreshToken.model.ts    ← (NEW)
│   │
│   ├── routes/                      ← Route Mounting
│   │   ├── auth.routes.ts
│   │   ├── chat.routes.ts
│   │   ├── planning.routes.ts
│   │   ├── progress.routes.ts
│   │   ├── user.routes.ts
│   │   ├── reminder.routes.ts       ← (NEW)
│   │   └── badge.routes.ts          ← (NEW)
│   │
│   ├── services/                    ← Business Logic Layer
│   │   ├── geminiService.ts         ← IA + circuit-breaker + metrics
│   │   ├── planningService.ts
│   │   └── aiSanitizer.ts           ← RGPD anonymization (NEW)
│   │
│   ├── middleware/
│   │   ├── authMiddleware.ts        ← JWT protection
│   │   ├── errorHandler.ts          ← Global error handling
│   │   └── validateMiddleware.ts    ← Zod validation
│   │
│   ├── worker/
│   │   └── reminderWorker.ts        ← Background jobs (NEW)
│   │
│   ├── utils/
│   │   ├── logger.ts                ← Winston logging
│   │   └── validation.ts            ← Zod schemas
│   │
│   └── types/                       ← TypeScript interfaces
│
├── 📁 node_modules/                 ← Dependencies (pnpm)
├── 📁 dist/                         ← Compiled output (TypeScript)
└── 📁 .git/                         ← Git repository

```

## 📊 Statistiques

| Catégorie | Fichiers | Lignes | Status |
|-----------|----------|--------|--------|
| **Code Source** | 10 | 294 | ✅ |
| **Documentation** | 8 | 1,620 | ✅ |
| **Tests** | 1 | 350 | ✅ |
| **Configuration** | 6 | - | ✅ |
| **Total** | 25+ | 2,260+ | ✅ |

## 🎯 Où Aller

### "Je veux commencer"
→ [docs/QUICK_START.md](./docs/QUICK_START.md)

### "Je veux l'architecture"
→ [docs/IMPLEMENTATION_SUMMARY.md](./docs/IMPLEMENTATION_SUMMARY.md)

### "Je veux les endpoints"
→ [docs/API_GUIDE.md](./docs/API_GUIDE.md)

### "Je veux déployer"
→ [docs/ENV_GUIDE.md](./docs/ENV_GUIDE.md)

### "Je veux tester"
→ [tests/TEST_API.sh](./tests/TEST_API.sh)

### "Je veux naviguer"
→ [docs/DOCS_INDEX.md](./docs/DOCS_INDEX.md)

---

**Dernière mise à jour :** 27 décembre 2025

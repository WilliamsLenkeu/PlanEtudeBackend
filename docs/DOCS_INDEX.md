# 📚 Index de Documentation — PlanÉtude Backend v2.1

Bienvenue ! Ce fichier vous aide à naviguer dans la documentation du projet.

---

## 🎯 Par Rôle

### Pour les **Développeurs**

1. **[QUICK_START.md](QUICK_START.md)** ← COMMENCER ICI
   - Résumé v2.1 en 5 min
   - Checklist compilation
   - Endpoints clés

2. **[API_GUIDE.md](API_GUIDE.md)** (200+ lignes)
   - Tous les endpoints documentés
   - 30+ exemples curl/JavaScript
   - Flux complets (auth → planning → export)

3. **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)**
   - Architecture détaillée
   - Code snippets
   - Roadmap v2.2+

4. **[CHANGELOG.md](CHANGELOG.md)**
   - Tous les changements v2.1
   - État de couverture PRD
   - Limitations connues

### Pour les **DevOps / Ops**

1. **[ENV_GUIDE.md](ENV_GUIDE.md)**
   - Variables d'environnement requises
   - Configuration prod (Koyeb, Docker)
   - Gestion secrets
   - Rotation tokens

2. **[docker-compose.yml](docker-compose.yml)**
   - Setup local avec MongoDB
   - Commandes de déploiement

3. **[Dockerfile](Dockerfile)**
   - Image production-ready
   - Multi-stage build

### Pour les **QA / Testeurs**

1. **[TEST_API.sh](TEST_API.sh)**
   - Suite d'intégration exécutable
   - Bash script avec 11 sections
   - Commande : `bash TEST_API.sh`

2. **[API_GUIDE.md](API_GUIDE.md)** → Section "Exemples Frontend"
   - Code JavaScript pour intégration
   - Patterns à suivre

3. **[CHANGELOG.md](CHANGELOG.md)** → Section "Sécurité Vérifiée"
   - Mesures testées

### Pour les **Stakeholders / Managers**

1. **[QUICK_START.md](QUICK_START.md)** → Section "Résumé Exécutif"
   - 10/11 exigences du PRD implémentées
   - Status prêt pour production

2. **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** → Section "État de Couverture PRD"
   - Tableau de conformité
   - Roadmap v2.2+

---

## 🗺️ Navigation par Tâche

### "Je veux compiler le code"
1. Lire : [QUICK_START.md](QUICK_START.md#-compilation--tests)
2. Lancer : `pnpm build`
3. Si erreurs : vérifier [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md#-checklist-de-déploiement)

### "Je veux déployer en production"
1. Configurer : [ENV_GUIDE.md](ENV_GUIDE.md#-déploiement-koyeb)
2. Builder : `pnpm install && pnpm build`
3. Lancer : `pnpm start` ou Docker
4. Monitorer : `GET /api/chat/metrics` chaque 5 min

### "Je veux tester les endpoints"
1. Démarrer : `pnpm dev`
2. Exécuter : `bash TEST_API.sh`
3. Voir détails : [API_GUIDE.md](API_GUIDE.md)

### "Je veux comprendre ce qui a changé"
1. Lire : [CHANGELOG.md](CHANGELOG.md#-nouvelles-fonctionnalités)
2. Comparer : [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md#-fichiers-ajoutésmodifiés)

### "Je veux ajouter une fonctionnalité"
1. Consulter : [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md#-roadmap-futures-v22)
2. Vérifier PRD : [PRD.md](PRD.md)
3. Coder dans `src/` (suivre structure)
4. Tester : `bash TEST_API.sh` + code review

---

## 📋 Fichiers Documentation

| Fichier | Cible | Longueur | Focus |
|---------|-------|----------|-------|
| [QUICK_START.md](QUICK_START.md) | Tous | 150 lignes | Vue d'ensemble rapide |
| [API_GUIDE.md](API_GUIDE.md) | Dev/QA | 250 lignes | Endpoints + exemples |
| [ENV_GUIDE.md](ENV_GUIDE.md) | DevOps | 120 lignes | Configuration |
| [CHANGELOG.md](CHANGELOG.md) | Managers | 200 lignes | Changements + roadmap |
| [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) | Tech Leads | 300 lignes | Architecture complète |
| [TEST_API.sh](TEST_API.sh) | QA | 350 lignes | Tests exécutables |
| [README.md](README.md) | Tous | 50 lignes | Projet basics |
| [PRD.md](PRD.md) | Référence | 200 lignes | Spécifications originales |

---

## 🔍 Par Concept

### Sécurité & RGPD
- [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md#-sécurité-vérifiée) → Mesures
- [CHANGELOG.md](CHANGELOG.md#-sécurité) → Tableau comparatif
- [API_GUIDE.md](API_GUIDE.md#-sécurité--bonnes-pratiques) → Best practices

### Authentification
- [API_GUIDE.md](API_GUIDE.md#-authentification) → 4 méthodes (register, login, google, refresh)
- [CHANGELOG.md](CHANGELOG.md#-refresh-tokens) → Détail implémentation

### Chat IA & Anonymisation
- [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md#-1-anonymisation-ia--respect-rgpd) → Architecture
- [API_GUIDE.md](API_GUIDE.md#-chat-ia-pixelcoach) → Usage exemples
- `src/services/aiSanitizer.ts` → Code source

### Notifications
- [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md#-5-notifications--rappels) → Scaffold
- [API_GUIDE.md](API_GUIDE.md#-rappels-notifications) → Endpoints
- `src/worker/reminderWorker.ts` → Code source

### Exports
- [API_GUIDE.md](API_GUIDE.md#-5-exporter-en-ical) → iCal endpoint
- [API_GUIDE.md](API_GUIDE.md#-6-exporter-en-pdf) → PDF endpoint

### Monitoring
- [API_GUIDE.md](API_GUIDE.md#-consulter-les-métriques-ia) → GET /metrics
- [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md#-métriques--monitoring) → Tableau

---

## 🚀 Étapes Rapides

### Setup Local (5 min)
```bash
pnpm install
pnpm build
pnpm dev
bash TEST_API.sh  # dans un autre terminal
```

### Deploy Koyeb (10 min)
```bash
# 1. Créer secrets dans Koyeb Dashboard
# 2. Lancer : git push
# 3. Vérifier : https://your-app.koyeb.app/
```

### Monitoring (Continu)
```bash
# Chaque 5 min
curl https://your-api.com/api/chat/metrics
# Vérifier : circuit.open === false
```

---

## 🔗 Fichiers Source Clés

Fichiers à consulter pour comprendre l'implémentation :

```
src/
├── services/
│   ├── aiSanitizer.ts            ← Anonymisation RGPD
│   └── geminiService.ts          ← Circuit-breaker + metrics
├── models/
│   ├── Reminder.model.ts         ← Notifications
│   ├── Badge.model.ts            ← Gamification
│   └── RefreshToken.model.ts     ← Auth refresh
├── controllers/
│   ├── authController.ts         ← /refresh endpoint
│   ├── chatController.ts         ← /metrics endpoint
│   └── planningController.ts     ← /export endpoints
└── worker/
    └── reminderWorker.ts         ← Background jobs
```

---

## ❓ FAQ Documentation

**Q: Par où commencer ?**  
A: [QUICK_START.md](QUICK_START.md) puis [API_GUIDE.md](API_GUIDE.md)

**Q: Comment tester ?**  
A: `bash TEST_API.sh` — voir aussi [TEST_API.sh](TEST_API.sh)

**Q: Quels endpoints sont nouveaux ?**  
A: [CHANGELOG.md](CHANGELOG.md#-nouvelles-fonctionnalités) ou [API_GUIDE.md](API_GUIDE.md#-endpoints-complets)

**Q: Comment déployer ?**  
A: [ENV_GUIDE.md](ENV_GUIDE.md#-déploiement-koyeb)

**Q: Quoi faire après v2.1 ?**  
A: [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md#-roadmap-futures-v22)

**Q: Où trouver les exemples de code ?**  
A: [API_GUIDE.md](API_GUIDE.md) (30+ exemples curl/JS)

**Q: Comment configurer les secrets ?**  
A: [ENV_GUIDE.md](ENV_GUIDE.md#-sécurité)

---

## 📞 Support Rapide

Pour questions rapides, chercher dans :
1. [QUICK_START.md](QUICK_START.md) → section "📞 Support Rapide"
2. [API_GUIDE.md](API_GUIDE.md) → section "🔗 Exemple Frontend"
3. [CHANGELOG.md](CHANGELOG.md) → section "🐛 Known Limitations"

---

**Dernière mise à jour :** 27 décembre 2025  
**Version :** 2.1 (Production-Ready)

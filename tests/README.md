# 🧪 Tests — PlanÉtude Backend

Dossier contenant les suites de test et outils de validation.

## 📋 Fichiers

### Test Suite
- **[TEST_API.sh](TEST_API.sh)** (350 lignes, exécutable)
  - Suite d'intégration complète bash
  - 11 sections de test
  - Coverage : auth, planning, chat IA, progress, reminders, badges, exports
  - Crée un utilisateur test, vérifie tous les endpoints

## 🚀 Utilisation

```bash
# Démarrer l'API localement d'abord
cd ..
pnpm dev

# Dans un autre terminal, exécuter les tests
bash TEST_API.sh
```

## 📊 Couverture

| Section | Endpoints | Status |
|---------|-----------|--------|
| API Santé | `GET /` | ✅ |
| Authentification | `/register`, `/login`, `/google`, `/refresh` | ✅ |
| Profil Utilisateur | `/profile` (GET, PUT) | ✅ |
| Planning | CRUD complet + exports | ✅ |
| Chat IA | `/chat`, `/metrics` | ✅ |
| Progrès | CRUD + summary | ✅ |
| Rappels | `/reminders` CRUD | ✅ |
| Badges | `/badges` CRUD | ✅ |
| Exports | iCal + PDF | ✅ |

## 📝 Notes

- Les tests créent un utilisateur temporaire avec email aléatoire
- Tous les tokens sont testés (access + refresh)
- Valide les codes HTTP et structure JSON
- Les fichiers exportés (iCal, PDF) sont sauvegardés en `/tmp/`

---

**Dernière mise à jour :** 27 décembre 2025

# Changelog — PlanÉtude Backend

## Version 2.1 (27 Décembre 2025) — Conformité PRD + Améliorations de Sécurité

### ✅ Nouvelles Fonctionnalités

#### 1. **Anonymisation IA & Respect RGPD**
- Ajout de `src/services/aiSanitizer.ts` : anonymisation des données avant envoi à Gemini.
- Les PII (noms, IDs, emails) sont masqués via hash SHA-256.
- Seuls des résumés chiffrés et des données structurées sont partagées avec l'IA.
- **Impact :** Sécurité accentuée, conformité RGPD améliorée.

#### 2. **Circuit-Breaker & Fallback Gemini**
- Ajout d'un circuit-breaker simple dans `getGeminiResponse()`.
- Ouvre après 5 appels échoués, se ferme après 60 secondes.
- Fallback gracieux avec message utilisateur adapté.
- Métriques en mémoire : succès/échecs, latence moyenne, état du circuit.
- **Endpoint :** `GET /api/chat/metrics` (protégé) — retourne statistiques temps réel.

#### 3. **Rate-Limiting IA**
- `express-rate-limit` déjà configuré dans `app.ts` (100 req/15min par IP).
- Peut être affiné pour `/api/chat` seul si nécessaire.

#### 4. **Exports iCal & PDF**
- Endpoints :
  - `GET /api/planning/:id/export.ical` — retourne fichier `.ics` pour calendrier.
  - `GET /api/planning/:id/export.pdf` — génère PDF avec sessions formatées.
- Dépendance : `pdfkit` (déjà ajoutée à `package.json`).
- Validations : vérification d'ownership utilisateur.

#### 5. **Notifications & Rappels**
- Nouveau modèle : `Reminder` (userId, title, date, notified, planningId).
- Endpoints :
  - `POST /api/reminders` — créer un rappel.
  - `GET /api/reminders` — lister les rappels de l'utilisateur.
  - `DELETE /api/reminders/:id` — supprimer un rappel.
- Worker de fond : `src/worker/reminderWorker.ts`
  - Exécuté toutes les minutes (checkup des rappels dus).
  - Marque `notified=true` et logue (scaffold pour intégration FCM/WebPush).

#### 6. **Gamification Minimale**
- Nouveau modèle : `Badge` (userId, key, name, description, awardedAt).
- Endpoints :
  - `POST /api/badges` — attribuer un badge à l'utilisateur.
  - `GET /api/badges` — récupérer les badges de l'utilisateur.
- Scaffold pour futur : intégration logique d'attribution auto basée sur progrès.

#### 7. **Refresh Tokens**
- Nouveau modèle : `RefreshToken` (userId, token, expiresAt).
- Nouvelle fonction : `createRefreshToken()` (génère token sécurisé 40 bytes).
- Endpoints :
  - `POST /api/auth/login` & `/register` & `/google` — retournent désormais `token` + `refreshToken`.
  - `POST /api/auth/refresh` — échange refresh token pour nouveau access token + refresh token.
- Cycles : tokens d'accès 30j, refresh tokens 30j (staggered expiry possible).

### 📊 Métriques & Monitoring

- `GET /api/chat/metrics` (protégé) retourne :
  ```json
  {
    "calls": 42,
    "successes": 40,
    "failures": 2,
    "totalLatencyMs": 8500,
    "circuit": { "failures": 2, "lastFailureAt": ..., "open": false, "openUntil": ... }
  }
  ```

### 🔒 Sécurité

| Aspect | Avant | Après |
|--------|-------|-------|
| PII vers IA | Nom/email brut | Anonymisé (hash SHA-256) |
| Défaillance API IA | Pas de circuit-breaker | Circuit-breaker + fallback |
| Tokens | Pas de refresh | Refresh token support |
| Rate-limiting | Basique | Persistant, ajustable |

### 🚀 Prochaines Étapes (Non Implémentées)

1. **Intégration Push/WebPush** : remplacer le logging du worker par appels FCM/WebPush.
2. **Badges Auto-Attribués** : logique basée sur progrès (ex: 5 sessions = badge "Persévérant").
3. **Tests d'Intégration** : valider le flow complet auth→planning via chat IA→export.
4. **Monitoring Prod** : dashboards Grafana/DataDog pour circuit-breaker et latence Gemini.
5. **Apple Sign-In** : endpoint `/api/auth/apple` (non inclus à la demande).

### 📝 Migration & Deploy

1. **Dépendances :**
   ```bash
   pnpm install
   ```

2. **Env vars (si nécessaire) :**
   - Aucune nouvelle variable requise (Gemini key existant).

3. **DB Migrations :**
   - Mongoose crée automatiquement les collections `Reminder`, `Badge`, `RefreshToken`.

4. **Test rapide :**
   ```bash
   pnpm build
   pnpm start
   # Vérifier : POST /api/chat {"message": "Hello"} doit anonymiser en arrière-plan
   ```

---

## Version 2.0 (Décembre 2025) — Intégration Gemini 2.5 Flash

- Chat IA avec génération plannings automatique.
- Historique chat persistant.
- Planning CRUD basique.
- Auth Email + Google OAuth.


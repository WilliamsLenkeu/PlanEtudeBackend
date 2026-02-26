# Procédures — PlanÉtude Backend

## Seed Admin (initialisation des données)

Le seed permet d'injecter en base :
- **Thèmes pastel** (classic-pink, strawberry-milk, etc.)
- **Matières Lycée** (Maths, Français, etc.)
- **Pistes Lo-Fi** (via l'API Jamendo)

### Méthode 1 : Dashboard Admin (recommandé)

1. **Accéder au dashboard**
   - Ouvrez : `http://localhost:3001/api/admin` (ou l'URL de votre backend)
   - Si non connecté, redirection vers la page de connexion

2. **Se connecter**
   - Utilisez un compte **admin** OU **williams25prince@gmail.com** (accès seed sans rôle admin)

3. **Lancer le seed**
   - Cochez les options souhaitées (Thèmes, Matières, Lo-Fi)
   - Cliquez sur **« Lancer le Seeding »**
   - Suivez les logs en temps réel

### Méthode 2 : Script CLI

```bash
cd PlanEtudeBackend
pnpm exec ts-node seed-data.ts
```

> Nécessite une variable `MONGODB_URI` dans `.env`.

### Prérequis Lo-Fi

Le seed Lo-Fi utilise l'API Jamendo. Ajoutez dans `.env` :

```
JAMENDO_CLIENT_ID=votre_client_id
```

Obtenir un Client ID : [Jamendo API](https://developer.jamendo.com/).

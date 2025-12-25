# Backend PlanÉtude

Backend de l'application PlanÉtude, propulsé par Node.js, Express, MongoDB et Google Gemini 2.5 Flash.

## Prérequis

- Node.js (v18+)
- MongoDB (URI à configurer dans `.env`)
- Clé API Google Gemini

## Installation

```bash
# Installer les dépendances
# Note : Si pnpm est disponible
pnpm install

# Sinon
npm install
```

## Configuration

Renommez le fichier `.env` si nécessaire et remplissez les variables :

```env
PORT=5000
MONGODB_URI=votre_uri_mongodb
JWT_SECRET=votre_secret_jwt
GEMINI_API_KEY=votre_cle_api_gemini
NODE_ENV=development
```

## Lancement

```bash
# Mode développement
npm run dev

# Build
npm run build

# Production
npm start
```

## Structure

- `src/config` : Configuration DB et IA
- `src/controllers` : Logique des endpoints
- `src/models` : Schémas de base de données
- `src/routes` : Définition des routes API
- `src/services` : Services externes (Gemini)

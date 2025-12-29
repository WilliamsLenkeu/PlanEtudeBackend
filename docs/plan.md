# 🎀 Guide d'Intégration Frontend Kawaii & Girly - PlanÉtude

Ce guide fournit des directives pour créer une interface moderne, ultra-douce (style Hello Kitty) et interactive, avec un thème clair forcé.

---

## 🌸 1. Univers Visuel & Design Kawaii

### Identité Visuelle (Thème Clair Forcé)
- **Concept** : Une interface "Soft UI" inspirée de l'univers Hello Kitty, utilisant des ombres douces et des bordures très arrondies.
- **Palette de Couleurs** :
  - `Cotton Candy Pink` (#FFD1DC) : Couleur principale pour les boutons et accents.
  - `Strawberry Milk` (#FFF0F5) : Couleur de fond des cartes et sections.
  - `Pure White` (#FFFFFF) : Couleur de fond principale de l'application.
  - `Soft Gold` (#FDE68A) : Pour les étoiles de réussite et le niveau.
  - `Hello Black` (#333333) : Pour le texte (ne jamais utiliser de noir pur pour garder la douceur).

### Directives UI Modernes
- **Bordures** : Utilisez des `border-radius` très élevés (ex: `24px` ou `32px`) pour un aspect "bulle".
- **Ombres (Glassmorphism Soft)** : Des ombres très légères et diffuses : `box-shadow: 0 10px 25px rgba(255, 209, 220, 0.3);`.
- **Thème Forcé** : Ne pas implémenter de mode sombre. Utilisez une méta-balise pour forcer le rendu clair : `<meta name="color-scheme" content="light">`.

---

## ✨ 2. Composants Interactifs & "Friendly"

1. **PixelCoach (L'IA Adorable)** :
   - Utilisez une icône ou une mascotte mignonne (style petit chat ou ruban rose).
   - **Animation** : Quand l'IA réfléchit, faites osciller doucement son icône (floating animation).
   - **Messages** : Bulles de chat avec des coins arrondis asymétriques.

2. **Système de Récompenses (Gamification)** :
   - **XP & Levels** : Remplacer la barre classique par une suite de petits cœurs ou d'étoiles qui se remplissent.
   - **Confettis** : Lors de la validation d'une session (`POST /progress`), déclenchez une pluie de confettis en forme de cœurs et de rubans.
   - **Streak** : Une icône de petite tasse de thé fumante ou une fleur qui éclot pour chaque jour consécutif.

3. **Boutons & Feedback** :
   - Effet "Bouncy" (rebond) au clic sur tous les boutons principaux.
   - Sons "clic" doux et mignons (optionnel).

---

## ⚙️ 3. Implémentation Technique (React & Types)

### Forcer le Thème Clair (CSS Global)
```css
:root {
  color-scheme: light !important;
  --primary-pink: #FFD1DC;
  --bg-soft: #FFF0F5;
  --text-main: #4A4A4A;
}

body {
  background-color: white;
  color: var(--text-main);
  font-family: 'Quicksand', sans-serif; /* Police très ronde et friendly */
}
```

### Hook de Notification "Kawaii"
Utilisez une bibliothèque comme `react-hot-toast` personnalisée :

```typescript
const notifySuccess = (msg: string) => toast.success(msg, {
  icon: '🌸',
  style: {
    borderRadius: '20px',
    background: '#FFF0F5',
    color: '#FF8DA1',
    border: '2px solid #FFD1DC'
  }
});
```

---

## 🔄 4. Flux de Données & IA

### Interaction avec Mistral AI
Bien que l'IA soit puissante (Mistral Large), le frontend doit "envelopper" ses réponses dans une présentation douce.
- **Parsing** : Si l'IA génère un planning, affichez-le sous forme de "Cartes de Goûter" ou de "Tickets Roses".
- **Prompt contextuel** : Le backend est déjà configuré pour que PixelCoach soit encourageant, ce qui s'aligne parfaitement avec votre style Girly.

---

## 📡 5. Documentation de l'API (Détails Techniques)

L'API est accessible à l'adresse suivante : `https://plan-etude.koyeb.app/api`. Toutes les requêtes (sauf l'authentification) nécessitent un header `Authorization: Bearer <votre_token>`.

### 🔐 Authentification (`/auth`)

| Endpoint | Méthode | Body | Description |
| :--- | :--- | :--- | :--- |
| `/register` | `POST` | `{ name, email, password, gender? }` | Crée un nouveau compte tout rose. |
| `/login` | `POST` | `{ email, password }` | Connecte-toi pour retrouver tes données. |
| `/refresh` | `POST` | `{}` | Rafraîchit ton token d'accès. |

### 💬 PixelCoach - Ton Assistant IA (`/chat`)

PixelCoach utilise **Mistral AI** pour te donner les meilleurs conseils !

| Endpoint | Méthode | Body | Description |
| :--- | :--- | :--- | :--- |
| `/` | `POST` | `{ message }` | Discute avec PixelCoach pour obtenir de l'aide. |
| `/metrics` | `GET` | - | Récupère les stats d'utilisation de ton assistant. |

### 📅 Gestion des Plannings (`/plannings`)

Organise tes sessions d'étude avec style.

| Endpoint | Méthode | Body | Description |
| :--- | :--- | :--- | :--- |
| `/` | `GET` | - | Liste tous tes magnifiques plannings. |
| `/` | `POST` | `{ periode, sessions: [...] }` | Crée un nouveau planning (Jour/Semaine/Mois). |
| `/:id` | `PUT` | `{ sessions: [...] }` | Modifie un planning existant. |
| `/:id` | `DELETE` | - | Supprime un planning (sois prudente !). |
| `/:id/export.ical` | `GET` | - | Télécharge ton planning pour ton calendrier. |
| `/:id/export.pdf` | `GET` | - | Télécharge une version PDF toute mignonne. |

### 🏆 Progrès & Gamification (`/progress`, `/stats`, `/badges`)

| Endpoint | Méthode | Body | Description |
| :--- | :--- | :--- | :--- |
| `/progress` | `POST` | `{ sessionsCompletees, tempsEtudie }` | Enregistre tes efforts et gagne de l'XP ! |
| `/progress/summary`| `GET` | - | Récapitulatif de tes progrès récents. |
| `/stats` | `GET` | - | Toutes tes statistiques pour le Dashboard. |
| `/badges` | `GET` | - | Admire tous les badges que tu as collectés. |

### 👤 Profil & Rappels (`/user`, `/reminders`)

| Endpoint | Méthode | Body | Description |
| :--- | :--- | :--- | :--- |
| `/user/profile` | `GET` | - | Récupère tes informations de profil. |
| `/user/profile` | `PUT` | `{ name, gender, ... }` | Mets à jour ton profil (nouvel avatar, etc.). |
| `/reminders` | `GET` | - | Liste tous tes petits rappels d'étude. |
| `/reminders` | `POST` | `{ title, date, ... }` | Crée un nouveau rappel pour ne rien oublier. |
| `/reminders/:id` | `DELETE` | - | Supprime un rappel terminé. |

---

## 🛠️ 6. Guide d'Intégration Frontend (Exemple React)

Voici comment appeler PixelCoach depuis ton interface :

```typescript
const sendMessageToCoach = async (text: string) => {
  const response = await fetch('https://plan-etude.koyeb.app/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ message: text })
  });
  
  const data = await response.json();
   return data.response; // La réponse douce de PixelCoach 🌸
 };
 ```

---
*Document créé avec amour pour le projet PlanÉtude Girly Edition. 🎀*

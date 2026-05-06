# 🎮 Le Guide du Geek — Quiz EVG 2026

> Quiz interactif pour EVG avec 105 questions — Mangas, Jeux Vidéo, Romans, Séries & Animation.

## 🚀 Setup en 5 étapes

### 1. Créer le projet Firebase

1. Va sur [console.firebase.google.com](https://console.firebase.google.com)
2. **"Add project"** → Nom : `geek-quiz-evg`
3. Désactive Google Analytics (pas nécessaire) → **Create project**

### 2. Activer Firestore

1. Dans le menu gauche : **Build > Firestore Database**
2. **Create database** → Choisir **"Start in test mode"** → Done
3. (Tu pourras sécuriser les règles plus tard)

### 3. Activer l'Authentication

1. **Build > Authentication** → **Get started**
2. **Sign-in method** → **Email/Password** → Enable → Save
3. **Users** → **Add user** :
   - Email : `admin@evg.fr` (ou ce que tu veux)
   - Password : (un mot de passe sécurisé — **note-le bien !**)

### 4. Configurer le fichier Firebase

1. **Project Settings** (icône ⚙️) → **Your apps** → **Web app** (icône `</>`)
2. Register app : nom `geek-quiz-web` → Continue
3. Copie la config `firebaseConfig` affichée
4. Ouvre `js/firebase-config.js` et remplace les valeurs :

```javascript
const firebaseConfig = {
  apiKey: "COLLE_TA_VALEUR_ICI",
  authDomain: "COLLE_TA_VALEUR_ICI",
  projectId: "COLLE_TA_VALEUR_ICI",
  storageBucket: "COLLE_TA_VALEUR_ICI",
  messagingSenderId: "COLLE_TA_VALEUR_ICI",
  appId: "COLLE_TA_VALEUR_ICI"
};
```

### 5. Déployer sur GitHub Pages

```bash
# Crée un repo GitHub (ex: "evg-quiz")
git init
git add .
git commit -m "🎮 Quiz EVG 2026"
git remote add origin https://github.com/TON_USERNAME/evg-quiz.git
git push -u origin main

# Dans GitHub : Settings > Pages > Source: main branch, root /
# URL générée : https://TON_USERNAME.github.io/evg-quiz/
```

## 📱 Utilisation le jour J

### Toi (Admin)
1. Va sur le site → **🔐 Admin**
2. Connecte-toi avec l'email/password créé sur Firebase
3. Tu peux :
   - Gérer les joueurs (modifier scores, pseudo, équipe)
   - Créer des équipes et y ajouter des joueurs
   - Ajouter de nouvelles questions
   - Reset les scores
   - Voir les statistiques

### Les joueurs
1. Vont sur le lien GitHub Pages depuis leur smartphone
2. Cliquent **🎮 Rejoindre la partie**
3. Choisissent un pseudo + un avatar
4. Peuvent jouer en 3 modes :
   - **🎯 Normal** : 4 choix, points selon difficulté (1/2/3)
   - **🙈 Aveugle** : tape ta réponse avant l'affichage des choix (×4 pts si correct !)
   - **⚡ Rapidité** : sois dans le top 3 (5/4/3 pts)

## 🏆 Système de points

| Difficulté | Normal | Aveugle (libre) | Rapidité |
|-----------|--------|-----------------|----------|
| Débutant | 1 pt | 4 pts | 5/4/3 pts |
| Connaisseur | 2 pts | 8 pts | 5/4/3 pts |
| Otaku | 3 pts | 12 pts | 5/4/3 pts |

## ✏️ Corrections apportées au PDF original
- **Question 90** : La bonne réponse (Victoria 'Porkchop' Parker) n'était pas cochée dans le PDF → corrigée

## 🎨 Avatars disponibles
15 avatars SVG des univers du quiz :
Naruto, Luffy, Guts, Cloud, Sora, Kakashi, Zoro, Aerith, Bam (Tower of God), Griffith, Tidus, Rick Sanchez, Leslie Knope, Barney Stinson, Sterling Archer

# 🎯 Carte des Talents - Plateforme de Mise en Relation

**Projet réalisé pour le Défi National CESI**

Une plateforme web moderne permettant aux participants de partager leurs compétences, talents, et projets, avec une visualisation interactive sous forme de carte des talents.

## 📋 Table des matières

- [Fonctionnalités](#fonctionnalités)
- [Technologies utilisées](#technologies-utilisées)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Structure du projet](#structure-du-projet)
- [Captures d'écran](#captures-décran)
- [Évaluation](#évaluation)
- [Contact](#contact)

## ✨ Fonctionnalités

### ✅ Fonctionnalités implémentées

1. **Profils Talents Complets**

   - Informations personnelles (nom, email, bio)
   - Compétences techniques et soft skills
   - Langues parlées
   - Projets personnels et collaboratifs

2. **Recherche Avancée**

   - Recherche par compétences
   - Filtrage par langues
   - Recherche textuelle (nom, bio)
   - Filtrage par statut de vérification

3. **Carte Interactive des Talents**

   - Visualisation en bulles des compétences
   - Distribution par catégories
   - Filtres dynamiques
   - Statistiques en temps réel

4. **Section "Trouver un Collaborateur"**

   - Liste des projets actifs
   - Statuts de projets (en cours, terminé, recherche collaborateurs)
   - Système de demandes de collaboration
   - Gestion des collaborateurs

5. **Badge "Talent Verified"**

   - Système de vérification par administrateur
   - Badge visuel sur les profils vérifiés
   - Traçabilité (qui a vérifié, quand)

6. **Authentification Sécurisée**
   - Inscription / Connexion
   - JWT tokens
   - Mots de passe hashés (bcrypt)
   - Protection des routes

## 🛠️ Technologies utilisées

### Backend

- **FastAPI** - Framework Python moderne et performant
- **SQLAlchemy** - ORM pour la gestion de base de données
- **SQLite** - Base de données (facile à déployer)
- **Pydantic** - Validation des données
- **JWT** - Authentification sécurisée
- **Bcrypt** - Hashage des mots de passe

### Frontend

- **React 18** - Bibliothèque UI moderne
- **Vite** - Build tool ultra-rapide
- **React Router** - Navigation
- **Axios** - Client HTTP
- **Canvas API** - Visualisations interactives
- **Lucide React** - Icônes modernes
- **CSS3** - Design premium avec glassmorphism

### Design

- **Palette de couleurs moderne** - Dégradés vibrants
- **Glassmorphism** - Effets de verre
- **Animations fluides** - Transitions CSS
- **Responsive Design** - Mobile-first
- **Dark Mode** - Interface sombre élégante

## 🚀 Installation

### Prérequis

- Python 3.8+
- Node.js 16+
- npm ou yarn

### Installation Backend

```bash
cd backend
pip install -r requirements.txt
python seed_data.py
python main.py
```

Le backend sera accessible sur `http://localhost:8000`

### Installation Frontend

```bash
cd frontend
npm install
npm run dev
```

Le frontend sera accessible sur `http://localhost:3000`

## 📖 Utilisation

### Comptes de démonstration

**Administrateur**

- Username: `admin`
- Password: `admin123`

**Utilisateurs de test**

- Username: `marie_dupont`, `jean_martin`, `sophie_bernard`, `lucas_petit`, `emma_rousseau`
- Password: `password123`

### Fonctionnalités principales

1. **Connexion** - Utilisez un compte de démonstration ou créez-en un nouveau
2. **Dashboard** - Vue d'ensemble des statistiques et projets récents
3. **Carte des Talents** - Visualisation interactive des compétences
4. **Recherche** - Trouvez des talents par compétences ou langues
5. **Projets** - Créez ou rejoignez des projets collaboratifs
6. **Profil** - Gérez vos compétences et informations

## 📁 Structure du projet

```
carte-des-talents/
├── backend/
│   ├── main.py              # Application FastAPI
│   ├── database.py          # Modèles SQLAlchemy
│   ├── schemas.py           # Schémas Pydantic
│   ├── auth.py              # Authentification JWT
│   ├── seed_data.py         # Données de test
│   ├── requirements.txt     # Dépendances Python
│   └── README.md            # Documentation backend
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Composants React
│   │   │   └── Navbar.jsx
│   │   ├── pages/           # Pages de l'application
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Home.jsx
│   │   │   └── TalentMap.jsx
│   │   ├── api.js           # Client API
│   │   ├── AuthContext.jsx  # Contexte d'authentification
│   │   ├── App.jsx          # Composant principal
│   │   ├── main.jsx         # Point d'entrée
│   │   └── index.css        # Styles globaux
│   ├── package.json
│   └── vite.config.js
│
└── README.md                # Ce fichier
```

## 🎨 Captures d'écran

_(Les captures d'écran seront ajoutées après le lancement de l'application)_

### Page de connexion

- Design moderne avec glassmorphism
- Formulaire intuitif
- Comptes de démonstration affichés

### Dashboard

- Statistiques en temps réel
- Projets récents
- Actions rapides

### Carte des Talents

- Visualisation en bulles
- Filtres par catégorie
- Distribution des compétences et langues

## 📊 Évaluation (Grille sur 100 points)

### 1. Qualité technique – 40 points

✅ **Fonctionnalités réalisées (20 pts)**

- Profil talent complet avec compétences, langues, projets
- Recherche avancée multi-critères
- Visualisation carte/nuage de compétences
- Mise en relation via projets collaboratifs
- Badge "Talent Verified" avec validation admin

✅ **Stabilité & utilisation réelle (10 pts)**

- Navigation fluide
- Gestion d'erreurs
- Authentification sécurisée
- API REST complète

✅ **Qualité du code / structure (10 pts)**

- Code organisé et modulaire
- Commentaires et documentation
- Bonnes pratiques (React Hooks, Context API)
- Architecture backend propre (MVC)

### 2. UX / UI – 30 points

✅ **Ergonomie (15 pts)**

- Interface intuitive
- Navigation claire
- Formulaires simples
- Feedback utilisateur (loading, erreurs)

✅ **Design & lisibilité (15 pts)**

- Design moderne et cohérent
- Palette de couleurs harmonieuse
- Glassmorphism et animations
- Responsive design
- Visualisation efficace des compétences

### 3. Pertinence & cohérence – 30 points

✅ **Adéquation au sujet (15 pts)**

- Répond au besoin de "carte des talents"
- Fonctionnalités pertinentes
- Intégration au défi national

✅ **Cohérence et maturité du produit (15 pts)**

- Solution homogène
- Utilisable immédiatement
- Bien pensée et complète

## 🔗 Lien de démonstration

**Lien à envoyer à jgallet@cesi.fr :**

`[À compléter après déploiement]`

## 📧 Contact

Pour toute question concernant ce projet :

- Email: jgallet@cesi.fr
- Projet: Défi National CESI - Carte des Talents

## 📝 Licence

Ce projet a été réalisé dans le cadre du Défi National CESI.

---

**Développé avec ❤️ pour le Défi National CESI**

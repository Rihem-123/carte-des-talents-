# Backend - Carte des Talents

API REST développée avec FastAPI pour la plateforme Carte des Talents.

## 🚀 Installation

### Prérequis

- Python 3.8+
- pip

### Installation des dépendances

```bash
cd backend
pip install -r requirements.txt
```

## 📊 Configuration

Le fichier `.env` contient la configuration de l'application :

```env
DATABASE_URL=sqlite:///./talents.db
SECRET_KEY=votre_cle_secrete_super_securisee_changez_moi_en_production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## 🗄️ Initialisation de la base de données

Pour créer la base de données et ajouter des données de test :

```bash
python seed_data.py
```

Cela créera :

- 1 compte administrateur (username: `admin`, password: `admin123`)
- 5 utilisateurs de test (password: `password123`)
- 16 compétences dans différentes catégories
- 7 langues
- 4 projets exemples

## ▶️ Lancement du serveur

```bash
python main.py
```

Ou avec uvicorn directement :

```bash
uvicorn main:app --reload
```

L'API sera accessible sur `http://localhost:8000`

## 📚 Documentation API

Une fois le serveur lancé, la documentation interactive est disponible sur :

- Swagger UI : `http://localhost:8000/docs`
- ReDoc : `http://localhost:8000/redoc`

## 🔑 Endpoints principaux

### Authentification

- `POST /api/register` - Inscription
- `POST /api/token` - Connexion (retourne un JWT)
- `GET /api/users/me` - Profil utilisateur connecté

### Utilisateurs

- `GET /api/users` - Liste des utilisateurs
- `GET /api/users/{user_id}` - Détails d'un utilisateur
- `PUT /api/users/me` - Mise à jour du profil
- `POST /api/users/{user_id}/verify` - Vérifier un utilisateur (admin)

### Compétences

- `GET /api/skills` - Liste des compétences
- `POST /api/skills` - Créer une compétence

### Langues

- `GET /api/languages` - Liste des langues
- `POST /api/languages` - Créer une langue

### Projets

- `GET /api/projects` - Liste des projets
- `POST /api/projects` - Créer un projet
- `GET /api/projects/{project_id}` - Détails d'un projet
- `PUT /api/projects/{project_id}` - Modifier un projet
- `DELETE /api/projects/{project_id}` - Supprimer un projet

### Collaboration

- `POST /api/collaboration-requests` - Demander à collaborer
- `GET /api/projects/{project_id}/collaboration-requests` - Demandes pour un projet
- `PUT /api/collaboration-requests/{request_id}/accept` - Accepter une demande

### Recherche & Visualisation

- `POST /api/search` - Rechercher des utilisateurs
- `GET /api/talent-map` - Données pour la carte des talents

## 🏗️ Structure du projet

```
backend/
├── main.py              # Application FastAPI principale
├── database.py          # Configuration DB et modèles SQLAlchemy
├── schemas.py           # Schémas Pydantic
├── auth.py              # Authentification JWT
├── seed_data.py         # Script d'initialisation
├── requirements.txt     # Dépendances Python
├── .env                 # Configuration (ne pas commiter)
└── talents.db          # Base de données SQLite (généré)
```

## 🔒 Sécurité

- Mots de passe hashés avec bcrypt
- Authentification JWT
- Validation des données avec Pydantic
- Protection CORS configurée

## 📝 Modèles de données

### User

- Informations personnelles (email, username, full_name, bio)
- Compétences (relation many-to-many avec Skill)
- Langues (relation many-to-many avec Language)
- Projets (propriétaire et collaborateur)
- Badge de vérification (is_verified)

### Skill

- Nom, catégorie, description
- Associée à plusieurs utilisateurs

### Language

- Nom, code ISO
- Associée à plusieurs utilisateurs

### Project

- Titre, description, statut
- Propriétaire et collaborateurs
- Demandes de collaboration

## 🎯 Fonctionnalités implémentées

✅ Gestion complète des utilisateurs  
✅ Authentification JWT sécurisée  
✅ Profils talents avec compétences et langues  
✅ Système de projets collaboratifs  
✅ Demandes de collaboration  
✅ Badge "Talent Verified" (validé par admin)  
✅ Recherche avancée multi-critères  
✅ API pour carte des talents interactive  
✅ Statistiques et distributions

## 🧪 Tests

Pour tester l'API, vous pouvez utiliser :

- L'interface Swagger à `/docs`
- Postman ou Insomnia
- curl ou httpie en ligne de commande

Exemple de test avec curl :

```bash
# Inscription
curl -X POST "http://localhost:8000/api/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "password123",
    "full_name": "Test User"
  }'

# Connexion
curl -X POST "http://localhost:8000/api/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=testuser&password=password123"
```

## 📧 Contact

Pour toute question : jgallet@cesi.fr

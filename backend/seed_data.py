from database import SessionLocal, init_db, User, Skill, Language, Project
from auth import get_password_hash

def seed_database():
    """Initialise la base de données avec des données de test"""
    init_db()
    db = SessionLocal()
    
    try:
        # Vérifier si des données existent déjà
        if db.query(User).first():
            print("La base de données contient déjà des données.")
            return
        
        print("Initialisation de la base de données...")
        
        # Créer un administrateur
        admin = User(
            email="admin@cesi.fr",
            username="admin",
            full_name="Administrateur CESI",
            bio="Responsable de la plateforme Carte des Talents",
            hashed_password=get_password_hash("admin123"),
            is_admin=True,
            is_verified=True
        )
        db.add(admin)
        
        # Créer des utilisateurs de test
        users_data = [
            {
                "email": "marie.dupont@cesi.fr",
                "username": "marie_dupont",
                "full_name": "Marie Dupont",
                "bio": "Développeuse Full Stack passionnée par l'IA et le web",
                "password": "password123"
            },
            {
                "email": "jean.martin@cesi.fr",
                "username": "jean_martin",
                "full_name": "Jean Martin",
                "bio": "Designer UX/UI et expert en accessibilité",
                "password": "password123"
            },
            {
                "email": "sophie.bernard@cesi.fr",
                "username": "sophie_bernard",
                "full_name": "Sophie Bernard",
                "bio": "Chef de projet agile et coach Scrum",
                "password": "password123"
            },
            {
                "email": "lucas.petit@cesi.fr",
                "username": "lucas_petit",
                "full_name": "Lucas Petit",
                "bio": "Data Scientist spécialisé en Machine Learning",
                "password": "password123"
            },
            {
                "email": "emma.rousseau@cesi.fr",
                "username": "emma_rousseau",
                "full_name": "Emma Rousseau",
                "bio": "Développeuse mobile iOS et Android",
                "password": "password123"
            }
        ]
        
        users = []
        for user_data in users_data:
            user = User(
                email=user_data["email"],
                username=user_data["username"],
                full_name=user_data["full_name"],
                bio=user_data["bio"],
                hashed_password=get_password_hash(user_data["password"])
            )
            users.append(user)
            db.add(user)
        
        db.commit()
        
        # Créer des compétences
        skills_data = [
            {"name": "Python", "category": "Technique", "description": "Langage de programmation"},
            {"name": "JavaScript", "category": "Technique", "description": "Langage de programmation web"},
            {"name": "React", "category": "Technique", "description": "Framework JavaScript"},
            {"name": "FastAPI", "category": "Technique", "description": "Framework Python pour API"},
            {"name": "SQL", "category": "Technique", "description": "Langage de requête de base de données"},
            {"name": "Machine Learning", "category": "Technique", "description": "Intelligence artificielle"},
            {"name": "UX Design", "category": "Design", "description": "Conception d'expérience utilisateur"},
            {"name": "UI Design", "category": "Design", "description": "Conception d'interface utilisateur"},
            {"name": "Figma", "category": "Design", "description": "Outil de design"},
            {"name": "Gestion de projet", "category": "Management", "description": "Compétence en gestion"},
            {"name": "Scrum", "category": "Management", "description": "Méthodologie agile"},
            {"name": "Communication", "category": "Soft Skills", "description": "Compétence relationnelle"},
            {"name": "Leadership", "category": "Soft Skills", "description": "Capacité à diriger"},
            {"name": "Créativité", "category": "Soft Skills", "description": "Pensée créative"},
            {"name": "Docker", "category": "Technique", "description": "Conteneurisation"},
            {"name": "Git", "category": "Technique", "description": "Contrôle de version"},
        ]
        
        skills = []
        for skill_data in skills_data:
            skill = Skill(**skill_data)
            skills.append(skill)
            db.add(skill)
        
        db.commit()
        
        # Créer des langues
        languages_data = [
            {"name": "Français", "code": "fr"},
            {"name": "Anglais", "code": "en"},
            {"name": "Espagnol", "code": "es"},
            {"name": "Allemand", "code": "de"},
            {"name": "Italien", "code": "it"},
            {"name": "Arabe", "code": "ar"},
            {"name": "Chinois", "code": "zh"},
        ]
        
        languages = []
        for lang_data in languages_data:
            language = Language(**lang_data)
            languages.append(language)
            db.add(language)
        
        db.commit()
        
        # Assigner des compétences et langues aux utilisateurs
        # Marie - Développeuse Full Stack
        users[0].skills = [skills[0], skills[1], skills[2], skills[3], skills[4], skills[15]]
        users[0].languages = [languages[0], languages[1]]
        users[0].is_verified = True
        users[0].verified_by_id = admin.id
        
        # Jean - Designer
        users[1].skills = [skills[6], skills[7], skills[8], skills[13]]
        users[1].languages = [languages[0], languages[1], languages[2]]
        users[1].is_verified = True
        users[1].verified_by_id = admin.id
        
        # Sophie - Chef de projet
        users[2].skills = [skills[9], skills[10], skills[11], skills[12]]
        users[2].languages = [languages[0], languages[1], languages[3]]
        
        # Lucas - Data Scientist
        users[3].skills = [skills[0], skills[4], skills[5], skills[15]]
        users[3].languages = [languages[0], languages[1]]
        users[3].is_verified = True
        users[3].verified_by_id = admin.id
        
        # Emma - Développeuse mobile
        users[4].skills = [skills[1], skills[2], skills[15], skills[14]]
        users[4].languages = [languages[0], languages[1], languages[4]]
        
        db.commit()
        
        # Créer des projets
        projects_data = [
            {
                "title": "Application mobile de gestion de tâches",
                "description": "Développement d'une application mobile cross-platform pour la gestion de tâches collaboratives",
                "status": "recherche_collaborateurs",
                "owner": users[4]
            },
            {
                "title": "Plateforme d'apprentissage en ligne",
                "description": "Création d'une plateforme e-learning avec suivi personnalisé",
                "status": "en_cours",
                "owner": users[0]
            },
            {
                "title": "Système de recommandation IA",
                "description": "Développement d'un système de recommandation basé sur le Machine Learning",
                "status": "recherche_collaborateurs",
                "owner": users[3]
            },
            {
                "title": "Refonte UX d'une application bancaire",
                "description": "Amélioration de l'expérience utilisateur d'une application mobile bancaire",
                "status": "termine",
                "owner": users[1]
            }
        ]
        
        for project_data in projects_data:
            owner = project_data.pop("owner")
            project = Project(**project_data, owner_id=owner.id)
            db.add(project)
        
        db.commit()
        
        print("✅ Base de données initialisée avec succès!")
        print(f"   - {len(users) + 1} utilisateurs créés (dont 1 admin)")
        print(f"   - {len(skills)} compétences créées")
        print(f"   - {len(languages)} langues créées")
        print(f"   - {len(projects_data)} projets créés")
        print("\nCompte administrateur:")
        print("   Username: admin")
        print("   Password: admin123")
        print("\nComptes utilisateurs de test:")
        print("   Username: marie_dupont, jean_martin, sophie_bernard, lucas_petit, emma_rousseau")
        print("   Password: password123")
        
    except Exception as e:
        print(f"❌ Erreur lors de l'initialisation: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()

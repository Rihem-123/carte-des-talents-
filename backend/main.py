from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from typing import List
from datetime import timedelta

from database import get_db, init_db, User, Skill, Language, Project, CollaborationRequest
from schemas import (
    UserCreate, User as UserSchema, UserUpdate, UserWithProjects,
    SkillCreate, Skill as SkillSchema,
    LanguageCreate, Language as LanguageSchema,
    ProjectCreate, Project as ProjectSchema, ProjectUpdate,
    CollaborationRequestCreate, CollaborationRequest as CollaborationRequestSchema,
    Token, UserLogin, SearchFilters, TalentMapData
)
from auth import (
    get_password_hash, authenticate_user, create_access_token,
    get_current_user, get_current_admin_user, ACCESS_TOKEN_EXPIRE_MINUTES
)

app = FastAPI(title="Carte des Talents API", version="1.0.0")

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En production, spécifier les origines exactes
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    init_db()


# ==================== AUTHENTIFICATION ====================

@app.post("/api/register", response_model=UserSchema, status_code=status.HTTP_201_CREATED)
def register(user: UserCreate, db: Session = Depends(get_db)):
    # Vérifier si l'utilisateur existe déjà
    db_user = db.query(User).filter(
        or_(User.email == user.email, User.username == user.username)
    ).first()
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="Email ou nom d'utilisateur déjà enregistré"
        )
    
    # Créer le nouvel utilisateur
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        username=user.username,
        full_name=user.full_name,
        bio=user.bio,
        avatar_url=user.avatar_url,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@app.post("/api/token", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Nom d'utilisateur ou mot de passe incorrect",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/api/users/me", response_model=UserWithProjects)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user


# ==================== UTILISATEURS ====================

@app.get("/api/users", response_model=List[UserSchema])
def get_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    users = db.query(User).offset(skip).limit(limit).all()
    return users


@app.get("/api/users/{user_id}", response_model=UserWithProjects)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    return user


@app.put("/api/users/me", response_model=UserSchema)
def update_user(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if user_update.full_name is not None:
        current_user.full_name = user_update.full_name
    if user_update.bio is not None:
        current_user.bio = user_update.bio
    if user_update.avatar_url is not None:
        current_user.avatar_url = user_update.avatar_url
    
    # Mise à jour des compétences
    if user_update.skills is not None:
        skills = db.query(Skill).filter(Skill.id.in_(user_update.skills)).all()
        current_user.skills = skills
    
    # Mise à jour des langues
    if user_update.languages is not None:
        languages = db.query(Language).filter(Language.id.in_(user_update.languages)).all()
        current_user.languages = languages
    
    db.commit()
    db.refresh(current_user)
    return current_user


@app.post("/api/users/{user_id}/verify", response_model=UserSchema)
def verify_user(
    user_id: int,
    admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    
    user.is_verified = True
    user.verified_by_id = admin.id
    db.commit()
    db.refresh(user)
    return user


# ==================== COMPÉTENCES ====================

@app.get("/api/skills", response_model=List[SkillSchema])
def get_skills(db: Session = Depends(get_db)):
    skills = db.query(Skill).all()
    return skills


@app.post("/api/skills", response_model=SkillSchema, status_code=status.HTTP_201_CREATED)
def create_skill(skill: SkillCreate, db: Session = Depends(get_db)):
    db_skill = db.query(Skill).filter(Skill.name == skill.name).first()
    if db_skill:
        raise HTTPException(status_code=400, detail="Cette compétence existe déjà")
    
    db_skill = Skill(**skill.dict())
    db.add(db_skill)
    db.commit()
    db.refresh(db_skill)
    return db_skill


# ==================== LANGUES ====================

@app.get("/api/languages", response_model=List[LanguageSchema])
def get_languages(db: Session = Depends(get_db)):
    languages = db.query(Language).all()
    return languages


@app.post("/api/languages", response_model=LanguageSchema, status_code=status.HTTP_201_CREATED)
def create_language(language: LanguageCreate, db: Session = Depends(get_db)):
    db_language = db.query(Language).filter(Language.name == language.name).first()
    if db_language:
        raise HTTPException(status_code=400, detail="Cette langue existe déjà")
    
    db_language = Language(**language.dict())
    db.add(db_language)
    db.commit()
    db.refresh(db_language)
    return db_language


# ==================== PROJETS ====================

@app.get("/api/projects", response_model=List[ProjectSchema])
def get_projects(
    skip: int = 0,
    limit: int = 100,
    status_filter: str = None,
    db: Session = Depends(get_db)
):
    query = db.query(Project)
    if status_filter:
        query = query.filter(Project.status == status_filter)
    projects = query.offset(skip).limit(limit).all()
    return projects


@app.get("/api/projects/{project_id}", response_model=ProjectSchema)
def get_project(project_id: int, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Projet non trouvé")
    return project


@app.post("/api/projects", response_model=ProjectSchema, status_code=status.HTTP_201_CREATED)
def create_project(
    project: ProjectCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_project = Project(**project.dict(), owner_id=current_user.id)
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project


@app.put("/api/projects/{project_id}", response_model=ProjectSchema)
def update_project(
    project_id: int,
    project_update: ProjectUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Projet non trouvé")
    
    if project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Non autorisé")
    
    for key, value in project_update.dict(exclude_unset=True).items():
        setattr(project, key, value)
    
    db.commit()
    db.refresh(project)
    return project


@app.delete("/api/projects/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    project_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Projet non trouvé")
    
    if project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Non autorisé")
    
    db.delete(project)
    db.commit()
    return None


# ==================== DEMANDES DE COLLABORATION ====================

@app.post("/api/collaboration-requests", response_model=CollaborationRequestSchema, status_code=status.HTTP_201_CREATED)
def create_collaboration_request(
    request: CollaborationRequestCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Vérifier que le projet existe
    project = db.query(Project).filter(Project.id == request.project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Projet non trouvé")
    
    # Créer la demande
    db_request = CollaborationRequest(
        **request.dict(),
        requester_id=current_user.id
    )
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    return db_request


@app.get("/api/projects/{project_id}/collaboration-requests", response_model=List[CollaborationRequestSchema])
def get_project_collaboration_requests(
    project_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Projet non trouvé")
    
    if project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Non autorisé")
    
    requests = db.query(CollaborationRequest).filter(
        CollaborationRequest.project_id == project_id
    ).all()
    return requests


@app.put("/api/collaboration-requests/{request_id}/accept")
def accept_collaboration_request(
    request_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    collab_request = db.query(CollaborationRequest).filter(
        CollaborationRequest.id == request_id
    ).first()
    if not collab_request:
        raise HTTPException(status_code=404, detail="Demande non trouvée")
    
    project = db.query(Project).filter(Project.id == collab_request.project_id).first()
    if project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Non autorisé")
    
    # Ajouter le collaborateur au projet
    requester = db.query(User).filter(User.id == collab_request.requester_id).first()
    project.collaborators.append(requester)
    
    # Mettre à jour le statut de la demande
    collab_request.status = "accepted"
    
    db.commit()
    return {"message": "Demande acceptée"}


# ==================== RECHERCHE ====================

@app.post("/api/search", response_model=List[UserSchema])
def search_users(
    filters: SearchFilters,
    db: Session = Depends(get_db)
):
    query = db.query(User)
    
    if filters.is_verified is not None:
        query = query.filter(User.is_verified == filters.is_verified)
    
    if filters.search_term:
        search = f"%{filters.search_term}%"
        query = query.filter(
            or_(
                User.username.ilike(search),
                User.full_name.ilike(search),
                User.bio.ilike(search)
            )
        )
    
    if filters.skills:
        query = query.join(User.skills).filter(Skill.name.in_(filters.skills))
    
    if filters.languages:
        query = query.join(User.languages).filter(Language.name.in_(filters.languages))
    
    users = query.distinct().all()
    return users


# ==================== CARTE DES TALENTS ====================

@app.get("/api/talent-map", response_model=TalentMapData)
def get_talent_map_data(db: Session = Depends(get_db)):
    total_users = db.query(func.count(User.id)).scalar()
    total_skills = db.query(func.count(Skill.id)).scalar()
    total_languages = db.query(func.count(Language.id)).scalar()
    total_projects = db.query(func.count(Project.id)).scalar()
    verified_users_count = db.query(func.count(User.id)).filter(User.is_verified == True).scalar()
    
    # Distribution des compétences
    skills_dist = db.query(
        Skill.name,
        Skill.category,
        func.count(User.id).label('count')
    ).join(Skill.users).group_by(Skill.id).all()
    
    skills_distribution = [
        {"name": skill.name, "category": skill.category, "count": skill.count}
        for skill in skills_dist
    ]
    
    # Distribution des langues
    languages_dist = db.query(
        Language.name,
        func.count(User.id).label('count')
    ).join(Language.users).group_by(Language.id).all()
    
    languages_distribution = [
        {"name": lang.name, "count": lang.count}
        for lang in languages_dist
    ]
    
    return {
        "total_users": total_users,
        "total_skills": total_skills,
        "total_languages": total_languages,
        "total_projects": total_projects,
        "verified_users_count": verified_users_count,
        "skills_distribution": skills_distribution,
        "languages_distribution": languages_distribution
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

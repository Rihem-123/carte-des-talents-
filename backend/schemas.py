from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime


# Schémas pour les Skills
class SkillBase(BaseModel):
    name: str
    category: str
    description: Optional[str] = None


class SkillCreate(SkillBase):
    pass


class Skill(SkillBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# Schémas pour les Languages
class LanguageBase(BaseModel):
    name: str
    code: str


class LanguageCreate(LanguageBase):
    pass


class Language(LanguageBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# Schémas pour les Users
class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    skills: Optional[List[int]] = None
    languages: Optional[List[int]] = None


class User(UserBase):
    id: int
    is_verified: bool
    is_admin: bool
    created_at: datetime
    updated_at: datetime
    skills: List[Skill] = []
    languages: List[Language] = []

    class Config:
        from_attributes = True


class UserWithProjects(User):
    projects: List["Project"] = []
    collaborations: List["Project"] = []


# Schémas pour les Projects
class ProjectBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: str = "en_cours"


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None


class Project(ProjectBase):
    id: int
    owner_id: int
    created_at: datetime
    updated_at: datetime
    owner: User
    collaborators: List[User] = []

    class Config:
        from_attributes = True


# Schémas pour les Collaboration Requests
class CollaborationRequestBase(BaseModel):
    project_id: int
    message: Optional[str] = None


class CollaborationRequestCreate(CollaborationRequestBase):
    pass


class CollaborationRequest(CollaborationRequestBase):
    id: int
    requester_id: int
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Schémas pour l'authentification
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None


class UserLogin(BaseModel):
    username: str
    password: str


# Schémas pour la recherche
class SearchFilters(BaseModel):
    skills: Optional[List[str]] = None
    languages: Optional[List[str]] = None
    is_verified: Optional[bool] = None
    search_term: Optional[str] = None


# Schéma pour les statistiques de la carte des talents
class TalentMapData(BaseModel):
    total_users: int
    total_skills: int
    total_languages: int
    total_projects: int
    skills_distribution: List[dict]
    languages_distribution: List[dict]
    verified_users_count: int

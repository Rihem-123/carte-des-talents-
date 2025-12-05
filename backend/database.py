from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime, Text, Table, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./talents.db")

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Table d'association pour les compétences
user_skills = Table(
    'user_skills',
    Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id')),
    Column('skill_id', Integer, ForeignKey('skills.id'))
)

# Table d'association pour les langues
user_languages = Table(
    'user_languages',
    Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id')),
    Column('language_id', Integer, ForeignKey('languages.id'))
)

# Table d'association pour les projets collaboratifs
project_collaborators = Table(
    'project_collaborators',
    Base.metadata,
    Column('project_id', Integer, ForeignKey('projects.id')),
    Column('user_id', Integer, ForeignKey('users.id'))
)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    bio = Column(Text)
    avatar_url = Column(String)
    is_verified = Column(Boolean, default=False)
    verified_by_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relations
    skills = relationship("Skill", secondary=user_skills, back_populates="users")
    languages = relationship("Language", secondary=user_languages, back_populates="users")
    projects = relationship("Project", back_populates="owner")
    collaborations = relationship("Project", secondary=project_collaborators, back_populates="collaborators")
    verified_by = relationship("User", remote_side=[id], foreign_keys=[verified_by_id])


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    category = Column(String, index=True)  # Technique, Linguistique, Artistique, etc.
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relations
    users = relationship("User", secondary=user_skills, back_populates="skills")


class Language(Base):
    __tablename__ = "languages"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    code = Column(String(5))  # fr, en, es, etc.
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relations
    users = relationship("User", secondary=user_languages, back_populates="languages")


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    status = Column(String, default="en_cours")  # en_cours, termine, recherche_collaborateurs
    owner_id = Column(Integer, ForeignKey('users.id'))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relations
    owner = relationship("User", back_populates="projects", foreign_keys=[owner_id])
    collaborators = relationship("User", secondary=project_collaborators, back_populates="collaborations")


class CollaborationRequest(Base):
    __tablename__ = "collaboration_requests"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey('projects.id'))
    requester_id = Column(Integer, ForeignKey('users.id'))
    message = Column(Text)
    status = Column(String, default="pending")  # pending, accepted, rejected
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    Base.metadata.create_all(bind=engine)

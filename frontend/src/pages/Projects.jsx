import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { projectsAPI, collaborationAPI } from '../api';
import { FolderOpen, Plus, Users, Clock, CheckCircle, Search, AlertCircle } from 'lucide-react';
import './Projects.css';

const Projects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    status: 'en_cours'
  });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await projectsAPI.getAll();
      setProjects(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des projets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await projectsAPI.create(newProject);
      setMessage({ type: 'success', text: 'Projet créé avec succès !' });
      setShowCreateModal(false);
      setNewProject({ title: '', description: '', status: 'en_cours' });
      loadProjects();
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la création du projet' });
    }
  };

  const handleRequestCollaboration = async (projectId) => {
    try {
      await collaborationAPI.create({
        project_id: projectId,
        message: 'Je souhaite collaborer sur ce projet'
      });
      setMessage({ type: 'success', text: 'Demande de collaboration envoyée !' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de l\'envoi de la demande' });
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = searchTerm === '' || 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusInfo = (status) => {
    const statusMap = {
      'en_cours': { label: 'En cours', color: 'blue', icon: Clock },
      'termine': { label: 'Terminé', color: 'green', icon: CheckCircle },
      'recherche_collaborateurs': { label: 'Recherche collaborateurs', color: 'purple', icon: Users }
    };
    return statusMap[status] || statusMap['en_cours'];
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement des projets...</p>
      </div>
    );
  }

  return (
    <div className="projects-container">
      <div className="container">
        {/* Header */}
        <section className="projects-header fade-in">
          <div>
            <h1>
              <FolderOpen size={40} />
              Projets Collaboratifs
            </h1>
            <p className="projects-subtitle">
              Découvrez et rejoignez des projets passionnants
            </p>
          </div>
          <button onClick={() => setShowCreateModal(true)} className="btn btn-primary">
            <Plus size={20} />
            Créer un projet
          </button>
        </section>

        {/* Message */}
        {message && (
          <div className={`alert alert-${message.type} slide-in`}>
            {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <span>{message.text}</span>
          </div>
        )}

        {/* Filters */}
        <section className="projects-filters">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Rechercher un projet..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-buttons">
            <button
              className={`filter-chip ${filterStatus === 'all' ? 'active' : ''}`}
              onClick={() => setFilterStatus('all')}
            >
              Tous ({projects.length})
            </button>
            <button
              className={`filter-chip ${filterStatus === 'en_cours' ? 'active' : ''}`}
              onClick={() => setFilterStatus('en_cours')}
            >
              <Clock size={16} />
              En cours
            </button>
            <button
              className={`filter-chip ${filterStatus === 'recherche_collaborateurs' ? 'active' : ''}`}
              onClick={() => setFilterStatus('recherche_collaborateurs')}
            >
              <Users size={16} />
              Recherche collaborateurs
            </button>
            <button
              className={`filter-chip ${filterStatus === 'termine' ? 'active' : ''}`}
              onClick={() => setFilterStatus('termine')}
            >
              <CheckCircle size={16} />
              Terminés
            </button>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="projects-grid">
          {filteredProjects.map((project, index) => {
            const statusInfo = getStatusInfo(project.status);
            const StatusIcon = statusInfo.icon;
            const isOwner = user && project.owner_id === user.id;

            return (
              <div key={project.id} className="project-card card slide-in" style={{ animationDelay: `${index * 0.05}s` }}>
                <div className="project-card-header">
                  <h3>{project.title}</h3>
                  <span className={`project-status status-${statusInfo.color}`}>
                    <StatusIcon size={14} />
                    {statusInfo.label}
                  </span>
                </div>

                <p className="project-description">{project.description}</p>

                <div className="project-meta">
                  <div className="project-owner">
                    <Users size={16} />
                    <span>Par {project.owner?.full_name || project.owner?.username}</span>
                  </div>
                  {project.collaborators && project.collaborators.length > 0 && (
                    <div className="project-collaborators">
                      {project.collaborators.length} collaborateur{project.collaborators.length > 1 ? 's' : ''}
                    </div>
                  )}
                </div>

                <div className="project-card-footer">
                  {isOwner ? (
                    <Link to={`/projets/${project.id}`} className="btn btn-outline btn-sm w-full">
                      Gérer le projet
                    </Link>
                  ) : project.status === 'recherche_collaborateurs' ? (
                    <button
                      onClick={() => handleRequestCollaboration(project.id)}
                      className="btn btn-primary btn-sm w-full"
                    >
                      <Users size={16} />
                      Demander à collaborer
                    </button>
                  ) : (
                    <Link to={`/projets/${project.id}`} className="btn btn-ghost btn-sm w-full">
                      Voir détails
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </section>

        {filteredProjects.length === 0 && (
          <div className="no-results">
            <FolderOpen size={48} />
            <h3>Aucun projet trouvé</h3>
            <p>Essayez de modifier vos critères de recherche ou créez un nouveau projet</p>
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content card-glass" onClick={(e) => e.stopPropagation()}>
            <h2>Créer un nouveau projet</h2>
            <form onSubmit={handleCreateProject} className="project-form">
              <div className="form-group">
                <label htmlFor="title">Titre du projet *</label>
                <input
                  type="text"
                  id="title"
                  className="input"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  placeholder="Ex: Application mobile innovante"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  className="input"
                  rows="4"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  placeholder="Décrivez votre projet..."
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="status">Statut</label>
                <select
                  id="status"
                  className="input"
                  value={newProject.status}
                  onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
                >
                  <option value="en_cours">En cours</option>
                  <option value="recherche_collaborateurs">Recherche collaborateurs</option>
                  <option value="termine">Terminé</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn btn-ghost">
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  <Plus size={18} />
                  Créer le projet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;

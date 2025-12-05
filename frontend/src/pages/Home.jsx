import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { talentMapAPI, projectsAPI } from '../api';
import { Users, Award, Globe, FolderOpen, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react';
import './Home.css';

const Home = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsResponse, projectsResponse] = await Promise.all([
        talentMapAPI.getData(),
        projectsAPI.getAll({ limit: 3 })
      ]);
      setStats(statsResponse.data);
      setRecentProjects(projectsResponse.data);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="container">
        {/* Hero Section */}
        <section className="hero-section fade-in">
          <div className="hero-content">
            <h1 className="hero-title">
              Bienvenue, {user?.full_name || user?.username} ! 👋
            </h1>
            <p className="hero-subtitle">
              Découvrez les talents, partagez vos compétences et collaborez sur des projets passionnants
            </p>
            {user?.is_verified && (
              <div className="verified-badge">
                <CheckCircle size={20} />
                <span>Talent Vérifié</span>
              </div>
            )}
          </div>
        </section>

        {/* Stats Grid */}
        {stats && (
          <section className="stats-section">
            <div className="stats-grid">
              <div className="stat-card card slide-in">
                <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
                  <Users size={28} />
                </div>
                <div className="stat-content">
                  <h3 className="stat-value">{stats.total_users}</h3>
                  <p className="stat-label">Talents inscrits</p>
                </div>
              </div>

              <div className="stat-card card slide-in" style={{ animationDelay: '0.1s' }}>
                <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
                  <Award size={28} />
                </div>
                <div className="stat-content">
                  <h3 className="stat-value">{stats.total_skills}</h3>
                  <p className="stat-label">Compétences</p>
                </div>
              </div>

              <div className="stat-card card slide-in" style={{ animationDelay: '0.2s' }}>
                <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #d946ef, #c026d3)' }}>
                  <Globe size={28} />
                </div>
                <div className="stat-content">
                  <h3 className="stat-value">{stats.total_languages}</h3>
                  <p className="stat-label">Langues</p>
                </div>
              </div>

              <div className="stat-card card slide-in" style={{ animationDelay: '0.3s' }}>
                <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                  <FolderOpen size={28} />
                </div>
                <div className="stat-content">
                  <h3 className="stat-value">{stats.total_projects}</h3>
                  <p className="stat-label">Projets actifs</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Quick Actions */}
        <section className="actions-section">
          <h2 className="section-title">
            <TrendingUp size={28} />
            Actions rapides
          </h2>
          <div className="actions-grid">
            <Link to="/talents" className="action-card card card-glass">
              <Users size={32} className="action-icon" />
              <h3>Explorer les talents</h3>
              <p>Découvrez les compétences de la communauté</p>
              <ArrowRight className="action-arrow" size={20} />
            </Link>

            <Link to="/carte" className="action-card card card-glass">
              <TrendingUp size={32} className="action-icon" />
              <h3>Carte des talents</h3>
              <p>Visualisez la distribution des compétences</p>
              <ArrowRight className="action-arrow" size={20} />
            </Link>

            <Link to="/projets" className="action-card card card-glass">
              <FolderOpen size={32} className="action-icon" />
              <h3>Projets collaboratifs</h3>
              <p>Rejoignez ou créez un projet</p>
              <ArrowRight className="action-arrow" size={20} />
            </Link>
          </div>
        </section>

        {/* Recent Projects */}
        {recentProjects.length > 0 && (
          <section className="projects-section">
            <div className="section-header">
              <h2 className="section-title">
                <FolderOpen size={28} />
                Projets récents
              </h2>
              <Link to="/projets" className="btn btn-ghost">
                Voir tous
                <ArrowRight size={18} />
              </Link>
            </div>
            <div className="projects-grid">
              {recentProjects.map((project) => (
                <div key={project.id} className="project-card card">
                  <div className="project-header">
                    <h3>{project.title}</h3>
                    <span className={`project-status status-${project.status}`}>
                      {project.status === 'en_cours' && 'En cours'}
                      {project.status === 'termine' && 'Terminé'}
                      {project.status === 'recherche_collaborateurs' && 'Recherche collaborateurs'}
                    </span>
                  </div>
                  <p className="project-description">{project.description}</p>
                  <div className="project-footer">
                    <div className="project-owner">
                      Par {project.owner.full_name || project.owner.username}
                    </div>
                    <Link to={`/projets/${project.id}`} className="btn btn-sm btn-outline">
                      Voir détails
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Home;

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usersAPI } from '../api';
import { Users, Search, Filter, CheckCircle, Mail, MapPin } from 'lucide-react';
import './Talents.css';

const Talents = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVerified, setFilterVerified] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await usersAPI.getAll();
      setUsers(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === '' || 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.bio?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesVerified = filterVerified === null || user.is_verified === filterVerified;
    
    return matchesSearch && matchesVerified;
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement des talents...</p>
      </div>
    );
  }

  return (
    <div className="talents-container">
      <div className="container">
        {/* Header */}
        <section className="talents-header fade-in">
          <h1>
            <Users size={40} />
            Annuaire des Talents
          </h1>
          <p className="talents-subtitle">
            Découvrez les compétences et expertises de notre communauté
          </p>
        </section>

        {/* Filters */}
        <section className="talents-filters">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Rechercher par nom, username ou bio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-buttons">
            <button
              className={`filter-chip ${filterVerified === null ? 'active' : ''}`}
              onClick={() => setFilterVerified(null)}
            >
              <Filter size={16} />
              Tous ({users.length})
            </button>
            <button
              className={`filter-chip ${filterVerified === true ? 'active' : ''}`}
              onClick={() => setFilterVerified(true)}
            >
              <CheckCircle size={16} />
              Vérifiés ({users.filter(u => u.is_verified).length})
            </button>
            <button
              className={`filter-chip ${filterVerified === false ? 'active' : ''}`}
              onClick={() => setFilterVerified(false)}
            >
              Non vérifiés ({users.filter(u => !u.is_verified).length})
            </button>
          </div>
        </section>

        {/* Results count */}
        <div className="results-count">
          {filteredUsers.length} talent{filteredUsers.length > 1 ? 's' : ''} trouvé{filteredUsers.length > 1 ? 's' : ''}
        </div>

        {/* Users Grid */}
        <section className="talents-grid">
          {filteredUsers.map((user, index) => (
            <div key={user.id} className="talent-card card slide-in" style={{ animationDelay: `${index * 0.05}s` }}>
              <div className="talent-card-header">
                <div className="talent-avatar">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt={user.username} />
                  ) : (
                    <div className="avatar-placeholder">
                      {user.full_name?.charAt(0) || user.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                {user.is_verified && (
                  <div className="verified-badge-small">
                    <CheckCircle size={16} />
                  </div>
                )}
              </div>

              <div className="talent-card-body">
                <h3 className="talent-name">{user.full_name || user.username}</h3>
                <p className="talent-username">@{user.username}</p>
                
                {user.bio && (
                  <p className="talent-bio">{user.bio}</p>
                )}

                {user.skills && user.skills.length > 0 && (
                  <div className="talent-skills">
                    <div className="skills-label">Compétences :</div>
                    <div className="skills-tags">
                      {user.skills.slice(0, 3).map((skill, idx) => (
                        <span key={idx} className="skill-tag">
                          {skill.name}
                        </span>
                      ))}
                      {user.skills.length > 3 && (
                        <span className="skill-tag more">
                          +{user.skills.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {user.languages && user.languages.length > 0 && (
                  <div className="talent-languages">
                    <MapPin size={14} />
                    <span>
                      {user.languages.map(l => l.name).join(', ')}
                    </span>
                  </div>
                )}
              </div>

              <div className="talent-card-footer">
                <a href={`mailto:${user.email}`} className="btn btn-ghost btn-sm">
                  <Mail size={16} />
                  Contacter
                </a>
                <Link to={`/talents/${user.id}`} className="btn btn-outline btn-sm">
                  Voir profil
                </Link>
              </div>
            </div>
          ))}
        </section>

        {filteredUsers.length === 0 && (
          <div className="no-results">
            <Users size={48} />
            <h3>Aucun talent trouvé</h3>
            <p>Essayez de modifier vos critères de recherche</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Talents;

import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { usersAPI, skillsAPI, languagesAPI } from '../api';
import { User, Mail, Edit2, Save, X, CheckCircle, Award, Globe, Briefcase } from 'lucide-react';
import './Profile.css';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [allSkills, setAllSkills] = useState([]);
  const [allLanguages, setAllLanguages] = useState([]);
  const [formData, setFormData] = useState({
    full_name: '',
    bio: '',
    avatar_url: '',
    skills: [],
    languages: []
  });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      const [skillsResponse, languagesResponse] = await Promise.all([
        skillsAPI.getAll(),
        languagesAPI.getAll()
      ]);
      
      setAllSkills(skillsResponse.data);
      setAllLanguages(languagesResponse.data);
      
      if (user) {
        setFormData({
          full_name: user.full_name || '',
          bio: user.bio || '',
          avatar_url: user.avatar_url || '',
          skills: user.skills?.map(s => s.id) || [],
          languages: user.languages?.map(l => l.id) || []
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await usersAPI.update(formData);
      updateUser(response.data);
      setMessage({ type: 'success', text: 'Profil mis à jour avec succès !' });
      setIsEditing(false);
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la mise à jour du profil' });
    }
  };

  const toggleSkill = (skillId) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skillId)
        ? prev.skills.filter(id => id !== skillId)
        : [...prev.skills, skillId]
    }));
  };

  const toggleLanguage = (languageId) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(languageId)
        ? prev.languages.filter(id => id !== languageId)
        : [...prev.languages, languageId]
    }));
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement du profil...</p>
      </div>
    );
  }

  const skillsByCategory = allSkills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <div className="profile-container">
      <div className="container">
        {/* Header */}
        <section className="profile-header fade-in">
          <div className="profile-header-content">
            <div className="profile-avatar-large">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt={user.username} />
              ) : (
                <div className="avatar-placeholder-large">
                  {user?.full_name?.charAt(0) || user?.username.charAt(0).toUpperCase()}
                </div>
              )}
              {user?.is_verified && (
                <div className="verified-badge-overlay">
                  <CheckCircle size={24} />
                </div>
              )}
            </div>
            <div className="profile-header-info">
              <h1>{user?.full_name || user?.username}</h1>
              <p className="profile-username">@{user?.username}</p>
              <p className="profile-email">
                <Mail size={16} />
                {user?.email}
              </p>
            </div>
          </div>
          {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="btn btn-primary">
              <Edit2 size={18} />
              Modifier le profil
            </button>
          )}
        </section>

        {/* Message */}
        {message && (
          <div className={`alert alert-${message.type} slide-in`}>
            <CheckCircle size={20} />
            <span>{message.text}</span>
          </div>
        )}

        {/* Edit Form */}
        {isEditing ? (
          <section className="profile-edit-section card">
            <div className="section-header">
              <h2>
                <Edit2 size={24} />
                Modifier mon profil
              </h2>
              <button onClick={() => setIsEditing(false)} className="btn btn-ghost btn-sm">
                <X size={18} />
                Annuler
              </button>
            </div>

            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-group">
                <label htmlFor="full_name">
                  <User size={18} />
                  Nom complet
                </label>
                <input
                  type="text"
                  id="full_name"
                  className="input"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="Votre nom complet"
                />
              </div>

              <div className="form-group">
                <label htmlFor="bio">
                  <Briefcase size={18} />
                  Biographie
                </label>
                <textarea
                  id="bio"
                  className="input"
                  rows="4"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Parlez-nous de vous, vos passions, vos objectifs..."
                />
              </div>

              <div className="form-section">
                <h3>
                  <Award size={20} />
                  Mes compétences
                </h3>
                <p className="form-section-subtitle">Sélectionnez vos compétences</p>
                
                {Object.entries(skillsByCategory).map(([category, skills]) => (
                  <div key={category} className="skills-category">
                    <h4>{category}</h4>
                    <div className="skills-grid">
                      {skills.map(skill => (
                        <button
                          key={skill.id}
                          type="button"
                          className={`skill-checkbox ${formData.skills.includes(skill.id) ? 'selected' : ''}`}
                          onClick={() => toggleSkill(skill.id)}
                        >
                          {skill.name}
                          {formData.skills.includes(skill.id) && <CheckCircle size={16} />}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="form-section">
                <h3>
                  <Globe size={20} />
                  Mes langues
                </h3>
                <p className="form-section-subtitle">Sélectionnez les langues que vous parlez</p>
                
                <div className="languages-grid">
                  {allLanguages.map(language => (
                    <button
                      key={language.id}
                      type="button"
                      className={`language-checkbox ${formData.languages.includes(language.id) ? 'selected' : ''}`}
                      onClick={() => toggleLanguage(language.id)}
                    >
                      {language.name}
                      {formData.languages.includes(language.id) && <CheckCircle size={16} />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-actions">
                <button type="button" onClick={() => setIsEditing(false)} className="btn btn-ghost">
                  <X size={18} />
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  <Save size={18} />
                  Enregistrer les modifications
                </button>
              </div>
            </form>
          </section>
        ) : (
          <>
            {/* Bio Section */}
            {user?.bio && (
              <section className="profile-section card slide-in">
                <h2>
                  <Briefcase size={24} />
                  À propos
                </h2>
                <p className="profile-bio">{user.bio}</p>
              </section>
            )}

            {/* Skills Section */}
            {user?.skills && user.skills.length > 0 && (
              <section className="profile-section card slide-in" style={{ animationDelay: '0.1s' }}>
                <h2>
                  <Award size={24} />
                  Compétences ({user.skills.length})
                </h2>
                
                {Object.entries(
                  user.skills.reduce((acc, skill) => {
                    if (!acc[skill.category]) acc[skill.category] = [];
                    acc[skill.category].push(skill);
                    return acc;
                  }, {})
                ).map(([category, skills]) => (
                  <div key={category} className="skills-display-category">
                    <h3>{category}</h3>
                    <div className="skills-display-grid">
                      {skills.map(skill => (
                        <span key={skill.id} className="skill-badge">
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </section>
            )}

            {/* Languages Section */}
            {user?.languages && user.languages.length > 0 && (
              <section className="profile-section card slide-in" style={{ animationDelay: '0.2s' }}>
                <h2>
                  <Globe size={24} />
                  Langues ({user.languages.length})
                </h2>
                <div className="languages-display-grid">
                  {user.languages.map(language => (
                    <span key={language.id} className="language-badge">
                      {language.name}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Empty State */}
            {(!user?.bio && (!user?.skills || user.skills.length === 0) && (!user?.languages || user.languages.length === 0)) && (
              <section className="profile-empty card">
                <User size={48} />
                <h3>Complétez votre profil</h3>
                <p>Ajoutez une biographie, vos compétences et les langues que vous parlez pour vous démarquer !</p>
                <button onClick={() => setIsEditing(true)} className="btn btn-primary">
                  <Edit2 size={18} />
                  Compléter mon profil
                </button>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;

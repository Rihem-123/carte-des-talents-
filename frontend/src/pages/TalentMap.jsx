import { useState, useEffect, useRef } from 'react';
import { talentMapAPI } from '../api';
import { TrendingUp, Users, Award, Globe } from 'lucide-react';
import './TalentMap.css';

const TalentMap = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const canvasRef = useRef(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (data && canvasRef.current) {
      drawVisualization();
    }
  }, [data, selectedCategory]);

  const loadData = async () => {
    try {
      const response = await talentMapAPI.getData();
      setData(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const drawVisualization = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Filter skills by category
    let skills = data.skills_distribution;
    if (selectedCategory !== 'all') {
      skills = skills.filter(s => s.category === selectedCategory);
    }

    // Draw skill bubbles
    const maxCount = Math.max(...skills.map(s => s.count), 1);
    const padding = 20;

    skills.forEach((skill, index) => {
      const radius = Math.max(20, (skill.count / maxCount) * 80);
      const angle = (index / skills.length) * 2 * Math.PI;
      const distance = Math.min(width, height) / 3;
      
      const x = width / 2 + Math.cos(angle) * distance;
      const y = height / 2 + Math.sin(angle) * distance;

      // Draw glow
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, getCategoryColor(skill.category, 0.6));
      gradient.addColorStop(1, getCategoryColor(skill.category, 0.1));
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fill();

      // Draw border
      ctx.strokeStyle = getCategoryColor(skill.category, 0.8);
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw text
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.max(10, radius / 3)}px Inter`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(skill.name, x, y - 5);
      
      ctx.font = `${Math.max(8, radius / 4)}px Inter`;
      ctx.fillStyle = '#9ca3af';
      ctx.fillText(`${skill.count} talents`, x, y + 10);
    });
  };

  const getCategoryColor = (category, alpha = 1) => {
    const colors = {
      'Technique': `rgba(59, 130, 246, ${alpha})`,
      'Design': `rgba(217, 70, 239, ${alpha})`,
      'Management': `rgba(34, 197, 94, ${alpha})`,
      'Soft Skills': `rgba(245, 158, 11, ${alpha})`,
    };
    return colors[category] || `rgba(156, 163, 175, ${alpha})`;
  };

  const getCategories = () => {
    if (!data) return [];
    const categories = [...new Set(data.skills_distribution.map(s => s.category))];
    return ['all', ...categories];
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement de la carte...</p>
      </div>
    );
  }

  return (
    <div className="talent-map-container">
      <div className="container">
        {/* Header */}
        <section className="map-header fade-in">
          <h1>
            <TrendingUp size={40} />
            Carte des Talents
          </h1>
          <p className="map-subtitle">
            Visualisation interactive des compétences de la communauté
          </p>
        </section>

        {/* Stats Overview */}
        <section className="map-stats">
          <div className="map-stat-card card">
            <Users size={24} className="stat-icon-small" />
            <div>
              <div className="stat-value-small">{data.total_users}</div>
              <div className="stat-label-small">Talents</div>
            </div>
          </div>
          <div className="map-stat-card card">
            <Award size={24} className="stat-icon-small" />
            <div>
              <div className="stat-value-small">{data.total_skills}</div>
              <div className="stat-label-small">Compétences</div>
            </div>
          </div>
          <div className="map-stat-card card">
            <Globe size={24} className="stat-icon-small" />
            <div>
              <div className="stat-value-small">{data.total_languages}</div>
              <div className="stat-label-small">Langues</div>
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="filter-section">
          <div className="filter-buttons">
            {getCategories().map(category => (
              <button
                key={category}
                className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category === 'all' ? 'Toutes' : category}
              </button>
            ))}
          </div>
        </section>

        {/* Visualization */}
        <section className="visualization-section card">
          <canvas
            ref={canvasRef}
            width={1000}
            height={600}
            className="talent-canvas"
          />
        </section>

        {/* Skills List */}
        <section className="skills-list-section">
          <h2 className="section-title">
            <Award size={28} />
            Distribution des compétences
          </h2>
          <div className="skills-grid">
            {data.skills_distribution
              .filter(skill => selectedCategory === 'all' || skill.category === selectedCategory)
              .sort((a, b) => b.count - a.count)
              .map((skill, index) => (
                <div key={index} className="skill-item card slide-in" style={{ animationDelay: `${index * 0.05}s` }}>
                  <div className="skill-header">
                    <div className="skill-name">{skill.name}</div>
                    <div className="skill-category" style={{ background: getCategoryColor(skill.category, 0.2), color: getCategoryColor(skill.category, 1) }}>
                      {skill.category}
                    </div>
                  </div>
                  <div className="skill-count">{skill.count} talents</div>
                  <div className="skill-bar">
                    <div 
                      className="skill-bar-fill" 
                      style={{ 
                        width: `${(skill.count / Math.max(...data.skills_distribution.map(s => s.count))) * 100}%`,
                        background: getCategoryColor(skill.category, 0.8)
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </section>

        {/* Languages */}
        <section className="languages-section">
          <h2 className="section-title">
            <Globe size={28} />
            Langues parlées
          </h2>
          <div className="languages-grid">
            {data.languages_distribution
              .sort((a, b) => b.count - a.count)
              .map((lang, index) => (
                <div key={index} className="language-card card">
                  <div className="language-name">{lang.name}</div>
                  <div className="language-count">{lang.count} personnes</div>
                  <div className="language-bar">
                    <div 
                      className="language-bar-fill" 
                      style={{ 
                        width: `${(lang.count / Math.max(...data.languages_distribution.map(l => l.count))) * 100}%`
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default TalentMap;

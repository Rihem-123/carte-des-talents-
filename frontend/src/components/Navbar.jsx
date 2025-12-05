import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { Users, Map, FolderOpen, LogOut, User, Home, Shield } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            <Map className="brand-icon" size={32} />
            <span className="brand-text">Carte des Talents</span>
          </Link>

          {user && (
            <div className="navbar-menu">
              <Link to="/" className="nav-link">
                <Home size={20} />
                <span>Accueil</span>
              </Link>
              <Link to="/talents" className="nav-link">
                <Users size={20} />
                <span>Talents</span>
              </Link>
              <Link to="/carte" className="nav-link">
                <Map size={20} />
                <span>Carte</span>
              </Link>
              <Link to="/projets" className="nav-link">
                <FolderOpen size={20} />
                <span>Projets</span>
              </Link>
              <Link to="/profil" className="nav-link">
                <User size={20} />
                <span>Profil</span>
              </Link>
              {user.is_admin && (
                <Link to="/admin" className="nav-link admin-link">
                  <Shield size={20} />
                  <span>Admin</span>
                </Link>
              )}
              <button onClick={handleLogout} className="btn btn-ghost btn-sm">
                <LogOut size={18} />
                <span>Déconnexion</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

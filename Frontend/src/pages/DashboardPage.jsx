import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './DashboardPage.css';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-bg">
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      <header className="dashboard-header">
        <div className="dashboard-brand">
          <span className="logo-icon">🛒</span>
          <span className="brand-name">FWD Marketplace</span>
        </div>
        <button id="logout-btn" onClick={handleLogout} className="logout-btn">
          Cerrar sesión
        </button>
      </header>

      <main className="dashboard-main">
        <div className="welcome-card">
          <div className="avatar">
            {user?.nombre?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <div className="welcome-text">
            <p className="welcome-greeting">¡Bienvenido de vuelta! 👋</p>
            <h1 className="welcome-name">{user?.nombre}</h1>
            <p className="welcome-email">{user?.email}</p>
          </div>
          <div className="role-badge">
            <span className={`badge badge-${user?.rol}`}>{user?.rol}</span>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-info">
              <span className="stat-value">0</span>
              <span className="stat-label">Productos</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🛍️</div>
            <div className="stat-info">
              <span className="stat-value">0</span>
              <span className="stat-label">Pedidos</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-info">
              <span className="stat-value">0</span>
              <span className="stat-label">Favoritos</span>
            </div>
          </div>
        </div>

        <div className="info-card">
          <h2>🔒 Sesión activa</h2>
          <p>Tu autenticación con JWT está funcionando correctamente. El token se renueva automáticamente.</p>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;

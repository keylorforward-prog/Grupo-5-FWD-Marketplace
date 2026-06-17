import { Link } from 'react-router-dom';

export default function LandingNavbar() {
  return (
    <nav className="landing-navbar">
      <div className="landing-navbar-left">
        <Link to="/proyectos">Projects</Link>
        <Link to="/juniors">Juniors</Link>
      </div>

      <div className="landing-navbar-logo">
        <span>FWD.</span>
      </div>

      <div className="landing-navbar-right">
        <Link to="/empresas">Empresas</Link>

        <Link to="/login" className="landing-btn landing-btn-yellow">
          Acceder
        </Link>
      </div>
    </nav>
  );
}
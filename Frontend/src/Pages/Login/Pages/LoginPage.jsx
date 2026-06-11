import LoginForm from "../Components/LoginForm";
import '../../AuthPages.css';

const LoginPage = () => {
  return (
    <div className="auth-split">
      {/* ── Brand Panel (Left) ── */}
      <div className="auth-brand-panel">
        <div className="brand-logo-row">
          <div className="brand-logo-circle">
            <img src="/Imgs/IconoFWD.png" alt="FWD Logo" />
          </div>
          <span className="brand-logo-text">FWD Junior</span>
        </div>

        <div className="brand-heading">
          <h1>
            El futuro no espera,
            <br />
            <span className="text-highlight">impulsa tu talento.</span>
          </h1>
        </div>

        <p className="brand-description">
          Únete a la plataforma líder para desarrolladores junior.
          Encuentra proyectos de alto impacto y conecta con las
          empresas más innovadoras del ecosistema digital.
        </p>

        <div className="brand-social-proof">
          <div className="avatar-group">
            <img src="/Imgs/ProfileDefaultImage.png" alt="Dev 1" />
            <img src="/Imgs/ProfileDefaultImage.png" alt="Dev 2" />
            <img src="/Imgs/ProfileDefaultImage.png" alt="Dev 3" />
          </div>
          <span className="social-proof-text">
            <strong>+2,500</strong> desarrolladores ya están creciendo con nosotros
          </span>
        </div>
      </div>

      {/* ── Form Panel (Right) ── */}
      <div className="auth-form-panel">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;

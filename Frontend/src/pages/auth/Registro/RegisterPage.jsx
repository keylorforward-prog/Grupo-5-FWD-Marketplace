import RegisterForm from "./components/RegisterForm";
import "../AuthPages.css";

const RegisterPage = () => {
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
            Construye tu futuro,
            <br />
            <span className="text-highlight">empieza hoy.</span>
          </h1>
        </div>

        <p className="brand-description">
          Crea tu cuenta y accede a oportunidades exclusivas.
          Conecta con empresas, publica tus habilidades y lleva
          tu carrera al siguiente nivel.
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
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;

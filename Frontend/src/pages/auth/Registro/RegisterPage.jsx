import RegisterForm from "./components/RegisterForm";
import "../AuthPages.css";

const RegisterPage = () => {
  return (
    <div className="auth-split">
      {/* ── Brand Panel (Left) ── */}
      <div className="auth-brand-panel">
        <div className="brand-logo-row flex items-center gap-3">
          <div className="brand-logo-circle w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-sm">
            <img src="/Imgs/Logotipo/Digital/Sintesis/FWD - Sintesis.svg" alt="FWD Logo" className="w-8 h-8 object-contain" />
          </div>
          <span className="brand-logo-text text-white font-bold text-xl">FWD Junior</span>
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
            <img src="/Imgs/Logotipo/Digital/Sintesis/FWD - Sintesis-01.png" alt="Dev 1" />
            <img src="/Imgs/Logotipo/Digital/Sintesis/FWD - Sintesis-01.png" alt="Dev 2" />
            <img src="/Imgs/Logotipo/Digital/Sintesis/FWD - Sintesis-01.png" alt="Dev 3" />
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

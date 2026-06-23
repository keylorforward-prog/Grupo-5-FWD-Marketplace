import { useState } from 'react';
import ForgotPasswordForm from '../../components/authContraseña/ForgotPasswordForm';
import VerifyCodeForm from '../../components/authContraseña/VerifyCodeForm';
import ResetPasswordForm from '../../components/authContraseña/ResetPasswordForm';
import '../auth/AuthPages.css';

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');

  const handleEmailSuccess = (userEmail) => {
    setEmail(userEmail);
    setStep(2);
  };

  const handleCodeSuccess = (verifiedCode) => {
    setCode(verifiedCode);
    setStep(3);
  };

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
            Recupera el acceso,
            <br />
            <span className="text-highlight">vuelve a la acción.</span>
          </h1>
        </div>

        <p className="brand-description">
          Sigue los pasos para restablecer tu contraseña de forma segura. 
          Te enviaremos un código de verificación a tu correo registrado.
        </p>

        {/* Step indicators */}
        <div className="mt-8 flex items-center gap-4 relative z-10">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= 1 ? 'bg-[#3EC6C6] text-white' : 'bg-white/20 text-white/50'}`}>1</div>
          <div className={`w-12 h-1 rounded-full transition-colors ${step >= 2 ? 'bg-[#3EC6C6]' : 'bg-white/20'}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= 2 ? 'bg-[#3EC6C6] text-white' : 'bg-white/20 text-white/50'}`}>2</div>
          <div className={`w-12 h-1 rounded-full transition-colors ${step >= 3 ? 'bg-[#3EC6C6]' : 'bg-white/20'}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= 3 ? 'bg-[#3EC6C6] text-white' : 'bg-white/20 text-white/50'}`}>3</div>
        </div>
      </div>

      {/* ── Form Panel (Right) ── */}
      <div className="auth-form-panel">
        {step === 1 && <ForgotPasswordForm onSuccess={handleEmailSuccess} />}
        {step === 2 && <VerifyCodeForm email={email} onSuccess={handleCodeSuccess} />}
        {step === 3 && <ResetPasswordForm email={email} code={code} />}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
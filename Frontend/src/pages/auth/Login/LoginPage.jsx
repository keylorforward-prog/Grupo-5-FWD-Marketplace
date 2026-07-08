import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import LoginForm from './components/LoginForm';
import RegisterForm from '../Registro/components/RegisterForm';
import LanguageSwitcher from '../../../components/comun/LanguageSwitcher';
import '../AuthPages.css';

const LoginPage = () => {
  const { t } = useTranslation();
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);

  const handleSignIn = () => setIsRightPanelActive(false);
  const handleSignUp = () => setIsRightPanelActive(true);

  return (
    <div className="fwd-auth-wrapper">
      <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 1000 }}>
        <LanguageSwitcher />
      </div>

      <div className="form-container">
        {isRightPanelActive ? (
          <RegisterForm onSwitchMode={handleSignIn} />
        ) : (
          <LoginForm onSwitchMode={handleSignUp} />
        )}
      </div>

      <div className="overlay-container">
        <div className="auth-brand-panel inner-panel">
          <div className="brand-logo-row">
            <div className="brand-logo-circle">
              <img src="/Imgs/Logotipo/Digital/Sintesis/FWD - Sintesis-01.png" alt="FWD Logo" />
            </div>
            <span className="brand-logo-text">FWD Junior</span>
          </div>

          <div className="brand-heading">
            <h1>
              {isRightPanelActive ? t('auth.overlayLeft.titleStart') : t('auth.overlayRight.titleStart')}
              <br />
              <span className="text-highlight">
                {isRightPanelActive ? t('auth.overlayLeft.titleHighlight') : t('auth.overlayRight.titleHighlight')}
              </span>
            </h1>
          </div>
          <p className="brand-description">
            {isRightPanelActive ? t('auth.overlayLeft.desc') : t('auth.overlayRight.desc')}
          </p>
          <button className="auth-btn ghost" onClick={isRightPanelActive ? handleSignIn : handleSignUp}>
            {isRightPanelActive ? t('auth.overlayLeft.btn') : t('auth.overlayRight.btn')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

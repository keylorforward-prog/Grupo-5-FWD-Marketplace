import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import LoginForm from './components/LoginForm';
import RegisterForm from '../Registro/components/RegisterForm';
import LanguageSwitcher from '../../../components/comun/LanguageSwitcher';
import fwdDarkLogo from '../../../assets/fwdcrdark.png';
import '../AuthPages.css';

const LoginPage = () => {
  const { t } = useTranslation();
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);

  const handleSignIn = () => setIsRightPanelActive(false);
  const handleSignUp = () => setIsRightPanelActive(true);

  // Motion variants for smooth transitions
  const transitionSettings = { duration: 0.6, ease: "easeInOut" };

  return (
    <div className="fwd-auth-wrapper">
      <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 1000 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: '#5A3F47', fontWeight: 'bold', background: 'rgba(255,255,255,0.8)', padding: '8px 16px', borderRadius: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <ArrowLeft size={18} />
          <span>Volver al inicio</span>
        </Link>
      </div>
      <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 1000 }}>
        <LanguageSwitcher />
      </div>
      {/* Sign In Panel (Left side by default) */}
      <motion.div
        className="form-container sign-in-container"
        initial={false}
        animate={{
          x: isRightPanelActive ? '100%' : '0%',
          opacity: isRightPanelActive ? 0 : 1,
          zIndex: isRightPanelActive ? 1 : 5
        }}
        transition={transitionSettings}
      >
        <LoginForm onSwitchMode={handleSignUp} />
      </motion.div>

      {/* Sign Up Panel (Left side by default, moves right when active) */}
      <motion.div
        className="form-container sign-up-container"
        initial={false}
        animate={{
          x: isRightPanelActive ? '100%' : '0%',
          opacity: isRightPanelActive ? 1 : 0,
          zIndex: isRightPanelActive ? 5 : 1
        }}
        transition={transitionSettings}
      >
        <RegisterForm onSwitchMode={handleSignIn} />
      </motion.div>

      {/* Overlay Container (Right side by default, moves left when active) */}
      <motion.div
        className="overlay-container"
        initial={false}
        animate={{
          x: isRightPanelActive ? '-100%' : '0%'
        }}
        transition={transitionSettings}
      >
        <motion.div
          className="overlay"
          initial={false}
          animate={{
            x: isRightPanelActive ? '50%' : '0%'
          }}
          transition={transitionSettings}
        >
          {/* Overlay Left (Visible when Sign Up is active, guides to Sign In) */}
          <motion.div
            className="overlay-panel overlay-left"
            initial={false}
            animate={{
              x: isRightPanelActive ? '0%' : '-20%'
            }}
            transition={transitionSettings}
          >
            <div className="auth-brand-panel inner-panel">
              <div className="brand-logo-row">
                <div className="brand-logo-circle">
                  <img src="/Imgs/Logotipo/Digital/Sintesis/FWD - Sintesis-01.png" alt="FWD Logo" />
                </div>
                <img src={fwdDarkLogo} alt="FWD Junior" style={{ height: '32px', width: 'auto', objectFit: 'contain', marginLeft: '12px' }} />
              </div>
              <div className="brand-heading">
                <h1>
                  {t('auth.overlayLeft.titleStart')}
                  <br />
                  <span className="text-highlight">{t('auth.overlayLeft.titleHighlight')}</span>
                </h1>
              </div>
              <p className="brand-description">
                {t('auth.overlayLeft.desc')}
              </p>
              <button className="auth-btn ghost" onClick={handleSignIn}>
                {t('auth.overlayLeft.btn')}
              </button>
            </div>
          </motion.div>

          {/* Overlay Right (Visible when Sign In is active, guides to Sign Up) */}
          <motion.div
            className="overlay-panel overlay-right"
            initial={false}
            animate={{
              x: isRightPanelActive ? '20%' : '0%'
            }}
            transition={transitionSettings}
          >
            <div className="auth-brand-panel inner-panel">
              <div className="brand-logo-row">
                <div className="brand-logo-circle">
                  <img src="/Imgs/Logotipo/Digital/Sintesis/FWD - Sintesis-01.png" alt="FWD Logo" />
                </div>
                <img src={fwdDarkLogo} alt="FWD Junior" style={{ height: '32px', width: 'auto', objectFit: 'contain', marginLeft: '12px' }} />
              </div>
              <div className="brand-heading">
                <h1>
                  {t('auth.overlayRight.titleStart')}
                  <br />
                  <span className="text-highlight">{t('auth.overlayRight.titleHighlight')}</span>
                </h1>
              </div>
              <p className="brand-description">
                {t('auth.overlayRight.desc')}
              </p>
              <button className="auth-btn ghost" onClick={handleSignUp}>
                {t('auth.overlayRight.btn')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;

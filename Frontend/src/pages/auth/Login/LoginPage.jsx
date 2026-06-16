import { useState } from 'react';
import { motion } from 'framer-motion';
import LoginForm from './components/LoginForm';
import RegisterForm from '../Registro/components/RegisterForm';
import '../AuthPages.css';

const LoginPage = () => {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);

  const handleSignIn = () => setIsRightPanelActive(false);
  const handleSignUp = () => setIsRightPanelActive(true);

  // Motion variants for smooth transitions
  const transitionSettings = { duration: 0.6, ease: "easeInOut" };

  return (
    <div className="fwd-auth-wrapper">
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
                  <img src="/Imgs/FWD - Sintesis-01.png" alt="FWD Logo" />
                </div>
                <span className="brand-logo-text">FWD Junior</span>
              </div>
              <div className="brand-heading">
                <h1>
                  ¡Bienvenido de nuevo!
                  <br />
                  <span className="text-highlight">Sigue creciendo.</span>
                </h1>
              </div>
              <p className="brand-description">
                Para mantenerte conectado con nosotros, por favor inicia sesión con tu información personal y descubre nuevos proyectos.
              </p>
              <button className="auth-btn ghost" onClick={handleSignIn}>
                Iniciar Sesión
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
                  <img src="/Imgs/FWD - Sintesis-01.png" alt="FWD Logo" />
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
                Únete a la plataforma líder para desarrolladores junior. Encuentra proyectos de alto impacto y conecta con las empresas más innovadoras.
              </p>
              <button className="auth-btn ghost" onClick={handleSignUp}>
                Regístrate
              </button>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;

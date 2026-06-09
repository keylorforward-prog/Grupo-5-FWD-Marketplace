import React, { useState } from 'react';
import './Styles/SettingsEgresado.css';
import SidebarSettings from './components/SidebarSettings';
import AccountInfo from './components/AccountInfo';
import ProfessionalPreferences from './components/ProfessionalPreferences';
import Notifications from './components/Notifications';
import Security from './components/Security';
import { User, Briefcase, Bell, Lock } from 'lucide-react';
import ProfileDefaultImage from '../../../../../../public/Imgs/ProfileDefaultImage.png';

const SettingsEgresado = () => {
  const [activeSection, setActiveSection] = useState('cuenta');

  const scrollToSection = (id) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="settings-layout">
      <SidebarSettings />

      <main className="settings-main">
        <div className="settings-header">
          <h1 className="settings-title">Configuración.</h1>
          <p className="settings-subtitle">Gestiona tu identidad profesional y preferencias de la plataforma.</p>
        </div>

        <div className="settings-content-wrapper">
          {/* Navigation Card */}
          <aside className="settings-nav-card">
            <div className="profile-summary">
              <img src={ProfileDefaultImage} alt="Alex Rivera" />
              <h3>Alex Rivera</h3>
              <p>Junior Frontend Developer</p>
            </div>

            <nav className="internal-nav">
              <button 
                className={`internal-nav-btn ${activeSection === 'cuenta' ? 'active' : ''}`}
                onClick={() => scrollToSection('cuenta')}
              >
                <User size={18} />
                Información de Cuenta
              </button>
              <button 
                className={`internal-nav-btn ${activeSection === 'preferencias' ? 'active' : ''}`}
                onClick={() => scrollToSection('preferencias')}
              >
                <Briefcase size={18} />
                Preferencias Profesionales
              </button>
              <button 
                className={`internal-nav-btn ${activeSection === 'notificaciones' ? 'active' : ''}`}
                onClick={() => scrollToSection('notificaciones')}
              >
                <Bell size={18} />
                Notificaciones
              </button>
              <button 
                className={`internal-nav-btn ${activeSection === 'seguridad' ? 'active' : ''}`}
                onClick={() => scrollToSection('seguridad')}
              >
                <Lock size={18} />
                Seguridad
              </button>
            </nav>
          </aside>

          {/* Forms Area */}
          <div className="settings-forms">
            <AccountInfo />
            <ProfessionalPreferences />
            <Notifications />
            <Security />
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsEgresado;

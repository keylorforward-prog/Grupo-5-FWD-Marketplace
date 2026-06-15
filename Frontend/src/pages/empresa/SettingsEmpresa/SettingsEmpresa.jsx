import React from 'react';
import SidebarEmpresa from './components/SidebarEmpresa';
import HeaderEmpresa from './components/HeaderEmpresa';
import CompanyProfile from './components/CompanyProfile';
import RecruitmentTeam from './components/RecruitmentTeam';
import NotificationPreferences from './components/NotificationPreferences';
import SecuritySettings from './components/SecuritySettings';
import './Styles/SettingsEmpresa.css';

const SettingsEmpresa = () => {
  return (
    <div className="settings-empresa-wrapper">
      <SidebarEmpresa />

      <main className="se-main-content">
        <HeaderEmpresa />

        <div className="se-canvas">
          <CompanyProfile />

          <div className="se-grid-2">
            <RecruitmentTeam />
            <NotificationPreferences />
          </div>

          <SecuritySettings />
        </div>
      </main>
    </div>
  );
};

export default SettingsEmpresa;

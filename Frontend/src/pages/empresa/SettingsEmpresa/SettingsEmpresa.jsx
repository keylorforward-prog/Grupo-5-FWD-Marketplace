import React from 'react';
import SidebarEmpresa from './components/SidebarEmpresa';
import HeaderEmpresa from './components/HeaderEmpresa';
import CompanyProfile from './components/CompanyProfile';
import RecruitmentTeam from './components/RecruitmentTeam';
import NotificationPreferences from './components/NotificationPreferences';
import DangerZone from './components/DangerZone';
import './Styles/SettingsEmpresa.css';

const SettingsEmpresa = () => {
  return (
    <div className="settings-empresa-layout">
      <SidebarEmpresa />
      <div className="settings-empresa-main">
        <HeaderEmpresa />
        <div className="settings-empresa-content">
          {/* Profile Section */}
          <CompanyProfile />

          {/* Cards Section */}
          <div className="flex gap-8 w-full">
            <RecruitmentTeam />
            <NotificationPreferences />
          </div>

          {/* Danger Zone */}
          <DangerZone />
        </div>
      </div>
    </div>
  );
};

export default SettingsEmpresa;

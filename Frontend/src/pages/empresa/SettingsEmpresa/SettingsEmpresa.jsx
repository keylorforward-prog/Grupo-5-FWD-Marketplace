import SidebarEmpresa from './components/SidebarEmpresa';
import HeaderEmpresa from './components/HeaderEmpresa';
import CompanyProfile from './components/CompanyProfile';
import RecruitmentTeam from './components/RecruitmentTeam';
import NotificationPreferences from './components/NotificationPreferences';
import SecuritySettings from './components/SecuritySettings';
import './Styles/SettingsEmpresa.css';

const SettingsEmpresa = () => {
  return (
    <DashboardLayout activePage="configuracion">
      <div className="settings-empresa-wrapper">
        <div className="se-canvas" style={{ width: '100%' }}>
          <CompanyProfile />

          <div className="se-grid-2">
            <RecruitmentTeam />
            <NotificationPreferences />
          </div>

          <SecuritySettings />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsEmpresa;

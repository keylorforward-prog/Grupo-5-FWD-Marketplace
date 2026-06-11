import React from 'react';
import { NavLink } from 'react-router-dom';
import { Compass, LayoutDashboard, FileText, MessageSquare, User, Settings, Plus } from 'lucide-react';

const SidebarEmpresa = () => {
  return (
    <aside className="settings-empresa-sidebar">
      <div className="sidebar-header">
        <div className="w-10 h-10 bg-primary rounded-lg mb-2 text-white flex items-center justify-center font-bold text-xl">
          .
        </div>
        <div className="sidebar-brand">
          FWD Talent
          <span className="sidebar-role">Recruitment Suite</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/explore" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
          <Compass size={20} /> Explore
        </NavLink>
        <NavLink to="/DashboardEmpresario" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
          <LayoutDashboard size={20} /> Dashboard
        </NavLink>
        <NavLink to="/postulaciones" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
          <FileText size={20} /> Applications
        </NavLink>
        <NavLink to="/mensajes" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
          <MessageSquare size={20} /> Messages
        </NavLink>
        <NavLink to="/perfil-empresa" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
          <User size={20} /> Profile
        </NavLink>
        <NavLink to="/SettingsEmpresa" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
          <Settings size={20} /> Settings
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <button className="w-full bg-[#20bec6] text-white rounded-lg py-3 font-semibold flex justify-center items-center gap-2 hover:opacity-90 transition">
          <Plus size={18} /> Post a Job
        </button>
      </div>
    </aside>
  );
};

export default SidebarEmpresa;

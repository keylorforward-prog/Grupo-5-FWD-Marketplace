import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const BannerSuperior = () => {
  return (
    <div className="bannerSuperior">
      <Link to="/DashboardEgresado" className="volverDashboard">
        <ArrowLeft size={20} />
        <span>Volver al Dashboard</span>
      </Link>
      <div className="contenidoBanner">
        <span className="etiquetaBanner">DASHBOARD DE TALENTO</span>
        <h1 className="tituloBanner">Mi Perfil Estudiantil</h1>
      </div>
      <div className="decoracionBanner"></div>
    </div>
  );
};

export default BannerSuperior;

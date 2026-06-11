import { useNavigate } from 'react-router-dom';
import { MoreVertical } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { mockProjects } from '../../data/dashboardData';

export default function Proyectos() {
  const navigate = useNavigate();

  return (
    <DashboardLayout activePage="proyectos">
      <div className="de-page-heading">
        <h1>Mis Proyectos</h1>
        <button className="de-btn-primary" type="button" onClick={() => navigate('/DashboardEmpresario/publicar-proyecto')}>Publicar Proyecto</button>
      </div>
      <div className="de-panel">
        {mockProjects.map((p) => (
          <div key={p.id} className="de-project-item">
            <div className={`de-project-icon-wrap ${p.iconColor}`}>{p.icon}</div>
            <div className="de-project-info">
              <div className="de-project-name">
                {p.name}
                <span className={`de-badge ${p.statusType}`}>{p.status}</span>
              </div>
              <p className="de-project-meta">{p.meta}</p>
            </div>
            <div className="de-project-action">
              <button className="de-project-btn" type="button" onClick={() => navigate('/DashboardEmpresario/ofertas')}>{p.action}</button>
              <button className="de-project-menu" type="button" aria-label="Mas opciones">
                <MoreVertical size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}

import DashboardLayout from '../../components/DashboardLayout';
import { mockProjects } from '../../data/dashboardData';

export default function Historial() {
  return (
    <DashboardLayout activePage="historial">
      <div className="de-page-heading">
        <h1>Historial de Proyectos</h1>
      </div>
      <div className="de-panel">
        {mockProjects.map((project) => (
          <div key={project.id} className="de-project-item">
            <div className={`de-project-icon-wrap ${project.iconColor}`}>{project.icon}</div>
            <div className="de-project-info">
              <div className="de-project-name">{project.name}</div>
              <p className="de-project-meta">{project.meta}</p>
            </div>
            <span className={`de-badge ${project.statusType}`}>{project.status}</span>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}

import { dashboardEmpresarioService } from '../../../../../services/dashboardEmpresarioService';
import DashboardLayout from '../../components/DashboardLayout';
import EstadoDatos from '../../components/EstadoDatos';
import { useDashboardEmpresarioRequest } from '../../hooks/useDashboardEmpresarioRequest';
import { formatearHistorial } from '../../utils/dashboardEmpresarioFormatters';

export default function Historial() {
  const { data, loading, error } = useDashboardEmpresarioRequest(
    () => dashboardEmpresarioService.obtenerHistorial(),
    [],
    []
  );
  const historial = data.map(formatearHistorial);

  return (
    <DashboardLayout activePage="historial">
      <div className="de-page-heading">
        <h1>Historial de Proyectos</h1>
      </div>
      <div className="de-panel">
        <EstadoDatos loading={loading} error={error} empty={!historial.length} emptyText="No hay historial de proyectos." />
        {!loading && !error && historial.map((project) => (
          <div key={project.id} className="de-project-item">
            <div className={`de-project-icon-wrap ${project.iconColor}`}>
              <img src={project.arrowSrc} alt="Imagen descriptiva" className="de-project-arrow" width="24" height="24" loading="lazy" decoding="async" />
            </div>
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

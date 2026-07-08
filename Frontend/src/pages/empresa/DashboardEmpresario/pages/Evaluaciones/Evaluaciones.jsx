import { dashboardEmpresarioService } from '../../../../../services/dashboardEmpresarioService';
import DashboardLayout from '../../components/DashboardLayout';
import EstadoDatos from '../../components/EstadoDatos';
import { useDashboardEmpresarioRequest } from '../../hooks/useDashboardEmpresarioRequest';
import { formatearEvaluacion } from '../../utils/dashboardEmpresarioFormatters';

export default function Evaluaciones() {
  const { data, loading, error } = useDashboardEmpresarioRequest(
    () => dashboardEmpresarioService.obtenerEvaluaciones(),
    [],
    []
  );
  const evaluaciones = data.map(formatearEvaluacion);

  return (
    <DashboardLayout activePage="evaluaciones">
      <div className="de-page-heading">
        <h1>Evaluaciones</h1>
      </div>
      <div className="de-panel">
        <EstadoDatos loading={loading} error={error} empty={!evaluaciones.length} emptyText="No hay evaluaciones registradas." />
        {!loading && !error && evaluaciones.map((talent) => (
          <div key={talent.id} className="de-talent-item">
            <img src={talent.avatar} alt={talent.name} className="de-talent-avatar" />
            <div className="de-talent-info">
              <div className="de-talent-name">{talent.name}</div>
              <p className="de-talent-skills">{talent.skills}</p>
            </div>
            <div className="de-talent-match">
              <span className="de-talent-match-pct">{talent.rating}</span>
              <span className="de-talent-match-label">Calificacion</span>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}

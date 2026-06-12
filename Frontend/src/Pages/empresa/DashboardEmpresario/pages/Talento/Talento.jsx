import { CheckCircle2 } from 'lucide-react';
import { dashboardEmpresarioService } from '../../../../../services/dashboardEmpresarioService';
import DashboardLayout from '../../components/DashboardLayout';
import EstadoDatos from '../../components/EstadoDatos';
import { useDashboardEmpresarioRequest } from '../../hooks/useDashboardEmpresarioRequest';
import { formatearTalento } from '../../utils/dashboardEmpresarioFormatters';

export default function Talento() {
  const { data, loading, error } = useDashboardEmpresarioRequest(
    () => dashboardEmpresarioService.obtenerTalentoRecomendado(),
    [],
    []
  );
  const talento = data.map(formatearTalento);

  return (
    <DashboardLayout activePage="talento">
      <div className="de-page-heading">
        <h1>Talento Recomendado</h1>
      </div>
      <div className="de-panel">
        <EstadoDatos loading={loading} error={error} empty={!talento.length} emptyText="No hay talento recomendado disponible." />
        {!loading && !error && talento.map((talent) => (
          <div key={talent.id} className="de-talent-item">
            <img src={talent.avatar} alt={talent.name} className="de-talent-avatar" />
            <div className="de-talent-info">
              <div className="de-talent-name">
                {talent.name}
                {talent.verified && <CheckCircle2 size={14} className="de-talent-verified" />}
              </div>
              <p className="de-talent-skills">{talent.skills}</p>
              <p className="de-talent-rating"><span className="de-talent-star">★</span>{talent.rating} ({talent.projects} proyectos)</p>
            </div>
            <div className="de-talent-match">
              <span className="de-talent-match-pct">{talent.match}%</span>
              <span className="de-talent-match-label">Coincidencia</span>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}

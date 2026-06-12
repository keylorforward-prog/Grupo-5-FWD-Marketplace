import { Package } from 'lucide-react';
import { dashboardEmpresarioService } from '../../../../../services/dashboardEmpresarioService';
import DashboardLayout from '../../components/DashboardLayout';
import EstadoDatos from '../../components/EstadoDatos';
import { useDashboardEmpresarioRequest } from '../../hooks/useDashboardEmpresarioRequest';
import { formatearEntregable } from '../../utils/dashboardEmpresarioFormatters';

export default function Entregables() {
  const { data, loading, error } = useDashboardEmpresarioRequest(
    () => dashboardEmpresarioService.obtenerEntregables(),
    [],
    []
  );
  const entregables = data.map(formatearEntregable);

  return (
    <DashboardLayout activePage="entregables">
      <div className="de-page-heading">
        <h1>Entregables</h1>
      </div>
      <div className="de-panel">
        <EstadoDatos loading={loading} error={error} empty={!entregables.length} emptyText="No hay entregables registrados." />
        {!loading && !error && entregables.map((item) => (
          <div key={item.id} className="de-deliverable-item">
            <div className="de-deliverable-icon"><Package size={16} /></div>
            <div className="de-deliverable-info">
              <p className="de-deliverable-name">{item.name}</p>
              <p className="de-deliverable-meta">{item.meta}</p>
            </div>
            <span className="de-badge pendiente">{item.status}</span>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}

import { FileText } from 'lucide-react';
import { dashboardEmpresarioService } from '../../../../../services/dashboardEmpresarioService';
import DashboardLayout from '../../components/DashboardLayout';
import EstadoDatos from '../../components/EstadoDatos';
import { useDashboardEmpresarioRequest } from '../../hooks/useDashboardEmpresarioRequest';
import { formatearOferta } from '../../utils/dashboardEmpresarioFormatters';

export default function Ofertas() {
  const { data, loading, error } = useDashboardEmpresarioRequest(
    () => dashboardEmpresarioService.obtenerOfertas(),
    [],
    []
  );
  const ofertas = data.map(formatearOferta);

  return (
    <DashboardLayout activePage="ofertas">
      <div className="de-page-heading">
        <h1>Ofertas Recibidas</h1>
      </div>
      <div className="de-panel">
        <EstadoDatos loading={loading} error={error} empty={!ofertas.length} emptyText="No hay ofertas recibidas." />
        {!loading && !error && ofertas.map((offer) => (
          <div key={offer.id} className="de-offer-item">
            <div className="de-offer-icon-wrap"><FileText size={16} /></div>
            <div className="de-offer-info">
              <p className="de-offer-title">{offer.title}</p>
              <p className="de-offer-sender">{offer.sender}</p>
            </div>
            <div className="de-offer-right">
              <span className="de-badge nueva">{offer.status}</span>
              <span className="de-offer-time">{offer.time}</span>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}

import { dashboardEmpresarioService } from '../../../../../services/dashboardEmpresarioService';
import EstadoDatos from '../../components/EstadoDatos';
import { useDashboardEmpresarioRequest } from '../../hooks/useDashboardEmpresarioRequest';
import { formatearPago } from '../../utils/dashboardEmpresarioFormatters';

export default function Facturacion() {
  const { data, loading, error } = useDashboardEmpresarioRequest(
    () => dashboardEmpresarioService.obtenerPagos(),
    [],
    []
  );
  const pagos = data.map(formatearPago);

  return (
    <>
      <div className="de-page-heading">
        <h1>Facturacion</h1>
      </div>
      <div className="de-panel">
        <EstadoDatos loading={loading} error={error} empty={!pagos.length} emptyText="No hay pagos registrados." />
        {!loading && !error && pagos.map((invoice) => (
          <div key={invoice.id} className="de-deliverable-item">
            <div className="de-deliverable-info">
              <p className="de-deliverable-name">{invoice.concept}</p>
              <p className="de-deliverable-meta">{invoice.amount}</p>
            </div>
            <span className="de-badge pendiente">{invoice.status}</span>
          </div>
        ))}
      </div>
    </>
  );
}

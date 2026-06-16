import DashboardLayout from '../../components/DashboardLayout';

const invoices = [
  { id: 1, concept: 'Proyecto Sistema de Inventario', amount: '$450', status: 'Pagado' },
  { id: 2, concept: 'Dashboard de Ventas', amount: '$700', status: 'Pendiente' },
  { id: 3, concept: 'Landing Page Marketing', amount: '$320', status: 'Pagado' },
];

export default function Facturacion() {
  return (
    <DashboardLayout activePage="facturacion">
      <div className="de-page-heading">
        <h1>Facturacion</h1>
      </div>
      <div className="de-panel">
        {invoices.map((invoice) => (
          <div key={invoice.id} className="de-deliverable-item">
            <div className="de-deliverable-info">
              <p className="de-deliverable-name">{invoice.concept}</p>
              <p className="de-deliverable-meta">{invoice.amount}</p>
            </div>
            <span className="de-badge pendiente">{invoice.status}</span>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}

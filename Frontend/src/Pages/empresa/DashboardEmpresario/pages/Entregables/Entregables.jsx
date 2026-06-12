import { Package } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { mockDeliverables } from '../../data/dashboardData';

export default function Entregables() {
  return (
    <DashboardLayout activePage="entregables">
      <div className="de-page-heading">
        <h1>Entregables</h1>
      </div>
      <div className="de-panel">
        {mockDeliverables.map((item) => (
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

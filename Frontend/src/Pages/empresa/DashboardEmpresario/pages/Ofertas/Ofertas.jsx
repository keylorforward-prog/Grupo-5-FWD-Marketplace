import DashboardLayout from '../../components/DashboardLayout';
import { mockOffers } from '../../data/dashboardData';

export default function Ofertas() {
  return (
    <DashboardLayout activePage="ofertas">
      <div className="de-page-heading">
        <h1>Ofertas Recibidas</h1>
      </div>
      <div className="de-panel">
        {mockOffers.map((offer) => (
          <div key={offer.id} className="de-offer-item">
            <div className="de-offer-icon-wrap">📄</div>
            <div className="de-offer-info">
              <p className="de-offer-title">{offer.title}</p>
              <p className="de-offer-sender">{offer.sender}</p>
            </div>
            <div className="de-offer-right">
              <span className="de-badge nueva">Nueva</span>
              <span className="de-offer-time">{offer.time}</span>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}

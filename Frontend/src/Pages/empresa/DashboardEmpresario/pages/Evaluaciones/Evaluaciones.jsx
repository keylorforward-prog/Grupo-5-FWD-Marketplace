import DashboardLayout from '../../components/DashboardLayout';
import { mockTalent } from '../../data/dashboardData';

export default function Evaluaciones() {
  return (
    <DashboardLayout activePage="evaluaciones">
      <div className="de-page-heading">
        <h1>Evaluaciones</h1>
      </div>
      <div className="de-panel">
        {mockTalent.map((talent) => (
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

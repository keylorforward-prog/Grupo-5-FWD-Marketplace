import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';

export default function CrearProyectoIA() {
  const navigate = useNavigate();

  return (
    <DashboardLayout activePage="talento">
      <div className="de-page-heading">
        <h1>Crear Proyecto con IA</h1>
      </div>
      <div className="de-panel">
        <div className="de-form-grid">
          <textarea className="de-form-control de-form-textarea" placeholder="Describe la idea que quieres construir" />
          <button className="de-btn-primary" type="button" onClick={() => navigate('/DashboardEmpresario/publicar-proyecto')}>Generar Borrador</button>
        </div>
      </div>
    </DashboardLayout>
  );
}

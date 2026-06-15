import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';

export default function PublicarProyecto() {
  const navigate = useNavigate();

  return (
    <DashboardLayout activePage="proyectos">
      <div className="de-page-heading">
        <h1>Publicar Proyecto</h1>
      </div>
      <div className="de-panel">
        <div className="de-form-grid">
          <input className="de-form-control" placeholder="Nombre del proyecto" />
          <input className="de-form-control" placeholder="Presupuesto estimado" />
          <textarea className="de-form-control de-form-textarea" placeholder="Descripcion del proyecto" />
          <button className="de-btn-primary" type="button" onClick={() => navigate('/DashboardEmpresario/proyectos')}>Guardar Proyecto</button>
        </div>
      </div>
    </DashboardLayout>
  );
}

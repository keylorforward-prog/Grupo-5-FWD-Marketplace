import DashboardLayout from '../../components/DashboardLayout';

export default function Configuracion() {
  return (
    <DashboardLayout activePage="configuracion">
      <div className="de-page-heading">
        <h1>Configuracion</h1>
      </div>

      <div className="de-grid-3">
        <section className="de-panel">
          <div className="de-panel-header">
            <h3 className="de-panel-title">Empresa</h3>
          </div>
          <div className="de-form-grid">
            <input className="de-form-control" defaultValue="TechNova S.A." aria-label="Nombre de empresa" />
            <input className="de-form-control" defaultValue="contacto@technova.com" aria-label="Correo de empresa" />
            <textarea
              className="de-form-control de-form-textarea"
              defaultValue="Empresa enfocada en soluciones digitales para pymes."
              aria-label="Descripcion de empresa"
            />
          </div>
        </section>

        <section className="de-panel">
          <div className="de-panel-header">
            <h3 className="de-panel-title">Preferencias</h3>
          </div>
          <div className="de-form-grid">
            <label className="de-setting-row">
              <span>Recibir postulaciones por correo</span>
              <input type="checkbox" defaultChecked />
            </label>
            <label className="de-setting-row">
              <span>Mostrar talento recomendado</span>
              <input type="checkbox" defaultChecked />
            </label>
            <label className="de-setting-row">
              <span>Alertas de entregables pendientes</span>
              <input type="checkbox" defaultChecked />
            </label>
          </div>
        </section>

        <section className="de-panel">
          <div className="de-panel-header">
            <h3 className="de-panel-title">Seguridad</h3>
          </div>
          <div className="de-form-grid">
            <input className="de-form-control" type="password" placeholder="Contrasena actual" />
            <input className="de-form-control" type="password" placeholder="Nueva contrasena" />
            <button className="de-btn-primary" type="button">Guardar cambios</button>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}

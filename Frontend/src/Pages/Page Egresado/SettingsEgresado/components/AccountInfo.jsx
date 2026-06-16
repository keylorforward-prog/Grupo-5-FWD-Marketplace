
const AccountInfo = () => {
  return (
    <div id="cuenta" className="form-card">
      <div className="form-header">
        <h2 className="form-title">Información de Cuenta</h2>
        <button className="btn-primary">Guardar Cambios</button>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Nombre Completo</label>
          <input type="text" className="form-input" defaultValue="Alex Rivera" />
        </div>
        <div className="form-group">
          <label>Correo Electrónico</label>
          <input type="email" className="form-input" defaultValue="alex.rivera@fwd.dev" />
        </div>
      </div>

      <div className="form-group">
        <label>Biografía Corta</label>
        <textarea 
          className="form-textarea" 
          defaultValue="Desarrollador Junior apasionado por React y el diseño UX. Buscando mi primera oportunidad para impactar el ecosistema tech."
        ></textarea>
      </div>
    </div>
  );
};

export default AccountInfo;

import { Trash2 } from 'lucide-react';

const Security = () => {
  return (
    <div id="seguridad" className="form-card">
      <div className="form-header">
        <h2 className="form-title">Seguridad</h2>
      </div>

      <div className="security-item">
        <div className="security-text">
          <h4>Cambiar Contraseña</h4>
          <p>Actualiza tu contraseña para mantener tu cuenta segura.</p>
        </div>
        <button className="btn-outline" style={{ borderColor: 'var(--color-secondary)', color: 'var(--color-secondary)' }}>Actualizar</button>
      </div>

      <div className="security-item">
        <div className="security-text">
          <h4>Autenticación de dos factores (2FA)</h4>
          <p>Añade una capa extra de seguridad usando una app de autenticación.</p>
        </div>
        <button className="btn-outline" style={{ borderColor: 'var(--color-warning)', color: 'var(--color-warning)' }}>Configurar</button>
      </div>

      <div className="security-footer">
        <button className="btn-danger">
          <Trash2 size={16} />
          Eliminar Cuenta
        </button>
      </div>
    </div>
  );
};

export default Security;

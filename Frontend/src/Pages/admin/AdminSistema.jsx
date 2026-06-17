import { useCallback, useEffect, useState } from 'react';
import { Activity, CheckCircle, RefreshCw, XCircle } from 'lucide-react';
import { adminService } from '../../services/adminService';

const HealthCard = ({ title, item }) => (
  <div className="admin-kpi-item">
    <span>{title}</span>
    <strong style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
      {item?.ok ? <CheckCircle size={20} /> : <XCircle size={20} />}
      {item?.ok ? 'OK' : 'Falla'}
    </strong>
    <small className="admin-user-email">{item?.latencyMs ?? 0} ms {item?.message ? `· ${item.message}` : ''}</small>
  </div>
);

export default function AdminSistema() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminService.getHealthSistema();
      if (res.success) setHealth(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return (
    <div className="admin-content animate-in">
      <div className="admin-module-heading" style={{ justifyContent: 'flex-end' }}>
        <button className="admin-action-button neutral" type="button" onClick={cargar} disabled={loading}>
          <RefreshCw size={14} />
          Revisar otra vez
        </button>
      </div>

      <section className="admin-kpi-strip">
        <HealthCard title="API" item={health?.api || { ok: !loading, latencyMs: 0 }} />
        <HealthCard title="Base de datos" item={health?.database || { ok: false, latencyMs: 0 }} />
        <HealthCard title="S3" item={health?.s3 || { ok: false, latencyMs: 0 }} />
      </section>

      <section className="admin-panel">
        <div className="admin-panel-header">
          <h3><Activity size={18} /> Variables críticas</h3>
        </div>
        <div className="admin-config-list">
          {Object.entries(health?.env || {}).map(([key, value]) => (
            <div className="admin-config-row" key={key}>
              <div className="admin-config-copy">
                <span className="admin-config-label">{key}</span>
                <span className="admin-config-description">Solo se muestra si existe, nunca el valor.</span>
              </div>
              <span className={`admin-status-pill ${value ? 'success' : 'danger'}`}>{value ? 'Presente' : 'Falta'}</span>
            </div>
          ))}
          {!health && <div className="admin-empty-inline">{loading ? 'Revisando sistema...' : 'No hay datos de salud.'}</div>}
        </div>
      </section>
    </div>
  );
}

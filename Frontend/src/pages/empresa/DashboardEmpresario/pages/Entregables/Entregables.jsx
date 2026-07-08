import { useState } from 'react';
import { Package, Download, CheckCircle, RotateCcw, FileText } from 'lucide-react';
import { dashboardEmpresarioService } from '../../../../../services/dashboardEmpresarioService';
import EstadoDatos from '../../components/EstadoDatos';
import { useDashboardEmpresarioRequest } from '../../hooks/useDashboardEmpresarioRequest';
import { formatearEntregable } from '../../utils/dashboardEmpresarioFormatters';

const BADGE_CLASS = { ENVIADO: 'recepcion', APROBADO: 'finalizado', CON_CAMBIOS: 'revision' };

export default function Entregables() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actualizando, setActualizando] = useState(null);

  const cargar = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await dashboardEmpresarioService.obtenerEntregables();
      setData(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!data && loading) { cargar(); }

  const handleEstado = async (id, estado) => {
    setActualizando(id);
    try {
      await dashboardEmpresarioService.actualizarEstadoEntregable(id, estado);
      await cargar();
    } catch {
      alert('Error al actualizar el estado.');
    } finally {
      setActualizando(null);
    }
  };

  const entregables = data ? data.map(formatearEntregable) : [];
  const pendientes = entregables.filter((e) => e.status === 'ENVIADO');
  const revisados = entregables.filter((e) => e.status !== 'ENVIADO');

  return (
    <>
      <div className="de-page-heading">
        <h1>Entregables</h1>
        <span className="conteoProyectos">{entregables.length} total</span>
      </div>

      <EstadoDatos loading={loading && !data} error={error} empty={!entregables.length} emptyText="No hay entregables registrados." />

      {!loading && !error && entregables.length > 0 && (
        <>
          {pendientes.length > 0 && (
            <div className="de-section">
              <div className="de-panel-header">
                <h3 className="de-panel-title">Pendientes de revisión ({pendientes.length})</h3>
              </div>
              <div className="de-panel">
                {pendientes.map((item) => (
                  <EntregableCard key={item.id} item={item} actualizando={actualizando} onEstado={handleEstado} />
                ))}
              </div>
            </div>
          )}

          {revisados.length > 0 && (
            <div className="de-section" style={{ marginTop: '1.5rem' }}>
              <div className="de-panel-header">
                <h3 className="de-panel-title">Revisados ({revisados.length})</h3>
              </div>
              <div className="de-panel">
                {revisados.map((item) => (
                  <EntregableCard key={item.id} item={item} actualizando={actualizando} onEstado={handleEstado} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

function EntregableCard({ item, actualizando, onEstado }) {
  const esPendiente = item.status === 'ENVIADO';
  return (
    <div className={`de-deliverable-item ${actualizando === item.id ? 'de-dimmed' : ''}`}>
      <div className="de-deliverable-icon"><Package size={16} /></div>
      <div className="de-deliverable-info">
        <p className="de-deliverable-name">{item.name}</p>
        <p className="de-deliverable-meta">{item.proyecto} — {item.tipo} — {item.fecha}</p>
        {item.descripcion && <p className="de-deliverable-desc">{item.descripcion}</p>}
      </div>
      <span className={`de-badge ${BADGE_CLASS[item.status] || 'pendiente'}`}>{item.status}</span>
      <div className="de-deliverable-actions">
        {item.archivoUrl && (
          <a href={item.archivoUrl} target="_blank" rel="noopener noreferrer" className="de-btn-icon" title="Descargar archivo">
            <Download size={16} />
          </a>
        )}
        {esPendiente && (
          <>
            <button className="de-btn-icon success" type="button" onClick={() => onEstado(item.id, 'APROBADO')} disabled={actualizando === item.id} title="Aprobar">
              <CheckCircle size={16} />
            </button>
            <button className="de-btn-icon warning" type="button" onClick={() => onEstado(item.id, 'CON_CAMBIOS')} disabled={actualizando === item.id} title="Solicitar cambios">
              <RotateCcw size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

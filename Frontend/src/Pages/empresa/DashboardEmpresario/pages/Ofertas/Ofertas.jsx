import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, Eye, FileText, XCircle } from 'lucide-react';
import { dashboardEmpresarioService } from '../../../../../services/dashboardEmpresarioService';
import DashboardLayout from '../../components/DashboardLayout';
import EstadoDatos from '../../components/EstadoDatos';
import PerfilEgresadoModal from '../../components/PerfilEgresadoModal';
import { formatearOferta } from '../../utils/dashboardEmpresarioFormatters';

export default function Ofertas() {
  const [searchParams] = useSearchParams();
  const idPropuesta = searchParams.get('id_propuesta');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState(null);
  const [procesando, setProcesando] = useState(null);
  const [perfilSeleccionado, setPerfilSeleccionado] = useState(null);

  const cargarOfertas = async () => {
    setLoading(true);
    setError('');
    try {
      const params = idPropuesta ? { id_propuesta: idPropuesta } : undefined;
      const resultado = await dashboardEmpresarioService.obtenerOfertas(params);
      setData(resultado || []);
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudieron cargar las ofertas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarOfertas();
  }, [idPropuesta]);

  const ofertas = useMemo(() => data.map(formatearOferta), [data]);
  const tituloProyecto = idPropuesta ? ofertas[0]?.title : null;

  const aceptarOferta = async (offer) => {
    setProcesando({ id: offer.id, accion: 'aceptar' });
    setMensaje(null);
    try {
      const res = await dashboardEmpresarioService.aceptarOferta(offer.id);
      setMensaje({ tipo: 'success', texto: res.message || 'Oferta aceptada correctamente.' });
      await cargarOfertas();
    } catch (err) {
      setMensaje({ tipo: 'error', texto: err.response?.data?.message || 'No se pudo aceptar la oferta.' });
    } finally {
      setProcesando(null);
    }
  };

  const rechazarOferta = async (offer) => {
    setProcesando({ id: offer.id, accion: 'rechazar' });
    setMensaje(null);
    try {
      const res = await dashboardEmpresarioService.rechazarOferta(offer.id);
      setMensaje({ tipo: 'success', texto: res.message || 'Oferta rechazada correctamente.' });
      await cargarOfertas();
    } catch (err) {
      setMensaje({ tipo: 'error', texto: err.response?.data?.message || 'No se pudo rechazar la oferta.' });
    } finally {
      setProcesando(null);
    }
  };

  return (
    <DashboardLayout activePage="ofertas">
      <div className="de-page-heading">
        <h1>{tituloProyecto ? `Ofertas: ${tituloProyecto}` : 'Ofertas Recibidas'}</h1>
      </div>
      <div className="de-panel">
        {mensaje && (
          <div className={`de-form-message ${mensaje.tipo === 'success' ? 'success' : 'error'}`}>
            {mensaje.tipo === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
            {mensaje.texto}
          </div>
        )}
        <EstadoDatos loading={loading} error={error} empty={!ofertas.length} emptyText="No hay ofertas recibidas." />
        {!loading && !error && ofertas.map((offer) => (
          <div key={offer.id} className="de-offer-item">
            <div className="de-offer-icon-wrap"><FileText size={16} /></div>
            <div className="de-offer-info">
              <p className="de-offer-title">{offer.title}</p>
              <p className="de-offer-sender">{offer.sender}{offer.email ? ` · ${offer.email}` : ''}</p>
              <p className="de-offer-sender">{offer.description}</p>
            </div>
            <div className="de-offer-right">
              <span className="de-badge nueva">{offer.status}</span>
              <strong>₡{offer.amount.toLocaleString('es-CR')}</strong>
              <span className="de-offer-time">{offer.time}</span>
              {offer.candidate && (
                <button className="de-panel-action" type="button" onClick={() => setPerfilSeleccionado(offer.candidate)}>
                  <Eye size={15} />
                  Ver perfil
                </button>
              )}
              {offer.pending && (
                <div className="de-offer-actions">
                  <button
                    className="de-panel-action"
                    type="button"
                    onClick={() => aceptarOferta(offer)}
                    disabled={procesando?.id === offer.id}
                  >
                    <CheckCircle2 size={15} />
                    {procesando?.id === offer.id && procesando.accion === 'aceptar' ? 'Aceptando...' : 'Aceptar'}
                  </button>
                  <button
                    className="de-btn-outline de-offer-reject"
                    type="button"
                    onClick={() => rechazarOferta(offer)}
                    disabled={procesando?.id === offer.id}
                  >
                    <XCircle size={15} />
                    {procesando?.id === offer.id && procesando.accion === 'rechazar' ? 'Rechazando...' : 'Rechazar'}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <PerfilEgresadoModal perfil={perfilSeleccionado} onClose={() => setPerfilSeleccionado(null)} />
    </DashboardLayout>
  );
}

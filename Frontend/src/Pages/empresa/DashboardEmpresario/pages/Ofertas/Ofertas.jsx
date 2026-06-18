import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, CheckCircle2, Eye, FileText, XCircle } from 'lucide-react';
import { dashboardEmpresarioService } from '../../../../../services/dashboardEmpresarioService';
import DashboardLayout from '../../components/DashboardLayout';
import EstadoDatos from '../../components/EstadoDatos';
import PerfilEgresadoModal from '../../components/PerfilEgresadoModal';
import { formatearOferta } from '../../utils/dashboardEmpresarioFormatters';

export default function Ofertas() {
  const [searchParams, setSearchParams] = useSearchParams();
  const idPropuesta = searchParams.get('id_propuesta');
  const [data, setData] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [loadingProyectos, setLoadingProyectos] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState(null);
  const [procesando, setProcesando] = useState(null);
  const [perfilSeleccionado, setPerfilSeleccionado] = useState(null);

  const cargarProyectos = async () => {
    setLoadingProyectos(true);
    try {
      const resultado = await dashboardEmpresarioService.obtenerPropuestas({ limit: 100 });
      setProyectos(resultado || []);
    } catch (err) {
      setProyectos([]);
    } finally {
      setLoadingProyectos(false);
    }
  };

  const cargarOfertas = async () => {
    if (!idPropuesta) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const resultado = await dashboardEmpresarioService.obtenerOfertas({ id_propuesta: idPropuesta });
      setData(resultado || []);
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudieron cargar las ofertas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarProyectos();
  }, []);

  useEffect(() => {
    cargarOfertas();
  }, [idPropuesta]);

  const ofertas = useMemo(() => data.map(formatearOferta), [data]);
  const proyectoSeleccionado = useMemo(
    () => proyectos.find((proyecto) => String(proyecto.id_propuesta) === String(idPropuesta)),
    [proyectos, idPropuesta]
  );
  const tituloProyecto = proyectoSeleccionado?.titulo || (idPropuesta ? ofertas[0]?.title : null);

  const cambiarProyecto = (evento) => {
    const nuevoId = evento.target.value;
    setMensaje(null);
    if (nuevoId) {
      setSearchParams({ id_propuesta: nuevoId });
    }
  };

  const abrirProyecto = (id) => {
    setMensaje(null);
    setSearchParams({ id_propuesta: String(id) });
  };

  const volverAProyectos = () => {
    setMensaje(null);
    setSearchParams({});
  };

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
        {idPropuesta && (
          <div className="de-offers-heading-actions">
            <button className="de-panel-action" type="button" onClick={volverAProyectos}>
              <ArrowLeft size={15} />
              Proyectos
            </button>
            <label className="de-offers-project-filter">
              <span>Proyecto</span>
              <select className="de-form-control" value={idPropuesta || ''} onChange={cambiarProyecto} disabled={loadingProyectos || !proyectos.length}>
                <option value="">Selecciona un proyecto</option>
                {proyectos.map((proyecto) => (
                  <option key={proyecto.id_propuesta} value={proyecto.id_propuesta}>
                    {proyecto.titulo}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}
      </div>
      <div className="de-panel">
        {!idPropuesta ? (
          <>
            <EstadoDatos loading={loadingProyectos} error="" empty={!proyectos.length} emptyText="Todavia no has publicado proyectos." />
            {!loadingProyectos && proyectos.length > 0 && (
              <div className="de-offers-project-list">
                {proyectos.map((proyecto) => {
                  const totalOfertas = proyecto.ofertas?.length ?? 0;
                  return (
                    <article key={proyecto.id_propuesta} className="de-offers-project-card">
                      <div className="de-offers-project-icon"><FileText size={18} /></div>
                      <div className="de-offers-project-info">
                        <h2>{proyecto.titulo}</h2>
                        <p>{proyecto.descripcion || 'Sin descripcion registrada.'}</p>
                        <span>{totalOfertas} ofertas recibidas</span>
                      </div>
                      <button className="de-panel-action" type="button" onClick={() => abrirProyecto(proyecto.id_propuesta)}>
                        <Eye size={15} />
                        Ver ofertas
                      </button>
                    </article>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <>
            {mensaje && (
              <div className={`de-form-message ${mensaje.tipo === 'success' ? 'success' : 'error'}`}>
                {mensaje.tipo === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
                {mensaje.texto}
              </div>
            )}
            <EstadoDatos loading={loading} error={error} empty={!ofertas.length} emptyText="No hay ofertas recibidas para este proyecto." />
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
          </>
        )}
      </div>
      <PerfilEgresadoModal perfil={perfilSeleccionado} onClose={() => setPerfilSeleccionado(null)} />
    </DashboardLayout>
  );
}

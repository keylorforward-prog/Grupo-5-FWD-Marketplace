import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, MoreVertical } from 'lucide-react';
import { egresadoDashboardService } from '../../../../services/egresadoDashboardService';
import { formatearPostulacion } from '../../DashboardEgresado/utils/dashboardEgresadoFormatters';

const filtros = [
  { valor: 'todas', etiqueta: 'Todas' },
  { valor: 'nueva', etiqueta: 'Enviadas' },
  { valor: 'revision', etiqueta: 'En revisión' },
  { valor: 'recepcion', etiqueta: 'Preseleccionadas' },
  { valor: 'rechazado', etiqueta: 'Rechazadas' },
];

const coloresAvatar = [
  { fondo: '#e0f2fe', texto: '#0284c7' },
  { fondo: '#f3e8ff', texto: '#7e22ce' },
  { fondo: '#f1f5f9', texto: '#475569' },
  { fondo: '#ffedd5', texto: '#c2410c' },
  { fondo: '#cffafe', texto: '#0e7490' },
];

const inferirIniciales = (texto) =>
  (texto || '??').split(' ').map((p) => p[0]).join('').toUpperCase().slice(0, 2);

function TarjetaPostulaciones() {
  const navigate = useNavigate();
  const [postulaciones, setPostulaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtroActivo, setFiltroActivo] = useState('todas');
  const [verTodas, setVerTodas] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(null);

  useEffect(() => {
    let activo = true;
    egresadoDashboardService.obtenerPostulaciones({ limit: 10 })
      .then((data) => {
        if (!activo) return;
        const normalizadas = (data || []).map(formatearPostulacion).map((p, i) => {
          const c = coloresAvatar[i % coloresAvatar.length];
          return {
            ...p,
            rol: p.titulo,
            empresa: p.empresa || 'Empresa',
            tiempo: p.fecha,
            iniciales: inferirIniciales(p.empresa),
            colorFondo: c.fondo,
            colorTexto: c.texto,
          };
        });
        setPostulaciones(normalizadas);
      })
      .catch(() => { if (activo) setPostulaciones([]); })
      .finally(() => { if (activo) setCargando(false); });
    return () => { activo = false; };
  }, []);

  const listaFiltrada = postulaciones.filter((p) =>
    filtroActivo === 'todas' ? true : p.tipoEstado === filtroActivo
  );

  const lista = verTodas ? listaFiltrada : listaFiltrada.slice(0, 3);

  const totalActivas = postulaciones.filter((p) =>
    ['nueva', 'revision', 'recepcion'].includes(p.tipoEstado)
  ).length;

  return (
    <div className="tarjetaPostulaciones">
      <div className="encabezadoPostulaciones">
        <div className="tituloIconoPostulaciones">
          <div className="iconoDocumento">
            <FileText size={20} />
          </div>
          <h3 className="tituloTarjetaSeccion">Mis Postulaciones a Prácticas</h3>
        </div>
        <span className="conteoPostulaciones">{totalActivas} Activas</span>
      </div>

      <div className="filtrosPostulaciones">
        {filtros.map((f) => (
          <button
            key={f.valor}
            type="button"
            className={`chipFiltroPostulacion ${filtroActivo === f.valor ? 'activo' : ''}`}
            onClick={() => setFiltroActivo(f.valor)}
          >
            {f.etiqueta}
          </button>
        ))}
      </div>

      <div className="listaPostulaciones">
        {cargando ? (
          <div className="vacioPostulaciones">Cargando postulaciones...</div>
        ) : lista.length === 0 ? (
          <div className="vacioPostulaciones">
            Sin postulaciones en este estado.
          </div>
        ) : (
          lista.map((postulacion) => (
            <div key={postulacion.id} className="itemPostulacion">
              <div className="infoPrimariaPostulacion">
                <div
                  className="avatarEmpresa"
                  style={{
                    backgroundColor: postulacion.colorFondo,
                    color: postulacion.colorTexto,
                  }}
                >
                  {postulacion.iniciales}
                </div>
                <div className="detallesRol">
                  <h4 className="nombreRol">{postulacion.rol}</h4>
                  <p className="empresaTiempo">
                    {postulacion.empresa} • {postulacion.tiempo}
                  </p>
                </div>
              </div>

              <div className="estadoPostulacion">
                <span className={`etiquetaEstadoPostulacion ${postulacion.tipoEstado}`}>
                  {postulacion.estado}
                </span>
                <div className="menuPostulacionContenedor">
                  <button
                    type="button"
                    className="botonOpciones"
                    onClick={() =>
                      setMenuAbierto(menuAbierto === postulacion.id ? null : postulacion.id)
                    }
                    aria-label="Más opciones"
                  >
                    <MoreVertical size={20} />
                  </button>
                  {menuAbierto === postulacion.id && (
                    <div className="menuPostulacion" onMouseLeave={() => setMenuAbierto(null)}>
                      <button type="button" onClick={() => {
                        setMenuAbierto(null);
                        navigate(`/egresado/dashboard/proyecto/${postulacion.idPropuesta}`);
                      }}>Ver detalle</button>
                      <button type="button" onClick={() => {
                        setMenuAbierto(null);
                        navigate(`/egresado/dashboard/mensajes?postulacion=${postulacion.id}`);
                      }}>Contactar empresa</button>
                      <button type="button" className="peligro">Retirar postulación</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {listaFiltrada.length > 3 && (
        <div className="piePostulaciones">
          <button
            type="button"
            className="botonVerHistorial"
            onClick={() => setVerTodas((v) => !v)}
          >
            {verTodas ? 'Ver menos' : 'Ver todo el historial de postulaciones'}
          </button>
        </div>
      )}
    </div>
  );
}

export default TarjetaPostulaciones;

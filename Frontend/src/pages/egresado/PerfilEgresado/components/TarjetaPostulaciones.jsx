import { useEffect, useState } from 'react';
import { FileText, MoreVertical } from 'lucide-react';
import { egresadoDashboardService } from '../../../../services/egresadoDashboardService';
import { formatearPostulacion } from '../../DashboardEgresado/utils/dashboardEgresadoFormatters';

const filtros = [
  { valor: 'todas', etiqueta: 'Todas' },
  { valor: 'aceptada', etiqueta: 'Aceptadas' },
  { valor: 'vista', etiqueta: 'Vistas' },
  { valor: 'enviada', etiqueta: 'Enviadas' },
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
            iniciales: inferirIniciales(p.titulo),
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

  return (
    <div className="tarjetaPostulaciones">
      <div className="encabezadoPostulaciones">
        <div className="tituloIconoPostulaciones">
          <div className="iconoDocumento">
            <FileText size={20} />
          </div>
          <h3 className="tituloTarjetaSeccion">Mis Postulaciones a Prácticas</h3>
        </div>
        <span className="conteoPostulaciones">{listaFiltrada.length} Activas</span>
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
                      <button type="button">Ver detalle</button>
                      <button type="button">Contactar empresa</button>
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

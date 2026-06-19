import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { FileText, MoreVertical } from 'lucide-react';
import { egresadoDashboardService } from '../../../../services/egresadoDashboardService';
import { formatearPostulacion } from '../../DashboardEgresado/utils/dashboardEgresadoFormatters';

const filtros = [
  { valor: 'todas', key: 'filtroTodas' },
  { valor: 'nueva', key: 'filtroEnviadas' },
  { valor: 'revision', key: 'filtroRevision' },
  { valor: 'recepcion', key: 'filtroPreseleccionadas' },
  { valor: 'rechazado', key: 'filtroRechazadas' },
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
  const { t } = useTranslation();
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
          <h3 className="tituloTarjetaSeccion">{t('egresadoPerfil.applications.titulo')}</h3>
        </div>
        <span className="conteoPostulaciones">{totalActivas} {t('egresadoPerfil.applications.activas')}</span>
      </div>

      <div className="filtrosPostulaciones">
        {filtros.map((f) => (
          <button
            key={f.valor}
            type="button"
            className={`chipFiltroPostulacion ${filtroActivo === f.valor ? 'activo' : ''}`}
            onClick={() => setFiltroActivo(f.valor)}
          >
            {t(`egresadoPerfil.applications.${f.key}`)}
          </button>
        ))}
      </div>

      <div className="listaPostulaciones">
        {cargando ? (
          <div className="vacioPostulaciones">{t('egresadoPerfil.applications.loading')}</div>
        ) : lista.length === 0 ? (
          <div className="vacioPostulaciones">
            {t('egresadoPerfil.applications.empty')}
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
                    aria-label={t('egresadoPerfil.applications.masOpciones')}
                  >
                    <MoreVertical size={20} />
                  </button>
                  {menuAbierto === postulacion.id && (
                    <div className="menuPostulacion" onMouseLeave={() => setMenuAbierto(null)}>
                      <button type="button" onClick={() => {
                        setMenuAbierto(null);
                        navigate(`/egresado/dashboard/proyecto/${postulacion.idPropuesta}`);
                      }}>{t('egresadoPerfil.applications.verDetalle')}</button>
                      <button type="button" onClick={() => {
                        setMenuAbierto(null);
                        navigate(`/egresado/dashboard/mensajes?postulacion=${postulacion.id}`);
                      }}>{t('egresadoPerfil.applications.contactarEmpresa')}</button>
                      <button type="button" className="peligro">{t('egresadoPerfil.applications.retirar')}</button>
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
            {verTodas ? t('egresadoPerfil.applications.verMenos') : t('egresadoPerfil.applications.verHistorial')}
          </button>
        </div>
      )}
    </div>
  );
}

export default TarjetaPostulaciones;

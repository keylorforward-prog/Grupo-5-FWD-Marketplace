import { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Bell, CheckCheck, Mail, MessageSquare,
  FolderOpen, Info, ExternalLink, CheckCircle2,
} from 'lucide-react';
import { egresadoDashboardService } from '../../../../../services/egresadoDashboardService';
import { useDashboardEgresadoRequest } from '../../hooks/useDashboardEgresadoRequest';
import { formatearNotificacion } from '../../utils/dashboardEgresadoFormatters';

const TIPO_CONFIG = {
  postulacion: { icon: Mail, labelKey: 'tipoPostulacion', color: '#2563eb', bg: '#eff6ff' },
  proyecto: { icon: FolderOpen, labelKey: 'tipoProyecto', color: '#7c3aed', bg: '#f5f3ff' },
  mensaje: { icon: MessageSquare, labelKey: 'tipoMensaje', color: '#059669', bg: '#ecfdf5' },
  sistema: { icon: Info, labelKey: 'tipoSistema', color: '#d97706', bg: '#fffbeb' },
  oferta: { icon: ExternalLink, labelKey: 'tipoOferta', color: '#0891b2', bg: '#ecfeff' },
};

const agruparPorFecha = (notificaciones) => {
  const grupos = { hoy: [], ayer: [], semana: [], anterior: [] };
  const ahora = new Date();
  const hoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
  const ayer = new Date(hoy.getTime() - 86400000);
  const semana = new Date(hoy.getTime() - 6 * 86400000);

  for (const n of notificaciones) {
    const d = new Date(n.fecha);
    const fecha = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    if (fecha.getTime() === hoy.getTime()) grupos.hoy.push(n);
    else if (fecha.getTime() === ayer.getTime()) grupos.ayer.push(n);
    else if (fecha >= semana) grupos.semana.push(n);
    else grupos.anterior.push(n);
  }

  return Object.entries(grupos).filter(([, items]) => items.length > 0);
};

const ETIQUETAS_GRUPO = {
  hoy: 'egresadoNotificaciones.grupoHoy',
  ayer: 'egresadoNotificaciones.grupoAyer',
  semana: 'egresadoNotificaciones.grupoSemana',
  anterior: 'egresadoNotificaciones.grupoAnterior',
};

export default function Notificaciones() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [animando, setAnimando] = useState(null);

  const { data, loading, error, refetch } = useDashboardEgresadoRequest(
    () => egresadoDashboardService.obtenerNotificaciones(),
    [],
    []
  );

  const notificaciones = useMemo(() => (data || []).map(formatearNotificacion), [data]);

  const sinLeer = useMemo(() => notificaciones.filter((n) => !n.leido).length, [notificaciones]);

  const grupos = useMemo(() => agruparPorFecha(notificaciones), [notificaciones]);

  const marcarLeida = useCallback(async (id) => {
    setAnimando(id);
    await egresadoDashboardService.marcarNotificacionLeida(id);
    setTimeout(() => setAnimando(null), 400);
    refetch();
  }, [refetch]);

  const marcarTodas = useCallback(async () => {
    await egresadoDashboardService.marcarTodasNotificacionesLeidas();
    refetch();
  }, [refetch]);

  return (
    <div className="fwd-animar-entrada">
      <div className="de-page-heading">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button className="de-project-icon-button" type="button" onClick={() => navigate('/egresado/dashboard')}>
            <ArrowLeft size={18} />
          </button>
          <h1>{t('egresadoNotificaciones.titulo')}</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {!loading && !error && sinLeer > 0 && (
            <span className="notif-sinLeer">{sinLeer} {t('egresadoNotificaciones.sinLeer')}</span>
          )}
          {!loading && !error && sinLeer > 0 && (
            <button className="notif-marcarTodas" type="button" onClick={marcarTodas}>
              <CheckCheck size={15} />
              {t('egresadoNotificaciones.marcarTodasLeidas')}
            </button>
          )}
        </div>
      </div>

      {loading && (
        <div className="notif-loading">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="notif-skeleton" />
          ))}
        </div>
      )}

      {error && <p className="de-data-state error">{error}</p>}

      {!loading && notificaciones.length === 0 && (
        <div className="estadoVacio" style={{ padding: '3rem', textAlign: 'center' }}>
          <Bell size={48} />
          <h4>{t('egresadoNotificaciones.empty')}</h4>
          <p>{t('egresadoNotificaciones.emptyDesc')}</p>
        </div>
      )}

      {!loading && !error && notificaciones.length > 0 && (
        <div className="notif-lista">
          {grupos.map(([key, items]) => (
            <div key={key} className="notif-grupo">
              <div className="notif-grupo-header">
                <span className="notif-grupo-label">{t(ETIQUETAS_GRUPO[key])}</span>
                <span className="notif-grupo-count">{items.length}</span>
              </div>
              {items.map((n) => {
                const tipoCfg = TIPO_CONFIG[n.tipo] || TIPO_CONFIG.sistema;
                const TipoIcon = tipoCfg.icon;
                const animClass = animando === n.id ? 'notif-card-animando' : '';
                return (
                  <div
                    key={n.id}
                    className={`notif-card ${n.leido ? 'notif-card-leida' : 'notif-card-noleida'} ${animClass}`}
                    onClick={() => !n.leido && marcarLeida(n.id)}
                  >
                    <div className="notif-card-icono" style={{ backgroundColor: tipoCfg.bg, color: tipoCfg.color }}>
                      <TipoIcon size={16} />
                    </div>
                    <div className="notif-card-body">
                      <div className="notif-card-header">
                        <span className="notif-card-tipo" style={{ color: tipoCfg.color }}>{t(`egresadoNotificaciones.${tipoCfg.labelKey}`)}</span>
                        <span className="notif-card-tiempo">{n.tiempo}</span>
                      </div>
                      <p className="notif-card-texto">{n.texto}</p>
                    </div>
                    <div className="notif-card-actions">
                      {!n.leido && (
                        <button
                          className="notif-card-leer-btn"
                          type="button"
                          onClick={(e) => { e.stopPropagation(); marcarLeida(n.id); }}
                          title={t('egresadoNotificaciones.marcarLeida')}
                        >
                          <CheckCircle2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

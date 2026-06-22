import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronUp, ExternalLink, FolderOpen, GitFork, Package, SearchX } from 'lucide-react';
import { egresadoDashboardService } from '../../../../../services/egresadoDashboardService';
import { useDashboardEgresadoRequest } from '../../hooks/useDashboardEgresadoRequest';
import { formatearProyecto } from '../../utils/dashboardEgresadoFormatters';

const AVATAR_DEFECTO = '/Imgs/Logotipo/Digital/Sintesis/FWD - Sintesis-01.png';

const BADGE_ESTADOS = {
  'EN_PROGRESO': 'desarrollo',
  'EN_REVISION': 'revision',
  'COMPLETADO': 'finalizado',
  'CANCELADO': 'revision',
  'ABIERTO': 'recepcion',
};

export default function MisProyectos() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data, loading, error } = useDashboardEgresadoRequest(
    () => egresadoDashboardService.obtenerProyectos(),
    [],
    []
  );

  const [detalleId, setDetalleId] = useState(null);
  const [entregablesId, setEntregablesId] = useState(null);

  const proyectos = useMemo(() => (data || []).map(formatearProyecto), [data]);

  const toggleDetalle = (id) => {
    setDetalleId((prev) => (prev === id ? null : id));
    setEntregablesId(null);
  };

  const toggleEntregables = (id) => {
    setEntregablesId((prev) => (prev === id ? null : id));
  };

  return (
    <>
      <div className="de-page-heading">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button className="de-project-icon-button" type="button" onClick={() => navigate('/egresado/dashboard')}>
            <ArrowLeft size={18} />
          </button>
          <h1>{t('egresadoProyectos.titulo')}</h1>
        </div>
        <span className="conteoProyectos">{t('egresadoProyectos.total', { count: proyectos.length })}</span>
      </div>

      {loading && <p className="de-data-state">{t('egresadoProyectos.loading')}</p>}
      {error && <p className="de-data-state error">{error}</p>}

      {!loading && !error && proyectos.length === 0 && (
        <div className="estadoVacio" style={{ padding: '3rem', textAlign: 'center' }}>
          <SearchX size={48} />
          <h4>{t('egresadoProyectos.empty')}</h4>
          <p>{t('egresadoProyectos.emptyDesc')}</p>
        </div>
      )}

      {!loading && !error && proyectos.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {proyectos.map((p) => {
            const expandido = detalleId === p.id;
            const verEntregables = entregablesId === p.id;

            return (
              <div key={p.id} className="de-panel" style={{ cursor: 'default' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div className="de-offer-icon-wrap"><FolderOpen size={20} /></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                      <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>{p.titulo}</h3>
                      <span className={`de-badge ${p.tipoEstado}`}>{p.estado}</span>
                      {p.github_url && (
                        <a
                          href={p.github_url.startsWith('http') ? p.github_url : `https://${p.github_url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                            fontSize: '0.72rem', fontWeight: 600, color: '#24292e',
                            textDecoration: 'none', padding: '0.2rem 0.55rem',
                            borderRadius: '9999px', background: '#f3f4f6',
                            border: '1px solid #d1d5db', whiteSpace: 'nowrap',
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <GitFork size={12} /> {t('egresadoProyectos.repo')} <ExternalLink size={10} />
                        </a>
                      )}
                    </div>
                    <p style={{ margin: '0.25rem 0', fontSize: '0.85rem', color: 'var(--ink-muted)', lineHeight: 1.5 }}>
                      {p.descripcion}
                    </p>

                    <div style={{
                      display: 'flex', gap: '1.5rem', marginTop: '0.5rem',
                      fontSize: '0.78rem', color: 'var(--ink-subtle)', flexWrap: 'wrap',
                    }}>
                      <span><Package size={12} style={{ marginRight: '0.25rem' }} /> {t('egresadoProyectos.entregables')}: {p.entregablesAprobados}/{p.entregablesCount}</span>
                      {p.empresa && <span>{t('egresadoProyectos.empresa')}: {p.empresa}</span>}
                      <span>{t('egresadoProyectos.inicio')}: {p.fechaInicio}</span>
                      <span>{t('egresadoProyectos.fin')}: {p.fechaFin}</span>
                    </div>

                    {expandido && (
                      <div className="de-project-detail" style={{ marginTop: '1rem' }}>
                        <div className="de-detail-grid">
                          {p.tecnologias.length > 0 && (
                            <div className="de-detail-section">
                              <strong>{t('egresadoProyectos.tecnologias')}</strong>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.25rem' }}>
                                {p.tecnologias.map((t, i) => (
                                  <span key={t} className="de-chip">{t}</span>
                                ))}
                              </div>
                            </div>
                          )}
                          {(p.presupuestoMin || p.presupuestoMax) && (
                            <div className="de-detail-row">
                              {p.presupuestoMin && <span><strong>{t('egresadoProyectos.presupuestoMin')}:</strong> ₡{Number(p.presupuestoMin).toLocaleString()}</span>}
                              {p.presupuestoMax && <span><strong>{t('egresadoProyectos.presupuestoMax')}:</strong> ₡{Number(p.presupuestoMax).toLocaleString()}</span>}
                            </div>
                          )}
                          <div className="de-detail-row">
                            <span><strong>{t('egresadoProyectos.modalidad')}:</strong> {p.modalidad}</span>
                            <span><strong>{t('egresadoProyectos.estado')}:</strong> <span className={`de-badge ${BADGE_ESTADOS[p.estadoRaw] || 'recepcion'}`}>{p.estado}</span></span>
                          </div>
                          <div className="de-detail-row">
                            <span><strong>{t('egresadoProyectos.inicio')}:</strong> {p.fechaInicio}</span>
                            <span><strong>{t('egresadoProyectos.finEstimado')}:</strong> {p.fechaFin}</span>
                          </div>

                          <div style={{ marginTop: '0.5rem' }}>
                            <button
                              className="de-project-btn"
                              type="button"
                              onClick={() => toggleEntregables(p.id)}
                              style={{ fontSize: '0.72rem' }}
                            >
                              <Package size={12} /> {verEntregables ? t('egresadoProyectos.ocultarEntregables') : t('egresadoProyectos.verEntregables')} ({p.entregablesCount})
                            </button>
                          </div>

                          {verEntregables && (
                            <div style={{ marginTop: '0.5rem', borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
                              <strong style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                                {t('egresadoProyectos.historialEntregables')}
                              </strong>
                              {p.entregables.length === 0 ? (
                                <p style={{ fontSize: '0.82rem', color: 'var(--ink-subtle)', marginTop: '0.25rem' }}>{t('egresadoProyectos.sinEntregables')}</p>
                              ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.4rem' }}>
                                  {p.entregables.map((e) => (
                                    <div key={e.id} style={{
                                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                      padding: '0.4rem 0.6rem', borderRadius: '8px',
                                      background: 'var(--surface-sunken)', fontSize: '0.8rem',
                                    }}>
                                      <span style={{ fontWeight: 500 }}>{e.titulo}</span>
                                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                        <span style={{ color: 'var(--ink-subtle)' }}>{e.tipo} — {e.fecha}</span>
                                        <span className={`de-badge ${e.estado === 'APROBADO' ? 'finalizado' : e.estado === 'CON_CAMBIOS' ? 'revision' : 'recepcion'}`}>
                                          {e.estado}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <button
                    className="de-project-icon-button"
                    type="button"
                    onClick={() => toggleDetalle(p.id)}
                    aria-label={expandido ? t('egresadoProyectos.cerrarDetalles') : t('egresadoProyectos.verDetalles')}
                    style={{ flexShrink: 0 }}
                  >
                    {expandido ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

import { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ExternalLink, GitBranch, BookOpen, Calendar, User, Link as LinkIcon,
  Code, SearchX, Layers, Plus, Pencil, Trash2, Check, X, AlertTriangle
} from 'lucide-react';
import { egresadoDashboardService } from '../../../../../services/egresadoDashboardService';
import { useDashboardEgresadoRequest } from '../../hooks/useDashboardEgresadoRequest';
import { formatearHistorial } from '../../utils/dashboardEgresadoFormatters';

const TIPO_CONFIG = {
  GITHUB: { icon: GitBranch, labelKey: 'github', color: '#0969da', bg: '#e8f0fe' },
  PLATAFORMA: { icon: BookOpen, labelKey: 'plataforma', color: '#7c3aed', bg: '#f3e8ff' },
};

const VACIO = () => ({
  titulo_proyecto: '', tipo: 'GITHUB', descripcion: '', enlace: '',
  tecnologias: '', rol_desempenado: '', fecha_inicio: '', fecha_fin: '',
});

export default function Historial() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data, loading, error, refetch } = useDashboardEgresadoRequest(
    () => egresadoDashboardService.obtenerHistorial(),
    [],
    []
  );

  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [confirmId, setConfirmId] = useState(null);

  const historiales = useMemo(() => (data || []).map(formatearHistorial), [data]);

  const stats = useMemo(() => {
    const total = historiales.length;
    const github = historiales.filter((h) => h.tipo === 'GITHUB').length;
    const plataforma = historiales.filter((h) => h.tipo === 'PLATAFORMA').length;
    return { total, github, plataforma };
  }, [historiales]);

  const iniciarEdit = (item) => {
    if (item) {
      setEditId(item.id_historial_estudiante);
      setForm({
        titulo_proyecto: item.titulo_proyecto || '',
        tipo: item.tipo || 'GITHUB',
        descripcion: item.descripcion || '',
        enlace: item.enlace || '',
        tecnologias: item.tecnologias || '',
        rol_desempenado: item.rol_desempenado || '',
        fecha_inicio: item.fecha_inicio ? item.fecha_inicio.slice(0, 10) : '',
        fecha_fin: item.fecha_fin ? item.fecha_fin.slice(0, 10) : '',
      });
    } else {
      setEditId('nuevo');
      setForm(VACIO());
    }
  };

  const cancelarEdit = () => { setEditId(null); setForm(null); };

  const cambiarCampo = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const guardar = async () => {
    if (!form?.titulo_proyecto?.trim()) return;
    setGuardando(true);
    try {
      if (editId === 'nuevo') {
        await egresadoDashboardService.crearHistorialProyecto(form);
      } else {
        await egresadoDashboardService.actualizarHistorialProyecto(editId, form);
      }
      refetch();
      cancelarEdit();
    } catch {
    } finally {
      setGuardando(false);
    }
  };

  const eliminar = async (id) => {
    setGuardando(true);
    try {
      await egresadoDashboardService.eliminarHistorialProyecto(id);
      refetch();
      setConfirmId(null);
    } catch {
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="fwd-animar-entrada">
      <div className="de-page-heading">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button className="de-project-icon-button" type="button" onClick={() => navigate('/egresado/dashboard')}>
            <ArrowLeft size={18} />
          </button>
          <h1>{t('egresadoHistorial.titulo')}</h1>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {!loading && !error && <span className="conteoProyectos">{t('egresadoHistorial.total', { count: historiales.length })}</span>}
          <button className="de-btn-primary" type="button" onClick={() => iniciarEdit(null)} disabled={guardando}>
            <Plus size={15} /> {t('egresadoHistorial.agregar')}
          </button>
        </div>
      </div>

      {!loading && !error && historiales.length > 0 && (
        <div className="historial-stats">
          <div className="historial-stat-card" data-type="total">
            <Layers size={22} />
            <div>
              <span className="historial-stat-value">{stats.total}</span>
              <span className="historial-stat-label">{t('egresadoHistorial.totalProyectos')}</span>
            </div>
          </div>
          <div className="historial-stat-card" data-type="github">
            <GitBranch size={22} />
            <div>
              <span className="historial-stat-value">{stats.github}</span>
              <span className="historial-stat-label">{t('egresadoHistorial.github')}</span>
            </div>
          </div>
          <div className="historial-stat-card" data-type="plataforma">
            <BookOpen size={22} />
            <div>
              <span className="historial-stat-value">{stats.plataforma}</span>
              <span className="historial-stat-label">{t('egresadoHistorial.plataforma')}</span>
            </div>
          </div>
        </div>
      )}

      {/* Formulario nuevo/edicion */}
      {editId && form && (
        <div className="historial-form-wrap">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
            <input className="de-form-control" name="titulo_proyecto" value={form.titulo_proyecto} onChange={cambiarCampo}
              placeholder={t('egresadoHistorial.form.titulo')} autoFocus />
            <select className="de-form-control" name="tipo" value={form.tipo} onChange={cambiarCampo}>
              <option value="GITHUB">GitHub</option>
              <option value="PLATAFORMA">Plataforma</option>
            </select>
            <input className="de-form-control" name="rol_desempenado" value={form.rol_desempenado} onChange={cambiarCampo}
              placeholder={t('egresadoHistorial.form.rol')} />
            <input className="de-form-control" name="tecnologias" value={form.tecnologias} onChange={cambiarCampo}
              placeholder={t('egresadoHistorial.form.tech')} />
            <input className="de-form-control" name="enlace" value={form.enlace} onChange={cambiarCampo}
              placeholder={t('egresadoHistorial.form.url')} />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input className="de-form-control" name="fecha_inicio" value={form.fecha_inicio} onChange={cambiarCampo} type="date" placeholder="Inicio" />
              <input className="de-form-control" name="fecha_fin" value={form.fecha_fin} onChange={cambiarCampo} type="date" placeholder="Fin" />
            </div>
            <textarea className="de-form-control de-form-textarea" name="descripcion" value={form.descripcion} onChange={cambiarCampo}
              placeholder={t('egresadoHistorial.form.descripcion')} rows={2} style={{ gridColumn: '1 / -1' }} />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
            <button className="de-btn-primary" type="button" onClick={guardar} disabled={guardando || !form.titulo_proyecto?.trim()}>
              <Check size={14} /> {guardando ? t('egresadoHistorial.form.guardando') : t('egresadoHistorial.form.guardar')}
            </button>
            <button className="de-btn-outline" type="button" onClick={cancelarEdit} disabled={guardando}>
              <X size={14} /> {t('egresadoHistorial.form.cancelar')}
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div className="historial-loading">
          {[1, 2, 3].map((i) => (
            <div key={i} className="historial-skeleton" />
          ))}
        </div>
      )}

      {error && <p className="de-data-state error">{error}</p>}

      {!loading && !error && historiales.length === 0 && (
        <div className="estadoVacio" style={{ padding: '3rem', textAlign: 'center' }}>
          <SearchX size={48} />
          <h4>{t('egresadoHistorial.empty')}</h4>
          <p>{t('egresadoHistorial.emptyDesc')}</p>
        </div>
      )}

      {!loading && !error && historiales.length > 0 && (
        <div className="historial-timeline">
          {historiales.map((h, idx) => {
            const tipoCfg = TIPO_CONFIG[h.tipo] || TIPO_CONFIG.PLATAFORMA;
            const TipoIcon = tipoCfg.icon;
            const raw = (data || [])[idx];
            const enEdicion = editId === raw?.id_historial_estudiante;

            if (enEdicion) return null;

            return (
              <div key={h.id} className="historial-card" style={{ '--accent-color': tipoCfg.color, '--accent-bg': tipoCfg.bg }}>
                <div className="historial-card-dot" style={{ backgroundColor: tipoCfg.color }}>
                  <TipoIcon size={14} color="#fff" />
                </div>
                <div className="historial-card-body">
                  <div className="historial-card-header">
                    <h3 className="historial-card-title">{h.titulo}</h3>
                    <span className="historial-card-badge" style={{ backgroundColor: tipoCfg.bg, color: tipoCfg.color }}>
                      <TipoIcon size={12} />
                      {t(`egresadoHistorial.${tipoCfg.labelKey}`)}
                    </span>
                  </div>

                  {h.descripcion && <p className="historial-card-desc">{h.descripcion}</p>}

                  <div className="historial-card-meta">
                    {h.rol && (
                      <span className="historial-card-meta-item">
                        <User size={13} />
                        {h.rol}
                      </span>
                    )}
                    <span className="historial-card-meta-item">
                      <Calendar size={13} />
                      {h.fechaInicio} → {h.fechaFin}
                    </span>
                  </div>

                  {h.tecnologias.length > 0 && (
                    <div className="historial-card-techs">
                      <Code size={13} />
                      {h.tecnologias.map((tech) => (
                        <span key={tech} className="historial-tech-tag">{tech}</span>
                      ))}
                    </div>
                  )}

                  {h.enlace && (
                    <a href={h.enlace} target="_blank" rel="noopener noreferrer" className="historial-card-link">
                      <LinkIcon size={13} />
                      {t('egresadoHistorial.verRepositorio')} <ExternalLink size={12} />
                    </a>
                  )}
                </div>
                <div className="historial-card-actions">
                  <button className="de-project-icon-button" type="button" onClick={() => iniciarEdit(raw)} disabled={guardando}>
                    <Pencil size={13} />
                  </button>
                  {confirmId === raw?.id_historial_estudiante ? (
                    <>
                      <button className="de-project-icon-button danger" type="button" onClick={() => eliminar(raw.id_historial_estudiante)} disabled={guardando}>
                        <Trash2 size={13} />
                      </button>
                      <button className="de-project-icon-button" type="button" onClick={() => setConfirmId(null)}>
                        <X size={13} />
                      </button>
                    </>
                  ) : (
                    <button className="de-project-icon-button danger" type="button" onClick={() => setConfirmId(raw?.id_historial_estudiante)} disabled={guardando}>
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

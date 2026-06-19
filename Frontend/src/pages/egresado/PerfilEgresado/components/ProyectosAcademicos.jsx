import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ArrowUpRight, Plus, Pencil, Trash2, Check, X, Loader2, AlertTriangle, Book, Calendar } from 'lucide-react';
import { egresadoDashboardService } from '../../../../services/egresadoDashboardService';

const bordesDisponibles = ['bordeAzul', 'bordeMorado', 'bordeAqua', 'bordeMagenta'];

const fondos = [
  'fondoAzulClaro', 'fondoAzulMedio', 'fondoAzulOscuro',
  'fondoMorado', 'fondoNaranja', 'fondoMoradoClaro',
];

const mapearHistorial = (h, i) => ({
  id: h.id_historial_estudiante,
  titulo: h.titulo_proyecto,
  descripcion: h.descripcion || '',
  enlace: h.enlace || '',
  tipo: h.tipo || 'GITHUB',
  tecnologias: h.tecnologias ? h.tecnologias.split(',').map(t => t.trim()).filter(Boolean) : [],
  rol: h.rol_desempenado || '',
  fechaInicio: h.fecha_inicio || '',
  fechaFin: h.fecha_fin || '',
  borde: bordesDisponibles[i % bordesDisponibles.length],
});

function ProyectosAcademicos({ perfilApi }) {
  const { t } = useTranslation();
  const { catalogoTecnologias } = perfilApi || {};
  const [proyectos, setProyectos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [borrador, setBorrador] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [confirmandoId, setConfirmandoId] = useState(null);
  const [techInput, setTechInput] = useState('');
  const refTechInput = useRef(null);

  useEffect(() => {
    egresadoDashboardService.obtenerHistorialProyectos()
      .then((data) => {
        const lista = Array.isArray(data) ? data : [];
        setProyectos(lista.map(mapearHistorial));
      })
      .catch(() => {})
      .finally(() => setCargando(false));
  }, []);

  const iniciarEdicion = (proyecto) => {
    setEditandoId(proyecto.id);
    setBorrador({ ...proyecto, tecnologias: [...proyecto.tecnologias] });
  };

  const cancelar = () => {
    setEditandoId(null);
    setBorrador(null);
    setTechInput('');
  };

  const agregarTechAlBorrador = (nombre) => {
    const limpio = nombre.trim();
    if (!limpio) return;
    setBorrador((b) => {
      if (b.tecnologias.some((t) => t.toLowerCase() === limpio.toLowerCase())) return b;
      return { ...b, tecnologias: [...b.tecnologias, limpio] };
    });
    setTechInput('');
  };

  const quitarTechDelBorrador = (nombre) => {
    setBorrador((b) => ({ ...b, tecnologias: b.tecnologias.filter((t) => t !== nombre) }));
  };

  const guardar = async () => {
    if (!borrador?.titulo.trim()) return;
    setGuardando(true);
    try {
      const payload = {
        titulo_proyecto: borrador.titulo.trim(),
        descripcion: borrador.descripcion || '',
        enlace: borrador.enlace || '',
        tipo: borrador.tipo || 'GITHUB',
        tecnologias: borrador.tecnologias.join(', '),
        rol_desempenado: borrador.rol || '',
        fecha_inicio: borrador.fechaInicio || null,
        fecha_fin: borrador.fechaFin || null,
      };

      if (proyectos.some((p) => p.id === borrador.id)) {
        const actualizado = await egresadoDashboardService.actualizarHistorialProyecto(borrador.id, payload);
        setProyectos((prev) =>
          prev.map((p) => (p.id === borrador.id
            ? { ...mapearHistorial(actualizado, 0), id: p.id, borde: p.borde }
            : p))
        );
      } else {
        const creado = await egresadoDashboardService.crearHistorialProyecto(payload);
        setProyectos((prev) => [...prev, mapearHistorial(creado, prev.length)]);
      }
      cancelar();
    } catch {
    } finally {
      setGuardando(false);
    }
  };

  const confirmarEliminar = (id) => setConfirmandoId(id);

  const ejecutarEliminar = async (id) => {
    try {
      await egresadoDashboardService.eliminarHistorialProyecto(id);
      setProyectos((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Error al eliminar proyecto:', err);
    } finally {
      setConfirmandoId(null);
    }
  };

  const cancelarEliminar = () => setConfirmandoId(null);

  const agregarNuevo = () => {
    const idTmp = Date.now();
    setEditandoId(idTmp);
    setBorrador({
      id: idTmp, titulo: '', descripcion: '', enlace: '',
      tipo: 'GITHUB', tecnologias: [], rol: '',
      fechaInicio: '', fechaFin: '', borde: '',
    });
  };

  const FormularioProyecto = ({ autoFocus }) => (
    <div className="formularioProyectoPersonal">
      <div className="filaFormularioDoble">
        <input className="entradaProyectoPersonal" placeholder={t('egresadoPerfil.academicProjects.form.titulo')}
          value={borrador.titulo}
          onChange={(e) => setBorrador((b) => ({ ...b, titulo: e.target.value }))}
          autoFocus={autoFocus}
        />
        <select className="selectProyectoPersonal" value={borrador.tipo}
          onChange={(e) => setBorrador((b) => ({ ...b, tipo: e.target.value }))}>
          <option value="GITHUB">{t('egresadoPerfil.academicProjects.form.github')}</option>
          <option value="PLATAFORMA">{t('egresadoPerfil.academicProjects.form.plataforma')}</option>
        </select>
      </div>

      <textarea className="textareaProyectoPersonal" placeholder={t('egresadoPerfil.academicProjects.form.descripcion')}
        rows={3} value={borrador.descripcion}
        onChange={(e) => setBorrador((b) => ({ ...b, descripcion: e.target.value }))}
      />

      <div className="filaFormularioDoble">
        <input className="entradaProyectoPersonal" placeholder={t('egresadoPerfil.academicProjects.form.rol')}
          value={borrador.rol}
          onChange={(e) => setBorrador((b) => ({ ...b, rol: e.target.value }))}
        />
        <input className="entradaProyectoPersonal" placeholder={t('egresadoPerfil.academicProjects.form.url')}
          value={borrador.enlace}
          onChange={(e) => setBorrador((b) => ({ ...b, enlace: e.target.value }))}
        />
      </div>

      <div className="filaFormularioDoble">
        <div className="campoFecha">
          <Calendar size={14} className="iconoCampo" />
          <input className="entradaProyectoPersonal" type="date"
            value={borrador.fechaInicio}
            onChange={(e) => setBorrador((b) => ({ ...b, fechaInicio: e.target.value }))}
          />
        </div>
        <div className="campoFecha">
          <Calendar size={14} className="iconoCampo" />
          <input className="entradaProyectoPersonal" type="date"
            value={borrador.fechaFin}
            onChange={(e) => setBorrador((b) => ({ ...b, fechaFin: e.target.value }))}
          />
        </div>
      </div>

      <div className="campoTecnologiasForm">
        <div className="filaTechInput">
          <input ref={refTechInput} type="text" className="entradaProyectoPersonal"
            placeholder={t('egresadoPerfil.academicProjects.form.techPlaceholder')}
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') { e.preventDefault(); agregarTechAlBorrador(techInput); }
            }}
            list="sugerenciasProyecto"
          />
          <button type="button" className="botonAgregarTechMini" onClick={() => agregarTechAlBorrador(techInput)}>
            <Plus size={14} />
          </button>
          <datalist id="sugerenciasProyecto">
            {(catalogoTecnologias || [])
              .filter((t) => !borrador.tecnologias.some((p) => p.toLowerCase() === t.toLowerCase()))
              .map((t) => <option key={t} value={t} />)}
          </datalist>
        </div>
        {borrador.tecnologias.length > 0 && (
          <div className="tagsTechForm">
            {borrador.tecnologias.map((t) => (
              <span key={t} className="etiquetaStack fondoAzulClaro">
                {t}
                <button type="button" className="botonQuitarStack" onClick={() => quitarTechDelBorrador(t)}>
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="accionesProyectoPersonal">
        <button type="button" className="botonGuardarMini" onClick={guardar} disabled={guardando}>
          {guardando ? <Loader2 size={14} className="iconoGirando" /> : <Check size={14} />} {t('egresadoPerfil.academicProjects.form.guardar')}
        </button>
        <button type="button" className="botonCancelarMini" onClick={cancelar} disabled={guardando}>
          <X size={14} /> {t('egresadoPerfil.academicProjects.form.cancelar')}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="encabezadoProyectosAcademicos">
        <h3 className="tituloProyectosSeccion">{t('egresadoPerfil.academicProjects.titulo')}</h3>
        <button type="button" className="botonAgregarProyecto" onClick={agregarNuevo}>
          <Plus size={14} /> {t('egresadoPerfil.academicProjects.agregar')}
        </button>
      </div>

      {cargando ? (
        <div className="vacioPostulaciones">
          <Loader2 size={20} className="iconoGirando" /> {t('egresadoPerfil.academicProjects.loading')}
        </div>
      ) : (
        <div className="cuadriculaProyectosPersonales">
          {proyectos.length === 0 && !editandoId && (
            <p className="vacioPostulaciones" style={{ gridColumn: '1 / -1' }}>
              {t('egresadoPerfil.academicProjects.empty')}
            </p>
          )}

          {proyectos.map((proyecto) => {
            const enEdicion = editandoId === proyecto.id;
            return (
              <div key={proyecto.id} className={`tarjetaProyectoPersonal ${proyecto.borde}`}>
                {enEdicion ? (
                  <FormularioProyecto />
                ) : confirmandoId === proyecto.id ? (
                  <div className="confirmacionEliminar">
                    <AlertTriangle size={24} className="iconoAdvertencia" />
                    <p className="textoConfirmacion">{t('egresadoPerfil.academicProjects.eliminarConfirm')}</p>
                    <p className="subtituloConfirmacion">{t('egresadoPerfil.academicProjects.eliminarDesc')}</p>
                    <div className="accionesConfirmacion">
                      <button type="button" className="botonConfirmarSi" onClick={() => ejecutarEliminar(proyecto.id)}>
                        <Trash2 size={14} /> {t('egresadoPerfil.academicProjects.siEliminar')}
                      </button>
                      <button type="button" className="botonConfirmarNo" onClick={cancelarEliminar}>
                        <X size={14} /> {t('egresadoPerfil.academicProjects.cancelar')}
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="accionesTarjetaProyecto">
                      <button type="button" onClick={() => iniciarEdicion(proyecto)} aria-label={t('egresadoPerfil.academicProjects.editar')}>
                        <Pencil size={14} />
                      </button>
                      <button type="button" onClick={() => confirmarEliminar(proyecto.id)} className="peligro" aria-label={t('egresadoPerfil.academicProjects.eliminar')}>
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="encabezadoCardProyecto">
                      <span className={`tipoBadge ${proyecto.tipo === 'GITHUB' ? 'tipoGithub' : 'tipoPlataforma'}`}>
                        <Book size={10} /> {proyecto.tipo === 'GITHUB' ? t('egresadoPerfil.academicProjects.form.github') : t('egresadoPerfil.academicProjects.form.plataforma')}
                      </span>
                    </div>

                    <h4 className="tituloProyectoPersonal">{proyecto.titulo}</h4>
                    <p className="descripcionProyectoPersonal">{proyecto.descripcion}</p>

                    {proyecto.rol && (
                      <p className="rolProyectoPersonal">{proyecto.rol}</p>
                    )}

                    {proyecto.tecnologias.length > 0 && (
                      <div className="tagsProyectoCard">
                        {proyecto.tecnologias.map((t, i) => (
                          <span key={t} className={`etiquetaStack ${fondos[i % fondos.length]}`}>{t}</span>
                        ))}
                      </div>
                    )}

                    {(proyecto.fechaInicio || proyecto.fechaFin) && (
                      <div className="fechasProyectoCard">
                        <Calendar size={13} />
                        {proyecto.fechaInicio && <span>{proyecto.fechaInicio}</span>}
                        {proyecto.fechaInicio && proyecto.fechaFin && <span> — </span>}
                        {proyecto.fechaFin && <span>{proyecto.fechaFin}</span>}
                      </div>
                    )}

                    {proyecto.enlace && (
                      <a href={proyecto.enlace.startsWith('http') ? proyecto.enlace : `https://${proyecto.enlace}`}
                        target="_blank" rel="noopener noreferrer"
                        className="enlaceProyectoPersonal" onClick={(e) => e.stopPropagation()}>
                        <span className="rutaEnlace">{proyecto.enlace}</span>
                        <ArrowUpRight size={16} className="iconoFlecha" />
                      </a>
                    )}
                  </>
                )}
              </div>
            );
          })}

          {editandoId && !proyectos.some((p) => p.id === editandoId) && (
            <div className="tarjetaProyectoPersonal bordeAzul">
              <FormularioProyecto autoFocus />
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default ProyectosAcademicos;

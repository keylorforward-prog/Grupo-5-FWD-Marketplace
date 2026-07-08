import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  Plus, Trash2, Calculator, TrendingUp, Info, Save,
  ChevronDown, ChevronUp,
} from 'lucide-react';
import { z } from 'zod';
import {
  calcularCotizacion,
  MULTIPLICADOR_COMPLEJIDAD,
  ETIQUETAS_COMPLEJIDAD,
  TOOLTIP_COMPLEJIDAD,
  MODALIDAD_MULTIPLICADOR,
  ETIQUETAS_MODALIDAD,
  TOOLTIP_MODALIDAD,
  TIPOS_ENTREGABLE,
  formatCRC,
  sugerirComplejidadPorPresupuesto,
  evaluarVsReferencia,
  TARIFA_REFERENCIA,
} from '../../utils/calculadoraCotizacion';
import { egresadoService } from '../../services/egresadoService';

// ─── ID único para accesibilidad ──────────────────────────────────────────────
let _tareasGlobalId = 0;
const nuevoId = () => `tarea-${++_tareasGlobalId}`;

// ─── Tarea vacía por defecto ──────────────────────────────────────────────────
const tareaVacia = () => ({ id: nuevoId(), nombre: '', horas: '', tipo_entregable: 'desarrollo' });

// ─── Esquema Zod ─────────────────────────────────────────────────────────────
const tareaSchema = z.object({
  id:     z.string(),
  nombre: z.string().trim().min(1, 'Nombre requerido.'),
  horas:  z.string().refine(
    (v) => { const n = Number(v); return v !== '' && !isNaN(n) && n > 0 && n <= 500; },
    { message: 'Horas entre 1 y 500.' },
  ),
});

const cotizacionSchema = z.object({
  tarifaTotal: z.string().refine(
    (v) => { const n = Number(v); return v !== '' && !isNaN(n) && n > 0; },
    { message: 'Debe ser un número mayor a 0.' },
  ),
  tareas: z.array(tareaSchema).min(1, 'Agregá al menos una tarea.'),
  complejidad: z.enum(['baja', 'media', 'alta']),
  modalidad: z.enum(['remoto', 'hibrido', 'presencial']),
});

function validarConZod(tarifaTotal, tareas, complejidad, modalidad) {
  const result = cotizacionSchema.safeParse({ tarifaTotal, tareas, complejidad, modalidad });
  if (result.success) return {};

  const errores = {};
  for (const issue of result.error.issues) {
    const path = issue.path.join('.');
    if (path.startsWith('tareas.')) {
      if (!errores.tareas) errores.tareas = [];
      const parts = path.split('.');
      const idx = parseInt(parts[1], 10);
      const field = parts[2];
      if (!errores.tareas[idx]) errores.tareas[idx] = {};
      errores.tareas[idx][field] = issue.message;
    } else if (path === 'tarifaTotal') {
      errores.tarifa = issue.message;
    } else {
      errores[path] = issue.message;
    }
  }
  return errores;
}

// ─── Componente principal ─────────────────────────────────────────────────────
/**
 * CalculadoraCotizacion
 *
 * Props:
 *   onResultado(resultado | null) — se llama con el resultado calculado cada vez
 *                                   que cambia, o con null si el form es inválido.
 *   initialData — { tarifa_hora, desglose_tareas, complejidad } para modo edición
 *   proyecto    — { presupuesto_min, presupuesto_max, plazo_dias } para referencia
 */
export default function CalculadoraCotizacion({ onResultado, initialData = null, proyecto = null }) {
  // ─── Estado del formulario ────────────────────────────────────────────────
  const horasIniciales = (initialData?.desglose_tareas || []).reduce(
    (s, t) => s + (Math.max(0, Number(t.horas) || 0)), 0,
  );
  const totalInicial = (initialData?.tarifa_hora && horasIniciales > 0)
    ? String(Math.round(initialData.tarifa_hora * horasIniciales))
    : '';

  const [tarifaTotal,  setTarifaTotal]  = useState(totalInicial);
  const [complejidad,  setComplejidad]  = useState(initialData?.complejidad  ?? 'media');
  const [modalidad,    setModalidad]    = useState('remoto');
  const [ivaPorcentaje]                 = useState(13);
  const [tareas, setTareas]             = useState(() => {
    if (initialData?.desglose_tareas?.length) {
      return initialData.desglose_tareas.map((t) => ({
        id:              nuevoId(),
        nombre:          t.nombre ?? '',
        horas:           t.horas  != null ? String(t.horas) : '',
        tipo_entregable: t.tipo_entregable ?? 'desarrollo',
      }));
    }
    return [tareaVacia()];
  });

  const [errores,      setErrores]      = useState({});
  const [tocado,       setTocado]       = useState(false);
  const [desgloseOpen, setDesgloseOpen] = useState(true);
  const [explicacionIa, setExplicacionIa] = useState('');
  const [cargandoIa,   setCargandoIa]   = useState(false);

  // ─── Derivados ─────────────────────────────────────────────────────────
  const HORAS_MENSUALES = 160;
  const totalHorasCalc = tareas.reduce((s, t) => s + (Math.max(0, Number(t.horas) || 0)), 0);
  const totalNum       = Number(tarifaTotal) || 0;
  const tarifaHoraCalc = totalNum > 0
    ? parseFloat((totalNum / HORAS_MENSUALES).toFixed(2))
    : null;

  // ─── Auto‑complejidad desde presupuesto ───────────────────────────────
  const complejidadAuto = useMemo(
    () => (proyecto?.presupuesto_min || proyecto?.presupuesto_max)
      ? sugerirComplejidadPorPresupuesto(proyecto.presupuesto_min, proyecto.presupuesto_max)
      : null,
    [proyecto?.presupuesto_min, proyecto?.presupuesto_max],
  );

  useEffect(() => {
    if (complejidadAuto && !initialData?.complejidad) {
      setComplejidad(complejidadAuto);
    }
  }, [complejidadAuto]);

  const tarifaTotalEditadaManual = useRef(false);

  // ─── Total sugerido según presupuesto del proyecto ────────────────────
  // Se calcula hacia atrás:  tarifaTotal = presupuesto / (multiplicador × 1.13)
  // para que el total final (con complejidad + IVA) no exceda el presupuesto.
  const sugerenciaTotal = useMemo(() => {
    const min = Number(proyecto?.presupuesto_min) || 0;
    const max = Number(proyecto?.presupuesto_max) || 0;
    const promedio = (min + max) / 2;
    if (promedio <= 0) return null;
    const multiplicador = MULTIPLICADOR_COMPLEJIDAD[complejidad] ?? 1.3;
    const factor = multiplicador * 1.13;
    return {
      sugerida: Math.max(Math.round(min), Math.round(min / factor), 1),
      rango: {
        min: Math.max(Math.round(min), Math.round(min / factor), 1),
        max: Math.max(Math.round(max), Math.round(max / factor), 1),
      },
    };
  }, [proyecto?.presupuesto_min, proyecto?.presupuesto_max, complejidad]);

  useEffect(() => {
    if (!sugerenciaTotal) return;
    if (!tarifaTotalEditadaManual.current && (!tarifaTotal || tarifaTotal === '')) {
      setTarifaTotal(String(sugerenciaTotal.sugerida));
    }
  }, [sugerenciaTotal?.sugerida]);

  // ─── Resultado calculado en tiempo real ───────────────────────────────────
  const resultado = useCallback(() => {
    if (!tarifaHoraCalc || tarifaHoraCalc <= 0 || tareas.length === 0) return null;
    const tareasValidas = tareas.filter((t) => t.nombre.trim() && Number(t.horas) > 0);
    if (tareasValidas.length === 0) return null;
    return calcularCotizacion({
      tarifaHora:    tarifaHoraCalc,
      desgloseTareas: tareasValidas.map((t) => ({ nombre: t.nombre.trim(), horas: Number(t.horas), tipo_entregable: t.tipo_entregable })),
      complejidad,
      modalidad,
      ivaPorcentaje,
    });
  }, [tarifaHoraCalc, tareas, complejidad, modalidad, ivaPorcentaje]);

  useEffect(() => {
    const res = resultado();
    const errs = tocado ? validarConZod(tarifaTotal, tareas, complejidad, modalidad) : {};
    setErrores(errs);
    const esValido = Object.keys(errs).length === 0 && res !== null;
    onResultado?.(esValido ? res : null);
  }, [tarifaTotal, tareas, complejidad, modalidad, ivaPorcentaje, tocado]);

  // ─── Handlers de tareas ───────────────────────────────────────────────────
  const agregarTarea = () => {
    setTareas((prev) => [...prev, tareaVacia()]);
    setTocado(true);
  };

  const eliminarTarea = (id) => {
    setTareas((prev) => prev.filter((t) => t.id !== id));
    setTocado(true);
  };

  const actualizarTarea = (id, campo, valor) => {
    setTareas((prev) => prev.map((t) => (t.id === id ? { ...t, [campo]: valor } : t)));
    setTocado(true);
  };

  const handleTarifaTotalChange = (e) => {
    tarifaTotalEditadaManual.current = true;
    setTarifaTotal(e.target.value);
    setTocado(true);
  };

  // ─── Lógica IA ────────────────────────────────────────────────────────────
  const solicitarExplicacion = async () => {
    if (!res) return;
    setCargandoIa(true);
    setExplicacionIa('');
    try {
      const texto = await egresadoService.explicarPrecio({
        tarifa_hora: res.tarifa,
        total_horas: res.totalHoras,
        complejidad: ETIQUETAS_COMPLEJIDAD[res.complejidad],
        total: res.total,
        proyecto_titulo: proyecto?.titulo || 'Proyecto Freelance',
        tecnologias: (proyecto?.tecnologias_requeridas || 'tecnologías modernas').toString()
      });
      setExplicacionIa(texto);
    } catch (err) {
      setExplicacionIa('Hubo un error al generar la explicación. Por favor intenta más tarde.');
    } finally {
      setCargandoIa(false);
    }
  };

  // ─── Datos derivados ──────────────────────────────────────────────────────
  const res          = resultado();
  const totalHorasViz = totalHorasCalc;
  const errTareasArr = errores.tareas ?? [];

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="calc-wrapper">

      {/* ── Referencia del proyecto ─────────────────────────────────────── */}
      {proyecto && (proyecto.presupuesto_min || proyecto.presupuesto_max) && (
        <div className="calc-ref-proyecto">
          <Info size={13} />
          <span>
            El cliente estimó entre{' '}
            <strong>{formatCRC(proyecto.presupuesto_min)}</strong>
            {' '}y{' '}
            <strong>{formatCRC(proyecto.presupuesto_max)}</strong>
            {proyecto.plazo_dias ? ` en ${proyecto.plazo_dias} días` : ''}.
          </span>
        </div>
      )}

      {/* ── Fila: tarifa total + tarifa por hora (calculada) ────────────── */}
      <div className="calc-grid">
        {/* Tarifa total */}
        <div>
          <label className="calc-label">
            <TrendingUp size={13} />
            Tarifa mensual (CRC)
          </label>
          <input
            type="number"
            className={`calc-input${errores.tarifa ? ' error' : ''}`}
            placeholder={`Mín: ₡${proyecto?.presupuesto_min ?? 1} – Máx: ₡${proyecto?.presupuesto_max ?? 500}`}
            min={proyecto?.presupuesto_min ?? 1}
            max={proyecto?.presupuesto_max ?? 500}
            step="10"
            value={tarifaTotal}
            onChange={handleTarifaTotalChange}
          />
          {errores.tarifa && <p className="calc-error">{errores.tarifa}</p>}
          {sugerenciaTotal && (
            <span className="calc-sugerencia-tarifa">
              Basado en el presupuesto del proyecto —{' '}
              <strong>Tarifa mensual sugerida: ₡{sugerenciaTotal.sugerida}</strong>
            </span>
          )}
        </div>

        {/* Tarifa por hora (calculada) */}
        <div>
          <label className="calc-label">
            <Calculator size={13} />
            Tarifa por hora
          </label>
          <div className="calc-tarifa-por-hora-valor">
            {tarifaHoraCalc != null
              ? <strong>{`₡${tarifaHoraCalc.toFixed(2)} / hora`}</strong>
              : <span className="calc-sin-dato">—</span>
            }
          </div>
          <span className="calc-complejidad-hint">
            {tarifaHoraCalc != null
              ? `${formatCRC(tarifaHoraCalc)}/h × ${HORAS_MENSUALES} h/mes = ${formatCRC(totalNum)}/mes`
              : 'Ingresá tu tarifa mensual para calcular'
            }
          </span>
        </div>
      </div>

      {/* ── Complejidad ────────────────────────────────────────────────── */}
      <div className="calc-complejidad-seccion">
        <label className="calc-label">
          <Calculator size={13} />
          Complejidad
        </label>
        <div className="calc-complejidad-grupo">
          {Object.keys(MULTIPLICADOR_COMPLEJIDAD).map((nivel) => (
            <button
              key={nivel}
              type="button"
              title={TOOLTIP_COMPLEJIDAD[nivel]}
              className={`calc-complejidad-btn${complejidad === nivel ? ' activo' : ''}`}
              onClick={() => { setComplejidad(nivel); setTocado(true); }}
            >
              {ETIQUETAS_COMPLEJIDAD[nivel]}
            </button>
          ))}
        </div>
        <span className="calc-complejidad-hint">
          ×{MULTIPLICADOR_COMPLEJIDAD[complejidad].toFixed(1)} — {TOOLTIP_COMPLEJIDAD[complejidad]}
        </span>
      </div>

      {/* ── Modalidad ──────────────────────────────────────────────────── */}
      <div className="calc-complejidad-seccion">
        <label className="calc-label">
          <Calculator size={13} />
          Modalidad
        </label>
        <div className="calc-complejidad-grupo">
          {Object.keys(MODALIDAD_MULTIPLICADOR).map((mod) => (
            <button
              key={mod}
              type="button"
              title={TOOLTIP_MODALIDAD[mod]}
              className={`calc-complejidad-btn${modalidad === mod ? ' activo' : ''}`}
              onClick={() => { setModalidad(mod); setTocado(true); }}
            >
              {ETIQUETAS_MODALIDAD[mod]}
            </button>
          ))}
        </div>
        <span className="calc-complejidad-hint">
          ×{MODALIDAD_MULTIPLICADOR[modalidad].toFixed(2)} — {TOOLTIP_MODALIDAD[modalidad]}
        </span>
      </div>

      {/* ── Referencia del proyecto para las tareas ────────────────────── */}
      {proyecto?.descripcion && (
        <details className="calc-proyecto-ref">
          <summary className="calc-proyecto-ref-summary">
            <Info size={13} /> Ver descripción y tecnologías del proyecto
          </summary>
          <p className="calc-proyecto-ref-desc">{proyecto.descripcion}</p>
          {proyecto.tecnologias_requeridas && (
            <div className="calc-proyecto-ref-techs">
              {proyecto.tecnologias_requeridas.split(',').map((t) => t.trim()).filter(Boolean).map((tech) => (
                <span key={tech} className="calc-tech-tag">{tech}</span>
              ))}
            </div>
          )}
        </details>
      )}

      {/* ── Desglose de tareas ──────────────────────────────────────────── */}
      <div className="calc-tareas-seccion">
        <div className="calc-tareas-header">
          <span className="calc-label" style={{ margin: 0 }}>
            Desglose de tareas
          </span>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span className="calc-horas-total">
              {totalHorasViz} h en total
            </span>
            <button type="button" className="calc-btn-agregar" onClick={agregarTarea}>
              <Plus size={13} /> Agregar tarea
            </button>
          </div>
        </div>

        {errores.sinTareas && <p className="calc-error">{errores.sinTareas}</p>}

        <div className="calc-tareas-lista">
          <div className="calc-tarea-header-fila">
            <span>Tarea / Entregable</span>
            <span style={{ width: 110 }}>Tipo</span>
            <span style={{ width: 80 }}>Horas est.</span>
            <span />
          </div>
          {tareas.map((tarea, idx) => {
            const errT = errTareasArr[idx] ?? {};
            return (
              <div key={tarea.id} className="calc-tarea-fila">
                <div>
                  <input
                    type="text"
                    className={`calc-input${errT.nombre ? ' error' : ''}`}
                    placeholder="Ej: Diseño de UI"
                    value={tarea.nombre}
                    onChange={(e) => actualizarTarea(tarea.id, 'nombre', e.target.value)}
                  />
                  {errT.nombre && <p className="calc-error">{errT.nombre}</p>}
                </div>
                <div style={{ width: 110 }}>
                  <select
                    className={`calc-input${errT.tipo_entregable ? ' error' : ''}`}
                    value={tarea.tipo_entregable}
                    onChange={(e) => actualizarTarea(tarea.id, 'tipo_entregable', e.target.value)}
                    style={{ padding: '0.35rem 0.4rem', fontSize: '0.75rem' }}
                  >
                    {TIPOS_ENTREGABLE.map((tipo) => (
                      <option key={tipo.valor} value={tipo.valor}>{tipo.label}</option>
                    ))}
                  </select>
                </div>
                <div style={{ width: 80 }}>
                  <input
                    type="number"
                    className={`calc-input${errT.horas ? ' error' : ''}`}
                    placeholder="0"
                    min="1"
                    max="500"
                    value={tarea.horas}
                    onChange={(e) => actualizarTarea(tarea.id, 'horas', e.target.value)}
                  />
                  {errT.horas && <p className="calc-error">{errT.horas}</p>}
                </div>
                <button
                  type="button"
                  className="calc-btn-eliminar"
                  title="Eliminar tarea"
                  onClick={() => eliminarTarea(tarea.id)}
                  disabled={tareas.length === 1}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Resultado en tiempo real ────────────────────────────────────── */}
      {res && (
        <div className="calc-resultado">
          <button
            type="button"
            className="calc-resultado-header"
            onClick={() => setDesgloseOpen((o) => !o)}
          >
            <Calculator size={15} />
            <span>Desglose de tu cotización</span>
            <span style={{ marginLeft: 'auto' }}>
              {desgloseOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </span>
          </button>

          {desgloseOpen && (
            <table className="calc-desglose-tabla">
              <tbody>
                <tr>
                  <td>Tarifa mensual</td>
                  <td>{formatCRC(totalNum)} / mes</td>
                </tr>
                <tr className="calc-desglose-sub">
                  <td>Tarifa por hora</td>
                  <td>{formatCRC(res.tarifa)} / hora</td>
                </tr>
                <tr className="calc-desglose-sub">
                  <td>Horas del proyecto</td>
                  <td>{res.totalHoras} horas</td>
                </tr>
                <tr>
                  <td>Costo del proyecto</td>
                  <td>{formatCRC(res.subtotalBase)}</td>
                </tr>
                <tr>
                  <td>
                    Ajuste por complejidad{' '}
                    <em>({ETIQUETAS_COMPLEJIDAD[complejidad]} ×{res.multiplicador.toFixed(1)})</em>
                  </td>
                  <td>{formatCRC(res.subtotalAjust)}</td>
                </tr>
                <tr>
                  <td>IVA ({res.ivaPorcentaje}%)</td>
                  <td>{formatCRC(res.montoIva)}</td>
                </tr>
                <tr className="total-fila">
                  <td>💡 Total estimado</td>
                  <td>{formatCRC(res.total)}</td>
                </tr>
              </tbody>
            </table>
          )}

          {/* Rango mín / est / máx */}
          <div className="calc-rango">
            <div className="calc-rango-item">
              <div className="calc-rango-label">Mínimo</div>
              <div className="calc-rango-crc">{formatCRC(res.rango.min)}</div>
              <div className="calc-rango-crc">{formatCRC(res.crc.min)}</div>
            </div>
            <div className="calc-rango-item estimado">
              <div className="calc-rango-label">Estimado</div>
              <div className="calc-rango-crc">{formatCRC(res.rango.estimado)}</div>
              <div className="calc-rango-crc">{formatCRC(res.crc.estimado)}</div>
            </div>
            <div className="calc-rango-item">
              <div className="calc-rango-label">Máximo</div>
              <div className="calc-rango-crc">{formatCRC(res.rango.max)}</div>
              <div className="calc-rango-crc">{formatCRC(res.crc.max)}</div>
            </div>
          </div>

          <p className="calc-rango-nota">
            El rango refleja un margen −15% / +20% sobre el estimado para negociación.
            El monto que se enviará como propuesta es el <strong>máximo ({formatCRC(res.rango.max)})</strong>.
          </p>

          {/* Comparación con referencia de mercado */}
          {(() => {
            const ref = evaluarVsReferencia(res.tarifa);
            return ref.nivel !== 'sin-dato' ? (
              <div style={{ padding: '0 1rem 0.5rem' }}>
                <div className={`calc-mercado-badge ${ref.nivel}`}>
                  <strong>Referencia mercado junior CR:</strong>{' '}
                  {formatCRC(res.referenciaMercado.min)}/h – {formatCRC(res.referenciaMercado.media)}/h – {formatCRC(res.referenciaMercado.max)}/h
                  <br />
                  <span style={{ fontSize: '0.75rem' }}>{ref.msg}</span>
                </div>
              </div>
            ) : null;
          })()}

          {/* Asistente IA + Guardar */}
          <div className="calc-ia-section" style={{ padding: '0 1rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {explicacionIa ? (
              <div style={{ background: 'color-mix(in srgb, var(--primary, #1ad1c8) 15%, transparent)', padding: '0.8rem', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--ink)' }}>
                <strong>✨ FWD Mentor dice:</strong>
                <p style={{ margin: '0.3rem 0 0', lineHeight: 1.5 }}>{explicacionIa}</p>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button 
                  type="button" 
                  onClick={solicitarExplicacion}
                  disabled={cargandoIa}
                  style={{ flex: 1, background: 'transparent', border: '1px dashed var(--primary, #1ad1c8)', color: 'var(--primary, #1ad1c8)', padding: '0.5rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', minWidth: 140 }}
                >
                  {cargandoIa ? 'Generando consejo...' : '✨ Explicar con IA'}
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    const texto = `Cotización FWD Talent\n\n` +
                      `Tarifa mensual: ${formatCRC(totalNum)}/mes\n` +
                      `Tarifa por hora: ${formatCRC(res.tarifa)}/h\n` +
                      `Horas del proyecto: ${res.totalHoras}h\n` +
                      `Modalidad: ${ETIQUETAS_MODALIDAD[res.modalidad]}\n` +
                      `Complejidad: ${ETIQUETAS_COMPLEJIDAD[res.complejidad]}\n\n` +
                      `── Desglose ──\n` +
                      `Costo base: ${formatCRC(res.subtotalBase)}\n` +
                      `Ajuste (${ETIQUETAS_COMPLEJIDAD[res.complejidad]} ×${res.multiplicador}): ${formatCRC(res.subtotalAjust)}\n` +
                      `IVA (${res.ivaPorcentaje}%): ${formatCRC(res.montoIva)}\n` +
                      `Total: ${formatCRC(res.total)}\n\n` +
                      `Rango sugerido: ${formatCRC(res.rango.min)} – ${formatCRC(res.rango.estimado)} – ${formatCRC(res.rango.max)}`;
                    navigator.clipboard.writeText(texto);
                    alert('Cotización copiada al portapapeles.');
                  }}
                  style={{ flex: 1, background: 'transparent', border: '1px dashed var(--ink-subtle, #94a3b8)', color: 'var(--ink, #1f2937)', padding: '0.5rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', minWidth: 140 }}
                >
                  <Save size={13} style={{ marginRight: 4 }} /> Guardar cotización
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

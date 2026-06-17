import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardEmpresarioService } from '../../../../../services/dashboardEmpresarioService';
import DashboardLayout from '../../components/DashboardLayout';
import {
  TITULOS_PUESTO,
  AREAS_DEPARTAMENTO,
  NIVELES_EXPERIENCIA,
  TIPOS_JORNADA,
  MODALIDADES,
  PROVINCIAS_CR,
  RANGOS_SALARIO,
  TECNOLOGIAS_COMUNES,
  BENEFICIOS,
} from './opcionesEmpleo';

const RANGO_A_SALARIOS = {
  '300_500':    [300000,  500000],
  '500_800':    [500000,  800000],
  '800_1200':   [800000,  1200000],
  '1200_1800':  [1200000, 1800000],
  '1800_mas':   [1800000, null],
  'a_convenir': [null,    null],
};

export default function PublicarEmpleo() {
  const navigate = useNavigate();

  const [formulario, setFormulario] = useState({
    tituloPuesto:          '',
    tituloPersonalizado:   '',
    area:                  '',
    areaPersonalizada:     '',
    nivel_experiencia:     '',
    descripcion:           '',
    requisitos:            '',
    tecnologias:           [],
    tipo_jornada:          'tiempo_completo',
    modalidad:             'remoto',
    rango_salario:         '',
    salario_min:           '',
    salario_max:           '',
    ubicacion:             '',
    ubicacionPersonalizada: '',
    beneficios:            [],
  });
  const [guardando, setGuardando] = useState(false);
  const [error, setError]         = useState('');

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
  };

  const manejarRango = (e) => {
    const { value } = e.target;
    const [min, max] = RANGO_A_SALARIOS[value] ?? [null, null];
    setFormulario((prev) => ({
      ...prev,
      rango_salario: value,
      salario_min: min ?? '',
      salario_max: max ?? '',
    }));
  };

  const toggleTecnologia = (tech) =>
    setFormulario((prev) => ({
      ...prev,
      tecnologias: prev.tecnologias.includes(tech)
        ? prev.tecnologias.filter((t) => t !== tech)
        : [...prev.tecnologias, tech],
    }));

  const toggleBeneficio = (b) =>
    setFormulario((prev) => ({
      ...prev,
      beneficios: prev.beneficios.includes(b)
        ? prev.beneficios.filter((x) => x !== b)
        : [...prev.beneficios, b],
    }));

  const resolverTitulo = () => {
    if (formulario.tituloPuesto === 'otro') return formulario.tituloPersonalizado.trim();
    return TITULOS_PUESTO.find((t) => t.value === formulario.tituloPuesto)?.label ?? '';
  };

  const resolverUbicacion = () => {
    if (formulario.ubicacion === 'otro') return formulario.ubicacionPersonalizada.trim();
    return PROVINCIAS_CR.find((p) => p.value === formulario.ubicacion)?.label ?? '';
  };

  const construirRequisitos = () => {
    const partes = [];
    const nivel = NIVELES_EXPERIENCIA.find((n) => n.value === formulario.nivel_experiencia);
    if (nivel) partes.push(`Nivel requerido: ${nivel.label}`);
    if (formulario.requisitos.trim()) partes.push(formulario.requisitos.trim());
    if (formulario.beneficios.length) partes.push(`Beneficios: ${formulario.beneficios.join(', ')}`);
    return partes.join('\n\n') || null;
  };

  const guardar = async () => {
    const titulo = resolverTitulo();
    if (!titulo) { setError('El título de la posición es obligatorio.'); return; }
    if (!formulario.descripcion.trim()) { setError('La descripción es obligatoria.'); return; }
    const salMin = formulario.salario_min ? Number(formulario.salario_min) : null;
    const salMax = formulario.salario_max ? Number(formulario.salario_max) : null;
    if (salMin && salMax && salMin > salMax) {
      setError('El salario mínimo no puede ser mayor al máximo.');
      return;
    }
    setGuardando(true);
    setError('');
    try {
      await dashboardEmpresarioService.crearOfertaEmpleo({
        titulo,
        descripcion:            formulario.descripcion,
        requisitos:             construirRequisitos(),
        tecnologias_requeridas: formulario.tecnologias.length
          ? formulario.tecnologias.join(', ')
          : null,
        tipo_jornada:  formulario.tipo_jornada,
        modalidad:     formulario.modalidad,
        salario_min:   salMin,
        salario_max:   salMax,
        ubicacion:     resolverUbicacion() || null,
      });
      navigate('/DashboardEmpresario/empleos');
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo publicar la oferta.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <DashboardLayout activePage="empleos">
      <div className="de-page-heading">
        <p className="de-eyebrow">Empresa</p>
        <h1>Publicar Oferta de Empleo</h1>
        <p className="de-page-subtitle">Completá los datos y publicá tu posición.</p>
      </div>

      <div className="de-panel">
        <div className="de-form-grid">

          {/* ── Título del puesto ─────────────────────────────────── */}
          <label className="de-form-field">
            <span>Título del puesto</span>
            <select
              className="de-form-control"
              name="tituloPuesto"
              value={formulario.tituloPuesto}
              onChange={manejarCambio}
            >
              <option value="">Seleccioná un puesto...</option>
              {TITULOS_PUESTO.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </label>
          {formulario.tituloPuesto === 'otro' && (
            <label className="de-form-field">
              <span>Especificá el puesto</span>
              <input
                className="de-form-control"
                name="tituloPersonalizado"
                value={formulario.tituloPersonalizado}
                onChange={manejarCambio}
                maxLength={200}
                placeholder="Ej. Desarrollador Blockchain"
              />
            </label>
          )}

          {/* ── Área y nivel ─────────────────────────────────────── */}
          <div className="de-form-grid de-form-grid-2">
            <label className="de-form-field">
              <span>Área / Departamento</span>
              <select
                className="de-form-control"
                name="area"
                value={formulario.area}
                onChange={manejarCambio}
              >
                <option value="">Seleccioná un área...</option>
                {AREAS_DEPARTAMENTO.map((a) => (
                  <option key={a.value} value={a.value}>{a.label}</option>
                ))}
              </select>
            </label>
            <label className="de-form-field">
              <span>Nivel de experiencia</span>
              <select
                className="de-form-control"
                name="nivel_experiencia"
                value={formulario.nivel_experiencia}
                onChange={manejarCambio}
              >
                <option value="">Seleccioná un nivel...</option>
                {NIVELES_EXPERIENCIA.map((n) => (
                  <option key={n.value} value={n.value}>{n.label}</option>
                ))}
              </select>
            </label>
          </div>
          {formulario.area === 'otro' && (
            <label className="de-form-field">
              <span>Especificá el área</span>
              <input
                className="de-form-control"
                name="areaPersonalizada"
                value={formulario.areaPersonalizada}
                onChange={manejarCambio}
                maxLength={200}
                placeholder="Ej. Ciberseguridad"
              />
            </label>
          )}

          {/* ── Descripción ───────────────────────────────────────── */}
          <label className="de-form-field">
            <span>Descripción del puesto</span>
            <textarea
              className="de-form-control de-form-textarea"
              name="descripcion"
              value={formulario.descripcion}
              onChange={manejarCambio}
              placeholder="Describí las responsabilidades y el día a día del puesto."
            />
          </label>

          {/* ── Requisitos ────────────────────────────────────────── */}
          <label className="de-form-field">
            <span>Requisitos</span>
            <textarea
              className="de-form-control de-form-textarea"
              name="requisitos"
              value={formulario.requisitos}
              onChange={manejarCambio}
              placeholder="Experiencia, estudios, certificaciones requeridas..."
            />
          </label>

          {/* ── Tecnologías (chips) ───────────────────────────────── */}
          <div className="de-form-field">
            <span className="de-form-label">Tecnologías o habilidades</span>
            <div className="de-chip-group">
              {TECNOLOGIAS_COMUNES.map((tech) => (
                <button
                  key={tech}
                  type="button"
                  className={`de-chip${formulario.tecnologias.includes(tech) ? ' de-chip--active' : ''}`}
                  onClick={() => toggleTecnologia(tech)}
                >
                  {tech}
                </button>
              ))}
            </div>
          </div>

          {/* ── Jornada y modalidad ───────────────────────────────── */}
          <div className="de-form-grid de-form-grid-2">
            <label className="de-form-field">
              <span>Tipo de jornada</span>
              <select
                className="de-form-control"
                name="tipo_jornada"
                value={formulario.tipo_jornada}
                onChange={manejarCambio}
              >
                {TIPOS_JORNADA.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </label>
            <label className="de-form-field">
              <span>Modalidad</span>
              <select
                className="de-form-control"
                name="modalidad"
                value={formulario.modalidad}
                onChange={manejarCambio}
              >
                {MODALIDADES.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </label>
          </div>

          {/* ── Salario ───────────────────────────────────────────── */}
          <label className="de-form-field">
            <span>Rango salarial mensual</span>
            <select
              className="de-form-control"
              name="rango_salario"
              value={formulario.rango_salario}
              onChange={manejarRango}
            >
              <option value="">Seleccioná un rango...</option>
              {RANGOS_SALARIO.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </label>
          {formulario.rango_salario && formulario.rango_salario !== 'a_convenir' && (
            <div className="de-form-grid de-form-grid-2">
              <label className="de-form-field">
                <span>Salario mínimo (₡)</span>
                <input
                  className="de-form-control"
                  name="salario_min"
                  value={formulario.salario_min}
                  onChange={manejarCambio}
                  type="number"
                  min="0"
                  step="10000"
                />
              </label>
              <label className="de-form-field">
                <span>Salario máximo (₡)</span>
                <input
                  className="de-form-control"
                  name="salario_max"
                  value={formulario.salario_max}
                  onChange={manejarCambio}
                  type="number"
                  min="0"
                  step="10000"
                />
              </label>
            </div>
          )}

          {/* ── Ubicación ─────────────────────────────────────────── */}
          <label className="de-form-field">
            <span>Ubicación</span>
            <select
              className="de-form-control"
              name="ubicacion"
              value={formulario.ubicacion}
              onChange={manejarCambio}
            >
              <option value="">Seleccioná una provincia...</option>
              {PROVINCIAS_CR.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </label>
          {formulario.ubicacion === 'otro' && (
            <label className="de-form-field">
              <span>Especificá la ubicación</span>
              <input
                className="de-form-control"
                name="ubicacionPersonalizada"
                value={formulario.ubicacionPersonalizada}
                onChange={manejarCambio}
                maxLength={200}
                placeholder="Ej. Liberia, Guanacaste"
              />
            </label>
          )}

          {/* ── Beneficios (chips) ────────────────────────────────── */}
          <div className="de-form-field">
            <span className="de-form-label">Beneficios</span>
            <div className="de-chip-group">
              {BENEFICIOS.map((b) => (
                <button
                  key={b}
                  type="button"
                  className={`de-chip${formulario.beneficios.includes(b) ? ' de-chip--active' : ''}`}
                  onClick={() => toggleBeneficio(b)}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="de-data-state error">{error}</p>}

          <button
            className="de-btn-primary"
            type="button"
            onClick={guardar}
            disabled={guardando}
          >
            {guardando ? 'Publicando...' : 'Publicar Oferta'}
          </button>

        </div>
      </div>
    </DashboardLayout>
  );
}

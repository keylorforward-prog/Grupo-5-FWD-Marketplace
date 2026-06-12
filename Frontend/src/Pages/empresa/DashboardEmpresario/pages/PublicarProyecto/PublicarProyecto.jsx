import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../../../context/AuthContext';
import DashboardLayout from '../../components/DashboardLayout';
import './PublicarProyecto.css';

function weeksToPlazoDias(weeks) {
  if (weeks <= 1) return 5;
  if (weeks <= 2) return 15;
  return 30;
}

const EMPTY_FORM = {
  titulo: '',
  descripcion: '',
  tecnologias_requeridas: '',
  usar_ia: 'NO',
  plazo_dias: 30,
  presupuesto_min: '',
  presupuesto_max: '',
  id_conversacion_ia: null,
};

export default function PublicarProyecto() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, token } = useAuth();

  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (searchParams.get('from') !== 'agent') return;
    const raw = sessionStorage.getItem('agent_project_draft');
    if (!raw) return;
    try {
      const draft = JSON.parse(raw);
      sessionStorage.removeItem('agent_project_draft');
      const convId = sessionStorage.getItem('agent_conversacion_id');
      sessionStorage.removeItem('agent_conversacion_id');
      setForm({
        titulo: draft.title ?? '',
        descripcion: draft.description ?? '',
        tecnologias_requeridas: Array.isArray(draft.stack) ? draft.stack.join(', ') : '',
        usar_ia: draft.usa_ia ? 'SI' : 'NO',
        plazo_dias: weeksToPlazoDias(draft.duration_weeks ?? 4),
        presupuesto_min: draft.budget_min || '',
        presupuesto_max: draft.budget_max || '',
        id_conversacion_ia: convId ? Number(convId) : null,
      });
    } catch {
      // JSON inválido — el formulario queda vacío
    }
  }, [searchParams]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!form.titulo.trim() || !form.descripcion.trim()) {
      setError('El título y la descripción son obligatorios.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        id_perfil_empresario: user?.id_perfil_empresario ?? user?.id,
        titulo: form.titulo.trim(),
        descripcion: form.descripcion.trim(),
        tecnologias_requeridas: form.tecnologias_requeridas.trim() || null,
        usar_ia: form.usar_ia,
        plazo_dias: Number(form.plazo_dias),
        presupuesto_min: form.presupuesto_min !== '' ? Number(form.presupuesto_min) : null,
        presupuesto_max: form.presupuesto_max !== '' ? Number(form.presupuesto_max) : null,
        id_conversacion_ia: form.id_conversacion_ia ?? null,
      };

      const res = await fetch('/api/propuestas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message || 'No se pudo publicar el proyecto. Intentá de nuevo.');
        return;
      }

      setSuccess(true);
      setTimeout(() => navigate('/DashboardEmpresario/proyectos'), 1500);
    } catch {
      setError('Error de conexión. Verificá que el servidor esté corriendo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardLayout activePage="proyectos">
      <div className="de-page-heading">
        <p className="de-eyebrow">Empresa</p>
        <h1>Publicar Proyecto</h1>
        <p className="de-page-subtitle">Revisá los datos y publicá tu propuesta.</p>
      </div>

      <div className="de-panel">
        {success ? (
          <div className="pp-success">
            <p>✅ Proyecto publicado correctamente. Redirigiendo...</p>
          </div>
        ) : (
          <form className="pp-form" onSubmit={handleSubmit} noValidate>
            {error && <p className="pp-error">{error}</p>}

            <div className="pp-field">
              <label className="pp-label" htmlFor="titulo">Título del proyecto *</label>
              <input
                id="titulo"
                name="titulo"
                type="text"
                className="de-form-control"
                value={form.titulo}
                onChange={handleChange}
                placeholder="Ej: Plataforma de turnos médicos online"
                required
              />
            </div>

            <div className="pp-field">
              <label className="pp-label" htmlFor="descripcion">Descripción *</label>
              <textarea
                id="descripcion"
                name="descripcion"
                className="de-form-control de-form-textarea"
                value={form.descripcion}
                onChange={handleChange}
                placeholder="Describí el objetivo y alcance del proyecto"
                rows={4}
                required
              />
            </div>

            <div className="pp-field">
              <label className="pp-label" htmlFor="tecnologias_requeridas">Tecnologías requeridas</label>
              <input
                id="tecnologias_requeridas"
                name="tecnologias_requeridas"
                type="text"
                className="de-form-control"
                value={form.tecnologias_requeridas}
                onChange={handleChange}
                placeholder="Ej: React, Node.js, PostgreSQL"
              />
            </div>

            <div className="pp-row">
              <div className="pp-field">
                <label className="pp-label" htmlFor="plazo_dias">Plazo</label>
                <select
                  id="plazo_dias"
                  name="plazo_dias"
                  className="de-form-control"
                  value={form.plazo_dias}
                  onChange={handleChange}
                >
                  <option value={5}>Corto plazo (5 días)</option>
                  <option value={15}>Mediano plazo (15 días)</option>
                  <option value={30}>Largo plazo (30 días)</option>
                </select>
              </div>

              <div className="pp-field">
                <label className="pp-label" htmlFor="usar_ia">¿Usa inteligencia artificial?</label>
                <select
                  id="usar_ia"
                  name="usar_ia"
                  className="de-form-control"
                  value={form.usar_ia}
                  onChange={handleChange}
                >
                  <option value="NO">No</option>
                  <option value="SI">Sí</option>
                </select>
              </div>
            </div>

            <div className="pp-row">
              <div className="pp-field">
                <label className="pp-label" htmlFor="presupuesto_min">Presupuesto mínimo (USD)</label>
                <input
                  id="presupuesto_min"
                  name="presupuesto_min"
                  type="number"
                  min="0"
                  className="de-form-control"
                  value={form.presupuesto_min}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>

              <div className="pp-field">
                <label className="pp-label" htmlFor="presupuesto_max">Presupuesto máximo (USD)</label>
                <input
                  id="presupuesto_max"
                  name="presupuesto_max"
                  type="number"
                  min="0"
                  className="de-form-control"
                  value={form.presupuesto_max}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="pp-actions">
              <button
                type="button"
                className="de-btn-outline"
                onClick={() => navigate('/DashboardEmpresario/proyectos')}
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="de-btn-primary"
                disabled={loading}
              >
                {loading ? 'Publicando...' : 'Publicar proyecto'}
              </button>
            </div>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { dashboardEmpresarioService } from '../../../../../services/dashboardEmpresarioService';
import DashboardLayout from '../../components/DashboardLayout';
import './PublicarProyecto.css';
const PRESUPUESTO_MINIMO = 100000;

export default function PublicarProyecto() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formulario, setFormulario] = useState({
    titulo: '',
    descripcion: '',
    tecnologias_requeridas: '',
    presupuesto_min: '',
    presupuesto_max: '',
    plazo_dias: '15',
  });
  useEffect(() => {
    const datosAgente = location.state?.datosAgente;
    if (!datosAgente) return;
    setFormulario({
      titulo: datosAgente.titulo || '',
      descripcion: datosAgente.descripcion || '',
      tecnologias_requeridas: datosAgente.tecnologias_requeridas || '',
      presupuesto_min: datosAgente.presupuesto_min || '',
      presupuesto_max: datosAgente.presupuesto_max || '',
      plazo_dias: datosAgente.plazo_dias || '15',
    });
  }, [location.state]);

  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const [mostrarGuiaPrecios, setMostrarGuiaPrecios] = useState(false);

  const manejarCambio = (evento) => {
    const { name, value } = evento.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
  };

  const guardar = async () => {
    const presupuestoMin = formulario.presupuesto_min ? Number(formulario.presupuesto_min) : null;
    const presupuestoMax = formulario.presupuesto_max ? Number(formulario.presupuesto_max) : null;

    if (!formulario.titulo.trim()) {
      setError('El titulo del proyecto es obligatorio.');
      return;
    }
    if (!formulario.descripcion.trim() || formulario.descripcion.trim().length < 100) {
      setError('La descripcion debe tener al menos 100 caracteres.');
      return;
    }
    if (!formulario.tecnologias_requeridas.trim()) {
      setError('Indica al menos una tecnologia requerida o escribe sin preferencia.');
      return;
    }
    if (presupuestoMin === null || presupuestoMin < PRESUPUESTO_MINIMO) {
      setError('El presupuesto minimo debe ser de al menos ₡100.000.');
      return;
    }
    if (presupuestoMin !== null && presupuestoMax !== null && presupuestoMin > presupuestoMax) {
      setError('El presupuesto minimo no puede ser mayor al presupuesto maximo.');
      return;
    }

    setGuardando(true);
    setError('');
    try {
      await dashboardEmpresarioService.crearPropuesta({
        titulo: formulario.titulo,
        descripcion: formulario.descripcion,
        tecnologias_requeridas: formulario.tecnologias_requeridas,
        plazo_dias: Number(formulario.plazo_dias),
        presupuesto_min: presupuestoMin,
        presupuesto_max: presupuestoMax,
        usar_ia: location.state?.datosAgente?.usar_ia || 'NO',
        id_conversacion_ia: location.state?.datosAgente?.id_conversacion_ia || null,
      });
      navigate('/DashboardEmpresario/proyectos');
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo publicar el proyecto.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <DashboardLayout activePage="proyectos">
      <div className="de-page-heading">
        <p className="de-eyebrow">Empresa</p>
        <h1>Publicar Proyecto</h1>
        <p className="de-page-subtitle">Revisá los datos y publicá tu propuesta.</p>
      </div>

      <div className="de-panel">
        <div className="de-form-grid">
          <label className="de-form-field">
            <span>Titulo del proyecto</span>
            <input className="de-form-control" name="titulo" value={formulario.titulo} onChange={manejarCambio} maxLength={200} placeholder="Ej. Sitio web para reservas" />
          </label>

          <label className="de-form-field">
            <span>Descripcion / objetivo</span>
            <textarea className="de-form-control de-form-textarea" name="descripcion" value={formulario.descripcion} onChange={manejarCambio} placeholder="Describe el problema, alcance y resultado esperado." />
          </label>

          <label className="de-form-field">
            <span>Tecnologias requeridas</span>
            <input className="de-form-control" name="tecnologias_requeridas" value={formulario.tecnologias_requeridas} onChange={manejarCambio} placeholder="React, Node.js, PostgreSQL o sin preferencia" />
          </label>

          <div className="de-form-grid de-form-grid-2">
            <label className="de-form-field">
              <span className="de-form-label-with-help">
                Presupuesto minimo
                <button
                  className="de-help-button"
                  type="button"
                  onClick={() => setMostrarGuiaPrecios((visible) => !visible)}
                  aria-expanded={mostrarGuiaPrecios}
                  aria-label="Como puedes ponerle precio al proyecto"
                >
                  ?
                </button>
              </span>
              <input className="de-form-control" name="presupuesto_min" value={formulario.presupuesto_min} onChange={manejarCambio} type="number" min={PRESUPUESTO_MINIMO} step="1000" placeholder="100000" />
            </label>
            <label className="de-form-field">
              <span>Presupuesto maximo</span>
              <input className="de-form-control" name="presupuesto_max" value={formulario.presupuesto_max} onChange={manejarCambio} type="number" min={PRESUPUESTO_MINIMO} step="1000" placeholder="150000" />
            </label>
          </div>

          <label className="de-form-field">
            <span>Ventana de ofertas</span>
            <select className="de-form-control" name="plazo_dias" value={formulario.plazo_dias} onChange={manejarCambio}>
              <option value="5">5 dias</option>
              <option value="15">15 dias</option>
              <option value="30">30 dias</option>
            </select>
          </label>

          {error && <p className="de-data-state error">{error}</p>}
          <button className="de-btn-primary" type="button" onClick={guardar} disabled={guardando}>
            {guardando ? 'Publicando...' : 'Publicar Proyecto'}
          </button>
        </div>
      </div>

      {mostrarGuiaPrecios && (
        <div className="de-modal-backdrop" role="presentation" onClick={() => setMostrarGuiaPrecios(false)}>
          <section
            className="de-price-guide de-price-guide-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Como puedes ponerle precio al proyecto"
            onClick={(evento) => evento.stopPropagation()}
          >
            <div className="de-modal-header">
              <h3>Como puedes ponerle precio al proyecto</h3>
              <button className="de-modal-close" type="button" onClick={() => setMostrarGuiaPrecios(false)} aria-label="Cerrar guia de precios">
                ×
              </button>
            </div>
            <div className="de-price-guide-grid">
              <div>
                <strong>₡100.000 - ₡180.000</strong>
                <span>Ideal para landing pages, ajustes visuales, formularios simples o integraciones pequeñas porque el alcance suele ser corto y claro.</span>
              </div>
              <div>
                <strong>₡180.000 - ₡350.000</strong>
                <span>Funciona para sitios web de varias secciones, dashboards basicos o CRUDs pequeños porque requiere mas pantallas, validaciones y pruebas.</span>
              </div>
              <div>
                <strong>₡350.000 - ₡700.000</strong>
                <span>Recomendado para apps con autenticacion, backend, base de datos, roles o flujos completos porque implica mas arquitectura y coordinacion.</span>
              </div>
              <div>
                <strong>₡700.000+</strong>
                <span>Usalo para sistemas extensos, e-commerce, automatizaciones complejas o proyectos con despliegue y documentacion detallada.</span>
              </div>
            </div>
          </section>
        </div>
      )}
    </DashboardLayout>
  );
}

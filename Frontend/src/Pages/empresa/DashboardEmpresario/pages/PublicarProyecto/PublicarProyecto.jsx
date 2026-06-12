import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardEmpresarioService } from '../../../../../services/dashboardEmpresarioService';
import DashboardLayout from '../../components/DashboardLayout';

export default function PublicarProyecto() {
  const navigate = useNavigate();
  const [formulario, setFormulario] = useState({
    titulo: '',
    descripcion: '',
    tecnologias_requeridas: '',
    presupuesto_min: '',
    presupuesto_max: '',
    plazo_dias: '15',
  });
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

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
        usar_ia: 'NO',
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
        <h1>Publicar Proyecto</h1>
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
              <span>Presupuesto minimo</span>
              <input className="de-form-control" name="presupuesto_min" value={formulario.presupuesto_min} onChange={manejarCambio} type="number" min="0" step="0.01" placeholder="0.00" />
            </label>
            <label className="de-form-field">
              <span>Presupuesto maximo</span>
              <input className="de-form-control" name="presupuesto_max" value={formulario.presupuesto_max} onChange={manejarCambio} type="number" min="0" step="0.01" placeholder="0.00" />
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
    </DashboardLayout>
  );
}

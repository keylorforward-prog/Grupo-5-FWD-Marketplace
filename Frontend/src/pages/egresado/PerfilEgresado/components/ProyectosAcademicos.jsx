import { useEffect, useState } from 'react';
import { ArrowRight, Plus, Pencil, Trash2, Check, X } from 'lucide-react';

const CLAVE_ALMACENAMIENTO = 'proyectosAcademicos';

const bordesDisponibles = ['bordeAzul', 'bordeMorado', 'bordeAqua', 'bordeMagenta'];

const proyectosIniciales = [
  {
    id: 1,
    titulo: 'API Gestión Universitaria',
    descripcion:
      'Proyecto de fin de semestre construido con Node.js y Express para la administración de matrículas.',
    enlace: 'github.com/alexr/api-univ',
    borde: 'bordeAzul',
  },
  {
    id: 2,
    titulo: 'App de Estudio',
    descripcion: 'Plataforma estudiantil para compartir apuntes y tareas usando React y Firebase.',
    enlace: 'github.com/alexr/study-app',
    borde: 'bordeMorado',
  },
];

const generarId = () => Date.now() + Math.floor(Math.random() * 1000);

function ProyectosAcademicos() {
  const [proyectos, setProyectos] = useState(proyectosIniciales);
  const [editandoId, setEditandoId] = useState(null);
  const [borrador, setBorrador] = useState(null);

  useEffect(() => {
    const guardado = localStorage.getItem(CLAVE_ALMACENAMIENTO);
    if (guardado) setProyectos(JSON.parse(guardado));
  }, []);

  useEffect(() => {
    localStorage.setItem(CLAVE_ALMACENAMIENTO, JSON.stringify(proyectos));
  }, [proyectos]);

  const iniciarEdicion = (proyecto) => {
    setEditandoId(proyecto.id);
    setBorrador({ ...proyecto });
  };

  const cancelar = () => {
    setEditandoId(null);
    setBorrador(null);
  };

  const guardar = () => {
    if (!borrador?.titulo.trim()) return;
    setProyectos((prev) =>
      prev.some((p) => p.id === borrador.id)
        ? prev.map((p) => (p.id === borrador.id ? borrador : p))
        : [...prev, borrador]
    );
    cancelar();
  };

  const eliminar = (id) => {
    setProyectos((prev) => prev.filter((p) => p.id !== id));
  };

  const agregarNuevo = () => {
    const nuevo = {
      id: generarId(),
      titulo: '',
      descripcion: '',
      enlace: '',
      borde: bordesDisponibles[proyectos.length % bordesDisponibles.length],
    };
    setEditandoId(nuevo.id);
    setBorrador(nuevo);
  };

  return (
    <>
      <div className="encabezadoProyectosAcademicos">
        <h3 className="tituloProyectosSeccion">Proyectos Académicos y Prácticas</h3>
        <button type="button" className="botonAgregarProyecto" onClick={agregarNuevo}>
          <Plus size={14} /> Agregar
        </button>
      </div>

      <div className="cuadriculaProyectosPersonales">
        {proyectos.map((proyecto) => {
          const enEdicion = editandoId === proyecto.id;
          return (
            <div
              key={proyecto.id}
              className={`tarjetaProyectoPersonal ${proyecto.borde}`}
            >
              {enEdicion ? (
                <div className="formularioProyectoPersonal">
                  <input
                    className="entradaProyectoPersonal"
                    placeholder="Título"
                    value={borrador.titulo}
                    onChange={(e) => setBorrador((b) => ({ ...b, titulo: e.target.value }))}
                  />
                  <textarea
                    className="textareaProyectoPersonal"
                    placeholder="Descripción"
                    rows={3}
                    value={borrador.descripcion}
                    onChange={(e) => setBorrador((b) => ({ ...b, descripcion: e.target.value }))}
                  />
                  <input
                    className="entradaProyectoPersonal"
                    placeholder="URL o repo"
                    value={borrador.enlace}
                    onChange={(e) => setBorrador((b) => ({ ...b, enlace: e.target.value }))}
                  />
                  <div className="accionesProyectoPersonal">
                    <button type="button" className="botonGuardarMini" onClick={guardar}>
                      <Check size={14} /> Guardar
                    </button>
                    <button type="button" className="botonCancelarMini" onClick={cancelar}>
                      <X size={14} /> Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="accionesTarjetaProyecto">
                    <button
                      type="button"
                      onClick={() => iniciarEdicion(proyecto)}
                      aria-label="Editar"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => eliminar(proyecto.id)}
                      className="peligro"
                      aria-label="Eliminar"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <h4 className="tituloProyectoPersonal">{proyecto.titulo}</h4>
                  <p className="descripcionProyectoPersonal">{proyecto.descripcion}</p>
                  <div className="enlaceProyectoPersonal">
                    <span className="rutaEnlace">{proyecto.enlace}</span>
                    <ArrowRight size={16} className="iconoFlecha" />
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

export default ProyectosAcademicos;

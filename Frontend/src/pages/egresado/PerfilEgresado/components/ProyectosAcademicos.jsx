import React from 'react';
import { ArrowRight } from 'lucide-react';

const ProyectosAcademicos = () => {
  return (
    <>
      <h3 className="tituloProyectosSeccion" style={{ color: 'var(--ink-strong)', marginTop: '10px', fontSize: '18px', fontWeight: '700' }}>Proyectos Académicos y Prácticas</h3>
      
      <div className="cuadriculaProyectosPersonales">
        <div className="tarjetaProyectoPersonal bordeAzul">
          <h4 className="tituloProyectoPersonal">API Gestión Universitaria</h4>
          <p className="descripcionProyectoPersonal">Proyecto de fin de semestre construido con Node.js y Express para la administración de matrículas.</p>
          <div className="enlaceProyectoPersonal">
            <span className="rutaEnlace">github.com/alexr/api-univ</span>
            <ArrowRight size={16} className="iconoFlecha" />
          </div>
        </div>

        <div className="tarjetaProyectoPersonal bordeMorado">
          <h4 className="tituloProyectoPersonal">App de Estudio</h4>
          <p className="descripcionProyectoPersonal">Plataforma estudiantil para compartir apuntes y tareas usando React y Firebase.</p>
          <div className="enlaceProyectoPersonal">
            <span className="rutaEnlace">github.com/alexr/study-app</span>
            <ArrowRight size={16} className="iconoFlecha" />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProyectosAcademicos;

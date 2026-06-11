import { FileText, MoreVertical } from 'lucide-react';

const postulacionesSimuladas = [
  {
    id: 1,
    iniciales: 'SF',
    colorFondo: '#e0f2fe',
    colorTexto: '#0284c7',
    rol: 'Pasantía Frontend Developer',
    empresa: 'Skyline Fintech',
    tiempo: 'Hace 2 días',
    estado: 'ACEPTADA',
    tipoEstado: 'aceptada'
  },
  {
    id: 2,
    iniciales: 'GC',
    colorFondo: '#f3e8ff',
    colorTexto: '#7e22ce',
    rol: 'Práctica Profesional Node.js',
    empresa: 'Global Connect',
    tiempo: 'Hace 5 días',
    estado: 'VISTA',
    tipoEstado: 'vista'
  },
  {
    id: 3,
    iniciales: 'LV',
    colorFondo: '#f1f5f9',
    colorTexto: '#475569',
    rol: 'Trainee Fullstack Web',
    empresa: 'Lumina Ventures',
    tiempo: 'Hace 1 semana',
    estado: 'ENVIADA',
    tipoEstado: 'enviada'
  }
];

const TarjetaPostulaciones = () => {
  return (
    <div className="tarjetaPostulaciones">
      <div className="encabezadoPostulaciones">
        <div className="tituloIconoPostulaciones">
          <div className="iconoDocumento">
            <FileText size={20} />
          </div>
          <h3 className="tituloTarjetaSeccion">Mis Postulaciones a Prácticas</h3>
        </div>
        <span className="conteoPostulaciones">3 Activas</span>
      </div>

      <div className="listaPostulaciones">
        {postulacionesSimuladas.map((postulacion) => (
          <div key={postulacion.id} className="itemPostulacion">
            <div className="infoPrimariaPostulacion">
              <div className="avatarEmpresa" style={{ backgroundColor: postulacion.colorFondo, color: postulacion.colorTexto }}>
                {postulacion.iniciales}
              </div>
              <div className="detallesRol">
                <h4 className="nombreRol">{postulacion.rol}</h4>
                <p className="empresaTiempo">{postulacion.empresa} • {postulacion.tiempo}</p>
              </div>
            </div>
            
            <div className="estadoPostulacion">
              <span className={`etiquetaEstadoPostulacion ${postulacion.tipoEstado}`}>
                {postulacion.estado}
              </span>
              <button className="botonOpciones">
                <MoreVertical size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="piePostulaciones">
        <button className="botonVerHistorial">Ver todo el historial de postulaciones</button>
      </div>
    </div>
  );
};

export default TarjetaPostulaciones;

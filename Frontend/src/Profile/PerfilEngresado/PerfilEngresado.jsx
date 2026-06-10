import React from 'react';
import { Pencil, Globe, Link as LinkIcon, Book, FileText, MoreVertical, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import './PerfilEngresado.css';
import ProfileDefaultImage from '../../../../public/Imgs/ProfileDefaultImage.png';

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

function PerfilEngresado() {
  return (
    
    <div className="contenedorPerfil">

        {/* BANNER SUPERIOR */}
        <div className="bannerSuperior">

            <Link to="/DashboardEngresado" className="volverDashboard">
                <ArrowLeft size={20} />
                <span>Volver al Dashboard</span>
            </Link>

            <div className="contenidoBanner">
                <span className="etiquetaBanner">DASHBOARD DE TALENTO</span>
                <h1 className="tituloBanner">Mi Perfil Estudiantil</h1>
            </div>
                
            <div className="decoracionBanner"></div>
        </div>



        {/* ============================================
            LAYOUT PRINCIPAL
            ============================================ */
        }
        <main className="contenidoPrincipalPerfil">

            {/* ============================================
                COLUMNA IZQUIERDA
                ===========================================*/
            }
            <aside className="columnaLateral">

                <div className="tarjetaUsuario">

                    <div className="contenedorAvatar">

                        {/* IMPLEMENTAR AWS S3 EN UN FUTURO */}
                        <img src={ProfileDefaultImage} alt="Foto de perfil" className="imagenPerfil" />

                        <button className="botonEditarAvatar">
                            <Pencil size={14} />
                        </button>
                    </div>
                    
                    <h2 className="nombreUsuario">Alex Rivera</h2>
                    <p className="rolUsuario">Estudiante de Desarrollo de Software</p>
                    
                    <div className="enlacesUsuario">
                    <button className="botonEnlace">
                        <Globe size={16} />
                        Portfolio
                    </button>
                    <button className="botonEnlace">
                        <LinkIcon size={16} />
                        LinkedIn
                    </button>
                    </div>
                </div>

                <div className="tarjetaStack">
                    <h3 className="tituloTarjeta">
                    <Book size={20} className="iconoTitulo" />
                    Aprendiendo
                    </h3>
                    <div className="contenedorEtiquetas">
                    <span className="etiquetaTecnologia fondoAzulClaro">React.js</span>
                    <span className="etiquetaTecnologia fondoAzulMedio">Node.js</span>
                    <span className="etiquetaTecnologia fondoAzulOscuro">HTML & CSS</span>
                    <span className="etiquetaTecnologia fondoMorado">JavaScript</span>
                    <span className="etiquetaTecnologia fondoNaranja">PostgreSQL</span>
                    <span className="etiquetaTecnologia fondoMoradoClaro">Git</span>
                    </div>
                </div>
            </aside>

            {/* Columna Derecha */}
            <section className="columnaContenido">
            <div className="tarjetaBio">
                <div className="encabezadoBio">
                <h3 className="tituloBio">Bio</h3>
                <button className="botonEditarTexto">
                    <Pencil size={14} />
                    Editar
                </button>
                </div>
                <p className="textoBio">
                Soy un estudiante apasionado por la tecnología y la creación de productos digitales, actualmente cursando mis estudios en Desarrollo de Software. Disfruto aprendiendo nuevas tecnologías como React y Node.js en mi tiempo libre. Estoy buscando mi primera oportunidad como practicante o desarrollador Junior para aportar mi energía y seguir creciendo profesionalmente en un entorno colaborativo.
                </p>
            </div>

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

            </section>
      </main>
    </div>
  );
}

export default PerfilEngresado;
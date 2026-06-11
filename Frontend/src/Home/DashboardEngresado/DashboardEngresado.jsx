import React, { useState } from 'react';
import { Folder, Briefcase, Bot, SlidersHorizontal, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../Components/Header/Header';
import './DashboardEngresado.css';

// Mock Data para visualizar como en la imagen
const proyectosSimulados = [
  {
    id: 1,
    titulo: 'E-commerce con Next.js',
    estado: 'ACTIVO',
    descripcion: 'Desarrollo de tienda online con carrito de compras, pagos y panel de administración.',
    tecnologias: ['Next.js', 'React', 'Stripe', 'Tailwind CSS'],
    presupuesto: '$1,200 - $1,800',
    entrega: '7 - 14 días',
    iconoUrl: 'https://cdn-icons-png.flaticon.com/512/3081/3081986.png', // Mock icon
    tipoEstado: 'activo'
  },
  {
    id: 2,
    titulo: 'Dashboard de Analíticas',
    estado: 'ACTIVO',
    descripcion: 'Dashboard interactivo para visualización de datos financieros y métricas de negocio.',
    tecnologias: ['React', 'TypeScript', 'Chart.js', 'Node.js'],
    presupuesto: '$2,000 - $3,200',
    entrega: '10 - 20 días',
    iconoUrl: 'https://cdn-icons-png.flaticon.com/512/1541/1541433.png',
    tipoEstado: 'activo'
  },
  {
    id: 3,
    titulo: 'App Móvil de Tareas',
    estado: 'PENDIENTE',
    descripcion: 'Aplicación móvil para gestión de tareas y colaboración en equipo.',
    tecnologias: ['React Native', 'Firebase', 'Redux'],
    presupuesto: '$800 - $1,200',
    entrega: '5 - 10 días',
    iconoUrl: 'https://cdn-icons-png.flaticon.com/512/5655/5655312.png',
    tipoEstado: 'pendiente'
  },
  {
    id: 4,
    titulo: 'API para Gestión de Usuarios',
    estado: 'ACTIVO',
    descripcion: 'API REST segura con autenticación JWT y roles de usuario.',
    tecnologias: ['Node.js', 'Express', 'MongoDB', 'JWT'],
    presupuesto: '$600 - $1,000',
    entrega: '5 - 12 días',
    iconoUrl: 'https://cdn-icons-png.flaticon.com/512/2111/2111288.png',
    tipoEstado: 'activo'
  },
  {
    id: 5,
    titulo: 'Landing Page Corporativa',
    estado: 'PENDIENTE',
    descripcion: 'Diseño y desarrollo de landing page moderna y responsiva.',
    tecnologias: ['HTML', 'CSS', 'JavaScript', 'GSAP'],
    presupuesto: '$300 - $600',
    entrega: '3 - 7 días',
    iconoUrl: 'https://cdn-icons-png.flaticon.com/512/1005/1005141.png',
    tipoEstado: 'pendiente'
  },
  {
    id: 6,
    titulo: 'Sistema de Autenticación',
    estado: 'ACTIVO',
    descripcion: 'Implementación de autenticación social y verificación en dos pasos.',
    tecnologias: ['Next.js', 'Auth0', 'PostgreSQL'],
    presupuesto: '$500 - $900',
    entrega: '4 - 9 días',
    iconoUrl: 'https://cdn-icons-png.flaticon.com/512/6301/6301509.png',
    tipoEstado: 'activo'
  }
];


function DashboardEngresado() {
  const [categoriaActiva, setCategoriaActiva] = useState('explorar');

  const enlacesDashboard = [
    { clave: 'explorar', etiqueta: 'Explorar', onClick: (e) => { e.preventDefault(); setCategoriaActiva('explorar'); } },
    { clave: 'proyectos', etiqueta: 'Proyectos FWD' },
    { clave: 'empleos', etiqueta: 'Empleos Junior' },
    { clave: 'ia', etiqueta: 'Oportunidades IA', badge: 'IA' },
    { clave: 'misProyectos', etiqueta: 'Mis Proyectos' },
    { clave: 'mensajes', etiqueta: 'Mensajes', badge: '2' },
  ];

  return (
    <div className="contenedorDashboard">
      <Header/>

      <main className="contenidoPrincipal">
        {/* Sección Hero */}
        <section className="seccionHero">
          <div className="textoHero">
            <h1 className="tituloHero">Encuentra tu <span className="textoResaltado">próximo desafío</span></h1>
            <p className="subtituloHero">Explora proyectos freelance, empleos y oportunidades recomendadas para ti.</p>
            
            <div className="contenedorBusqueda">
              <div className="barraBusqueda">
                <Search size={20} color="#6b7280" />
                <input type="text" placeholder="Buscar por título, tecnología o habilidad..." className="entradaBusqueda" />
              </div>
              <button className="botonFiltros">
                <Filter size={18} />
                Filtros
              </button>
            </div>
          </div>
          
          <div className="ilustracionHero">
             {/* Imagen de ilustración (simulada) */}
             <div className="ilustracionFalsa"></div>
          </div>
        </section>

        {/* Categorías Rápidas */}
        <section className="categoriasRapidas">
          <div className="tarjetaCategoria activa">
            <div className="iconoCategoria azul">
              <Folder size={24} />
            </div>
            <div className="infoCategoria">
              <h3 className="tituloCategoria">Proyectos FWD</h3>
              <p className="descripcionCategoria">Proyectos freelance publicados en la plataforma.</p>
            </div>
          </div>

          <div className="tarjetaCategoria">
            <div className="iconoCategoria gris">
               <Briefcase size={24} />
            </div>
            <div className="infoCategoria">
              <h3 className="tituloCategoria">Empleos Junior</h3>
              <p className="descripcionCategoria">Puestos de trabajo, pasantías y prácticas.</p>
            </div>
          </div>

          <div className="tarjetaCategoria">
            <div className="iconoCategoria verde">
              <Bot size={24} />
            </div>
            <div className="infoCategoria">
              <h3 className="tituloCategoria">Oportunidades IA <span className="etiquetaIaPequena">IA</span></h3>
              <p className="descripcionCategoria">Ofertas externas recomendadas para ti.</p>
            </div>
          </div>
        </section>

        {/* Sección de Listado */}
        <section className="seccionListado">
          {/* Sidebar de Filtros */}
          <aside className="barraLateralFiltros">
            <div className="encabezadoFiltros">
              <h4 className="tituloFiltros">
                <SlidersHorizontal size={18} />
                Filtrar resultados
              </h4>
              <button className="botonLimpiar">Limpiar</button>
            </div>

            <div className="grupoFiltro">
              <label className="etiquetaFiltro">Categoría</label>
              <select className="seleccionadorFiltro">
                <option>Todas las categorías</option>
              </select>
            </div>

            <div className="grupoFiltro">
              <label className="etiquetaFiltro">Tecnologías</label>
              <select className="seleccionadorFiltro">
                <option>Todas las tecnologías</option>
              </select>
            </div>

            <div className="grupoFiltro">
              <label className="etiquetaFiltro">Presupuesto (USD)</label>
              <div className="contenedorRango">
                <div className="barraRango">
                   <div className="rangoActivo"></div>
                   <div className="controladorRango izquierdo"></div>
                   <div className="controladorRango derecho"></div>
                </div>
                <div className="valoresRango">
                  <span className="cajaValor">$300</span>
                  <span className="cajaValor">$5,000+</span>
                </div>
              </div>
            </div>

            <div className="grupoFiltro">
              <label className="etiquetaFiltro">Duración</label>
              <select className="seleccionadorFiltro">
                <option>Cualquier duración</option>
              </select>
            </div>

            <div className="grupoFiltro">
              <label className="etiquetaFiltro">Modalidad</label>
              <div className="opcionesModalidad">
                <label className="opcionCheckbox">
                  <input type="checkbox" defaultChecked />
                  <span className="casillaPersonalizada"></span>
                  Remoto
                </label>
                <label className="opcionCheckbox">
                  <input type="checkbox" />
                  <span className="casillaPersonalizada"></span>
                  Híbrido
                </label>
                <label className="opcionCheckbox">
                  <input type="checkbox" />
                  <span className="casillaPersonalizada"></span>
                  Presencial
                </label>
              </div>
            </div>
          </aside>

          {/* Resultados y Cuadrícula */}
          <div className="contenedorResultados">
            <div className="encabezadoResultados">
              <span className="conteoProyectos">98 proyectos encontrados</span>
              <div className="ordenarResultados">
                <span className="etiquetaOrdenar">Ordenar por:</span>
                <select className="seleccionadorOrdenar">
                  <option>Más recientes</option>
                </select>
              </div>
            </div>

            <div className="cuadriculaProyectos">
              {proyectosSimulados.map((proyecto) => (
                <div key={proyecto.id} className="tarjetaProyecto">
                  <div className="encabezadoTarjeta">
                    <div className="iconoProyectoContenedor">
                      <img src={proyecto.iconoUrl} alt="Icono" className="iconoProyecto" />
                    </div>
                    <div className="tituloTarjetaContenedor">
                      <h3 className="tituloProyecto">{proyecto.titulo}</h3>
                      <span className={`etiquetaEstado ${proyecto.tipoEstado}`}>
                        {proyecto.estado}
                      </span>
                    </div>
                  </div>
                  
                  <p className="descripcionProyecto">{proyecto.descripcion}</p>
                  
                  <div className="etiquetasTecnologias">
                    {proyecto.tecnologias.map((tech, index) => (
                      <span key={index} className="etiquetaTecnologia">{tech}</span>
                    ))}
                  </div>

                  <div className="pieTarjeta">
                    <div className="infoPie">
                      <div className="datoPie">
                        <span className="etiquetaDato">Presupuesto</span>
                        <span className="valorDato">{proyecto.presupuesto}</span>
                      </div>
                      <div className="datoPie">
                        <span className="etiquetaDato">Entrega</span>
                        <span className="valorDato">{proyecto.entrega}</span>
                      </div>
                    </div>
                    <button className="botonDetalle">Ver detalle</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="paginacionResultados">
              <button className="botonPagina flecha">&lt;</button>
              <button className="botonPagina activa">1</button>
              <button className="botonPagina">2</button>
              <button className="botonPagina">3</button>
              <button className="botonPagina">4</button>
              <span className="puntosPaginacion">...</span>
              <button className="botonPagina">9</button>
              <button className="botonPagina flecha">&gt;</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default DashboardEngresado;
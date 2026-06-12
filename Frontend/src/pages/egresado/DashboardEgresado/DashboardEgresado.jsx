import { useEffect, useState, useMemo } from 'react';
import { Folder, Briefcase, Bot, Search, X } from 'lucide-react';
import LayoutEgresado from '../LayoutEgresado';
import BarraLateralFiltros from './components/BarraLateralFiltros';
import CuadriculaProyectos from './components/CuadriculaProyectos';
import { proyectosSimulados, opcionesOrden } from '../../../data/proyectosEgresado';
import { useFiltroProyectos } from './useFiltroProyectos';
import { egresadoService } from '../../../services/egresadoService';
import './styles/DashboardEgresado.css';

const PROYECTOS_POR_PAGINA = 4;

const categoriasRapidas = [
  {
    id: 'todas',
    color: 'azul',
    icono: Folder,
    titulo: 'Proyectos FWD',
    descripcion: 'Proyectos freelance publicados en la plataforma.',
  },
  {
    id: 'web',
    color: 'naranja',
    icono: Briefcase,
    titulo: 'Empleos Junior',
    descripcion: 'Puestos de trabajo, pasantías y prácticas.',
  },
  {
    id: 'data',
    color: 'aqua',
    icono: Bot,
    titulo: 'Oportunidades IA',
    descripcion: 'Ofertas externas recomendadas para ti.',
    etiqueta: 'IA',
  },
];

const filtrosIniciales = {
  busqueda: '',
  categoriaActiva: 'todas',
  tecnologia: '',
  presupuestoMin: 0,
  presupuestoMax: 5000,
  duracion: 'cualquiera',
  modalidades: ['remoto'],
  orden: 'recientes',
};

function DashboardEgresado() {
  const [proyectos, setProyectos] = useState(proyectosSimulados);
  const [estadoDatos, setEstadoDatos] = useState({ cargando: true, usaRespaldo: false });
  const [filtros, setFiltros] = useState(filtrosIniciales);
  const [paginaActual, setPaginaActual] = useState(1);

  useEffect(() => {
    let activo = true;

    egresadoService.listarPropuestas()
      .then((propuestas) => {
        if (!activo) return;
        if (propuestas.length > 0) {
          setProyectos(propuestas);
          setEstadoDatos({ cargando: false, usaRespaldo: false });
        } else {
          setEstadoDatos({ cargando: false, usaRespaldo: true });
        }
      })
      .catch(() => {
        if (!activo) return;
        setEstadoDatos({ cargando: false, usaRespaldo: true });
      });

    return () => {
      activo = false;
    };
  }, []);

  const proyectosFiltrados = useFiltroProyectos(proyectos, filtros);

  const totalPaginas = Math.max(1, Math.ceil(proyectosFiltrados.length / PROYECTOS_POR_PAGINA));
  const proyectosPagina = useMemo(() => {
    const inicio = (paginaActual - 1) * PROYECTOS_POR_PAGINA;
    return proyectosFiltrados.slice(inicio, inicio + PROYECTOS_POR_PAGINA);
  }, [proyectosFiltrados, paginaActual]);

  const actualizarFiltros = (cambios) => {
    setFiltros((prev) => ({ ...prev, ...cambios }));
    setPaginaActual(1);
  };

  const limpiarFiltros = () => {
    setFiltros(filtrosIniciales);
    setPaginaActual(1);
  };

  const seleccionarCategoria = (id) => actualizarFiltros({ categoriaActiva: id });

  return (
    <LayoutEgresado>
      <div className="contenidoPrincipal fwd-fondo-decorativo">
        <section className="seccionHero fwd-animar-entrada">
          <div className="textoHero">
            <span className="kickerHero">Marketplace FWD</span>
            <h1 className="tituloHero">
              Encuentra tu <span className="textoResaltado fwd-texto-gradiente">próximo desafío</span>
            </h1>
            <p className="subtituloHero">
              Explora proyectos freelance, empleos y oportunidades recomendadas para ti.
            </p>
            <div className="contenedorBusqueda">
              <div className="barraBusqueda">
                <Search size={20} className="iconoBusqueda" />
                <input
                  type="text"
                  placeholder="Buscar por título, tecnología o habilidad..."
                  className="entradaBusqueda"
                  value={filtros.busqueda}
                  onChange={(e) => actualizarFiltros({ busqueda: e.target.value })}
                />
                {filtros.busqueda && (
                  <button
                    type="button"
                    className="botonLimpiarBusqueda"
                    onClick={() => actualizarFiltros({ busqueda: '' })}
                    aria-label="Limpiar búsqueda"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="ilustracionHero">
            <div className="orbeHero"></div>
            <img
              src="/Imgs/Comunidad icon-01.png"
              alt="Comunidad FWD"
              className="ilustracionComunidad"
            />
          </div>
        </section>

        <section className="categoriasRapidas fwd-stagger">
          {categoriasRapidas.map(({ id, color, icono: Icono, titulo, descripcion, etiqueta }) => {
            const activa = filtros.categoriaActiva === id;
            return (
              <button
                key={id}
                type="button"
                className={`tarjetaCategoria ${activa ? 'activa' : ''}`}
                onClick={() => seleccionarCategoria(id)}
              >
                <div className={`iconoCategoria ${color}`}>
                  <Icono size={24} />
                </div>
                <div className="infoCategoria">
                  <h3 className="tituloCategoria">
                    {titulo}
                    {etiqueta && <span className="etiquetaIaPequena">{etiqueta}</span>}
                  </h3>
                  <p className="descripcionCategoria">{descripcion}</p>
                </div>
              </button>
            );
          })}
        </section>

        <section className="seccionListado fwd-animar-fade">
          <BarraLateralFiltros
            filtros={filtros}
            onCambio={actualizarFiltros}
            onLimpiar={limpiarFiltros}
          />
          <div className="columnaResultadosEgresado">
            {estadoDatos.cargando && (
              <div className="avisoDatosLocales">Cargando oportunidades...</div>
            )}
            {estadoDatos.usaRespaldo && (
              <div className="avisoDatosLocales">
                Mostrando oportunidades de ejemplo mientras conectamos con el servidor.
              </div>
            )}
            <CuadriculaProyectos
              proyectos={proyectosPagina}
              total={proyectosFiltrados.length}
              orden={filtros.orden}
              onOrdenCambio={(orden) => actualizarFiltros({ orden })}
              opcionesOrden={opcionesOrden}
              paginaActual={paginaActual}
              totalPaginas={totalPaginas}
              onPaginaCambio={setPaginaActual}
            />
          </div>
        </section>
      </div>
    </LayoutEgresado>
  );
}

export default DashboardEgresado;

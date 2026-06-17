import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Compass, TrendingUp, Users, Briefcase } from 'lucide-react';
import { opcionesOrden } from '../../../../../data/proyectosEgresado';
import { egresadoService } from '../../../../../services/egresadoService';
import { egresadoDashboardService } from '../../../../../services/egresadoDashboardService';
import { useFiltroProyectos } from '../../hooks/useFiltroProyectos';
import BarraLateralFiltros from '../../components/BarraLateralFiltros';
import CuadriculaProyectos from '../../components/CuadriculaProyectos';
import '../../styles/DashboardEgresado.css';

const FILTROS_INICIALES = {
  busqueda: '',
  categoriaActiva: 'todas',
  tecnologia: '',
  presupuestoMin: '',
  presupuestoMax: '',
  duracion: 'cualquiera',
  modalidades: [],
  orden: 'recientes',
};

const ITEMS_POR_PAGINA = 4;

export default function ExplorarProyectos() {
  const { t } = useTranslation();
  const [filtros, setFiltros] = useState(FILTROS_INICIALES);
  const [paginaActual, setPaginaActual] = useState(1);
  const [proyectos, setProyectos] = useState([]);
  const [idsPostulados, setIdsPostulados] = useState(new Set());
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let activo = true;
    Promise.all([
      egresadoService.listarPropuestas(),
      egresadoDashboardService.obtenerPostulaciones(),
    ])
      .then(([proyectosData, postulacionesData]) => {
        if (!activo) return;
        setProyectos(proyectosData);
        setIdsPostulados(new Set(
          (postulacionesData || []).map((p) => Number(p.id_propuesta))
        ));
      })
      .catch(() => { if (activo) setProyectos([]); })
      .finally(() => { if (activo) setCargando(false); });
    return () => { activo = false; };
  }, []);

  const proyectosFiltrados = useFiltroProyectos(proyectos, filtros);

  const totalPaginas = Math.max(1, Math.ceil(proyectosFiltrados.length / ITEMS_POR_PAGINA));
  const proyectosPagina = useMemo(
    () => proyectosFiltrados.slice((paginaActual - 1) * ITEMS_POR_PAGINA, paginaActual * ITEMS_POR_PAGINA),
    [proyectosFiltrados, paginaActual]
  );

  const manejarCambioFiltros = (cambio) => {
    setFiltros((prev) => ({ ...prev, ...cambio }));
    setPaginaActual(1);
  };

  const limpiarFiltros = () => {
    setFiltros(FILTROS_INICIALES);
    setPaginaActual(1);
  };

  return (
    <div className="contenidoPrincipal">
      <section className="seccionHero">
        <div className="textoHero">
          <span className="kickerHero">{t('egresadoExplorar.hero.kicker')}</span>
          <h1 className="tituloHero">
            {t('egresadoExplorar.hero.titleStart')} <span className="textoResaltado">{t('egresadoExplorar.hero.titleHighlight')}</span>
          </h1>
          <p className="subtituloHero">
            {t('egresadoExplorar.hero.subtitle')}
          </p>
          <div className="contenedorBusqueda">
            <div className="barraBusqueda">
              <Search size={18} className="iconoBusqueda" />
              <input
                type="text"
                className="entradaBusqueda"
                placeholder={t('egresadoExplorar.hero.searchPlaceholder')}
                value={filtros.busqueda}
                onChange={(e) => manejarCambioFiltros({ busqueda: e.target.value })}
              />
              {filtros.busqueda && (
                <button
                  type="button"
                  className="botonLimpiarBusqueda"
                  onClick={() => manejarCambioFiltros({ busqueda: '' })}
                  aria-label={t('egresadoExplorar.hero.clearSearch')}
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="ilustracionHero">
          <div className="orbeHero" />
          <img
            src="/Imgs/Comunidad icon-01.png"
            alt="Comunidad FWD"
            className="ilustracionComunidad"
            width="260"
            height="260"
            decoding="async"
          />
        </div>
      </section>

      <div className="categoriasRapidas">
        {[
          { key: 'todas', label: t('egresadoExplorar.categories.todas.label'), icon: Compass, desc: t('egresadoExplorar.categories.todas.desc'), color: 'azul' },
          { key: 'web', label: t('egresadoExplorar.categories.web.label'), icon: Briefcase, desc: t('egresadoExplorar.categories.web.desc'), color: 'naranja' },
          { key: 'backend', label: t('egresadoExplorar.categories.backend.label'), icon: TrendingUp, desc: t('egresadoExplorar.categories.backend.desc'), color: 'aqua' },
          { key: 'movil', label: t('egresadoExplorar.categories.movil.label'), icon: Users, desc: t('egresadoExplorar.categories.movil.desc'), color: 'morado' },
          { key: 'data', label: t('egresadoExplorar.categories.data.label'), icon: TrendingUp, desc: t('egresadoExplorar.categories.data.desc'), color: 'magenta' },
          { key: 'diseno', label: t('egresadoExplorar.categories.diseno.label'), icon: Compass, desc: t('egresadoExplorar.categories.diseno.desc'), color: 'amarillo' },
        ].map(({ key, label, icon: Icon, desc, color }) => (
          <button
            key={key}
            type="button"
            className={`tarjetaCategoria ${filtros.categoriaActiva === key ? 'activa' : ''}`}
            onClick={() => manejarCambioFiltros({ categoriaActiva: key })}
          >
            <div className={`iconoCategoria ${color}`}>
              <Icon size={20} />
            </div>
            <div className="infoCategoria">
              <span className="tituloCategoria">{label}</span>
              <span className="descripcionCategoria">{desc}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="seccionListado">
        <BarraLateralFiltros
          filtros={filtros}
          onCambio={manejarCambioFiltros}
          onLimpiar={limpiarFiltros}
        />
        <div className="columnaResultadosEgresado">
          {cargando ? (
            <div className="estadoVacio">
              <p>{t('egresadoExplorar.loading')}</p>
            </div>
          ) : (
            <CuadriculaProyectos
              proyectos={proyectosPagina}
              total={proyectosFiltrados.length}
              orden={filtros.orden}
              onOrdenCambio={(nuevoOrden) => manejarCambioFiltros({ orden: nuevoOrden })}
              opcionesOrden={opcionesOrden}
              paginaActual={paginaActual}
              totalPaginas={totalPaginas}
              onPaginaCambio={setPaginaActual}
              idsPostulados={idsPostulados}
            />
          )}
        </div>
      </div>
    </div>
  );
}

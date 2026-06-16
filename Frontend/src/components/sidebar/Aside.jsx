import { NavLink, useNavigate } from 'react-router-dom';
import { Compass, FolderKanban, MessageCircle, Settings, HelpCircle, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { RUTAS } from '../../routes/rutas';
import './Aside.css';

const usuarioPorDefecto = {
  nombre: 'Alex Rivera',
  rol: 'JUNIOR DEVELOPER',
  avatar: '/Imgs/ProfileDefaultImage.png',
};

const itemsPorDefecto = [
  { etiqueta: 'Explorar', icono: Compass, ruta: RUTAS.egresadoDashboard },
  { etiqueta: 'Mi Perfil', icono: User, ruta: RUTAS.egresadoPerfil },
  { etiqueta: 'Mis Postulaciones', icono: FolderKanban, ruta: RUTAS.egresadoPerfil },
  { etiqueta: 'Mensajes', icono: MessageCircle, ruta: RUTAS.mensajes },
  { etiqueta: 'Configuración', icono: Settings, ruta: RUTAS.egresadoConfiguracion },
];

function Aside({ items = itemsPorDefecto, usuario }) {
  const navegar = useNavigate();
  let auth = null;
  try {
    auth = useAuth();
  } catch {
    auth = null;
  }

  const usuarioActivo = usuario ?? {
    nombre: auth?.user?.nombre || auth?.user?.name || usuarioPorDefecto.nombre,
    rol: auth?.user?.rol || auth?.user?.role || usuarioPorDefecto.rol,
    avatar: auth?.user?.avatar || usuarioPorDefecto.avatar,
  };

  const manejarCerrarSesion = async (e) => {
    e.preventDefault();
    try {
      if (typeof auth?.logout === 'function') await auth.logout();
    } catch {
      // ignorar fallos del backend
    } finally {
      navegar(RUTAS.login, { replace: true });
    }
  };

  return (
    <aside className="barraLateral">
      <div className="barraLateralLogo">
        <img
          src="/Imgs/Logotipo/Digital/FWD - Logotipo - Slogan.svg"
          alt="FWD - Fundación Forward"
          className="barraLateralLogoImagen"
        />
      </div>

      <div className="barraLateralPerfil">
        <NavLink to={RUTAS.egresadoPerfil} className="barraLateralPerfilEnlace">
          <img
            src={usuarioActivo.avatar}
            alt={usuarioActivo.nombre}
            className="barraLateralPerfilAvatar"
          />
          <div className="barraLateralPerfilInfo">
            <span className="barraLateralPerfilNombre">{usuarioActivo.nombre}</span>
            <span className="barraLateralPerfilRol">{usuarioActivo.rol}</span>
          </div>
        </NavLink>
      </div>

      <nav className="barraLateralNav">
        {items.map(({ etiqueta, icono: Icono, ruta }) => (
          <NavLink
            key={etiqueta}
            to={ruta}
            end={ruta === RUTAS.egresadoDashboard}
            className={({ isActive }) =>
              `barraLateralEnlace${isActive ? ' barraLateralEnlaceActivo' : ''}`
            }
          >
            <Icono className="barraLateralIcono" />
            <span>{etiqueta}</span>
          </NavLink>
        ))}
      </nav>

      <div className="barraLateralPie">
        <NavLink
          to={RUTAS.soporte}
          className={({ isActive }) =>
            `barraLateralEnlacePie${isActive ? ' barraLateralEnlacePieActivo' : ''}`
          }
        >
          <HelpCircle className="barraLateralIcono" />
          <span>Soporte</span>
        </NavLink>

        <button
          type="button"
          onClick={manejarCerrarSesion}
          className="barraLateralEnlacePie barraLateralEnlacePiePeligro"
        >
          <LogOut className="barraLateralIcono" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}

export default Aside;

import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronDown, User, Settings, LogOut,
  FileText, HelpCircle, Sun, Moon,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { RUTAS } from '../../routes/rutas';
import './MenuUsuario.css';

const usuarioInvitado = {
  nombre: 'Invitado',
  rol: 'Visitante',
  correo: 'invitado@fwd.dev',
  avatar: '/Imgs/Logotipo/Digital/Sintesis/FWD - Sintesis-01.png',
};

const itemsPorDefecto = [
  { id: 'perfil', etiqueta: 'Mi Perfil', icono: User, ruta: RUTAS.egresadoPerfil },
  { id: 'postulaciones', etiqueta: 'Mis postulaciones', icono: FileText, ruta: RUTAS.egresadoPerfil, badge: '3' },
  { id: 'configuracion', etiqueta: 'Configuración', icono: Settings, ruta: RUTAS.egresadoConfiguracion },
];

function obtenerTemaInicial() {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.dataset.theme || localStorage.getItem('tema') || 'light';
}

function MenuUsuario({
  items = itemsPorDefecto,
  rutaPerfilCompleto = RUTAS.egresadoPerfil,
  rutaSoporte = RUTAS.soporte,
  rutaLogout = RUTAS.login,
  variante = 'completo',
}) {
  const navegar = useNavigate();
  const auth = useAuth();
  const usuario = auth?.user ?? usuarioInvitado;
  const usuarioNombre = usuario?.nombre || usuario?.name || usuarioInvitado.nombre;
  const usuarioCorreo = usuario?.correo || usuario?.email || usuarioInvitado.correo;
  const usuarioRol = usuario?.rol || usuario?.role || usuarioInvitado.rol;
  const usuarioAvatar = usuario?.foto_perfil || usuario?.avatar || usuarioInvitado.avatar;

  const [abierto, setAbierto] = useState(false);
  const [cerrando, setCerrando] = useState(false);
  const [tema, setTema] = useState(obtenerTemaInicial);
  const contenedorRef = useRef(null);

  useEffect(() => {
    document.documentElement.dataset.theme = tema;
    localStorage.setItem('tema', tema);
  }, [tema]);

  useEffect(() => {
    if (!abierto) return;
    const manejarClickAfuera = (e) => {
      if (contenedorRef.current && !contenedorRef.current.contains(e.target)) {
        setAbierto(false);
      }
    };
    const manejarTecla = (e) => {
      if (e.key === 'Escape') setAbierto(false);
    };
    document.addEventListener('mousedown', manejarClickAfuera);
    document.addEventListener('keydown', manejarTecla);
    return () => {
      document.removeEventListener('mousedown', manejarClickAfuera);
      document.removeEventListener('keydown', manejarTecla);
    };
  }, [abierto]);

  const alternar = () => setAbierto((a) => !a);
  const cerrar = () => setAbierto(false);

  // LÓGICA DE CIERRE DE SESIÓN CORREGIDA (Senior Approach)
  const manejarCerrarSesion = async () => {
    setCerrando(true);
    try {
      if (typeof auth?.logout === 'function') {
        await auth.logout();
      }
      // Barrido manual de seguridad para evitar retención de sesión
      localStorage.removeItem('token');
    } catch (error) {
      console.error("Fallo al cerrar sesión:", error);
    } finally {
      setAbierto(false);
      setCerrando(false);
      // Forzar redirección de navegador para destruir el árbol de React y caché
      window.location.href = rutaLogout;
    }
  };

  const alternarTema = () => setTema((t) => (t === 'light' ? 'dark' : 'light'));

  return (
    <div className="menuUsuarioContenedor" ref={contenedorRef}>
      <button
        type="button"
        className={`menuUsuarioBoton ${abierto ? 'activo' : ''} ${variante === 'compacto' ? 'compacto' : ''}`}
        onClick={alternar}
        aria-haspopup="menu"
        aria-expanded={abierto}
      >
        <img src={usuarioAvatar} alt={usuarioNombre} className="menuUsuarioAvatar" />
        {variante !== 'compacto' && (
          <div className="menuUsuarioInfo">
            <span className="menuUsuarioNombre">{usuarioNombre}</span>
            <span className="menuUsuarioRol">{usuarioRol}</span>
          </div>
        )}
        <ChevronDown
          size={16}
          className={`menuUsuarioChevron ${abierto ? 'rotado' : ''}`}
        />
      </button>

      {abierto && (
        <div className="menuUsuarioDropdown" role="menu">
          <div className="menuUsuarioCabecera">
            <div className="menuUsuarioCabeceraAvatar">
              <img src={usuarioAvatar} alt={usuarioNombre} />
              <span className="menuUsuarioEnLinea" aria-label="En línea"></span>
            </div>
            <div className="menuUsuarioCabeceraInfo">
              <p className="menuUsuarioCabeceraNombre">{usuarioNombre}</p>
              <p className="menuUsuarioCabeceraCorreo">{usuarioCorreo}</p>
              <span className="menuUsuarioBadgeRol">{usuarioRol}</span>
            </div>
          </div>

          <Link
            to={rutaPerfilCompleto}
            className="menuUsuarioBotonVerPerfil"
            onClick={cerrar}
            role="menuitem"
          >
            Ver perfil completo
          </Link>

          <div className="menuUsuarioSeparador"></div>

          {items.map(({ id, etiqueta, icono: Icono, ruta, badge }) => (
            <Link
              key={id}
              to={ruta}
              className="menuUsuarioItem"
              onClick={cerrar}
              role="menuitem"
            >
              <span className="menuUsuarioItemIcono"><Icono size={16} /></span>
              <span className="menuUsuarioItemTexto">{etiqueta}</span>
              {badge && <span className="menuUsuarioItemBadge">{badge}</span>}
            </Link>
          ))}

          <div className="menuUsuarioSeparador"></div>

          <button
            type="button"
            className="menuUsuarioItem"
            onClick={alternarTema}
            role="menuitem"
          >
            <span className="menuUsuarioItemIcono">
              {tema === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </span>
            <span className="menuUsuarioItemTexto">
              Tema {tema === 'light' ? 'oscuro' : 'claro'}
            </span>
            <span className="menuUsuarioInterruptor" data-activo={tema === 'dark'}>
              <span className="menuUsuarioInterruptorBolita"></span>
            </span>
          </button>

          <Link
            to={rutaSoporte}
            className="menuUsuarioItem"
            onClick={cerrar}
            role="menuitem"
          >
            <span className="menuUsuarioItemIcono"><HelpCircle size={16} /></span>
            <span className="menuUsuarioItemTexto">Soporte y ayuda</span>
          </Link>

          <div className="menuUsuarioSeparador"></div>

          <button
            type="button"
            className="menuUsuarioItem peligro"
            onClick={manejarCerrarSesion}
            disabled={cerrando}
            role="menuitem"
            style={{ cursor: 'pointer' }}
          >
            <span className="menuUsuarioItemIcono"><LogOut size={16} /></span>
            <span className="menuUsuarioItemTexto">
              {cerrando ? 'Cerrando sesión…' : 'Cerrar sesión'}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

export default MenuUsuario;
import React, { useState, useRef, useEffect } from 'react';
import { Bell, ChevronDown, User, Settings, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

function Header() {
  const [modalUsuarioAbierto, setModalUsuarioAbierto] = useState(false);
  const modalRef = useRef(null);
  const navegar = useNavigate();

  // Cerrar modal al hacer clic fuera
  useEffect(() => {
    function manejarClickAfuera(e) {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setModalUsuarioAbierto(false);
      }
    }
    if (modalUsuarioAbierto) {
      document.addEventListener('mousedown', manejarClickAfuera);
    }
    return () => document.removeEventListener('mousedown', manejarClickAfuera);
  }, [modalUsuarioAbierto]);

  // Cerrar sesión navega al login con useNavigate (necesita limpiar estado)
  function manejarCerrarSesion() {
    setModalUsuarioAbierto(false);
    navegar('/');
  }

  return (
    <header className="encabezadoComun">

      {/* Logo */}
      <div className="logoContenedor">
        <span className="logoFwd">FWD</span>
        <span className="logoJunior">Junior</span>
      </div>

      {/* Navegación central */}
      <nav className="navegacionComun">
        <a href="#" className="enlaceNavegacion activo">Explorar</a>
        <a href="#" className="enlaceNavegacion">Proyectos FWD</a>
        <a href="#" className="enlaceNavegacion">Empleos Junior</a>
        <a href="#" className="enlaceNavegacion">
          Oportunidades IA
          <span className="insigniaNavegacion">IA</span>
        </a>
        <a href="#" className="enlaceNavegacion">Mis Proyectos</a>
        <a href="#" className="enlaceNavegacion">
          Mensajes
          <span className="insigniaNavegacion roja">2</span>
        </a>
      </nav>

      {/* Acciones derecha */}
      <div className="accionesUsuario">

        {/* Campana */}
        <button className="botonCampana" title="Notificaciones">
          <Bell size={20} />
        </button>

        {/* Perfil + Modal */}
        <div className="contenedorPerfilUsuario" ref={modalRef}>
          <button
            className="botonPerfilUsuario"
            onClick={() => setModalUsuarioAbierto(!modalUsuarioAbierto)}
          >
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="Juan Pérez"
              className="imagenAvatarHeader"
            />
            <div className="infoUsuarioHeader">
              <span className="nombreUsuarioHeader">Juan Pérez</span>
              <span className="rolUsuarioHeader">Desarrollador</span>
            </div>
            <ChevronDown
              size={16}
              className={`iconoDesplegable ${modalUsuarioAbierto ? 'rotado' : ''}`}
            />
          </button>

          {/* Modal desplegable */}
          {modalUsuarioAbierto && (
            <div className="modalUsuario">
              {/* Cabecera con avatar */}
              <div className="cabeceraModal">
                <img
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  alt="Juan Pérez"
                  className="imagenAvatarModal"
                />
                <div>
                  <p className="nombreModal">Juan Pérez</p>
                  <p className="correoModal">juan@fwdjunior.com</p>
                </div>
              </div>

              <div className="separadorModal"></div>

              {/* ✅ Usando <Link> directamente en el modal */}
              <Link
                to="/PerfilEngresado"
                className="itemModal"
                onClick={() => setModalUsuarioAbierto(false)}
              >
                <User size={16} />
                <span>Mi Perfil</span>
              </Link>

              <Link
                to="/Configuracion"
                className="itemModal"
                onClick={() => setModalUsuarioAbierto(false)}
              >
                <Settings size={16} />
                <span>Configuración</span>
              </Link>

              <div className="separadorModal"></div>

              {/* Cerrar sesión usa useNavigate porque puede necesitar limpiar estado */}
              <button className="itemModal peligro" onClick={manejarCerrarSesion}>
                <LogOut size={16} />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;

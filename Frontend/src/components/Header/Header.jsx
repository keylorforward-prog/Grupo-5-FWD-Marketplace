import { Bell } from 'lucide-react';
import MenuUsuario from '../MenuUsuario/MenuUsuario';
import './Header.css';

function Header() {
  return (
    <header className="encabezadoComun">
      <div className="encabezadoTitulo">FWD Junior Marketplace</div>

      <div className="accionesUsuario">
        <button className="botonCampana" title="Notificaciones">
          <Bell size={20} />
          <span className="puntoCampana"></span>
        </button>

        <MenuUsuario />
      </div>
    </header>
  );
}

export default Header;

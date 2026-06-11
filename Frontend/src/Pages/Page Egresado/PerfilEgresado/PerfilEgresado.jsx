import './Styles/PerfilEgresado.css';
import BannerSuperior from './components/BannerSuperior';
import TarjetaUsuario from './components/TarjetaUsuario';
import TarjetaStack from './components/TarjetaStack';
import TarjetaBio from './components/TarjetaBio';
import TarjetaPostulaciones from './components/TarjetaPostulaciones';
import ProyectosAcademicos from './components/ProyectosAcademicos';

function PerfilEgresado() {
  return (
    <div className="contenedorPerfil">
      <BannerSuperior />

      <main className="contenidoPrincipalPerfil">
        <aside className="columnaLateral">
          <TarjetaUsuario />
          <TarjetaStack />
        </aside>

        <section className="columnaContenido">
          <TarjetaBio />
          <TarjetaPostulaciones />
          <ProyectosAcademicos />
        </section>
      </main>
    </div>
  );
}

export default PerfilEgresado;

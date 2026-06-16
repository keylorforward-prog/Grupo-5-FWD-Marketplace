import LayoutEgresado from '../LayoutEgresado';
import TarjetaUsuario from './components/TarjetaUsuario';
import TarjetaStack from './components/TarjetaStack';
import TarjetaBio from './components/TarjetaBio';
import TarjetaPostulaciones from './components/TarjetaPostulaciones';
import ProyectosAcademicos from './components/ProyectosAcademicos';
import { usePerfilEgresado } from './usePerfilEgresado';
import './styles/PerfilEgresado.css';

function PerfilEgresado() {
  const perfilApi = usePerfilEgresado();

  return (
    <LayoutEgresado>
      <div className="contenedorPerfil">
        <div className="bannerSuperior fwd-animar-fade">
          <div className="contenidoBanner">
            <span className="etiquetaBanner">DASHBOARD DE TALENTO</span>
            <h1 className="tituloBanner">Mi Perfil Estudiantil</h1>
            <p className="subtituloBanner">
              Tu identidad profesional en FWD. Mantén tu información al día para
              destacar ante empresas.
            </p>
          </div>

          <div className="decoracionBannerCapas" aria-hidden="true">
            <span className="bannerBlob bannerBlobAmarillo"></span>
            <span className="bannerBlob bannerBlobMagenta"></span>
            <span className="bannerBlob bannerBlobAqua"></span>
            <img
              src="/Imgs/FLECHAS/Flechas-01.png"
              alt=""
              className="decoracionBannerFlecha"
            />
          </div>
        </div>

        <main className="contenidoPrincipalPerfil">
          <aside className="columnaLateralPerfil fwd-stagger">
            <TarjetaUsuario perfilApi={perfilApi} />
            <TarjetaStack perfilApi={perfilApi} />
          </aside>

          <section className="columnaContenidoPerfil fwd-stagger">
            <TarjetaBio perfilApi={perfilApi} />
            <TarjetaPostulaciones />
            <ProyectosAcademicos />
          </section>
        </main>
      </div>
    </LayoutEgresado>
  );
}

export default PerfilEgresado;

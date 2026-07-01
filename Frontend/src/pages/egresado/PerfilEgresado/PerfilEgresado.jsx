import { useTranslation } from 'react-i18next';
import DashboardLayout from '../DashboardEgresado/components/DashboardLayout';
import TarjetaUsuario from './components/TarjetaUsuario';
import TarjetaStack from './components/TarjetaStack';
import TarjetaBio from './components/TarjetaBio';
import TarjetaPostulaciones from './components/TarjetaPostulaciones';
import ProyectosAcademicos from './components/ProyectosAcademicos';
import TarjetaCurriculum from './components/TarjetaCurriculum';
import { usePerfilEgresado } from './hooks/usePerfilEgresado';
import './styles/PerfilEgresado.css';

function PerfilEgresado() {
  const { t } = useTranslation();
  const perfilApi = usePerfilEgresado();

  return (
    <DashboardLayout>
      <div className="contenedorPerfil">
        <div className="bannerSuperior fwd-animar-fade">
          <div className="contenidoBanner">
            <span className="etiquetaBanner">{t('egresadoPerfil.banner.kicker')}</span>
            <h1 className="tituloBanner">{t('egresadoPerfil.banner.title')}</h1>
            <p className="subtituloBanner">
              {t('egresadoPerfil.banner.subtitle')}
            </p>
          </div>

          <div className="decoracionBannerCapas" aria-hidden="true">
            <span className="bannerBlob bannerBlobAmarillo"></span>
            <span className="bannerBlob bannerBlobMagenta"></span>
            <span className="bannerBlob bannerBlobAqua"></span>
            <img
              src="/Imgs/FLECHAS/Flechas-01.png"
              alt="Imagen descriptiva"
              className="decoracionBannerFlecha"
            />
          </div>
        </div>

        <main className="contenidoPrincipalPerfil">
          <aside className="columnaLateralPerfil fwd-stagger">
            <TarjetaUsuario perfilApi={perfilApi} />
            <TarjetaStack perfilApi={perfilApi} />
            <TarjetaCurriculum perfilApi={perfilApi} />
          </aside>

          <section className="columnaContenidoPerfil fwd-stagger">
            <TarjetaBio perfilApi={perfilApi} />
            <TarjetaPostulaciones />
            <ProyectosAcademicos perfilApi={perfilApi} />
          </section>
        </main>
      </div>
    </DashboardLayout>
  );
}

export default PerfilEgresado;

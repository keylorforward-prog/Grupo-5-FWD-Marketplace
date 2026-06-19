import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Briefcase, Bell, Lock } from 'lucide-react';
import DashboardLayout from '../DashboardEgresado/components/DashboardLayout';
import InformacionCuenta from './components/InformacionCuenta';
import PreferenciasProfesionales from './components/PreferenciasProfesionales';
import Notificaciones from './components/Notificaciones';
import Seguridad from './components/Seguridad';
import { useScrollSpy } from './hooks/useScrollSpy';
import './styles/ConfiguracionEgresado.css';

const seccionesConfiguracion = [
  { id: 'cuenta', key: 'sections.cuenta', icono: User },
  { id: 'preferencias', key: 'sections.preferencias', icono: Briefcase },
  { id: 'notificaciones', key: 'sections.notificaciones', icono: Bell },
  { id: 'seguridad', key: 'sections.seguridad', icono: Lock },
];

function ConfiguracionEgresado() {
  const { t } = useTranslation();
  const ids = useMemo(() => seccionesConfiguracion.map((s) => s.id), []);
  const [seccionActiva, setSeccionActiva] = useScrollSpy(ids, { offset: 140 });

  const desplazarASeccion = (id) => {
    setSeccionActiva(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <DashboardLayout>
      <div className="mainConfiguracion fwd-fondo-decorativo">
        <div className="cabeceraConfiguracion fwd-animar-entrada">
          <span className="kickerConfiguracion">{t('egresadoConfiguracion.kicker')}</span>
          <h1 className="tituloConfiguracion">
            {t('egresadoConfiguracion.title')}<span className="puntoTituloConfiguracion">.</span>
          </h1>
          <p className="subtituloConfiguracion">
            {t('egresadoConfiguracion.subtitle')}
          </p>
        </div>

        <div className="contenedorContenidoConfiguracion">
          <aside className="tarjetaNavegacionConfiguracion fwd-animar-slide">
            <div className="resumenPerfilConfiguracion">
              <div className="anilloAvatarConfig">
                <img src="/Imgs/Logotipo/Digital/Sintesis/FWD - Sintesis-01.png" alt="Avatar" />
              </div>
              <h3>Alex Rivera</h3>
              <p>Junior Frontend Developer</p>
            </div>

            <nav className="navegacionInterna">
              {seccionesConfiguracion.map(({ id, key, icono: Icono }) => (
                <button
                  key={id}
                  type="button"
                  className={`botonNavegacionInterna ${seccionActiva === id ? 'activo' : ''}`}
                  onClick={() => desplazarASeccion(id)}
                >
                  <span className="iconoBotonNav"><Icono size={18} /></span>
                  {t(`egresadoConfiguracion.${key}`)}
                </button>
              ))}
            </nav>
          </aside>

          <div className="formulariosConfiguracion fwd-stagger">
            <InformacionCuenta />
            <PreferenciasProfesionales />
            <Notificaciones />
            <Seguridad />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default ConfiguracionEgresado;

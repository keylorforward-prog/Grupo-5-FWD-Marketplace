import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Bell, HelpCircle } from 'lucide-react';
import DashboardLayout from '../DashboardEgresado/components/DashboardLayout';
import { RUTAS } from '../../../routes/rutas';
import PreferenciasProfesionales from './components/PreferenciasProfesionales';
import Notificaciones from './components/Notificaciones';
import Seguridad from './components/Seguridad';
import { useScrollSpy } from './hooks/useScrollSpy';
import './styles/ConfiguracionEgresado.css';

const seccionesConfiguracion = [
  { id: 'preferencias', key: 'sections.preferencias', icono: Briefcase },
  { id: 'notificaciones', key: 'sections.notificaciones', icono: Bell },
];

function ConfiguracionEgresado() {
  const { t } = useTranslation();
  const navigate = useNavigate();
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

            <div className="seguridadLateral">
              <Seguridad />
            </div>

            <button
              className="soporteLateralBtn"
              type="button"
              onClick={() => navigate(RUTAS.egresadoSoporte)}
            >
              <HelpCircle size={16} />
              {t('egresadoLayout.sidebar.soporte')}
            </button>
          </aside>

          <div className="formulariosConfiguracion fwd-stagger">
            <PreferenciasProfesionales />
            <Notificaciones />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default ConfiguracionEgresado;

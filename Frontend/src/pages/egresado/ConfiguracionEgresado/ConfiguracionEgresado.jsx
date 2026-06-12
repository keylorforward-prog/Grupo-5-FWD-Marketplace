import { useMemo } from 'react';
import { User, Briefcase, Bell, Lock } from 'lucide-react';
import LayoutEgresado from '../LayoutEgresado';
import InformacionCuenta from './components/InformacionCuenta';
import PreferenciasProfesionales from './components/PreferenciasProfesionales';
import Notificaciones from './components/Notificaciones';
import Seguridad from './components/Seguridad';
import { useScrollSpy } from './useScrollSpy';
import './styles/ConfiguracionEgresado.css';

const seccionesConfiguracion = [
  { id: 'cuenta', etiqueta: 'Información de Cuenta', icono: User },
  { id: 'preferencias', etiqueta: 'Preferencias Profesionales', icono: Briefcase },
  { id: 'notificaciones', etiqueta: 'Notificaciones', icono: Bell },
  { id: 'seguridad', etiqueta: 'Seguridad', icono: Lock },
];

function ConfiguracionEgresado() {
  const ids = useMemo(() => seccionesConfiguracion.map((s) => s.id), []);
  const [seccionActiva, setSeccionActiva] = useScrollSpy(ids, { offset: 140 });

  const desplazarASeccion = (id) => {
    setSeccionActiva(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <LayoutEgresado>
      <div className="mainConfiguracion fwd-fondo-decorativo">
        <div className="cabeceraConfiguracion fwd-animar-entrada">
          <span className="kickerConfiguracion">PANEL DE PREFERENCIAS</span>
          <h1 className="tituloConfiguracion">
            Configuración<span className="puntoTituloConfiguracion">.</span>
          </h1>
          <p className="subtituloConfiguracion">
            Gestiona tu identidad profesional y preferencias de la plataforma.
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
              {seccionesConfiguracion.map(({ id, etiqueta, icono: Icono }) => (
                <button
                  key={id}
                  type="button"
                  className={`botonNavegacionInterna ${seccionActiva === id ? 'activo' : ''}`}
                  onClick={() => desplazarASeccion(id)}
                >
                  <span className="iconoBotonNav"><Icono size={18} /></span>
                  {etiqueta}
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
    </LayoutEgresado>
  );
}

export default ConfiguracionEgresado;

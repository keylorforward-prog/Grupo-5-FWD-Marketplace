import { useMemo, useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Mail,
  RotateCcw,
  Save,
  ShieldCheck,
  SlidersHorizontal,
  ToggleLeft,
} from 'lucide-react';

const DEFAULT_CONFIG = [
  {
    clave: 'marketplace_activo',
    valor: true,
    tipo: 'boolean',
    grupo: 'Operacion',
    descripcion: 'Permite activar o pausar las funciones principales del marketplace.'
  },
  {
    clave: 'requiere_verificacion_egresados',
    valor: true,
    tipo: 'boolean',
    grupo: 'Confianza',
    descripcion: 'Exige aprobacion manual antes de que un egresado pueda usar la plataforma.'
  },
  {
    clave: 'aprobacion_empresas_manual',
    valor: true,
    tipo: 'boolean',
    grupo: 'Confianza',
    descripcion: 'Mantiene las cuentas de empresa en revision antes de activarlas.'
  },
  {
    clave: 'limite_proyectos_empresa',
    valor: 4,
    tipo: 'number',
    grupo: 'Limites',
    descripcion: 'Cantidad maxima de proyectos activos por empresa.'
  },
  {
    clave: 'limite_postulaciones_egresado',
    valor: 8,
    tipo: 'number',
    grupo: 'Limites',
    descripcion: 'Cantidad maxima de postulaciones activas por egresado.'
  },
  {
    clave: 'presupuesto_minimo_proyecto',
    valor: 100,
    tipo: 'number',
    grupo: 'Proyectos',
    descripcion: 'Presupuesto minimo permitido al publicar un proyecto.'
  },
  {
    clave: 'sla_verificacion_horas',
    valor: 24,
    tipo: 'number',
    grupo: 'Operacion',
    descripcion: 'Horas objetivo para resolver verificaciones pendientes.'
  },
  {
    clave: 'soporte_email',
    valor: 'soporte@fwd.com',
    tipo: 'text',
    grupo: 'Comunicacion',
    descripcion: 'Correo visible para soporte administrativo y operativo.'
  },
  {
    clave: 'mensaje_mantenimiento',
    valor: 'Estamos realizando mantenimiento programado. Vuelve pronto.',
    tipo: 'textarea',
    grupo: 'Comunicacion',
    descripcion: 'Mensaje mostrado cuando la plataforma se encuentre en mantenimiento.'
  }
];

const GROUP_ICONS = {
  Operacion: Clock,
  Confianza: ShieldCheck,
  Limites: SlidersHorizontal,
  Proyectos: ToggleLeft,
  Comunicacion: Mail,
};

const LABELS = {
  marketplace_activo: 'Marketplace activo',
  requiere_verificacion_egresados: 'Verificacion obligatoria de egresados',
  aprobacion_empresas_manual: 'Aprobacion manual de empresas',
  limite_proyectos_empresa: 'Proyectos activos por empresa',
  limite_postulaciones_egresado: 'Postulaciones activas por egresado',
  presupuesto_minimo_proyecto: 'Presupuesto minimo de proyecto',
  sla_verificacion_horas: 'SLA de verificacion',
  soporte_email: 'Correo de soporte',
  mensaje_mantenimiento: 'Mensaje de mantenimiento',
};

const normalizarConfiguracion = (items) => {
  const porClave = new Map(items.map((item) => [item.clave, item]));
  return DEFAULT_CONFIG.map((item) => ({
    ...item,
    ...porClave.get(item.clave),
  }));
};

const agruparConfiguracion = (items) => items.reduce((grupos, item) => {
  const grupo = item.grupo || 'General';
  if (!grupos[grupo]) grupos[grupo] = [];
  grupos[grupo].push(item);
  return grupos;
}, {});

export default function AdminConfiguracion({ onAdminChange }) {
  const [configuracion, setConfiguracion] = useState(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    let cancelado = false;

    adminService.getConfiguracion()
      .then((response) => {
        if (!cancelado && response.success) {
          setConfiguracion(normalizarConfiguracion(response.data));
        }
      })
      .catch((error) => {
        console.error('Error cargando configuracion', error);
        if (!cancelado) {
          setMensaje({ tipo: 'error', texto: 'No se pudo cargar la configuracion. Se muestran valores por defecto.' });
        }
      })
      .finally(() => {
        if (!cancelado) setLoading(false);
      });

    return () => {
      cancelado = true;
    };
  }, []);

  const grupos = useMemo(() => agruparConfiguracion(configuracion), [configuracion]);

  const actualizarValor = (clave, valor) => {
    setConfiguracion((actual) => actual.map((item) => (
      item.clave === clave ? { ...item, valor } : item
    )));
    setMensaje(null);
  };

  const restaurarDefaults = () => {
    setConfiguracion(DEFAULT_CONFIG);
    setMensaje({ tipo: 'info', texto: 'Valores FWD restaurados localmente. Guarda para aplicarlos.' });
  };

  const guardarConfiguracion = async () => {
    setGuardando(true);
    setMensaje(null);

    try {
      const payload = configuracion.map(({ clave, valor }) => ({ clave, valor }));
      const response = await adminService.updateConfiguracion(payload);

      if (response.success) {
        setConfiguracion(normalizarConfiguracion(response.data));
        setMensaje({ tipo: 'success', texto: response.message || 'Configuracion guardada correctamente.' });
        onAdminChange?.();
      }
    } catch (error) {
      console.error('Error guardando configuracion', error);
      setMensaje({ tipo: 'error', texto: error.response?.data?.message || 'No se pudo guardar la configuracion.' });
    } finally {
      setGuardando(false);
    }
  };

  const renderControl = (item) => {
    if (item.tipo === 'boolean') {
      return (
        <button
          className={`admin-config-toggle ${item.valor ? 'active' : ''}`}
          type="button"
          onClick={() => actualizarValor(item.clave, !item.valor)}
          aria-pressed={item.valor}
        >
          <span className="admin-config-toggle-dot" />
          {item.valor ? 'Activo' : 'Inactivo'}
        </button>
      );
    }

    if (item.tipo === 'textarea') {
      return (
        <textarea
          className="admin-config-textarea"
          value={item.valor}
          onChange={(event) => actualizarValor(item.clave, event.target.value)}
          rows={3}
        />
      );
    }

    return (
      <input
        className="admin-config-input"
        type={item.tipo === 'number' ? 'number' : 'text'}
        min={item.tipo === 'number' ? 0 : undefined}
        value={item.valor}
        onChange={(event) => {
          const value = item.tipo === 'number' ? Number(event.target.value) : event.target.value;
          actualizarValor(item.clave, value);
        }}
      />
    );
  };

  return (
    <div className="admin-content animate-in">
      <div className="admin-module-heading">
        <div>
          <h3>Configuracion de plataforma</h3>
          <p className="admin-module-subtitle">
            Controla reglas operativas, limites y mensajes compartidos del marketplace.
          </p>
        </div>

        <div className="admin-action-group">
          <button className="admin-action-button neutral" type="button" onClick={restaurarDefaults} disabled={guardando}>
            <RotateCcw size={14} />
            Restaurar
          </button>
          <button className="admin-action-button primary" type="button" onClick={guardarConfiguracion} disabled={guardando || loading}>
            <Save size={14} />
            {guardando ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </div>

      {mensaje && (
        <div className={`admin-config-message ${mensaje.tipo}`}>
          {mensaje.tipo === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          {mensaje.texto}
        </div>
      )}

      {loading ? (
        <section className="admin-panel">
          <div className="admin-empty-inline">Cargando configuracion...</div>
        </section>
      ) : (
        Object.entries(grupos).map(([grupo, items]) => {
          const Icon = GROUP_ICONS[grupo] || SlidersHorizontal;

          return (
            <section className="admin-panel" key={grupo}>
              <div className="admin-panel-header">
                <h3 className="admin-config-group-title">
                  <span className="admin-config-group-icon"><Icon size={17} /></span>
                  {grupo}
                </h3>
                <span className="admin-review-note">{items.length} ajustes</span>
              </div>

              <div className="admin-config-list">
                {items.map((item) => (
                  <div className="admin-config-row" key={item.clave}>
                    <div className="admin-config-copy">
                      <span className="admin-config-label">{LABELS[item.clave] || item.clave}</span>
                      <span className="admin-config-description">{item.descripcion}</span>
                    </div>
                    <div className="admin-config-control">
                      {renderControl(item)}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}

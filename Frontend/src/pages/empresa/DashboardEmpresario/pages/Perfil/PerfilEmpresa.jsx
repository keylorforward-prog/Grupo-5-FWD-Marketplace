import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Briefcase,
  Building2,
  CalendarDays,
  Check,
  Edit3,
  Globe,
  Mail,
  Phone,
  Save,
  X,
} from 'lucide-react';
import { useAuth } from '../../../../../context/AuthContext';
import { dashboardEmpresarioService } from '../../../../../services/dashboardEmpresarioService';
import DashboardLayout from '../../components/DashboardLayout';
import EstadoDatos from '../../components/EstadoDatos';

const PERFIL_INICIAL = {
  sector: '',
  descripcion: '',
  logo: '',
  sitio_web: '',
  telefono_whatsapp: '',
};

const SECTORES_COMUNES = [
  'Tecnologia',
  'Comercio',
  'Educacion',
  'Salud',
  'Finanzas',
  'Marketing',
  'Turismo',
  'Construccion',
  'Manufactura',
  'Servicios profesionales',
];

const SECTOR_OTRO = 'Otro';

const normalizarPerfil = (perfil, usuario) => ({
  ...PERFIL_INICIAL,
  ...perfil,
  usuario: perfil?.usuario ?? usuario ?? {},
});

const normalizarWhatsapp = (valor) => {
  const digitos = valor.replace(/\D/g, '').slice(0, 8);
  if (digitos.length <= 4) return digitos;
  return `${digitos.slice(0, 4)}-${digitos.slice(4)}`;
};

const obtenerSectorInicial = (sector) => {
  if (!sector) return { seleccionado: '', otro: '' };
  if (SECTORES_COMUNES.includes(sector)) return { seleccionado: sector, otro: '' };
  return { seleccionado: SECTOR_OTRO, otro: sector };
};

const formatearFecha = (fecha) => {
  if (!fecha) return 'No registrada';
  return new Intl.DateTimeFormat('es-CR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(fecha));
};

export default function PerfilEmpresa() {
  const { user, actualizarUsuario } = useAuth();
  const [perfil, setPerfil] = useState(() => normalizarPerfil(null, user));
  const [resumen, setResumen] = useState({});
  const [borrador, setBorrador] = useState(PERFIL_INICIAL);
  const [editando, setEditando] = useState(false);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [subiendoFoto, setSubiendoFoto] = useState(false);
  const [sectorSeleccionado, setSectorSeleccionado] = useState('');
  const [sectorOtro, setSectorOtro] = useState('');
  const [errorValidacion, setErrorValidacion] = useState('');
  const [error, setError] = useState(null);
  const inputFotoRef = useRef(null);

  useEffect(() => {
    let activo = true;

    const cargarPerfil = async () => {
      setLoading(true);
      setError(null);
      try {
        const [perfilBackend, resumenBackend] = await Promise.all([
          dashboardEmpresarioService.obtenerPerfil(),
          dashboardEmpresarioService.obtenerResumen(),
        ]);

        if (!activo) return;
        const perfilNormalizado = normalizarPerfil(perfilBackend, user);
        const sectorInicial = obtenerSectorInicial(perfilNormalizado.sector ?? '');
        setPerfil(perfilNormalizado);
        setResumen(resumenBackend ?? {});
        setSectorSeleccionado(sectorInicial.seleccionado);
        setSectorOtro(sectorInicial.otro);
        setBorrador({
          sector: perfilNormalizado.sector ?? '',
          descripcion: perfilNormalizado.descripcion ?? '',
          logo: perfilNormalizado.logo ?? '',
          sitio_web: perfilNormalizado.sitio_web ?? '',
          telefono_whatsapp: normalizarWhatsapp(perfilNormalizado.telefono_whatsapp ?? ''),
        });
      } catch (err) {
        if (activo) setError(err);
      } finally {
        if (activo) setLoading(false);
      }
    };

    cargarPerfil();

    return () => {
      activo = false;
    };
  }, [user]);

  const usuario = perfil.usuario ?? {};
  const nombreEmpresa = usuario.nombre || user?.nombre || 'Empresa';
  const correoEmpresa = usuario.correo || user?.correo || user?.email || 'Correo no registrado';
  const avatar = perfil.logo
    || usuario.foto_perfil
    || user?.foto_perfil
    || '/Imgs/Logotipo/Digital/Sintesis/FWD - Sintesis-01.png';
  const fechaRegistro = perfil.fecha_registro || usuario.fecha_registro;

  const estadisticas = useMemo(() => [
    {
      label: 'Proyectos publicados',
      value: resumen.proyectosPublicados ?? 0,
      icon: Briefcase,
      color: 'blue',
    },
    {
      label: 'Proyectos activos',
      value: resumen.proyectosActivos ?? 0,
      icon: Check,
      color: 'green',
    },
    {
      label: 'Ofertas recibidas',
      value: resumen.ofertasRecibidas ?? 0,
      icon: Mail,
      color: 'orange',
    },
  ], [resumen]);

  const actualizarCampo = (campo, valor) => {
    setBorrador((actual) => ({ ...actual, [campo]: valor }));
  };

  const actualizarWhatsapp = (valor) => {
    actualizarCampo('telefono_whatsapp', normalizarWhatsapp(valor));
    setErrorValidacion('');
  };

  const actualizarSectorSeleccionado = (valor) => {
    setSectorSeleccionado(valor);
    setErrorValidacion('');
    if (valor !== SECTOR_OTRO) {
      setSectorOtro('');
      actualizarCampo('sector', valor);
    } else {
      actualizarCampo('sector', sectorOtro);
    }
  };

  const actualizarSectorOtro = (valor) => {
    setSectorOtro(valor);
    actualizarCampo('sector', valor);
    setErrorValidacion('');
  };

  const cancelarEdicion = () => {
    const sectorInicial = obtenerSectorInicial(perfil.sector ?? '');
    setSectorSeleccionado(sectorInicial.seleccionado);
    setSectorOtro(sectorInicial.otro);
    setErrorValidacion('');
    setBorrador({
      sector: perfil.sector ?? '',
      descripcion: perfil.descripcion ?? '',
      logo: perfil.logo ?? '',
      sitio_web: perfil.sitio_web ?? '',
      telefono_whatsapp: normalizarWhatsapp(perfil.telefono_whatsapp ?? ''),
    });
    setEditando(false);
  };

  const guardarPerfil = async () => {
    const sectorFinal = sectorSeleccionado === SECTOR_OTRO ? sectorOtro.trim() : sectorSeleccionado;
    const whatsappValido = /^\d{4}-\d{4}$/.test(borrador.telefono_whatsapp);

    if (!sectorFinal) {
      setErrorValidacion('Selecciona un sector o escribe uno en Otro.');
      return;
    }

    if (borrador.telefono_whatsapp && !whatsappValido) {
      setErrorValidacion('El WhatsApp debe tener 8 numeros con formato 0000-0000.');
      return;
    }

    setGuardando(true);
    setError(null);
    setErrorValidacion('');
    try {
      const actualizado = await dashboardEmpresarioService.actualizarPerfil({
        sector: sectorFinal,
        descripcion: borrador.descripcion,
        sitio_web: borrador.sitio_web,
        telefono_whatsapp: borrador.telefono_whatsapp,
      });
      const perfilNormalizado = normalizarPerfil(actualizado, user);
      const sectorInicial = obtenerSectorInicial(perfilNormalizado.sector ?? '');
      setPerfil(perfilNormalizado);
      setSectorSeleccionado(sectorInicial.seleccionado);
      setSectorOtro(sectorInicial.otro);
      setBorrador({
        sector: perfilNormalizado.sector ?? '',
        descripcion: perfilNormalizado.descripcion ?? '',
        logo: perfilNormalizado.logo ?? '',
        sitio_web: perfilNormalizado.sitio_web ?? '',
        telefono_whatsapp: normalizarWhatsapp(perfilNormalizado.telefono_whatsapp ?? ''),
      });
      setEditando(false);
    } catch (err) {
      setError(err);
    } finally {
      setGuardando(false);
    }
  };

  const seleccionarFoto = () => {
    inputFotoRef.current?.click();
  };

  const subirFoto = async (evento) => {
    const archivo = evento.target.files?.[0];
    if (!archivo) return;

    setSubiendoFoto(true);
    setError(null);
    try {
      const actualizado = await dashboardEmpresarioService.subirFotoPerfil(archivo);
      const perfilNormalizado = normalizarPerfil(actualizado, user);
      const fotoPerfil = perfilNormalizado.logo || perfilNormalizado.usuario?.foto_perfil;

      setPerfil(perfilNormalizado);
      setBorrador((actual) => ({
        ...actual,
        logo: perfilNormalizado.logo ?? '',
      }));
      if (fotoPerfil) actualizarUsuario({ foto_perfil: fotoPerfil });
    } catch (err) {
      setError(err);
    } finally {
      setSubiendoFoto(false);
      evento.target.value = '';
    }
  };

  return (
    <DashboardLayout activePage="perfil">
      <div className="de-company-profile">
        <section className="de-profile-banner fwd-animar-fade">
          <div className="de-profile-banner-content">
            <span className="de-profile-banner-kicker">Dashboard empresarial</span>
            <h1>Mi Perfil Empresarial</h1>
            <p>
              Presenta tu empresa ante el talento FWD y mantén actualizada la informacion que acompaña tus proyectos.
            </p>
          </div>

          <div className="de-profile-banner-art" aria-hidden="true">
            <span className="de-profile-banner-blob yellow" />
            <span className="de-profile-banner-blob magenta" />
            <span className="de-profile-banner-blob aqua" />
            <img src="/Imgs/FLECHAS/Flechas-01.png" alt="Imagen descriptiva" />
          </div>
        </section>

        <EstadoDatos loading={loading} error={error} empty={false} emptyText="" />

        {!loading && (
          <main className="de-profile-layout">
            <aside className="de-profile-sidebar fwd-stagger">
              <section className="de-profile-card de-profile-company-card">
                <div className="de-profile-avatar-wrap">
                  <img src={avatar} alt={nombreEmpresa} className="de-profile-avatar" />
                  <input
                    ref={inputFotoRef}
                    className="de-profile-file-input"
                    type="file"
                    accept="image/*"
                    onChange={subirFoto}
                  />
                  <button
                    className="de-profile-avatar-action"
                    type="button"
                    onClick={seleccionarFoto}
                    disabled={subiendoFoto}
                    aria-label="Editar perfil"
                  >
                    {subiendoFoto ? <Save size={15} /> : <Edit3 size={15} />}
                  </button>
                </div>

                <div className="de-profile-company-heading">
                  <div>
                    <h2>{nombreEmpresa}</h2>
                    <p>{perfil.sector || 'Sector no registrado'}</p>
                  </div>
                  <button
                    className="de-profile-edit-button"
                    type="button"
                    onClick={() => setEditando((valor) => !valor)}
                    aria-label="Editar perfil"
                  >
                    <Edit3 size={15} />
                  </button>
                </div>

                <div className="de-profile-contact-list">
                  <span><Mail size={15} /> {correoEmpresa}</span>
                  <span><Phone size={15} /> {perfil.telefono_whatsapp || 'WhatsApp no registrado'}</span>
                  <span><Globe size={15} /> {perfil.sitio_web || 'Sitio web no registrado'}</span>
                </div>
              </section>

              <section className="de-profile-card">
                <h3 className="de-profile-card-title">Datos de cuenta</h3>
                <div className="de-profile-facts">
                  <div>
                    <span>Rol</span>
                    <strong>Empresa</strong>
                  </div>
                  <div>
                    <span>Estado</span>
                    <strong>{usuario.estado_cuenta || 'No registrado'}</strong>
                  </div>
                  <div>
                    <span>Registro</span>
                    <strong>{formatearFecha(fechaRegistro)}</strong>
                  </div>
                </div>
              </section>
            </aside>

            <section className="de-profile-content fwd-stagger">
              <section className="de-profile-card">
                <div className="de-profile-card-header">
                  <div>
                    <h3 className="de-profile-card-title">Acerca de la empresa</h3>
                    <p className="de-profile-card-subtitle">Informacion visible para estudiantes y candidatos.</p>
                  </div>

                  {editando ? (
                    <div className="de-profile-actions">
                      <button className="de-profile-secondary" type="button" onClick={cancelarEdicion}>
                        <X size={15} />
                        Cancelar
                      </button>
                      <button className="de-profile-primary" type="button" onClick={guardarPerfil} disabled={guardando}>
                        <Save size={15} />
                        {guardando ? 'Guardando...' : 'Guardar'}
                      </button>
                    </div>
                  ) : (
                    <button className="de-profile-primary" type="button" onClick={() => setEditando(true)}>
                      <Edit3 size={15} />
                      Editar perfil
                    </button>
                  )}
                </div>

                {editando ? (
                  <div className="de-profile-form">
                    <label>
                      <span>Sector</span>
                      <select
                        value={sectorSeleccionado}
                        onChange={(e) => actualizarSectorSeleccionado(e.target.value)}
                      >
                        <option value="">Selecciona un sector</option>
                        {SECTORES_COMUNES.map((sector) => (
                          <option key={sector} value={sector}>{sector}</option>
                        ))}
                        <option value={SECTOR_OTRO}>Otro</option>
                      </select>
                    </label>
                    {sectorSeleccionado === SECTOR_OTRO && (
                      <label>
                        <span>Otro sector</span>
                        <input
                          value={sectorOtro}
                          onChange={(e) => actualizarSectorOtro(e.target.value)}
                          placeholder="Escribe el sector"
                        />
                      </label>
                    )}
                    <label>
                      <span>Sitio web</span>
                      <input
                        value={borrador.sitio_web}
                        onChange={(e) => actualizarCampo('sitio_web', e.target.value)}
                        placeholder="https://empresa.com"
                      />
                    </label>
                    <label>
                      <span>WhatsApp</span>
                      <input
                        value={borrador.telefono_whatsapp}
                        onChange={(e) => actualizarWhatsapp(e.target.value)}
                        inputMode="numeric"
                        maxLength={9}
                        placeholder="0000-0000"
                      />
                    </label>
                    {errorValidacion && (
                      <p className="de-profile-validation de-profile-form-wide">{errorValidacion}</p>
                    )}
                    <label className="de-profile-form-wide">
                      <span>Descripcion</span>
                      <textarea
                        value={borrador.descripcion}
                        onChange={(e) => actualizarCampo('descripcion', e.target.value)}
                        placeholder="Describe la empresa, el tipo de proyectos y el talento que buscas."
                      />
                    </label>
                  </div>
                ) : (
                  <p className="de-profile-description">
                    {perfil.descripcion || 'Aun no hay una descripcion registrada para esta empresa.'}
                  </p>
                )}
              </section>

              <section className="de-profile-card">
                <div className="de-profile-card-header">
                  <div>
                    <h3 className="de-profile-card-title">Actividad en FWD</h3>
                    <p className="de-profile-card-subtitle">Resumen generado desde tus proyectos y ofertas.</p>
                  </div>
                  <CalendarDays size={20} className="de-profile-muted-icon" />
                </div>

                <div className="de-profile-stats">
                  {estadisticas.map(({ label, value, icon: Icon, color }) => (
                    <div key={label} className="de-profile-stat">
                      <span className={`de-stat-icon ${color}`}><Icon size={18} /></span>
                      <strong>{value}</strong>
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="de-profile-card">
                <h3 className="de-profile-card-title">Informacion empresarial</h3>
                <div className="de-profile-info-grid">
                  <div>
                    <Building2 size={18} />
                    <span>Tipo de empresa</span>
                    <strong>{usuario.tipo_empresa || 'No registrado'}</strong>
                  </div>
                  <div>
                    <Briefcase size={18} />
                    <span>Sector</span>
                    <strong>{perfil.sector || 'No registrado'}</strong>
                  </div>
                  <div>
                    <Globe size={18} />
                    <span>Sitio web</span>
                    <strong>{perfil.sitio_web || 'No registrado'}</strong>
                  </div>
                </div>
              </section>
            </section>
          </main>
        )}
      </div>
    </DashboardLayout>
  );
}

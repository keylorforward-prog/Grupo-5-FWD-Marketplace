/**
 * Catálogo central de rutas y helpers de rol.
 * Importar desde aquí en vez de hardcodear strings en componentes.
 */

export const RUTAS = {
  // Públicas
  raiz: '/',
  login: '/login',
  loginAdmin: '/login/admin',
  registro: '/registro',
  googleCallback: '/auth/callback',

  // Egresado
  egresado: '/egresado',
  egresadoDashboard: '/egresado/dashboard',
  egresadoPostulaciones: '/egresado/dashboard/postulaciones',
  egresadoProyectos: '/egresado/dashboard/proyectos',
  egresadoHistorial: '/egresado/dashboard/historial',
  egresadoMensajes: '/egresado/dashboard/mensajes',
  egresadoExplorar: '/egresado/dashboard/explorar',
  egresadoNotificaciones: '/egresado/dashboard/notificaciones',
  egresadoPerfil: '/egresado/perfil',
  egresadoConfiguracion: '/egresado/configuracion',

  // Empresa
  empresa: '/empresa',
  empresaDashboard: '/DashboardEmpresario',
  empresaPostulaciones: '/empresa/postulaciones',

  // Admin
  admin: '/admin',

  // Compartidas
  soporte: '/soporte',
  mensajes: '/mensajes',
};

const SINONIMOS_ROL = {
  estudiante: 'estudiante',
  egresado: 'estudiante',
  alumno: 'estudiante',
  empresa: 'empresa',
  empresario: 'empresa',
  empresarial: 'empresa',
  admin: 'admin',
  administrador: 'admin',
};

/** Devuelve un rol normalizado: 'estudiante' | 'empresa' | 'admin' | null. */
export function obtenerRol(usuario) {
  if (!usuario) return null;
  const candidato = (usuario.rol || usuario.role || usuario.tipo_usuario || '')
    .toString()
    .trim()
    .toLowerCase();
  return SINONIMOS_ROL[candidato] ?? null;
}

/** Ruta del dashboard correspondiente a un rol normalizado. */
export function rutaDashboardDeRol(rol) {
  switch (rol) {
    case 'estudiante': return RUTAS.egresadoDashboard;
    case 'empresa': return RUTAS.empresaDashboard;
    case 'admin': return RUTAS.admin;
    default: return RUTAS.login;
  }
}


// Definición de Colores de Marca FWD (Senior Approach)
export const COLORES_FWD = {
  moradoLogin: '#a78bfa', // violet-400 (el que usas en el login)
  cyanFwd: '#1ad1c8',    // cyan
  fondoDark: '#111827',   // gray-900
};

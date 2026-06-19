import apiClient from './apiClient';

const coloresAcento = ['azul', 'aqua', 'morado', 'naranja', 'magenta', 'amarillo'];

const normalizarTecnologias = (valor) => {
  if (Array.isArray(valor)) return valor;
  if (!valor) return [];
  return valor
    .split(/[,;\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
};

const inferirCategoria = (tecnologias = [], usarIa = 'NO') => {
  const texto = tecnologias.join(' ').toLowerCase();
  if (usarIa === 'SI' || texto.includes('data') || texto.includes('chart')) return 'data';
  if (texto.includes('figma') || texto.includes('dise')) return 'diseno';
  if (texto.includes('react native') || texto.includes('mobile') || texto.includes('movil')) return 'movil';
  if (texto.includes('node') || texto.includes('express') || texto.includes('api')) return 'backend';
  return 'web';
};

const numero = (valor, respaldo = 0) => {
  const convertido = Number(valor);
  return Number.isFinite(convertido) ? convertido : respaldo;
};

const estadoVisual = (estado = 'ACTIVA') => {
  const normalizado = estado.toUpperCase();
  if (normalizado === 'ACTIVA') return { estado: 'ACTIVO', tipoEstado: 'activo' };
  if (normalizado === 'PAUSADA') return { estado: 'PAUSADA', tipoEstado: 'pendiente' };
  return { estado: normalizado, tipoEstado: 'pendiente' };
};

export const normalizarPropuestaEgresado = (propuesta, indice = 0) => {
  const tecnologias = normalizarTecnologias(propuesta.tecnologias_requeridas ?? propuesta.tecnologias);
  const plazoDias = numero(propuesta.plazo_dias ?? propuesta.diasMax, 7);
  const presupuestoMin = numero(propuesta.presupuesto_min ?? propuesta.presupuestoMin, 0);
  const presupuestoMax = numero(propuesta.presupuesto_max ?? propuesta.presupuestoMax, presupuestoMin);
  const empresa = propuesta.perfilEmpresario?.usuario;
  const perfilEmp = propuesta.perfilEmpresario;

  return {
    id: propuesta.id_propuesta ?? propuesta.id,
    titulo: propuesta.titulo,
    categoria: inferirCategoria(tecnologias, propuesta.usar_ia),
    descripcion: propuesta.descripcion,
    tecnologias,
    presupuestoMin,
    presupuestoMax,
    diasMin: plazoDias,
    diasMax: plazoDias,
    modalidad: propuesta.modalidad ?? 'remoto',
    publicado: (propuesta.fecha_publicacion ?? propuesta.publicado ?? '').toString().slice(0, 10),
    colorAcento: coloresAcento[indice % coloresAcento.length],
    empresa: empresa?.nombre || null,
    empresaLogo: perfilEmp?.logo || null,
    ...estadoVisual(propuesta.estado),
  };
};

const extraerData = (respuesta) => respuesta.data?.data ?? respuesta.data ?? [];

const normalizarOfertaEmpleo = (oferta) => {
  const tecnologias = normalizarTecnologias(oferta.tecnologias_requeridas);
  const estado = oferta.estado ?? 'ACTIVA';
  return {
    id:           oferta.id_oferta_empleo,
    titulo:       oferta.titulo,
    descripcion:  oferta.descripcion,
    empresa:      oferta.perfilEmpresario?.usuario?.nombre || null,
    tecnologias,
    modalidad:    oferta.modalidad    ?? 'remoto',
    tipo_jornada: oferta.tipo_jornada ?? null,
    salario_min:  oferta.salario_min  != null ? Number(oferta.salario_min)  : null,
    salario_max:  oferta.salario_max  != null ? Number(oferta.salario_max)  : null,
    ubicacion:    oferta.ubicacion    ?? null,
    publicado:    (oferta.fecha_publicacion ?? '').toString().slice(0, 10),
    estado,
    tipoEstado:   estado === 'ACTIVA' ? 'activo' : 'pendiente',
    ya_postulado: oferta.ya_postulado ?? false,
  };
};

export const egresadoService = {
  async listarOfertasEmpleo() {
    const respuesta = await apiClient.get('/dashboard-egresado/ofertas-empleo');
    return extraerData(respuesta).map(normalizarOfertaEmpleo);
  },

  async postularOfertaEmpleo(datos) {
    const respuesta = await apiClient.post('/dashboard-egresado/ofertas-empleo/postular', datos);
    return respuesta.data;
  },

  async listarPropuestas() {
    const respuesta = await apiClient.get('/propuestas');
    return extraerData(respuesta).map(normalizarPropuestaEgresado);
  },

  async obtenerPropuestaPorId(id) {
    const respuesta = await apiClient.get(`/propuestas/${id}`);
    return extraerData(respuesta);
  },

  async obtenerPropuesta(id) {
    const respuesta = await apiClient.get(`/propuestas/${id}`);
    return normalizarPropuestaEgresado(respuesta.data?.data ?? respuesta.data);
  },

  async postularse(idPropuesta, datos = {}) {
    const respuesta = await apiClient.post('/postulaciones', {
      id_propuesta: idPropuesta,
      ...datos,
    });
    return respuesta.data;
  },

  async obtenerPostulacion(id) {
    const respuesta = await apiClient.get(`/postulaciones/${id}`);
    return respuesta.data?.data ?? respuesta.data;
  },

  async actualizarPostulacion(id, datos) {
    const respuesta = await apiClient.put(`/postulaciones/${id}`, datos);
    return respuesta.data;
  },

  async eliminarPostulacion(id) {
    const respuesta = await apiClient.delete(`/postulaciones/${id}`);
    return respuesta.data;
  },
};

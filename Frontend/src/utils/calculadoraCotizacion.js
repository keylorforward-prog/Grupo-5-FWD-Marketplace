// ─── Rangos de referencia de mercado junior — Costa Rica ─────────────────────
export const TARIFA_REFERENCIA = {
  min:   8,   // USD/hora — piso junior CR
  media: 15,  // USD/hora — centro del rango
  max:   25,  // USD/hora — techo junior-intermedio CR
};

// Tipo de cambio aproximado. Actualizar si se conecta a una API de cambio.
export const TIPO_CAMBIO_CRC = 520; // CRC por 1 USD

// ─── Modalidad (remoto / híbrido / presencial) ────────────────────────────────
export const MODALIDAD_MULTIPLICADOR = {
  remoto:     1.0,
  hibrido:    1.05,
  presencial: 1.10,
};

export const ETIQUETAS_MODALIDAD = {
  remoto:     'Remoto',
  hibrido:    'Híbrido',
  presencial: 'Presencial',
};

export const TOOLTIP_MODALIDAD = {
  remoto:     'Trabajo 100% remoto — sin gastos de desplazamiento.',
  hibrido:    'Combinación de remoto y presencial — gastos parciales.',
  presencial: 'Trabajo en sitio del cliente — gastos de transporte y tiempo extra.',
};

// ─── Tipos de entregable ─────────────────────────────────────────────────────
export const TIPOS_ENTREGABLE = [
  { valor: 'desarrollo',     label: 'Desarrollo' },
  { valor: 'diseno',         label: 'Diseño UI/UX' },
  { valor: 'api',            label: 'API / Integración' },
  { valor: 'testing',        label: 'Testing / QA' },
  { valor: 'documentacion',  label: 'Documentación' },
  { valor: 'reunion',        label: 'Reunión / Coordinación' },
  { valor: 'otro',           label: 'Otro' },
];

// ─── Multiplicadores por nivel de complejidad ─────────────────────────────────
export const MULTIPLICADOR_COMPLEJIDAD = {
  baja:  1.0,
  media: 1.3,
  alta:  1.6,
};

export const ETIQUETAS_COMPLEJIDAD = {
  baja:  'Baja',
  media: 'Media',
  alta:  'Alta',
};

export const TOOLTIP_COMPLEJIDAD = {
  baja:  'Proyectos con tecnologías conocidas, requisitos claros y poca incertidumbre.',
  media: 'Proyectos con algunas integraciones, lógica de negocio moderada o tecnologías nuevas.',
  alta:  'Proyectos con alta incertidumbre, múltiples integraciones, lógica compleja o plazos ajustados.',
};

// ─── Función principal ────────────────────────────────────────────────────────
/**
 * Calcula la cotización completa a partir de los inputs del egresado.
 *
 * @param {object} params
 * @param {number}   params.tarifaHora       - Tarifa base en USD/hora
 * @param {Array}    params.desgloseTareas   - [{ id, nombre, horas }]
 * @param {string}   params.complejidad      - 'baja' | 'media' | 'alta'
 * @param {number}   params.ivaPorcentaje    - Porcentaje de IVA (default 13 para CR)
 * @returns {object} Resultado completo con desglose, rangos y payload para el backend
 */
export function calcularCotizacion({
  tarifaHora,
  desgloseTareas = [],
  complejidad = 'media',
  modalidad = 'remoto',
  ivaPorcentaje = 13,
}) {
  const tarifa        = Math.max(0, Number(tarifaHora) || 0);
  const multComplejidad = MULTIPLICADOR_COMPLEJIDAD[complejidad] ?? 1.0;
  const multModalidad   = MODALIDAD_MULTIPLICADOR[modalidad] ?? 1.0;
  const totalHoras    = desgloseTareas.reduce((s, t) => s + (Math.max(0, Number(t.horas) || 0)), 0);

  const subtotalBase    = parseFloat((tarifa * totalHoras).toFixed(2));
  const subtotalAjust   = parseFloat((subtotalBase * multComplejidad * multModalidad).toFixed(2));
  const montoIva        = parseFloat((subtotalAjust * (ivaPorcentaje / 100)).toFixed(2));
  const total           = parseFloat((subtotalAjust + montoIva).toFixed(2));

  // Rango: -15% mínimo, +20% máximo
  const rango = {
    min:      parseFloat((total * 0.85).toFixed(2)),
    estimado: total,
    max:      parseFloat((total * 1.20).toFixed(2)),
  };

  // Equivalencia en CRC
  const crc = {
    min:      Math.round(rango.min      * TIPO_CAMBIO_CRC),
    estimado: Math.round(rango.estimado * TIPO_CAMBIO_CRC),
    max:      Math.round(rango.max      * TIPO_CAMBIO_CRC),
  };

  return {
    // Desglose explicativo
    tarifa,
    totalHoras,
    subtotalBase,
    multiplicador: multComplejidad,
    multModalidad,
    modalidad,
    complejidad,
    subtotalAjust,
    ivaPorcentaje,
    montoIva,
    total,
    rango,
    crc,
    // Referencia de mercado
    referenciaMercado: {
      min:      TARIFA_REFERENCIA.min,
      media:    TARIFA_REFERENCIA.media,
      max:      TARIFA_REFERENCIA.max,
      crcMin:   Math.round(TARIFA_REFERENCIA.min * TIPO_CAMBIO_CRC),
      crcMedia: Math.round(TARIFA_REFERENCIA.media * TIPO_CAMBIO_CRC),
      crcMax:   Math.round(TARIFA_REFERENCIA.max * TIPO_CAMBIO_CRC),
    },
    // Payload listo para enviar al backend (campos del modelo Postulacion)
    payloadBackend: {
      tarifa_hora:     tarifa,
      desglose_tareas: desgloseTareas,
      total_horas:     totalHoras,
      modalidad,
      subtotal:        subtotalAjust,
      iva:             montoIva,
      total,
      presupuesto_max: rango.max,
    },
  };
}

// ─── Evaluación vs. referencia de mercado ────────────────────────────────────
/**
 * Compara la tarifa ingresada con los rangos de referencia junior CR.
 * @returns {{ nivel: string, msg: string }}
 */
export function evaluarVsReferencia(tarifaHora) {
  const t = Number(tarifaHora);
  if (!t || t <= 0)
    return { nivel: 'sin-dato', msg: 'Ingresá tu tarifa por hora para ver la comparación.' };
  if (t < TARIFA_REFERENCIA.min)
    return { nivel: 'bajo',  msg: `Por debajo del rango junior CR. Considera subir tu tarifa.` };
  if (t <= TARIFA_REFERENCIA.media)
    return { nivel: 'ok',    msg: `Dentro del rango junior CR. Buena referencia de partida.` };
  if (t <= TARIFA_REFERENCIA.max)
    return { nivel: 'bueno', msg: `Tarifa competitiva para un junior-intermedio en CR.` };
  return { nivel: 'alto',  msg: `Tarifa alta respecto al rango junior CR. Asegurate de que tu perfil y experiencia lo justifiquen.` };
}

// ─── Auto‑cálculo desde presupuesto del proyecto ─────────────────────────────
/**
 * Determina la complejidad sugerida según el presupuesto promedio del proyecto.
 *   ≤ $500  → baja
 *   ≤ $1500 → media
 *   > $1500 → alta
 */
export function sugerirComplejidadPorPresupuesto(presupuestoMin, presupuestoMax) {
  const min = Number(presupuestoMin) || 0;
  const max = Number(presupuestoMax) || 0;
  const promedio = (min + max) / 2;
  if (promedio <= 500) return 'baja';
  if (promedio <= 1500) return 'media';
  return 'alta';
}

/**
  * Calcula la tarifa/hora sugerida para que el total estimado
  * se alinee con el presupuesto promedio del proyecto.
  *   total = tarifa × totalHoras × multiplicador × (1 + iva/100)
  *   → tarifa = presupuestoPromedio / (totalHoras × multiplicador × 1.13)
  */
export function calcularTarifaSugerida(presupuestoMin, presupuestoMax, totalHoras, multiplicadorComplejidad = 1.0) {
  if (!totalHoras || totalHoras <= 0) return null;
  const min = Number(presupuestoMin) || 0;
  const max = Number(presupuestoMax) || 0;
  const promedio = (min + max) / 2;
  if (promedio <= 0) return null;
  const factor = multiplicadorComplejidad * 1.13;
  const sugerida = parseFloat((promedio / totalHoras / factor).toFixed(2));
  const rango = {
    min: min > 0 ? parseFloat((min / totalHoras / factor).toFixed(2)) : null,
    max: max > 0 ? parseFloat((max / totalHoras / factor).toFixed(2)) : null,
  };
  return { sugerida, rango };
}

// ─── Helpers de formato ───────────────────────────────────────────────────────
const fmtUSD = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const fmtCRC = new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', maximumFractionDigits: 0 });

export const formatUSD = (n) => fmtUSD.format(Number(n) || 0);
export const formatCRC = (n) => fmtCRC.format(Number(n) || 0);

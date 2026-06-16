import { useMemo } from 'react';

const ordenadores = {
  recientes: (a, b) => b.publicado.localeCompare(a.publicado),
  presupuestoDesc: (a, b) => b.presupuestoMax - a.presupuestoMax,
  presupuestoAsc: (a, b) => a.presupuestoMin - b.presupuestoMin,
  duracionAsc: (a, b) => a.diasMin - b.diasMin,
};

export function useFiltroProyectos(proyectos, filtros) {
  const {
    busqueda = '',
    categoriaActiva = 'todas',
    tecnologia = '',
    presupuestoMin = '',
    presupuestoMax = '',
    duracion = 'cualquiera',
    modalidades = [],
    orden = 'recientes',
  } = filtros;

  return useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    const filtrados = proyectos.filter((p) => {
      if (texto) {
        const enTitulo = p.titulo.toLowerCase().includes(texto);
        const enDescripcion = p.descripcion.toLowerCase().includes(texto);
        const enTecs = p.tecnologias.some((t) => t.toLowerCase().includes(texto));
        if (!enTitulo && !enDescripcion && !enTecs) return false;
      }

      if (categoriaActiva !== 'todas' && p.categoria !== categoriaActiva) return false;

      if (tecnologia && !p.tecnologias.includes(tecnologia)) return false;

      const pMin = Number(presupuestoMin);
      const pMax = presupuestoMax === '' ? Infinity : Number(presupuestoMax);
      if (Number.isFinite(pMin) && p.presupuestoMin < pMin) return false;
      if (Number.isFinite(pMax) && p.presupuestoMax > pMax) return false;

      if (duracion === 'corta' && p.diasMax >= 7) return false;
      if (duracion === 'media' && (p.diasMin < 7 || p.diasMax > 14)) return false;
      if (duracion === 'larga' && p.diasMin <= 14) return false;

      if (modalidades.length && !modalidades.includes(p.modalidad)) return false;

      return true;
    });

    const ordenador = ordenadores[orden] ?? ordenadores.recientes;
    return [...filtrados].sort(ordenador);
  }, [proyectos, busqueda, categoriaActiva, tecnologia, presupuestoMin, presupuestoMax, duracion, modalidades, orden]);
}

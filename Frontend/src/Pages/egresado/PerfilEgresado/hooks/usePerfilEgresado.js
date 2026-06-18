import { useEffect, useState, useCallback } from 'react';
import { egresadoDashboardService } from '../../../../services/egresadoDashboardService';

const fondos = [
  'fondoAzulClaro', 'fondoAzulMedio', 'fondoAzulOscuro',
  'fondoMorado', 'fondoNaranja', 'fondoMoradoClaro',
];

export const elegirFondoRotativo = (indice) => fondos[indice % fondos.length];

const perfilVacio = {
  nombre: '',
  rol: '',
  avatar: '/Imgs/Logotipo/Digital/Sintesis/FWD - Sintesis-01.png',
  portfolio: '',
  linkedin: '',
  bio: '',
  tecnologias: [],
};

export function usePerfilEgresado() {
  const [perfil, setPerfil] = useState(perfilVacio);
  const [cargando, setCargando] = useState(true);
  const [catalogoTecnologias, setCatalogoTecnologias] = useState([]);

  useEffect(() => {
    let activo = true;
    egresadoDashboardService.obtenerCatalogoTecnologias().then((lista) => {
      if (activo) setCatalogoTecnologias(lista);
    });
    egresadoDashboardService.obtenerPerfil()
      .then((data) => {
        if (!activo) return;
        setPerfil({
          nombre: data.nombre || data.usuario?.nombre || '',
          rol: data.titulo_fwd || data.rol || 'Estudiante de Desarrollo de Software',
          avatar: data.foto_perfil || data.usuario?.foto_perfil || perfilVacio.avatar,
          portfolio: data.portfolio || '',
          linkedin: data.linkedin || '',
          bio: data.descripcion || data.bio || '',
          tecnologias: Array.isArray(data.tecnologias)
            ? data.tecnologias.map((t, i) => ({
                nombre: typeof t === 'string' ? t : t.nombre,
                fondo: elegirFondoRotativo(i),
              }))
            : [],
        });
      })
      .catch(() => {
        if (activo) setPerfil(perfilVacio);
      })
      .finally(() => {
        if (activo) setCargando(false);
      });
    return () => { activo = false; };
  }, []);

  const actualizar = useCallback((cambios) => {
    setPerfil((prev) => {
      const siguiente = { ...prev, ...cambios };
      egresadoDashboardService.actualizarPerfil(siguiente).catch(() => {});
      return siguiente;
    });
  }, []);

  const agregarTecnologia = useCallback((nombre) => {
    const limpio = nombre.trim();
    if (!limpio) return;
    setPerfil((prev) => {
      if (prev.tecnologias.some((t) => t.nombre.toLowerCase() === limpio.toLowerCase())) {
        return prev;
      }
      const siguiente = {
        ...prev,
        tecnologias: [
          ...prev.tecnologias,
          { nombre: limpio, fondo: elegirFondoRotativo(prev.tecnologias.length) },
        ],
      };
      egresadoDashboardService.actualizarPerfil(siguiente).catch(() => {});
      return siguiente;
    });
  }, []);

  const quitarTecnologia = useCallback((nombre) => {
    setPerfil((prev) => {
      const siguiente = {
        ...prev,
        tecnologias: prev.tecnologias.filter((t) => t.nombre !== nombre),
      };
      egresadoDashboardService.actualizarPerfil(siguiente).catch(() => {});
      return siguiente;
    });
  }, []);

  return { perfil, actualizar, agregarTecnologia, quitarTecnologia, cargando, catalogoTecnologias };
}

import { useEffect, useState } from 'react';

const CLAVE = 'perfilEgresado';

export const perfilInicial = {
  nombre: 'Alex Rivera',
  rol: 'Estudiante de Desarrollo de Software',
  avatar: '/Imgs/Logotipo/Digital/Sintesis/FWD - Sintesis-01.png',
  portfolio: 'https://alex-rivera.dev',
  linkedin: 'https://linkedin.com/in/alexrivera',
  bio: 'Soy un estudiante apasionado por la tecnología y la creación de productos digitales, actualmente cursando mis estudios en Desarrollo de Software. Disfruto aprendiendo nuevas tecnologías como React y Node.js en mi tiempo libre. Estoy buscando mi primera oportunidad como practicante o desarrollador Junior para aportar mi energía y seguir creciendo profesionalmente en un entorno colaborativo.',
  tecnologias: [
    { nombre: 'React.js', fondo: 'fondoAzulClaro' },
    { nombre: 'Node.js', fondo: 'fondoAzulMedio' },
    { nombre: 'HTML & CSS', fondo: 'fondoAzulOscuro' },
    { nombre: 'JavaScript', fondo: 'fondoMorado' },
    { nombre: 'PostgreSQL', fondo: 'fondoNaranja' },
    { nombre: 'Git', fondo: 'fondoMoradoClaro' },
  ],
};

const fondos = [
  'fondoAzulClaro', 'fondoAzulMedio', 'fondoAzulOscuro',
  'fondoMorado', 'fondoNaranja', 'fondoMoradoClaro',
];

export const elegirFondoRotativo = (indice) => fondos[indice % fondos.length];

export function usePerfilEgresado() {
  const [perfil, setPerfil] = useState(() => {
    const guardado = localStorage.getItem(CLAVE);
    return guardado ? { ...perfilInicial, ...JSON.parse(guardado) } : perfilInicial;
  });

  useEffect(() => {
    localStorage.setItem(CLAVE, JSON.stringify(perfil));
  }, [perfil]);

  const actualizar = (cambios) => setPerfil((prev) => ({ ...prev, ...cambios }));

  const agregarTecnologia = (nombre) => {
    const limpio = nombre.trim();
    if (!limpio) return;
    setPerfil((prev) => {
      if (prev.tecnologias.some((t) => t.nombre.toLowerCase() === limpio.toLowerCase())) {
        return prev;
      }
      return {
        ...prev,
        tecnologias: [
          ...prev.tecnologias,
          { nombre: limpio, fondo: elegirFondoRotativo(prev.tecnologias.length) },
        ],
      };
    });
  };

  const quitarTecnologia = (nombre) => {
    setPerfil((prev) => ({
      ...prev,
      tecnologias: prev.tecnologias.filter((t) => t.nombre !== nombre),
    }));
  };

  return { perfil, actualizar, agregarTecnologia, quitarTecnologia };
}

import { useEffect, useState } from 'react';

export function useScrollSpy(ids, opciones = {}) {
  const { offset = 120 } = opciones;
  const [activo, setActivo] = useState(ids[0] ?? null);

  useEffect(() => {
    const manejarScroll = () => {
      const y = window.scrollY + offset;
      let actual = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= y) actual = id;
      }
      setActivo(actual);
    };

    manejarScroll();
    window.addEventListener('scroll', manejarScroll, { passive: true });
    return () => window.removeEventListener('scroll', manejarScroll);
  }, [ids, offset]);

  return [activo, setActivo];
}

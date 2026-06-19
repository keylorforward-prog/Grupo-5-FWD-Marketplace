import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import './ThemeSwitcher.css';

export default function ThemeSwitcher() {
  const [tema, setTema] = useState(() => {
    if (typeof document === 'undefined') return 'light';
    return document.documentElement.dataset.theme || localStorage.getItem('tema') || 'light';
  });

  useEffect(() => {
    document.documentElement.dataset.theme = tema;
    localStorage.setItem('tema', tema);
  }, [tema]);

  const alternarTema = () => {
    setTema((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <button 
      onClick={alternarTema} 
      className="theme-switcher-btn"
      aria-label="Alternar tema"
      title={tema === 'light' ? 'Modo oscuro' : 'Modo claro'}
    >
      {tema === 'light' ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { RUTAS } from '../../routes/rutas';
import Button from './Button.jsx';

export default function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-[#111827]/80 border-b border-white/10 px-6 md:px-12 py-4 flex items-center justify-between transition-colors duration-300">
      
      {/* Identidad Visual */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(RUTAS.raiz)}>
        <span className="font-heading text-2xl font-extrabold text-white tracking-tight">
          FWD<span className="text-[#a78bfa]">.</span>
        </span>
      </div>

      {/* Navegación Desktop */}
      <div className="hidden md:flex items-center gap-4">
        <Button variant="ghost" to={RUTAS.login}>
          Iniciar Sesión
        </Button>
        <Button variant="primary" to={RUTAS.registro}>
          Registrarse
        </Button>
      </div>

      {/* Botón Menú Móvil */}
      <button 
        className="md:hidden text-white hover:text-[#a78bfa] transition-colors focus:outline-none cursor-pointer" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Alternar menú de navegación"
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Menú Desplegable Móvil */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-[#111827] border-b border-white/10 p-6 flex flex-col gap-4 md:hidden shadow-2xl animate-fade-in">
          <Button variant="ghost" to={RUTAS.login} className="w-full justify-start py-4" onClick={() => setIsOpen(false)}>
            Iniciar Sesión
          </Button>
          <Button variant="primary" to={RUTAS.registro} className="w-full" onClick={() => setIsOpen(false)}>
            Registrarse
          </Button>
        </div>
      )}
    </nav>
  );
}
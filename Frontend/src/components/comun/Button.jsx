import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Componente Maestro de Botones FWD
 * Define el estándar visual, dimensiones y estados interactivos.
 */
export default function Button({ 
  children, 
  variant = 'primary', 
  to, 
  className = '', 
  onClick,
  type = 'button',
  ...props 
}) {
  const navigate = useNavigate();

  // Dimensiones y tipografía centralizadas
  const baseClasses = "inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm tracking-tight transition-all duration-200 cursor-pointer active:scale-[0.98]";
  
  // Paleta de colores restringida al diseño de FWD
  const variants = {
    primary: "bg-[#a78bfa] text-[#111827] hover:bg-white shadow-[0_0_15px_rgba(167,139,250,0.3)]",
    secondary: "bg-white/5 text-white hover:bg-white/10 border border-white/10",
    ghost: "text-white/80 hover:text-white bg-transparent"
  };

  const handleClick = (e) => {
    if (to) navigate(to);
    if (onClick) onClick(e);
  };

  return (
    <button 
      type={type}
      onClick={handleClick}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
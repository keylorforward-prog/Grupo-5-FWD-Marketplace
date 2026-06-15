import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import { RUTAS } from '../../../routes/rutas';

/**
 * Vista de Autenticación Administrativa (Login)
 * Implementa control de estado local para los inputs y navegación imperativa
 * mediante react-router-dom para simular la transición al Dashboard.
 */
export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simulación operativa del flujo de autenticación del Frontend
    console.log('Autenticando credenciales de administrador...', { email });
    
    // Transición de ruta imperativa hacia el Panel de Administración
    navigate(RUTAS.admin);
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-ink-strong font-body text-canvas px-4 selection:bg-primary/20">
      
      {/* Contenedor sutil de efectos de iluminación de marca de fondo */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-[#1e293b] p-8 rounded-2xl border border-border/10 shadow-elevated relative z-10">
        
        {/* Cabecera del Formulario */}
        <div className="text-center mb-8 space-y-2">
          <h1 className="font-heading text-4xl font-extrabold tracking-tight text-canvas">
            FWD<span className="text-accent">.</span>
          </h1>
          <p className="text-sm text-ink-muted">Workspace de Administración General</p>
        </div>

        {/* Formulario Controlado */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Input de Correo Electrónico */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-ink-muted block">
              Correo Electrónico
            </label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted group-focus-within:text-accent transition-colors" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@fundacionforward.org"
                className="w-full pl-12 pr-4 py-3 bg-[#0f172a] border border-border/20 rounded-xl text-sm text-canvas placeholder:text-ink-subtle focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
              />
            </div>
          </div>

          {/* Input de Contraseña */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-ink-muted block">
                Contraseña
              </label>
              <button 
                type="button"
                onClick={() => console.log('Redirección a recuperación de credenciales...')}
                className="text-xs font-medium text-accent hover:text-canvas transition-colors"
              >
                ¿Olvidó su contraseña?
              </button>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted group-focus-within:text-accent transition-colors" size={18} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-12 pr-4 py-3 bg-[#0f172a] border border-border/20 rounded-xl text-sm text-canvas placeholder:text-ink-subtle focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
              />
            </div>
          </div>

          {/* Botón de Acción de Envío (Acceso Clicleable) */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-primary text-white font-bold text-sm rounded-xl shadow-soft hover:bg-primary-foreground hover:text-ink-strong active:scale-[0.98] transition-all cursor-pointer group mt-2"
          >
            <span>Ingresar al Panel</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
          
        </form>

      </div>
    </div>
  );
}

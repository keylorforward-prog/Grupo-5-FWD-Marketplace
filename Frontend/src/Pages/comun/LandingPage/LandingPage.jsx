import React from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import Navbar from '../../../components/comun/Navbar.jsx';
import Button from '../../../components/comun/Button.jsx';

// IMPORTACIÓN DE IMÁGENES
import SoftwareImg from '../../../assets/Software.png';
import EnglishImg from '../../../assets/English-Teach.png';
import WorkingImg from '../../../assets/Working.png';

export default function LandingPage() {
  const scrollToNext = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full bg-[#111827] min-h-screen pt-[68px] selection:bg-[#a78bfa]/20 font-body">
      
      <Navbar />
      
      {/* SECCIÓN 1: CAPACITACIÓN TÉCNICA */}
      <section id="software" className="relative h-[calc(100vh-68px)] w-full flex items-center justify-start px-6 md:px-20 overflow-hidden border-b border-white/5">
        <img 
          src={SoftwareImg} 
          alt="Entorno de Capacitación en Desarrollo FWD" 
          className="absolute inset-0 w-full h-full object-cover brightness-[0.4] scale-105 animate-subtle-zoom"
        />
        
        <div className="relative z-10 p-8 md:p-12 backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl max-w-2xl shadow-2xl animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-black text-white font-heading leading-tight tracking-tighter">
            El código <span className="text-[#a78bfa]">transforma</span> el futuro
          </h1>
          <p className="mt-6 text-lg md:text-xl text-white/80 leading-relaxed">
            Domina el desarrollo Full Stack desde la raíz. En FWD te brindamos capacitación técnica de estándar global para convertirte en el talento que las empresas transnacionales necesitan.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <Button variant="primary" to="/registro" className="group">
              Iniciar mi viaje <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="secondary" onClick={() => scrollToNext('idiomas')}>
              Saber más
            </Button>
          </div>
        </div>

        <button 
          onClick={() => scrollToNext('idiomas')}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[#a78bfa]/40 hover:text-[#a78bfa] transition-colors animate-bounce hidden md:block z-20 focus:outline-none cursor-pointer"
          aria-label="Ir a sección de idiomas"
        >
          <ChevronDown size={36} strokeWidth={1.5} />
        </button>
      </section>

      {/* SECCIÓN 2: IDIOMAS */}
      <section id="idiomas" className="relative h-screen w-full flex items-center justify-end px-6 md:px-20 overflow-hidden border-b border-white/5">
        <img 
          src={EnglishImg} 
          alt="Clases de Inglés Técnico FWD" 
          className="absolute inset-0 w-full h-full object-cover brightness-[0.35]"
        />
        
        <div className="relative z-10 p-8 md:p-12 backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl max-w-2xl shadow-2xl text-right animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-black text-white font-heading leading-tight tracking-tight">
            Sin fronteras <br /> <span className="text-[#a78bfa]">idiomáticas</span>
          </h2>
          <p className="mt-6 text-lg md:text-xl text-white/80 leading-relaxed">
            Tu talento no tiene límites. Potenciamos tu inglés técnico y habilidades de comunicación corporativa para que las puertas del mercado laboral global se abran de par en par para ti.
          </p>
        </div>

        <button 
          onClick={() => scrollToNext('empleo')}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[#a78bfa]/30 hover:text-[#a78bfa] transition-colors animate-bounce hidden md:block z-20 cursor-pointer"
        >
          <ChevronDown size={36} strokeWidth={1.5} />
        </button>
      </section>

      {/* SECCIÓN 3: INSERCIÓN LABORAL */}
      <section id="empleo" className="relative h-screen w-full flex items-center justify-center px-6 overflow-hidden">
        <img 
          src={WorkingImg} 
          alt="Equipo transnacional colaborando" 
          className="absolute inset-0 w-full h-full object-cover brightness-[0.4]"
        />
        
        <div className="relative z-10 text-center text-white max-w-3xl backdrop-blur-md bg-[#111827]/60 p-10 md:p-16 rounded-3xl border border-white/10 shadow-2xl animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-black font-heading tracking-tighter leading-tight">
            Tu primer empleo <br className="sm:hidden" /> de alto impacto
          </h2>
          <p className="mt-8 text-xl md:text-2xl text-white/90 leading-relaxed max-w-2xl mx-auto">
            Conectamos directamente tu perfil calificado con corporaciones globales y empresas tecnológicas que buscan activamente tu talento para roles de entrada.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row gap-5 justify-center items-center">
            <Button variant="primary" to="/registro" className="group">
              Postularme al Programa <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="secondary" to="/login">
              Tengo una cuenta
            </Button>
          </div>
        </div>
      </section>

      {/* FOOTER CORPORATIVO */}
      <footer className="py-12 text-center text-white/40 border-t border-white/10 bg-[#0f172a]">
        <div className="max-w-7xl mx-auto px-6">
          <p className="font-heading text-lg font-bold text-white/60 mb-2">FWD<span className="text-[#a78bfa]">.</span> Marketplace</p>
          <p className="text-sm font-medium">&copy; {new Date().getFullYear()} FWD Costa Rica - Todos los derechos reservados.</p>
          <p className="text-xs mt-4 text-white/20 max-w-md mx-auto">Impulsando el ecosistema tecnológico de Costa Rica conectando talento junior calificado con oportunidades globales.</p>
        </div>
      </footer>
    </div>
  );
}
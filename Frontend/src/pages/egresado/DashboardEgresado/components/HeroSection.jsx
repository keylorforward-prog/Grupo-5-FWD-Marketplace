import React from 'react';
import SearchBar from './SearchBar';

function HeroSection() {
  return (
    <section className="seccionHero">
      <div className="textoHero">
        <h1 className="tituloHero">Encuentra tu <span className="textoResaltado">próximo desafío</span></h1>
        <p className="subtituloHero">Explora proyectos freelance, empleos y oportunidades recomendadas para ti.</p>
        <SearchBar />
      </div>
      <div className="ilustracionHero">
         <div className="ilustracionFalsa"></div>
      </div>
    </section>
  );
}

export default HeroSection;

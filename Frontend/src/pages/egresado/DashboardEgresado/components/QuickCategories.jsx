import React from 'react';
import { Folder, Briefcase, Bot } from 'lucide-react';
import CategoryCard from './CategoryCard';

function QuickCategories() {
  return (
    <section className="categoriasRapidas">
      <CategoryCard 
        isActive={true} 
        colorClass="azul" 
        icon={Folder} 
        title="Proyectos FWD" 
        description="Proyectos freelance publicados en la plataforma." 
      />
      <CategoryCard 
        isActive={false} 
        colorClass="gris" 
        icon={Briefcase} 
        title="Empleos Junior" 
        description="Puestos de trabajo, pasantías y prácticas." 
      />
      <CategoryCard 
        isActive={false} 
        colorClass="verde" 
        icon={Bot} 
        title="Oportunidades IA" 
        description="Ofertas externas recomendadas para ti." 
        badge="IA"
      />
    </section>
  );
}

export default QuickCategories;

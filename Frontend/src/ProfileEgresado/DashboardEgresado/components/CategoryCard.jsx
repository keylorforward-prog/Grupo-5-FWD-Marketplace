import React from 'react';

function CategoryCard({ isActive, colorClass, icon: Icon, title, description, badge }) {
  return (
    <div className={`tarjetaCategoria ${isActive ? 'activa' : ''}`}>
      <div className={`iconoCategoria ${colorClass}`}>
        <Icon size={24} />
      </div>
      <div className="infoCategoria">
        <h3 className="tituloCategoria">
          {title} {badge && <span className="etiquetaIaPequena">{badge}</span>}
        </h3>
        <p className="descripcionCategoria">{description}</p>
      </div>
    </div>
  );
}

export default CategoryCard;

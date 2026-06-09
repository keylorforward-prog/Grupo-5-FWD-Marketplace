import React from 'react';
import { Star, X, Plus } from 'lucide-react';

const ProfessionalPreferences = () => {
  return (
    <div id="preferencias" className="form-card">
      <div className="form-header">
        <h2 className="form-title">
          <Star size={18} className="text-[var(--color-primary)]" />
          Preferencias Profesionales
        </h2>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Interés de Rol</label>
          <select className="form-select" defaultValue="frontend">
            <option value="frontend">Frontend Developer</option>
            <option value="backend">Backend Developer</option>
            <option value="fullstack">Fullstack Developer</option>
          </select>
        </div>
        <div className="form-group">
          <label>Expectativa Salarial (Anual)</label>
          <input type="text" className="form-input" defaultValue="$ 35000" />
        </div>
      </div>

      <div className="form-group">
        <label>Tecnologías Principales</label>
        <div className="chips-container">
          <div className="chip">
            React.js
            <button><X size={14} /></button>
          </div>
          <div className="chip">
            Tailwind CSS
            <button><X size={14} /></button>
          </div>
          <div className="chip">
            Node.js
            <button><X size={14} /></button>
          </div>
          <button className="chip-add">
            <Plus size={14} /> Añadir
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalPreferences;

import React, { useState, useEffect, useRef } from 'react';
import { Star, X, Plus } from 'lucide-react';

const ProfessionalPreferences = () => {
  const [formData, setFormData] = useState({
    role: 'frontend',
    salary: '$ 35000',
    technologies: ['React.js', 'Tailwind CSS', 'Node.js']
  });
  const [mensajeExito, setMensajeExito] = useState(false);
  const [isAddingTech, setIsAddingTech] = useState(false);
  const [newTech, setNewTech] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    const savedData = localStorage.getItem('profPreferences');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const removeTech = (techToRemove) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(tech => tech !== techToRemove)
    }));
  };

  const handleAddTechClick = () => {
    setIsAddingTech(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const submitNewTech = () => {
    if (newTech.trim() && !formData.technologies.includes(newTech.trim())) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, newTech.trim()]
      }));
    }
    setNewTech('');
    setIsAddingTech(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submitNewTech();
    } else if (e.key === 'Escape') {
      setNewTech('');
      setIsAddingTech(false);
    }
  };

  const handleSave = () => {
    localStorage.setItem('profPreferences', JSON.stringify(formData));
    setMensajeExito(true);
    setTimeout(() => setMensajeExito(false), 3000);
  };

  return (
    <div id="preferencias" className="form-card">
      <div className="form-header">
        <h2 className="form-title">
          <Star size={18} className="text-[var(--color-primary)]" />
          Preferencias Profesionales
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {mensajeExito && (
            <span style={{ color: 'var(--color-success)', fontSize: '0.875rem', fontWeight: 500 }} className="animate-in">
              ¡Cambios guardados!
            </span>
          )}
          <button className="btn-primary" onClick={handleSave}>Guardar Cambios</button>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Interés de Rol</label>
          <select name="role" className="form-select" value={formData.role} onChange={handleChange}>
            <option value="frontend">Frontend Developer</option>
            <option value="backend">Backend Developer</option>
            <option value="fullstack">Fullstack Developer</option>
          </select>
        </div>
        <div className="form-group">
          <label>Expectativa Salarial (Anual)</label>
          <input type="text" name="salary" className="form-input" value={formData.salary} onChange={handleChange} />
        </div>
      </div>

      <div className="form-group">
        <label>Tecnologías Principales</label>
        <div className="chips-container">
          {formData.technologies.map(tech => (
            <div className="chip" key={tech}>
              {tech}
              <button type="button" onClick={() => removeTech(tech)}>
                <X size={14} />
              </button>
            </div>
          ))}
          
          {isAddingTech ? (
            <input 
              ref={inputRef}
              type="text" 
              value={newTech}
              onChange={(e) => setNewTech(e.target.value)}
              onBlur={submitNewTech}
              onKeyDown={handleKeyDown}
              className="chip-add"
              style={{ background: 'white', outline: 'none', border: '1px solid var(--color-primary)', width: 'auto' }}
              placeholder="Nueva tech..."
            />
          ) : (
            <button type="button" className="chip-add" onClick={handleAddTechClick}>
              <Plus size={14} /> Añadir
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalPreferences;

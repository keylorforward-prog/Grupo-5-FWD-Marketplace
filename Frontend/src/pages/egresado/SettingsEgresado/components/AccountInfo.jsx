import React, { useState, useEffect } from 'react';

const AccountInfo = () => {
  const [formData, setFormData] = useState({
    nombre: 'Alex Rivera',
    email: 'alex.rivera@fwd.dev',
    bio: 'Desarrollador Junior apasionado por React y el diseño UX. Buscando mi primera oportunidad para impactar el ecosistema tech.'
  });
  const [mensajeExito, setMensajeExito] = useState(false);

  // Cargar datos de localStorage al iniciar para simular persistencia
  useEffect(() => {
    const savedData = localStorage.getItem('accountInfo');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Simulamos el guardado en base de datos usando localStorage
    localStorage.setItem('accountInfo', JSON.stringify(formData));
    setMensajeExito(true);
    setTimeout(() => setMensajeExito(false), 3000);
  };

  return (
    <div id="cuenta" className="form-card">
      <div className="form-header">
        <h2 className="form-title">Información de Cuenta</h2>
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
          <label>Nombre Completo</label>
          <input 
            type="text" 
            name="nombre"
            className="form-input" 
            value={formData.nombre} 
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Correo Electrónico</label>
          <input 
            type="email" 
            name="email"
            className="form-input" 
            value={formData.email} 
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Biografía Corta</label>
        <textarea 
          className="form-textarea" 
          name="bio"
          value={formData.bio}
          onChange={handleChange}
        ></textarea>
      </div>
    </div>
  );
};

export default AccountInfo;

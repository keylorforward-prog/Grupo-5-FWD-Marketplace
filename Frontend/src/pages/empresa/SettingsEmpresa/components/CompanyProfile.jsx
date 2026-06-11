import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Edit2 } from 'lucide-react';

const CompanyProfile = () => {
  const [formData, setFormData] = useState({
    nombre_empresa: 'TechCorp International',
    sitio_web: 'techcorp.io',
    identificacion_legal: 'Tax Identification Number',
    industria: 'Software Development',
    descripcion: 'Brief overview of TechCorp...'
  });
  const [mensajeExito, setMensajeExito] = useState(false);

  // Intentamos cargar datos desde la API al iniciar
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/perfiles-empresario/1');
        if (response.data.success && response.data.data) {
          setFormData(response.data.data);
        }
      } catch (error) {
        console.log('Error fetching company profile (using default mockup data):', error);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      // Guardar cambios en la base de datos (Supabase) via backend
      await axios.put('http://localhost:3000/api/perfiles-empresario/1', formData);
      setMensajeExito(true);
      setTimeout(() => setMensajeExito(false), 3000);
    } catch (error) {
      console.error('Error saving company profile:', error);
      alert('Error al guardar los cambios.');
    }
  };

  return (
    <div className="form-card w-full">
      <div className="form-header">
        <h2 className="form-title">Perfil de la Empresa</h2>
      </div>

      <div className="profile-section">
        <div className="profile-logo-container">
          <img src="https://ui-avatars.com/api/?name=TC&background=0D8ABC&color=fff&size=120" alt="Company Logo" className="profile-logo" />
          <button className="edit-logo-btn">
            <Edit2 size={16} />
          </button>
        </div>

        <div className="form-fields">
          <div className="form-row">
            <div className="form-group">
              <label>Commercial Name</label>
              <input type="text" name="nombre_empresa" className="form-input" value={formData.nombre_empresa || ''} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Website</label>
              <div className="input-with-prefix">
                <span className="input-prefix">https://</span>
                <input type="text" name="sitio_web" className="form-input" value={formData.sitio_web || ''} onChange={handleChange} />
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Legal ID</label>
              <input type="text" name="identificacion_legal" className="form-input" value={formData.identificacion_legal || ''} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Industry</label>
              <select name="industria" className="form-select" value={formData.industria || 'Software Development'} onChange={handleChange}>
                <option value="Software Development">Software Development</option>
                <option value="Marketing">Marketing</option>
                <option value="Finance">Finance</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Short Description</label>
            <textarea name="descripcion" className="form-textarea" value={formData.descripcion || ''} onChange={handleChange} style={{ height: '100px' }}></textarea>
          </div>

          <div className="flex justify-end items-center gap-4">
            {mensajeExito && (
              <span className="text-[var(--color-success)] text-sm font-medium animate-in">¡Cambios guardados en DB!</span>
            )}
            <button className="btn-secondary" onClick={handleSave}>Guardar cambios</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;

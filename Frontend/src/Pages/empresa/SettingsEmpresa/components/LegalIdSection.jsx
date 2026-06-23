import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, FileDown } from 'lucide-react';

const LegalIdSection = () => {
  const { t } = useTranslation();
  const [file, setFile] = useState(null);
  const [currentFileUrl, setCurrentFileUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      if (!token || !userStr) return;
      const user = JSON.parse(userStr);
      const userId = user?.id || user?.id_usuario;

      const res = await fetch(`/api/perfiles-empresario/perfil/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const result = await res.json();
        if (result.data?.cedula_juridica_archivo) {
          setCurrentFileUrl(result.data.cedula_juridica_archivo);
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf' && !selectedFile.type.startsWith('image/')) {
      alert(t('Solo se permiten archivos PDF o imágenes'));
      return;
    }

    setFile(selectedFile);
    await uploadFile(selectedFile);
  };

  const uploadFile = async (selectedFile) => {
    try {
      setIsUploading(true);
      const token = localStorage.getItem('token');
      
      const formData = new FormData();
      formData.append('cedula_juridica_file', selectedFile);

      const res = await fetch('/api/dashboard-empresario/perfil/cedula-juridica-archivo', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const result = await res.json();
      if (res.ok) {
        alert(t('Archivo subido correctamente'));
        setCurrentFileUrl(result.data.cedula_juridica_archivo);
      } else {
        alert(result.message || t('Error al subir el archivo'));
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert(t('Error al subir el archivo'));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="se-card se-team-card">
      <div className="se-card-header">
        <h3 className="se-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={20} className="se-card-icon" />
          {t('Cédula Jurídica (PDF o Imagen)')}
        </h3>
      </div>

      <div className="se-card-content">
        <div style={{ marginBottom: '15px' }}>
          {currentFileUrl ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
              <FileDown size={24} style={{ color: '#e74c3c' }} />
              <a href={currentFileUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#3498db', textDecoration: 'none' }}>
                {t('Ver archivo actual')}
              </a>
            </div>
          ) : (
            <p style={{ color: '#7f8c8d', fontSize: '14px', marginBottom: '15px' }}>
              {t('Aún no has subido tu Cédula Jurídica.')}
            </p>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label 
            htmlFor="cedula-juridica-upload" 
            style={{
              padding: '8px 16px',
              backgroundColor: '#f1f2f6',
              border: '1px solid #dcdde1',
              borderRadius: '4px',
              cursor: isUploading ? 'not-allowed' : 'pointer',
              color: '#2f3640',
              fontWeight: '500',
              display: 'inline-block'
            }}
          >
            {isUploading ? t('Subiendo...') : t('Seleccionar archivo')}
          </label>
          <input
            id="cedula-juridica-upload"
            type="file"
            accept=".pdf,image/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
            disabled={isUploading}
          />
          <span style={{ color: '#7f8c8d', fontSize: '14px' }}>
            {file ? file.name : t('Sin archivos seleccionados')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LegalIdSection;

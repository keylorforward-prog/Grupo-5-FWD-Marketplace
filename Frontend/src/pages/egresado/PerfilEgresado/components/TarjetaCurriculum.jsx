import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Upload, Loader2 } from 'lucide-react';
import { egresadoDashboardService } from '../../../../services/egresadoDashboardService';

function TarjetaCurriculum({ perfilApi }) {
  const { t } = useTranslation();
  const { perfil, actualizar } = perfilApi;
  const [subiendo, setSubiendo] = useState(false);
  const fileRef = useRef(null);

  const manejarSubirDoc = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSubiendo(true);
    try {
      const data = await egresadoDashboardService.subirDocumentoCv(file);
      actualizar({ documento_cv: data.documento_cv });
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <div className="tarjetaCurriculum">
      <h3 className="tituloTarjetaCurriculum">
        <FileText size={20} /> {t('egresadoPerfil.curriculum.titulo')}
      </h3>

      <input ref={fileRef} type="file" accept=".pdf,application/pdf" hidden onChange={manejarSubirDoc} />

      <button type="button" className="botonSubirCv" onClick={() => fileRef.current?.click()} disabled={subiendo}>
        {subiendo ? <Loader2 size={16} className="spin" /> : <Upload size={16} />}
        {subiendo ? t('egresadoPerfil.curriculum.subiendo') : perfil.documento_cv ? t('egresadoPerfil.curriculum.actualizar') : t('egresadoPerfil.curriculum.subir')}
      </button>

      {perfil.documento_cv && (
        <a href={perfil.documento_cv} target="_blank" rel="noopener noreferrer" className="linkDocumentoCv">
          {t('egresadoPerfil.curriculum.verDocumento')}
        </a>
      )}
    </div>
  );
}

export default TarjetaCurriculum;

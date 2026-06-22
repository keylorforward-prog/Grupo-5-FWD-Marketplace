import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pencil, Check, X } from 'lucide-react';

const LIMITE_BIO = 500;

function TarjetaBio({ perfilApi }) {
  const { t } = useTranslation();
  const { perfil, actualizar } = perfilApi;
  const [editando, setEditando] = useState(false);
  const [borrador, setBorrador] = useState(perfil.bio);

  const iniciarEdicion = () => {
    setBorrador(perfil.bio);
    setEditando(true);
  };

  const guardar = () => {
    actualizar({ bio: borrador.trim() });
    setEditando(false);
  };

  const cancelar = () => setEditando(false);

  return (
    <div className="tarjetaBio">
      <div className="encabezadoBio">
        <h3 className="tituloBio">{t('egresadoPerfil.bio.titulo')}</h3>
        {!editando && (
          <button type="button" className="botonEditarTexto" onClick={iniciarEdicion}>
            <Pencil size={14} />
            {t('egresadoPerfil.bio.editar')}
          </button>
        )}
      </div>

      {editando ? (
        <>
          <textarea
            className="textareaBio"
            value={borrador}
            maxLength={LIMITE_BIO}
            rows={6}
            onChange={(e) => setBorrador(e.target.value)}
            placeholder={t('egresadoPerfil.bio.placeholder')}
          />
          <div className="pieEdicionBio">
            <span className="contadorBio">
              {borrador.length}/{LIMITE_BIO}
            </span>
            <div className="accionesEdicionBio">
              <button type="button" className="botonCancelarBio" onClick={cancelar}>
                <X size={14} /> {t('egresadoPerfil.bio.cancelar')}
              </button>
              <button type="button" className="botonGuardarBio" onClick={guardar}>
                <Check size={14} /> {t('egresadoPerfil.bio.guardar')}
              </button>
            </div>
          </div>
        </>
      ) : (
        <p className="textoBio">{perfil.bio}</p>
      )}
    </div>
  );
}

export default TarjetaBio;

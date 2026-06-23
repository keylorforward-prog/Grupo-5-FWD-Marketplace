import { useState } from 'react';
import apiClient from '../../services/apiClient';
import './ModalResena.css';

function GrupoEstrellas({ label, valor, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="mr-grupo">
      <span className="mr-grupo-label">{label}</span>
      <div className="mr-estrellas" role="group" aria-label={label}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            className={`mr-estrella${n <= (hover || valor) ? ' activa' : ''}`}
            onClick={() => onChange(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            aria-label={`${n} estrella${n > 1 ? 's' : ''}`}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ModalResena({ idProyecto, rolAutor, nombreContraparte, onClose, onExito }) {
  const [estrellas, setEstrellas] = useState({ calidad: 0, comunicacion: 0, puntualidad: 0 });
  const [comentario, setComentario] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [exitoso, setExitoso] = useState(false);

  const setEstrella = (campo) => (valor) => {
    setEstrellas((prev) => ({ ...prev, [campo]: valor }));
    setError('');
  };

  const handleEnviar = async () => {
    if (!estrellas.calidad || !estrellas.comunicacion || !estrellas.puntualidad) {
      setError('Debés calificar las tres categorías antes de enviar.');
      return;
    }
    setEnviando(true);
    setError('');
    try {
      await apiClient.post('/resenas', {
        id_proyecto: idProyecto,
        rol_autor: rolAutor,
        estrellas_calidad: estrellas.calidad,
        estrellas_comunicacion: estrellas.comunicacion,
        estrellas_puntualidad: estrellas.puntualidad,
        comentario: comentario.trim() || null,
      });
      setExitoso(true);
      setTimeout(() => onExito?.(), 1800);
    } catch (err) {
      if (err.response?.status === 409) {
        setError('Ya dejaste tu reseña para este proyecto.');
        setTimeout(() => onClose?.(), 2000);
      } else {
        setError(err.response?.data?.message || 'Error al enviar la reseña. Intentá de nuevo.');
      }
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="mr-overlay" onClick={onClose}>
      <div className="mr-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <h2 className="mr-titulo">Calificá tu experiencia con {nombreContraparte}</h2>
        {exitoso ? (
          <p className="mr-exito">Gracias por tu reseña</p>
        ) : (
          <>
            <div className="mr-grupos">
              <GrupoEstrellas label="Calidad del trabajo" valor={estrellas.calidad} onChange={setEstrella('calidad')} />
              <GrupoEstrellas label="Comunicación" valor={estrellas.comunicacion} onChange={setEstrella('comunicacion')} />
              <GrupoEstrellas label="Puntualidad" valor={estrellas.puntualidad} onChange={setEstrella('puntualidad')} />
            </div>
            <div className="mr-campo">
              <label className="mr-label" htmlFor="mr-comentario">Comentario (opcional)</label>
              <textarea
                id="mr-comentario"
                className="mr-textarea"
                rows={3}
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="Contá cómo fue tu experiencia..."
                maxLength={500}
              />
            </div>
            {error && <p className="mr-error">{error}</p>}
            <div className="mr-acciones">
              <button type="button" className="mr-btn-ghost" onClick={onClose} disabled={enviando}>
                Cancelar
              </button>
              <button type="button" className="mr-btn-primary" onClick={handleEnviar} disabled={enviando}>
                {enviando ? 'Enviando...' : 'Enviar reseña'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

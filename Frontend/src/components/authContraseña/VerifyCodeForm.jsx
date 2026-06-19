import { useState } from 'react';
import { KeyRound, ArrowRight, Loader2 } from 'lucide-react';
import { authService } from '../../services/authService';

const VerifyCodeForm = ({ email, onSuccess }) => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await authService.verifyRecoveryCode({ email, code });
      onSuccess(code);
    } catch (err) {
      setError(err.response?.data?.message || 'Código incorrecto o expirado.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="card-header">
        <h2>Ingresa el código<span className="dot-accent">.</span></h2>
        <p>Hemos enviado un código de recuperación a <strong>{email}</strong>.</p>
      </div>

      {error && (
        <div className="auth-error">
          <span className="error-icon">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Código de Recuperación</label>
          <div className="input-wrapper">
            <span className="input-icon">
              <KeyRound size={18} />
            </span>
            <input
              type="text"
              className="form-input has-icon"
              placeholder="Ej. 123456"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              disabled={isLoading}
              maxLength={6}
            />
          </div>
        </div>

        <button type="submit" className="auth-btn" disabled={isLoading || code.length === 0}>
          {isLoading ? (
            <span className="btn-loading">
              <Loader2 className="animate-spin" size={20} /> Verificando...
            </span>
          ) : (
            <span className="btn-loading">
              Verificar Código <ArrowRight size={20} />
            </span>
          )}
        </button>

        <div className="auth-footer mt-4">
          <p>¿No lo recibiste? <button type="button" className="switch-mode-btn" onClick={() => window.location.reload()}>Reintentar</button></p>
        </div>
      </form>
    </div>
  );
};

export default VerifyCodeForm;

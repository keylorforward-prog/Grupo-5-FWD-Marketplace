import { useState } from 'react';
import { Mail, ArrowRight, Loader2 } from 'lucide-react';
import { authService } from '../../services/authService';

const ForgotPasswordForm = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await authService.forgotPassword(email);
      onSuccess(email);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al solicitar el código de recuperación.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="card-header">
        <h2>Recuperar contraseña<span className="dot-accent">.</span></h2>
        <p>Ingresa tu correo y te enviaremos un código para restablecerla.</p>
      </div>

      {error && (
        <div className="auth-error">
          <span className="error-icon">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Correo Electrónico</label>
          <div className="input-wrapper">
            <span className="input-icon">
              <Mail size={18} />
            </span>
            <input
              type="email"
              className="form-input has-icon"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <button type="submit" className="auth-btn" disabled={isLoading}>
          {isLoading ? (
            <span className="btn-loading">
              <Loader2 className="animate-spin" size={20} /> Enviando...
            </span>
          ) : (
            <span className="btn-loading">
              Enviar Código <ArrowRight size={20} />
            </span>
          )}
        </button>

        <div className="auth-footer mt-4">
          <p>¿Recordaste tu contraseña? <a href="/login">Inicia sesión</a></p>
        </div>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
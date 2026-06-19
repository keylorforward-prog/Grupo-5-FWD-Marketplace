import { useState } from 'react';
import { Lock, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { authService } from '../../services/authService';
import { useNavigate } from 'react-router-dom';

const ResetPasswordForm = ({ email, code }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await authService.resetPassword({ email, code, newPassword: password });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al restablecer la contraseña.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-card text-center">
        <div className="flex flex-col items-center justify-center py-6">
          <CheckCircle2 size={64} className="text-green-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">¡Contraseña restablecida!</h2>
          <p className="text-gray-600 mb-6">Tu contraseña se ha actualizado correctamente.</p>
          <p className="text-sm text-gray-500">Redirigiendo al inicio de sesión...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-card">
      <div className="card-header">
        <h2>Nueva contraseña<span className="dot-accent">.</span></h2>
        <p>Crea una nueva contraseña para tu cuenta.</p>
      </div>

      {error && (
        <div className="auth-error">
          <span className="error-icon">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Nueva Contraseña</label>
          <div className="input-wrapper">
            <span className="input-icon"><Lock size={18} /></span>
            <input
              type="password"
              className="form-input has-icon"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Confirmar Contraseña</label>
          <div className="input-wrapper">
            <span className="input-icon"><Lock size={18} /></span>
            <input
              type="password"
              className="form-input has-icon"
              placeholder="Confirma la contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <button type="submit" className="auth-btn" disabled={isLoading}>
          {isLoading ? (
            <span className="btn-loading">
              <Loader2 className="animate-spin" size={20} /> Guardando...
            </span>
          ) : (
            <span className="btn-loading">
              Guardar Contraseña <ArrowRight size={20} />
            </span>
          )}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
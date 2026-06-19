import { useState } from 'react';
import { updatePassword } from '../../services/authService';

const ResetPasswordForm = () => {
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updatePassword(password);
      alert('Contraseña actualizada correctamente');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Nueva contraseña</h2>

      <input
        type="password"
        placeholder="Nueva contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit">
        Cambiar contraseña
      </button>
    </form>
  );
};

export default ResetPasswordForm;
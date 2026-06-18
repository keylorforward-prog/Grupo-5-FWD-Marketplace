import { useState } from 'react';
import { forgotPassword } from '../../services/authService';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await forgotPassword(email);
      alert('Revisa tu correo electrónico.');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Recuperar contraseña</h2>

      <input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <button type="submit">
        Enviar enlace
      </button>
    </form>
  );
};

export default ForgotPasswordForm;
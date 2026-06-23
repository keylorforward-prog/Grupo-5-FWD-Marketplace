const emailjs = require('@emailjs/nodejs');

const sendRecoveryEmail = async ({
  userName,
  email,
  recoveryCode,
}) => {
  try {
    const response = await emailjs.send(
      'service_1xndwac',
      'template_4ao6mc9',
      {
        user_name: userName,
        recovery_code: recoveryCode,
        email,
      },
      {
        publicKey: process.env.EMAILJS_PUBLIC_KEY,
        privateKey: process.env.EMAILJS_PRIVATE_KEY,
      }
    );

    return response;
  } catch (error) {
    console.error('Error enviando correo de recuperacion:', error);
  }
};

const sendPostulacionEmail = async ({
  userEmail,
  userName,
  titulo,
  estado,
  mensaje,
}) => {
  try {
    const templateId = estado === 'RECHAZADA' || estado === 'rechazada'
      ? 'template_rechazo'
      : 'template_aceptacion';

    await emailjs.send(
      'service_1xndwac',
      templateId,
      {
        user_name: userName,
        email: userEmail,
        titulo_oferta: titulo,
        mensaje: mensaje || '',
      },
      {
        publicKey: process.env.EMAILJS_PUBLIC_KEY,
        privateKey: process.env.EMAILJS_PRIVATE_KEY,
      }
    );
  } catch (error) {
    console.error('Error enviando correo de postulacion:', error);
  }
};

module.exports = {
  sendRecoveryEmail,
  sendPostulacionEmail,
};
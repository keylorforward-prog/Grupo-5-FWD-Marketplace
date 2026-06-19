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
    console.error('Error enviando correo:', error);
    throw error;
  }
};

module.exports = {
  sendRecoveryEmail,
};
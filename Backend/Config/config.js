require('dotenv').config();

const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

module.exports = {
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback_secret_change_in_production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  server: {
    port: process.env.PORT || 3000,
  },
  cors: {
    origins: [
      frontendUrl,
      'http://localhost:5173',
    ],
  },
};

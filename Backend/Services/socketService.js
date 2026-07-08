const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { config } = require('../Config/config');
const { Usuario, Conversacion, Postulacion, PostulacionEmpleo, PerfilEstudiante, Propuesta } = require('../Models');

let io = null;

function initSocketIO(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN?.split(',') || [
        'http://localhost:5173',
        'http://localhost:3000',
        'http://localhost:4173',
      ],
      credentials: true,
    },
  });

  // Auth middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.query?.token;
      if (!token) return next(new Error('Token requerido'));

      const decoded = jwt.verify(token, config.jwt.secret);
      const usuario = await Usuario.findByPk(decoded.id, {
        attributes: ['id_usuario', 'nombre', 'correo', 'rol', 'foto_perfil'],
      });
      if (!usuario) return next(new Error('Usuario no encontrado'));

      socket.usuario = usuario.toJSON();
      next();
    } catch (err) {
      next(new Error('Token inválido'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`[WS] ${socket.usuario.nombre} conectado (${socket.id})`);

    // Unir a sala personal (para notificaciones generales)
    socket.join(`user:${socket.usuario.id_usuario}`);

    // Unirse a una conversación (por idPostulacion)
    socket.on('join:conversacion', async ({ id_conversacion }) => {
      if (!id_conversacion) return;
      const room = `postulacion:${id_conversacion}`;
      socket.join(room);
    });

    // Salir de una conversación
    socket.on('leave:conversacion', ({ id_conversacion }) => {
      if (!id_conversacion) return;
      socket.leave(`postulacion:${id_conversacion}`);
    });

    // Enviar mensaje (usa Conversacion.create como el resto del backend)
    socket.on('send:message', async ({ id_conversacion, contenido }, ack) => {
      try {
        if (!id_conversacion || !contenido?.trim()) {
          return ack?.({ error: 'Faltan campos requeridos' });
        }

        const nuevo = await Conversacion.create({
          id_postulacion: id_conversacion,
          id_usuario_emisor: socket.usuario.id_usuario,
          mensaje: contenido.trim(),
          leido: false,
          fecha_envio: new Date(),
          tipo_referencia: 'postulacion',
        });

        const mensajeConEmisor = await Conversacion.findByPk(nuevo.id_conversacion, {
          include: [{
            model: Usuario,
            as: 'emisor',
            attributes: ['id_usuario', 'nombre', 'correo', 'rol', 'foto_perfil'],
          }],
        });

        const room = `postulacion:${id_conversacion}`;
        io.to(room).emit('new:message', mensajeConEmisor.toJSON());

        ack?.({ success: true, data: mensajeConEmisor.toJSON() });
      } catch (err) {
        console.error('[WS] Error send:message:', err.message);
        ack?.({ error: err.message });
      }
    });

    // Escribiendo...
    socket.on('typing:start', ({ id_conversacion }) => {
      socket.to(`postulacion:${id_conversacion}`).emit('typing:update', {
        id_conversacion,
        usuario: socket.usuario.nombre,
        typing: true,
      });
    });

    socket.on('typing:stop', ({ id_conversacion }) => {
      socket.to(`postulacion:${id_conversacion}`).emit('typing:update', {
        id_conversacion,
        usuario: socket.usuario.nombre,
        typing: false,
      });
    });

    // Marcar como leído
    socket.on('mark:read', ({ id_conversacion, id_mensaje }) => {
      io.to(`postulacion:${id_conversacion}`).emit('messages:read', {
        id_conversacion,
        leido_por: socket.usuario.id_usuario,
        nombre: socket.usuario.nombre,
        id_mensaje,
      });
    });

    socket.on('disconnect', () => {
      console.log(`[WS] ${socket.usuario.nombre} desconectado (${socket.id})`);
    });
  });

  return io;
}

function getIO() {
  if (!io) throw new Error('Socket.io no inicializado');
  return io;
}

module.exports = { initSocketIO, getIO };

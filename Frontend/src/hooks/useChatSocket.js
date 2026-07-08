import { useEffect, useRef, useCallback, useState } from 'react';
import { useSocket } from '../context/SocketContext';

export default function useChatSocket({ idPostulacion, onNewMessage, onMessagesRead, userId }) {
  const { socket, conectado } = useSocket();
  const typingTimeoutRef = useRef(null);
  const [typingUser, setTypingUser] = useState(null);

  // Unirse / salir de la sala cuando cambia la conversación
  useEffect(() => {
    if (!socket || !conectado || !idPostulacion) return;

    socket.emit('join:conversacion', { id_conversacion: idPostulacion });

    return () => {
      socket.emit('leave:conversacion', { id_conversacion: idPostulacion });
    };
  }, [socket, conectado, idPostulacion]);

  // Escuchar eventos
  useEffect(() => {
    if (!socket || !idPostulacion) return;

    const handleNewMessage = (msg) => {
      if (onNewMessage && msg.id_usuario_emisor !== userId) {
        onNewMessage(msg);
      }
    };

    const handleMessagesRead = (data) => {
      if (onMessagesRead) onMessagesRead(data);
    };

    const handleTyping = (data) => {
      if (data.id_conversacion === idPostulacion) {
        setTypingUser(data.typing ? data.usuario : null);
      }
    };

    socket.on('new:message', handleNewMessage);
    socket.on('messages:read', handleMessagesRead);
    socket.on('typing:update', handleTyping);

    return () => {
      socket.off('new:message', handleNewMessage);
      socket.off('messages:read', handleMessagesRead);
      socket.off('typing:update', handleTyping);
    };
  }, [socket, idPostulacion, userId, onNewMessage, onMessagesRead]);

  const sendMessage = useCallback((contenido, callback) => {
    if (!socket || !conectado || !idPostulacion || !contenido?.trim()) {
      callback?.({ error: 'No conectado' });
      return;
    }
    socket.emit('send:message', { id_conversacion: idPostulacion, contenido: contenido.trim() }, (resp) => {
      callback?.(resp);
    });
  }, [socket, conectado, idPostulacion]);

  const startTyping = useCallback(() => {
    if (!socket || !idPostulacion) return;
    socket.emit('typing:start', { id_conversacion: idPostulacion });
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing:stop', { id_conversacion: idPostulacion });
    }, 2000);
  }, [socket, idPostulacion]);

  const stopTyping = useCallback(() => {
    if (!socket || !idPostulacion) return;
    clearTimeout(typingTimeoutRef.current);
    socket.emit('typing:stop', { id_conversacion: idPostulacion });
  }, [socket, idPostulacion]);

  const markRead = useCallback((idMensaje) => {
    if (!socket || !idPostulacion) return;
    socket.emit('mark:read', { id_conversacion: idPostulacion, id_mensaje: idMensaje });
  }, [socket, idPostulacion]);

  return { conectado, typingUser, sendMessage, startTyping, stopTyping, markRead };
}

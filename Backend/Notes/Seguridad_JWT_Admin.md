# Configuración de Seguridad: Expiración del Token JWT para Administradores

## Resumen del Cambio
Se ha modificado el comportamiento del sistema de autenticación para aplicar políticas de seguridad más estrictas a las sesiones con rol de `ADMIN`. A partir de esta actualización, el token de sesión (`JWT`) para los administradores tiene un tiempo de vida (TTL) reducido a **2 horas**, en contraposición a los **7 días** estándar que se manejan para usuarios regulares (`ESTUDIANTE` y `EMPRESARIO`).

## Justificación Arquitectónica
Dado que el panel de administración permite realizar operaciones sensibles (aprobación/suspensión de cuentas, revisión de evidencias FWD, etc.), mantener una sesión abierta durante 7 días presentaba un riesgo considerable en caso de que una computadora quedara desatendida o comprometida. 

Reducir el tiempo de expiración (y la validez de la cookie respectiva) mitiga la ventana de ataque para secuestros de sesión (Session Hijacking) y obliga al personal administrativo a re-autenticarse frecuentemente, alineándose con los estándares de seguridad de la industria (OWASP).

## Detalles de Implementación

**Archivo Modificado:** `Backend/Controllers/authController.js`

1. **`generateToken(user, customExpiresIn)`**: Se parametrizó la función generadora de JWT para permitir una expiración personalizada. Si no se pasa el parámetro `customExpiresIn`, la función recurre a la variable de entorno por defecto (`config.jwt.expiresIn`, que corresponde a 7 días).
2. **`adminCookieOptions`**: Se creó un objeto de configuración exclusivo para la cookie del administrador (`maxAge: 2 * 60 * 60 * 1000` = 2 horas). Esto garantiza que la cookie HTTP-Only expire en el navegador al mismo tiempo que el token caduca a nivel de payload JWT.
3. **`adminLogin`**: En el flujo del login administrativo, se invoca `generateToken(user, '2h')` y la cookie se firma y despacha utilizando `adminCookieOptions`.

## Siguientes Pasos
- Es recomendable monitorear los logs del backend para asegurar que la re-autenticación no esté interfiriendo de manera crítica con los flujos de trabajo largos del personal. En caso de ser así, se podría evaluar la implementación de un sistema de *Refresh Tokens* en un futuro sprint.
- Notificar al equipo de operaciones sobre la desconexión automática cada 2 horas para que ajusten sus hábitos de trabajo en el panel de control.

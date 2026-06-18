# 🔐 GOOGLE OAUTH - GUÍA DE CONFIGURACIÓN

## ✅ Estado Actual: COMPLETAMENTE CONFIGURADO

Toda la integración de Google OAuth está terminada y lista para funcionar.

---

## 🚀 INSTRUCCIONES PARA PONER EN MARCHA

### PASO 1: Asegúrate que el Backend esté ejecutándose
```bash
cd Backend
npm install
npm start
```

El backend debe ejecutarse en `http://localhost:3000`

### PASO 2: Asegúrate que el Frontend esté ejecutándose
```bash
cd Frontend
npm install
npm run dev
```

El frontend debe ejecutarse en `http://localhost:5173`

### PASO 3: Prueba Google OAuth

1. Ve a `http://localhost:5173/login`
2. Haz clic en el botón **"Continuar con Google"**
3. Se abrirá una ventana de Google
4. Inicia sesión con tu cuenta Google
5. Acepta los permisos
6. Serás redirigido automáticamente a tu dashboard

---

## 📋 QUÉ SE HA CONFIGURADO

### FRONTEND (Todo hecho ✅)
- [x] Página GoogleCallback.jsx para manejar redirección
- [x] Rutas actualizadas con /auth/callback
- [x] Botón Google en LoginForm.jsx funcional
- [x] AuthContext.jsx actualizado
- [x] ApiClient.js con interceptores de token
- [x] Redirección automática al dashboard

### BACKEND (Todo configurado ✅)
- [x] Google OAuth Strategy en passport.js
- [x] Rutas de Google auth en authRoutes.js
- [x] Endpoint /api/auth/me protegido
- [x] Variables de entorno en .env
- [x] Redirección correcta al frontend

---

## 🔄 FLUJO AUTOMÁTICO

```
Usuario click "Continuar Google" 
    ↓
Backend → Google Cloud
    ↓
Usuario confirma permisos en Google
    ↓
Google → Backend con código
    ↓
Backend crea/actualiza usuario en BD
    ↓
Backend genera JWT token
    ↓
Backend redirige a frontend con token en URL
    ↓
GoogleCallback.jsx captura token
    ↓
Frontend obtiene datos del usuario (/api/auth/me)
    ↓
Frontend guarda en contexto
    ↓
Frontend redirige a dashboard automáticamente ✅
```

---

## 🎯 CREDENCIALES DE GOOGLE YA CONFIGURADAS

El `.env` del Backend ya contiene:

```env
GOOGLE_CLIENT_ID=55253149867-tjetg1ic8n3g3lf3n75jj47u7962v1nl.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
FRONTEND_URL=http://localhost:5173
```

✅ No necesitas hacer nada más en Google Cloud Console

---

## ⚙️ ARCHIVOS MODIFICADOS

### Frontend
- `src/pages/auth/GoogleCallback.jsx` (NUEVO)
- `src/Routes/rutas.js` (actualizado)
- `src/Routes/Routing.jsx` (actualizado)
- `src/pages/auth/Login/components/LoginForm.jsx` (actualizado)
- `src/context/AuthContext.jsx` (actualizado)
- `src/services/apiClient.js` (actualizado)

### Backend
- `Config/passport.js` (ya configurado)
- `Routes/authRoutes.js` (ya configurado)
- `Controllers/authController.js` (ya configurado)
- `Middleware/authMiddleware.js` (ya configurado)
- `.env` (ya configurado con credenciales)

---

## 🧪 TESTING

1. **Test Login Normal**: 
   - Ve a /login
   - Usa email/password
   - Debería funcionar normalmente

2. **Test Google Login**:
   - Ve a /login
   - Haz clic "Continuar con Google"
   - Debería abrirse ventana Google
   - Después de confirmar, te redirige automáticamente

---

## 📝 NOTAS IMPORTANTES

- El token se guarda en `localStorage` automáticamente
- El token se envía en todos los requests con header `Authorization: Bearer <token>`
- Si el token expira, se limpia automáticamente
- El usuario se mantiene en el contexto durante la sesión

---

## ❓ SOLUCIÓN DE PROBLEMAS

### Problema: El botón de Google no abre nada
**Solución**: Asegúrate que:
- Backend está corriendo en puerto 3000
- Frontend está corriendo en puerto 5173
- No hay errores en la consola del navegador

### Problema: Error 401 después de Google
**Solución**: El token puede haber expirado, intenta:
- Limpiar localStorage
- Intentar de nuevo

### Problema: No se redirige al dashboard
**Solución**: Revisa que:
- El usuario tiene un rol asignado (ESTUDIANTE o EMPRESARIO)
- La ruta del dashboard existe

---

## 📞 RESUMEN

✅ **Todo está listo para usar**
- No necesitas configurar más Google OAuth
- El flujo es completamente automático
- Los usuarios serán redirigidos automáticamente al dashboard
- El token se maneja automáticamente en requests

**Solo inicia backend y frontend, y¡ listo!**

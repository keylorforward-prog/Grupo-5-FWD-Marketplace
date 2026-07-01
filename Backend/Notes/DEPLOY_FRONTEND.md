# Guía Completa: Despliegue del Frontend con Vercel (Backend Local)

Este documento detalla paso a paso cómo subir únicamente la parte visual (Frontend) a Vercel, mientras mantienes tu servidor (Backend) corriendo localmente en tu computadora.

---

## 1. Preparación del Proyecto

Antes de subir nada, debemos asegurarnos de que el código está listo.

### 1.1 Sube todo a GitHub
Vercel toma tu código directamente de GitHub, así que tu repositorio debe estar actualizado.
1. Abre tu terminal en la carpeta principal del proyecto (`Grupo 5 FWD Marketplace`).
2. Ejecuta los siguientes comandos:
   ```bash
   git add .
   git commit -m "Preparando frontend para despliegue en Vercel"
   git push
   ```

### 1.2 Configurar las Variables de Entorno en el Código Frontend
En tu código frontend, cuando haces peticiones al backend (por ejemplo con Axios o fetch), **no** debes quemar la URL `http://localhost:10000`. Debes usar variables de entorno.
- Asegúrate de que las llamadas a la API usan algo como `import.meta.env.VITE_API_URL`.

---

## 2. Creación del Proyecto en Vercel

### 2.1 Iniciar sesión
1. Entra a [Vercel.com](https://vercel.com).
2. Haz clic en **Log in** y selecciona **Continue with GitHub**. (Si no tienes cuenta, haz Sign up con GitHub).

### 2.2 Importar el Repositorio
1. En tu panel principal (Dashboard), haz clic en el botón negro superior derecho **"Add New..."** y selecciona **"Project"**.
2. En la sección "Import Git Repository", busca en la lista tu repositorio (probablemente llamado `Grupo-5-FWD-Marketplace`).
3. Haz clic en el botón **Import**.

### 2.3 Configurar el Despliegue (¡Paso Clave!)
Serás llevado a una pantalla de configuración. Es vital que hagas estos cambios, ya que tu proyecto tiene Frontend y Backend en la misma carpeta principal:

1. **Project Name:** Puedes dejarlo como está o ponerle un nombre descriptivo (ej. `fwd-marketplace-visual`).
2. **Framework Preset:** Vercel suele detectar automáticamente que usas **Vite**. Déjalo en Vite.
3. **Root Directory (¡Muy importante!):** 
   - Haz clic en el botón **Edit**.
   - Selecciona la carpeta **`Frontend`**.
   - Haz clic en Save. Esto le dice a Vercel que ignore el backend y solo construya la parte de React/Vite.
4. **Environment Variables (Variables de Entorno):**
   - Expande esta sección.
   - Aquí debes definir hacia dónde va a apuntar tu frontend.
   - **Name:** `VITE_API_URL` (o el nombre que estés usando en tu código para la URL de la API).
   - **Value:** `http://localhost:10000` (o el puerto en el que corras tu backend).
   - Haz clic en **Add**.

### 2.4 ¡Desplegar!
- Haz clic en el botón grande azul **Deploy**.
- Espera unos 1-2 minutos mientras Vercel instala las dependencias (`npm install`) y compila tu proyecto (`vite build`).
- Al finalizar, verás una pantalla de "Congratulations!" con una vista previa de tu página.
- Haz clic en **Continue to Dashboard** y luego en el botón **Visit** para ver tu página web con una URL pública (ej. `https://fwd-marketplace-visual.vercel.app`).

---

## 3. Configurar tu Backend Local para que funcione

Ahora tu página está en internet, pero tu backend está en tu computadora. Cuando la página de Vercel intente comunicarse con `http://localhost:10000`, tu navegador bloqueará la petición por políticas de seguridad (CORS), ya que están en diferentes dominios.

### 3.1 Actualizar CORS en `app.js`
1. Abre el archivo `app.js` (o donde configures Express) en la carpeta `Backend`.
2. Busca la configuración de `cors`. Debe quedar configurada de esta manera para permitir el acceso desde tu nueva URL de Vercel:

```javascript
const cors = require('cors');

// Configuración de CORS
app.use(cors({
  origin: [
    'http://localhost:5173', // Para cuando desarrolles localmente
    'https://tu-url-de-vercel.vercel.app' // Reemplaza esto con la URL real que te dio Vercel
  ],
  credentials: true // Muy importante si usas cookies o sesiones
}));
```

### 3.2 Correr el Backend
Siempre que quieras usar la página web que está subida en Vercel, tendrás que:
1. Abrir tu terminal.
2. Navegar a la carpeta `Backend`.
3. Ejecutar tu servidor: `npm run dev` o `node app.js`.
4. El servidor debe estar corriendo para que la página de Vercel funcione (ya que está apuntando a tu `localhost`).

---

## 4. Limitación de Compartir con Otros (¡Atención!)

Debido a que el Frontend (en Vercel) está apuntando a `http://localhost:10000`:
- **La página web funcionará a la perfección SOLO para ti**, en la computadora donde estás corriendo el Backend.
- Si le mandas el link de Vercel a un profesor o a un compañero de equipo, **a ellos no les cargará nada de la base de datos ni los inicios de sesión**. Su computadora intentará buscar el backend en *su propio* `localhost` y fallará.

### ¿Cómo soluciono esto si necesito mostrarlo a alguien más?
Si necesitas presentar el proyecto funcional a alguien más sin subir el Backend a Render, puedes usar una herramienta gratuita llamada **Ngrok**.

1. Descarga **Ngrok** (https://ngrok.com/).
2. Corre tu Backend localmente (`node app.js` en puerto 10000).
3. Abre una nueva terminal y ejecuta: `ngrok http 10000`.
4. Ngrok te dará una URL temporal que expone tu backend local a internet (ej. `https://4a3b-23-44.ngrok-free.app`).
5. Ve a **Vercel -> Settings -> Environment Variables**. Cambia el valor de `VITE_API_URL` por la URL que te dio Ngrok.
6. Ve a la pestaña **Deployments** en Vercel, haz clic en los 3 puntos de tu último despliegue y selecciona **Redeploy**.
7. En el `app.js` de tu Backend, agrega temporalmente a CORS el asterisco `*` o la URL de Ngrok.
8. ¡Listo! Ahora tu amigo podrá entrar a Vercel y conectarse a tu base de datos de forma remota, siempre y cuando dejes Ngrok y tu backend corriendo en tu computadora.

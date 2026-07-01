# Flujo para guardar foto de perfil de empresa

## Objetivo

Permitir que una empresa suba una foto/logo real desde la página `Mi Perfil`, guardar el archivo en AWS S3 y persistir la URL pública en la base de datos.

## Frontend

Página:

- `Frontend/src/pages/empresa/DashboardEmpresario/pages/Perfil/PerfilEmpresa.jsx`

Servicio:

- `Frontend/src/services/dashboardEmpresarioService.js`

Flujo:

1. El usuario entra a `/DashboardEmpresario/perfil`.
2. Presiona el botón de edición sobre el avatar o el botón `Subir imagen`.
3. El input acepta solo imágenes con `accept="image/*"`.
4. Se crea un `FormData`.
5. El archivo se envía en el campo `foto_perfil`.
6. El frontend llama:

```js
POST /api/dashboard-empresario/perfil/foto
Content-Type: multipart/form-data
```

7. Si el backend responde bien, se actualiza:

- La tarjeta de perfil.
- El avatar visible en el header/dropdown mediante `actualizarUsuario`.

## Backend

Ruta:

- `Backend/Routes/dashboardEmpresarioRoutes.js`

Endpoint:

```http
POST /api/dashboard-empresario/perfil/foto
```

Middleware:

- `verifyToken`: exige sesión activa.
- `multer.memoryStorage()`: recibe el archivo en memoria.
- Límite actual: `5 MB`.
- Campo esperado: `foto_perfil`.

Controlador:

- `Backend/Controllers/dashboardEmpresarioController.js`
- Función: `subirFotoPerfil`

Flujo backend:

1. Busca el `PerfilEmpresario` del usuario autenticado.
2. Valida que exista un archivo.
3. Valida que el archivo sea imagen con `mimetype.startsWith('image/')`.
4. Sube el archivo a AWS S3 usando:

```js
uploadFileToS3(req.file, 'fotos_perfil')
```

5. AWS devuelve una URL pública.
6. Se guarda la misma URL en:

- `perfil_empresario.logo`
- `usuario.foto_perfil`

Esto permite que el perfil empresarial y el header usen la misma imagen.

## Fallback

Si el usuario no tiene foto guardada, el frontend muestra:

```txt
/Imgs/Logotipo/Digital/Sintesis/FWD - Sintesis-01.png
```

## Respuesta esperada

El endpoint devuelve el perfil actualizado:

```json
{
  "success": true,
  "data": {
    "id_perfil_empresario": 1,
    "logo": "https://marketplacefwd.s3.us-east-2.amazonaws.com/fotos_perfil/archivo.png",
    "usuario": {
      "foto_perfil": "https://marketplacefwd.s3.us-east-2.amazonaws.com/fotos_perfil/archivo.png"
    }
  }
}
```

## Variables necesarias

El backend necesita las variables de AWS configuradas:

```env
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-2
```

El bucket usado actualmente en `Backend/Config/aws.js` es:

```txt
marketplacefwd
```

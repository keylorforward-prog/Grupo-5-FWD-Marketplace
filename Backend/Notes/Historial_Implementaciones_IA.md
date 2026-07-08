# Resumen de Implementaciones y Walkthroughs

Este documento recopila los planes de implementación y los walkthroughs de las características que hemos desarrollado en conjunto.

---

## 1. Cédula Jurídica (Subida de Archivos y AWS S3)
**Objetivo:** Sustituir campos anteriores por un apartado de cédula jurídica manual y permitir subir un archivo PDF a AWS S3 desde el registro/configuración de la empresa.

* **Backend:** 
  * Reutilizamos la tabla y el campo existente `cedula_juridica_archivo`.
  * Se configuró y validó la conexión a S3 para que guarde correctamente los documentos PDF, y devuelva la URL segura en la base de datos de Supabase.
* **Frontend:**
  * Se adaptaron los formularios para permitir la carga del archivo PDF.
  * Se implementaron notificaciones visuales (usando librerías como `react-toastify`) para informar al usuario del éxito o fallo al guardar el documento.

---

## 2. Foto de Perfil Circular y Adaptativa
**Objetivo:** Mejorar el diseño de la foto de perfil en la plataforma.

* **Frontend:**
  * Se modificó el CSS/estilos de las imágenes de avatar para que tengan `border-radius: 50%` y un tamaño de aspecto adaptativo (usando `object-fit: cover` y dimensiones relativas) de modo que no pierdan la proporción sin importar la resolución.

---

## 3. Preferencias de Notificaciones (Empresa)
**Objetivo:** Hacer funcional la sección de "Preferencias de Notificación" (Configuración de Empresa), permitiendo al empresario elegir si quiere recibir alertas (Nuevas Postulaciones, Mensajes Directos y Resumen Semanal).

* **Backend:**
  * Se agregaron las columnas booleanas `notif_postulaciones`, `notif_resumen_semanal`, y `notif_mensajes_directos` al modelo `PerfilEmpresario`.
  * Se actualizó la lógica en `postulacionController.js` y demás generadores de notificaciones. Antes de ejecutar `Notificacion.create()`, el sistema ahora revisa en la base de datos si la empresa tiene la preferencia activada.
* **Frontend:**
  * Se conectaron los *toggles* (interruptores) de la vista de Configuración de Empresa con los endpoints del backend, permitiendo guardar el estado en tiempo real.
  * La "campanita" de notificaciones en el `HeaderEmpresa` ahora solo recibe alertas de eventos permitidos.

---

## 4. Tema Oscuro (Logotipos Dinámicos)
**Objetivo:** Cuando se cambie a tema oscuro en la plataforma, las imágenes del logotipo principal se adapten utilizando la versión oscura.

* **Frontend:**
  * Se editó el componente `DashboardLayout.jsx` tanto para **Egresados** como para **Empresarios**.
  * Se importó la imagen `fwdcrdark.png` desde la carpeta de assets.
  * Se agregó una condición lógica en la etiqueta `<img>` para renderizar `fwdcrdark.png` si el estado de `tema === 'dark'`, y `FWD - Logotipo-01.jpg` si es claro.

---

## 5. Verificación de Cambio de Contraseña en 2 Pasos
**Objetivo:** Añadir una capa extra de seguridad. Al cambiar la contraseña desde el perfil de empresa, se debe enviar un código al correo electrónico para confirmar el cambio.

* **Backend:**
  * No alteramos los flujos de login existentes ("Olvidé mi contraseña").
  * Creamos dos nuevos endpoints en `perfilEmpresarioRoutes.js`: 
    1. `/request-password-change`: Valida la "contraseña actual", invalida códigos viejos, genera un nuevo código, lo guarda en `CodigoRecuperacion` (ACTIVO), y manda el correo con `emailService.js`.
    2. `/confirm-password-change`: Verifica que el código ingresado coincida. Si es correcto, actualiza `contrasena_hash` con `bcryptjs` y marca el código como `USADO`.
* **Frontend:**
  * Se actualizó `SecuritySettings.jsx`.
  * En lugar de cambiar la contraseña con un solo clic en "Guardar cambios", el botón llama a la ruta de *request*.
  * Si es válido, se muestra un *Modal* oscuro (alineado con los estilos del proyecto) que solicita el código de 6 dígitos enviado al correo.
  * Al confirmarlo en el modal, se efectúa el cambio definitivo en el backend.

---
*Nota: Este documento ha sido generado como un compendio del trabajo realizado en conjunto para fines de documentación y seguimiento técnico.*

# Análisis de Ciberseguridad y Vectores de Ataque - FWD Marketplace

Este documento presenta una evaluación defensiva (Threat Modeling) autorizada sobre la arquitectura actual del proyecto **FWD Marketplace**. El objetivo es identificar debilidades estructurales, vectores de ataque plausibles y proveer un marco de hardening preventivo.

---

## 1. Descripción General y Superficie de Ataque

**Arquitectura del Proyecto:**
* **Frontend:** React SPA servido vía Vite.
* **Backend:** API REST en Node.js con Express.
* **Base de Datos:** PostgreSQL a través del ORM Sequelize.
* **Autenticación:** JSON Web Tokens (JWT) gestionados mediante *HTTP-only cookies*.
* **Almacenamiento:** Cargas de archivos manejadas con Multer y AWS S3.

**Superficie de Ataque (Puntos de entrada):**
1. Endpoints públicos y autenticados expuestos por Express.
2. Formularios de carga de archivos (CVs, fotos de perfil, cédulas jurídicas).
3. Mecanismos de autenticación y recuperación de contraseñas.
4. Integraciones externas (AWS S3, servicios de correo).

---

## 2. Vectores de Ataque de Alto Nivel y (3) Riesgos Asociados

### A. Ataques de Denegación de Servicio (DDoS / DoS a Nivel de Aplicación)
* **Vector:** Envíos masivos a endpoints de autenticación (`/login`, `/register`) o consultas de bases de datos pesadas (ej. listado de propuestas con múltiples joins).
* **Riesgo:** Agotamiento del pool de conexiones de PostgreSQL, saturación del Node.js Event Loop y caída del servicio.

### B. Broken Object Level Authorization (BOLA / IDOR)
* **Vector:** Manipulación del parámetro `id` en las rutas de la API (ej. `PUT /api/perfil/:id` o `GET /api/conversacion/:id`).
* **Riesgo:** Si los controladores no verifican que el `id` solicitado pertenece al usuario autenticado (extraído del token JWT), un atacante podría leer, modificar o eliminar datos de otros usuarios (estudiantes o empresas).

### C. Vulnerabilidades en Carga de Archivos
* **Vector:** Abuso de endpoints que usan Multer para subir archivos (ej. subida de CVs o fotos).
* **Riesgo:** Aunque los archivos van a S3 (reduciendo el riesgo de RCE en el servidor de Node), un atacante podría subir archivos extremadamente grandes (DoS por costos de AWS/Bandwidth) o subir contenido malicioso (phishing, malware) que luego es distribuido por el frontend.

### D. Fuga de Información Sensible
* **Vector:** Manejo inadecuado de errores genéricos (`res.status(500).json({ message: error.message })`).
* **Riesgo:** En producción, `error.message` puede revelar sentencias SQL crudas, rutas absolutas del servidor o detalles de la configuración interna, facilitando el mapeo del sistema para un atacante.

### E. Abuso de Lógica de Negocio
* **Vector:** Creación automatizada de cuentas de "empresas", publicación de ofertas de empleo falsas masivas, o múltiples postulaciones por segundo a un mismo proyecto.
* **Riesgo:** Deterioro de la calidad de la plataforma, spam a los estudiantes y posible daño a la reputación comercial del FWD Marketplace.

### F. Secuestro de Sesión y CSRF
* **Vector:** Si bien usar *HTTP-only cookies* previene ataques XSS para robar el token, la aplicación podría ser vulnerable a *Cross-Site Request Forgery (CSRF)* si las cookies no están marcadas con `SameSite=Strict` o `Lax`.
* **Riesgo:** Acciones no autorizadas (ej. cambiar contraseña o borrar postulaciones) forzadas en nombre de una víctima autenticada.

---

## 4. Condiciones de Vulnerabilidad y 5. Impacto Potencial

| Condición Actual / Posible | Vector Relacionado | Impacto Potencial |
| :--- | :--- | :--- |
| **Ausencia de Rate Limiting** global en Express | DDoS, Fuerza Bruta | **Alto:** Indisponibilidad del servicio. |
| Uso de `Model.create(req.body)` sin validación estricta | Mass Assignment | **Crítico:** Elevación de privilegios (modificar rol a admin). *(Nota: Se ha parcheado parcialmente en la última auditoría, pero requiere validación robusta).* |
| Falta de verificación de pertenencia en controladores | IDOR / BOLA | **Alto:** Fuga de datos de usuarios (PII) o robo de propiedad intelectual corporativa. |
| Retorno de errores directos (`error.message`) al cliente | Information Disclosure | **Medio/Alto:** Facilita ataques posteriores mediante la revelación de la estructura interna. |

---

## 6. Medidas de Mitigación Recomendadas

> [!IMPORTANT]
> **Autenticación y Autorización**
> - Implementar verificaciones de propiedad (Ownership checks): Siempre comparar `req.params.id` (el recurso solicitado) contra `req.user.id` (el usuario autenticado extraído del JWT) antes de permitir `UPDATE`, `DELETE` o `GET`.
> - Ajustar la configuración de la cookie JWT: Asegurar que tenga `HttpOnly: true`, `Secure: process.env.NODE_ENV === 'production'`, y `SameSite: 'Strict'`.

> [!TIP]
> **Resiliencia y Disponibilidad**
> - Instalar y configurar `express-rate-limit` a nivel global y un limitador más estricto (`express-brute` o similar) para las rutas de `/auth`.
> - Establecer un tamaño máximo estricto en Express (`express.json({ limit: '1mb' })`) y en Multer (`limits: { fileSize: 5 * 1024 * 1024 }` para 5MB).

> [!CAUTION]
> **Validación y Sanitización**
> - No confiar jamás en `req.body` crudo. Utilizar bibliotecas de validación de esquemas como **Joi** o **Zod** a nivel de middleware para garantizar que solo se acepten los datos esperados y en el formato correcto (ej. rechazar strings en campos numéricos).
> - Validar los "Magic Bytes" de los archivos subidos, no solo la extensión o el Mime-Type proporcionado por el navegador.

---

## 7. Buenas Prácticas de Hardening, Monitoreo y Respuesta

1. **Hardening de Express:** 
   - Integrar `helmet` para configurar cabeceras de seguridad HTTP (CSP, X-Frame-Options, HSTS).
   - Desactivar la cabecera `X-Powered-By: Express`.
   - Configurar una política CORS estricta que solo permita el origen del dominio de producción.

2. **Manejo de Errores Centralizado:**
   - Crear un middleware de manejo de errores que registre el error real (`error.stack`) en los logs del servidor interno, pero envíe al cliente un mensaje genérico (ej. *"Ocurrió un error interno"*).

3. **Monitoreo y Auditoría:**
   - Implementar librerías como `morgan` o `winston` para almacenar logs de accesos y de errores estructurales.
   - Guardar en base de datos registros de auditoría (Audit Logs) para acciones destructivas (borrado de cuentas, cambios de rol).

---

## 8. Checklist de Seguridad Pre-Producción

- [ ] **Middleware de validación (Joi/Zod)** implementado en todos los endpoints `POST` y `PUT`.
- [ ] **Rate Limiting** aplicado globalmente y en rutas sensibles (login, reseteo de password).
- [ ] Control de **IDOR** implementado (un usuario no puede modificar/ver recursos ajenos).
- [ ] Cabeceras de seguridad de **Helmet** activadas.
- [ ] **CORS** restringido estrictamente a la URL del frontend en producción.
- [ ] **Cookies JWT** configuradas con banderas `Secure`, `HttpOnly` y `SameSite`.
- [ ] Límites de tamaño de archivo (`fileSize`) estrictos aplicados en **Multer**.
- [ ] Manejador de errores global configurado para no enviar el Stack Trace ni sentencias SQL al cliente.
- [ ] Script de CI/CD ejecutando `npm audit` obligatoriamente antes del despliegue.

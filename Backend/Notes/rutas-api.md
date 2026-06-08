# 📘 API REST – FWD Marketplace (Documentación Completa)

> **Base URL:** `http://localhost:3000/api`
> **Swagger UI:** `http://localhost:3000/api-docs`
> **Autenticación:** JWT almacenado en cookie `httpOnly` (también soportado vía header `Authorization: Bearer <token>`)

---

## 📑 Índice
1. [Información General](#información-general)
2. [Autenticación (Auth)](#autenticación-auth)
3. [Entidades y Rutas](#entidades-y-rutas)
   - [Usuario](#usuario)
   - [PerfilEstudiante](#perfilestudiante)
   - [Curriculum](#curriculum)
   - [HistorialProyectoEstudiante](#historialproyectoestudiante)
   - [PerfilEmpresario](#perfilempresario)
   - [HistorialProyectoEmpresa](#historialproyectoempresa)
   - [Propuesta](#propuesta)
   - [CatalogoTecnologia](#catalogotecnologia)
   - [TecnologiaPropuesta](#tecnologiaproposta)
   - [Postulacion](#postulacion)
   - [Conversacion](#conversacion)
   - [Mensaje](#mensaje)
   - [ProyectoPlataforma](#proyectoplataforma)
   - [Entregable](#entregable)
   - [Evaluacion](#evaluacion)
   - [Pago](#pago)
   - [Reporte](#reporte)
   - [Notificacion](#notificacion)
   - [Oferta](#oferta)
   - [CatalogoSector](#catalogosector)
4. [Health Check](#health-check)
5. [Códigos de Estado HTTP](#códigos-de-estado-http)
6. [Formato de Respuesta Estándar](#formato-de-respuesta-estándar)
7. [Cómo Probar la API](#cómo-probar-la-api)

---

## 📚 Información General

- **Tecnologías:** Node.js + Express, Sequelize, PostgreSQL (Supabase), JWT, Swagger.
- **Convenciones de URL:** todas las rutas empiezan con `/api/`.
- **Formato de peticiones:** `application/json` para `POST` y `PUT`.
- **Manejo de errores:** respuestas uniformes con `{ success: boolean, data?: ..., message?: string }`.

---

## 🔐 Autenticación (Auth)

Prefijo: `/api/auth`

| Método | Ruta | Protegida | Descripción |
|--------|------|-----------|-------------|
| `POST` | `/auth/register` | ❌ | Registrar nuevo usuario (hash de contraseña con bcrypt). |
| `POST` | `/auth/login`    | ❌ | Iniciar sesión, devuelve JWT en cookie httpOnly. |
| `POST` | `/auth/logout`   | ❌ | Elimina la cookie de sesión. |
| `GET`  | `/auth/me`       | ✅ | Obtiene datos del usuario autenticado. |

### Registro (`POST /auth/register`)
```json
{
  "nombre": "Ana López",
  "email": "ana@ejemplo.com",
  "password": "miPassword123",
  "cedula": "1-2345-6789",
  "rol": "ESTUDIANTE"
}
```
**Roles válidos:** `ADMIN`, `ESTUDIANTE`, `EMPRESARIO`.

### Login (`POST /auth/login`)
```json
{
  "email": "ana@ejemplo.com",
  "password": "miPassword123"
}
```
Respuesta exitosa incluye `token` y el objeto `user`.

---

## 📦 Entidades y Rutas

### Usuario
Prefijo: `/api/usuarios`
| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET`  | `/usuarios` | Listar todos los usuarios |
| `GET`  | `/usuarios/:id` | Obtener usuario por `id_usuario` |
| `POST` | `/usuarios` | Crear usuario (uso interno, registro vía `/auth/register`) |
| `PUT`  | `/usuarios/:id` | Actualizar usuario |
| `DELETE`| `/usuarios/:id` | Eliminar usuario |

### PerfilEstudiante
Prefijo: `/api/perfiles-estudiante`
| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET`  | `/perfiles-estudiante` | Listar todos |
| `GET`  | `/perfiles-estudiante/:id` | Obtener por `id_perfil_estudiante` |
| `POST` | `/perfiles-estudiante` | Crear perfil |
| `PUT`  | `/perfiles-estudiante/:id` | Actualizar perfil |
| `DELETE`| `/perfiles-estudiante/:id` | Eliminar perfil |

### Curriculum
Prefijo: `/api/curriculums`
| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET`  | `/curriculums` | Listar todos |
| `GET`  | `/curriculums/:id` | Obtener por `id_curriculum` |
| `POST` | `/curriculums` | Crear CV |
| `PUT`  | `/curriculums/:id` | Actualizar CV |
| `DELETE`| `/curriculums/:id` | Eliminar CV |

### HistorialProyectoEstudiante
Prefijo: `/api/historial-proyectos-estudiante`
| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET`  | `/historial-proyectos-estudiante` | Listar todos |
| `GET`  | `/historial-proyectos-estudiante/:id` | Obtener por `id_historial_estudiante` |
| `POST` | `/historial-proyectos-estudiante` | Crear registro |
| `PUT`  | `/historial-proyectos-estudiante/:id` | Actualizar registro |
| `DELETE`| `/historial-proyectos-estudiante/:id` | Eliminar registro |

### PerfilEmpresario
Prefijo: `/api/perfiles-empresario`
| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET`  | `/perfiles-empresario` | Listar todos |
| `GET`  | `/perfiles-empresario/:id` | Obtener por `id_perfil_empresario` |
| `POST` | `/perfiles-empresario` | Crear perfil |
| `PUT`  | `/perfiles-empresario/:id` | Actualizar perfil |
| `DELETE`| `/perfiles-empresario/:id` | Eliminar perfil |

### HistorialProyectoEmpresa
Prefijo: `/api/historial-proyectos-empresa`
| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET`  | `/historial-proyectos-empresa` | Listar todos |
| `GET`  | `/historial-proyectos-empresa/:id` | Obtener por `id_historial_empresa` |
| `POST` | `/historial-proyectos-empresa` | Crear registro |
| `PUT`  | `/historial-proyectos-empresa/:id` | Actualizar registro |
| `DELETE`| `/historial-proyectos-empresa/:id` | Eliminar registro |

### Propuesta
Prefijo: `/api/propuestas`
| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET`  | `/propuestas` | Listar todas |
| `GET`  | `/propuestas/:id` | Obtener por `id_propuesta` |
| `POST` | `/propuestas` | Crear propuesta |
| `PUT`  | `/propuestas/:id` | Actualizar propuesta |
| `DELETE`| `/propuestas/:id` | Eliminar propuesta |

### CatalogoTecnologia
Prefijo: `/api/catalogo-tecnologias`
| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET`  | `/catalogo-tecnologias` | Listar todas |
| `GET`  | `/catalogo-tecnologias/:id` | Obtener por `id_tecnologia` |
| `POST` | `/catalogo-tecnologias` | Crear tecnología |
| `PUT`  | `/catalogo-tecnologias/:id` | Actualizar |
| `DELETE`| `/catalogo-tecnologias/:id` | Eliminar |

### TecnologiaPropuesta (tabla puente N:M)
Prefijo: `/api/tecnologias-propuesta`
| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET`  | `/tecnologias-propuesta` | Listar todas |
| `GET`  | `/tecnologias-propuesta/:id` | Obtener por `id_tecnologia_propuesta` |
| `POST` | `/tecnologias-propuesta` | Asociar tecnología a propuesta |
| `PUT`  | `/tecnologias-propuesta/:id` | Actualizar asociación |
| `DELETE`| `/tecnologias-propuesta/:id` | Eliminar asociación |

### Postulacion
Prefijo: `/api/postulaciones`
| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET`  | `/postulaciones` | Listar todas |
| `GET`  | `/postulaciones/:id` | Obtener por `id_postulacion` |
| `POST` | `/postulaciones` | Crear postulación |
| `PUT`  | `/postulaciones/:id` | Actualizar estado |
| `DELETE`| `/postulaciones/:id` | Eliminar |

### Conversacion
Prefijo: `/api/conversaciones`
| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET`  | `/conversaciones` | Listar todas |
| `GET`  | `/conversaciones/:id` | Obtener por `id_conversacion` |
| `POST` | `/conversaciones` | Crear conversación |
| `PUT`  | `/conversaciones/:id` | Actualizar (marcar leída, etc.) |
| `DELETE`| `/conversaciones/:id` | Eliminar |

### Mensaje
Prefijo: `/api/mensajes`
| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET`  | `/mensajes` | Listar todos |
| `GET`  | `/mensajes/:id` | Obtener por `id_mensaje` |
| `POST` | `/mensajes` | Enviar mensaje |
| `PUT`  | `/mensajes/:id` | Actualizar |
| `DELETE`| `/mensajes/:id` | Eliminar |

### ProyectoPlataforma
Prefijo: `/api/proyectos-plataforma`
| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET`  | `/proyectos-plataforma` | Listar todos |
| `GET`  | `/proyectos-plataforma/:id` | Obtener por `id_proyecto` |
| `POST` | `/proyectos-plataforma` | Crear proyecto |
| `PUT`  | `/proyectos-plataforma/:id` | Actualizar estado |
| `DELETE`| `/proyectos-plataforma/:id` | Eliminar |

### Entregable
Prefijo: `/api/entregables`
| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET`  | `/entregables` | Listar todos |
| `GET`  | `/entregables/:id` | Obtener por `id_entregable` |
| `POST` | `/entregables` | Crear entregable |
| `PUT`  | `/entregables/:id` | Actualizar |
| `DELETE`| `/entregables/:id` | Eliminar |

### Evaluacion
Prefijo: `/api/evaluaciones`
| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET`  | `/evaluaciones` | Listar todas |
| `GET`  | `/evaluaciones/:id` | Obtener por `id_evaluacion` |
| `POST` | `/evaluaciones` | Crear evaluación |
| `PUT`  | `/evaluaciones/:id` | Actualizar |
| `DELETE`| `/evaluaciones/:id` | Eliminar |

### Pago
Prefijo: `/api/pagos`
| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET`  | `/pagos` | Listar todos |
| `GET`  | `/pagos/:id` | Obtener por `id_pago` |
| `POST` | `/pagos` | Registrar pago |
| `PUT`  | `/pagos/:id` | Actualizar estado |
| `DELETE`| `/pagos/:id` | Eliminar |

### Reporte
Prefijo: `/api/reportes`
| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET`  | `/reportes` | Listar todos |
| `GET`  | `/reportes/:id` | Obtener por `id_reporte` |
| `POST` | `/reportes` | Crear reporte |
| `PUT`  | `/reportes/:id` | Actualizar estado |
| `DELETE`| `/reportes/:id` | Eliminar |

### Notificacion
Prefijo: `/api/notificaciones`
| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET`  | `/notificaciones` | Listar todas |
| `GET`  | `/notificaciones/:id` | Obtener por `id_notificacion` |
| `POST` | `/notificaciones` | Crear notificación |
| `PUT`  | `/notificaciones/:id` | Marcar como leída |
| `DELETE`| `/notificaciones/:id` | Eliminar |

### Oferta
Prefijo: `/api/ofertas`
| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET`  | `/ofertas` | Listar todas |
| `GET`  | `/ofertas/:id` | Obtener por `id_oferta` |
| `POST` | `/ofertas` | Crear oferta |
| `PUT`  | `/ofertas/:id` | Actualizar |
| `DELETE`| `/ofertas/:id` | Eliminar |

### CatalogoSector
Prefijo: `/api/catalogo-sectores`
| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET`  | `/catalogo-sectores` | Listar todos |
| `GET`  | `/catalogo-sectores/:id` | Obtener por `id_sector` |
| `POST` | `/catalogo-sectores` | Crear sector |
| `PUT`  | `/catalogo-sectores/:id` | Actualizar |
| `DELETE`| `/catalogo-sectores/:id` | Eliminar |

---

## 🩺 Health Check
**Ruta:** `GET /health`
**Respuesta:**
```json
{
  "status": "OK",
  "message": "🚀 FWD Marketplace API corriendo correctamente",
  "timestamp": "2026-06-08T18:00:00.000Z"
}
```
---

## 📊 Códigos de Estado HTTP
| Código | Significado | Uso |
|--------|-------------|-----|
| `200` | OK | GET/PUT/DELETE exitoso |
| `201` | Created | POST exitoso (recurso creado) |
| `400` | Bad Request | Validación fallida |
| `401` | Unauthorized | Falta o token inválido |
| `404` | Not Found | Recurso inexistente |
| `409` | Conflict | Duplicado (ej. email) |
| `500` | Server Error | Error interno |
---

## 📐 Formato de Respuesta Estándar
**Éxito:**
```json
{
  "success": true,
  "data": { ... }
}
```
**Error:**
```json
{
  "success": false,
  "message": "Descripción del error"
}
```
---

## ⚡ Cómo Probar la API
1. **Swagger UI** – Visita `http://localhost:3000/api-docs` y usa la interfaz interactiva.
2. **cURL** – Ejemplo rápido:
   ```bash
   curl -X GET http://localhost:3000/api/usuarios -H "Authorization: Bearer <token>"
   ```
3. **Postman / Insomnia** – Importa el archivo OpenAPI (`/swagger.json`) generado automáticamente.
4. **Frontend** – Los componentes de React usan `axios` con `withCredentials: true` para enviar la cookie de sesión.

---

> **Nota:** Todas las rutas siguen la convención RESTful y están protegidas por `authMiddleware` salvo `/auth/*` y `/health`.

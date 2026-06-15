# Integracion del Dashboard Empresario con Backend

Objetivo: que ninguna pagina del Dashboard Empresario use datos ficticios. Todo lo que se muestre debe venir del backend por medio de `/api`, usando el usuario autenticado y su `PerfilEmpresario`.

## Regla principal

- El frontend no debe importar `Frontend/src/pages/Home/DashboardEmpresario/data/dashboardData.js`.
- El frontend no debe tener arrays tipo `mockProjects`, `mockTalent`, `mockOffers`, `mockDeliverables`, `mockMessages` o `mockNotifications`.
- Si el backend no tiene datos, la UI debe mostrar estado vacio real: "No hay datos disponibles", no datos inventados.
- Cada pagina debe manejar `loading`, `error` y `empty state`.
- Todas las peticiones deben usar token/cookie del login actual.

## Cliente API existente

Archivo actual:

```text
Frontend/src/services/authService.js
```

Ya existe una instancia axios con:

```js
baseURL: '/api'
withCredentials: true
Authorization: Bearer <token>
```

Recomendacion: mover/exportar esa instancia como `apiClient` o crear:

```text
Frontend/src/services/apiClient.js
Frontend/src/services/dashboardEmpresarioService.js
```

## Rutas backend disponibles

Montadas en `Backend/app.js`:

```text
/api/auth
/api/usuarios
/api/perfiles-estudiante
/api/curriculums
/api/historial-proyectos-estudiante
/api/perfiles-empresario
/api/historial-proyectos-empresa
/api/propuestas
/api/catalogo-tecnologias
/api/tecnologias-propuesta
/api/postulaciones
/api/conversaciones
/api/mensajes
/api/proyectos-plataforma
/api/entregables
/api/evaluaciones
/api/pagos
/api/reportes
/api/notificaciones
/api/ofertas
/api/catalogo-sectores
```

La mayoria tiene CRUD generico:

```text
GET /
GET /:id
POST /
PUT /:id
DELETE /:id
```

## Modelos backend identificados

### Usuario

Archivo:

```text
Backend/Models/usuario.js
```

Campos:

```text
id_usuario
nombre
cedula
correo
contrasena_hash
rol: ADMIN | ESTUDIANTE | EMPRESARIO
foto_perfil
estado_cuenta: ACTIVA | PENDIENTE | SUSPENDIDA
fecha_registro
ultimo_acceso
telefono_whatsapp
cargo
fecha_asignacion
estado_admin
tipo_empresa
```

Uso en dashboard:

- Nombre del usuario en header.
- Avatar.
- Rol/empresa.
- Vinculo con PerfilEmpresario.

### PerfilEmpresario

Archivo:

```text
Backend/Models/perfilEmpresario.js
```

Campos:

```text
id_perfil_empresario
id_usuario
sector
descripcion
logo
sitio_web
fecha_registro
telefono_whatsapp
cedula_juridica_archivo
```

Uso en dashboard:

- Nombre/logo/descripcion de empresa.
- Configuracion empresarial.
- Filtro principal para traer propuestas, historial y evaluaciones hechas por empresa.

### Propuesta

Archivo:

```text
Backend/Models/propuesta.js
```

Campos:

```text
id_propuesta
id_perfil_empresario
titulo
descripcion
tecnologias_requeridas
usar_ia: SI | NO
plazo_dias: 5 | 15 | 30
tipo_plazo virtual
presupuesto_min
presupuesto_max
estado: ACTIVA | PAUSADA | CERRADA | CANCELADA
fecha_publicacion
fecha_limite
```

Uso en dashboard:

- Mis Proyectos / proyectos publicados.
- Publicar proyecto.
- Crear proyecto con IA.
- Ofertas recibidas y postulaciones por proyecto.
- Estadisticas: proyectos publicados, activos, cerrados/cancelados.

Endpoint actual:

```text
GET /api/propuestas
POST /api/propuestas
GET /api/propuestas/:id
PUT /api/propuestas/:id
DELETE /api/propuestas/:id
```

Endpoint recomendado:

```text
GET /api/dashboard-empresario/propuestas
```

Debe filtrar por `req.user.id_usuario -> PerfilEmpresario.id_perfil_empresario`.

### ProyectoPlataforma

Archivo:

```text
Backend/Models/proyectoPlataforma.js
```

Campos:

```text
id_proyecto
id_propuesta
titulo
descripcion
estado: ABIERTO | EN_PROGRESO | EN_REVISION | COMPLETADO | CANCELADO
fecha_inicio
fecha_fin_estimada
fecha_creacion
```

Uso en dashboard:

- Proyectos activos/en progreso.
- Entregables.
- Pagos.
- Reportes.

### Postulacion

Archivo:

```text
Backend/Models/postulacion.js
```

Campos:

```text
id_postulacion
id_propuesta
id_perfil_estudiante
cv_url
mensaje_presentacion
presupuesto_max
estado: ENVIADA | EN_REVISION | PRESSELECCIONADA | RECHAZADA | CONTRATADO
fecha_postulacion
```

Uso en dashboard:

- Gestion de postulaciones.
- Total de ofertas/postulaciones recibidas.
- Candidatos por propuesta.
- Estado del candidato.

Endpoint recomendado:

```text
GET /api/dashboard-empresario/postulaciones
GET /api/dashboard-empresario/propuestas/:id/postulaciones
```

Debe incluir:

```text
Postulacion -> PerfilEstudiante -> Usuario
Postulacion -> Propuesta
PerfilEstudiante -> Curriculum
```

### Oferta

Archivo:

```text
Backend/Models/oferta.js
```

Campos:

```text
id_oferta
id_proyecto
id_perfil_estudiante
propuesta
cantidad
estado: ACEPTADA | RECHAZADA | EXPIRADA
fecha_oferta
```

Uso en dashboard:

- Ofertas recibidas.
- Panel de ofertas pendientes.

Nota tecnica: en asociaciones, `Oferta.id_proyecto` esta conectado con `Propuesta` usando alias `propuestaRef`, aunque el nombre sugiere proyecto. Revisar si debe ser `id_propuesta` o si realmente apunta a `ProyectoPlataforma`.

### PerfilEstudiante

Archivo:

```text
Backend/Models/perfilEstudiante.js
```

Campos:

```text
id_perfil_estudiante
id_usuario
titulo_fwd
sede_graduacion
estado_verificacion: PENDIENTE | VERIFICADO | RECHAZADO
reputacion_total
descripcion
fecha_verificacion
telefono_whatsapp
```

Uso en dashboard:

- Talento recomendado.
- Candidatos que aplicaron.
- Evaluaciones y reputacion.

### Curriculum

Archivo:

```text
Backend/Models/curriculum.js
```

Campos:

```text
id_curriculum
id_perfil_estudiante
resumen_profesional
experiencia_laboral
educacion
habilidades
certificaciones
enlaces
fecha_actualizacion
```

Uso en dashboard:

- Skills/stack del talento.
- Perfil del candidato.
- Busqueda de talento recomendado.

### Entregable

Archivo:

```text
Backend/Models/entregable.js
```

Campos:

```text
id_entregable
id_proyecto
titulo
descripcion
tipo: PARCIAL | FINAL
estado: ENVIADO | APROBADO | CON_CAMBIOS
archivo_url
fecha_creacion
```

Uso en dashboard:

- Entregables pendientes.
- Revisar entregables.
- Evaluaciones.

### Evaluacion

Archivo:

```text
Backend/Models/evaluacion.js
```

Campos:

```text
id_evaluacion
id_entregable
id_perfil_empresario
puntuacion: 1-5
comentario
fecha_evaluacion
```

Uso en dashboard:

- Evaluaciones hechas por empresa.
- Calificacion de trabajos/entregables.

### Pago

Archivo:

```text
Backend/Models/pago.js
```

Campos:

```text
id_pago
id_proyecto
monto
estado: PENDIENTE | PAGADO | RETENIDO
metodo_pago
fecha_pago
```

Uso en dashboard:

- Facturacion.
- Pagos pendientes y pagados.

### Conversacion

Archivo:

```text
Backend/Models/conversacion.js
```

Campos:

```text
id_conversacion
id_postulacion
id_usuario_emisor
mensaje
leido
fecha_envio
```

Uso en dashboard:

- Lista de conversaciones recientes.
- Contador de mensajes no leidos.

### Mensaje

Archivo:

```text
Backend/Models/mensaje.js
```

Campos:

```text
id_mensaje
id_conversacion
id_usuario_emisor
contenido
archivo_url
fecha_envio
```

Uso en dashboard:

- Mensajes recientes.
- Detalle de conversacion.

### Notificacion

Archivo:

```text
Backend/Models/notificacion.js
```

Campos:

```text
id_notificacion
id_usuario
tipo
mensaje
leido
fecha
```

Uso en dashboard:

- Campana de notificaciones.
- Pagina de notificaciones.
- Badge de no leidas.

### HistorialProyectoEmpresa

Archivo:

```text
Backend/Models/historialProyectoEmpresa.js
```

Campos:

```text
id_historial_empresa
id_perfil_empresario
titulo_proyecto
descripcion
tecnologias_usadas
enlace
fecha_inicio
fecha_fin
fecha_registro
```

Uso en dashboard:

- Historial de proyectos finalizados.
- Portafolio de trabajos de la empresa.

### CatalogoTecnologia y TecnologiaPropuesta

Archivos:

```text
Backend/Models/catalogoTecnologia.js
Backend/Models/tecnologiaPropuesta.js
```

Campos principales:

```text
CatalogoTecnologia:
id_tecnologia
nombre
categoria
descripcion

TecnologiaPropuesta:
id_tecnologia_propuesta
id_propuesta
id_tecnologia
```

Uso en dashboard:

- Tecnologias requeridas por proyecto.
- Filtros de talento recomendado.
- Reemplazo mejor estructurado de `Propuesta.tecnologias_requeridas`.

### CatalogoSector

Archivo:

```text
Backend/Models/catalogoSector.js
```

Campos:

```text
id_sector
nombre
descripcion
```

Uso en dashboard:

- Sector de empresa.
- Configuracion/perfil empresarial.

## Relaciones importantes

Definidas en:

```text
Backend/Models/index.js
```

Relaciones clave:

```text
Usuario hasOne PerfilEmpresario
PerfilEmpresario hasMany Propuesta
PerfilEmpresario hasMany HistorialProyectoEmpresa
PerfilEmpresario hasMany Evaluacion

Propuesta hasMany Postulacion
Propuesta hasOne ProyectoPlataforma
Propuesta belongsToMany CatalogoTecnologia through TecnologiaPropuesta

Postulacion belongsTo PerfilEstudiante
PerfilEstudiante belongsTo Usuario
PerfilEstudiante hasOne Curriculum

ProyectoPlataforma hasMany Entregable
ProyectoPlataforma hasMany Pago

Entregable hasMany Evaluacion
Usuario hasMany Notificacion
Conversacion hasMany Mensaje
```

## Paginas del Dashboard Empresario y datos reales que necesitan

### Inicio

Archivo:

```text
Frontend/src/pages/Home/DashboardEmpresario/pages/Inicio/Inicio.jsx
```

Debe consumir:

```text
GET /api/dashboard-empresario/resumen
GET /api/dashboard-empresario/propuestas?limit=3
GET /api/dashboard-empresario/talento-recomendado?limit=2
GET /api/dashboard-empresario/ofertas?estado=pendientes&limit=3
GET /api/dashboard-empresario/entregables?estado=ENVIADO&limit=3
GET /api/dashboard-empresario/mensajes-recientes?limit=3
GET /api/dashboard-empresario/notificaciones?limit=4
```

### Proyectos

Archivo:

```text
Frontend/src/pages/Home/DashboardEmpresario/pages/Proyectos/Proyectos.jsx
```

Modelos:

```text
Propuesta
ProyectoPlataforma
Postulacion
Oferta
CatalogoTecnologia
```

### PublicarProyecto

Archivo:

```text
Frontend/src/pages/Home/DashboardEmpresario/pages/PublicarProyecto/PublicarProyecto.jsx
```

Debe hacer:

```text
POST /api/propuestas
```

Payload real:

```json
{
  "id_perfil_empresario": "desde usuario autenticado",
  "titulo": "string",
  "descripcion": "string",
  "tecnologias_requeridas": "string o tecnologias relacionadas",
  "usar_ia": "NO",
  "plazo_dias": 5,
  "presupuesto_min": 0,
  "presupuesto_max": 0,
  "estado": "ACTIVA",
  "fecha_limite": "date"
}
```

### CrearProyectoIA

Archivo:

```text
Frontend/src/pages/Home/DashboardEmpresario/pages/CrearProyectoIA/CrearProyectoIA.jsx
```

No existe endpoint de IA actualmente.

Endpoint recomendado:

```text
POST /api/dashboard-empresario/propuestas/generar-con-ia
```

Debe devolver un borrador para crear una `Propuesta`.

### Ofertas

Archivo:

```text
Frontend/src/pages/Home/DashboardEmpresario/pages/Ofertas/Ofertas.jsx
```

Modelos:

```text
Oferta
Propuesta
PerfilEstudiante
Usuario
```

Endpoint recomendado:

```text
GET /api/dashboard-empresario/ofertas
```

### Talento

Archivo:

```text
Frontend/src/pages/Home/DashboardEmpresario/pages/Talento/Talento.jsx
```

Modelos:

```text
PerfilEstudiante
Usuario
Curriculum
Postulacion
Evaluacion
```

Endpoint recomendado:

```text
GET /api/dashboard-empresario/talento-recomendado
```

### Entregables

Archivo:

```text
Frontend/src/pages/Home/DashboardEmpresario/pages/Entregables/Entregables.jsx
```

Modelos:

```text
Entregable
ProyectoPlataforma
Propuesta
Evaluacion
```

### Mensajes

Archivo:

```text
Frontend/src/pages/Home/DashboardEmpresario/pages/Mensajes/Mensajes.jsx
```

Modelos:

```text
Conversacion
Mensaje
Usuario
Postulacion
```

### Notificaciones

Archivo:

```text
Frontend/src/pages/Home/DashboardEmpresario/pages/Notificaciones/Notificaciones.jsx
```

Modelos:

```text
Notificacion
Usuario
```

### Historial

Archivo:

```text
Frontend/src/pages/Home/DashboardEmpresario/pages/Historial/Historial.jsx
```

Modelos:

```text
HistorialProyectoEmpresa
PerfilEmpresario
```

### Evaluaciones

Archivo:

```text
Frontend/src/pages/Home/DashboardEmpresario/pages/Evaluaciones/Evaluaciones.jsx
```

Modelos:

```text
Evaluacion
Entregable
ProyectoPlataforma
PerfilEmpresario
```

### Facturacion

Archivo:

```text
Frontend/src/pages/Home/DashboardEmpresario/pages/Facturacion/Facturacion.jsx
```

Modelos:

```text
Pago
ProyectoPlataforma
Propuesta
```

### Configuracion

Archivo:

```text
Frontend/src/pages/Home/DashboardEmpresario/pages/Configuracion/Configuracion.jsx
```

Modelos:

```text
Usuario
PerfilEmpresario
CatalogoSector
```

Debe hacer:

```text
GET /api/auth/me
GET /api/perfiles-empresario/:id
PUT /api/perfiles-empresario/:id
PUT /api/usuarios/:id
```

## Endpoints agregados recomendados

Para no filtrar todo en frontend ni exponer datos de otras empresas:

```text
GET /api/dashboard-empresario/resumen
GET /api/dashboard-empresario/perfil
PUT /api/dashboard-empresario/perfil
GET /api/dashboard-empresario/propuestas
POST /api/dashboard-empresario/propuestas
GET /api/dashboard-empresario/ofertas
GET /api/dashboard-empresario/postulaciones
GET /api/dashboard-empresario/talento-recomendado
GET /api/dashboard-empresario/entregables
GET /api/dashboard-empresario/mensajes-recientes
GET /api/dashboard-empresario/notificaciones
GET /api/dashboard-empresario/historial
GET /api/dashboard-empresario/evaluaciones
GET /api/dashboard-empresario/pagos
```

Todos deben usar `verifyToken`.

## Archivos frontend con datos ficticios a eliminar o reemplazar

```text
Frontend/src/pages/Home/DashboardEmpresario/data/dashboardData.js
Frontend/src/pages/Home/DashboardEmpresario/pages/Inicio/Inicio.jsx
Frontend/src/pages/Home/DashboardEmpresario/pages/Proyectos/Proyectos.jsx
Frontend/src/pages/Home/DashboardEmpresario/pages/Ofertas/Ofertas.jsx
Frontend/src/pages/Home/DashboardEmpresario/pages/Entregables/Entregables.jsx
Frontend/src/pages/Home/DashboardEmpresario/pages/Mensajes/Mensajes.jsx
Frontend/src/pages/Home/DashboardEmpresario/pages/Talento/Talento.jsx
Frontend/src/pages/Home/DashboardEmpresario/pages/Historial/Historial.jsx
Frontend/src/pages/Home/DashboardEmpresario/pages/Evaluaciones/Evaluaciones.jsx
Frontend/src/pages/Home/DashboardEmpresario/pages/Facturacion/Facturacion.jsx
Frontend/src/pages/Home/DashboardEmpresario/pages/Notificaciones/Notificaciones.jsx
Frontend/src/pages/Home/DashboardEmpresario/pages/Configuracion/Configuracion.jsx
```

Tambien existe:

```text
Frontend/src/data/mockCandidates.js
Frontend/src/pages/Postulaciones/GestionPostulaciones.jsx
```

Ese mock pertenece a postulaciones y tambien debe reemplazarse por:

```text
GET /api/dashboard-empresario/postulaciones
```

## Orden recomendado de implementacion

1. Crear `Backend/Routes/dashboardEmpresarioRoutes.js`.
2. Crear `Backend/Controllers/dashboardEmpresarioController.js`.
3. Montar ruta en `Backend/app.js`:

```js
app.use('/api/dashboard-empresario', dashboardEmpresarioRoutes);
```

4. Crear `Frontend/src/services/apiClient.js`.
5. Crear `Frontend/src/services/dashboardEmpresarioService.js`.
6. Reemplazar `dashboardData.js` por llamadas reales.
7. Eliminar imports de mocks.
8. Agregar loading/error/empty states.
9. Probar con `npm run build`.

## Criterio de listo

- Buscar `mock` en frontend no debe encontrar datos usados por el dashboard empresario.
- Si la base de datos esta vacia, las paginas muestran estados vacios.
- Si el backend falla, las paginas muestran error.
- Ningun array hardcodeado alimenta tarjetas, tablas, listas, badges o contadores.
- La informacion visible sale de modelos Sequelize o de endpoints agregados que consultan esos modelos.

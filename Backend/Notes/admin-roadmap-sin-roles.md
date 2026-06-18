# Roadmap de mejoras del Admin FWD

> Alcance solicitado: incluir todas las mejoras propuestas excepto roles/permisos finos (`SUPER_ADMIN`, `SOPORTE`, `VERIFICADOR`, `MODERADOR`).  
> Objetivo: convertir el admin en una bandeja operativa rápida, auditable y útil para soporte, verificación y control de plataforma.

---

## Resumen ejecutivo

El admin debe resolver tres necesidades:

1. Ver qué requiere atención hoy.
2. Tomar acciones con contexto suficiente.
3. Dejar trazabilidad clara de cada cambio.

Para lograrlo se implementan estos módulos:

- Detalle real por usuario.
- Bandeja de verificación mejorada.
- Auditoría completa.
- Notificaciones admin.
- Reportes/denuncias.
- Búsqueda global.
- Acciones masivas.
- Exportar CSV.
- Salud del sistema.

No se implementan roles/permisos finos en este roadmap. Todo sigue operando bajo `rol = ADMIN`.

---

## Fase 1: Base operativa y rendimiento

### 1. Detalle real por usuario

#### Qué agrega

Desde Gestión de usuarios, el admin puede abrir una ficha completa con:

- Datos base del usuario.
- Perfil de egresado o empresa.
- Estado de cuenta.
- Último acceso.
- Historial de acciones administrativas.
- Notificaciones enviadas.
- Reportes relacionados.
- Proyectos/postulaciones relacionados cuando aplique.

#### Backend

Endpoints:

```txt
GET /api/admin/usuarios
GET /api/admin/usuarios/:id_usuario/detalle
PUT /api/admin/usuarios/:id_usuario
POST /api/admin/usuarios/:id_usuario/suspender
```

`GET /api/admin/usuarios/:id_usuario/detalle` debe devolver:

```json
{
  "usuario": {},
  "perfilEstudiante": {},
  "perfilEmpresario": {},
  "auditoria": [],
  "notificaciones": [],
  "reportes": [],
  "actividad": {
    "postulaciones": 0,
    "proyectos": 0,
    "ofertas": 0
  }
}
```

Reglas:

- Nunca devolver `contrasena_hash`.
- Paginación para listas internas largas.
- Toda edición debe crear registro en `auditoria`.

#### Frontend

Archivos sugeridos:

```txt
Frontend/src/pages/admin/AdminUsuarios.jsx
Frontend/src/pages/admin/components/AdminUsuarioModal.jsx
Frontend/src/pages/admin/components/AdminUsuarioHistorial.jsx
Frontend/src/pages/admin/components/AdminUsuarioActividad.jsx
```

Interacción:

- Botón `Ver / editar` en cada fila.
- Modal o drawer con tabs: `Resumen`, `Perfil`, `Actividad`, `Auditoría`, `Notificaciones`.
- Guardado optimista solo visual; la fuente final es la respuesta del backend.

#### Criterios de aceptación

- Un admin puede ver toda la información útil de un usuario sin salir del módulo.
- Editar cualquier campo permitido actualiza BD y registra auditoría.
- Suspender/reactivar sigue funcionando desde ficha y tabla.

---

### 2. Búsqueda global

#### Qué agrega

Un buscador superior del admin que encuentre:

- Usuarios.
- Empresas.
- Egresados.
- Proyectos.
- Reportes.
- Auditoría por acción o entidad.

#### Backend

Endpoint:

```txt
GET /api/admin/busqueda?q=texto
```

Respuesta:

```json
{
  "usuarios": [],
  "empresas": [],
  "egresados": [],
  "proyectos": [],
  "reportes": [],
  "auditoria": []
}
```

Reglas:

- `q` mínimo 2 caracteres.
- Máximo 5 resultados por categoría.
- Usar `ILIKE` en Postgres sobre campos de texto.
- No devolver payload completo; solo resumen y `id`.

#### Frontend

Archivos sugeridos:

```txt
Frontend/src/pages/admin/components/AdminBusquedaGlobal.jsx
Frontend/src/services/adminService.js
```

Interacción:

- Input en topbar.
- Resultados agrupados por tipo.
- Click lleva al módulo correcto y abre detalle si aplica.

#### Criterios de aceptación

- Buscar un correo lleva al usuario correcto.
- Buscar nombre de empresa muestra coincidencias.
- La búsqueda no bloquea la UI.

---

## Fase 2: Trabajo diario del admin

### 3. Bandeja de verificación mejorada

#### Qué agrega

La verificación de egresados se vuelve una cola de trabajo real:

- Filtros por estado, antigüedad, sede y método de verificación.
- Vista de evidencia S3.
- Indicador de evidencia válida/inválida.
- Aprobar/rechazar con motivo obligatorio en rechazo.
- Notificación automática al egresado.
- Auditoría de cada decisión.

#### Backend

Endpoints:

```txt
GET /api/admin/egresados/pendientes?page=1&limit=25&search=&estado=
GET /api/admin/egresados/:id_usuario/detalle
POST /api/admin/egresados/:id_usuario/verificar
```

Payload de verificación:

```json
{
  "accion": "APROBAR",
  "motivo_rechazo": null
}
```

Reglas:

- Aprobar solo si `titulo_fwd` es URL S3 válida.
- Rechazar exige motivo.
- Todo ocurre en transacción:
  - actualizar `perfil_estudiante`;
  - activar usuario si aprueba;
  - crear `notificacion`;
  - crear `auditoria`.

#### Frontend

Archivos sugeridos:

```txt
Frontend/src/pages/admin/AdminEgresados.jsx
Frontend/src/pages/admin/components/AdminEgresadoDetalle.jsx
Frontend/src/pages/admin/components/AdminEvidenciaViewer.jsx
```

Interacción:

- Tabla paginada.
- Al seleccionar egresado, abrir detalle lateral.
- Botones de decisión fijos abajo.

#### Criterios de aceptación

- No se puede aprobar evidencia faltante o inválida.
- Al aprobar/rechazar aparece notificación al egresado.
- La cola se actualiza sin recargar toda la página.

---

### 4. Notificaciones admin

#### Qué agrega

La campana del admin muestra eventos accionables:

- Egresados pendientes.
- Empresas pendientes.
- Reportes abiertos.
- Errores recientes.
- Acciones críticas recientes.

#### Backend

Endpoint:

```txt
GET /api/admin/notificaciones?limit=10
PUT /api/admin/notificaciones/leidas
```

Alternativa liviana:

No crear tabla nueva al inicio. Construir notificaciones admin desde:

- `PerfilEstudiante.count({ estado_verificacion: 'PENDIENTE' })`
- `Usuario.count({ rol: 'EMPRESARIO', estado_cuenta: 'PENDIENTE' })`
- `Reporte.count({ estado: 'PENDIENTE' })`
- Últimos errores/auditoría crítica.

Respuesta:

```json
{
  "items": [
    {
      "tipo": "EGRESADOS_PENDIENTES",
      "titulo": "Verificaciones pendientes",
      "mensaje": "Hay 4 egresados esperando revisión",
      "ruta": "egresados",
      "prioridad": "ALTA"
    }
  ],
  "unreadCount": 3
}
```

#### Frontend

Archivos sugeridos:

```txt
Frontend/src/pages/admin/components/AdminCampanaNotificaciones.jsx
Frontend/src/hooks/useAdminNotificaciones.js
```

Interacción:

- Click abre popover.
- Cada notificación lleva al módulo relacionado.
- Botón `Marcar como leído`.

#### Criterios de aceptación

- Campana no es decorativa.
- El admin puede saltar directo a resolver.

---

### 5. Reportes y denuncias

#### Qué agrega

Módulo para administrar denuncias de usuarios/proyectos:

- Ver denuncias pendientes.
- Revisar evidencia.
- Cambiar estado.
- Resolver con comentario.
- Suspender usuario relacionado si corresponde.

#### Backend

Endpoints:

```txt
GET /api/admin/reportes?page=1&limit=25&estado=PENDIENTE
GET /api/admin/reportes/:id_reporte
POST /api/admin/reportes/:id_reporte/resolver
POST /api/admin/reportes/:id_reporte/escalar
```

Payload resolver:

```json
{
  "decision": "RESUELTO",
  "comentario_admin": "Se revisó evidencia y se aplicó suspensión.",
  "accion_relacionada": {
    "tipo": "SUSPENDER_USUARIO",
    "id_usuario": 12,
    "motivo": "Incumplimiento de políticas"
  }
}
```

Reglas:

- Resolver exige comentario.
- Si genera suspensión, usar misma lógica transaccional de suspensión.
- Crear auditoría.
- Notificar al usuario que reportó y al usuario afectado cuando aplique.

#### Frontend

Archivos sugeridos:

```txt
Frontend/src/pages/admin/AdminReportes.jsx
Frontend/src/pages/admin/components/AdminReporteDetalle.jsx
Frontend/src/pages/admin/components/AdminResolucionReporteModal.jsx
```

Interacción:

- Tabla paginada con filtros por estado.
- Ficha de reporte con evidencia y timeline.
- Modal de resolución.

#### Criterios de aceptación

- Un reporte puede pasar de `PENDIENTE` a `REVISADO` o `RESUELTO`.
- Toda resolución queda auditada.
- El admin puede actuar desde la misma pantalla.

---

## Fase 3: Trazabilidad y operación avanzada

### 6. Auditoría completa

#### Qué agrega

Un módulo dedicado a ver acciones administrativas:

- Quién hizo la acción.
- Qué entidad afectó.
- Qué cambió antes/después.
- IP y user-agent.
- Fecha.
- Motivo.

#### Backend

Endpoints:

```txt
GET /api/admin/auditoria?page=1&limit=25&actor=&accion=&entidad=&desde=&hasta=
GET /api/admin/auditoria/:id_auditoria
```

Mejora de datos sugerida:

Agregar snapshots en `metadata`:

```json
{
  "antes": {
    "estado_cuenta": "PENDIENTE"
  },
  "despues": {
    "estado_cuenta": "ACTIVA"
  },
  "motivo": "Evidencia FWD validada"
}
```

Reglas:

- Auditoría es append-only.
- No editar ni borrar registros de auditoría.
- Cada acción sensible debe llamar un helper tipo `registrarAuditoria()`.

#### Frontend

Archivos sugeridos:

```txt
Frontend/src/pages/admin/AdminAuditoria.jsx
Frontend/src/pages/admin/components/AdminDetalleAuditoriaModal.jsx
```

Interacción:

- Filtros superiores.
- Tabla paginada.
- Modal con JSON formateado y resumen legible.

#### Criterios de aceptación

- Se puede reconstruir quién hizo qué y cuándo.
- Edición de usuarios, verificaciones, suspensiones y reportes aparecen en auditoría.

---

### 7. Acciones masivas

#### Qué agrega

Permite seleccionar múltiples filas y ejecutar acciones seguras:

- Aprobar empresas pendientes.
- Rechazar verificaciones seleccionadas con un motivo común.
- Marcar reportes como revisados.
- Exportar seleccionados.
- Enviar notificación masiva.

#### Backend

Endpoints:

```txt
POST /api/admin/acciones-masivas
```

Payload:

```json
{
  "tipo": "APROBAR_EMPRESAS",
  "ids": [1, 2, 3],
  "motivo": "Revisión documental correcta"
}
```

Reglas:

- Validar cantidad máxima por request, por ejemplo 50.
- Ejecutar en transacción cuando aplique.
- Devolver resultado por item:

```json
{
  "success": true,
  "resultados": [
    { "id": 1, "ok": true },
    { "id": 2, "ok": false, "error": "Ya estaba activa" }
  ]
}
```

#### Frontend

Archivos sugeridos:

```txt
Frontend/src/pages/admin/components/AdminBulkActionsBar.jsx
```

Interacción:

- Checkbox por fila.
- Barra fija inferior o superior cuando hay selección.
- Confirmación antes de ejecutar.

#### Criterios de aceptación

- Acción masiva muestra resumen antes de aplicar.
- Resultado indica cuáles fallaron y por qué.

---

### 8. Exportar CSV

#### Qué agrega

Exportar información operativa:

- Usuarios.
- Empresas.
- Egresados.
- Reportes.
- Auditoría.

#### Backend

Endpoints:

```txt
GET /api/admin/export/usuarios.csv
GET /api/admin/export/empresas.csv
GET /api/admin/export/egresados.csv
GET /api/admin/export/reportes.csv
GET /api/admin/export/auditoria.csv
```

Reglas:

- Respetar filtros query:

```txt
?estado=ACTIVA&desde=2026-01-01&hasta=2026-06-17
```

- Usar `text/csv`.
- No exportar datos sensibles como `contrasena_hash`.
- Registrar auditoría: `EXPORTACION_CSV`.

#### Frontend

Archivos sugeridos:

```txt
Frontend/src/pages/admin/components/AdminExportButton.jsx
```

Interacción:

- Botón `Exportar CSV` en cada módulo.
- Usa filtros actuales.
- Descarga directa.

#### Criterios de aceptación

- El CSV abre correctamente en Excel/Sheets.
- Respeta filtros activos.
- La exportación queda en auditoría.

---

### 9. Salud del sistema

#### Qué agrega

Pantalla para revisar estado técnico básico:

- API.
- Base de datos.
- S3.
- Variables críticas presentes.
- Últimos errores registrados.
- Tiempo de respuesta de servicios.

#### Backend

Endpoints:

```txt
GET /api/admin/system/health
GET /api/admin/system/errors
```

Respuesta health:

```json
{
  "api": { "ok": true, "latencyMs": 12 },
  "database": { "ok": true, "latencyMs": 20 },
  "s3": { "ok": true, "bucket": "marketplacefwd" },
  "env": {
    "JWT_SECRET": true,
    "AWS_REGION": true,
    "S3_BUCKET_NAME": true
  }
}
```

Reglas:

- No devolver secretos, solo booleanos.
- S3 puede probar con `HeadBucketCommand`.
- DB puede probar con `sequelize.authenticate()`.

#### Frontend

Archivos sugeridos:

```txt
Frontend/src/pages/admin/AdminSistema.jsx
Frontend/src/pages/admin/components/AdminHealthCard.jsx
```

Interacción:

- Cards por servicio.
- Botón `Revisar otra vez`.
- Últimos errores en tabla.

#### Criterios de aceptación

- Si falla DB o S3, se ve claramente.
- No se exponen secretos.

---

## Orden recomendado de implementación

### Sprint 1: Operación básica rápida

1. Detalle real por usuario.
2. Búsqueda global.
3. Paginación y filtros server-side en todos los módulos.

Resultado: el admin deja de sentirse lento y permite encontrar/editar con contexto.

### Sprint 2: Colas de trabajo

1. Bandeja de verificación mejorada.
2. Notificaciones admin.
3. Reportes/denuncias.

Resultado: el admin sabe qué resolver y puede hacerlo desde una cola clara.

### Sprint 3: Gobierno y trazabilidad

1. Auditoría completa.
2. Acciones masivas.
3. Exportar CSV.

Resultado: el admin escala operativamente y deja evidencia.

### Sprint 4: Salud técnica

1. Salud del sistema.
2. Últimos errores.
3. Alertas técnicas en campana admin.

Resultado: el equipo detecta fallos antes de que los usuarios los reporten.

---

## Cambios de navegación sugeridos

Sidebar admin:

```txt
Inicio
Usuarios
Egresados
Empresas
Reportes
Auditoría
Sistema
Configuración
```

Topbar:

```txt
[Buscar en admin...] [Campana] [Admin]
```

---

## Convenciones técnicas

### Backend

- Toda lista grande debe aceptar:

```txt
page
limit
search
estado
desde
hasta
```

- Toda acción sensible debe:
  - validar input;
  - correr en transacción;
  - crear auditoría;
  - notificar si afecta usuario;
  - devolver `success`, `message`, `data`.

### Frontend

- No usar `findAll` mental en UI: toda tabla debe paginar.
- Usar `useDebounce` para búsqueda.
- Componentes pesados con `lazy`.
- Modales de edición deben recibir `loading` y bloquear doble submit.
- Tablas deben tener estados:
  - cargando;
  - vacío;
  - error;
  - datos;
  - cargar más.

---

## Checklist de aceptación global

- El admin carga rápido aunque haya muchos usuarios.
- El admin puede buscar cualquier entidad importante.
- El admin puede resolver verificaciones, reportes y suspensiones con motivo.
- Cada acción sensible queda en auditoría.
- Las notificaciones del admin llevan a módulos accionables.
- Se puede exportar CSV sin exponer contraseñas ni secretos.
- La pantalla de sistema muestra salud de API, DB y S3.

---

## Fuera de alcance explícito

No se implementa:

- `SUPER_ADMIN`.
- `SOPORTE`.
- `VERIFICADOR`.
- `MODERADOR`.
- Permisos finos por acción.

Todo el roadmap asume que cualquier usuario con `rol = ADMIN` puede acceder a estos módulos.

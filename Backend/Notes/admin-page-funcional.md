# Panel de Administración (Admin) — Visión funcional

> **Plataforma de Conexión de Talento Tecnológico FWD**
> Enfoque práctico: **qué hace** la página, **por qué** existe y **cómo** lo hace (front → API → datos), más **qué datos conviene agregar** para que se sienta de producto serio.
> Escrito desde la perspectiva de implementación full-stack. Para la especificación técnica exhaustiva, ver `admin-page.md`.

---

## El rol en una frase

El admin **no participa en proyectos**: es el **garante de la confianza y el orden** de la plataforma. Verifica egresados, frena abusos, media disputas y mantiene los datos maestros. Su panel es una **bandeja de trabajo**, no un tablero de vanidad.

> **Regla rectora:** el admin *ve* para gobernar, pero **toda escritura sensible deja traza inmutable** (quién, qué, cuándo y por qué).

---

## Lo que hace la página, módulo por módulo

### Panel de inicio (overview)
- **Qué hace:** muestra el estado de la plataforma y, sobre todo, las **colas de trabajo** (verificaciones pendientes, reportes abiertos).
- **Por qué:** el admin entra a *"¿qué tengo que resolver hoy?"*, no a contemplar gráficas.
- **Cómo:** una sola llamada `GET /api/admin/overview` que devuelve contadores ya agregados (`COUNT ... GROUP BY estado` sobre usuarios, propuestas, proyectos, reportes) — **una request, no cinco**; cacheable 30–60 s. El front pinta tarjetas y listas accionables que enlazan directo a la resolución.

### Verificación de egresados FWD  *(el módulo de mayor valor)*
- **Qué hace:** el admin revisa a cada estudiante registrado, ve su título y lo **aprueba o rechaza**.
- **Por qué:** es el candado de confianza del marketplace — hasta que se aprueba, el egresado **no puede ofertar**; sin esto, cualquiera dice ser de FWD.
- **Cómo:** cola filtrada por `estado_verificacion = PENDIENTE`; al abrir la ficha se carga el documento desde **S3 con URL firmada** (no público) y se coteja contra la base de egresados FWD; el botón dispara `POST .../aprobar` o `.../rechazar { motivo }`, que en **una transacción** cambia el estado, crea la **notificación** al estudiante y **registra la acción**.

### Gestión de usuarios
- **Qué hace:** buscar cualquier usuario, ver su historia y **suspender / reactivar** cuentas.
- **Por qué:** frenar abusos sin borrar a nadie a ciegas.
- **Cómo:** tabla con búsqueda y filtros **paginada** (nunca un `findAll` pelado); la ficha **jamás** trae `contrasena_hash` (excluido por `defaultScope`); `POST .../suspender { motivo }` pasa `estado_cuenta` a `SUSPENDIDA` y notifica.
- **Detalle clave:** la suspensión solo es real si `verifyToken` **relee el estado en cada request**; si no, el token viejo sigue entrando.

### Moderación de reportes
- **Qué hace:** recibe denuncias (a un usuario o a un proyecto), las revisa con su evidencia y las **resuelve o escala**.
- **Por qué:** es el canal formal de *"algo está mal aquí"*.
- **Cómo:** cola sobre la tabla `reporte` (`PENDIENTE → REVISADO → RESUELTO`), ficha con la evidencia adjunta; la resolución puede **encadenar** una acción de otros módulos (suspender / eliminar proyecto).

### Proyectos y disputas
- **Qué hace:** ver proyectos, **eliminar** los que violan políticas (con motivo) y **mediar** disputas en modo solo-lectura.
- **Por qué:** el admin es el árbitro cuando empresa y estudiante chocan.
- **Cómo:** `POST .../proyectos/:id/eliminar { motivo }` → `CANCELADO` + notificación al dueño; vista de mediación donde ve requisitos / entregables / evidencia y puede **revertir penalizaciones automáticas** de reputación (recalculándola y dejando traza).

### Catálogos maestros
- **Qué hace:** mantener **tecnologías, sectores y habilidades** que alimentan todo (publicar, perfiles, filtros).
- **Por qué:** que agregar "Svelte" no sea un despliegue.
- **Cómo:** CRUD con **activar / desactivar** en vez de borrar (una tecnología en uso no se elimina, se desactiva, por integridad referencial).

### Analítica y reportes
- **Qué hace:** métricas del negocio (embudo de verificación, proyectos por estado, tiempos medios, tecnologías más pedidas) con exportación **CSV/PDF**.
- **Por qué:** para que FWD mida impacto.
- **Cómo:** consultas agregadas con filtros por fecha; si crece el volumen, **tablas de resumen recalculadas por job nocturno** para no golpear las tablas operativas.

### Auditoría
- **Qué hace:** registra y permite consultar **toda** acción sensible (quién verificó / suspendió / eliminó y por qué).
- **Por qué:** protege al admin (prueba que actuó bien) y a los usuarios (permite revertir errores); es requisito de cumplimiento.
- **Cómo:** un `AuditoriaService.log()` invocado dentro de cada transacción (idealmente vía **hooks** de Sequelize), sobre una tabla **solo-append**.

---

## Qué datos agregar para que sea más profesional

> Esto separa un panel *"que funciona"* de uno que se siente de empresa. Agrupado por intención.

### 1. Trazabilidad y rendición de cuentas *(lo primero)*
- Tabla **`auditoria`**: `actor`, `accion`, `entidad`, `metadata` (JSON con **snapshot antes/después**), `ip`, `user_agent`, `fecha`. Hoy no existe; es lo primero que pediría un auditor.
- **Motivo + autor + fecha** en cada acción sensible:
  - `usuario`: `motivo_suspension`, `suspendido_por`, `fecha_suspension`
  - `perfil_estudiante`: `verificado_por`, `fecha_verificacion`, `motivo_rechazo`
  - `propuesta`: `eliminado_por`, `motivo_eliminacion`
  - Sin esto, *"¿quién aprobó a este?"* no tiene respuesta.

### 2. Medición y SLAs *(vuelve gerenciable la operación)*
- **Timestamps de ciclo de vida** por entidad: `fecha_solicitud_verificacion` vs `fecha_resuelta` → **tiempo medio de verificación** (KPI estrella). Igual para reportes (`abierto_en` / `resuelto_en`) y proyectos (`publicado` / `adjudicado` / `completado`).
- **`prioridad` / `antiguedad`** derivada para ordenar colas y resaltar lo que se pasa del SLA (p. ej. verificaciones con > 24 h en rojo).

### 3. Integridad y reversibilidad
- **Soft-delete** universal: `deleted_at` (o `activo`) en catálogos, usuarios y proyectos, en vez de `DELETE` físico. Permite deshacer y conserva integridad referencial.
- **Optimistic lock** (`updated_at` o `version`) para que dos admins no se pisen una edición.

### 4. Clasificar y aprender de los datos *(no solo texto libre)*
- **Taxonomía de motivos**: en lugar de `motivo` como texto suelto, un catálogo (`SPAM`, `FRAUDE`, `CONTENIDO_INAPROPIADO`, `INCUMPLIMIENTO`, `OTRO`) + comentario libre. Permite reportar *"el 40 % de las suspensiones fue por fraude"*.
- **Estado de la integración FWD** en el perfil: `metodo_verificacion` (`API` / `MANUAL` / `DOCUMENTO`) y `match_automatico` (bool) — para saber qué tan automatizable es y auditar la fuente de la decisión.

### 5. Gobierno de la plataforma
- Tabla **`configuracion`** clave-valor (ventana 5–15, límite de 4 proyectos, piso de presupuesto, reglas de niveles) para que los servicios lean **parámetros** en vez de constantes hardcodeadas — cada cambio auditado.
- **Permisos finos** si hay más de un admin (p. ej. un "moderador" que solo ve reportes vs un "super admin"). Hoy `rol = ADMIN` es todo-o-nada.

### 6. Confianza simétrica *(decisión de producto recomendada)*
- Métricas del **empresario** visibles para el admin y, si se aprueba, para el estudiante: `proyectos_completados`, `% pago a tiempo`. Hoy solo el estudiante carga reputación; el riesgo es bidireccional y los datos deberían reflejarlo.

---

## Resumen accionable

| Prioridad | Acción de datos | Impacto |
|-----------|-----------------|---------|
| 1 | Crear `auditoria` + `*_por` / `fecha_*` / `motivo_*` | Trazabilidad y cumplimiento |
| 2 | Timestamps de ciclo de vida | KPIs y SLAs reales |
| 3 | Soft-delete + optimistic lock | Reversibilidad e integridad |
| 4 | Taxonomía de motivos | Datos clasificables, no texto suelto |
| 5 | Tabla `configuracion` | Parámetros sin redeploy |
| 6 | Métricas del empresario | Confianza bidireccional |

---

*Documento funcional, derivado de la suite de documentación FWD. Versión técnica completa en `admin-page.md`.*

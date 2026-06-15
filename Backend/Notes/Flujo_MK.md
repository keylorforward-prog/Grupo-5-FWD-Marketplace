# Plataforma de Conexión de Talento Tecnológico – FWD

## Flujo del Aplicativo – Especificación Completa

Recorrido de punta a punta, fase por fase: actores, pasos, estados, reglas, notificaciones, pantallas y caminos alternativos.

**Documento técnico · Confidencial · v1.0**

---

# Contenido

1. Actores y sistemas
2. Vista general del recorrido
3. Fase 1 — Alta y verificación
4. Fase 2 — Definición del proyecto
5. Fase 3 — Publicación y ofertas
6. Fase 4 — Adjudicación
7. Fase 5 — Desarrollo y entregables
8. Fase 6 — Cierre
9. Caminos alternativos transversales
10. Flujo paralelo: bolsa de empleo
11. Apéndice A — Diccionario de estados
12. Apéndice B — Eventos y notificaciones

---

# 1. Actores y Sistemas

## Estudiante

Egresado FWD verificado.

* Construye portafolio.
* Oferta a proyectos.
* Entrega trabajo.
* Acumula reputación y nivel.

## Empresario

Empresa formal o emprendedor.

* Define proyectos mediante IA.
* Adjudica ofertas.
* Aprueba entregables.
* Califica estudiantes.

## Administrador

* Valida egresados FWD.
* Gestiona usuarios y catálogos.
* Modera reportes.
* Resuelve disputas.

## Agente de IA

* Entrevista al empresario.
* Genera requerimientos.
* Sugiere stack tecnológico.
* Recomienda talento.

## Sistema / Notificaciones

* Orquesta estados.
* Valida reglas.
* Emite notificaciones in-app y correo.

## Servicios Externos

* SES (correo)
* Base de egresados FWD
* WhatsApp
* Proveedor de IA

---

# 2. Vista General del Recorrido

## Fase 1 — Alta y Verificación

Registro → Verificación de correo → Validación de egresado FWD.

## Fase 2 — Definición del Proyecto

El agente IA entrevista al empresario y genera requerimientos.

## Fase 3 — Publicación y Ofertas

Ventana de ofertas de 5 a 15 días.

## Fase 4 — Adjudicación

El empresario selecciona la mejor oferta.

## Fase 5 — Desarrollo y Entregables

Gestión de hitos, entregables y revisiones.

## Fase 6 — Cierre

Pago, calificación y actualización de reputación.

---

# 3. Fase 1 — Alta y Verificación

## Objetivo

Tener cuentas válidas y estudiantes verificados como egresados FWD.

## Precondición

Ninguna.

## Flujo

1. Usuario selecciona rol:

   * Estudiante
   * Empresario

2. Completa formulario.

### Estudiante

* Datos personales
* Cédula
* Título FWD
* Sede
* Área
* Tecnologías
* Nivel
* Disponibilidad

### Empresario

* Empresa o emprendedor
* Datos del negocio

3. Sistema crea cuenta en estado:

```text
PENDIENTE
```

4. Envía correo de verificación (24h).

5. Usuario verifica correo.

```text
PENDIENTE → ACTIVA
```

6. Administrador valida título FWD.

```text
PENDIENTE → VERIFICADO
PENDIENTE → RECHAZADO
```

7. Activación opcional de 2FA.

## Estados

### Usuario

```text
PENDIENTE → ACTIVA
```

### Estudiante

```text
PENDIENTE → VERIFICADO
PENDIENTE → RECHAZADO
```

## Reglas

* RN-01 Enlace válido por 24h.
* RN-02 Solo estudiantes verificados ofertan.
* RN-03 Bloqueo tras 5 intentos.
* RN-04 Recuperación válida por 1h.

## Pantallas

* Registro
* Registro Estudiante
* Registro Empresario
* Verificación de correo
* Login
* Recuperación de contraseña
* 2FA

---

# 4. Fase 2 — Definición del Proyecto

## Objetivo

Convertir una idea en una propuesta publicable.

## Precondición

Empresario activo.

## Flujo

1. Empresario describe idea.
2. IA realiza entrevista.
3. IA recopila:

   * Objetivos
   * Alcance
   * Usuarios
   * Datos
   * Tecnologías
   * Plazo
   * Presupuesto
4. IA genera:

   * Requerimientos
   * Stack sugerido
5. Empresario revisa.
6. Empresario aprueba.

## Alternativa

Creación manual sin IA.

## Estado

```text
EN_CURSO → FINALIZADA
```

## Pantallas

* Chat IA
* Revisión de requerimientos

---

# 5. Fase 3 — Publicación y Ofertas

## Objetivo

Publicar propuestas y recibir ofertas.

## Precondición

Requerimientos aprobados.

## Flujo

1. Publicación de proyecto:

* Título
* Descripción
* Categoría
* Área de negocio
* Tecnologías
* Presupuesto
* Ventana de ofertas

2. Estudiantes buscan proyectos.

Filtros:

* Tecnología
* Área
* Fecha
* Categoría

3. Envío de oferta:

* Prototipo
* Solución propuesta
* Precio

4. Registro de oferta.

```text
ENVIADA
```

5. Sistema notifica proximidad de cierre.

## Estados

### Propuesta

```text
ACTIVA
```

### Oferta

```text
ENVIADA
```

## Reglas

* Ventana 5–15 días.
* No doble oferta.
* No ofertar proyectos cerrados.
* Máximo 4 proyectos simultáneos.

## Pantallas

* Explorar proyectos
* Detalle del proyecto
* Enviar oferta
* Mis ofertas

---

# 6. Fase 4 — Adjudicación

## Objetivo

Seleccionar la mejor oferta.

## Precondición

Al menos una oferta.

## Flujo

1. Empresario revisa:

   * Perfil
   * Reputación
   * Nivel
   * Prototipo
   * Precio

2. Califica ofertas.

3. Adjudica una.

4. Sistema notifica resultados.

5. Inicia proyecto.

## Estados

### Propuesta

```text
ACTIVA → CERRADA
```

### Oferta Ganadora

```text
CONTRATADO
```

### Ofertas Restantes

```text
RECHAZADA
```

### Proyecto

```text
EN_PROGRESO
```

## Pantallas

* Ofertas recibidas
* Adjudicar

---

# 7. Fase 5 — Desarrollo y Entregables

## Objetivo

Ejecutar y validar el proyecto.

## Precondición

Proyecto en progreso.

## Flujo

1. Habilitación de comunicación:

   * Chat interno
   * WhatsApp

2. Inicio del plazo de entrega.

3. Subida de hitos y entregables.

4. Revisión por empresario.

5. Resultado:

```text
APROBADO
```

o

```text
CON_CAMBIOS
```

6. Repetición del ciclo hasta aprobación.

## Estados

### Proyecto

```text
EN_PROGRESO
EN_REVISION
```

### Entregable

```text
ENVIADO
APROBADO
CON_CAMBIOS
```

## Pantallas

* Workspace
* Mensajería
* Subir entregable

---

# 8. Fase 6 — Cierre

## Objetivo

Finalizar proyecto y actualizar reputación.

## Precondición

Entregable final aprobado.

## Flujo

1. Proyecto completado.

```text
COMPLETADO
```

2. Pago directo empresa → estudiante.

```text
PENDIENTE → PAGADO
```

3. Empresario califica.

4. Sistema recalcula:

* Reputación
* Nivel
* Puntaje de confianza

5. Estudiante responde una vez.

6. Proyecto pasa al historial.

## Pantallas

* Workspace de cierre
* Calificación
* Mi reputación
* Pasarela simulada

---

# 9. Caminos Alternativos

| Situación             | Resultado                         |
| --------------------- | --------------------------------- |
| Correo no verificado  | Cuenta permanece PENDIENTE        |
| Egresado rechazado    | Puede usar perfil pero no ofertar |
| Sin ofertas           | Proyecto cerrado sin adjudicación |
| Proyecto editado      | Notificación a oferentes          |
| Solicitud de cambios  | Nuevo ciclo de revisión           |
| Incumplimiento        | Penalización de reputación        |
| Disputa               | Intervención del administrador    |
| Eliminación por admin | Proyecto CANCELADO                |
| Falla IA              | Reintento o modo manual           |

---

# 10. Flujo Paralelo — Bolsa de Empleo

## Paso 1

Empresa publica vacante.

### Modalidades

* Pasantía
* Práctica
* Medio tiempo
* Tiempo completo
* Interino
* Temporal
* Mentoría

## Paso 2

Egresado aplica.

* CV
* Perfil

## Paso 3

Empresa revisa y contacta.

La contratación ocurre fuera de la plataforma.

---

# 11. Apéndice A — Diccionario de Estados

| Entidad                               | Estados                                                      |
| ------------------------------------- | ------------------------------------------------------------ |
| usuario.estado_cuenta                 | PENDIENTE, ACTIVA, SUSPENDIDA                                |
| perfil_estudiante.estado_verificacion | PENDIENTE, VERIFICADO, RECHAZADO                             |
| propuesta.estado                      | ACTIVA, PAUSADA, CERRADA, CANCELADA                          |
| postulacion.estado                    | ENVIADA, EN_REVISION, PRESELECCIONADA, RECHAZADA, CONTRATADO |
| oferta.estado                         | ACEPTADA, RECHAZADA, EXPIRADA                                |
| proyecto_plataforma.estado            | ABIERTO, EN_PROGRESO, EN_REVISION, COMPLETADO, CANCELADO     |
| entregable.estado                     | ENVIADO, APROBADO, CON_CAMBIOS                               |
| pago.estado                           | PENDIENTE, PAGADO, RETENIDO                                  |
| reporte.estado                        | PENDIENTE, REVISADO, RESUELTO                                |

---

# 12. Apéndice B — Eventos y Notificaciones

| Evento                         | Canal                      | Destinatario     |
| ------------------------------ | -------------------------- | ---------------- |
| Verificación de cuenta         | Correo                     | Usuario          |
| Recuperación de contraseña     | Correo                     | Usuario          |
| Resultado validación FWD       | In-app + Correo            | Estudiante       |
| Vencimiento próximo de ofertas | In-app + Correo            | Interesados      |
| Adjudicación                   | In-app + Correo            | Participantes    |
| Descarte de oferta             | In-app + Correo            | No seleccionados |
| Edición de proyecto            | In-app + Correo            | Oferentes        |
| Nuevo mensaje                  | In-app (+ correo opcional) | Contraparte      |
| Nuevo entregable               | In-app + Correo            | Empresario       |
| Entregable aprobado/cambios    | In-app                     | Estudiante       |
| Calificación recibida          | In-app                     | Estudiante       |
| Suspensión de cuenta           | Correo                     | Usuario          |
| Eliminación de proyecto        | Correo                     | Empresario       |

---

**Fin del documento**


🌟 ¿Cómo va el diseño del flujo? (Lo Positivo)
El documento está excelentemente estructurado. Define un ciclo de vida muy claro para los proyectos (desde la creación de la cuenta hasta el cierre del proyecto y pago). Destacan varios puntos fuertes:

Claridad de Fases: Dividir el proceso en 6 fases lógicas (Alta, Definición, Publicación, Adjudicación, Desarrollo y Cierre) hace que el sistema sea muy fácil de entender y de programar.
Integración de IA Innovadora: El uso de un agente de IA en la Fase 2 para entrevistar al empresario y generar los requerimientos técnicos es un diferenciador enorme. Evita que empresarios sin conocimientos técnicos publiquen proyectos mal definidos.
Diccionario de Estados Sólido: El Apéndice A y B (estados y notificaciones) son oro puro para el desarrollo backend. Definen exactamente qué entidades existen y por qué estados pasan, lo cual facilita enormemente el diseño de la base de datos (modelos y tablas).
Sistema de Reputación/Gamificación: Incluir un sistema de niveles y reputación (Fase 6) incentiva el buen comportamiento y la calidad en los entregables.
🔍 ¿Qué falta o qué áreas requieren más definición? (Oportunidades de Mejora)
Aunque el flujo principal está muy bien cubierto, hay algunos casos de uso o detalles técnicos que no están completamente resueltos en el documento:

Gestión de Pagos (Fase 6):
Mencionas "Pago directo empresa → estudiante" y "Pasarela simulada". Sin embargo, en el diccionario de estados de pagos tienes RETENIDO.
Falta definir: ¿La plataforma retiene el dinero (tipo Escrow o fideicomiso) hasta que se aprueba el entregable, o el empresario le paga por fuera al estudiante? Si es por fuera, ¿cómo se asegura el estudiante de recibir el pago y la plataforma de que el proyecto se cierre correctamente?
Resolución de Disputas (Camino Alternativo):
Mencionas que la "Disputa" conlleva la "Intervención del administrador".
Falta definir: ¿Cómo se levanta un ticket de disputa? ¿El proyecto se congela? ¿Qué pasa con los pagos y la reputación si hay un empate o culpa compartida?
Roles Administrativos:
Se menciona que el Administrador valida el título FWD y modera disputas.
Falta definir: No hay un flujo detallado para el panel de administración. Sería útil definir qué pantallas ve el admin (dashboard de usuarios pendientes, tabla de disputas, métricas generales).
Gestión de la IA (Fase 2):
Mencionas "Falla IA -> Reintento o modo manual".
Falta definir: Si un empresario quiere modificar manualmente los requerimientos generados por la IA antes de publicar, ¿puede hacerlo? ¿O la IA tiene la última palabra?
💡 Mi opinión general
El proyecto tiene una base funcional robusta y muy moderna. La idea de conectar el talento junior verificado (estudiantes FWD) con empresas reales bajo una estructura controlada por hitos y potenciada por Inteligencia Artificial es muy atractiva.

A nivel de desarrollo, este documento es exactamente el tipo de especificación que un equipo de backend y frontend necesita para empezar a construir sin ambigüedades. Ya tienen los cimientos de la base de datos (con Sequelize, que vi en tus configuraciones) y los estados definidos.

Mi recomendación para los siguientes pasos: Asegúrense de dejar muy claro el modelo financiero (cómo y cuándo se paga) porque suele ser el punto de fricción más grande en los marketplaces de freelancers. Por lo demás, ¡el planteamiento va por excelente camino! Si necesitas que empecemos a programar alguna de estas lógicas en el Backend (como el sistema de estados o las notificaciones), avísame.
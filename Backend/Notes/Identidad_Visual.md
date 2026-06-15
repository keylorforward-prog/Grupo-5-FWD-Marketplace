# Plataforma de Conexión de Talento Tecnológico FWD

## Identidad Visual del Aplicativo

**Documento técnico · Confidencial · v1.0 · Brand Book**

Sistema de diseño que define la paleta de colores, tipografía, niveles, estados, componentes, accesibilidad y tokens listos para producción.

---

# 01. Marca

El logotipo es el activo principal de la plataforma. Mientras se integra el archivo definitivo, se utiliza el wordmark tipográfico **FWD**.

## Usos válidos

* A color sobre fondos claros.
* En blanco sobre colores Primary, Secondary o Ink Strong.
* Mantener un área de protección equivalente a la altura de la letra **W**.

## Evitar

* Deformar o rotar el logotipo.
* Alterar sus proporciones.
* Utilizar colores fuera de la paleta oficial.
* Aplicar degradados sobre el logo.
* Utilizar fondos con bajo contraste o imágenes visualmente cargadas.

---

# 02. Color

## Paleta de Marca

| Variable         | Color               |
| ---------------- | ------------------- |
| Primary          | #0A6CB9             |
| Secondary        | #662D91             |
| Accent / Success | #20BEC6             |
| Highlight        | #FFCB05             |
| Warning          | #F7901E             |
| Magenta          | #EC008C             |
| Destructive      | oklch(.577 .245 27) |
| Success          | #20BEC6             |

## Neutros

* Canvas
* Surface
* Surface Sunken
* Border
* Border Strong
* Ink Subtle
* Ink Muted
* Ink
* Ink Strong

## Roles Semánticos

| Propósito   | Color       |
| ----------- | ----------- |
| Información | Primary     |
| Éxito       | Accent      |
| Advertencia | Warning     |
| Error       | Destructive |
| Destacado   | Highlight   |

---

# 03. Niveles (Gamificación)

Los estudiantes progresan mediante niveles que aumentan su visibilidad dentro del marketplace.

1. Iron
2. Bronze
3. Silver
4. Gold
5. Platinum
6. Trofeo

---

# 04. Estados

Estados utilizados para cuentas, proyectos, propuestas y entregables.

## Estados Positivos

* Activa
* En progreso
* En revisión
* Pendiente
* Con cambios
* Completado
* Verificado

## Estados Neutros

* Pausada
* Cerrada

## Estados Negativos

* Cancelada
* Rechazada
* Suspendida

---

# 05. Tipografía

## Fuente para títulos

### Archivo Narrow

* Peso: 700
* Uso: títulos y encabezados

Ejemplo:

> Talento que avanza

Tamaño recomendado:

* 48px – 68px
* Line-height: 1.0 – 1.1

---

## Fuente para contenido

### Figtree

* Uso: texto de interfaz y contenido general
* Pesos: 400, 500, 600 y 700

Ejemplo:

> La plataforma conecta a empresarios con estudiantes egresados de FWD mediante proyectos reales de desarrollo.

Configuración:

* Tamaño: 16px
* Line-height: 1.6

---

## Escala Tipográfica

| Elemento   | Tamaño     |
| ---------- | ---------- |
| H1         | 34px / 700 |
| H2         | 26px / 700 |
| H3         | 20px / 600 |
| Body Large | 18px / 400 |
| Small      | 14px / 400 |
| Caption    | 11–12px    |

---

# 06. Espaciado y Radios

## Sistema de Espaciado

Escala basada en múltiplos de 4px.

* 4px
* 8px
* 12px
* 16px
* 24px
* 32px
* 48px
* 64px

## Radios

| Nombre | Valor  |
| ------ | ------ |
| Small  | 8px    |
| Medium | 12px   |
| Large  | 20px   |
| Pill   | 9999px |

Radio principal de marca:

```css
--radius: 1.25rem;
```

---

# 07. Elevación y Movimiento

## Sombras

### Shadow Soft

Utilizada para:

* Tarjetas
* Inputs
* Chips

### Shadow Elevated

Utilizada para:

* Hover de tarjetas
* Menús
* Modales

---

## Animaciones

### Curvas

```css
ease-out
cubic-bezier(0.23,1,0.32,1)
```

```css
ease-in-out
cubic-bezier(0.77,0,0.18,1)
```

### Duraciones

| Tipo | Tiempo |
| ---- | ------ |
| Fast | 160ms  |
| Base | 220ms  |
| Slow | 320ms  |

---

# 08. Iconografía

## Recomendaciones

* Estilo Outline
* Grosor aproximado de 1.75px
* Esquinas redondeadas

Bibliotecas recomendadas:

* Lucide Icons
* Tabler Icons

---

# 09. Componentes

## Botones

* Primario
* Secundario
* Fantasma
* Destacado
* Eliminar

---

## Formularios

Campos comunes:

* Correo electrónico
* Contraseña
* Switches
* Mensajes de ayuda
* Validaciones

---

## Tarjeta de Proyecto

Elementos:

* Estado
* Fecha de cierre
* Título
* Descripción
* Tecnologías

Ejemplo:

**Dashboard de ventas**

> Tablero web para visualizar KPIs en tiempo real.

Tecnologías:

* React
* Node.js
* PostgreSQL

---

## Alertas

### Éxito

* Tu proyecto se publicó correctamente.
* Cuenta verificada como egresado FWD.

### Advertencia

* La ventana de ofertas cierra pronto.

### Error

* No puedes ofertar: cuenta no verificada.

---

## Tabla

| Estudiante | Nivel    | Reputación |
| ---------- | -------- | ---------- |
| Ana Rojas  | Gold     | 4.8 ★      |
| Luis Mora  | Platinum | 4.9 ★      |
| Sara Vega  | Bronze   | 4.2 ★      |

---

## Mensajería

Ejemplo:

**Empresario**

> Hola, ¿avanzamos con el hito 1?

**Estudiante**

> Sí, lo subo hoy mismo.

**Empresario**

> Perfecto, gracias.

---

## Avatares y Progreso

Componentes:

* Avatar
* Rating con estrellas
* Barra de progreso
* Indicador de nivel

---

## Modal

### Adjudicar Proyecto

Mensaje:

> Vas a adjudicar a Ana Rojas. Se notificará al resto de oferentes.

Acciones:

* Cancelar
* Adjudicar

---

# 10. Accesibilidad

Objetivo:

**WCAG 2.1 AA**

## Hacer

* Contraste mínimo 4.5:1
* Anillo de foco visible de 3px
* Complementar colores con texto o íconos
* Respetar `prefers-reduced-motion`
* Áreas táctiles mayores o iguales a 44px

## Evitar

* Texto claro sobre Highlight o Accent
* Comunicar estados únicamente mediante color
* Animaciones largas o intermitentes
* Eliminar indicadores de foco

---

# 11. Tokens de Diseño

## Colores

```css
--primary:#0a6cb9;
--secondary:#662d91;
--accent:#20bec6;
--highlight:#ffcb05;
--warning:#f7901e;
--magenta:#ec008c;
--success:#20bec6;
```

## Movimiento

```css
--ease-out:cubic-bezier(0.23,1,0.32,1);
--ease-in-out:cubic-bezier(0.77,0,0.175,1);

--duration-fast:160ms;
--duration-base:220ms;
--duration-slow:320ms;
```

## Sombras

```css
--shadow-soft
```

```css
--shadow-elevated
```

## Radio Global

```css
--radius:1.25rem;
```

## Fuentes

```css
--font-figtree
--font-archivo-narrow
```

Fuentes recomendadas:

* Figtree
* Archivo Narrow

Disponibles mediante Google Fonts.

---

# Resumen

La identidad visual de FWD se basa en:

* Azul como color principal de confianza.
* Gamificación mediante niveles.
* Sistema visual accesible WCAG 2.1 AA.
* Componentes reutilizables.
* Diseño moderno basado en Figtree y Archivo Narrow.
* Tokens listos para integración en TailwindCSS v4.

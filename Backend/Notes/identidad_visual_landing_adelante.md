# Identidad visual y copy de la landing page “Adelante”

## 1. Copy visible en la landing

### Eyebrow / categoría
**PLATAFORMA DE EMPLEABILIDAD**

### Titular principal
**Adelante. Tu camino hacia el empleo empieza aquí.**

### Texto descriptivo
**La plataforma de empleabilidad para egresados de Fundación Forward Costa Rica.**

### Llamado a la acción principal
**Iniciar sesión**

### Sello / respaldo institucional
**Premio AMCHAM 2025 — Negocios Sostenibles**

---

## 2. Concepto general de marca

La landing comunica una plataforma de empleabilidad con enfoque social, profesional y optimista. La identidad visual está construida alrededor de la idea de avance: “Adelante” funciona como promesa, dirección y acción.

El sistema visual transmite:

- Progreso profesional.
- Acceso a oportunidades laborales.
- Confianza institucional.
- Energía joven.
- Impacto social.
- Comunidad y conexión.
- Modernidad digital.

El lenguaje visual no se percibe corporativo tradicional ni frío. Es institucional, pero con una personalidad más cercana, vibrante y contemporánea.

---

## 3. Paleta cromática

> Los valores HEX son aproximaciones tomadas visualmente de la captura. Pueden variar según compresión, pantalla o implementación original.

### Color principal

| Uso | Color | HEX aproximado | RGB aproximado | Función visual |
|---|---:|---:|---:|---|
| Fondo principal | Morado institucional | `#672E91` | `103, 46, 145` | Color base de la marca. Aporta profundidad, seriedad, identidad institucional y contraste alto. |

El morado domina casi toda la interfaz. Funciona como color propietario de la landing y permite que los acentos amarillos, blancos y turquesas tengan máxima visibilidad.

### Variaciones de morado

| Uso | Color | HEX aproximado | RGB aproximado | Función visual |
|---|---:|---:|---:|---|
| Fondo secundario / franjas diagonales | Morado medio | `#75469D` | `117, 70, 157` | Da profundidad sin romper la unidad cromática. |
| Franjas de fondo más claras | Morado claro | `#8E65AE` | `142, 101, 174` | Crea dimensión y movimiento en la zona derecha. |
| Sombra / contraste interno | Morado oscuro | `#512C6D` | `81, 44, 109` | Refuerza jerarquía y profundidad. |

Las variaciones de morado se usan principalmente en el patrón de fondo de la derecha. No compiten con el contenido; funcionan como textura geométrica y dirección visual.

### Color de acento principal

| Uso | Color | HEX aproximado | RGB aproximado | Función visual |
|---|---:|---:|---:|---|
| Palabra “Adelante”, CTA, detalles del sello | Amarillo brillante | `#F8CA07` | `248, 202, 7` | Comunica energía, optimismo, acción y avance. Es el principal punto de atracción visual. |
| Variante del amarillo en ilustración | Amarillo dorado | `#DDAA20` | `221, 170, 32` | Añade volumen y contraste dentro del ícono geométrico. |

El amarillo se usa de forma estratégica: aparece en el inicio del titular y en el botón principal. Esto vincula semánticamente la palabra “Adelante” con la acción “Iniciar sesión”.

### Colores secundarios de ilustración

| Uso | Color | HEX aproximado | RGB aproximado | Función visual |
|---|---:|---:|---:|---|
| Formas geométricas externas | Turquesa / cian | `#1BC2C9` | `27, 194, 201` | Aporta frescura, tecnología y dinamismo. |
| Sombras o caras laterales | Azul cian | `#0DA1CE` | `13, 161, 206` | Genera volumen en la ilustración. |
| Centro de la figura | Magenta / fucsia | `#E2038D` | `226, 3, 141` | Agrega energía, expresividad y contraste contemporáneo. |
| Variante magenta profunda | Violeta-magenta | `#A3188E` | `163, 24, 142` | Refuerza contraste interno y profundidad. |

Estos colores hacen que la ilustración sea el segundo foco visual después del titular. La combinación morado + amarillo + cian + magenta produce una identidad llamativa, digital y memorable.

### Colores neutros

| Uso | Color | HEX aproximado | RGB aproximado | Función visual |
|---|---:|---:|---:|---|
| Titular blanco | Blanco | `#FFFFFF` | `255, 255, 255` | Máxima legibilidad y contraste. |
| Texto descriptivo | Blanco lavanda / gris claro | `#E8DFEE` | `232, 223, 238` | Menor jerarquía que el titular, pero alta legibilidad. |
| Texto del botón | Negro / casi negro | `#111111` | `17, 17, 17` | Contraste claro sobre amarillo. |

---

## 4. Jerarquía tipográfica

La tipografía parece ser una familia **sans serif condensada y pesada** para el titular. No es posible confirmar la fuente exacta solo desde la captura, pero visualmente se parece a familias como:

- **Barlow Condensed ExtraBold / Black**
- **Roboto Condensed Bold**
- **Anton**
- **Oswald Heavy**
- **Archivo Narrow Bold**

Para el cuerpo y elementos secundarios, parece usarse una **sans serif geométrica o grotesca limpia**, menos condensada y más ligera. Posibles equivalentes:

- **Inter**
- **Montserrat**
- **Aptos / Calibri moderna**
- **Roboto**
- **Source Sans 3**

### Titular principal

**Texto:** “Adelante. Tu camino hacia el empleo empieza aquí.”

Características:

- Sans serif condensada.
- Peso muy alto: equivalente a `700`, `800` o `900`.
- Alto impacto visual.
- Letras estrechas, verticales y compactas.
- Caja mixta, no todo en mayúsculas.
- Interlineado ajustado.
- Color dividido: amarillo para “Adelante.” y blanco para el resto.

Especificación aproximada para desktop:

```css
font-family: 'Barlow Condensed', 'Roboto Condensed', 'Arial Narrow', sans-serif;
font-size: 80px;
font-weight: 800;
line-height: 0.98;
letter-spacing: -0.5px;
color: #FFFFFF;
```

Tratamiento cromático recomendado:

```css
.hero-title .highlight {
  color: #F8CA07;
}
```

### Eyebrow / descriptor superior

**Texto:** “PLATAFORMA DE EMPLEABILIDAD”

Características:

- Todo en mayúsculas.
- Amarillo brillante.
- Tamaño pequeño.
- Tracking muy amplio.
- Peso medio/alto.
- Funciona como etiqueta de categoría.

Especificación aproximada:

```css
font-family: 'Inter', 'Montserrat', sans-serif;
font-size: 13px;
font-weight: 700;
line-height: 1.2;
letter-spacing: 5px;
text-transform: uppercase;
color: #F8CA07;
```

### Texto descriptivo

**Texto:** “La plataforma de empleabilidad para egresados de Fundación Forward Costa Rica.”

Características:

- Sans serif limpia.
- Peso regular.
- Color blanco suavizado o lavanda claro.
- Tamaño medio.
- Buena separación respecto al titular.
- Longitud de línea controlada.

Especificación aproximada:

```css
font-family: 'Inter', 'Montserrat', sans-serif;
font-size: 23px;
font-weight: 400;
line-height: 1.45;
letter-spacing: 0;
color: #E8DFEE;
max-width: 680px;
```

### Botón principal

**Texto:** “Iniciar sesión”

Características:

- Fondo amarillo.
- Texto negro o casi negro.
- Forma tipo píldora.
- Peso semibold/bold.
- Alto contraste.
- CTA principal claro y directo.

Especificación aproximada:

```css
.cta-button {
  background-color: #F8CA07;
  color: #111111;
  border-radius: 999px;
  padding: 14px 36px;
  font-family: 'Inter', 'Montserrat', sans-serif;
  font-size: 18px;
  font-weight: 700;
  line-height: 1;
  border: none;
}
```

### Sello / premio

Características:

- Ubicado en la parte inferior izquierda.
- Escala secundaria.
- Acompañado por un ícono o sello institucional en amarillo.
- Texto en lavanda/gris claro.
- Refuerza credibilidad sin competir con el CTA.

Especificación aproximada del texto:

```css
.award-text {
  font-family: 'Inter', 'Montserrat', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #C7B3D7;
}
```

---

## 5. Composición y layout

La landing usa una composición hero de dos columnas:

| Zona | Contenido | Función |
|---|---|---|
| Izquierda | Copy, CTA y sello | Conversión, explicación y confianza. |
| Derecha | Ilustración geométrica | Identidad, emoción y recordación visual. |

### Estructura visual

- El contenido principal está alineado a la izquierda.
- El bloque textual ocupa aproximadamente el 50% izquierdo de la pantalla.
- La ilustración ocupa el área central-derecha.
- El fondo tiene patrones diagonales en el extremo derecho, creando profundidad.
- Hay mucho espacio negativo, lo que mejora la lectura y evita saturación.

### Espaciado aproximado

```css
.hero {
  min-height: 100vh;
  background-color: #672E91;
  padding-left: 10.5vw;
  padding-right: 8vw;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
}
```

El bloque de texto se encuentra visualmente centrado en altura, pero con un peso hacia la parte superior-media. El sello queda en la zona inferior del bloque izquierdo, funcionando como elemento de cierre y credibilidad.

---

## 6. Sistema gráfico

El elemento gráfico principal es una figura radial geométrica. Está construida con formas simétricas que combinan triángulos, trapecios, rombos y polígonos.

### Lecturas visuales posibles

La figura puede interpretarse como:

- Una flor geométrica.
- Una estrella.
- Una red de conexiones.
- Un símbolo de comunidad.
- Un módulo abstracto de avance y expansión.

### Función dentro de la identidad

La ilustración no es decorativa únicamente. Representa la idea de conexión entre personas, oportunidades y trayectorias profesionales. Su simetría da sensación de estructura, mientras que sus colores vivos aportan energía y juventud.

### Estilo de ilustración

- Geométrico.
- Vectorial.
- Simétrico.
- De alto contraste.
- Sin textura fotográfica.
- Sin degradados complejos visibles.
- Con sensación de volumen mediante superposición de planos de color.

### Paleta aplicada en ilustración

```css
--shape-cyan: #1BC2C9;
--shape-blue-cyan: #0DA1CE;
--shape-yellow: #F8CA07;
--shape-magenta: #E2038D;
--shape-deep-magenta: #A3188E;
--shape-purple-shadow: #512C6D;
```

---

## 7. Fondo y patrones

El fondo no es completamente plano. Tiene un sistema de franjas diagonales en el lado derecho.

Características:

- Franjas anchas con dirección diagonal/vertical inclinada.
- Tonos de morado más claros y más oscuros.
- Baja opacidad relativa.
- Ubicación concentrada en el tercio derecho.
- Ayuda a dirigir la mirada hacia la ilustración.

Este patrón mantiene la identidad visual activa sin afectar la legibilidad del texto.

Especificación conceptual:

```css
.hero-background {
  background-color: #672E91;
}

.hero-background::after {
  content: '';
  position: absolute;
  right: 0;
  top: 0;
  width: 35%;
  height: 100%;
  background: repeating-linear-gradient(
    75deg,
    rgba(255,255,255,0.04) 0,
    rgba(255,255,255,0.04) 70px,
    transparent 70px,
    transparent 140px
  );
}
```

---

## 8. Personalidad visual

La personalidad de la landing se puede describir como:

- **Optimista:** por el amarillo y el mensaje “Adelante”.
- **Institucional:** por el morado dominante y el sello de premio.
- **Profesional:** por la composición limpia y la jerarquía clara.
- **Juvenil:** por la paleta vibrante y la ilustración abstracta.
- **Digital:** por el estilo vectorial y la interfaz tipo plataforma.
- **Social:** por la referencia a Fundación Forward Costa Rica y el enfoque en egresados.

---

## 9. Accesibilidad y contraste

La landing tiene buen contraste general:

- Blanco sobre morado: alto contraste.
- Amarillo sobre morado: alto impacto visual.
- Negro sobre amarillo en el botón: muy legible.
- Texto descriptivo en lavanda claro sobre morado: legible, aunque conviene validar contraste exacto en implementación.

Recomendaciones:

- Mantener el texto descriptivo en un tono claro, idealmente no más oscuro que `#E8DFEE`.
- Evitar usar amarillo para párrafos largos; funciona mejor como acento.
- Mantener el CTA con texto negro o casi negro.
- Asegurar que el botón tenga altura mínima de 44 px para accesibilidad táctil.

---

## 10. Guía rápida de implementación visual

### Variables CSS sugeridas

```css
:root {
  --color-purple-main: #672E91;
  --color-purple-medium: #75469D;
  --color-purple-light: #8E65AE;
  --color-purple-dark: #512C6D;

  --color-yellow-main: #F8CA07;
  --color-yellow-deep: #DDAA20;

  --color-cyan-main: #1BC2C9;
  --color-cyan-blue: #0DA1CE;

  --color-magenta-main: #E2038D;
  --color-magenta-deep: #A3188E;

  --color-white: #FFFFFF;
  --color-text-soft: #E8DFEE;
  --color-text-muted: #C7B3D7;
  --color-black: #111111;
}
```

### Tipografías sugeridas

Opción recomendada si se quiere replicar el look de forma cercana:

```css
--font-display: 'Barlow Condensed', 'Roboto Condensed', 'Arial Narrow', sans-serif;
--font-body: 'Inter', 'Montserrat', 'Roboto', sans-serif;
```

Opción más editorial y fuerte:

```css
--font-display: 'Anton', 'Oswald', sans-serif;
--font-body: 'Inter', sans-serif;
```

Opción más institucional y flexible:

```css
--font-display: 'Roboto Condensed', sans-serif;
--font-body: 'Roboto', sans-serif;
```

---

## 11. Diagnóstico de diseño

La landing funciona porque concentra la atención en tres puntos claros:

1. **La promesa:** “Adelante.”
2. **La explicación:** plataforma de empleabilidad para egresados.
3. **La acción:** iniciar sesión.

La identidad visual está bien resuelta porque el sistema cromático separa claramente funciones: el morado identifica, el amarillo acciona, el blanco informa y la ilustración aporta memorabilidad.

El resultado es una landing con presencia fuerte, legible, moderna y alineada con una plataforma de impacto social enfocada en empleabilidad.

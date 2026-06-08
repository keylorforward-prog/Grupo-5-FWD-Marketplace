# GUÍA COMPLETA — Modelo de datos en Sequelize

### Plataforma que conecta Estudiantes con Empresas

> Esta guía explica, paso a paso, cómo se implementó **todo el diagrama** que entregaste en **Sequelize** (ORM de Node.js), incluyendo los dos campos que pediste agregar:
> - **`cedula`** en la tabla `USUARIO` (identificación única).
> - **`sede_graduacion`** en la tabla `PERFIL_ESTUDIANTE` (sede/campus donde el estudiante se graduó).
>
> Está escrita para que **una persona** pueda seguirla sin saber Sequelize, y para que **otra IA** pueda entender el modelo completo, sus decisiones de diseño y cómo extenderlo. No se cambió nada del diagrama: solo se agregaron los dos campos solicitados.

---

## ÍNDICE

1. [¿Qué es esto y qué hace la plataforma?](#1)
2. [Las 20 entidades del diagrama](#2)
3. [Lo que se AGREGÓ (cédula y sede de graduación)](#3)
4. [Requisitos previos](#4)
5. [Paso 1 — Crear el proyecto e instalar Sequelize](#5)
6. [Paso 2 — Estructura de carpetas](#6)
7. [Paso 3 — Conexión a la base de datos](#7)
8. [Conceptos de Sequelize que vas a usar](#8)
9. [Paso 4 — El patrón de un modelo (explicado con USUARIO)](#9)
10. [Mapa de cada tabla a tipos de Sequelize](#10)
11. [Paso 5 — index.js y TODAS las relaciones](#11)
12. [La relación Muchos-a-Muchos explicada](#12)
13. [El campo VIRTUAL `tipo_plazo`](#13)
14. [Paso 6 — Crear las tablas (sync vs migraciones)](#14)
15. [Paso 7 — Datos iniciales (seeders)](#15)
16. [Paso 8 — Cómo ejecutar todo](#16)
17. [Paso 9 — Ejemplos de consultas (CRUD, include, N:M)](#17)
18. [Decisiones de diseño y casos especiales](#18)
19. [Mapa de relaciones (resumen)](#19)
20. [Sección para la otra IA](#20)
21. [Checklist final](#21)

---

<a name="1"></a>
## 1. ¿Qué es esto y qué hace la plataforma?

Es el modelo de datos de una plataforma tipo *marketplace* donde:

- Los **EMPRESARIOS** publican **PROPUESTAS** (proyectos que necesitan desarrollar).
- Los **ESTUDIANTES** se **POSTULAN** a esas propuestas.
- Cuando una postulación avanza, nace un **PROYECTO** real con **ENTREGABLES**, **EVALUACIONES** y **PAGOS**.
- Hay **CONVERSACIONES**/**MENSAJES**, **NOTIFICACIONES**, **REPORTES** y **OFERTAS** económicas.
- Existen **CATÁLOGOS** maestros de tecnologías y de sectores.
- Todo gira alrededor de la tabla **USUARIO**, que puede tener rol `ADMIN`, `ESTUDIANTE` o `EMPRESARIO`.

**Sequelize** es la herramienta (un ORM = *Object Relational Mapper*) que traduce estas tablas a "objetos" de JavaScript. En lugar de escribir SQL a mano, escribes código JS y Sequelize genera el SQL por ti.

---

<a name="2"></a>
## 2. Las 20 entidades del diagrama

| # | Tabla | Para qué sirve |
|---|-------|----------------|
| 1 | `usuario` | Persona del sistema (admin/estudiante/empresario) |
| 2 | `perfil_estudiante` | Datos del usuario cuando es estudiante |
| 3 | `curriculum` | CV del estudiante (1 a 1 con su perfil) |
| 4 | `historial_proyecto_estudiante` | Proyectos pasados del estudiante |
| 5 | `perfil_empresario` | Datos del usuario cuando es empresario |
| 6 | `propuesta` | Proyecto/trabajo que publica el empresario |
| 7 | `catalogo_tecnologia` | Lista maestra de tecnologías |
| 8 | `tecnologia_propuesta` | Tabla puente Propuesta ↔ Tecnología (N:M) |
| 9 | `historial_proyecto_empresa` | Proyectos pasados de la empresa |
| 10 | `postulacion` | Estudiante aplica a una propuesta |
| 11 | `conversacion` | Hilo de chat ligado a una postulación |
| 12 | `mensaje` | Mensajes dentro de una conversación |
| 13 | `proyecto_plataforma` | Proyecto real nacido de una propuesta |
| 14 | `entregable` | Entregas de un proyecto |
| 15 | `evaluacion` | Empresario califica un entregable (1-5) |
| 16 | `pago` | Pagos de un proyecto |
| 17 | `reporte` | Quejas/denuncias |
| 18 | `notificacion` | Avisos al usuario |
| 19 | `oferta` | Oferta económica sobre una propuesta |
| 20 | `catalogo_sector` | Lista maestra de sectores |

---

<a name="3"></a>
## 3. Lo que se AGREGÓ (lo demás quedó IGUAL al diagrama)

### 3.1 `cedula` en `USUARIO`
```js
cedula: {
  type: DataTypes.STRING(30),
  allowNull: false,
  unique: true,            // no se repite entre usuarios
  comment: 'Identificación nacional / cédula del usuario (única)'
}
```
Se puso **única** porque dos usuarios no pueden tener la misma cédula. Es un texto (`STRING`) y no número, porque las cédulas pueden llevar guiones o ceros a la izquierda.

### 3.2 `sede_graduacion` en `PERFIL_ESTUDIANTE`
```js
sede_graduacion: {
  type: DataTypes.STRING(200),
  allowNull: true,
  comment: 'Sede / campus de la institución donde el estudiante se graduó'
}
```
Va en `PERFIL_ESTUDIANTE` porque es un dato del estudiante. Es `allowNull: true` (opcional) porque un estudiante recién registrado podría no haberlo llenado todavía.

> Nada más fue modificado. Todas las demás columnas, tipos y relaciones provienen tal cual del diagrama.

---

<a name="4"></a>
## 4. Requisitos previos

- **Node.js 18 o superior** instalado (`node -v` para comprobar).
- Un motor de base de datos: **MySQL** o **PostgreSQL** (el proyecto soporta ambos cambiando una variable).
- Conocimientos básicos de la terminal.

---

<a name="5"></a>
## 5. Paso 1 — Crear el proyecto e instalar Sequelize

Si partieras de cero, harías esto (el proyecto ya viene hecho):

```bash
mkdir plataforma && cd plataforma
npm init -y

# Sequelize + driver de la base de datos
npm install sequelize mysql2     # para MySQL
# o:  npm install sequelize pg pg-hstore   # para PostgreSQL

# Para leer variables de entorno
npm install dotenv
```

En este proyecto ya hay un `package.json`. Solo ejecuta:
```bash
npm install
```

---

<a name="6"></a>
## 6. Paso 2 — Estructura de carpetas

```
proyecto-plataforma/
├── package.json              # dependencias y scripts
├── .env.example              # plantilla de credenciales (cópiala a .env)
├── .gitignore
├── config/
│   └── database.js           # crea la conexión Sequelize
├── models/
│   ├── index.js              # carga TODOS los modelos + relaciones  ← clave
│   ├── usuario.js
│   ├── perfilEstudiante.js
│   ├── curriculum.js
│   ├── ... (un archivo por tabla, 20 en total)
│   └── catalogoSector.js
├── seeders/
│   └── catalogos.js          # datos iniciales de catálogos
├── sync.js                   # crea/actualiza las tablas
├── ejemplos.js               # ejemplos de uso (CRUD)
└── test_modelos.js           # prueba que todo carga bien
```

**Idea central:** cada tabla del diagrama = un archivo en `models/`. El archivo `models/index.js` los une y define cómo se relacionan.

---

<a name="7"></a>
## 7. Paso 3 — Conexión a la base de datos

### 7.1 Variables de entorno
Copia `.env.example` a `.env` y rellena tus datos:
```bash
cp .env.example .env
```
```env
DB_DIALECT=mysql
DB_HOST=localhost
DB_PORT=3306
DB_NAME=plataforma
DB_USER=root
DB_PASSWORD=tu_password
DB_LOGGING=true
```

### 7.2 `config/database.js`
Este archivo crea **una sola instancia** de Sequelize que todos los modelos comparten:

```js
require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: process.env.DB_LOGGING === 'true' ? console.log : false,
    define: {
      freezeTableName: true, // no pluraliza nombres de tabla
      underscored: true,     // columnas en snake_case
      timestamps: false      // manejamos las fechas nosotros
    }
  }
);

module.exports = sequelize;
```

**Qué hace cada opción de `define` (aplica a todos los modelos):**
- `freezeTableName: true` → la tabla se llama exactamente como tú digas (no la convierte a plural).
- `underscored: true` → columnas con guión bajo (`fecha_registro` en vez de `fechaRegistro`).
- `timestamps: false` → Sequelize por defecto agrega `createdAt`/`updatedAt`; lo apagamos porque nuestras tablas ya tienen sus propias fechas.

---

<a name="8"></a>
## 8. Conceptos de Sequelize que vas a usar

Antes de ver los modelos, estos son los "ladrillos":

### Tipos de datos (`DataTypes`)
| Diagrama dice... | En Sequelize |
|------------------|--------------|
| Texto corto | `DataTypes.STRING(n)` |
| Texto largo (TEXT) | `DataTypes.TEXT` |
| Número entero / ID | `DataTypes.INTEGER` |
| Decimal (dinero, reputación) | `DataTypes.DECIMAL(precisión, decimales)` |
| Fecha y hora | `DataTypes.DATE` |
| Solo fecha (sin hora) | `DataTypes.DATEONLY` |
| SI/NO | `DataTypes.BOOLEAN` o `DataTypes.ENUM('SI','NO')` |
| Lista cerrada de valores | `DataTypes.ENUM('A','B','C')` |
| Calculado (no se guarda) | `DataTypes.VIRTUAL` |

### Propiedades de cada columna
- `primaryKey: true` → clave primaria (PK del diagrama).
- `autoIncrement: true` → el ID se genera solo (1, 2, 3...).
- `allowNull: false` → obligatorio (NOT NULL).
- `unique: true` → no se repite (el "ÚNICO" del diagrama).
- `defaultValue` → valor por defecto si no se especifica.
- `references` → indica que es clave foránea (FK) y a qué tabla apunta.
- `validate` → reglas (ej. `min`, `max`, `isEmail`).

### Relaciones (associations)
- `belongsTo` → "yo tengo la columna FK". Lo usa el lado **hijo**.
- `hasOne` / `hasMany` → lo usa el lado **padre**.
- `belongsToMany` → relación **muchos a muchos** (necesita tabla puente).
- `as` → un alias para poder incluir/anidar datos en consultas.

> **Regla de oro:** quien tiene la columna `id_xxx` (la FK) usa `belongsTo`. El otro lado usa `hasOne`/`hasMany`.

---

<a name="9"></a>
## 9. Paso 4 — El patrón de un modelo (explicado con USUARIO)

Cada archivo de modelo exporta **una función** que recibe `(sequelize, DataTypes)` y devuelve el modelo. Este patrón permite que `index.js` controle el orden de carga.

```js
// models/usuario.js
module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define('Usuario', {
    id_usuario: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre:     { type: DataTypes.STRING(150), allowNull: false },

    // CAMPO AGREGADO
    cedula:     { type: DataTypes.STRING(30), allowNull: false, unique: true },

    correo:     { type: DataTypes.STRING(150), allowNull: false, unique: true,
                  validate: { isEmail: true } },
    contrasena_hash: { type: DataTypes.STRING(255), allowNull: false },
    rol:        { type: DataTypes.ENUM('ADMIN','ESTUDIANTE','EMPRESARIO'), allowNull: false },
    foto_perfil:    { type: DataTypes.STRING(500), allowNull: true },
    estado_cuenta:  { type: DataTypes.ENUM('ACTIVA','PENDIENTE','SUSPENDIDA'),
                      allowNull: false, defaultValue: 'PENDIENTE' },
    fecha_registro: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    ultimo_acceso:  { type: DataTypes.DATE, allowNull: true },
    telefono_whatsapp: { type: DataTypes.STRING(30), allowNull: true },

    // Solo ADMIN (nullable)
    cargo:            { type: DataTypes.STRING(100), allowNull: true },
    fecha_asignacion: { type: DataTypes.DATE, allowNull: true },
    estado_admin:     { type: DataTypes.ENUM('ACTIVO','INACTIVO'), allowNull: true },

    // Solo EMPRESARIO (nullable)
    tipo_empresa:     { type: DataTypes.STRING(100), allowNull: true }
  }, {
    tableName: 'usuario'
  });

  return Usuario;
};
```

**Por qué los campos de ADMIN y EMPRESARIO son `allowNull: true`:** en el diagrama dicen "Solo para ADMIN/EMPRESARIO (nullable)". Un mismo usuario tiene un solo rol, así que los campos del otro rol quedan vacíos. Por eso son opcionales.

Todos los demás modelos siguen exactamente este mismo patrón. (El proyecto trae los 20 archivos completos.)

---

<a name="10"></a>
## 10. Mapa de cada tabla a tipos de Sequelize

Resumen de los puntos más importantes de cada tabla:

- **usuario**: PK `id_usuario`; `correo` y **`cedula`** únicos; `rol`, `estado_cuenta`, `estado_admin` son ENUM; campos de admin/empresario nullable.
- **perfil_estudiante**: PK `id_perfil_estudiante`; FK `id_usuario` **único** (1 a 1); **`sede_graduacion`** agregado; `estado_verificacion` ENUM; `reputacion_total` DECIMAL(4,2).
- **curriculum**: PK `id_curriculum`; FK `id_perfil_estudiante` **único** (1 a 1); campos largos en TEXT.
- **historial_proyecto_estudiante**: FK `id_perfil_estudiante`; `tipo` ENUM(GITHUB, PLATAFORMA); fechas DATEONLY.
- **perfil_empresario**: FK `id_usuario` **único**; `sector` como texto (ver §18).
- **propuesta**: FK `id_perfil_empresario`; `usar_ia` ENUM(SI,NO); `plazo_dias` INTEGER validado a 5/15/30; **`tipo_plazo` VIRTUAL**; presupuestos DECIMAL; `estado` ENUM.
- **catalogo_tecnologia**: catálogo simple.
- **tecnologia_propuesta**: tabla puente N:M con índice único (`id_propuesta`,`id_tecnologia`).
- **historial_proyecto_empresa**: FK `id_perfil_empresario`.
- **postulacion**: FK `id_propuesta` + `id_perfil_estudiante`; `estado` ENUM; índice único (no postularse 2 veces).
- **conversacion**: FK `id_postulacion` + `id_usuario_emisor`; `leido` BOOLEAN.
- **mensaje**: FK `id_conversacion` + `id_usuario_emisor`.
- **proyecto_plataforma**: FK `id_propuesta` **único** (1 a 1); `estado` ENUM.
- **entregable**: FK `id_proyecto`; `tipo` y `estado` ENUM.
- **evaluacion**: FK `id_entregable` + `id_perfil_empresario`; `puntuacion` 1-5 con `validate`.
- **pago**: FK `id_proyecto`; `monto` DECIMAL; `estado` ENUM.
- **reporte**: FK `id_proyecto` + `id_usuario`; `tipo` y `estado` ENUM.
- **notificacion**: FK `id_usuario`; `leido` BOOLEAN.
- **oferta**: FK `id_perfil_estudiante` + `id_propuesta` + `id_usuario`; columna `propuesta` (texto) + `cantidad` DECIMAL; `estado` ENUM.
- **catalogo_sector**: catálogo simple.

---

<a name="11"></a>
## 11. Paso 5 — `index.js` y TODAS las relaciones

`models/index.js` hace 4 cosas:

1. Importa la conexión.
2. Inicializa cada modelo: `require('./usuario')(sequelize, DataTypes)`.
3. Define **todas** las relaciones.
4. Exporta todo en un objeto `db`.

Ejemplo de cómo se inicializa y se relaciona (extracto):

```js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario          = require('./usuario')(sequelize, DataTypes);
const PerfilEstudiante = require('./perfilEstudiante')(sequelize, DataTypes);
// ...los 20 modelos...

// USUARIO 1 — 0..1 PERFIL_ESTUDIANTE
Usuario.hasOne(PerfilEstudiante,   { foreignKey: 'id_usuario', as: 'perfilEstudiante' });
PerfilEstudiante.belongsTo(Usuario,{ foreignKey: 'id_usuario', as: 'usuario' });
```

### Tabla de TODAS las relaciones implementadas

| Relación (diagrama) | Tipo | Código |
|---------------------|------|--------|
| Usuario → PerfilEstudiante | 1 a 0..1 | `hasOne` / `belongsTo` |
| Usuario → PerfilEmpresario | 1 a 0..1 | `hasOne` / `belongsTo` |
| PerfilEstudiante → Curriculum | 1 a 1 | `hasOne` / `belongsTo` |
| PerfilEstudiante → HistorialProyectoEstudiante | 1 a N | `hasMany` / `belongsTo` |
| PerfilEmpresario → Propuesta | 1 a N | `hasMany` / `belongsTo` |
| PerfilEmpresario → HistorialProyectoEmpresa | 1 a N | `hasMany` / `belongsTo` |
| Propuesta ↔ CatalogoTecnologia | N a M | `belongsToMany` (puente `tecnologia_propuesta`) |
| Propuesta → Postulacion | 1 a N | `hasMany` / `belongsTo` |
| PerfilEstudiante → Postulacion | 1 a N | `hasMany` / `belongsTo` |
| Propuesta → ProyectoPlataforma | 1 a 1 | `hasOne` / `belongsTo` |
| Postulacion → Conversacion | 1 a N | `hasMany` / `belongsTo` |
| Usuario → Conversacion (emisor) | 1 a N | `hasMany` / `belongsTo` |
| Conversacion → Mensaje | 1 a N | `hasMany` / `belongsTo` |
| Usuario → Mensaje (emisor) | 1 a N | `hasMany` / `belongsTo` |
| ProyectoPlataforma → Entregable | 1 a N | `hasMany` / `belongsTo` |
| Entregable → Evaluacion | 1 a N | `hasMany` / `belongsTo` |
| PerfilEmpresario → Evaluacion | 1 a N | `hasMany` / `belongsTo` |
| ProyectoPlataforma → Pago | 1 a N | `hasMany` / `belongsTo` |
| ProyectoPlataforma → Reporte | 1 a N | `hasMany` / `belongsTo` |
| Usuario → Reporte | 1 a N | `hasMany` / `belongsTo` |
| Usuario → Notificacion | 1 a N | `hasMany` / `belongsTo` |
| PerfilEstudiante → Oferta | 1 a N | `hasMany` / `belongsTo` |
| Propuesta → Oferta | 1 a N | `hasMany` / `belongsTo (as: propuestaRef)` |
| Usuario → Oferta | 1 a N | `hasMany` / `belongsTo` |

> **Importante (colisión resuelta):** la tabla `OFERTA` tiene una **columna** llamada `propuesta` (texto, del diagrama). Por eso la **relación** Oferta→Propuesta NO puede llamarse igual; se le puso el alias `propuestaRef`. Ver §18.

---

<a name="12"></a>
## 12. La relación Muchos-a-Muchos explicada

En el diagrama, `PROPUESTA` se conecta con `CATALOGO_TECNOLOGIA` a través de la tabla puente `TECNOLOGIA_PROPUESTA`. Esto es **muchos a muchos**: una propuesta usa varias tecnologías, y una tecnología aparece en varias propuestas.

```js
Propuesta.belongsToMany(CatalogoTecnologia, {
  through: TecnologiaPropuesta,   // la tabla puente
  foreignKey: 'id_propuesta',
  otherKey: 'id_tecnologia',
  as: 'tecnologias'
});
CatalogoTecnologia.belongsToMany(Propuesta, {
  through: TecnologiaPropuesta,
  foreignKey: 'id_tecnologia',
  otherKey: 'id_propuesta',
  as: 'propuestas'
});
```

Esto te da métodos automáticos:
```js
await propuesta.addTecnologias([1, 2]);      // asociar tecnologías 1 y 2
await propuesta.getTecnologias();            // obtener sus tecnologías
await propuesta.removeTecnologia(2);         // quitar la tecnología 2
```

---

<a name="13"></a>
## 13. El campo VIRTUAL `tipo_plazo`

El diagrama dice: *"El sistema determina automáticamente el tipo de plazo según los días"* (5=CORTO, 15=MEDIANO, 30=LARGO). Esto NO es una columna que se guarda: se **calcula** al leer. Para eso existe `DataTypes.VIRTUAL`:

```js
plazo_dias: {
  type: DataTypes.INTEGER,
  allowNull: false,
  validate: { isIn: [[5, 15, 30]] }   // solo 5, 15 o 30
},
tipo_plazo: {
  type: DataTypes.VIRTUAL,
  get() {
    const dias = this.getDataValue('plazo_dias');
    if (dias === 5)  return 'CORTO PLAZO';
    if (dias === 15) return 'MEDIANO PLAZO';
    if (dias === 30) return 'LARGO PLAZO';
    return null;
  }
}
```

Resultado (verificado): si guardas `plazo_dias = 15`, al leer `propuesta.tipo_plazo` obtienes `"MEDIANO PLAZO"` sin ocupar espacio en la base de datos.

---

<a name="14"></a>
## 14. Paso 6 — Crear las tablas (sync vs migraciones)

### Opción rápida (desarrollo): `sync.js`
```js
const db = require('./models');
(async () => {
  await db.sequelize.authenticate();        // prueba la conexión
  await db.sequelize.sync({ alter: true });  // crea/ajusta tablas
  console.log('Tablas listas');
  process.exit(0);
})();
```

Modos de `sync`:
- `sync()` → crea solo lo que falta.
- `sync({ alter: true })` → ajusta las tablas existentes a tus modelos (cómodo en desarrollo).
- `sync({ force: true })` → **BORRA y recrea TODO** (pierdes los datos; úsalo solo para empezar de cero).

### Opción profesional (producción): **migraciones**
En producción **no se usa `sync`** porque puede dañar datos. Se usan migraciones con `sequelize-cli`:
```bash
npm install --save-dev sequelize-cli
npx sequelize-cli init           # crea carpetas migrations/, seeders/, config/
npx sequelize-cli migration:generate --name crear-usuario
# editas el archivo de migración (up/down) y luego:
npx sequelize-cli db:migrate
```
Las migraciones son archivos versionados que describen cada cambio del esquema, de forma controlada y reversible.

---

<a name="15"></a>
## 15. Paso 7 — Datos iniciales (seeders)

`seeders/catalogos.js` llena las tablas de catálogo:
```js
await db.CatalogoTecnologia.bulkCreate([
  { nombre: 'JavaScript', categoria: 'Lenguaje',  descripcion: '...' },
  { nombre: 'React',      categoria: 'Frontend',  descripcion: '...' }
], { ignoreDuplicates: true });
```
`bulkCreate` inserta varios registros de una vez; `ignoreDuplicates` evita errores si lo corres más de una vez.

---

<a name="16"></a>
## 16. Paso 8 — Cómo ejecutar todo

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar credenciales
cp .env.example .env      # y edita .env con tus datos

# 3. Crear las tablas
npm run sync              # ejecuta node sync.js

# 4. (Opcional) Cargar catálogos
npm run seed              # ejecuta node seeders/catalogos.js

# 5. (Opcional) Verificar que los modelos cargan bien
node test_modelos.js
```

---

<a name="17"></a>
## 17. Paso 9 — Ejemplos de consultas

### Crear (con los campos nuevos)
```js
const usuario = await db.Usuario.create({
  nombre: 'Ana Pérez',
  cedula: '1-1234-5678',          // campo agregado
  correo: 'ana@example.com',
  contrasena_hash: 'hash_seguro',
  rol: 'ESTUDIANTE'
});

const perfil = await db.PerfilEstudiante.create({
  id_usuario: usuario.id_usuario,
  titulo_fwd: 'Ingeniería en Software',
  sede_graduacion: 'Sede Central - San José'   // campo agregado
});
```

### Leer con relaciones (eager loading con `include`)
```js
const estudiante = await db.PerfilEstudiante.findByPk(1, {
  include: [
    { model: db.Usuario, as: 'usuario' },
    { model: db.Curriculum, as: 'curriculum' },
    { model: db.HistorialProyectoEstudiante, as: 'historialProyectos' }
  ]
});
console.log(estudiante.usuario.nombre, estudiante.sede_graduacion);
```

### Propuesta con tecnologías (N:M) y plazo calculado
```js
const propuesta = await db.Propuesta.create({
  id_perfil_empresario: 1,
  titulo: 'App de delivery',
  plazo_dias: 15,           // tipo_plazo será 'MEDIANO PLAZO'
  usar_ia: 'SI'
});
await propuesta.addTecnologias([1, 2]);
console.log(propuesta.tipo_plazo);  // 'MEDIANO PLAZO'
```

### Filtrar (where) y actualizar
```js
const { Op } = require('sequelize');
const activas = await db.Propuesta.findAll({
  where: { estado: 'ACTIVA', presupuesto_max: { [Op.gte]: 1000 } }
});
await usuario.update({ ultimo_acceso: new Date() });
```

### Borrar
```js
await usuario.destroy();
```

---

<a name="18"></a>
## 18. Decisiones de diseño y casos especiales

1. **Colisión `OFERTA.propuesta`:** la tabla `oferta` tiene una columna `propuesta` (texto) Y una relación con la tabla `PROPUESTA`. Sequelize no permite que un atributo y una asociación se llamen igual, así que la **asociación** usa el alias `propuestaRef`. La **columna** del diagrama se conserva intacta. *(Esto fue detectado y corregido durante las pruebas.)*

2. **`sector` vs `catalogo_sector`:** el diagrama muestra `sector` como un campo de texto en `perfil_empresario` y una línea **punteada (opcional)** hacia `catalogo_sector`. Se respetó el diagrama: `sector` quedó como texto y `catalogo_sector` como tabla independiente. Si en el futuro quisieras enlazarlos por clave foránea, agregarías `id_sector` a `perfil_empresario` y una relación `CatalogoSector.hasMany(PerfilEmpresario)`.

3. **`SI/NO` → ENUM o BOOLEAN:** `usar_ia (SI/NO)` se modeló como `ENUM('SI','NO')` para ser fiel al diagrama. Los campos `leido (SI/NO)` se modelaron como `BOOLEAN` porque encajan mejor con `true/false`. Ambas opciones son válidas.

4. **Fechas:** se usó `DATE` (fecha+hora) para sellos de tiempo y `DATEONLY` para fechas de inicio/fin de proyectos donde la hora no importa.

5. **`reputacion_total`:** `DECIMAL(4,2)` permite valores como `4.85` (hasta 99.99).

6. **Índices únicos compuestos:** en `postulacion` se evita que un estudiante se postule dos veces a la misma propuesta; en `tecnologia_propuesta` se evita duplicar la misma tecnología en la misma propuesta.

---

<a name="19"></a>
## 19. Mapa de relaciones (resumen visual en texto)

```
USUARIO
 ├─(0..1)─ PERFIL_ESTUDIANTE
 │           ├─(1:1)─ CURRICULUM
 │           ├─(1:N)─ HISTORIAL_PROYECTO_ESTUDIANTE
 │           ├─(1:N)─ POSTULACION
 │           └─(1:N)─ OFERTA
 ├─(0..1)─ PERFIL_EMPRESARIO
 │           ├─(1:N)─ PROPUESTA
 │           │          ├─(N:M)─ CATALOGO_TECNOLOGIA  (vía TECNOLOGIA_PROPUESTA)
 │           │          ├─(1:N)─ POSTULACION
 │           │          ├─(1:1)─ PROYECTO_PLATAFORMA
 │           │          │          ├─(1:N)─ ENTREGABLE ──(1:N)── EVALUACION
 │           │          │          ├─(1:N)─ PAGO
 │           │          │          └─(1:N)─ REPORTE
 │           │          └─(1:N)─ OFERTA
 │           ├─(1:N)─ HISTORIAL_PROYECTO_EMPRESA
 │           └─(1:N)─ EVALUACION
 ├─(1:N)─ NOTIFICACION
 ├─(1:N)─ REPORTE
 ├─(1:N)─ CONVERSACION (como emisor)
 └─(1:N)─ MENSAJE (como emisor)

POSTULACION ─(1:N)─ CONVERSACION ─(1:N)─ MENSAJE

CATALOGO_SECTOR   (catálogo independiente, relación opcional con PERFIL_EMPRESARIO)
```

---

<a name="20"></a>
## 20. Sección para la otra IA

**Contexto que necesitas para razonar sobre este proyecto:**

- ORM: **Sequelize v6**, dialecto MySQL/PostgreSQL. Patrón de modelos: *factory function* `(sequelize, DataTypes) => Model`. Todos los modelos se inicializan y se asocian en `models/index.js`, que exporta un objeto `db` con todos los modelos + la instancia `sequelize`.
- Convenciones globales (`config/database.js` → `define`): `freezeTableName: true`, `underscored: true`, `timestamps: false`. Por eso **no** hay columnas `createdAt`/`updatedAt`; las fechas son explícitas (`fecha_registro`, etc.).
- Nombres: la **clase** del modelo está en PascalCase (`PerfilEstudiante`), la **tabla** en snake_case (`perfil_estudiante`), y las **columnas** en snake_case tal cual el diagrama.
- Las claves foráneas mantienen el nombre del diagrama (`id_usuario`, `id_propuesta`, etc.); cada asociación las declara con `foreignKey`.
- **Regla de asociación:** el modelo con la columna FK usa `belongsTo`; el otro usa `hasOne`/`hasMany`. La N:M usa `belongsToMany` con `through: TecnologiaPropuesta`.
- **Trampas conocidas:** (a) `Oferta` tiene una columna `propuesta` que colisiona con la asociación → el alias es `propuestaRef`; (b) `Propuesta.tipo_plazo` es `VIRTUAL` (no existe en la BD, se calcula desde `plazo_dias`).
- **Campos agregados respecto al diagrama original:** `usuario.cedula` (STRING único) y `perfil_estudiante.sede_graduacion` (STRING opcional). Todo lo demás es 1:1 con el diagrama.

**Cómo extender el modelo (receta):**
1. Crea `models/nuevoModelo.js` con el patrón factory.
2. Impórtalo e inicialízalo en `models/index.js`.
3. Declara sus asociaciones (recuerda la regla FK → `belongsTo`).
4. Agrégalo al objeto `db` exportado.
5. Corre `npm run sync` (dev) o genera una migración (prod).

---

<a name="21"></a>
## 21. Checklist final

- [x] 20 entidades del diagrama implementadas como modelos Sequelize.
- [x] Todas las relaciones (1:1, 1:N, N:M) declaradas en `index.js`.
- [x] Campo **`cedula`** agregado a `usuario` (único).
- [x] Campo **`sede_graduacion`** agregado a `perfil_estudiante`.
- [x] ENUMs, DECIMALes, fechas, validaciones y campo VIRTUAL `tipo_plazo`.
- [x] Conexión por `.env`, script `sync`, seeders y ejemplos de consultas.
- [x] Verificado con `test_modelos.js` (21 comprobaciones, 0 fallas).

---

### Cómo correrlo de nuevo, en una línea
```bash
npm install && cp .env.example .env   # edita .env, luego:
npm run sync && npm run seed
```

Fin de la guía.

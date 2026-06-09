# 🏗️ Arquitectura e Infraestructura de FWD Marketplace

Este documento detalla la configuración técnica del proyecto **FWD Marketplace**, la cual utiliza una arquitectura híbrida combinando los mejores servicios de AWS y Supabase.

---

## 1. Base de Datos: Supabase (PostgreSQL)

El proyecto utiliza **Supabase** como proveedor de base de datos relacional (PostgreSQL).

### ⚙️ Configuración Actual
- **Driver / ORM:** Utilizamos `Sequelize` junto con los paquetes `pg` y `pg-hstore` en Node.js.
- **Conexión:** La conexión se establece a través de un **Connection Pooler** (Supavisor) con soporte para redes IPv4. Esto se definió explícitamente usando la URL de Supabase terminada en `.pooler.supabase.com:6543`.
- **SSL:** Requerido y activado en la configuración de Sequelize (`dialectOptions.ssl.require = true`).

### 📂 Archivos Clave
- **`.env`**: Contiene la variable `DATABASE_URL` que almacena la URL segura de conexión. *(¡Nunca subir este archivo a GitHub!)*
- **`Backend/Config/db.js`**: Inicializa la instancia de Sequelize usando el `DATABASE_URL` para la ejecución general de la aplicación.
- **`Backend/Config/sequelize-config.js`**: Archivo de configuración que le permite a la herramienta de terminal (`sequelize-cli`) conectarse a Supabase al momento de correr migraciones (`npx sequelize-cli db:migrate`) o seeders.

### ✅ Estado
- **Comprobado:** La conexión hacia Supabase fue probada exitosamente (`✅ Connection OK`). El Backend está perfectamente enlazado con la nube.

---

## 2. Almacenamiento de Archivos: AWS S3

Dado que las bases de datos no están hechas para guardar archivos pesados, se utiliza **Amazon Simple Storage Service (S3)** para guardar y distribuir las imágenes de los productos o los avatares de los usuarios.

### ⚙️ Configuración Actual
- **SDK:** Utilizamos el SDK oficial `@aws-sdk/client-s3` (Versión 3).
- **Bucket:** Se creó un contenedor de almacenamiento (bucket) llamado `marketplacefwd` en la región `us-east-2`.

### 📂 Archivos Clave
- **`.env`**: Almacena las claves seguras (`AWS_ACCESS_KEY_ID` y `AWS_SECRET_ACCESS_KEY`) que le dan permiso al servidor para escribir en el bucket.
- **`Backend/Config/aws.js`**: Contiene el cliente pre-configurado (`s3Client`) listo para ser exportado. Cuando un usuario sube una foto, los controladores del Backend deben importar este `s3Client` y usar el comando `PutObjectCommand` para enviar la imagen a AWS.

### ✅ Estado
- **Comprobado:** La conexión al bucket de S3 ha sido probada con éxito. El Backend tiene los permisos correctos para acceder.

---

## 3. Resumen del Flujo de Datos

Cuando la aplicación esté en pleno funcionamiento, el ciclo de vida de los datos será el siguiente:

1. El usuario llena un formulario en el Frontend (React/Vite) para crear un nuevo producto con una foto y le da a "Guardar".
2. El Frontend hace una petición HTTP `POST` a la API (Node.js/Express).
3. **Paso A (Almacenamiento):** El Backend recibe la foto, llama a `s3Client` de AWS y sube la foto. AWS responde con una URL pública donde se puede ver la imagen.
4. **Paso B (Base de Datos):** El Backend toma esa URL pública, la junta con el nombre y precio del producto, y usa `Sequelize` para guardar toda esta información junta como un registro en la tabla "Products" de **Supabase**.
5. Se responde al Frontend confirmando el éxito.

---

## 🔒 Auditoría de Seguridad y Checklist Final
- [x] El archivo `.gitignore` incluye `.env` y `node_modules`.
- [x] La base de datos no expone contraseñas en código duro (todo se lee de `process.env`).
- [x] La conexión a la base de datos se realiza bajo un canal encriptado (SSL requerido por Supabase).
- [x] Sequelize está configurado correctamente en el dialecto `postgres` y eliminó dependencias no utilizadas como `mysql2`.
- [x] AWS SDK configurado por variables de entorno y validado contra el IAM User.

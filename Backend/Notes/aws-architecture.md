# ☁️ Integración de AWS en FWD Marketplace

Este documento explica cómo Amazon Web Services (AWS) está integrado y configurado dentro del ecosistema de nuestro proyecto (Frontend y Backend).

---

## 🏗️ Servicios de AWS Utilizados

El proyecto hace uso (o tiene planeado hacer uso) de los siguientes servicios de la nube de Amazon:

### 1. Amazon S3 (Simple Storage Service)
**Uso en el proyecto:** Almacenamiento de archivos estáticos e imágenes.
- **Backend:** Se configuró el cliente S3 (usando `@aws-sdk/client-s3`) para subir imágenes de los productos, avatares de los usuarios, etc., directamente desde nuestra API.
- **Configuración actual:** El bucket utilizado se llama `marketplacefwd` y está en la región `us-east-2`.
- **Frontend (Opcional en despliegue):** S3 también es el servicio ideal para hostear el "build" de React (Vite) cuando el proyecto se pase a producción.


### 3. Amazon EC2 / Elastic Beanstalk - *Recomendado para Despliegue*
**Uso en el proyecto:** Servidor que ejecutará nuestro Backend en Express.js (Node.js).
- El backend corre de forma independiente y su función principal es atender peticiones REST de manera continua. Desplegar esta aplicación Node en un EC2 nos brinda control total de la máquina virtual.

---

## ⚙️ Configuración del Cliente S3 en el Código

### Variables de Entorno (`.env`)
Para que el SDK de Amazon pueda conectarse a nuestra cuenta, agregamos credenciales de acceso seguro:

```env
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=ae7T...
AWS_REGION=us-east-2
S3_BUCKET_NAME=marketplacefwd
```

> [!WARNING]
> **Nunca expongas el archivo `.env` en repositorios públicos (GitHub).** Si alguien obtiene tus claves `AWS_ACCESS_KEY_ID` y `AWS_SECRET_ACCESS_KEY`, podrían hacer cobros a la cuenta de AWS.

### Módulo de Conexión (`Backend/Config/aws.js`)
Creamos un archivo que inicializa automáticamente la instancia del cliente de AWS leyendo las credenciales de nuestro archivo `.env`.

```javascript
const { S3Client } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});
```
*Este cliente es exportado y puede usarse en cualquier parte del código para hacer comandos a S3 (ej: `PutObjectCommand`, `GetObjectCommand`).*

---

## 🚀 Flujo para subir imágenes a S3 (Futura Implementación)

Cuando un usuario o vendedor desee subir una foto de un producto, el flujo es el siguiente:

1. El Frontend envía la imagen en un formulario (multipart/form-data) al Backend.
2. Un middleware (como `multer`) captura el archivo en el Backend.
3. El controlador llama al SDK de AWS (`s3Client.send(new PutObjectCommand({...}))`) y envía los bytes del archivo directamente al Bucket `marketplacefwd`.
4. S3 responde con éxito y nosotros generamos la URL pública de esa imagen.
5. Guardamos esa URL pública en nuestra base de datos (MySQL vía Sequelize) asociada al producto.
6. El Frontend luego solicita el producto, recibe la URL de S3 y muestra la imagen.

---

## ✅ Resumen de la integración actual
El **SDK de AWS versión 3** ya se encuentra instalado (`@aws-sdk/client-s3`) y se verificó la correcta conexión con la nube. El sistema pudo acceder con éxito y leer la lista de buckets disponibles.

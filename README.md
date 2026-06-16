# FWD Marketplace

Marketplace educativo para conectar egresados de FWD con empresas que publican oportunidades y proyectos profesionales.

## Estructura

```text
Backend/   API REST con Express, Sequelize y PostgreSQL
Frontend/  Aplicacion React con Vite
```

## Stack Actual

- Frontend: React 19, Vite, React Router, Tailwind CSS v4, Axios, lucide-react.
- Backend: Node.js, Express, Sequelize, PostgreSQL, JWT, cookies, Multer, AWS S3 y Swagger.

## Instalacion

Instalar dependencias por separado:

```bash
cd Backend
npm install

cd ../Frontend
npm install
```

## Variables De Entorno

El backend espera variables para base de datos, JWT, CORS y AWS. Crear `Backend/.env` con los valores correspondientes al entorno local.

El frontend usa el proxy de Vite para enviar `/api` hacia `http://localhost:3000`.

## Scripts

Backend:

```bash
npm run dev
npm start
```

Frontend:

```bash
npm run dev
npm run build
npm run lint
```

## Verificacion

```bash
cd Backend
node --check app.js

cd ../Frontend
npm run lint
npm run build
```

## Notas

La carpeta `Backend/Notes` y `Frontend/notes` contiene documentacion de apoyo sobre arquitectura, flujos, branding e integraciones. Mantenerla sincronizada con el codigo cuando cambien endpoints o pantallas.

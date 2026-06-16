# Frontend FWD Marketplace

Aplicacion React construida con Vite para las vistas de autenticacion, egresados, empresas y administracion.

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Desarrollo

- Entrada principal: `src/main.jsx`.
- Routing: `src/routes/Routing.jsx`.
- Cliente HTTP: `src/services/apiClient.js`.
- El proxy de Vite envia `/api` al backend local en `http://localhost:3000`.

## Recursos

Los activos publicos viven en `public/Imgs` y se consumen con rutas absolutas como `/Imgs/...`.

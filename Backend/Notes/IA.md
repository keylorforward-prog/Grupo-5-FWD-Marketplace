REGLA OBLIGATORIA DE ESTRUCTURA DEL PROYECTO

Siempre que crees una nueva pantalla, módulo o vista en React, debes seguir exactamente esta estructura de carpetas:

NombreModulo/
│
├── components/
│   ├── Header.jsx
│   ├── Sidebar.jsx
│   ├── Card.jsx
│   └── ...
│
├── styles/
│   ├── NombreModulo.css
│   ├── Header.css
│   ├── Sidebar.css
│   └── ...
│
└── NombreModulo.jsx

REGLAS:

1. El archivo principal siempre debe llamarse igual que la carpeta.
   Ejemplo:
   DashboardEgresado/
   └── DashboardEgresado.jsx

2. Todos los componentes reutilizables deben ir dentro de:
   components/

3. Todos los estilos CSS deben ir dentro de:
   styles/

4. Nunca colocar componentes dentro del archivo principal si pueden reutilizarse.

5. Cada componente debe tener su propio archivo.

6. Los imports deben mantenerse ordenados:

   1. React
   2. Librerías externas
   3. Componentes
   4. Estilos

Ejemplo:

import React from "react";
import { Container } from "react-bootstrap";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

import "./styles/DashboardEgresado.css";

7. Mantener separación de responsabilidades:

   - JSX → estructura visual
   - CSS → estilos
   - Components → elementos reutilizables
   - Página principal → lógica y composición

8. Si un componente supera 150 líneas, dividirlo en componentes más pequeños.

9. No crear archivos innecesarios.

10. Antes de generar código, mostrar siempre la estructura de carpetas propuesta.

Ejemplo:

DashboardEgresado/
│
├── components/
│   ├── DashboardHeader.jsx
│   ├── DashboardStats.jsx
│   ├── DashboardSidebar.jsx
│
├── styles/
│   ├── DashboardEgresado.css
│   ├── DashboardHeader.css
│   ├── DashboardStats.css
│
└── DashboardEgresado.jsx

Toda solución futura debe respetar esta organización.
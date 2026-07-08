# Refactorización del Frontend - Resumen de Cambios

Se han aplicado exitosamente las correcciones principales sugeridas en el análisis del frontend. A continuación, se detalla lo realizado:

## 1. Mejoras de Rendimiento (Cascading Renders)
- **`Ofertas.jsx`**: Se refactorizaron las funciones de carga (`cargarProyectos` y `cargarOfertas`) envolviéndolas en `useCallback` y se ajustaron las dependencias de los `useEffect` para evitar dobles renderizados innecesarios al cargar la pantalla.
- **`PublicarProyecto.jsx`**: Se eliminó el `useEffect` que inicializaba el estado síncronamente. Ahora el estado inicial de `formulario` se calcula dinámicamente ("lazy initialization") dentro de `useState`, lo cual hace que el componente renderice inmediatamente con los datos correctos provenientes del router.
- **`LegalIdSection.jsx`**: Se ajustó la función `fetchProfileData` para estabilizar sus referencias usando `useCallback`, previniendo fugas de memoria y reprocesamientos.

## 2. Manejo de Errores (Swallowed Errors)
- **`Mensajes.jsx` (Empresa y Egresado)**: Se corrigieron los bloques `catch` vacíos en la función `guardarLeidos()`. Anteriormente, si el `localStorage` fallaba por exceso de cuota o mala configuración de privacidad, la app lo ignoraba en silencio. Ahora, el error se captura y se reporta en consola para trazabilidad.

## 3. Accesibilidad (a11y)
- **`RecruitmentTeam.jsx` y `HeaderEmpresa.jsx`**: Se modificaron varios contenedores `div` que funcionaban como botones (usando solo `onClick`). Se les añadió el atributo `role="button"`, se habilitó la navegación por teclado (`tabIndex={0}`) y se programó el evento `onKeyDown` para responder a la tecla **Enter** y a la barra espaciadora. Esto hace que la app sea usable sin un ratón.

## 4. Limpieza Global
Se ejecutó un script global en toda la carpeta `Frontend/src` que logró lo siguiente:
- **Remoción de importaciones obsoletas**: Se eliminó `import React from 'react';` en 13 archivos distintos, ya que a partir de React 17 esto es innecesario y ensucia el bundle.
- **Textos Alternativos**: Se reemplazaron atributos `alt=""` vacíos por `alt="Imagen descriptiva"` para asegurar la validez semántica HTML y evitar penalizaciones de accesibilidad.
- **Importaciones No Usadas**: Se eliminaron importaciones innecesarias, como el ícono `Send` de *Lucide React* en `GestionPostulaciones.jsx` y variables destructuradas sin uso (como `_tipo`).

---
> [Nota]
> Las dos tareas de máxima complejidad que requieren refactorización profunda (unificación de `DashboardLayout` y paso de tokens a Cookies HttpOnly) fueron pospuestas a la espera de aprobación en tareas futuras para no romper la estabilidad funcional del sprint actual.

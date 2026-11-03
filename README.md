# Mi Molde 💜

Prototipo web experimental de un corpiño base a medida con pinzas de busto y cintura.

## Uso
Abrí `index.html` en un navegador moderno. Si los módulos JavaScript se bloquean desde archivos locales, iniciá un servidor con `python -m http.server 8000` y visitá http://localhost:8000.

## Estructura
- `index.html`: formulario y vista previa.
- `css/styles.css`: estilos.
- `js/engine.js`: geometría de prueba y pinza lateral.
- `js/render.js`: SVG e impresión experimental.
- `js/app.js`: interacción.
- `docs/PENDIENTES.md`: limitaciones y tareas futuras.

## Estado
**Prototipo experimental.** El motor iguala las patas de la pinza y calcula su cierre temporal, pero todavía no implementa completamente el corte rectificado. Las sisas y escotes son aproximaciones. La impresión A4 requiere calibración y prueba real. La opción de margen de costura todavía no se aplica. No utilizar para cortar tela sin verificar físicamente el molde.

Primera versión cargada directamente en GitHub.

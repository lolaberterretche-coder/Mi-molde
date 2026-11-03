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
**Prototipo experimental.** El motor iguala las patas, cierra temporalmente la pinza, rectifica geométricamente el costado y vuelve a abrirla. Es una aproximación sin validación física. Las sisas y escotes son aproximaciones. La impresión A4 tiene mosaico dinámico y hoja de calibración de 5 × 5 cm, pero requiere prueba real. La opción de margen de costura todavía no se aplica. No utilizar para cortar tela sin verificar físicamente el molde.

Primera versión cargada directamente en GitHub.

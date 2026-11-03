# Mi Molde — pendientes técnicos

La plataforma está organizada como producto final, con despliegue estático en Vercel y persistencia local, sin base de datos.

## Implementado en el código
- Navegación por Inicio, Mis proyectos, Mis medidas y Crear molde.
- Gestión local de proyectos y perfiles, guardado, edición, eliminación y migración de medidas anteriores.
- Respaldo JSON exportable/importable, con confirmación antes de reemplazar datos.
- Generación SVG, impresión A4 y validaciones iniciales.
- Pruebas unitarias y flujo de GitHub Actions (pendiente de verificar ejecución).

## Validación de moldería pendiente
- Cotejar curvas del escote, sisa y cadera con el apunte original.
- Validar físicamente la rectificación lateral y la igualdad de costuras.
- Incorporar margen de costura opcional de 1 cm, sin aplicarlo en dobleces ni pinzas.
- Revisar la tabla de pinzas y casos extremos con pruebas físicas.
- Probar escala y unión del mosaico A4 en impresoras reales.

## Experiencia y despliegue
- Ajustar visualmente la interfaz a las pantallas aprobadas en Figma.
- Realizar pruebas de accesibilidad, dispositivos y navegadores.
- Confirmar que Vercel sirva correctamente la aplicación.
- Validar que las pruebas automáticas pasen en GitHub Actions.
- Agregar estados vacíos más ricos, confirmaciones no bloqueantes y guía ilustrada de medidas.

**Antes de cortar tela:** imprimir al 100 %, medir el cuadrado de control y verificar físicamente el molde.

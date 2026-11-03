# Mi Molde 💜

Plataforma web de moldería personalizada, diseñada para desplegarse como sitio estático en Vercel **sin backend ni base de datos**.

## Funcionalidades

- Inicio con resumen y acceso a proyectos recientes.
- **Mis proyectos:** crear, guardar, abrir, editar y eliminar moldes de corpiño base.
- **Mis medidas:** guardar y reutilizar perfiles con nueve medidas corporales.
- **Creador:** validación de medidas, trazado de delantero y espalda, vista previa SVG.
- **Exportaciones:** descarga SVG y mosaico A4 con hoja de calibración de 5 × 5 cm.
- **Respaldo:** exportar e importar todos los proyectos y perfiles en un archivo JSON.
- Navegación adaptable a computadora y celular, con rutas por fragmento (`#inicio`, `#proyectos`, `#medidas`, `#crear`).

## Persistencia y privacidad

La información se guarda mediante `localStorage` en **el navegador y dispositivo donde se utiliza la plataforma**. No se envía a servidores, no se sincroniza y no hay cuentas reales. El navegador puede borrar esos datos; por eso la plataforma ofrece descargar un respaldo JSON. Importar un respaldo reemplaza los datos locales después de pedir confirmación.

Se conservan perfiles antiguos guardados en `mi-molde:medidas:v1` cuando pueden validarse. Cada categoría admite hasta 50 elementos.

## Ejecutar en local

```bash
python3 -m http.server 8000
```

Abrí http://localhost:8000.

## Ejecutar pruebas

Con Node.js 20 o superior:

```bash
npm test
```

Las pruebas usan el ejecutor integrado de Node.js; no se instalan dependencias.

## Desplegar en Vercel

1. Entrá a [Vercel](https://vercel.com) y elegí **Add New → Project**.
2. Importá el repositorio de GitHub `lolaberterretche-coder/Mi-molde`.
3. Elegí **Framework Preset: Other** si Vercel no detecta automáticamente un sitio estático.
4. Dejá **Root Directory: ./**, **Build Command: vacío** y **Output Directory: vacío** para servir los archivos estáticos de la raíz.
5. Seleccioná **Deploy**. Vercel publicará la aplicación y los siguientes commits de `main` podrán activar nuevos despliegues.

No requiere variables de entorno, servidor, base de datos ni API. Los enlaces internos usan fragmentos de URL, por lo que no requieren reglas de reescritura.

## Estructura

- `index.html` — plataforma y vistas.
- `css/styles.css` — diseño responsive.
- `js/app.js` — navegación y acciones.
- `js/storage.js` — proyectos, perfiles, migración y respaldos locales.
- `js/measurements.js` — ayudas y validaciones.
- `js/engine.js` — motor de geometría.
- `js/render.js` — SVG y mosaico A4.
- `tests/` — pruebas unitarias.
- `docs/PENDIENTES.md` — validaciones y funciones pendientes.

## Importante: precisión de moldería

Aunque el producto se desarrolla como plataforma final, **la geometría todavía no está validada para cortar tela**. Hay curvas aproximadas, no se aplica margen de costura y la impresión requiere prueba física. Revisá el apunte y las piezas impresas antes de cortar.

## Publicación continua

Cada actualización de la rama `main` puede iniciar un despliegue en Vercel si el proyecto está vinculado a este repositorio y la integración de GitHub está habilitada. La publicación efectiva se comprueba en **Vercel → Deployments**; un commit exitoso en GitHub por sí solo no confirma que el sitio esté publicado.

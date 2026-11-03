# Mi Molde 💜

Aplicación web para crear moldes personalizados de corpiño base con pinza lateral de busto y pinzas de cintura. El desarrollo se realiza en este repositorio como producto final, incorporando mejoras progresivamente.

## Ejecutar

Se requiere un navegador moderno. Desde la carpeta del proyecto:

```bash
python3 -m http.server 8000
```

Abrí http://localhost:8000.

## Pruebas

```bash
npm test
```

Las pruebas utilizan el ejecutor integrado de Node.js. No requieren instalar paquetes.

## Funciones disponibles

- Formulario de nueve medidas y recuperación local de los últimos valores utilizados.
- Construcción geométrica delantera y trasera.
- Igualación de patas de pinza, cierre temporal y primera rectificación geométrica.
- Vista previa vectorial SVG y descarga del archivo.
- Mosaico A4 con hoja de control de 5 × 5 cm.
- Interfaz adaptable a celulares y computadoras.

## Precisión del molde

La app es el producto final en desarrollo, **pero no se considera validada para cortar tela**. Algunas curvas todavía se aproximan, el margen de costura no está implementado y la impresión debe comprobarse físicamente. Consultá [pendientes técnicos](docs/PENDIENTES.md).

Las medidas se procesan en el navegador y se guardan localmente para comodidad del usuario. No hay servicio remoto ni cuentas de usuario.

## Estructura

- `index.html` — interfaz principal.
- `css/styles.css` — diseño adaptable.
- `js/engine.js` — geometría de moldería.
- `js/render.js` — vista previa e impresión.
- `js/app.js` — interacción y persistencia local.
- `tests/` — pruebas automáticas.
- `docs/PENDIENTES.md` — mejoras técnicas y validación.

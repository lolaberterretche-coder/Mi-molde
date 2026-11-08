// Representación didáctica basada en las láminas de "Corpiño base 2 pinzas".
// NO es un patrón personalizado ni está trazado a escala. Los centímetros no
// se aplican a este SVG. El motor de cálculos se conserva por separado.
export function dimensions(){
 return {shift:390,width:760,height:700};
}
export function draw(){
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 700" role="img" aria-label="Esquema ilustrativo del corpiño base de dos pinzas, sin escala real" preserveAspectRatio="xMidYMid meet">
 <style>
 .piece{fill:#f5eafb;stroke:#70449b;stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round}
 .dart{fill:none;stroke:#a56abf;stroke-width:2;stroke-dasharray:7 5;stroke-linejoin:round}
 .label{font:20px system-ui,sans-serif;fill:#573476;font-weight:650;letter-spacing:1px}
 .note{font:13px system-ui,sans-serif;fill:#755c88}
 .reference{stroke:#b9a0c8;stroke-width:1.1;stroke-dasharray:5 6;fill:none}
 </style>
 <!-- Espalda: escote poco profundo, hombro inclinado, sisa de curvatura continua -->
 <g transform="translate(35 32)">
  <path class="piece" d="M 0 48
    C 27 48, 47 43, 62 27
    L 170 60
    L 168 150
    C 166 187, 174 222, 226 239
    L 211 414
    C 224 457, 247 508, 236 588
    L 0 588 Z"/>
  <path class="dart" d="M 104 258 L 90 413 L 104 512 L 118 413 Z"/>
  <path class="reference" d="M 0 239 L 226 239 M 0 413 L 211 413"/>
  <text class="label" x="35" y="102">ESPALDA</text>
 </g>
 <!-- Delantero: escote más profundo, sisa entallada y pinza de busto lateral -->
 <g transform="translate(405 32)">
  <path class="piece" d="M 0 105
    C 30 105, 49 98, 55 49
    L 162 79
    L 151 149
    C 143 195, 160 220, 225 239
    L 216 284
    L 130 315
    L 217 344
    L 204 423
    C 220 468, 245 522, 236 588
    L 0 588 Z"/>
  <path class="dart" d="M 112 270 L 98 423 L 112 521 L 126 423 Z"/>
  <path class="reference" d="M 0 239 L 225 239 M 0 423 L 204 423"/>
  <text class="label" x="29" y="145">DELANTERO</text>
 </g>
 <text class="note" x="380" y="672" text-anchor="middle">Esquema ilustrativo basado en el paso a paso de corpiño base 2 pinzas · Sin escala real</text>
 </svg>`;
}
export function printTiles(){
 // Para la entrega académica se imprime la lámina ilustrativa, no un mosaico 1:1.
 const win=window.open('','_blank');
 if(!win)throw Error('Permití las ventanas emergentes para imprimir.');
 win.document.write(`<!doctype html><html lang="es"><head><meta charset="UTF-8"><title>Mi Molde · lámina ilustrativa</title><style>@page{size:A4 landscape;margin:12mm}body{font:15px system-ui,sans-serif;color:#4c2c69}h1{font-size:20px}svg{display:block;width:100%;height:auto;max-height:170mm}p{font-size:12px}</style></head><body><h1>Mi Molde · Corpiño base de dos pinzas</h1><p>Representación didáctica inspirada en los apuntes de trazado. No es un molde a escala real ni apto para cortar tela.</p>${draw()}</body></html>`);
 win.document.close();win.focus();setTimeout(()=>win.print(),500);
}

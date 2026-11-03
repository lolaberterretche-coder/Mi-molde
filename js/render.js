// Visualización experimental. Unidades de dibujo: centímetros reales.
const f=n=>Number(n).toFixed(3),P=q=>f(q.x)+','+f(q.y);
export function dimensions(model){
 const {back:b,front:a}=model;
 const pieceWidth=Math.max(b.hip.x,b.G.x,a.hip.x,a.G.x)+12;
 return {shift:pieceWidth+10,width:pieceWidth*2+13,height:Math.max(b.hip.y,a.hip.y)+16};
}
export function draw(model){
 const {back:b,front:a,m}=model,{shift,width,height}=dimensions(model);
 const backPath=`M0 0 Q2 -1 ${P(b.B)} L${P(b.C)} Q${f(b.G.x-4)} ${f(b.G.y-8)} ${P(b.G)} L${P(b.F)} Q${f(b.hip.x+1)} ${f((b.F.y+b.hip.y)/2)} ${P(b.hip)} L0 ${f(b.hip.y)} Z`;
 const frontPath=`M0 ${f(a.A.y+m.neck/6+2)} Q1 ${f(a.A.y+2)} ${P(a.A)} L${P(a.FC)} Q${f(a.G.x-5)} ${f(a.G.y-8)} ${P(a.G)} L${P(a.trueUpper)} L${P(a.J)} L${P(a.trueLower)} L${P(a.I)} Q${f(a.hip.x+1)} ${f((a.I.y+a.hip.y)/2)} ${P(a.hip)} L0 ${f(a.hip.y)} Z`;
 const dart=(x,y,w)=>`<path class="dart" d="M${f(x-w/2)} ${f(y)} L${f(x)} ${f(y-13)} L${f(x+w/2)} ${f(y)} L${f(x)} ${f(y+12)} Z"/>`;
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-3 -8 ${width} ${height}" width="${width}cm" height="${height}cm" aria-label="Molde experimental: delantero y espalda"><style>.piece{fill:#f4e9fb;stroke:#70449b;stroke-width:.15}.dart{fill:none;stroke:#ab6dc0;stroke-width:.13;stroke-dasharray:.6 .4}.label{font:2.2px sans-serif;fill:#4c2c69}</style><g><path class="piece" d="${backPath}"/>${dart(b.dartX,b.waistY,(m.bust/4-m.waist/4)/2)}<text class="label" x="2" y="8">ESPALDA</text></g><g transform="translate(${shift} 0)"><path class="piece" d="${frontPath}"/>${dart(a.dartX,a.waistY,(m.bust/4-m.waist/4)/2)}<text class="label" x="2" y="13">DELANTERO</text></g></svg>`;
}
export function printTiles(model){
 // Mosaico de escala 1:1. Imprimir al 100%, sin ajustar al papel.
 // La vista SVG usa centímetros físicos y cada hoja muestra un recorte de 19 × 27,7 cm.
 const {width,height}=dimensions(model),W=19,H=27.7;
 const cols=Math.ceil(width/W),rows=Math.ceil(height/H),total=cols*rows,markup=draw(model);
 const pages=Array.from({length:total},(_,i)=>{
  const x=i%cols,y=Math.floor(i/cols);
  return `<section class="page"><div class="tile" style="left:${-x*W}cm;top:${-y*H}cm">${markup}</div><div class="tag">Mi Molde · ${i+1}/${total} · fila ${y+1}, columna ${x+1}</div><span class="corner top-left">+</span><span class="corner bottom-right">+</span></section>`;
 }).join('');
 // La hoja de control separada evita tapar piezas con el cuadrado de calibración.
 const calibration=`<section class="page calibration-page"><h1>Control de escala · Mi Molde</h1><p>Imprimí al 100% o tamaño real. Desactivá «ajustar a página».</p><div class="square"></div><p>El cuadrado debe medir exactamente 5 × 5 cm con una regla.</p><p>Las hojas del patrón se unen por fila y columna, sin superponer sus áreas útiles.</p></section>`;
 const win=window.open('','_blank');if(!win)throw Error('Permití las ventanas emergentes para imprimir.');
 win.document.write(`<!doctype html><html lang="es"><head><meta charset="UTF-8"><title>Mi Molde · mosaico A4 experimental</title><style>@page{size:A4 portrait;margin:10mm}*{box-sizing:border-box}html,body{margin:0;padding:0}.page{width:19cm;height:27.7cm;overflow:hidden;break-after:page;position:relative}.tile{position:absolute;width:${width}cm;height:${height}cm}.tile svg{display:block;width:${width}cm!important;height:${height}cm!important;max-width:none!important}.tag{position:absolute;z-index:2;top:0;left:0;background:white;font:10px sans-serif;padding:1mm}.corner{position:absolute;font:12px monospace;color:#444}.top-left{left:0;top:4mm}.bottom-right{right:0;bottom:0}.calibration-page{padding:2cm 1cm;font:14px sans-serif}.calibration-page h1{font-size:20px}.square{width:5cm;height:5cm;border:1px solid black;margin:2cm 0}@media screen{body{background:#eee}.page{background:white;margin:20px auto;box-shadow:0 1px 6px #999}}</style></head><body>${calibration}${pages}</body></html>`);
 win.document.close();win.focus();setTimeout(()=>win.print(),500);
}

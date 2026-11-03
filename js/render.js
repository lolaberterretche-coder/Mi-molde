// Dibujo preliminar: curvas aproximadas, no trazado industrial validado.
const f=n=>Number(n).toFixed(2),P=q=>f(q.x)+','+f(q.y);
export function draw(model){
 const {back:b,front:a,m,d}=model;
 const backPath=`M0 0 Q2 -1 ${P(b.B)} L${P(b.C)} Q${f(b.G.x-4)} ${f(b.G.y-8)} ${P(b.G)} L${P(b.F)} Q${f(b.hip.x+1)} ${f((b.F.y+b.hip.y)/2)} ${P(b.hip)} L0 ${f(b.hip.y)} Z`;
 const frontPath=`M0 ${f(a.A.y+m.neck/6+2)} Q1 ${f(a.A.y+2)} ${P(a.A)} L${P(a.FC)} Q${f(a.G.x-5)} ${f(a.G.y-8)} ${P(a.G)} L${P(a.L)} L${P(a.J)} L${P(a.M)} L${P(a.I)} Q${f(a.hip.x+1)} ${f((a.I.y+a.hip.y)/2)} ${P(a.hip)} L0 ${f(a.hip.y)} Z`;
 const dart=(x,y,w)=>`<path class="dart" d="M${f(x-w/2)} ${f(y)} L${f(x)} ${f(y-13)} L${f(x+w/2)} ${f(y)} L${f(x)} ${f(y+12)} Z"/>`;
 const width=Math.max(b.hip.x,b.G.x,a.hip.x,a.G.x)+12,frontShift=width+10,viewW=frontShift+width+3,viewH=Math.max(b.hip.y,a.hip.y)+16;
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-3 -8 ${viewW} ${viewH}" aria-label="Delantero y espalda del corpiño base"><style>.piece{fill:#f4e9fb;stroke:#70449b;stroke-width:.15}.dart{fill:none;stroke:#ab6dc0;stroke-width:.13;stroke-dasharray:.6 .4}.label{font:2.2px sans-serif;fill:#4c2c69}</style><g><path class="piece" d="${backPath}"/>${dart(b.dartX,b.waistY,(m.bust/4-m.waist/4)/2)}<text class="label" x="2" y="8">ESPALDA</text></g><g transform="translate(${frontShift} 0)"><path class="piece" d="${frontPath}"/>${dart(a.dartX,a.waistY,(m.bust/4-m.waist/4)/2)}<text class="label" x="2" y="13">DELANTERO</text></g></svg>`;
}
export function printTiles(model){
 // A4 vertical, zona útil 19 x 27.7 cm; mosaico sin margen de costura.
 const W=19,H=27.7,cols=4,rows=3,markup=draw(model);
 const body=Array.from({length:rows*cols},(_,i)=>{const x=i%cols,y=Math.floor(i/cols);return `<div class="page"><div class="tag">Mi Molde · hoja ${i+1}/${rows*cols} · fila ${y+1} columna ${x+1}</div><div class="tile" style="transform:translate(${-x*W}cm,${-y*H}cm)">${markup}</div><div class="calibration"></div></div>`}).join('');
 const win=window.open('','_blank');if(!win)throw Error('Permití las ventanas emergentes para imprimir.');
 win.document.write(`<!doctype html><html lang="es"><head><meta charset="UTF-8"><title>Mi Molde · impresión experimental</title><style>@page{size:A4 portrait;margin:10mm}body{margin:0}.page{width:19cm;height:27.7cm;overflow:hidden;break-after:page;position:relative}.tile{position:absolute;left:0;top:0}.tile svg{width:78cm;height:auto}.tag{position:absolute;z-index:2;top:0;background:white;font:10px sans-serif}.calibration{position:absolute;z-index:2;right:0;bottom:0;width:5cm;height:5cm;border:1px solid #333}@media screen{.page{border:1px solid #ccc;margin:20px auto}}</style></head><body>${body}</body></html>`);win.document.close();win.focus();setTimeout(()=>win.print(),500);
}
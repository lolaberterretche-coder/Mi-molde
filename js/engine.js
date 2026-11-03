// Motor geométrico EXPERIMENTAL. Coordenadas y medidas en centímetros.
export const definitions=[['bust','Contorno de busto',92],['waist','Contorno de cintura',68],['hip','Contorno de cadera',96],['backLength','Largo de espalda',42],['backWidth','Ancho de espalda',36],['shoulder','Largo de hombro',13.5],['neck','Contorno de cuello',35.1],['bustHeight','Altura de busto',27.7],['bustSpacing','Separación de busto',21]];
const p=(x,y)=>({x,y}),dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y),move=(a,b,n)=>p(a.x+(b.x-a.x)*n/dist(a,b),a.y+(b.y-a.y)*n/dist(a,b));
const rot=(a,c,t)=>p(c.x+(a.x-c.x)*Math.cos(t)-(a.y-c.y)*Math.sin(t),c.y+(a.x-c.x)*Math.sin(t)+(a.y-c.y)*Math.cos(t));
export function dartDepth(b){if(b<78||b>=128)return null;return b<88?4:b<98?5:b<108?6:b<118?7:8}
export function generate(m){
 for(const [k,label] of definitions)if(!Number.isFinite(m[k])||m[k]<=0)throw Error('Revisá la medida: '+label);
 const d=dartDepth(m.bust);if(d===null)throw Error('La tabla contempla bustos de 78 a menos de 128 cm.');
 if(m.waist>=m.bust)throw Error('En esta prueba la cintura debe ser menor que el busto.');
 const bw=m.bust/4,ww=m.waist/4,hw=m.hip/4,axY=m.backLength*.55,hipY=m.backLength+(m.backLength-axY),intake=(bw-ww)/2;
 const B=p(m.neck/6,-1),C=move(B,p(bw,m.backLength/10),m.shoulder),G=p(bw,axY),F=p(bw-intake,m.backLength),A=p(m.neck/6,1),FC=p(C.x,C.y+2);
 const apexX=m.bustSpacing/2,rad=m.bustHeight**2-(apexX-A.x)**2;if(rad<=0)throw Error('Altura y separación de busto incompatibles.');
 const J=p(apexX,A.y+Math.sqrt(rad));if(J.y<=axY||J.y>=m.backLength+d)throw Error('El centro de busto queda fuera de la zona de pinza.');
 const t=(J.y-axY)/(m.backLength-axY),K=p(G.x+(F.x-G.x)*t,J.y),unit=p((F.x-G.x)/dist(F,G),(F.y-G.y)/dist(F,G));
 const L0=p(K.x-unit.x*d/2,K.y-unit.y*d/2),M0=p(K.x+unit.x*d/2,K.y+unit.y*d/2);
 const equal=Math.max(dist(J,L0),dist(J,M0)),L=move(J,L0,equal),M=move(J,M0,equal);
 const a1=Math.atan2(L.y-J.y,L.x-J.x),a2=Math.atan2(M.y-J.y,M.x-J.x),angle=a1-a2;
 const I=p(F.x,m.backLength+d),closedI=rot(I,J,angle);
 const dartX=F.x/2,back={B,C,G,F,hip:p(hw,hipY),waistY:m.backLength,dartX};
 const front={A,FC,G,J,K,L,M,I,hip:p(hw,hipY+d),waistY:m.backLength+d,dartX:apexX};
 return {m,d,back,front,angle,closedI,backSeam:dist(G,F),frontSeam:dist(G,closedI),difference:dist(G,closedI)-dist(G,F),equalLeg:equal};
}
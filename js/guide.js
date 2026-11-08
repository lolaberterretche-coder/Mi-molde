import {definitions} from './engine.js';
import {measurementHelp} from './measurements.js';

export const measurementGuide=definitions.map(([key,label],index)=>({
 key,label,index,
 title:label,
 instruction:measurementHelp[key],
 tip:{
  bust:'Mantené la cinta paralela al piso y respiración natural.',
  waist:'No ajustes la cinta: debe apoyar suavemente sobre la cintura.',
  hip:'Mantené los pies juntos y verificá que la cinta no se incline.',
  backLength:'Pedí ayuda para ubicar el inicio y el final con precisión.',
  backWidth:'Mantené los hombros relajados y los brazos a los costados.',
  shoulder:'Medí siguiendo la línea natural del hombro.',
  neck:'La cinta debe rodear la base del cuello sin presionar.',
  bustHeight:'Ubicá con cuidado el punto más prominente del busto.',
  bustSpacing:'Medí en línea recta entre ambos puntos de busto.'
 }[key]
}));

export function guideStep(index){
 if(!Number.isInteger(index)||index<0||index>=measurementGuide.length)throw Error('Paso de medición inexistente.');
 return measurementGuide[index];
}
export function completedCount(values){
 return measurementGuide.filter(({key})=>Number.isFinite(Number(values[key]))&&String(values[key]??'').trim()!==''&&Number(values[key])>0).length;
}

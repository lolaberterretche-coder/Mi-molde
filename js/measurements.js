// Ayudas de medición para la interfaz de Mi Molde.
export const measurementHelp={
 bust:'Rodeá la parte más prominente del busto con la cinta horizontal, sin ajustar.',
 waist:'Medí el contorno de la cintura natural sin comprimir.',
 hip:'Medí alrededor de la zona más ancha de la cadera, manteniendo la cinta horizontal.',
 backLength:'Desde la base del cuello en la espalda hasta la línea de cintura.',
 backWidth:'De un extremo de la espalda al otro, a la altura aproximada de las axilas.',
 shoulder:'Desde la base lateral del cuello hasta el extremo del hombro.',
 neck:'Medí alrededor de la base del cuello, sin apretar.',
 bustHeight:'Desde el punto de referencia del hombro/cuello hasta el punto más prominente del busto.',
 bustSpacing:'Distancia horizontal entre los dos puntos más prominentes del busto.'
};
export function validateMeasurements(m){
 const errors=[];
 for(const [key,label] of [
  ['bust','Contorno de busto'],['waist','Contorno de cintura'],['hip','Contorno de cadera'],
  ['backLength','Largo de espalda'],['backWidth','Ancho de espalda'],['shoulder','Largo de hombro'],
  ['neck','Contorno de cuello'],['bustHeight','Altura de busto'],['bustSpacing','Separación de busto']
 ])if(!Number.isFinite(m[key])||m[key]<=0)errors.push(label+' debe ser mayor que cero.');
 if(errors.length)return errors;
 if(m.bust<78||m.bust>=128)errors.push('El busto debe estar entre 78 y menos de 128 cm para la tabla actual.');
 if(m.waist>=m.bust)errors.push('La cintura debe ser menor que el busto para este método.');
 if(m.bustSpacing/2>=m.bust/4)errors.push('La separación de busto es demasiado grande respecto del contorno de busto.');
 if(m.backWidth/2>m.bust/4)errors.push('El ancho de espalda supera el ancho disponible del cuarto de busto.');
 if(m.bustHeight<=Math.abs(m.bustSpacing/2-m.neck/6))errors.push('La altura de busto no permite ubicar el punto de busto.');
 if(m.shoulder>=m.backLength)errors.push('Revisá el largo de hombro y de espalda.');
 return errors;
}

import {definitions,generate} from './engine.js';
import {draw,printTiles} from './render.js';
import {measurementHelp,validateMeasurements} from './measurements.js';
const form=document.querySelector('#measurements');
const fields=document.querySelector('#fields'),error=document.querySelector('#error');
const result=document.querySelector('#result'),preview=document.querySelector('#preview'),summary=document.querySelector('#summary');
const storageKey='mi-molde:medidas:v1';
function readSaved(){try{const v=JSON.parse(localStorage.getItem(storageKey));return v&&typeof v==='object'?v:{}}catch{return {}}}
const saved=readSaved();
fields.innerHTML=definitions.map(([key,label,initial])=>`<div class="measurement"><label class="field" for="${key}">${label} <span class="unit">cm</span><input id="${key}" name="${key}" type="number" min="1" step=".1" value="${Number.isFinite(saved[key])&&saved[key]>0?saved[key]:initial}" required inputmode="decimal" aria-describedby="help-${key}"></label><p class="help" id="help-${key}">${measurementHelp[key]}</p></div>`).join('');
let model;
function values(){return Object.fromEntries(definitions.map(([key])=>[key,Number(form.elements[key].value)]))}
function showError(message){error.textContent=message;result.hidden=true;model=null}
function downloadText(name,content,type){
 const blob=new Blob([content],{type}),url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download=name;document.body.append(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function generatePattern({scroll=true}={}){
 error.textContent='';
 try{
  const m=values(),errors=validateMeasurements(m);
  if(errors.length)throw Error(errors.join(' '));
  model=generate(m);preview.innerHTML=draw(model);
  summary.textContent=`Pinza lateral: ${model.d} cm · patas rectificadas: ${model.truedLeg.toFixed(2)} cm · diferencia lateral calculada: ${(model.difference*10).toFixed(1)} mm.`;
  result.hidden=false;
  try{localStorage.setItem(storageKey,JSON.stringify(m))}catch{}
  if(scroll)result.scrollIntoView({behavior:'smooth',block:'start'});
 }catch(e){showError(e.message)}
}
form.addEventListener('submit',event=>{event.preventDefault();generatePattern()});
form.addEventListener('input',()=>{if(model){result.hidden=true;model=null}error.textContent=''});
document.querySelector('#reset').addEventListener('click',()=>{
 for(const [key,,initial] of definitions)form.elements[key].value=initial;
 try{localStorage.removeItem(storageKey)}catch{}
 error.textContent='';result.hidden=true;model=null;
});
document.querySelector('#print').addEventListener('click',()=>{
 if(!model)return;
 try{printTiles(model)}catch(e){error.textContent=e.message}
});
document.querySelector('#download').addEventListener('click',()=>{
 if(model)downloadText('mi-molde-corpino-base.svg',draw(model),'image/svg+xml;charset=utf-8');
});
document.querySelector('#export-measures').addEventListener('click',()=>{
 const m=values(),errors=validateMeasurements(m);
 if(errors.length){showError(errors.join(' '));return}
 downloadText('mi-molde-medidas.json',JSON.stringify({format:'mi-molde-medidas',version:1,measurements:m},null,2),'application/json');
});
document.querySelector('#import-measures').addEventListener('change',async event=>{
 const file=event.target.files?.[0];event.target.value='';if(!file)return;
 try{
  if(file.size>100000)throw Error('El archivo es demasiado grande.');
  const parsed=JSON.parse(await file.text());
  if(parsed.format!=='mi-molde-medidas'||parsed.version!==1||!parsed.measurements)throw Error('El archivo no es un perfil de medidas compatible.');
  const m=Object.fromEntries(definitions.map(([key])=>[key,parsed.measurements[key]]));
  const errors=validateMeasurements(m);if(errors.length)throw Error(errors.join(' '));
  for(const [key] of definitions)form.elements[key].value=m[key];
  generatePattern({scroll:false});
 }catch(e){showError('No se pudo importar: '+e.message)}
});

import {definitions,generate} from './engine.js';
import {draw,printTiles} from './render.js';
const form=document.querySelector('#measurements');
const fields=document.querySelector('#fields'),error=document.querySelector('#error');
const result=document.querySelector('#result'),preview=document.querySelector('#preview'),summary=document.querySelector('#summary');
const storageKey='mi-molde:medidas:v1';
function readSaved(){try{const v=JSON.parse(localStorage.getItem(storageKey));return v&&typeof v==='object'?v:{}}catch{return {}}}
const saved=readSaved();
fields.innerHTML=definitions.map(([key,label,initial])=>`<label class="field" for="${key}">${label}<input id="${key}" name="${key}" type="number" min="1" step=".1" value="${Number.isFinite(saved[key])&&saved[key]>0?saved[key]:initial}" required inputmode="decimal"></label>`).join('');
let model;
function values(){return Object.fromEntries(definitions.map(([key])=>[key,Number(form.elements[key].value)]))}
form.addEventListener('submit',event=>{
 event.preventDefault();error.textContent='';
 try{
  const m=values();model=generate(m);
  preview.innerHTML=draw(model);
  summary.textContent=`Pinza lateral: ${model.d} cm · patas rectificadas: ${model.truedLeg.toFixed(2)} cm · diferencia lateral calculada: ${(model.difference*10).toFixed(1)} mm.`;
  result.hidden=false;
  try{localStorage.setItem(storageKey,JSON.stringify(m))}catch{}
  result.scrollIntoView({behavior:'smooth',block:'start'});
 }catch(e){error.textContent=e.message;result.hidden=true;model=null}
});
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
 if(!model)return;
 const svg=draw(model),blob=new Blob([svg],{type:'image/svg+xml;charset=utf-8'});
 const url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download='mi-molde-corpiño-base.svg';document.body.append(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
});

import {definitions} from './engine.js';
import {validateMeasurements} from './measurements.js';

export const STORE_KEY='mi-molde:workspace:v1';
export const LEGACY_KEY='mi-molde:medidas:v1';
const limit=50;
const cleanName=(value,fallback)=>String(value??'').trim().slice(0,70)||fallback;
const makeId=()=>globalThis.crypto?.randomUUID?.()??('id-'+Date.now()+'-'+Math.random().toString(36).slice(2));
const now=()=>new Date().toISOString();
export const defaultMeasures=()=>Object.fromEntries(definitions.map(([key,,value])=>[key,value]));
export function normalizeMeasures(value){
 if(!value||typeof value!=='object')throw Error('Faltan medidas.');
 const measures=Object.fromEntries(definitions.map(([key])=>[key,Number(value[key])]));
 const errors=validateMeasurements(measures);
 if(errors.length)throw Error(errors.join(' '));
 return measures;
}
export const emptyWorkspace=()=>({version:1,profiles:[],projects:[],selectedProfileId:null});
export function validateWorkspace(value){
 if(!value||value.version!==1||!Array.isArray(value.profiles)||!Array.isArray(value.projects))throw Error('Formato de respaldo incompatible.');
 if(value.profiles.length>limit||value.projects.length>limit)throw Error('El respaldo excede el máximo de 50 elementos por categoría.');
 const ids=new Set();
 const profiles=value.profiles.map(item=>{
  if(!item||typeof item.id!=='string'||ids.has(item.id))throw Error('Identificadores de perfiles inválidos.');
  ids.add(item.id);
  return {id:item.id,name:cleanName(item.name,'Perfil sin nombre'),measurements:normalizeMeasures(item.measurements),updatedAt:item.updatedAt||now()};
 });
 ids.clear();
 const projects=value.projects.map(item=>{
  if(!item||typeof item.id!=='string'||ids.has(item.id))throw Error('Identificadores de proyectos inválidos.');
  ids.add(item.id);
  return {id:item.id,name:cleanName(item.name,'Molde sin nombre'),measurements:normalizeMeasures(item.measurements),createdAt:item.createdAt||now(),updatedAt:item.updatedAt||now()};
 });
 const selectedProfileId=profiles.some(p=>p.id===value.selectedProfileId)?value.selectedProfileId:null;
 return {version:1,profiles,projects,selectedProfileId};
}
export function loadWorkspace(storage=localStorage){
 try{
  const raw=storage.getItem(STORE_KEY);
  if(raw)return validateWorkspace(JSON.parse(raw));
  const legacy=storage.getItem(LEGACY_KEY);
  if(legacy){
   const measurements=normalizeMeasures(JSON.parse(legacy));
   const profile={id:makeId(),name:'Mis medidas',measurements,updatedAt:now()};
   const workspace={...emptyWorkspace(),profiles:[profile],selectedProfileId:profile.id};
   storage.setItem(STORE_KEY,JSON.stringify(workspace));
   return workspace;
  }
 }catch(e){throw Error('No se pudieron leer las medidas guardadas. Podés importar un respaldo o restablecer los datos del sitio. '+e.message)}
 return emptyWorkspace();
}
export function saveWorkspace(workspace,storage=localStorage){
 const normalized=validateWorkspace(workspace);
 try{storage.setItem(STORE_KEY,JSON.stringify(normalized))}
 catch{throw Error('No se pudo guardar en este navegador. Revisá el espacio disponible o los permisos de almacenamiento.')}
 return normalized;
}
export function saveProfile(workspace,{id=null,name,measurements}){
 const m=normalizeMeasures(measurements),date=now(),profiles=[...workspace.profiles];
 if(id){
  const index=profiles.findIndex(p=>p.id===id);if(index<0)throw Error('Perfil inexistente.');
  profiles[index]={...profiles[index],name:cleanName(name,'Mis medidas'),measurements:m,updatedAt:date};
 }else{
  if(profiles.length>=limit)throw Error('Llegaste al máximo de 50 perfiles.');
  id=makeId();profiles.unshift({id,name:cleanName(name,'Mis medidas'),measurements:m,updatedAt:date});
 }
 return {...workspace,profiles,selectedProfileId:id};
}
export function saveProject(workspace,{id=null,name,measurements}){
 const m=normalizeMeasures(measurements),date=now(),projects=[...workspace.projects];
 if(id){
  const index=projects.findIndex(p=>p.id===id);if(index<0)throw Error('Proyecto inexistente.');
  projects[index]={...projects[index],name:cleanName(name,'Corpiño base'),measurements:m,updatedAt:date};
 }else{
  if(projects.length>=limit)throw Error('Llegaste al máximo de 50 proyectos.');
  id=makeId();projects.unshift({id,name:cleanName(name,'Corpiño base'),measurements:m,createdAt:date,updatedAt:date});
 }
 return {...workspace,projects};
}
export function deleteItem(workspace,type,id){
 if(type!=='profiles'&&type!=='projects')throw Error('Tipo inválido.');
 const next={...workspace,[type]:workspace[type].filter(item=>item.id!==id)};
 if(type==='profiles'&&workspace.selectedProfileId===id)next.selectedProfileId=null;
 return next;
}
export function exportBackup(workspace){
 return JSON.stringify({format:'mi-molde-respaldo',exportedAt:now(),workspace:validateWorkspace(workspace)},null,2);
}
export function importBackup(text){
 if(text.length>1000000)throw Error('El respaldo es demasiado grande.');
 const data=JSON.parse(text);
 if(data.format!=='mi-molde-respaldo')throw Error('No es un respaldo de Mi Molde.');
 return validateWorkspace(data.workspace);
}

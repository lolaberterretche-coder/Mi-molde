import test from 'node:test';
import assert from 'node:assert/strict';
import {definitions} from '../js/engine.js';
import {emptyWorkspace,validateWorkspace,saveProfile,saveProject,deleteItem,exportBackup,importBackup,loadWorkspace,saveWorkspace,STORE_KEY,LEGACY_KEY} from '../js/storage.js';
const measures=Object.fromEntries(definitions.map(([key,,value])=>[key,value]));
const fakeStorage=()=>{
 const map=new Map();
 return {getItem:key=>map.get(key)??null,setItem:(key,value)=>map.set(key,String(value)),removeItem:key=>map.delete(key)};
};
test('guardar y recuperar proyectos y perfiles',()=>{
 const storage=fakeStorage();
 let state=saveProfile(emptyWorkspace(),{name:'Lola',measurements:measures});
 state=saveProject(state,{name:'Mi corpiño',measurements:measures});
 saveWorkspace(state,storage);
 const recovered=loadWorkspace(storage);
 assert.equal(recovered.profiles.length,1);
 assert.equal(recovered.projects[0].name,'Mi corpiño');
 assert.equal(recovered.profiles[0].measurements.bust,92);
});
test('editar proyecto conserva su identificador',()=>{
 let state=saveProject(emptyWorkspace(),{name:'Primero',measurements:measures});
 const id=state.projects[0].id;
 state=saveProject(state,{id,name:'Editado',measurements:{...measures,bust:96}});
 assert.equal(state.projects.length,1);
 assert.equal(state.projects[0].id,id);
 assert.equal(state.projects[0].measurements.bust,96);
});
test('eliminar perfil limpia la selección',()=>{
 let state=saveProfile(emptyWorkspace(),{name:'Mis medidas',measurements:measures});
 state=deleteItem(state,'profiles',state.selectedProfileId);
 assert.equal(state.profiles.length,0);
 assert.equal(state.selectedProfileId,null);
});
test('respaldo exportable e importable',()=>{
 const state=saveProject(emptyWorkspace(),{name:'Corpiño',measurements:measures});
 assert.deepEqual(importBackup(exportBackup(state)),validateWorkspace(state));
});
test('rechazar respaldos corruptos',()=>{
 assert.throws(()=>importBackup('{"format":"otro"}'),/respaldo/);
 assert.throws(()=>validateWorkspace({version:2,profiles:[],projects:[]}),/incompatible/);
});
test('migrar medidas antiguas sin perderlas',()=>{
 const storage=fakeStorage();
 storage.setItem(LEGACY_KEY,JSON.stringify(measures));
 const state=loadWorkspace(storage);
 assert.equal(state.profiles[0].measurements.waist,68);
 assert.ok(storage.getItem(STORE_KEY));
});

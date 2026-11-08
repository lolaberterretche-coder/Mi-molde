import {definitions,generate} from './engine.js';
import {draw,printTiles} from './render.js';
import {measurementHelp,validateMeasurements} from './measurements.js';
import {guideStep,completedCount,measurementGuide} from './guide.js';
import {defaultMeasures,loadWorkspace,saveWorkspace,saveProfile,saveProject,deleteItem,exportBackup,importBackup,normalizeMeasures} from './storage.js';

const $=selector=>document.querySelector(selector);
const fields=$('#fields'),form=$('#measurements'),error=$('#error'),result=$('#result');
const preview=$('#preview'),summary=$('#summary'),profileSelect=$('#profile-select');
const escapeHtml=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const formatDate=value=>{const date=new Date(value);return Number.isNaN(date.getTime())?'Fecha desconocida':date.toLocaleDateString('es-AR',{day:'2-digit',month:'short',year:'numeric'})};
let workspace,model=null,editingProjectId=null,editingProfileId=null,guideIndex=0;
try{workspace=loadWorkspace()}catch(e){workspace={version:1,profiles:[],projects:[],selectedProfileId:null};queueMicrotask(()=>notify(e.message))}
fields.innerHTML=definitions.map(([key,label,initial])=>`<div class="measurement"><label class="field" for="${key}">${label} <span class="unit">cm</span><input id="${key}" name="${key}" type="number" min="1" step=".1" value="${initial}" required inputmode="decimal" aria-describedby="help-${key}"></label><p class="help" id="help-${key}">${measurementHelp[key]}</p></div>`).join('');

function renderGuide(){
 const step=guideStep(guideIndex),count=completedCount(Object.fromEntries(definitions.map(([key])=>[key,form.elements[key].value])));
 $('#guide-counter').textContent=`${count} de 9 medidas completadas`;
 $('#guide-step-label').textContent=`MEDIDA ${String(guideIndex+1).padStart(2,'0')} / 09`;
 $('#guide-title').textContent=step.title;
 $('#guide-instruction').textContent=step.instruction;
 $('#guide-tip').textContent=step.tip;
 $('#guide-progress').setAttribute('aria-valuenow',String(count));
 $('#guide-progress-fill').style.width=`${count/measurementGuide.length*100}%`;
 $('#guide-prev').disabled=guideIndex===0;
 $('#guide-next').disabled=guideIndex===measurementGuide.length-1;
 for(const [i,entry] of measurementGuide.entries()){
  const el=form.elements[entry.key]?.closest('.measurement');
  if(el)el.classList.toggle('selected-measurement',i===guideIndex);
 }
}
function selectGuide(index,{focus=false}={}){
 guideIndex=Math.max(0,Math.min(measurementGuide.length-1,index));
 renderGuide();
 if(focus)form.elements[guideStep(guideIndex).key].focus();
}
$('#guide-prev').addEventListener('click',()=>selectGuide(guideIndex-1,{focus:true}));
$('#guide-next').addEventListener('click',()=>selectGuide(guideIndex+1,{focus:true}));
fields.addEventListener('focusin',event=>{
 const index=measurementGuide.findIndex(step=>step.key===event.target.name);
 if(index>=0&&index!==guideIndex)selectGuide(index);
});
form.addEventListener('input',renderGuide);
function notify(message){const el=$('#toast');el.textContent=message;el.hidden=false}
function persist(next){workspace=saveWorkspace(next);renderLists()}
function values(){return Object.fromEntries(definitions.map(([key])=>[key,Number(form.elements[key].value)]))}
function setValues(m){for(const [key] of definitions)form.elements[key].value=m[key];renderGuide()}
function validValues(){const m=values(),errors=validateMeasurements(m);if(errors.length)throw Error(errors.join(' '));return normalizeMeasures(m)}
function resetPreview(){model=null;result.hidden=true;$('#preview-empty').hidden=false;error.textContent=''}
function editorNew(){editingProjectId=null;editingProfileId=null;$('#project-name').value='Mi corpiño base';setValues(defaultMeasures());profileSelect.value='';$('#editor-heading').textContent='Crear corpiño base';resetPreview()}
function go(route){const allowed=['inicio','como-funciona','preparacion','ayuda','proyectos','medidas','crear','revision','generacion','visualizacion','exportacion'];const page=allowed.includes(route)?route:'inicio';for(const id of allowed)$('#view-'+id).hidden=id!==page;for(const a of document.querySelectorAll('[data-route]')){const active=a.dataset.route===page;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')}$('#breadcrumb').textContent={inicio:'Inicio','como-funciona':'Cómo funciona',preparacion:'Preparación',ayuda:'Ayuda',proyectos:'Mis proyectos',medidas:'Mis medidas',crear:'Crear molde',revision:'Revisión',generacion:'Generación',visualizacion:'Visualización',exportacion:'Exportación'}[page];window.scrollTo({top:0,behavior:'instant'})}
function route(){go(location.hash.replace('#',''))}
window.addEventListener('hashchange',route);

function renderLists(){
 $('#count-projects').textContent=workspace.projects.length;
 $('#count-profiles').textContent=workspace.profiles.length;
 profileSelect.innerHTML='<option value="">Medidas actuales</option>'+workspace.profiles.map(p=>`<option value="${escapeHtml(p.id)}">${escapeHtml(p.name)}</option>`).join('');
 if(editingProfileId&&workspace.profiles.some(p=>p.id===editingProfileId))profileSelect.value=editingProfileId;
 const projectCard=p=>`<article class="project-card"><span class="eyebrow">CORPIÑO BASE</span><h3>${escapeHtml(p.name)}</h3><span class="meta">Actualizado ${formatDate(p.updatedAt)}</span><span class="meta">Busto: ${p.measurements.bust} cm · Cintura: ${p.measurements.waist} cm</span><div class="card-actions"><button type="button" data-action="open-project" data-id="${escapeHtml(p.id)}">Abrir y editar</button><button type="button" class="secondary" data-action="delete-project" data-id="${escapeHtml(p.id)}">Eliminar</button></div></article>`;
 const emptyProjects='<div class="empty-state"><strong>Todavía no guardaste proyectos</strong><p>Creá tu primer molde y guardalo para retomarlo más adelante.</p></div>';
 $('#projects-list').innerHTML=workspace.projects.length?workspace.projects.map(projectCard).join(''):emptyProjects;
 $('#recent-projects').innerHTML=workspace.projects.length?workspace.projects.slice().sort((a,b)=>String(b.updatedAt).localeCompare(String(a.updatedAt))).slice(0,3).map(projectCard).join(''):emptyProjects;
 $('#profiles-list').innerHTML=workspace.profiles.length?workspace.profiles.map(p=>`<article class="project-card"><span class="eyebrow">PERFIL DE MEDIDAS</span><h3>${escapeHtml(p.name)}</h3><span class="meta">Actualizado ${formatDate(p.updatedAt)}</span><span class="meta">Busto: ${p.measurements.bust} cm · Cintura: ${p.measurements.waist} cm</span><div class="card-actions"><button type="button" data-action="open-profile" data-id="${escapeHtml(p.id)}">Usar y editar</button><button type="button" class="secondary" data-action="delete-profile" data-id="${escapeHtml(p.id)}">Eliminar</button></div></article>`).join(''):'<div class="empty-state"><strong>Todavía no guardaste perfiles</strong><p>Podés crear uno con tus medidas desde el editor.</p></div>';
}
function showEditor(){location.hash='crear';go('crear')}
function openProject(id){const p=workspace.projects.find(item=>item.id===id);if(!p)return;editingProjectId=id;editingProfileId=null;$('#project-name').value=p.name;setValues(p.measurements);$('#editor-heading').textContent='Editar proyecto';resetPreview();showEditor();notify('Proyecto cargado. Generá el molde para ver la vista previa.')}
function openProfile(id){const p=workspace.profiles.find(item=>item.id===id);if(!p)return;editingProfileId=id;editingProjectId=null;$('#project-name').value='Corpiño base · '+p.name;setValues(p.measurements);$('#editor-heading').textContent='Crear con mis medidas';resetPreview();showEditor();profileSelect.value=id}
function saveCurrentProject(){
 try{const m=validValues();const name=$('#project-name').value.trim();if(!name)throw Error('Ingresá un nombre para el proyecto.');
  const next=saveProject(workspace,{id:editingProjectId,name,measurements:m});persist(next);
  if(!editingProjectId)editingProjectId=workspace.projects[0].id;
  notify('Proyecto guardado en este navegador.');
 }catch(e){error.textContent=e.message}
}
function saveCurrentProfile(){
 try{const m=validValues();const previous=workspace.profiles.find(p=>p.id===editingProfileId);
  const name=window.prompt('Nombre del perfil de medidas:',previous?.name??'Mis medidas');
  if(name===null)return;if(!name.trim())throw Error('El perfil necesita un nombre.');
  const next=saveProfile(workspace,{id:editingProfileId,name,measurements:m});persist(next);
  editingProfileId=workspace.selectedProfileId;profileSelect.value=editingProfileId;
  notify('Perfil de medidas guardado en este navegador.');
 }catch(e){error.textContent=e.message}
}
function generatePattern(){
 error.textContent='';
 try{const m=validValues();model=generate(m);preview.innerHTML=draw(model);
  summary.textContent=`Pinza lateral: ${model.d} cm · patas rectificadas: ${model.truedLeg.toFixed(2)} cm · diferencia lateral calculada: ${(model.difference*10).toFixed(1)} mm.`;
  result.hidden=false;$('#preview-empty').hidden=true;
 }catch(e){error.textContent=e.message;resetPreview();error.textContent=e.message}
}
function downloadText(name,content,type){
 const url=URL.createObjectURL(new Blob([content],{type})),a=document.createElement('a');
 a.href=url;a.download=name;document.body.append(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
}
document.addEventListener('click',event=>{
 const button=event.target.closest('[data-action]');if(!button)return;
 const {action,id}=button.dataset;
 if(action==='begin-flow'){editorNew();location.hash='preparacion';go('preparacion')}
 if(action==='go-home'){location.hash='inicio';go('inicio')}
 if(action==='go-measurements'){showEditor()}
 if(action==='open-project')openProject(id);
 if(action==='open-profile')openProfile(id);
 if(action==='delete-project'||action==='delete-profile'){
  const type=action==='delete-project'?'projects':'profiles';
  const item=workspace[type].find(p=>p.id===id);if(!item)return;
  if(!confirm(`¿Eliminar "${item.name}" de este navegador? Esta acción no se puede deshacer.`))return;
  try{persist(deleteItem(workspace,type,id));if(type==='projects'&&editingProjectId===id)editorNew();if(type==='profiles'&&editingProfileId===id)editingProfileId=null;notify('Elemento eliminado.')}catch(e){notify(e.message)}
 }
});
$('#start-create').addEventListener('click',()=>{editorNew();location.hash='preparacion';go('preparacion')});
$('#projects-create').addEventListener('click',()=>{editorNew();showEditor()});
$('#profiles-create').addEventListener('click',()=>{editorNew();showEditor();$('#project-name').focus();notify('Completá las medidas y elegí «Guardar estas medidas».')});
form.addEventListener('submit',event=>{event.preventDefault();generatePattern()});
form.addEventListener('input',()=>{if(model)resetPreview();error.textContent=''});
$('#save-project').addEventListener('click',saveCurrentProject);
$('#save-profile').addEventListener('click',saveCurrentProfile);
profileSelect.addEventListener('change',()=>{const id=profileSelect.value;if(id)openProfile(id)});
$('#print').addEventListener('click',()=>{if(!model)return;try{printTiles(model)}catch(e){error.textContent=e.message}});
$('#download').addEventListener('click',()=>{if(model)downloadText('mi-molde-corpino-base.svg',draw(model),'image/svg+xml;charset=utf-8')});
$('#backup-export').addEventListener('click',()=>{try{downloadText('mi-molde-respaldo.json',exportBackup(workspace),'application/json');notify('Respaldo descargado.')}catch(e){notify(e.message)}});
$('#backup-import').addEventListener('change',async event=>{
 const file=event.target.files?.[0];event.target.value='';if(!file)return;
 try{
  if(file.size>1000000)throw Error('El archivo es demasiado grande.');
  const incoming=importBackup(await file.text());
  if(!confirm('¿Reemplazar todos los proyectos y perfiles locales por los del respaldo?'))return;
  persist(incoming);editorNew();notify('Respaldo importado correctamente.');
 }catch(e){notify('No se pudo importar el respaldo: '+e.message)}
});
$('#workspace-toggle').addEventListener('click',()=>{
 const menu=$('#workspace-menu'),open=menu.classList.toggle('is-open');
 $('#workspace-toggle').setAttribute('aria-expanded',String(open));
});
document.querySelectorAll('#workspace-menu a').forEach(a=>a.addEventListener('click',()=>{
 $('#workspace-menu').classList.remove('is-open');
 $('#workspace-toggle').setAttribute('aria-expanded','false');
}));
function navigateFlow(page){location.hash=page;go(page)}
function renderReview(){
 $('#review-measures').innerHTML=definitions.map(([key,label])=>`<tr><td>${escapeHtml(label)}</td><td>${escapeHtml(form.elements[key].value||'—')} cm</td><td><button type="button" class="text-button" data-review-edit="${key}">Editar</button></td></tr>`).join('');
}
$('#go-review').addEventListener('click',()=>{
 try{validValues();error.textContent='';renderReview();navigateFlow('revision')}
 catch(e){error.textContent=e.message;notify(e.message)}
});
$('#review-measures').addEventListener('click',event=>{
 const key=event.target.closest('[data-review-edit]')?.dataset.reviewEdit;
 if(!key)return;
 const i=measurementGuide.findIndex(step=>step.key===key);
 if(i>=0)selectGuide(i);
 showEditor();form.elements[key].focus();
});
$('#review-back').addEventListener('click',showEditor);
$('#review-generate').addEventListener('click',()=>{
 generatePattern();
 if(!model){notify(error.textContent||'No se pudo generar el molde.');return}
 $('#generation-status').textContent='Molde generado con las medidas revisadas. Ya podés visualizar las piezas.';
 navigateFlow('generacion');
});
$('#generation-back').addEventListener('click',()=>{renderReview();navigateFlow('revision')});
$('#generation-view').addEventListener('click',()=>{
 if(!model){notify('Primero generá el molde desde la revisión.');return}
 $('#visual-pattern').innerHTML=draw(model);setZoom(100);navigateFlow('visualizacion');
});
let zoom=100;
function setZoom(value){
 zoom=Math.max(50,Math.min(200,value));
 $('#zoom-value').textContent=zoom+' %';
 $('#zoom-value-side').textContent=zoom+' %';
 const svg=$('#visual-pattern svg');if(svg){svg.style.width=zoom+'%';svg.style.maxWidth='none';svg.style.height='auto'}
}
$('#zoom-in').addEventListener('click',()=>setZoom(zoom+25));
$('#zoom-out').addEventListener('click',()=>setZoom(zoom-25));
$('#visual-back').addEventListener('click',showEditor);
$('#visual-export').addEventListener('click',()=>navigateFlow('exportacion'));
$('#export-back').addEventListener('click',()=>navigateFlow('visualizacion'));
document.querySelectorAll('input[name="export-format"]').forEach(el=>el.addEventListener('change',()=>{
 $('#export-action').textContent=el.value==='svg'?'Descargar SVG →':'Imprimir molde →';
}));
$('#export-action').addEventListener('click',()=>{
 if(!model){notify('Primero generá el molde.');return}
 const format=document.querySelector('input[name="export-format"]:checked').value;
 if(format==='svg')downloadText('mi-molde-corpino-base.svg',draw(model),'image/svg+xml;charset=utf-8');
 else try{printTiles(model)}catch(e){notify(e.message)}
});
const themeKey='mi-molde:tema';
function applyTheme(mode){
 const dark=mode==='dark';
 document.documentElement.dataset.theme=dark?'dark':'light';
 $('#theme-toggle').innerHTML=dark?'☀ <span>Light</span>':'☾ <span>Dark</span>';
 try{localStorage.setItem(themeKey,dark?'dark':'light')}catch{}
}
$('#theme-toggle').addEventListener('click',()=>applyTheme(document.documentElement.dataset.theme==='dark'?'light':'dark'));
let initialTheme='light';try{initialTheme=localStorage.getItem(themeKey)||'light'}catch{}
applyTheme(initialTheme);
renderGuide();renderLists();route();

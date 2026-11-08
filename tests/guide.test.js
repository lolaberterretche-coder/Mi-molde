import test from 'node:test';
import assert from 'node:assert/strict';
import {measurementGuide,guideStep,completedCount} from '../js/guide.js';
test('la guía contempla exactamente las nueve medidas del motor',()=>{
 assert.equal(measurementGuide.length,9);
 assert.deepEqual(measurementGuide.map(x=>x.key),['bust','waist','hip','backLength','backWidth','shoulder','neck','bustHeight','bustSpacing']);
});
test('cada medida tiene instrucciones y consejo',()=>{
 for(const step of measurementGuide){assert.ok(step.instruction.length>10);assert.ok(step.tip.length>10)}
});
test('navegación impide índices fuera de rango',()=>{
 assert.equal(guideStep(0).key,'bust');
 assert.equal(guideStep(8).key,'bustSpacing');
 assert.throws(()=>guideStep(9),/inexistente/);
});
test('progreso cuenta solo campos positivos completados',()=>{
 assert.equal(completedCount({bust:'92',waist:'',hip:'-1'}),1);
 assert.equal(completedCount({bust:'92',waist:'68',hip:'96'}),3);
});

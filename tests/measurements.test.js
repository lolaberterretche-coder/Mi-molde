import test from 'node:test';
import assert from 'node:assert/strict';
import {definitions} from '../js/engine.js';
import {validateMeasurements,measurementHelp} from '../js/measurements.js';
const sample=Object.fromEntries(definitions.map(([key,,value])=>[key,value]));
test('medidas de ejemplo pasan las validaciones',()=>assert.deepEqual(validateMeasurements(sample),[]));
test('cada medida tiene una guía',()=>{for(const [key] of definitions)assert.ok(measurementHelp[key]?.length>20)});
test('rechaza valores vacíos y negativos',()=>{
 assert.ok(validateMeasurements({...sample,hip:0}).length);
 assert.ok(validateMeasurements({...sample,neck:-1}).length);
});
test('rechaza separación de busto imposible',()=>assert.ok(validateMeasurements({...sample,bustSpacing:100}).length));
test('rechaza espalda demasiado ancha',()=>assert.ok(validateMeasurements({...sample,backWidth:80}).length));

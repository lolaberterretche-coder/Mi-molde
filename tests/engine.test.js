import test from 'node:test';
import assert from 'node:assert/strict';
import {definitions,dartDepth,generate} from '../js/engine.js';
const sample=Object.fromEntries(definitions.map(([key,,value])=>[key,value]));
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
test('tabla de pinzas: extremos y categorías',()=>{
 for(const [b,d] of [[78,4],[87,4],[88,5],[97,5],[98,6],[107,6],[108,7],[117,7],[118,8],[127,8]])assert.equal(dartDepth(b),d);
 assert.equal(dartDepth(77),null);assert.equal(dartDepth(128),null);
});
test('las patas corregidas son iguales',()=>{
 const x=generate(sample);
 assert.ok(Math.abs(distance(x.front.J,x.front.L)-distance(x.front.J,x.front.M))<1e-8);
});
test('las patas rectificadas son iguales tras reabrir',()=>{
 const x=generate(sample);
 assert.ok(Math.abs(distance(x.front.J,x.front.trueUpper)-distance(x.front.J,x.front.trueLower))<1e-8);
});
test('la cintura delantera conserva la compensación vertical',()=>{
 const x=generate(sample);
 assert.equal(x.front.I.y,sample.backLength+x.d);
 assert.equal(x.front.hip.y,x.back.hip.y+x.d);
});
test('rechaza bustos fuera de la tabla',()=>{
 assert.throws(()=>generate({...sample,bust:70}),/tabla contempla/);
});

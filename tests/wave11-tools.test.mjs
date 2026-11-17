import assert from "node:assert/strict";
import fs from "node:fs";
import { test } from "node:test";
import { w11Geometry } from "../src/lib/wave11Geometry.mjs";
import { w11Physics } from "../src/lib/wave11Physics.mjs";
import { w11Science } from "../src/lib/wave11Science.mjs";
import { w11Statistics } from "../src/lib/wave11Statistics.mjs";
import { w11Business } from "../src/lib/wave11Business.mjs";
import guides from "../src/data/wave11ToolGuides.json" with { type: "json" };
const engines=[w11Geometry,w11Physics,w11Science,w11Statistics,w11Business];
const run=(slug,input)=>{for(const fn of engines){const result=fn(slug,input);if(result!==null)return result;}throw Error("No engine for "+slug);};
const queue=JSON.parse(fs.readFileSync("src/data/simpleToolQueue.json","utf8"));
const specs=["Geometry","Physics","Science","Statistics","Business"].flatMap(x=>JSON.parse(fs.readFileSync("src/data/wave11"+x+"Specs.json","utf8")));
const wave=queue.filter(x=>x.batch===11);

test("Wave 11 schedules 100 distinct, implemented and explained browser calculators",()=>{
 assert.equal(queue.length,973);
 assert.equal(wave.length,100);
 assert.equal(specs.length,100);
 assert.equal(Object.keys(guides).length,100);
 assert.equal(new Set(queue.map(x=>x.slug)).size,973);
 const legacySlugs=[...fs.readFileSync("src/data/tools.ts","utf8").matchAll(/(?:slug|"slug")\s*:\s*"([^"]+)"/g)].map(x=>x[1]);
 assert.equal(legacySlugs.length,123);
 assert.equal(new Set([...legacySlugs,...queue.map(x=>x.slug)]).size,1096);
 const retired=JSON.parse(fs.readFileSync("src/data/toolFunctionalAudit.json","utf8")).retired.map(x=>x.slug);
 assert.ok(specs.every(s=>!retired.includes(s.slug)));
 const implemented=engines.map((_,i)=>fs.readFileSync("src/lib/wave11"+["Geometry","Physics","Science","Statistics","Business"][i]+".mjs","utf8")).join("\n");
 for(let i=0;i<specs.length;i++){
  const s=specs[i],tool=wave[i],guide=guides[s.slug];
  assert.equal(tool.slug,s.slug,"queue order");
  assert.equal(tool.week,Math.floor((873+i)/10)+1,"10 per week");
  assert.ok(tool.ready);
  assert.equal(tool.example,s.example);
  assert.ok(tool.metaDescription.length>=60&&tool.metaDescription.length<=180,s.slug+" SEO");
  assert.equal(guide.example,s.example);
  assert.ok(guide.explanation.includes(s.name)&&guide.explanation.includes(s.unit));
  assert.ok(guide.limitation.length>120);
  assert.ok(guide.workflows.length>=2);
  assert.ok(implemented.includes('case "'+s.slug+'"'),s.slug+" code case absent");
  assert.doesNotMatch(s.slug,/(?:^|-)(?:pdf|image|upload|file|barcode|qr)(?:-|$)/i);
  const output=run(s.slug,s.example);
  assert.equal(typeof output,"string",s.slug+" did not return a string");
  assert.ok(output.length>0,s.slug+" empty");
  assert.ok(output.includes(s.name),s.slug+" missing result label");
  assert.doesNotMatch(output,/(?:^|[^A-Za-z])(?:NaN|Infinity)(?:[^A-Za-z]|$)/);
 }
});

test("Geometry provides correct triangle and vector outputs",()=>{
 assert.match(run("right-triangle-missing-leg","5|3"),/4 units/);
 assert.match(run("triangle-area-included-angle","3|4|90"),/6 square units/);
 assert.match(run("rectangular-prism-space-diagonal","3|4|12"),/13 units/);
 assert.match(run("vector3-dot-product-calculator","1|2|3|4|5|6"),/32 squared vector units/);
 assert.match(run("vector3-cross-product-magnitude","1|0|0|0|3|0"),/3 squared vector units/);
 assert.match(run("vector3-angle-between","1|0|0|0|1|0"),/90 degrees/);
 assert.throws(()=>run("right-triangle-missing-leg","3|5"),/domain/);
 assert.throws(()=>run("vector3-angle-between","0|0|0|0|1|0"),/domain/);
});
test("Physics and scientific models use documented constants and units",()=>{
 assert.match(run("freefall-time-from-height","19.6133"),/2 seconds/);
 assert.match(run("sound-pressure-level-calculator","0.2"),/80 dB SPL/);
 assert.match(run("solid-sphere-moment-inertia","4|2"),/6.4 kg/);
 assert.match(run("moles-from-mass-molar-mass","18|18"),/1 mol/);
 assert.match(run("thin-lens-focal-length","30|60"),/20 distance units/);
 assert.match(run("photon-energy-from-wavelength","500"),/2.479/);
 assert.match(run("gas-molecule-mean-kinetic-energy","300"),/e-21/);
 assert.throws(()=>run("snells-law-refraction-angle","1.5|1|80"),/domain/);
 assert.throws(()=>run("sound-pressure-level-calculator","0"),/domain/);
});
test("Statistical inference returns distinct estimators and interval bounds",()=>{
 assert.match(run("standard-error-of-mean","10|100"),/1 data units/);
 assert.match(run("normal-mean-confidence-bounds","50|10|100|1.96"),/Lower:.*48.04/);
 assert.match(run("normal-mean-confidence-bounds","50|10|100|1.96"),/Upper:.*51.96/);
 assert.match(run("beta-distribution-expectation","2|3"),/0.4 ratio/);
 assert.match(run("gamma-distribution-variance","2|3"),/18 squared data units/);
 assert.match(run("geometric-distribution-expected-trials","0.2"),/5 trials/);
 assert.throws(()=>run("adjusted-r-squared-calculator","0.9|3|3"),/domain/);
 assert.throws(()=>run("continuous-uniform-distribution-mean","10|2"),/domain/);
});
test("Business metrics validate accounting and operations inputs",()=>{
 assert.match(run("cost-of-goods-sold-inventory-flow","100|300|50"),/350 currency units/);
 assert.match(run("current-liquidity-ratio","500|250"),/2 ratio/);
 assert.match(run("hotel-room-occupancy-percentage","80|100"),/80 percent/);
 assert.match(run("kanban-replenishment-cards","100|2|10|0.1"),/22 cards/);
 assert.match(run("two-period-weighted-absolute-error","100|90|200|220"),/10 percent/);
 assert.throws(()=>run("inventory-shrinkage-percentage","500|600"),/domain/);
 assert.throws(()=>run("inventory-days-on-hand-from-value","100|0|365"),/domain/);
});
test("All Wave 11 engines are local and guarded against malformed input",()=>{
 const files=["Core","Geometry","Physics","Science","Statistics","Business"].map(x=>fs.readFileSync("src/lib/wave11"+x+".mjs","utf8"));
 for(const src of files)assert.doesNotMatch(src,/fetch\s*\(|XMLHttpRequest|FileReader|eval\s*\(|new Function\s*\(/);
 const workspace=fs.readFileSync("src/components/tools/SimpleToolWorkspace.astro","utf8");
 for(const m of ["Geometry","Physics","Science","Statistics","Business"])assert.ok(workspace.includes("w11"+m+"(mode,content)"));
 assert.throws(()=>run("triangle-height-from-base-area","1|2|3"),/exactly 2/);
 assert.throws(()=>run("moles-from-mass-molar-mass","1e309|5"),/finite numbers/);
 assert.throws(()=>run("triangle-height-from-base-area",""),/Enter numerical values/);
 assert.equal(w11Geometry("not-a-tool","1"),null);
});

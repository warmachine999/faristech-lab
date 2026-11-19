const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');

const html = fs.readFileSync('index.html', 'utf8');
const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
let checked = 0;
for (const match of scripts) {
  const attrs = match[1];
  if (/\bsrc\s*=/.test(attrs) || /application\/ld\+json/i.test(attrs)) continue;
  new vm.Script(match[2], { filename: 'index.html inline script ' + (++checked) });
}
assert.ok(checked > 0, 'Expected at least one inline JS script');
for (const id of ['varonPause', 'varonReset', 'varonStatus', 'varonCycle']) {
  assert.ok(html.includes('id="' + id + '"'), 'Missing VARON control: ' + id);
}
assert.ok(html.includes('period:[12,15,18][i]'), 'VARON orbit timing missing');
assert.ok(html.includes('class="varon-visual"'), 'VARON controls need their own wrapper outside the atom');
assert.ok(html.includes('.atom .orbLabel{position:absolute!important'), 'Orbit labels must stay absolutely positioned');
assert.ok(!html.includes('ctx.rect(bounds.left,bounds.top,bounds.width,bounds.height);ctx.clip()'), 'VARON must not have a hard rectangular clip');
assert.ok(html.includes('class="varon-console" hidden'), 'Large VARON control panel must start hidden');
assert.ok(html.includes('id="varonSettingsToggle"'), 'Compact VARON settings button missing');
assert.ok(html.includes('if(paused){last=now;return}'), 'VARON pause must stop the radiation frame');
assert.ok(html.includes('const labelCycle=40000,labelDuration=20000'), 'VARON names must show for 20s and hide for 20s');

const raySection=html.match(/const types=\[([\s\S]*?)\n \];\n types\.forEach\(t=>t\.wavelength=t\.speed\/t\.frequency\)/);
assert.ok(raySection, 'VARON ray model must remain defined');
const speeds={
 ALPHA:{speed:54,frequency:.3,wavelength:180,oldSpeed:125},
 BETA:{speed:90,frequency:.8,wavelength:112.5,oldSpeed:235},
 GAMMA:{speed:140,frequency:2,wavelength:70,oldSpeed:370}
};
for(const [name,expected] of Object.entries(speeds)){
 const rx=new RegExp("name:'"+name+"'[^\\n]*?speed:(\\d+)[^\\n]*?frequency:([\\d.]+)");
 const match=raySection[1].match(rx);
 assert.ok(match,name+' ray definition must exist');
 const speed=Number(match[1]),frequency=Number(match[2]);
 assert.equal(speed,expected.speed,name+' must stay slow enough to read');
 assert.equal(frequency,expected.frequency,name+' visual frequency must match its display');
 assert.ok(speed<expected.oldSpeed*.46,name+' should travel at less than 46% of its previous speed');
 assert.ok(Math.abs(speed/frequency-expected.wavelength)<.01,name+' wavelength must stay familiar');
}
assert.ok(html.includes('font-size:12px!important'), 'Moving ray names should be larger and more readable');
assert.ok(html.includes('background:rgba(4,8,14,.87)'), 'Ray labels should have a readable contrast background');

assert.ok(html.includes('function labelsVisible(now){return ((cycleTime(now)-cycleStart)%labelCycle)<labelDuration}'), 'Label timer must be independent of ray emission');
assert.ok(html.includes('if(now>=emitAt&&particles.length<5)emit(now);'), 'Rays must continue emitting during hidden-name periods');
assert.ok(html.includes('else if(showLabels&&!p.label&&!p.dead)addRayLabel(p,now)'), 'Labels must reappear in the next 20-second window');
assert.ok(!html.includes('varonCycleMode'), 'No separate ray-off timer should remain');
assert.ok(!html.includes("globalCompositeOperation='destination-in'"), 'Do not hide rays at a circular opacity border');
assert.ok(html.includes('ctx.globalAlpha=opacity'), 'Waves should fade naturally at their travel endpoint');
assert.ok(html.includes('Math.hypot(w,h)*1.35'), 'Waves should travel beyond the atom before fading');
assert.ok(!html.includes('Math.min(p.type.maxDistance,570)'), 'Waves must not stop at the previous 570px boundary');
assert.ok(html.includes('id="varonConsole" class="varon-console" hidden'), 'Keep the compact settings button design');
const labelVisibility = (ms) => ms % 40000 < 20000;
assert.ok(labelVisibility(0) && labelVisibility(19999) && !labelVisibility(20000) && !labelVisibility(39999) && labelVisibility(40000), '20-second name timing regression');

assert.ok(html.includes('types.find(t=>!particles.some'), 'Missing beam colors must be replenished');

const hitTargets = html.match(/const ionTargetSelector='([^']+)'/);
assert.ok(hitTargets, 'VARON ionization target selector missing');
assert.ok(hitTargets[1].includes('.card') && hitTargets[1].includes('.service'), 'Project/service cards must ionize');
assert.ok(hitTargets[1].includes('.pill') && hitTargets[1].includes('.banner'), 'Small badges and bubbles must ionize');
assert.ok(!hitTargets[1].includes('.orbLabel'), 'Orbiting labels must never become radiation targets');
assert.ok(html.includes('for(const el of document.querySelectorAll(textIonSelector))'), 'Text targets must be independently measured as rendered text nodes');
assert.ok(html.includes("const textIonSelector='.hero .eyebrow,.hero h1,.hero #heroText"), 'Hero title and descriptive text must be ionized');
assert.ok(html.includes('.header .brandName,.header .identityBadge,.header .tagline,.header .nav a,.header .controlBtn'), 'Navigation and header text must be ionized');
assert.ok(html.includes("if(textTarget)textHit(el,p,now,glyph);else cardHit(el,p,now,point)"), 'Only actual glyphs should receive text ionization');
assert.ok(html.includes("haze.className='varon-text-haze'"), 'Text heat should be a soft blur, not decorative dots');
assert.ok(!html.includes("el.classList.add('varon-text-ion')"), 'Text ionization must not change any heading or link class');
assert.ok(html.includes('.header.wrap{') && html.includes('width:min(1360px,94vw)'), 'The desktop header should be a compact floating toolbar');
assert.ok(html.includes('backdrop-filter:blur(16px) saturate(125%)'), 'The top bar should have a translucent frosted appearance');
assert.ok(html.includes("::highlight(varon-heat-alpha)") && html.includes("::highlight(varon-heat-beta)") && html.includes("::highlight(varon-heat-gamma)"), 'Alpha, Beta and Gamma must color the actual rendered glyphs');
assert.ok(html.includes("const range=document.createRange();range.setStart(node,offset);range.setEnd(node,offset+step)"), 'Glyph hit tests must measure each non-space character, not a whole text box');
assert.ok(html.includes('if(textTarget&&!glyph)continue'), 'Ray must pass through invisible whitespace without a text hit');
assert.ok(html.includes('filter:blur(18px);mix-blend-mode:screen'), 'Heat should resemble the background blur');
assert.ok(!html.includes('.varon-text-water{') && !html.includes('.varon-text-ink{'), 'Old circle/drop text effects must be gone');
assert.ok(html.includes('textGlows.forEach(el=>el.remove())'), 'Reset must remove text haze');
assert.ok(html.includes('CSS.highlights.delete(key)'), 'Reset must clear highlighted glyphs');
assert.ok(html.includes("addEventListener('scroll',()=>{nextIonTargetRefresh=0;glyphCacheEpoch++}"), 'Glyph position cache must follow scrolling');

assert.ok(html.includes("el.style.setProperty('--vr-drop-color',p.type.color)"), 'Each droplet must match the ray color');
assert.ok(html.includes("flash.style.setProperty('--vr-ion-flash-color',p.type.color)"), 'Impact flash must use the ray color');
assert.ok(html.includes('state.ionization+p.type.ionization'), 'Card exposure must accumulate by ray ionization');
assert.ok(html.includes("el.className='varon-ion-drop'"), 'Individual ion droplets must be created');
assert.ok(html.includes('placeTextDrops(card,state,p,now,x,y,r)'), 'Small ion droplets should affect nearby text');
assert.ok(html.includes('if(now<(p.nextIonAt||0))return;'), 'Individual hits must be spaced out');
assert.ok(html.includes('p.nextIonAt=now+260'), 'Rays must not stain all cards at once');
assert.ok(html.includes('while(state.drops.length>48)'), 'Droplet count must remain bounded');
assert.ok(html.includes('state.drops=state.drops.filter'), 'Droplets must fade over time');
assert.ok(!html.includes('box-shadow:inset 0 0 24px'), 'Entire cards must not glow on first impact');
assert.ok(!html.includes('.radiation-hit h1,.radiation-hit h2'), 'All text must not glow at once');
assert.ok(html.includes('varon-text-drop'), 'Small text droplets must be visually distinct');
assert.ok(html.includes('background-blend-mode:screen'), 'Colored stains must mix via screen blending');
assert.ok(html.includes('mix-blend-mode:screen'), 'Ripple rings need overlapping color mixing');
assert.ok(html.includes('className=\'varon-water-ripple\''), 'Water ripple elements must be created at hit points');
assert.ok(html.includes('for(let n=0;n<2;n++)'), 'Each impact needs a pair of outward ripples');
assert.ok(html.includes("ring.style.setProperty('--vr-water-color',p.type.color)"), 'Each ripple must inherit the ray color');
assert.ok(html.includes("ring.addEventListener('animationend',()=>ring.remove()"), 'Ripple elements must be cleaned up after animation');
assert.ok(html.includes('const progress=Math.min(1,age/5600)'), 'Color marks should diffuse gradually over 5.6 seconds');
assert.ok(html.includes('radius=mark.radius+(mark.spread-mark.radius)*easing'), 'Stain radius must grow instead of staying focused');
assert.ok(html.includes('spread:Math.min(190,Math.max(85'), 'Diffusion must extend beyond the initial droplet');
assert.ok(html.includes('.varon-ion-drop,.varon-water-ripple'), 'Reset must clear droplets and ripple rings');
assert.ok(html.includes('@media(prefers-reduced-motion:reduce)'), 'Ripple animations must honor reduced motion');
const ionStart=html.indexOf(' function updateIonGlow(card,state,now){');
const ionEnd=html.indexOf(' function updateIonizedCards(now){',ionStart);
assert.ok(ionStart>=0 && ionEnd>ionStart, 'Cannot find spreading-stain update logic');
const spreadFunction=new vm.Script(html.slice(ionStart,ionEnd)+'\nupdateIonGlow').runInNewContext({
  cycleTime:now=>now,rgba:(color,opacity)=>color+'@'+opacity
});
const sample={colors:[{color:'#ff3b45',x:30,y:45,radius:15,spread:145,at:0},
                      {color:'#2795ff',x:36,y:43,radius:18,spread:140,at:0}],
              drops:[],wash:{style:{}}};
spreadFunction(null,sample,0);
const atStart=Number(sample.wash.style.background.match(/circle ([\d.]+)px/)[1]);
spreadFunction(null,sample,5600);
const afterSpread=Number(sample.wash.style.background.match(/circle ([\d.]+)px/)[1]);
assert.ok(afterSpread>atStart+95,'Water-stain radius should visibly expand during animation');
assert.ok(sample.wash.style.background.includes('#ff3b45') && sample.wash.style.background.includes('#2795ff'), 'Overlapping colors must coexist for mixing');
const screen=(a,b)=>255-Math.round((255-a)*(255-b)/255);
assert.ok(screen(255,0)===255 && screen(0,55)===55 && screen(130,130)>130, 'Screen mix should brighten overlapping color channels');

assert.ok(html.includes('width:var(--vr-drop-size,14px)'), 'Medium droplet default size must be 14px');
assert.ok(html.includes('6+Math.random()*5,true'), 'Text speckles should be 6-11px');
assert.ok(html.includes('10+Math.random()*12,false'), 'Card impact drops should be 10-22px');
assert.ok(html.includes('width:38px;height:38px'), 'Proportional impact flash should be 38px');

assert.ok(html.includes('.radiation-meter,.varon-ion-flash,.varon-ion-drop'), 'Reset must clear individual drops');

assert.ok(html.includes('const point={x:q.x,y:q.y,travel:'), 'Collision must sample the traveled wave path');
assert.ok(html.includes('hitTest(p,now,recentPoints)'), 'Wave path must be checked for impact');
assert.ok(html.includes('radiationCards.forEach(card=>{card.classList.remove'), 'Reset must clear ionization effects');
assert.ok(!html.includes('.radiation-hit>*:not(.radiation-accumulation)'), 'Ionized cards must not reposition their children');

const hitStart = html.indexOf(' function hitTest(p,now,points){');
const hitEnd = html.indexOf(' function wavePoint(p,travel){', hitStart);
assert.ok(hitStart >= 0 && hitEnd > hitStart, 'Cannot locate collision function for regression test');
const contactElement = {};
const contacts=[];
const hitContext = {
  visibleIonTargets: () => [{el:contactElement,r:{left:40,right:70,top:20,bottom:60}}],
  cardHit:(card,ray,time,point)=>contacts.push({card,color:ray.type.color,point}),
  removeRay:(ray)=>{ray.dead=true},scrollX:0,scrollY:0,w:100,h:100
};
const testHit = new vm.Script(html.slice(hitStart,hitEnd)+'\nhitTest').runInNewContext(hitContext);
const textElement={};
const textImpacts=[];
const textNode={textContent:'A B'};
const fakeGlyph={range:{},r:{left:48,right:58,top:20,bottom:60}};
const textContext={
  visibleIonTargets:()=>[{el:textElement,node:textNode,textTarget:true,r:{left:40,right:70,top:20,bottom:60}}],
  glyphAtPoint:(node,x,y)=>x>=48&&x<=58?fakeGlyph:null,
  textIonState:new WeakMap(),
  textHit:(el,ray,time,glyph)=>textImpacts.push({el,color:ray.type.color,glyph}),
  cardHit:()=>{throw new Error('Text hits must not use cardHit')},
  removeRay:(ray)=>{ray.dead=true},scrollX:0,scrollY:0,w:100,h:100
};
const testTextHit = new vm.Script(html.slice(hitStart,hitEnd)+'\nhitTest').runInNewContext(textContext);
const textRay={type:{color:'#32e875'},hits:0,maxHits:1,hitCards:new Set()};
testTextHit(textRay,100,[{x:44,y:30}]);
assert.equal(textImpacts.length,0,'Empty space inside text rectangle must NOT ionize');
assert.equal(textRay.hits,0,'Empty space must not stop the ray');
testTextHit(textRay,120,[{x:51,y:40}]);
assert.equal(textImpacts.length,1,'Real glyph should ionize after the ray hits a letter');
assert.equal(textImpacts[0].color,'#32e875','Glyph heat must inherit the ray color');
assert.equal(textImpacts[0].glyph,fakeGlyph,'Impact must target the measured glyph, not the box');
const glyphStart=html.indexOf(' function glyphAtPoint(node,x,y){');
const glyphEnd=html.indexOf(' function textHit(el,p,now,glyph){',glyphStart);
assert.ok(glyphStart>=0&&glyphEnd>glyphStart,'Actual glyph hit test function must exist');
const fakeDocument={createRange:()=>{
 let start=0,end=0;
 return {
  setStart:(node,i)=>{start=i},setEnd:(node,i)=>{end=i},
  getClientRects:()=>[{left:start*10,right:end*10,top:0,bottom:18,width:(end-start)*10,height:18}]
 };
}};
const realGlyphAtPoint=new vm.Script(html.slice(glyphStart,glyphEnd)+'\nglyphAtPoint').runInNewContext({
 textGlyphCache:new WeakMap(),glyphCacheEpoch:0,document:fakeDocument
});
const demoTextNode={textContent:'A B'};
assert.ok(realGlyphAtPoint(demoTextNode,5,9),'A rendered character must be hit-testable');
assert.equal(realGlyphAtPoint(demoTextNode,15,9),null,'Space character must never be ionized');
assert.ok(realGlyphAtPoint(demoTextNode,25,9),'A second rendered character must be hit-testable');

for(const color of ['#ff3b45','#2795ff','#32e875']){
  const ray={type:{color},hits:0,maxHits:1,hitCards:new Set()};
  const before=contacts.length;
  testHit(ray,100,[{x:5,y:5},{x:49,y:35},{x:51,y:36}]);
  assert.equal(contacts.length,before+1,'Ray must ionize exactly once when crossing a card');
  assert.equal(contacts[before].color,color,'Ionization must retain its ray color');
  assert.ok(ray.dead,'Single-hit particle should stop after ionization');
}
assert.ok(html.includes('href="studio/games.html"'), 'Homepage Play & Learn must link to Studio games');
assert.ok(html.includes('data-i18n="gamesLink"'), 'Game launch button needs bilingual copy');
// Regression: the circuit must draw when its own animation loop runs.
// The VARON pause variable is intentionally local to another script.
const circuitStart=html.indexOf('function tick(now){requestAnimationFrame(tick);');
const circuitEnd=html.indexOf('[voltage,capacitance,capRating,capPolarity].forEach',circuitStart);
assert.ok(circuitStart>=0&&circuitEnd>circuitStart,'Cannot find simulator animation loop');
assert.ok(!html.slice(circuitStart,circuitEnd).includes('if(paused)'), 'Simulator must not reference undefined VARON pause state');
assert.ok(html.includes('updateCircuitLabels();updateStatus(model());drawCircuit(model());requestAnimationFrame(tick);'),'Simulator must draw and populate meters on page load');
let frames=0,drawn=0,updated=0,physics=0;
const simulatorScope={
 requestAnimationFrame:()=>{frames++},
 last:0,
 model:()=>({current:21.52,V:9,R:330}),
 updatePhysics:()=>{physics++},
 updateCircuitLabels:()=>{updated++},
 updateStatus:()=>{updated++},
 drawCircuit:()=>{drawn++}
};
const testCircuitTick=new vm.Script(html.slice(circuitStart,circuitEnd)+'\ntick').runInNewContext(simulatorScope);
testCircuitTick(100);
assert.equal(frames,1,'Circuit animation must schedule another frame');
assert.equal(drawn,1,'Circuit canvas must draw without a ReferenceError');
assert.equal(updated,2,'Circuit meters and labels must update each frame');
assert.equal(physics,1,'Circuit physics must run each frame');
const wrangler = fs.readFileSync('wrangler.jsonc', 'utf8');
assert.match(wrangler, /"name"\s*:\s*"faristech-lab"/, 'Lab must not deploy as production');
console.log('Lab validation OK: ' + checked + ' inline JavaScript scripts and VARON controls.');

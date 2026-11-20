const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');

const html = fs.readFileSync('index.html', 'utf8');
const referenceLab = fs.readFileSync('lab.html', 'utf8');
assert.ok(html.includes('id="faristech-targeted-refinement"'), 'Targeted homepage visual improvements must remain');
assert.ok(html.includes('id="mainNav"') && html.includes('id="faristech-nav-accessibility"'), 'Responsive navigation and accessibility must be present');
assert.ok(html.includes('id="projectsGrid"') && html.includes('id="servicesGrid"'), 'Keep the existing project and service sections');
assert.ok(html.includes('id="circuitSchematicBtn"') && html.includes('id="circuitRealisticBtn"'), 'Keep the original circuit simulator modes on homepage');
assert.ok(referenceLab.includes('id="circuitSchematicBtn"'), 'Unmodified original lab must remain available as reference');
const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
let checked = 0;
for (const match of scripts) {
  const attrs = match[1];
  if (/\bsrc\s*=/.test(attrs) || /application\/ld\+json/i.test(attrs)) continue;
  new vm.Script(match[2], { filename: 'index.html inline script ' + (++checked) });
}
assert.ok(checked > 0, 'Expected at least one inline JS script');
const faviconPath='studio/favicon.svg';
const faviconVersion='inventium-iv-only-27';
assert.ok(fs.existsSync(faviconPath),'Inventium Iv browser tab icon must exist');
const faviconSvg=fs.readFileSync(faviconPath,'utf8');
assert.match(faviconSvg,/<svg\s[^>]*viewBox="0 0 64 64"/,'Favicon must remain a scalable 64px SVG');
assert.match(faviconSvg,/aria-label="Inventium Iv orbital logo"/,'Icon should identify the Inventium Iv brand');
assert.match(faviconSvg,/>Iv<\/text>/,'Icon must show the new large Iv monogram');
assert.doesNotMatch(faviconSvg,/127|>INVENTIUM<\/text>/i,'New favicon must not show 127 or tiny element-name text');
assert.match(faviconSvg,/radialGradient id="planet"/,'Icon must show a bright blue globe');
assert.match(faviconSvg,/ellipse cx="32" cy="32" rx="29\.5"/,'Icon must retain the orbital ring');
assert.match(faviconSvg,/radialGradient id="electron"/,'Icon must have a glowing orange accent');
const faviconPages=['index.html','lab.html','projects.html','project.html',
 'studio/index.html','studio/projects.html','studio/project.html','studio/pricing.html'];
for(const page of faviconPages){
 const markup=page==='index.html'?html:fs.readFileSync(page,'utf8');
 const icon=page.startsWith('studio/')?'favicon.svg':'studio/favicon.svg';
 const expected='<link rel="icon" type="image/svg+xml" href="'+icon+'?v='+faviconVersion+'">';
 assert.ok(markup.includes(expected),page+' must show the Inventium icon without stale cache');
}
assert.ok(html.includes('class="atom inventium-atom" data-element="Inventium" data-symbol="Iv" data-atomic-number="127"'),
 'Homepage atom must be the requested Inventium Iv, atomic number 127');
assert.ok(html.includes('class="inventium-number">127</span>'),'Nucleus must show number 127');
assert.ok(html.includes('class="inventium-symbol">Iv</span>'),'Nucleus must show element symbol Iv');
assert.ok(html.includes('class="inventium-name">INVENTIUM</span>'),'Nucleus must show Inventium name');
assert.ok(html.includes('127 p⁺ · 127 e⁻ · Concept element'),
 'Neutral fictional Inventium must describe 127 protons and 127 electrons without falsely claiming discovery');
assert.ok(html.includes('id="inventium-127-atom-style"'),'Inventium nucleus must have its own responsive styling');
assert.ok(html.includes('INVENTIUM <span style="color:var(--cyan)">Iv · 127</span>'),
 'Atom console must identify the Inventium element');
assert.ok(html.includes('⚙ Inventium controls'),'Atom control button must use its new name');
assert.ok(html.includes("settingsToggle.textContent=open?'✕ Hide Inventium controls':'⚙ Inventium controls';"),
 'Inventium settings button must keep its new name after opening or closing');
assert.ok(html.includes('aria-label="Inventium atom animation control panel"'),
 'Atom settings must have an accessible Inventium label');
assert.ok(html.includes('class="orbit o1"')&&html.includes('class="orbit o2"')&&html.includes('class="orbit o3"'),
 'Inventium must keep the three existing animated orbital planes');

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
// User did not request Learning Games: keep the unrequested page and its entry points removed.
assert.ok(!fs.existsSync('studio/games.html'),'Unrequested Learning Games page must remain absent');
assert.ok(!fs.existsSync('scripts/check-studio-games.cjs'),'Removed games must not leave a dedicated test module');
assert.ok(!fs.existsSync('GAME_BUG_REPORT.md'),'Removed games should not leave their obsolete bug report');
for(const path of ['index.html','lab.html','studio/index.html','studio/projects.html','studio/project.html','studio/pricing.html']){
 const source=path==='index.html'?html:fs.readFileSync(path,'utf8');
 assert.doesNotMatch(source,/games\.html|gamesLink|Learning Games|Learning games|data-nav="games"/i,
  'Games link or promotion should not appear on '+path);
}
const studioSource=fs.readFileSync('studio/app.js','utf8');
new vm.Script(studioSource,{filename:'studio/app.js'});
assert.doesNotMatch(studioSource,/function games\(|shuffleGameItems|ohmGameOptions|refreshGamesLanguage|reactionBtn|memoryGrid/,
 'Unrequested games logic should not run in Studio');
// Regression: the circuit must draw when its own animation loop runs.
// The VARON pause variable is intentionally local to another script.
const circuitStart=html.indexOf('function tick(now){requestAnimationFrame(tick);');
const circuitEnd=html.indexOf('[voltage,capacitance,capRating].forEach',circuitStart);
assert.ok(circuitStart>=0&&circuitEnd>circuitStart,'Cannot find simulator animation loop');
assert.ok(!html.slice(circuitStart,circuitEnd).includes('if(paused)'), 'Simulator must not reference undefined VARON pause state');
assert.ok(html.includes('updateCircuitLabels();updateStatus(model());')&&html.includes('drawCircuit(model());requestAnimationFrame(tick);'),'Simulator must draw and populate meters on page load');
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

const drawStart=html.indexOf('function drawCircuit(m){');
const drawEnd=html.indexOf('function updateCircuitLabels(){',drawStart);
assert.ok(drawStart>=0 && drawEnd>drawStart,'Missing canvas circuit drawing routine');
const drawnWires=[],drawnLabels=[];
const ctxMock=new Proxy({},{
 get:(obj,key)=>key in obj?obj[key]:()=>{},
 set:(obj,key,value)=>{obj[key]=value;return true}
});
const drawScope={
 ctx:ctxMock,cv:{width:1100,height:590,dataset:{}},circuitViewMode:'schematic',
 line:(...args)=>drawnWires.push(args),
 label:(...args)=>drawnLabels.push(args),
 boom:()=>{},drawElectron:()=>{},
 pointOnPath:()=>({x:0,y:0}),
 t:value=>value,lang:'en',
 batteryFailed:false,ledFailed:false,capFailed:false,
 switchOn:false,animating:false,capV:0,chargeAnimPhase:0,
 electronDrift:0,flowElectrons:[]
};
const testDrawCircuit=new vm.Script(html.slice(drawStart,drawEnd)+'\ndrawCircuit').runInNewContext(drawScope);
const sampleModel={hasCap:false,isSuper:false,polarity:'none',V:9,R:330,brightness:0,sourceOK:false,rating:16,
 led:{color:'#ff404f',nameKey:'red'}};
testDrawCircuit(sampleModel);
const hasLead=(x1,y1,x2,y2)=>drawnWires.some(w=>w[0]===x1&&w[1]===y1&&w[2]===x2&&w[3]===y2);
assert.ok(!hasLead(330,120,330,270) && !hasLead(330,310,330,455),'Removed capacitor must have NO dangling vertical leads');
assert.ok(!hasLead(290,270,370,270) && !hasLead(290,310,370,310),'Removed capacitor must have NO plates');
assert.ok(drawnLabels.some(l=>l[2]==='CAPACITOR REMOVED'),'Removed mode should show a clear label');
assert.ok(hasLead(330,455,940,455),'Main lower circuit wire must remain intact when capacitor removed');
drawnWires.length=0;drawnLabels.length=0;
testDrawCircuit({...sampleModel,hasCap:true,polarity:'correct'});
assert.ok(hasLead(330,120,330,270) && hasLead(330,310,330,455),'Installed capacitor must reconnect both leads');
assert.ok(hasLead(290,270,370,270) && hasLead(290,310,370,310),'Installed capacitor must show both plates');
assert.ok(!drawnLabels.some(l=>l[2]==='CAPACITOR REMOVED'),'Installed capacitor must not be labeled removed');
assert.ok(html.includes('electronDrift=m.current>.02?ease('),'Electron dots must stop when current is zero');
assert.ok(html.includes("capPolarity.oninput=()=>{"),'Changing capacitor mode must trigger an immediate redraw');
assert.ok(html.includes('capV=0;capFailed=false;capStress=0;chargeAnimPhase=0;'), 'Switching capacitor type must install a fresh uncharged part');
assert.ok(html.includes('const SUPER_CAP_MULTIPLIER=25;'), 'Supercapacitor storage multiplier missing');
assert.ok(html.includes("m.isSuper?(m.C*1000).toFixed(1)+' mF"), 'Effective supercap capacitance must appear in the controls');
assert.ok(html.includes('const brightness=ledFailed||current<=.02?0:Math.min(100,Math.pow(current/30,1.15)*100)'), 'LED brightness must not saturate at ordinary 20mA');
assert.ok(html.includes("const capDanger=m.hasCap&&!capFailed"), 'Supercapacitors must also honor the selected voltage rating');


// Exercise the real capacitor/LED physics across charging, powered-off discharge, and low-current LED states.
const physicsStart=html.indexOf('function model(){');
const physicsEnd=html.indexOf('function line(x1,y1,x2,y2',physicsStart);
assert.ok(physicsStart>=0&&physicsEnd>physicsStart,'Cannot find circuit model and physics');
const physicsScope={
 SUPER_CAP_MULTIPLIER:25,
 voltage:{value:'9'},resistance:{value:'330'},
 capacitance:{value:'2200'},capRating:{value:'16'},
 capPolarity:{value:'correct'},
 LEDS:{red:{vf:1.9,color:'#ff404f',nameKey:'red'}},ledKey:'red',
 switchOn:true,capV:0,ledFailed:false,capFailed:false,batteryFailed:false,
 capStress:0,ledStress:0,batteryStress:0,
 electronDrift:0,animating:false,flowElectrons:[]
};
const simulator=new vm.Script(html.slice(physicsStart,physicsEnd)+'\n({model,updatePhysics})').runInNewContext(physicsScope);
physicsScope.capPolarity.value='correct';
const normalC=simulator.model().C;
physicsScope.capPolarity.value='super';
const superC=simulator.model().C;
assert.equal(Math.round(superC/normalC),25,'Supercapacitor must store 25 times the base capacitance');
function chargeFor(mode,seconds){
 physicsScope.capPolarity.value=mode;physicsScope.capV=0;physicsScope.capFailed=false;
 physicsScope.capStress=0;physicsScope.switchOn=true;
 for(let i=0;i<Math.round(seconds/.05);i++)simulator.updatePhysics(.05,simulator.model());
 return physicsScope.capV;
}
const normalCharge=chargeFor('correct',5);
const superCharge=chargeFor('super',5);
assert.ok(normalCharge>8.5,'Normal capacitor must charge promptly');
assert.ok(superCharge>1 && superCharge<5,'New supercapacitor must charge gradually instead of instantly starting full');
function dischargeFor(mode,seconds){
 physicsScope.capPolarity.value=mode;physicsScope.capV=9;physicsScope.capFailed=false;
 physicsScope.capStress=0;physicsScope.switchOn=false;physicsScope.batteryFailed=false;
 for(let i=0;i<Math.round(seconds/.05);i++)simulator.updatePhysics(.05,simulator.model());
 return {v:physicsScope.capV,current:simulator.model().current,brightness:simulator.model().brightness};
}
const normalOff=dischargeFor('correct',10);
const superOff=dischargeFor('super',10);
assert.ok(superOff.v>normalOff.v+2,'Supercapacitor should retain significantly more voltage after 10 seconds');
assert.ok(superOff.brightness>normalOff.brightness+20,'Supercapacitor should keep the LED visibly brighter after opening the switch');
physicsScope.capPolarity.value='none';physicsScope.switchOn=false;physicsScope.capV=0;
assert.equal(simulator.model().current,0,'No capacitor and open switch must give zero current');
assert.equal(simulator.model().brightness,0,'LED must go dark without current');
physicsScope.switchOn=true;physicsScope.resistance.value='330';
const brightLed=simulator.model().brightness;
physicsScope.resistance.value='680';
const dimLed=simulator.model().brightness;
assert.ok(brightLed>dimLed+18,'Higher resistance must visibly reduce the LED brightness');
assert.ok(dimLed>0 && dimLed<100,'LED brightness must support dim intermediate states');
assert.ok(brightLed>60&&brightLed<75,'Default 9V/330ohm red LED must be visibly BELOW 100%');
assert.ok(Math.round(brightLed)===68,'Default LED brightness should be ~68% instead of the old 100%');
physicsScope.capPolarity.value='super';physicsScope.resistance.value='330';
physicsScope.capRating.value='6.3';physicsScope.capV=7;physicsScope.capStress=.44;
simulator.updatePhysics(.05,simulator.model());
assert.equal(physicsScope.capFailed,true,'Supercapacitor must fail when over its voltage rating');

// The user's requested circuit LED symbol is a clear X inside a circle, not a diode or bulb drawing.
assert.ok(html.includes("ctx.arc(940,295,28,0,Math.PI*2)"), 'Schematic LED must have a visible round outline');
assert.ok(html.includes("ctx.moveTo(925,280);ctx.lineTo(955,310)"), 'Circled LED must include the first X diagonal');
assert.ok(html.includes("ctx.moveTo(955,280);ctx.lineTo(925,310)"), 'Circled LED must include the second X diagonal');
assert.ok(!html.includes("ctx.roundRect(919,270,42,51,8)"), 'Old box-like diode must be removed');
assert.ok(!html.includes("for(let k=0;k<2;k++)"), 'Old LED arrow decoration must be removed');
assert.ok(!html.includes("ctx.roundRect(445,92,230,56,18)"), 'Resistor must not be drawn inside an old rectangular housing');
assert.ok(html.includes("for(let tooth=1;tooth<=10;tooth++)ctx.lineTo("), 'Resistor must use a continuous zigzag, not lines inside a box');
assert.ok(html.includes("p.zone==='resistor'?resistorZigzagY(x):p.y"), 'Electron dots must follow the zigzag resistor');
assert.ok(html.includes("Math.round(m.brightness)+'%'"), 'LED should show its live brightness beside the symbol');

// The zigzag resistor must be connected end-to-end, with alternating top/bottom teeth.
const resistorBegin=html.indexOf('function resistorZigzagY(x){');
const resistorEnd=html.indexOf('function drawElectron(p,moving=true,size=5.2){',resistorBegin);
assert.ok(resistorBegin>0&&resistorEnd>resistorBegin,'Zigzag resistor coordinate function missing');
const resistorY=new vm.Script(html.slice(resistorBegin,resistorEnd)+'\nresistorZigzagY').runInNewContext({});
const zigStep=200/11;
assert.equal(resistorY(445),120,'Resistor left terminal must meet upper wire');
assert.equal(resistorY(675),120,'Resistor right terminal must meet upper wire');
assert.ok(Math.abs(resistorY(460+zigStep)-103)<.01,'First resistor tooth must zig upward');
assert.ok(Math.abs(resistorY(460+zigStep*2)-137)<.01,'Second resistor tooth must zag downward');
assert.ok(Math.abs(resistorY(460+zigStep*3)-103)<.01,'Resistor must repeat the zigzag');
assert.ok(Math.abs(resistorY(660)-120)<.01,'Zigzag resistor must return to the wire center');

// Verify the emitted LED light actually dims on canvas, not just the percentage text.
const ledFills=[];
ctxMock.createRadialGradient=()=>({addColorStop(){}});
ctxMock.save=()=>{};
ctxMock.restore=()=>{ctxMock.globalAlpha=1};
ctxMock.fill=()=>{if(ctxMock.fillStyle==='#ff404f')ledFills.push(ctxMock.globalAlpha)};
drawScope.ledRgba=(hex,alpha)=>hex+':'+alpha;
function diodeFillAt(percent){
 ledFills.length=0;
 testDrawCircuit({...sampleModel,brightness:percent});
 return ledFills[0];
}
const offAlpha=diodeFillAt(0);
const dimAlpha=diodeFillAt(25);
const midAlpha=diodeFillAt(65);
const brightAlpha=diodeFillAt(100);
assert.ok(offAlpha>0 && offAlpha<dimAlpha,'Unpowered LED should keep only a faint, non-glowing diode symbol');
assert.ok(dimAlpha<midAlpha && midAlpha<brightAlpha,'Canvas LED color intensity must increase smoothly with current');
assert.ok(brightAlpha>=.9 && brightAlpha<=1,'Full LED brightness must produce a vivid diode');
assert.ok(html.includes('const ledVisual=Math.pow(ledLight,.65)'), 'Visual brightness boost must preserve dimming');
assert.ok(html.includes('ctx.shadowBlur=ledLight>.001?9+25*ledVisual:0'), 'LED core glow must follow brightness');
assert.ok(html.includes('ctx.createRadialGradient(940,295,5,940,295,72)'), 'LED halo should be brighter but remain localized');
const haloStops=[];
ctxMock.createRadialGradient=()=>({addColorStop:(offset,color)=>haloStops.push({offset,color})});
function glowAlphaAt(percent){
 haloStops.length=0;
 testDrawCircuit({...sampleModel,brightness:percent});
 const center=haloStops.find(stop=>stop.offset===0);
 return center?Number(center.color.split(':').at(-1)):0;
}
assert.equal(glowAlphaAt(0),0,'Powered-off LED must emit no colored halo');
const weakGlow=glowAlphaAt(25);
const normalGlow=glowAlphaAt(68);
const strongGlow=glowAlphaAt(100);
assert.ok(weakGlow>0 && weakGlow<normalGlow && normalGlow<strongGlow,'LED glow must increase smoothly with current');
assert.ok(normalGlow>.40,'LED must be noticeably brighter at the default 68% setting');
assert.ok(strongGlow<=.67,'LED glow intensity must remain bounded');



// CIRCUIT VIEWS: the physical renderer and the existing schematic must use the same model.
assert.ok(html.includes('id="circuitSchematicBtn"')&&html.includes('id="circuitRealisticBtn"'),
 'Both real-life/schematic mode buttons must exist');
assert.ok(html.includes('aria-pressed="true"')&&html.includes('aria-pressed="false"'),
 'Mode toggle must expose an accessible selected state');
assert.ok(html.includes('circuitViewTitle:"CIRCUIT VIEW"')&&html.includes('circuitViewTitle:"طريقة عرض الدائرة"'),
 'View controls need English and Arabic translations');
assert.ok(html.includes("if(circuitViewMode==='realistic'){drawRealisticCircuit(m);return;}"),
 'Circuit draw entry point must dispatch to real-life mode');
assert.ok(html.includes("return localStorage.getItem('ft-circuit-view')==='realistic'?'realistic':'schematic'"),
 'Mode selection should persist through page reloads');
assert.ok(html.includes("const query=new URLSearchParams(location.search).get('circuitView')"),
 'Realistic view must be testable through a direct URL');
assert.ok(html.includes('drawCircuit(model());')&&!html.includes('setCircuitView(next){capV=0'),
 'Switching display must not reset the capacitor');

const toggleStart=html.indexOf('function updateCircuitViewControls(){');
const toggleEnd=html.indexOf("$('circuitSchematicBtn').addEventListener",toggleStart);
assert.ok(toggleStart>=0&&toggleEnd>toggleStart,'Cannot find toggle implementation');
const modeButtons={};
for(const id of ['circuitSchematicBtn','circuitRealisticBtn']){
 modeButtons[id]={active:false,attributes:{},classList:{toggle:(name,value)=>{modeButtons[id].active=value}},
  setAttribute(name,value){this.attributes[name]=value}};
}
const viewHint={textContent:''};
const sharedCircuitModel={V:9,R:330,capV:3.4,current:21.52};
const modeRenders=[],storedViews=[];
const viewCtx={
 circuitViewMode:'schematic',cv:{dataset:{}},
 $:id=>modeButtons[id]||(id==='circuitViewHint'?viewHint:null),
 t:key=>key,model:()=>sharedCircuitModel,drawCircuit:model=>modeRenders.push(model),
 localStorage:{setItem:(key,value)=>storedViews.push({key,value})}
};
const testModeSwitch=new vm.Script(html.slice(toggleStart,toggleEnd)+'\nsetCircuitView').runInNewContext(viewCtx);
testModeSwitch('realistic');
assert.equal(viewCtx.circuitViewMode,'realistic','The toggle must select physical mode');
assert.equal(viewCtx.cv.dataset.view,'realistic','The canvas should expose its selected mode');
assert.equal(modeButtons.circuitRealisticBtn.attributes['aria-pressed'],'true','Real-life mode should be selected');
assert.equal(modeButtons.circuitSchematicBtn.attributes['aria-pressed'],'false','Schematic must be deselected');
testModeSwitch('schematic');
assert.equal(viewCtx.circuitViewMode,'schematic','Toggle must restore the existing schematic');
assert.equal(modeButtons.circuitSchematicBtn.attributes['aria-pressed'],'true','Schematic should be selected');
assert.equal(modeRenders.length,2,'Each toggle should repaint without restarting physics');
assert.ok(modeRenders.every(m=>m===sharedCircuitModel),'Both modes must use exactly the same circuit model');
assert.equal(storedViews.length,2,'View preference must persist on both switches');
testModeSwitch('invalid');
assert.equal(modeRenders.length,2,'Unknown view values must be ignored');

const realStart=html.indexOf('function drawRealisticCircuit(m){');
const realEnd=html.indexOf('function drawCircuit(m){',realStart);
assert.ok(realStart>=0&&realEnd>realStart,'Cannot locate physical circuit renderer');
ctxMock.createLinearGradient=()=>({addColorStop(){}});
ctxMock.createRadialGradient=()=>({addColorStop(){}});
const physicalLabels=[];
drawScope.label=(...args)=>physicalLabels.push(args);
drawScope.drawRealisticExplosionEffects=()=>{};
const realistic=new vm.Script(html.slice(realStart,realEnd)+'\ndrawRealisticCircuit').runInNewContext(drawScope);
const physModel={...sampleModel,isSuper:true,hasCap:true,polarity:'super',C:.055,baseC:.0022,rating:16,brightness:68};
realistic(physModel);
assert.equal(drawScope.cv.dataset.lastDraw,'realistic','Realistic renderer must complete without throwing');
assert.ok(physicalLabels.some(q=>q[2]?.includes('SUPERCAPACITOR')),
 'Physical view should show the selected supercapacitor');
assert.ok(physicalLabels.some(q=>q[2]?.includes('5 mm LED')),
 'Physical view should show an actual through-hole LED');
assert.ok(physicalLabels.some(q=>q[2]?.includes('RESISTOR')),
 'Physical view should show a real color-banded resistor');
physicalLabels.length=0;
realistic({...sampleModel,brightness:0});
assert.ok(physicalLabels.some(q=>q[2]==='CAPACITOR REMOVED'),
 'Physical view must hide its capacitor when the mode is removed');
assert.equal(drawScope.cv.dataset.lastDraw,'realistic','Removed-capacitor mode must still render successfully');


// Real-life component failure must be a visible, animated explosion rather than a static emoji.
assert.ok(html.includes('id="circuitExplosionDemo"'), 'Preview explosion button must be available');
assert.ok(html.includes('circuitExplosionDemo:"💥 Preview explosion"'), 'English explosion preview translation missing');
assert.ok(html.includes('circuitExplosionDemo:"💥 تجربة الانفجار"'), 'Arabic explosion preview translation missing');
assert.ok(html.includes("if(demo)demo.hidden=schematic"), 'Explosion demo must only show in physical mode');
assert.ok(html.includes("triggerRealisticExplosion(model().hasCap?'capacitor':'led',true)"),
 'Explosions must be previewable without changing electrical state');
assert.ok(html.includes("get('explosionDemo')==='1'"), 'Direct smoke-test preview query must be supported');
assert.ok(html.includes('clearRealisticExplosions();'), 'Reset must clear previous explosion effects');
assert.ok(html.includes("clearRealisticExplosions('capacitor')"), 'Replacing capacitor must clear old explosion and scorch');
assert.ok(html.slice(realStart,realEnd).includes('drawRealisticExplosionEffects();'),
 'Realistic view must actually render explosion particles');
assert.ok(!html.slice(realStart,realEnd).includes("if(capFailed)boom("),
 'Realistic mode must not overlay the old cartoon explosion emoji');
assert.ok(html.slice(drawStart,drawEnd).includes("if(capFailed)boom("),
 'Original schematic failure indications must remain unchanged');

const fxStart=html.indexOf('const REALISTIC_BLAST_SITES=');
const fxEnd=html.indexOf('function drawRealisticCircuit(m){',fxStart);
assert.ok(fxStart>=0&&fxEnd>fxStart,'Missing physical explosion animation helpers');
let blastClock=100;
const blastCanvas={dataset:{}},blastCtx=new Proxy({},{
 get:(o,k)=>k in o?o[k]:()=>{},
 set:(o,k,v)=>{o[k]=v;return true}
});
blastCtx.createRadialGradient=()=>({addColorStop(){}});
blastCtx.createLinearGradient=()=>({addColorStop(){}});
const blastScope={
 ctx:blastCtx,cv:blastCanvas,
 performance:{now:()=>blastClock},
 window:{matchMedia:()=>({matches:false})},
 lang:'en',capFailed:false,ledFailed:false,batteryFailed:false
};
const fx=new vm.Script(html.slice(fxStart,fxEnd)+
 '\n({triggerRealisticExplosion,clearRealisticExplosions,drawRealisticExplosionEffects,realisticExplosionEvents,realisticExplosionSeen})'
 ).runInNewContext(blastScope);
fx.triggerRealisticExplosion('capacitor',true);
assert.equal(fx.realisticExplosionEvents.size,1,'Preview should create exactly one explosion');
assert.equal(blastScope.capFailed,false,'Preview must not damage the electrical circuit');
assert.equal(blastScope.batteryFailed,false,'Preview must not damage the battery');
fx.drawRealisticExplosionEffects();
assert.equal(blastCanvas.dataset.explosion,'preview','Preview should animate in realistic view');
assert.equal(fx.realisticExplosionEvents.get('preview').sparks.length,38,'Explosion must have flying sparks');
assert.equal(fx.realisticExplosionEvents.get('preview').smoke.length,12,'Explosion must have layered smoke');
assert.equal(fx.realisticExplosionEvents.get('preview').shards.length,13,'Explosion must include moving fragments');
blastClock=6500;
fx.drawRealisticExplosionEffects();
assert.equal(fx.realisticExplosionEvents.size,0,'Completed preview must clean up particles');
assert.equal(blastCanvas.dataset.explosion,'none','Preview must stop after the animation');
blastScope.capFailed=true;
fx.drawRealisticExplosionEffects();
assert.equal(blastCanvas.dataset.explosion,'failure','Capacitor failure should launch animated explosion');
assert.ok(fx.realisticExplosionSeen.has('capacitor'),'Actual failure must trigger once');
const firstFailure=fx.realisticExplosionEvents.get('capacitor');
fx.drawRealisticExplosionEffects();
assert.equal(fx.realisticExplosionEvents.get('capacitor'),firstFailure,'Continuous frames must not restart the explosion');
blastClock=12900;
fx.drawRealisticExplosionEffects();
assert.equal(blastCanvas.dataset.explosion,'damage','Failed component should retain scorch marks after smoke fades');
fx.clearRealisticExplosions('capacitor');blastScope.capFailed=false;
fx.drawRealisticExplosionEffects();
assert.equal(blastCanvas.dataset.explosion,'none','Replacing failed capacitor must clear damage');
blastScope.ledFailed=true;
fx.drawRealisticExplosionEffects();
assert.ok(fx.realisticExplosionSeen.has('led'),'LED overload should also trigger explosion');
blastScope.batteryFailed=true;
fx.drawRealisticExplosionEffects();
assert.ok(fx.realisticExplosionSeen.has('battery'),'Battery overload should also trigger explosion');
fx.clearRealisticExplosions();
assert.equal(fx.realisticExplosionEvents.size,0,'Reset must remove all animations');
assert.equal(fx.realisticExplosionSeen.size,0,'Reset must permit a new failure animation');

const wrangler = fs.readFileSync('wrangler.jsonc', 'utf8');
assert.match(wrangler, /"name"\s*:\s*"faristech-lab"/, 'Lab must not deploy as production');
console.log('Original homepage restored and polished: ' + checked + ' inline scripts, VARON and simulator regression tests passed.');

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
for(const color of ['#ff3b45','#2795ff','#32e875']){
  const ray={type:{color},hits:0,maxHits:1,hitCards:new Set()};
  const before=contacts.length;
  testHit(ray,100,[{x:5,y:5},{x:49,y:35},{x:51,y:36}]);
  assert.equal(contacts.length,before+1,'Ray must ionize exactly once when crossing a card');
  assert.equal(contacts[before].color,color,'Ionization must retain its ray color');
  assert.ok(ray.dead,'Single-hit particle should stop after ionization');
}
const wrangler = fs.readFileSync('wrangler.jsonc', 'utf8');
assert.match(wrangler, /"name"\s*:\s*"faristech-lab"/, 'Lab must not deploy as production');
console.log('Lab validation OK: ' + checked + ' inline JavaScript scripts and VARON controls.');

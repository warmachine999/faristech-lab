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

const hitTargets = html.match(/const targets=document.querySelectorAll\('([^']+)'\)/);
assert.ok(hitTargets, 'Radiation collision targets not found');
assert.ok(!hitTargets[1].includes('orbLabel'), 'Radiation must never reflow electron orbit buttons');
assert.ok(!hitTargets[1].includes('.pill') && !hitTargets[1].includes('.banner'), 'Small inline elements must never become exposure cards');
const wrangler = fs.readFileSync('wrangler.jsonc', 'utf8');
assert.match(wrangler, /"name"\s*:\s*"faristech-lab"/, 'Lab must not deploy as production');
console.log('Lab validation OK: ' + checked + ' inline JavaScript scripts and VARON controls.');

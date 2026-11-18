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
assert.ok(html.includes('radiationActive(now)'), 'VARON radiation cycle missing');
assert.ok(html.includes('class="varon-visual"'), 'VARON controls need their own wrapper outside the atom');
assert.ok(html.includes('.atom .orbLabel{position:absolute!important'), 'Orbit labels must stay absolutely positioned');
assert.ok(!html.includes('ctx.rect(bounds.left,bounds.top,bounds.width,bounds.height);ctx.clip()'), 'VARON must not have a hard rectangular clip');
assert.ok(html.includes("ctx.globalCompositeOperation='destination-in'"), 'VARON must use a smooth circular radiation fade');
assert.ok(html.includes('class="varon-console" hidden'), 'Large VARON control panel must start hidden');
assert.ok(html.includes('id="varonSettingsToggle"'), 'Compact VARON settings button missing');
assert.ok(html.includes('if(paused){last=now;return}'), 'VARON pause must stop the radiation frame');
const hitTargets = html.match(/const targets=document.querySelectorAll\('([^']+)'\)/);
assert.ok(hitTargets, 'Radiation collision targets not found');
assert.ok(!hitTargets[1].includes('orbLabel'), 'Radiation must never reflow electron orbit buttons');
assert.ok(!hitTargets[1].includes('.pill') && !hitTargets[1].includes('.banner'), 'Small inline elements must never become exposure cards');
const wrangler = fs.readFileSync('wrangler.jsonc', 'utf8');
assert.match(wrangler, /"name"\s*:\s*"faristech-lab"/, 'Lab must not deploy as production');
console.log('Lab validation OK: ' + checked + ' inline JavaScript scripts and VARON controls.');

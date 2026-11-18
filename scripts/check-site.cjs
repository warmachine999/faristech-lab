const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');

const html = fs.readFileSync('index.html', 'utf8');
const scripts = [...html.matchAll(/<script\\b([^>]*)>([\\s\\S]*?)<\\/script>/gi)];
let checked = 0;
for (const match of scripts) {
  const attrs = match[1];
  if (/\\bsrc\\s*=/.test(attrs) || /application\\/ld\\+json/i.test(attrs)) continue;
  new vm.Script(match[2], { filename: 'index.html inline script ' + (++checked) });
}
assert.ok(checked > 0, 'Expected at least one inline JS script');
for (const id of ['varonPause', 'varonReset', 'varonStatus', 'varonCycle']) {
  assert.ok(html.includes('id="' + id + '"'), 'Missing VARON control: ' + id);
}
assert.ok(html.includes('period:[12,15,18][i]'), 'VARON orbit timing missing');
assert.ok(html.includes('radiationActive(now)'), 'VARON radiation cycle missing');
const wrangler = fs.readFileSync('wrangler.jsonc', 'utf8');
assert.match(wrangler, /"name"\\s*:\\s*"faristech-lab"/, 'Lab must not deploy as production');
console.log('Lab validation OK: ' + checked + ' inline JavaScript scripts and VARON controls.');

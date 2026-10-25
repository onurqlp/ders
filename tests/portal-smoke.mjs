import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const html = readFileSync(join(root, 'index.html'), 'utf8');

const protectedLinks = [
  'https://www.aydadil.com/a1ayda/',
  'https://www.aydadil.com/a2ayda/',
  'https://www.aydadil.com/b1ayda/',
  'https://www.aydadil.com/sinavhazirlik/',
  'https://www.aydadil.com/bibliothek/',
  'https://www.aydadil.com/derskitaplari/',
  'https://osd.aydadil.com/',
  'https://wa.me/905409122503'
];

for (const url of protectedLinks) {
  assert.ok(html.includes(url), `Missing protected portal destination: ${url}`);
}

assert.ok(html.includes('https://onurqlp.github.io/ayda-pass/access-control.js'), 'Central access script must remain connected');
assert.ok(html.includes('aydaAutoLogin()') && html.includes('aydaClearAccess()'), 'Existing automatic login and logout hooks must remain');
assert.ok(html.includes('id="selectedLevel"') && html.includes('selectedLevel'), 'Login must identify the selected level');
assert.ok(html.includes('id="navResources"') && html.includes('id="navHelp"'), 'Mobile navigation must expose working Resources and Help entries');
assert.ok(html.includes('id="navHome"') && html.includes('id="navLevel"'), 'Mobile navigation must retain Home and Level entries');
assert.ok(/onerror=["'][^"']*(?:brand|logo)/i.test(html), 'The remote logo must have a visible text fallback');
assert.ok(/prefers-reduced-motion\s*:\s*reduce/.test(html), 'Reduced-motion preferences must be respected');
assert.ok(/scroll-padding-bottom/.test(html) && /env\(safe-area-inset-bottom\)/.test(html), 'Mobile bottom navigation must respect safe areas and content padding');
assert.ok(/@media\s*\([^)]*(?:max|min)-width\s*:\s*320px/.test(html), 'Narrow 320px screens must have an explicit layout rule');
assert.ok(/@media\s*\([^)]*(?:max|min)-width\s*:\s*430px/.test(html), 'Wide mobile screens must have an explicit layout rule');
assert.ok(!html.includes('AYDA studio v2') && !html.includes('AYDA portal UX refresh'), 'Accumulated legacy style overrides must be consolidated');

const styleTags = html.match(/<style\b/gi) ?? [];
assert.equal(styleTags.length, 1, 'The portal must use one consolidated style system');

console.log(`Portal smoke checks passed (${protectedLinks.length} preserved destinations, access hooks, responsive shell, fallback and mobile navigation).`);

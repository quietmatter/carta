#!/usr/bin/env node
'use strict';
/* The six files, checked without a browser. Zero deps, plain Node:
 *   node test/verify-static.js
 *
 * Two things, both of which have bitten this project in production and
 * neither of which needs a DOM to catch:
 *
 *   1. Every file parses. CLAUDE.md's own advice is that a syntax check has
 *      caught something in nearly every phase — this is that check, run over
 *      all six rather than whichever one was being edited.
 *   2. Every file agrees on one version. index.html is the revalidated
 *      navigation document; a sibling `<script src>` is an ordinary cached
 *      subresource, so a keeper can run a NEW index.html against an OLD
 *      sibling unless the `?v=` query string moves with APP_VERSION. That is
 *      not hypothetical: it shipped at v7.31.1 and read to the keeper as
 *      "your Visualizer account is empty" (ARCHITECTURE.md §1). The boot
 *      guard says so out loud at runtime; this says so before merge.
 *
 * It also checks the head and the directory agree on which siblings exist —
 * a file added without its <script src>, or a tag left behind after one is
 * removed, is the failure a sixth file newly makes possible.
 *
 * It finally REPORTS index.html against the line/byte band without gating on
 * it. The band is a founder call, not a rule a robot enforces — Phases 18, 20
 * and 29 all landed over it deliberately — so failing the build here would
 * fight the project's own governance. What the record actually asks for is
 * that a crossing is never SILENT (ARCHITECTURE.md §1 calls a quiet one "the
 * failure this section exists to prevent", and four versions crossed quietly
 * before Phase 31). A printed figure, and a GitHub annotation when over,
 * makes silence impossible without making the call for anybody.
 *
 * Deliberately NOT here: anything needing the app to run. That is what
 * verify-door.js, verify-v7.35.js and verify-split.js are for. */

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.join(__dirname, '..');
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');

let failed = 0, n = 0;
const ok = msg => console.log(`PASS  ${++n}. ${msg}`);
const bad = (msg, saw) => { failed++; console.log(`FAIL  ${++n}. ${msg}${saw ? `\n      saw: ${saw}` : ''}`); };
const is = (cond, msg, saw) => cond ? ok(msg) : bad(msg, saw);

const html = read('index.html');

/* ---- the inline script, and the siblings the <head> actually loads ---- */
const inline = (html.match(/<script>\n([\s\S]*?)\n<\/script>/) || [])[1];
if (!inline) { console.log('FAIL  index.html has no inline <script> block — did the app move?'); process.exit(1); }

const tags = [...html.matchAll(/<script src="([^"?]+)\?v=([^"]+)"><\/script>/g)]
  .map(m => ({ file: m[1], v: m[2] }));

/* ---- 1. everything parses ---- */
const compile = (src, name) => {
  try { new vm.Script(src, { filename: name }); return null; }
  catch (e) { return e.message; }
};
is(!compile(inline, 'index.html'), 'index.html — the inline script parses', compile(inline, 'index.html'));
for (const { file } of tags) {
  const err = compile(read(file), file);
  is(!err, `${file} — parses`, err);
}

/* ---- 2. the head and the directory agree on which siblings exist ---- */
const onDisk = fs.readdirSync(ROOT).filter(f => /^carta-.*\.js$/.test(f)).sort();
const inHead = tags.map(t => t.file).sort();
is(onDisk.join(',') === inHead.join(','),
  `every carta-*.js on disk is loaded from the <head> (${onDisk.length} files)`,
  `disk: [${onDisk}]  head: [${inHead}]`);

/* ---- 3. one version, everywhere ---- */
const appV = (inline.match(/const APP_VERSION\s*=\s*'([^']+)'/) || [])[1];
is(!!appV, 'index.html states an APP_VERSION', appV);

for (const { file, v } of tags) {
  is(v === appV, `${file} — its ?v= tag matches APP_VERSION (${appV})`, `?v=${v}`);
  // the constant the boot guard compares against, published at the file's foot
  const got = (read(file).match(/window\.[A-Z_]*VERSION\s*=\s*'([^']+)'/) || [])[1];
  is(got === appV, `${file} — its published *_VERSION matches APP_VERSION`, String(got));
}

/* ---- 4. the boot guard actually checks every sibling ---- */
// the guard is the belt to the ?v= braces; a sibling missing from it is a file
// a keeper can silently run a stale copy of, which is how carta-map.js sat
// unchecked from the day the guard was written until Phase 31.
const guard = (inline.match(/if\(\[([^\]]*VERSION[^\]]*)\]\.some\(v=>v!==APP_VERSION\)\)/) || [])[1] || '';
const checked = (guard.match(/window\.[A-Z_]*VERSION/g) || []).length;
is(checked === tags.length,
  `the boot guard checks all ${tags.length} siblings`,
  `checks ${checked}: ${guard.trim()}`);

/* ---- Phase 32 / v7.46.1 · cityKey and landKey own their own normalisation ----
   Both used to call index.html's global fold(): a sibling borrowing its
   normaliser from the document that loads it. It resolved either way —
   index.html declares fold() at top level and neither key function runs
   before that has happened — but it is the wrong direction: <carta-city>
   reads cityKey on a cold paint, before the app's own script has necessarily
   done anything, and the model harness has to slice the map first only
   because of this seam. cityKey was fixed at Phase 32; landKey carries its
   own copy rather than cityKey's, because the two folds differ on digits —
   fold() keeps them, LAND_AKA/LANDS were keyed against that, and landKey is
   inside the tested block, so it wanted its own pass rather than a ride on
   this one. Both checked the same way now. */
{
  const cityBody = (read('carta-map.js').match(/function cityKey\([\s\S]*?\n/) || [''])[0];
  is(cityBody.length > 40 && !/\bfold\s*\(/.test(cityBody),
    'cityKey normalises inside carta-map.js, not through the host',
    cityBody.trim() || '(cityKey not found)');
  const landBody = (read('carta-map.js').match(/function landKey\([\s\S]*?\n/) || [''])[0];
  is(landBody.length > 40 && !/\bfold\s*\(/.test(landBody),
    'landKey normalises inside carta-map.js, not through the host',
    landBody.trim() || '(landKey not found)');
}

/* ---- the band, reported and never gated (ARCHITECTURE.md §1) ---- */
const LINE_MAX = 5000, BYTE_MAX = 500 * 1024;
// newlines, so this agrees with `wc -l` and with every figure in the record
const lines = (html.match(/\n/g) || []).length;
const bytes = fs.statSync(path.join(ROOT, 'index.html')).size;
const kb = (bytes / 1024).toFixed(1);
const over = lines > LINE_MAX || bytes > BYTE_MAX;
console.log(`\nindex.html — ${lines} lines / ${kb} KB `
  + `(band: ${LINE_MAX} lines / ${(BYTE_MAX / 1024).toFixed(0)} KB)`);
if (over) {
  const how = [lines > LINE_MAX ? `${lines - LINE_MAX} lines` : null,
    bytes > BYTE_MAX ? `${((bytes - BYTE_MAX) / 1024).toFixed(1)} KB` : null].filter(Boolean).join(' and ');
  const msg = `index.html is ${how} over the band. Not a failure — the band is `
    + `the founder's call (ARCHITECTURE.md §1). Record the crossing there, or split.`;
  console.log(`NOTE  ${msg}`);
  if (process.env.GITHUB_ACTIONS) console.log(`::warning file=index.html::${msg}`);
}

console.log(failed
  ? `\n${failed} of ${n} STATIC CHECKS FAILED`
  : `\nALL ${n} STATIC CHECKS PASSED`);
process.exit(failed ? 1 : 0);

/* The seam, after Phase 31's split. Boots the real app against
   test/fixtures/env.js and walks everything that moved into carta-atlas.js —
   the four chapter screens, the sheet, and the two functions that exist only
   because state stayed on one side of the seam while its writer stayed on the
   other. Fails on any console error, any page error, or any assertion, the
   same contract verify-door.js and verify-v7.35.js keep.

   What it holds that the other two don't:
     · the four walks — country, region, producer, city — each actually
       painting its own record, not its empty state. verify-door.js only ever
       taps into the country chapter, and nothing anywhere opened the other
       three, which is exactly how a split breaks a screen quietly
     · the published seam — every name in carta-atlas.js's export list is
       really on window, so an export dropped from that list fails here rather
       than on a keeper's phone three taps in. Note what this can and cannot
       catch: a `function` declaration in a classic script attaches itself to
       window either way, so its export line is documentation. The `const`
       arrows are the half that genuinely needs publishing — drop
       `window.originOf` and this check is what says so.
     · the version guard — all six files agree, which is the check that makes
       a forgotten ?v= tag loud (ARCHITECTURE.md §1)
     · the two seam calls — render() → resetAtlasSheet() and
       save() → clearCityLead(), which replaced two bare cross-file writes

     npm i playwright-core --no-save
     node test/verify-split.js

   Finds its Chromium through test/browser.js; set CHROME to override. */
const {chromium}=require('playwright-core');
const fs=require('fs'),http=require('http'),path=require('path');
const ROOT=path.join(__dirname,'..');
const TYPES={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.woff2':'font/woff2'};
function serve(){return new Promise(res=>{const s=http.createServer((req,rp)=>{
  const p=path.join(ROOT,decodeURIComponent(req.url.split('?')[0]));
  fs.readFile(p,(e,b)=>{if(e){rp.writeHead(404);rp.end('')}
    else{rp.writeHead(200,{'Content-Type':TYPES[path.extname(p)]||'application/octet-stream'});rp.end(b)}});
}).listen(0,'127.0.0.1',()=>res(s))})}

(async()=>{
const server=await serve(),port=server.address().port;
const env=fs.readFileSync(path.join(ROOT,'test/fixtures/env.js'),'utf8').split('carta7.design.').join('carta7.');
const browser=await chromium.launch({executablePath:require('./browser').chromePath(),args:['--no-sandbox']});
const problems=[],notes=[];
const ok=(c,l,dbg)=>{c?notes.push('  ok  '+l)
  :problems.push('FAIL: '+l+(dbg?'\n      saw: '+JSON.stringify(String(dbg).slice(0,300)):''))};

const ctx=await browser.newContext({viewport:{width:390,height:800}});
await ctx.addInitScript(`try{localStorage.setItem('carta7.firstrun','0')}catch(e){}`);
await ctx.addInitScript(env);
const page=await ctx.newPage();
page.on('console',m=>{const t=m.text();
  if(m.type()==='error'&&!/404|Failed to load resource/.test(t))problems.push('console: '+t)});
page.on('pageerror',e=>problems.push('pageerror: '+e.message));
await page.goto(`http://127.0.0.1:${port}/index.html`,{waitUntil:'load'});
await page.waitForTimeout(1800);                 // past the What's New timer
await page.evaluate(()=>{try{closeSheet()}catch(e){}});

/* the guard the <head>'s query strings brace: six files, one version. A
   mismatch here is the v7.31.1 failure — a cached sibling beside a fresh
   document — caught before it can be swallowed by a catch somewhere. */
const vers=await page.evaluate(()=>[APP_VERSION,window.MAP_VERSION,window.PLATE_VERSION,
  window.SHOT_VERSION,window.ASK_VERSION,window.ATLAS_VERSION]);
ok(vers.every(v=>v&&v===vers[0]),`the version guard — all six files agree (${vers[0]})`,vers.join(' | '));

/* the published seam at the foot of carta-atlas.js. The const arrows in here
   (originOf, growerOf, regionOf, cityPlaces, placeCups, placeAvg, avgOf) are
   reachable from index.html and from inline handlers ONLY because that list
   publishes them; the function declarations attach themselves and are listed
   for the record, the way every sibling lists its own. */
const SEAM=['askFromHome','asktrustHTML','avgOf','cityLead','cityPlaces','clearCityLead',
  'coffeeCardMapHTML','coffeeGroundHTML','cupLeadHTML','growerOf','mountAtlas','openCountryCups',
  'originOf','pasteFarmLink','placeAvg','placeCups','placeFarms','regionOf','resetAtlasSheet',
  'toggleAtlasSheet','unplaceFarm','vAtlas','vCityChapter','vCountryChapter','vProducerPage','vRegionChapter'];
const absent=await page.evaluate(n=>n.filter(k=>typeof window[k]==='undefined'),SEAM);
ok(!absent.length,`the seam — all ${SEAM.length} exports are on window`,absent.join(', '));

const txt=()=>page.evaluate(()=>document.getElementById('main').innerText);
async function walk(js,label,expect){
  await page.evaluate(js);await page.waitForTimeout(450);
  const t=await txt();
  ok(t&&t.length>40&&(!expect||t.includes(expect)),label,t);
}
// the four walks Phase 13 drew, each opened the way the app opens it
await walk(()=>openCountryChapter('Ethiopia'),'the road down from Ethiopia','Ethiopia');
await walk(()=>openRegionChapter('Ethiopia','Gedeb'),'a region — Gedeb, scoped to the same greens','Gedeb');
await walk(()=>openProducerPage('Ethiopia','Worka Sakaro','Gedeb'),'a farm — the Worka Sakaro ledger','Worka Sakaro');
await walk(()=>openCityChapter('Lisbon'),'a city — Lisbon and its streets','Lisbon');
await walk(()=>go('atlas'),'back out to the Atlas');

// the sheet under the plate, and the reset that arrives with a fresh screen
await page.evaluate(()=>toggleAtlasSheet());await page.waitForTimeout(500);
ok(await page.evaluate(()=>document.getElementById('atlassheet').getAttribute('aria-hidden')==='false'),
  'toggleAtlasSheet — the sheet rises');
await page.evaluate(()=>openTastedSheet());await page.waitForTimeout(400);
ok(await page.evaluate(()=>!!document.getElementById('sheet').innerText.trim()),
  'openTastedSheet — tasted so far opens over it');
await page.evaluate(()=>{closeSheet();go('journal')});await page.waitForTimeout(400);
await page.evaluate(()=>go('atlas'));await page.waitForTimeout(500);
ok(await page.evaluate(()=>document.getElementById('atlassheet').getAttribute('aria-hidden')==='true'),
  'render() → resetAtlasSheet() — arriving fresh closes it again');

// a card reads the ground helpers across the seam, and save() dirties the memo
ok(await page.evaluate(()=>coffeeCardHTML(live('coffees')[0].id).length>500),
  'coffeeCardHTML reads coffeeCardMapHTML across the seam');
ok(await page.evaluate(()=>{cityLead('Lisbon');save();return typeof cityLead('Lisbon')!=='undefined'}),
  'save() → clearCityLead() — the memo is dropped and rebuilt across the seam');

/* ---- Phase 32 · the fourth element, and where it is defined ----
   <carta-city> is the one element in carta-map.js that reads the tables at the
   FOOT of its own file rather than LANDS at the head. Defined in the elements
   closure like the other three it would upgrade while _cityArcsCache is still
   in its temporal dead zone and throw on first paint — drawing an empty <svg>
   that only recovers on a resize. So the class goes out as window.CARTA_CITY
   and is defined in the export block, after the tables. These checks are the
   ones that would notice if it were ever moved back. */
ok(await page.evaluate(()=>!!window.CARTA_CITY&&!!customElements.get('carta-city')),
  '<carta-city> is published and defined');
ok(await page.evaluate(()=>customElements.get('carta-city')===window.CARTA_CITY),
  'and the definition is the class the closure handed out');
/* the cold-paint guarantee, stated as the thing it protects: a fresh element
   attached now must draw on its first paint, not on a later resize. */
ok(await page.evaluate(async()=>{
  const box=document.createElement('div');
  box.style.cssText='position:fixed;left:-9999px;top:0;width:320px;height:240px';
  const c=document.createElement('carta-city');
  c.setAttribute('at','34.052,-118.243');c.setAttribute('coast','Los Angeles');
  c.setAttribute('marks','[{"id":"z1","n":1,"lat":34.05,"lon":-118.24}]');
  box.appendChild(c);document.body.appendChild(box);
  await new Promise(r=>setTimeout(r,300));
  const svg=c.querySelector('svg'),n=svg?svg.children.length:0;
  box.remove();return n>0;
}),'a cold <carta-city> paints on its first paint, not on a resize');
/* cityKey() no longer reaches across the seam for index.html's fold(): the
   sibling owns its own normaliser, which is what lets the element key a shore
   before the app's own script has run. */
ok(await page.evaluate(()=>cityKey('Līhu‘e')==='lihue'&&cityKey('Los Angeles')==='los angeles'),
  'cityKey normalises inside carta-map.js, not through the host');

await browser.close();server.close();
console.log(notes.join('\n'));
if(problems.length){console.log('\n'+problems.join('\n'));console.log(`\n${problems.length} PROBLEM(S)`);process.exit(1)}
console.log(`\nall ${notes.length} checks passed, no console or page errors`);
})();

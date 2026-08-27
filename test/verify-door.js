/* Boot the real app against test/fixtures/env.js and walk the five states of
   the front door (v7.37.0). Fails on any console error, any page error, or any
   assertion — the same contract verify-v7.35.js keeps.

   What it holds, beyond "it rendered":
     · the ladder — 03 outranks 04 outranks 02, and 01 is its own branch
     · the ember budget — exactly one #a63f2b above the fold, in every state
     · one field, two doors — a place opens the ask, a bag opens the door
     · the plate reframes rather than reloading, and never collapses
     · offline: nothing is fetched at all, which is the passport's own law
     · dusk, prefers-reduced-motion, and 320px

     npm i playwright-core --no-save
     node test/verify-door.js

   Expects a Chromium at /opt/pw-browsers/chromium; set CHROME to override. */
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
const browser=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium',args:['--no-sandbox']});
const problems=[],notes=[],offsite=[];
const ok=(c,l,dbg)=>{c?notes.push('  ok  '+l)
  :problems.push('FAIL: '+l+(dbg?'\n      saw: '+JSON.stringify(String(dbg).slice(0,400)):''))};

async function boot(opts){
  opts=opts||{};
  const ctx=await browser.newContext(Object.assign({viewport:{width:390,height:800}},opts.ctx||{}));
  await ctx.addInitScript(`try{localStorage.setItem('carta7.firstrun','${opts.first?1:0}')}catch(e){}`);
  await ctx.addInitScript(env);
  if(opts.wipe)await ctx.addInitScript(`try{localStorage.removeItem('carta7.v1')}catch(e){}`);
  const page=await ctx.newPage();
  page.on('console',m=>{const t=m.text();
    // the fixture carries source only; font/icon/manifest 404s are the harness
    if(m.type()==='error'&&!/404|Failed to load resource/.test(t))problems.push('console: '+t)});
  page.on('pageerror',e=>problems.push('pageerror: '+e.message));
  page.on('request',r=>{const u=r.url();if(!u.startsWith(`http://127.0.0.1:${port}/`))offsite.push(u)});
  await page.goto(`http://127.0.0.1:${port}/index.html`,{waitUntil:'load'});
  await page.waitForTimeout(1800);              // past the What's New timer
  await page.evaluate(()=>{try{closeSheet()}catch(e){}});
  if(opts.snooze){await page.evaluate(()=>snoozeWaitingShot());await page.waitForTimeout(700)}
  return {ctx,page};
}
const txt=p=>p.evaluate(()=>document.getElementById('main').innerText);
const st=p=>p.evaluate(()=>{
  const m=document.getElementById('main'),pl=document.getElementById('atlasplate');
  const lf=document.getElementById('atlasleaf'),sh=document.getElementById('atlassheet');
  const svg=pl&&pl.querySelector('carta-atlas svg');
  // rest is the design literal baked into the markup (352/450/0) — what the
  // plate was DRAWN at. h is style.height — what mountAtlas() actually
  // APPLIED, which can differ at any viewport shorter than the 852px
  // reference. A check against rest alone would not have caught the 18px
  // arithmetic slip mountAtlas() had at the exact reference height: h is the
  // one that has to match a real box on a real screen.
  return {fixed:m.classList.contains('fixed'),rest:pl&&pl.dataset.rest,h:pl&&pl.style.height,
    leaf:lf&&lf.className,top:lf&&lf.style.top,
    leafHeight:lf&&Math.round(lf.getBoundingClientRect().height),
    leafOverflows:lf&&(lf.scrollHeight>lf.clientHeight+1),
    sheet:!!sh,viewBox:svg&&svg.getAttribute('viewBox')};
});
/* the ember, counted the way the handoff asks it to be: elements actually
   PAINTING #a63f2b, split by whether they sit below the fold */
const embers=p=>p.evaluate(()=>{
  const out=[];
  document.querySelectorAll('#main *, nav.tabs *').forEach(el=>{
    if(getComputedStyle(el).backgroundColor==='rgb(166, 63, 43)')
      out.push({el:el.tagName+'.'+(el.className||''),below:!!el.closest('.doorsheet')});
  });
  return out;
});
const above=e=>e.filter(x=>!x.below).length;

/* ---------- 01 · first open ---------- */
{
  const {ctx,page}=await boot({first:true,wipe:true});
  const s=await st(page),t=await txt(page);
  ok(s.fixed,'01 — the Atlas owns its own frame');
  ok(/Nothing on the record/i.test(t),'01 — the display states the empty record',t);
  ok(/Paste the bag, or name the place you drank/.test(t),'01 — one teaching line',t);
  ok(/Kept a record in classic/.test(t),'01 — classic is still a door');
  ok(!/Your taste/.test(t),'01 — no "Your taste": nothing to argue from yet');
  ok(!/Carta keeps the story of your taste/.test(t),'01 — the six-line welcome is gone');
  ok(!s.sheet,'01 — no pull: nothing under the fold yet');
  ok(!!s.viewBox,'01 — the plate drew',s.viewBox);
  ok(above(await embers(page))===1,'01 — exactly one ember above the fold');
  await ctx.close();
}
/* ---------- 03 · a brew waiting, and 05 · pulled up ---------- */
{
  const {ctx,page}=await boot({});
  const s=await st(page),t=await txt(page);
  ok(s.rest==='352','03 — a waiting brew leads, drawn at 352',JSON.stringify(s));
  // this boot's own viewport (390x800, main.clientHeight 743) is already
  // shorter than the 852px reference the 352 above was drawn at, so the real
  // applied height is smaller than the design literal by construction — the
  // leaf's own height is the thing that must not move: it holds Write the
  // cup, and a viewport shorter than the reference must come out of the
  // plate first, never out of the leaf, until the plate hits its floor.
  ok(s.h==='300px','03 — shorter than the reference: the plate gives up the room, not the leaf',JSON.stringify(s));
  ok(s.leafHeight===461&&!s.leafOverflows,'03 — the leaf keeps its full designed height, no scroll needed',JSON.stringify(s));
  ok(/Poured/i.test(t)&&/Write the cup/i.test(t),'03 — the brew, and its action',t);
  ok(/Peak/i.test(t)&&/From /i.test(t)&&/Elapsed/i.test(t),'03 — the three figures',t);
  ok(/Not now/i.test(t),'03 — the snooze');
  ok(!/Connect Visualizer/.test(t),'the Visualizer pitch left the door');
  ok(!/tap the map, or a name/.test(t),'the chip list left the door');
  ok(above(await embers(page))===1,'03 — exactly one ember above the fold');

  await page.evaluate(()=>toggleAtlasSheet());
  await page.waitForTimeout(800);
  const u=await st(page);
  ok(u.h==='178px','05 — the plate compresses to 178px',u.h);
  const sheet=await page.evaluate(()=>{const sh=document.getElementById('atlassheet');
    return {top:sh.style.top,tf:sh.style.transform,hidden:sh.getAttribute('aria-hidden'),text:sh.innerText}});
  ok(sheet.top==='160px'&&sheet.tf==='none','05 — the sheet rose',JSON.stringify(sheet).slice(0,200));
  ok(sheet.hidden==='false','05 — and is exposed to a reader once it has');
  ok(/Lately/i.test(sheet.text),'05 — Lately, and one cup',sheet.text);
  ok(/Your cities/i.test(sheet.text),'05 — the cities');
  ok(/The passport/i.test(sheet.text)&&/Share it/i.test(sheet.text),'05 — the three one-line doors',sheet.text);
  ok(!!u.viewBox&&u.viewBox!==s.viewBox,'05 — the plate reframed at the new box',u.viewBox+' was '+s.viewBox);
  ok(above(await embers(page))===1,'05 — still one ember above the fold; the score is below it');
  await ctx.close();
}
/* ---------- 04 · a bag resting: snooze the brew, the ladder steps down ---------- */
{
  const {ctx,page}=await boot({snooze:true});
  const s=await st(page),t=await txt(page);
  ok(s.rest==='450','04 — drawn at 450',JSON.stringify(s));
  ok(s.h==='398px','04 — shorter than the reference: the plate gives up the room, not the leaf',JSON.stringify(s));
  ok(s.leafHeight===363&&!s.leafOverflows,'04 — the leaf keeps its full designed height, no scroll needed',JSON.stringify(s));
  ok(/On the shelf/i.test(t),'04 — the head names the shelf',t);
  ok(/Best so far/i.test(t)&&/Last brew/i.test(t),'04 — the two facts',t);
  ok(/Brew it/i.test(t),'04 — the action');
  ok(/Something else/i.test(t)&&/Where to next/i.test(t),'04 — the two quiet doors');
  ok(!/undefined|NaN|\[object/.test(t),'04 — nothing leaked into the copy',t);
  ok(above(await embers(page))===1,'04 — exactly one ember above the fold');
  await ctx.close();
}
/* ---------- 02 · nothing live, and the field's two doors ---------- */
{
  const {ctx,page}=await boot({});
  await page.evaluate(()=>{snoozeWaitingShot();
    D.coffees.forEach(c=>{c.home=false});save();render()});
  await page.waitForTimeout(700);
  const s=await st(page),t=await txt(page);
  ok(/countr(y|ies), so far/i.test(t),'02 — the display reads the drawing back',t);
  ok(/A place to go, or a bag you drank\. Carta reads which\./.test(t),'02 — the teaching line',t);
  ok(/Your taste/i.test(t),'02 — Your taste is present');
  ok(/fadeleaf/.test(s.leaf||''),'02 — the leaf is a fade, not a slab',s.leaf);
  ok(!/Where to next\?/.test(t),'02 — the old question retired');
  ok(above(await embers(page))===1,'02 — exactly one ember above the fold');

  await page.evaluate(()=>{const i=document.getElementById('home_ask');
    i.value='Lisbon';askDraft.dest='Lisbon';askFromHome()});
  await page.waitForTimeout(500);
  ok(await page.evaluate(()=>pageView&&pageView.kind)==='ask','the field — a place opens the ask');
  await page.evaluate(()=>{pageView=null;render()});await page.waitForTimeout(400);
  await page.evaluate(()=>{const i=document.getElementById('home_ask');
    if(i){i.value='Tim Wendelboe — Kieni AA';askDraft.dest=i.value}askFromHome()});
  await page.waitForTimeout(500);
  const bag=await page.evaluate(()=>{const sh=document.getElementById('sheet'),ta=document.getElementById('d_text');
    return {open:sh.classList.contains('open'),step:doorState&&doorState.step,val:ta?ta.value:null}});
  ok(bag.open&&bag.step==='text','the field — a bag opens the door instead',JSON.stringify(bag));
  ok(bag.val==='Tim Wendelboe — Kieni AA','the field — the door opens on the paste',bag.val);
  await ctx.close();
}
/* ---------- tap a country on the plate ----------
   <carta-atlas> shares its geometry with <carta-belt> but did not, at first,
   share its tap wiring — a country on the new door's plate drew as ink with
   no listener behind it, so a real tap did nothing. Click the actual painted
   shape, not its bounding box: an irregular coastline has real gaps inside
   its own bbox where an SVG path simply isn't there to be hit-tested. */
{
  const {ctx,page}=await boot({});
  const rect=await page.evaluate(()=>{
    const g=document.querySelector('#atlasplate carta-atlas svg g.mk');
    if(!g)return null;
    const path=g.querySelector('path'),r=(path||g).getBoundingClientRect();
    for(let fx=0.15;fx<=0.85;fx+=0.1)for(let fy=0.15;fy<=0.85;fy+=0.1){
      const x=r.x+r.width*fx,y=r.y+r.height*fy;
      const el=document.elementFromPoint(x,y);
      if(el&&el.closest&&el.closest('g.mk')===g)return {x,y,name:g.dataset.name};
    }
    return null;
  });
  ok(!!rect,'the plate — a tasted country carries a hit-testable mark',JSON.stringify(rect));
  if(rect){
    await page.mouse.click(rect.x,rect.y);
    await page.waitForTimeout(500);
    const kind=await page.evaluate(()=>pageView&&pageView.kind);
    const id=await page.evaluate(()=>pageView&&pageView.id);
    ok(kind==='country'&&id===rect.name,'tap a country on the plate — opens its chapter',JSON.stringify({kind,id,expected:rect.name}));
  }
  await ctx.close();
}
/* ---------- the sheet closes behind every way of leaving the Atlas ----------
   v7.37.1 reset the pulled-up sheet in go() — the tab bar — but goBack() (the
   standard "<-" every screen carries, and the phone's own back gesture) left
   it stuck open: drill into a city or a country from the risen sheet, then
   back out, and the Atlas returned still pulled up. The door is meant to
   open closed every time it is arrived at fresh. */
{
  const {ctx,page}=await boot({});
  await page.evaluate(()=>toggleAtlasSheet());
  await page.waitForTimeout(700);
  const city=await page.evaluate(()=>knownCities()[0]);
  await page.evaluate(c=>openCityChapter(c),city);
  await page.waitForTimeout(500);
  await page.evaluate(()=>goBack());
  await page.waitForTimeout(700);
  const s=await st(page);
  ok(s.h!=='178px'&&/translateY\(110%\)/.test((await page.evaluate(()=>{
    const sh=document.getElementById('atlassheet');return sh?sh.style.transform:''
  }))||''),'goBack from a screen opened while pulled up — the sheet closes behind you',JSON.stringify(s));
  await ctx.close();
}
/* ---------- "Not now" holds against the resume poll ----------
   snoozeWaitingShot() only cleared _vizWaiting, and vizCheckOnResume() only
   guards on _vizWaiting being falsy — so the very next resume more than 90s
   (VIZ_RESUME_GAP) after the last check re-fetched the identical shot and put
   the just-dismissed hero straight back on the door, unprompted. A phone
   locking is enough to cross 90s; this simulates exactly that without
   waiting on the clock. */
{
  const {ctx,page}=await boot({});
  const before=await page.evaluate(()=>waitingShot()&&waitingShot().id);
  ok(!!before,'a shot is waiting to snooze',before);
  await page.evaluate(()=>snoozeWaitingShot());
  await page.waitForTimeout(300);
  ok(!(await page.evaluate(()=>waitingShot())),'"Not now" clears it immediately');
  await page.evaluate(()=>{ _vizCheckedAt=Date.now()-91000; });
  await page.evaluate(()=>{
    Object.defineProperty(document,'visibilityState',{value:'visible',configurable:true});
    vizCheckOnResume();
  });
  await page.waitForTimeout(2000);   // the mocked list+download calls, in series
  const after=await page.evaluate(()=>waitingShot()&&waitingShot().id);
  ok(after!==before,'the resume poll, >90s later, does not silently revive the same dismissed shot',JSON.stringify({before,after}));
  await ctx.close();
}
/* ---------- a real phone, not the 852px reference ----------
   852 is the iPhone 15 Pro's FULL screen, standalone, no browser chrome — it
   is not what most keepers actually get. A browser tab, or almost any phone
   with its address bar showing, is shorter. The plate and the leaf used to
   split that shortfall by literal subtraction: the leaf's own height was
   whatever main.clientHeight left over after the plate's fixed pixel count,
   so any phone shorter than the reference took the loss out of the leaf —
   the one thing holding Write the cup / Brew it — turning it into an
   internally-scrolled box with no fixed clearance above the bar, rather
   than the plate simply showing a little less map. iPhone SE-class (390x667)
   is a common real size and a good floor to hold this at. */
{
  const {ctx,page}=await boot({ctx:{viewport:{width:390,height:667}}});
  const s=await st(page);
  ok(!s.leafOverflows,'a short phone (390x667), a brew waiting — no scroll needed to reach the action',JSON.stringify(s));
  ok(s.leafHeight>=450,'…and the leaf holds close to its full designed height (461 at the reference)',JSON.stringify(s));
  await ctx.close();
}
{
  const {ctx,page}=await boot({ctx:{viewport:{width:390,height:667}},snooze:true});
  const s=await st(page);
  ok(!s.leafOverflows,'a short phone (390x667), a bag resting — no scroll needed to reach the action',JSON.stringify(s));
  ok(s.leafHeight>=350,'…and the leaf holds close to its full designed height (363 at the reference)',JSON.stringify(s));
  await ctx.close();
}
/* ---------- the passport asks for nothing ---------- */
ok(offsite.length===0,'offline — nothing was fetched at all',JSON.stringify(offsite.slice(0,5)));

/* ---------- dusk ---------- */
{
  const {ctx,page}=await boot({ctx:{colorScheme:'dark'}});
  const d=await page.evaluate(()=>{const b=document.querySelector('.btn-graphite');
    return {theme:document.documentElement.getAttribute('data-theme'),
      fill:b&&getComputedStyle(b).backgroundColor,ink:b&&getComputedStyle(b).color}});
  ok(d.theme==='dusk','dusk — the theme follows the device',JSON.stringify(d));
  ok(d.fill&&d.fill!=='rgb(36, 29, 24)','dusk — the ink fill inverts through the roles',JSON.stringify(d));
  await ctx.close();
}
/* ---------- prefers-reduced-motion ---------- */
{
  const {ctx,page}=await boot({ctx:{reducedMotion:'reduce'}});
  const r=await page.evaluate(()=>{const pl=document.getElementById('atlasplate'),sh=document.getElementById('atlassheet');
    return {plate:getComputedStyle(pl).transitionDuration,sheet:sh&&getComputedStyle(sh).transitionDuration}});
  ok(/^0s(,\s*0s)*$/.test(r.plate)&&/^0s(,\s*0s)*$/.test(r.sheet),
    'reduced motion — the sheet\'s travel and the plate\'s reframe both stop',JSON.stringify(r));
  await ctx.close();
}
/* ---------- 320px ---------- */
{
  const {ctx,page}=await boot({ctx:{viewport:{width:320,height:720}}});
  const n=await page.evaluate(()=>{const i=document.querySelector('.askfield input');
    return {over:document.documentElement.scrollWidth>document.documentElement.clientWidth,
      fs:i&&getComputedStyle(i).fontSize}});
  ok(!n.over,'320px — nothing scrolls sideways',JSON.stringify(n));
  await ctx.close();
}

console.log(notes.join('\n'));
console.log(problems.length?`\n${problems.length} PROBLEM(S):\n`+problems.join('\n')
  :`\nall ${notes.length} checks passed, no console or page errors`);
await browser.close();server.close();
process.exit(problems.length?1:0);
})();

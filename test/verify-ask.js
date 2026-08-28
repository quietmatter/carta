/* Boot the real app against test/fixtures/env.js and walk the ask's front door
   (Phase 31). Fails on any console error, any page error, or any assertion —
   the same contract verify-door.js keeps, and the same harness.

   What it holds, beyond "it rendered":
     · the wait is a plate, not a page — full bleed, no bar, no 200px pin box
     · the plate reframes from the belt to the plot as the first name confirms
     · the ember budget on the wait: the rule's fill and its tip, nothing else
     · cancel is still a real cancel — nothing written, on any path
     · the answer WAITS on the door (03b) instead of being pushed up full-screen
     · the ladder — 03 outranks 03b outranks 04 outranks 02
     · the migration — every ask already on the record arrives read, not unread
     · Not now sets one aside and undo brings it back
     · a placed nothing falls back to the passport rather than drawing an empty box

     npm i playwright-core --no-save
     node test/verify-ask.js

   test/browser.js finds the Chromium; set CHROME to override. */
const {chromium}=require('playwright-core');
const {chromePath}=require('./browser');
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
const browser=await chromium.launch({executablePath:chromePath(),args:['--no-sandbox']});
const problems=[],notes=[];
const ok=(c,l,dbg)=>{c?notes.push('  ok  '+l)
  :problems.push('FAIL: '+l+(dbg?'\n      saw: '+JSON.stringify(String(dbg).slice(0,400)):''))};

async function boot(opts){
  opts=opts||{};
  const ctx=await browser.newContext(Object.assign({viewport:{width:390,height:800}},opts.ctx||{}));
  await ctx.addInitScript(`try{localStorage.setItem('carta7.firstrun','0')}catch(e){}`);
  await ctx.addInitScript(env);
  const page=await ctx.newPage();
  page.on('console',m=>{const t=m.text();
    if(m.type()==='error'&&!/404|Failed to load resource/.test(t))problems.push('console: '+t)});
  page.on('pageerror',e=>problems.push('pageerror: '+e.message));
  await page.goto(`http://127.0.0.1:${port}/index.html`,{waitUntil:'load'});
  await page.waitForTimeout(1800);              // past the What's New timer
  await page.evaluate(()=>{try{closeSheet()}catch(e){}});
  await page.evaluate(()=>snoozeWaitingShot());  // the brew leads otherwise
  await page.waitForTimeout(500);
  return {ctx,page};
}
const txt=p=>p.evaluate(()=>document.getElementById('main').innerText);
/* the ember, counted the way the handoff asks it to be: elements actually
   PAINTING #a63f2b (paper) — the wait's whole budget is the rule and its tip */
const embers=p=>p.evaluate(()=>{
  const out=[];
  document.querySelectorAll('#main *, nav.tabs *').forEach(el=>{
    if(getComputedStyle(el).backgroundColor==='rgb(166, 63, 43)')
      out.push(el.tagName+'.'+(el.className||''));
  });
  return out;
});
// the wait's own shape, read off the live DOM rather than off the template
const waitState=p=>p.evaluate(()=>{
  const w=document.querySelector('.askwait'),map=document.getElementById('think_map');
  const prog=w&&w.querySelector('.prog'),fill=document.getElementById('think_fill');
  const now=w&&w.querySelector('.now .mk'),narr=document.getElementById('think_narr');
  const r=prog?prog.getBoundingClientRect():null;
  return {on:!!w,bar:!document.getElementById('tabs').hidden,
    plate:map?(map.querySelector('carta-plot')?'plot':map.querySelector('carta-atlas')?'belt':'none'):null,
    progTop:r?Math.round(r.top):null,progLeft:r?Math.round(r.left):null,
    progRight:r?Math.round(window.innerWidth-r.right):null,
    fillW:fill&&fill.style.width,
    markBg:now?getComputedStyle(now).backgroundColor:null,
    markAnim:now?getComputedStyle(now).animationName:null,
    narrH:narr&&narr.style.height,
    meta:(document.getElementById('think_meta')||{}).textContent,
    foot:(document.getElementById('think_foot')||{}).textContent,
    pins:(typeof askRun!=='undefined'&&askRun)?askRun.pins.length:null};
});
const doorState=p=>p.evaluate(()=>{
  const pl=document.getElementById('atlasplate'),lf=document.getElementById('atlasleaf');
  return {rest:pl&&pl.dataset.rest,h:pl&&pl.style.height,top:lf&&lf.style.top,
    leaf:lf&&lf.className,
    leafHeight:lf&&Math.round(lf.getBoundingClientRect().height),
    leafOverflows:lf&&(lf.scrollHeight>lf.clientHeight+1),
    plot:!!(pl&&pl.querySelector('carta-plot')),belt:!!(pl&&pl.querySelector('carta-atlas')),
    view:pageView&&pageView.kind,tab:tab};
});
// an unread answer, written straight onto the record — the ask itself is run
// end to end once below; every ladder check after that stands on this
const seedAnswer=(page,over)=>page.evaluate(o=>{
  const base={id:'ask_new',createdAt:new Date().toISOString(),kind:'city',destination:'Copenhagen',
    reach:'a short drive',model:'claude-opus-5',read:'Two clusters, and a long walk between them.',
    findings:[{id:'f_a',name:'Prolog',neighborhood:'Kødbyen',city:'Copenhagen',verdict:'the cleanest cup',
      why:'The only washed Rwanda within reach.',fit:[],grounded:true,status:null,placeRef:null,lat:55.6683,lon:12.5525},
      {id:'f_b',name:'Coffee Collective',neighborhood:'Jægersborggade',city:'Copenhagen',verdict:'the reliable second',
      why:'Where the bar you hold was set.',fit:[],grounded:true,status:null,placeRef:null,lat:55.6928,lon:12.5421}],
    mentions:[{id:'f_c',name:'Democratic',city:'Copenhagen',instead:'Fine, but not for this.',grounded:false,status:null,placeRef:null,lat:null,lon:null}],
    plan:null};
  D.asks.unshift(Object.assign(base,o||{}));save();render();
},over||null);

/* ---------- the wait, on the plate ---------- */
{
  const {ctx,page}=await boot({});
  await page.evaluate(()=>{setPref('askKey','sk-test');askDraft.dest='Lisbon';askDraft.kind='city';askDraft.reach='a short drive';runAsk()});
  await page.waitForTimeout(900);
  let w=await waitState(page);
  ok(w.on,'the wait — it is a plate, not a page',JSON.stringify(w));
  ok(!w.bar,'the wait — the bar steps aside');
  ok(w.plate==='belt','the wait — the plate is the belt before anything is placed',w.plate);
  ok(w.progTop===78,'the wait — the rule sits at 78',w.progTop);
  ok(w.progLeft===20&&w.progRight===20,'the wait — the rule runs gutter to gutter',JSON.stringify(w));
  ok(w.markBg==='rgb(36, 29, 24)','the wait — the live line’s mark is ink, not the ember',w.markBg);
  ok(w.markAnim==='none','the wait — and it does not breathe: the tip already does',w.markAnim);
  ok(w.narrH==='340px','the wait — the narration scrim opens at its reading height',w.narrH);
  ok(/a short drive/.test(w.meta||''),'the wait — the rule states the reach before it has a count',w.meta);
  ok(/Nothing is written down until an answer comes back/.test(w.foot||''),'the wait — the footnote before any name goes out',w.foot);
  const e=await embers(page);
  ok(e.length===2,'the wait — the whole ember budget is the rule’s fill and its tip',JSON.stringify(e));
  ok(!/200px/.test(await page.evaluate(()=>document.querySelector('.askwait').innerHTML)),'the wait — the 200px pin box at the foot is gone');
  ok(!/Asking about Lisbon[\s\S]*Asking about Lisbon/.test(await txt(page)),'the wait — the destination is stated once');

  // ...and it reframes as the first address confirms
  await page.waitForTimeout(9000);
  w=await waitState(page);
  ok(w.plate==='plot','the wait — the plate reframes to the drawn plot as names land',JSON.stringify(w));
  ok(w.pins>0,'the wait — pins actually landed on it',w.pins);
  ok(/of .* placed/.test(w.meta||''),'the wait — the rule counts what has been placed',w.meta);
  ok(w.narrH==='300px','the wait — the scrim gives the plate its room back',w.narrH);
  ok(/checked against a real address/.test(w.foot||''),'the wait — the footnote turns to the grounding rule',w.foot);
  const e2=await embers(page);
  ok(e2.length===2,'the wait — still exactly the rule and its tip',JSON.stringify(e2));

  /* ---------- the answer waits on the door, it is not pushed up ---------- */
  await page.waitForTimeout(9000);
  const d=await doorState(page);
  ok(d.view==null&&d.tab==='atlas','the answer lands on the door, not on a screen pushed up',JSON.stringify(d));
  ok(d.rest==='416','03b — drawn at 416',JSON.stringify(d));
  ok(d.plot&&!d.belt,'03b — the plate is the answer’s own ground',JSON.stringify(d));
  const t=await txt(page);
  ok(/What Carta found/i.test(t),'03b — the label',t);
  ok(/Lisbon · /.test(t),'03b — where it was asked, and how many came back',t);
  ok(/Read all /i.test(t),'03b — the action',t);
  ok(/Not now/.test(t),'03b — and the way to put it down');
  ok(!/undefined|NaN|\[object/.test(t),'03b — nothing leaked into the copy',t);
  const ea=await embers(page);
  ok(ea.filter(x=>!/doorsheet/.test(x)).length===1,'03b — exactly one ember: the bar’s own door',JSON.stringify(ea));
  await ctx.close();
}

/* ---------- cancel is a real cancel ---------- */
{
  const {ctx,page}=await boot({});
  const before=await page.evaluate(()=>D.asks.length);
  await page.evaluate(()=>{setPref('askKey','sk-test');askDraft.dest='Lisbon';runAsk()});
  await page.waitForTimeout(4000);
  await page.evaluate(()=>cancelAsk());
  await page.waitForTimeout(6000);
  const after=await page.evaluate(()=>({n:D.asks.length,view:pageView&&pageView.kind,run:typeof askRun!=='undefined'&&askRun}));
  ok(after.n===before,'cancel — nothing is written to the record',JSON.stringify(after));
  ok(after.view==='ask','cancel — and it lands back on the composer',JSON.stringify(after));
  ok(after.run===null,'cancel — the run is dropped',JSON.stringify(after));
  await ctx.close();
}

/* ---------- the failure still has its three doors ---------- */
{
  const {ctx,page}=await boot({});
  await page.evaluate(()=>{window.__askFail=true;setPref('askKey','sk-test');askDraft.dest='Lisbon';runAsk()});
  await page.waitForTimeout(6000);
  const t=await txt(page),w=await waitState(page);
  ok(w.on,'the failure — it stays on the wait, where the work was');
  ok(/Try again/i.test(t)&&/Copy the brief instead/i.test(t)&&/Back to the ask/i.test(t),'the failure — the same three doors',t);
  ok(await page.evaluate(()=>D.asks.length===1),'the failure — nothing written');
  const clickable=await page.evaluate(()=>{
    const b=[...document.querySelectorAll('.askwait .narr .btn')];
    return b.length&&b.every(x=>getComputedStyle(x).pointerEvents!=='none');
  });
  ok(clickable,'the failure — the doors in the scrim take a tap (the scrim itself does not)');
  await ctx.close();
}

/* ---------- the migration, and the ladder ---------- */
{
  const {ctx,page}=await boot({});
  const t=await txt(page),d=await doorState(page);
  ok(await page.evaluate(()=>!!D.asks[0].openedAt),'the migration — an ask already on the record arrives read');
  ok(await page.evaluate(()=>!!getPref('asksReadBackfill','')),'the migration — and it is a one-off, flagged in prefs');
  ok(await page.evaluate(()=>D.asks[0].openedAt===D.asks[0].createdAt),'the migration — stamped from when it was actually made');
  ok(!/What Carta found\n/.test(t)||/On the shelf|Best so far/.test(t),'the migration — the door is not hijacked by the whole ask history',t);
  ok(d.rest==='450','the ladder — with no unread answer, the resting bag leads',JSON.stringify(d));

  // 03b outranks 04
  await seedAnswer(page);await page.waitForTimeout(500);
  ok((await doorState(page)).rest==='416','the ladder — an unread answer outranks a resting bag');
  await ctx.close();
}
/* ...and 03 outranks 03b. Booted without the snooze this time: the resume poll
   the snooze is explicitly designed to survive (v7.37.5) cannot be used to put
   the brew back, so the brew is simply never put down. */
{
  const ctx=await browser.newContext({viewport:{width:390,height:800}});
  await ctx.addInitScript(`try{localStorage.setItem('carta7.firstrun','0')}catch(e){}`);
  await ctx.addInitScript(env);
  const page=await ctx.newPage();
  page.on('pageerror',e=>problems.push('pageerror: '+e.message));
  await page.goto(`http://127.0.0.1:${port}/index.html`,{waitUntil:'load'});
  await page.waitForTimeout(1800);
  await page.evaluate(()=>{try{closeSheet()}catch(e){}});
  await seedAnswer(page);await page.waitForTimeout(500);
  const withShot=await doorState(page);
  ok(withShot.rest==='352','the ladder — a waiting brew still outranks an unread answer',JSON.stringify(withShot));
  await ctx.close();
}

/* ---------- reading it, and putting it down ---------- */
{
  const {ctx,page}=await boot({});
  await seedAnswer(page);await page.waitForTimeout(400);
  const t=await txt(page);
  ok(/Copenhagen · three names/i.test(t),'03b — the destination and the count, in the record’s own words',t);
  ok(/Prolog/i.test(t),'03b — the name the model argued first',t);
  ok(/the cleanest cup/i.test(t),'03b — what it is best for');
  ok(/Kødbyen · a short drive/i.test(t),'03b — where, and how far you said you would go',t);
  ok(/Two confirmed\. One listed, never drawn\./i.test(t),'03b — the grounding, stated on the door',t);

  await page.evaluate(()=>{[...document.querySelectorAll('#atlasleaf .btn')].find(b=>/Read all/.test(b.textContent)).click()});
  await page.waitForTimeout(600);
  ok(await page.evaluate(()=>pageView&&pageView.kind)==='askresult','03b — Read all opens the answer');
  ok(await page.evaluate(()=>!!D.asks[0].openedAt),'03b — opening it is what marks it read');
  await page.evaluate(()=>{pageView=null;render()});await page.waitForTimeout(500);
  ok((await doorState(page)).rest==='450','03b — read once, the rung is spent');

  // Not now, and the undo behind it
  await page.evaluate(()=>{D.asks[0].openedAt=null;save();render()});await page.waitForTimeout(400);
  ok((await doorState(page)).rest==='416','03b — back, unread');
  await page.evaluate(()=>{[...document.querySelectorAll('#atlasleaf .qlink')].find(b=>/Not now/.test(b.textContent)).click()});
  await page.waitForTimeout(500);
  ok((await doorState(page)).rest==='450','03b — Not now drops it a rung');
  ok(await page.evaluate(()=>!!D.asks[0].setAsideAt),'03b — and writes it down, so it does not come back on the next open');
  await page.evaluate(()=>{document.querySelector('#toast .undo').click()});
  await page.waitForTimeout(500);
  ok((await doorState(page)).rest==='416','03b — undo puts it back');
  await ctx.close();
}

/* ---------- the plot's labels, where the ground is tight ----------
   The design asks for labels="on" on both new plates. <carta-plot> fits its
   points to the box, so two cafés two streets apart land two dots apart — and
   before this the label above every dot was drawn unconditionally, which on a
   real city centre is a smear rather than a name. A label that will not fit is
   dropped now, the way the rest of the layer already drops one. */
{
  const {ctx,page}=await boot({});
  await seedAnswer(page,{destination:'Lisbon',mentions:[],findings:[
    {id:'f_1',name:'Copenhagen Coffee Lab',neighborhood:'Baixa',city:'Lisbon',verdict:'the cleanest cup',why:'',fit:[],grounded:true,status:null,placeRef:null,lat:38.7100,lon:-9.1400},
    {id:'f_2',name:'Fábrica Coffee Roasters',neighborhood:'Baixa',city:'Lisbon',verdict:'',why:'',fit:[],grounded:true,status:null,placeRef:null,lat:38.7104,lon:-9.1404},
    {id:'f_3',name:'Comoba',neighborhood:'Cais do Sodré',city:'Lisbon',verdict:'',why:'',fit:[],grounded:true,status:null,placeRef:null,lat:38.7108,lon:-9.1396},
    {id:'f_4',name:'Hello, Kristof',neighborhood:'Príncipe Real',city:'Lisbon',verdict:'',why:'',fit:[],grounded:true,status:null,placeRef:null,lat:38.7180,lon:-9.1480}]});
  await page.waitForTimeout(700);
  const lab=await page.evaluate(()=>{
    const svg=document.querySelector('#atlasplate carta-plot svg');
    if(!svg)return null;
    const t=[...svg.querySelectorAll('text')];
    const bb=t.map(x=>x.getBBox());
    let overlap=0;
    for(let i=0;i<bb.length;i++)for(let j=i+1;j<bb.length;j++){
      const a=bb[i],b=bb[j];
      if(!(a.x+a.width<b.x||b.x+b.width<a.x||a.y+a.height<b.y||b.y+b.height<a.y))overlap++;
    }
    // proof the placement actually ran: with the old rule every label sat at
    // exactly y - r - 6 above its own dot. Some of these cannot.
    const moved=[...svg.querySelectorAll('g[data-id]')].filter(g=>{
      const c=g.querySelector('circle'),x=g.querySelector('text');
      if(!c||!x)return false;
      return Math.abs((+x.getAttribute('y'))-(+c.getAttribute('cy')-(+c.getAttribute('r'))-6))>0.5;
    }).length;
    return {dots:svg.querySelectorAll('circle').length,labels:t.length,overlap,moved,
      halo:t.length?getComputedStyle(t[0]).paintOrder:''};
  });
  ok(lab&&lab.dots===4,'the plot — every confirmed name is a dot',JSON.stringify(lab));
  ok(lab&&lab.overlap===0,'the plot — and no two labels overprint',JSON.stringify(lab));
  ok(lab&&lab.moved>0,'the plot — a crowded name is moved off the dot rather than stacked on it',JSON.stringify(lab));
  ok(lab&&lab.labels+0>=lab.dots-1,'the plot — and only what genuinely will not fit is dropped',JSON.stringify(lab));
  ok(lab&&/stroke/.test(lab.halo),'the plot — type over a plate carries the layer’s own halo',JSON.stringify(lab));
  await ctx.close();
}

/* ---------- an unread answer survives the next load ----------
   The back-fill runs in load(). Unflagged it would run at EVERY load, and the
   answer that came back five minutes ago and has not been opened yet would be
   stamped read the next time the tab was reopened — the rung would appear
   once and never again. This is the check that says it is a migration rather
   than a rule, and it fails cleanly against the unflagged version.

   load() is re-run rather than the page reloaded, deliberately: the fixture
   re-seeds `carta7.v1` on every page load, so a real reload would wipe what
   was just written and test the fixture instead of the app. load() reading
   the record back off storage IS the code path under test. */
{
  const {ctx,page}=await boot({});
  await seedAnswer(page);await page.waitForTimeout(500);
  ok((await doorState(page)).rest==='416','a second load — unread before it');
  const again=await page.evaluate(()=>{
    D=load();render();
    return {unread:!D.asks[0].openedAt,flag:!!(D.prefs&&D.prefs.asksReadBackfill),id:D.asks[0].id};
  });
  await page.waitForTimeout(400);
  ok(again.id==='ask_new','a second load — the answer came back off storage',JSON.stringify(again));
  ok(again.flag,'a second load — and the migration flag came back with it',JSON.stringify(again));
  ok(again.unread,'a second load — so the back-fill leaves the unread answer alone',JSON.stringify(again));
  ok((await doorState(page)).rest==='416','a second load — and the rung is still there');
  await ctx.close();
}

/* ---------- the framed plot is measured, not letterboxed ----------
   A 336-unit viewBox at the data's own aspect ratio scaled in with `meet`
   wasted most of a landscape plate on a portrait spread of cafés, and shrank
   the whole drawing with it: the design asks for dot="9" and 10px names, and
   at the door's own plate that was landing at about six pixels — on a phone
   short enough for atlasPlateH to halve the plate, at one. A framed plot
   builds its box from the box it is actually in now, so one SVG unit is one
   CSS pixel and those numbers mean what they say. */
async function plotFit(page){
  return page.evaluate(()=>{
    const el=document.querySelector('#atlasplate carta-plot'),svg=el&&el.querySelector('svg');
    if(!svg)return null;
    const vb=svg.getAttribute('viewBox').split(' ').map(Number);
    const r=el.getBoundingClientRect(),c=svg.querySelector('circle');
    return {vbW:vb[2],vbH:vb[3],boxW:Math.round(r.width),boxH:Math.round(r.height),
      dotPx:c?Math.round(c.getBoundingClientRect().width):0};
  });
}
{
  const {ctx,page}=await boot({});
  await seedAnswer(page);await page.waitForTimeout(700);
  const f=await plotFit(page);
  ok(f&&Math.abs(f.vbW-f.boxW)<=2&&Math.abs(f.vbH-f.boxH)<=2,'the plot — a framed plot takes the shape of its own box',JSON.stringify(f));
  ok(f&&f.dotPx>=17&&f.dotPx<=19,'the plot — so dot="9" is nine pixels, not whatever the letterbox left',JSON.stringify(f));
  await ctx.close();
}
{
  const {ctx,page}=await boot({ctx:{viewport:{width:390,height:667}}});
  await seedAnswer(page);await page.waitForTimeout(700);
  const f=await plotFit(page);
  ok(f&&f.dotPx>=17&&f.dotPx<=19,'a short phone — and still nine pixels there, where it used to be one',JSON.stringify(f));
  ok(f&&f.boxH>=90,'a short phone — the clearance shrinks with the plate rather than eating it',JSON.stringify(f));
  await ctx.close();
}

/* ---------- an answer that placed nothing ---------- */
{
  const {ctx,page}=await boot({});
  await seedAnswer(page,{findings:[{id:'f_x',name:'Sonho',city:'Porto',verdict:'the cleanest cup',
    why:'',fit:[],grounded:false,status:null,placeRef:null,lat:null,lon:null}],mentions:[],destination:'Porto'});
  await page.waitForTimeout(500);
  const d=await doorState(page),t=await txt(page);
  ok(d.belt&&!d.plot,'nothing placed — the passport stands rather than an empty box',JSON.stringify(d));
  ok(/Sonho/i.test(t),'nothing placed — the name is still read out',t);
  ok(/Read the answer/i.test(t),'nothing placed — one name, so the action says so',t);
  ok(!/Read all one/i.test(t),'nothing placed — and not "read all one"');
  ok(/No address could be confirmed/i.test(t),'nothing placed — and the line says so rather than counting to zero',t);
  await ctx.close();
}

/* ---------- an answer with nothing to stand behind ---------- */
{
  const {ctx,page}=await boot({});
  await seedAnswer(page,{findings:[],mentions:[],destination:'Reykjavík'});
  await page.waitForTimeout(500);
  const t=await txt(page);
  ok(/didn’t name anything it could stand behind/i.test(t),'an empty answer — says so plainly rather than drawing a blank ledger',t);
  ok(!/unread\s*$/m.test(t),'an empty answer — and does not rule two empty facts under it');
  await ctx.close();
}

/* ---------- a short phone, dusk, reduced motion, 320px ---------- */
{
  const {ctx,page}=await boot({ctx:{viewport:{width:390,height:667}}});
  await seedAnswer(page);await page.waitForTimeout(500);
  const d=await doorState(page);
  ok(!d.leafOverflows,'a short phone (390x667) — the answer leaf needs no scroll to reach the action',JSON.stringify(d));
  ok(Number(String(d.h).replace('px',''))>=120,'a short phone — the plate keeps its floor',d.h);
  await ctx.close();
}
{
  const {ctx,page}=await boot({ctx:{colorScheme:'dark'}});
  await seedAnswer(page);await page.waitForTimeout(500);
  const c=await page.evaluate(()=>{const l=document.getElementById('atlasleaf');
    return {bg:getComputedStyle(l).backgroundColor,fill:getComputedStyle(l.querySelector('.btn-graphite')).backgroundColor}});
  ok(c.bg==='rgb(33, 27, 23)','dusk — the leaf lifts through the roles',JSON.stringify(c));
  ok(c.fill!=='rgb(36, 29, 24)','dusk — and the ink fill inverts with it',JSON.stringify(c));
  await ctx.close();
}
{
  const {ctx,page}=await boot({ctx:{reducedMotion:'reduce'}});
  await page.evaluate(()=>{setPref('askKey','sk-test');askDraft.dest='Lisbon';runAsk()});
  await page.waitForTimeout(1200);
  const a=await page.evaluate(()=>{const t=document.getElementById('think_tip');
    return t?getComputedStyle(t).animationName:null});
  ok(a==='none'||a==='ca-breathe-still','reduced motion — the tip stops travelling',a);
  await page.evaluate(()=>cancelAsk());
  await ctx.close();
}
{
  const {ctx,page}=await boot({ctx:{viewport:{width:320,height:720}}});
  await seedAnswer(page);await page.waitForTimeout(500);
  const wide=await page.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth);
  ok(!wide,'320px — 03b does not scroll sideways');
  await page.evaluate(()=>{setPref('askKey','sk-test');askDraft.dest='Lisbon';runAsk()});
  await page.waitForTimeout(1200);
  const wide2=await page.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth);
  ok(!wide2,'320px — nor does the wait');
  await page.evaluate(()=>cancelAsk());
  await ctx.close();
}

/* ---------- turn 3 · the answer as an index, and one finding whole ----------
   The handoff's third turn is what unblocked this half of the design: the six
   names became an index, and every reason moved one level down rather than
   being cut. These checks are mostly about that move being real — that
   nothing the old single-column answer carried has quietly gone missing. */
const ansState=p=>p.evaluate(()=>{
  const leaf=document.getElementById('ansleaf'),plate=document.getElementById('ansplate');
  const hero=document.getElementById('anshero');
  return {view:pageView&&pageView.kind,top:leaf&&leaf.style.top,plate:plate&&plate.style.height,
    heroGone:hero&&hero.classList.contains('gone'),heroTop:hero&&hero.style.top,
    leafH:leaf&&Math.round(leaf.getBoundingClientRect().height),
    rows:document.querySelectorAll('#ansleaf .idxrow').length,
    near:document.querySelectorAll('#ansleaf .nearrow').length,
    overflow:leaf?leaf.querySelector('.body').scrollHeight>leaf.querySelector('.body').clientHeight+1:null,
    text:document.getElementById('main').innerText};
});
const findState=p=>p.evaluate(()=>{
  const leaf=document.getElementById('findleaf'),plate=document.getElementById('findplate');
  return {view:pageView&&pageView.kind,top:leaf&&leaf.style.top,plate:plate&&plate.style.height,
    leafH:leaf&&Math.round(leaf.getBoundingClientRect().height),
    figs:document.querySelectorAll('#findleaf .fig').length,
    marks:document.querySelectorAll('#findleaf .pick').length,
    overflow:leaf?leaf.querySelector('.body').scrollHeight>leaf.querySelector('.body').clientHeight+1:null,
    text:document.getElementById('main').innerText};
});
{
  const {ctx,page}=await boot({});
  await page.evaluate(()=>openAskResultScreen('ask_lx'));
  await page.waitForTimeout(900);
  let s=await ansState(page);
  ok(s.view==='askresult','the answer — it opens',JSON.stringify(s));
  ok(s.leafH===357,'the answer — the resting leaf keeps the height it was drawn with, at any viewport',JSON.stringify(s));
  ok(Number(String(s.plate).replace('px',''))===Number(String(s.top).replace('px',''))+18,
    'the answer — and the plate reaches exactly under it, never leaving bare ground',JSON.stringify(s));
  ok(s.rows===3,'the answer — one index row per finding',String(s.rows));
  /* Phase 33 took the "tap a name for its argument" hint out of the head — the
     head now names what the column's kilometres are counted from, and the tap is
     taught by the glyph on every row. So the check moves to the glyph rather
     than being dropped: the rows must still SAY they are doors. */
  const doors=await page.evaluate(()=>[...document.querySelectorAll('#ansleaf .idxrow')]
    .map(r=>{const g=r.querySelector('.go');return g?g.textContent.trim():''}));
  ok(doors.length===3&&doors.every(g=>g==='→'),'the answer — the rows say they are doors',JSON.stringify(doors));
  ok(/km from the three/i.test(s.text),'the answer — and the head says what the kilometres are counted from',s.text);
  ok(/Baixa · 0\.8 km/i.test(s.text),'the answer — quarter and distance, off the record’s own lookup',s.text);
  /* …and the number is not merely present, it is counted from the mean of the
     marks the plate itself draws. This is the whole of gap 4: an origin made of
     nothing but the answer. Recomputed here from the plate's own `marks`
     attribute, so editing the literal above cannot launder a drifted anchor —
     the row and the cross have to keep agreeing. */
  const agree=await page.evaluate(()=>{
    const c=document.querySelector('#ansplate carta-city');
    const marks=JSON.parse(c.getAttribute('marks')||'[]');
    if(marks.length<2)return {skip:true};
    const at={lat:marks.reduce((t,m)=>t+m.lat,0)/marks.length,
              lon:marks.reduce((t,m)=>t+m.lon,0)/marks.length};
    const out=[];
    document.querySelectorAll('#ansleaf .idxrow').forEach(r=>{
      const name=r.querySelector('.t').textContent.trim();
      const m=marks.find(x=>x.name===name);if(!m)return;
      const d=Math.hypot(KMX(m.lon,at.lat)-KMX(at.lon,at.lat),KMY(m.lat)-KMY(at.lat));
      const want=(d<10?d.toFixed(1):Math.round(d))+' km';
      const got=(r.querySelector('.g')||{textContent:''}).textContent.trim();
      out.push({name,want,got,ok:got.toLowerCase().endsWith(want.toLowerCase())});
    });
    return {out};
  });
  ok(!agree.skip&&agree.out.length===3&&agree.out.every(x=>x.ok),
    'the answer — every kilometre is counted from the mean of the marks the plate draws',
    JSON.stringify(agree));
  ok(/8 · once/.test(s.text),'the answer — what you already made of it');
  ok(/unread/.test(s.text),'the answer — and what you have not');
  ok(!/undefined|NaN|\[object/.test(s.text),'the answer — nothing leaked into the copy',s.text);
  ok((await embers(page)).length===1,'the answer — exactly one ember: the bar’s own door',
    JSON.stringify(await embers(page)));

  /* the pull, and everything that is about the answer rather than one café */
  await page.evaluate(()=>setAnsStop(2));await page.waitForTimeout(600);
  s=await ansState(page);
  ok(s.leafH===575,'the pull — the high leaf keeps its own designed height',JSON.stringify(s));
  ok(s.heroGone,'the pull — and the headline steps aside');
  ok(/What Carta would do/i.test(s.text),'the pull — the plan',s.text);
  ok(/Close, but not the pick/i.test(s.text),'the pull — the near misses');
  ok(s.near>0,'the pull — each with the one sentence saying why not',String(s.near));
  // the fixture's only unplaced café is a mention, which by design belongs in
  // Close-but-not-the-pick. Seed a RANKED name that failed to place, so the
  // section has something legitimate to hold and the de-dup is shown not to
  // swallow it.
  await page.evaluate(()=>{D.asks[0].findings.push({id:'f_lost',name:'Hey Hey',city:'Lisbon',
    verdict:'',why:'',fit:[],grounded:false,status:null,placeRef:null,lat:null,lon:null});save();setAnsStop(2)});
  await page.waitForTimeout(500);
  s=await ansState(page);
  ok(/Named and nowhere/i.test(s.text)&&/Hey Hey/.test(s.text),
    'the pull — a ranked name that came back with no street on it',s.text);
  const dupes=await page.evaluate(()=>{
    const t=[...document.querySelectorAll('#ansleaf .nearrow .t')].map(x=>x.textContent.trim());
    return t.length-new Set(t).size;
  });
  ok(dupes===0,'the pull — a café that is both a near miss and unplaced is listed once, not twice',String(dupes));
  ok(!s.overflow,'the pull — it all lands inside the frame');

  await page.evaluate(()=>setAnsStop(0));await page.waitForTimeout(600);
  s=await ansState(page);
  ok(s.leafH===301,'the ground — the low leaf keeps its own designed height',JSON.stringify(s));
  ok(Number(String(s.plate).replace('px',''))===Number(String(s.top).replace('px',''))+18,
    'the ground — and the plate grows to meet it',JSON.stringify(s));
  ok(!s.heroGone,'the ground — the headline is still standing');
  await ctx.close();
}
/* ---------- one finding, whole ---------- */
{
  const {ctx,page}=await boot({});
  await page.evaluate(()=>openAskResultScreen('ask_lx'));await page.waitForTimeout(800);
  await page.evaluate(()=>{document.querySelectorAll('#ansleaf .idxrow')[1].click()});
  await page.waitForTimeout(900);
  let f=await findState(page);
  ok(f.view==='askfind','a finding — an index row is a door',JSON.stringify(f));
  ok(f.leafH===357,'a finding — opens at rest, the leaf at its designed height',JSON.stringify(f));
  ok(/Copenhagen Coffee Lab/.test(f.text),'a finding — the name',f.text);
  ok(/the reliable second/i.test(f.text),'a finding — the verdict, the largest thing under the name',f.text);
  ok(/Nordic-leaning/i.test(f.text),'a finding — and the why, directly under it',f.text);
  ok(/two of three/i.test(f.text),'a finding — where it sits in the set, so the other two are not lost');
  ok(!/two of three[\s\S]*two of three/i.test(f.text),'a finding — and it says so once, not twice');

  await page.evaluate(()=>toggleFindStop(1));await page.waitForTimeout(700);
  f=await findState(page);
  ok(f.leafH===633,'read down — the composer’s own geometry, not a new one',JSON.stringify(f));
  ok(/What to order/i.test(f.text),'read down — what to ask for at the counter',f.text);
  ok(/rotates/i.test(f.text)&&/never asked what is on it today/i.test(f.text),'read down — a menu is marked as a menu, not stated as a fact');
  ok(/How it fits you/i.test(f.text),'read down — the fit');
  ok(f.figs>=2,'read down — and the figures the record can open are dotted doors',String(f.figs));
  ok(/Your mark on it/i.test(f.text)&&f.marks>=3,'read down — the three marks',String(f.marks));
  const reach=await page.evaluate(()=>{
    const b=document.querySelector('#findleaf .body');
    const btn=[...b.querySelectorAll('.btn')].pop();
    return {scrolls:getComputedStyle(b).overflowY==='auto',btn:!!btn,
      reachable:!!btn&&btn.offsetTop+btn.offsetHeight<=b.scrollHeight};
  });
  ok(reach.scrolls&&reach.btn&&reach.reachable,
    'read down — one page and one scroll: the action is reachable, never clipped away',JSON.stringify(reach));

  // a mark writes immediately, and the answer behind it agrees
  await page.evaluate(()=>{[...document.querySelectorAll('#findleaf .pick')].find(b=>/booked/i.test(b.textContent)).click()});
  await page.waitForTimeout(600);
  ok(await page.evaluate(()=>askOf(pageView.id).f.status==='booked'),'read down — a mark writes, no confirm');
  // and a dotted figure really opens the cups it was read from
  await page.evaluate(()=>{document.querySelector('#findleaf .fig').click()});
  await page.waitForTimeout(600);
  ok(await page.evaluate(()=>!!document.getElementById('sheet').classList.contains('open')
     ||(pageView&&pageView.kind!=='askfind')),'read down — a dotted figure opens what it was read from');
  await ctx.close();
}
/* ---------- at the frame it was drawn against, the figures are exact ----------
   Everywhere else the stops scale so the leaf keeps its designed height (the
   check above). Here, at 812 minus the bar, they must land on the handoff's
   own numbers to the pixel — which is what says the scaling is a fit rather
   than a drift. */
{
  const {ctx,page}=await boot({ctx:{viewport:{width:480,height:869}}});
  await page.evaluate(()=>openAskResultScreen('ask_lx'));await page.waitForTimeout(900);
  let s=await ansState(page);
  ok(s.top==='398px'&&s.plate==='416px','the reference frame — the resting stop is 398 over a 416 plate',JSON.stringify(s));
  ok(s.heroTop==='160px','the reference frame — and the headline lands on its own 160',s.heroTop);
  await page.evaluate(()=>setAnsStop(0));await page.waitForTimeout(500);
  s=await ansState(page);
  ok(s.top==='454px'&&s.plate==='472px','the reference frame — the low stop is 454 over a 472 plate',JSON.stringify(s));
  await page.evaluate(()=>setAnsStop(2));await page.waitForTimeout(500);
  ok((await ansState(page)).top==='180px','the reference frame — and the high stop is 180');
  await page.evaluate(()=>{setAnsStop(1);document.querySelectorAll('#ansleaf .idxrow')[1].click()});
  await page.waitForTimeout(900);
  ok((await findState(page)).top==='398px','the reference frame — a finding opens at 398');
  await page.evaluate(()=>toggleFindStop(1));await page.waitForTimeout(600);
  const f=await findState(page);
  ok(f.top==='122px'&&f.plate==='140px','the reference frame — and reads down to the composer’s 122 over 140',JSON.stringify(f));
  await ctx.close();
}

/* ---------- the distance, and what it is measured from ----------
   Carta defines no anchor for an ask. Rather than name a quarter the record
   cannot defend, the centre is the mean of what the ask itself placed — and
   where there is nothing to take a mean of, there is no distance drawn. */
{
  const {ctx,page}=await boot({});
  const one=await page.evaluate(()=>{
    D.asks[0].findings=[D.asks[0].findings[0]];D.asks[0].mentions=[];D.asks[0].plan=null;save();
    openAskResultScreen('ask_lx');
    return true;
  });
  await page.waitForTimeout(800);
  const t=await page.evaluate(()=>document.getElementById('main').innerText);
  ok(one&&/Baixa/i.test(t),'one name placed — the quarter still stands',t);
  /* scoped to the leaf on purpose. The plate carries a scale bar, which is the
     drawing's own ruler and says km whatever the record holds; the rows are
     where a distance would be a claim about where you are. */
  const leaf=await page.evaluate(()=>{const l=document.getElementById('ansleaf');return l?l.innerText:''});
  ok(!/ km/i.test(leaf),'one name placed — and no distance is invented from a single point',leaf);
  /* and the reach itself is withheld for the same reason: a ring centred on the
     one café would measure your reach from the café rather than from you. */
  const rings=await page.evaluate(()=>{const c=document.querySelector('#ansplate carta-city');
    return c?c.getAttribute('rings'):'(no plate)'});
  ok(rings==='off','one name placed — and the reach is not drawn from it either','rings='+rings);
  await ctx.close();
}
/* ---------- dusk, reduced motion, a short phone, 320px ---------- */
{
  const {ctx,page}=await boot({ctx:{colorScheme:'dark'}});
  await page.evaluate(()=>openAskResultScreen('ask_lx'));await page.waitForTimeout(800);
  const c=await page.evaluate(()=>{const l=document.getElementById('ansleaf');
    return {bg:getComputedStyle(l).backgroundColor,n:getComputedStyle(document.querySelector('#ansleaf .idxrow .n')).borderColor}});
  ok(c.bg==='rgb(33, 27, 23)','dusk — the answer leaf lifts through the roles',JSON.stringify(c));
  ok(c.n!=='rgb(36, 29, 24)','dusk — and the row numeral inverts with it',JSON.stringify(c));
  await ctx.close();
}
{
  const {ctx,page}=await boot({ctx:{viewport:{width:390,height:667}}});
  await page.evaluate(()=>openAskResultScreen('ask_lx'));await page.waitForTimeout(800);
  const s=await ansState(page);
  ok(!s.overflow,'a short phone (390x667) — the index still lands inside the leaf',JSON.stringify(s));
  await ctx.close();
}
{
  const {ctx,page}=await boot({ctx:{viewport:{width:320,height:720}}});
  await page.evaluate(()=>openAskResultScreen('ask_lx'));await page.waitForTimeout(800);
  ok(!(await page.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth)),
    '320px — the answer does not scroll sideways');
  await page.evaluate(()=>{document.querySelectorAll('#ansleaf .idxrow')[0].click()});
  await page.waitForTimeout(800);
  ok(!(await page.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth)),
    '320px — nor does a finding');
  await ctx.close();
}

/* ---------- turn 5 · the plate is the city ----------
   <carta-city> replaced the drawn plot under an answer and under one finding.
   What matters is not that it renders but that it stays honest and stays in
   step with the index: every row that can be placed has a mark, the numeral on
   the mark is the ROW's number rather than the mark's own position, the mark is
   a door, and nothing is drawn that the grounding did not confirm. */
{
  const {ctx,page}=await boot({});
  await page.evaluate(()=>openAskResultScreen('ask_lx'));
  await page.waitForTimeout(1000);
  const plate=await page.evaluate(()=>{
    const c=document.querySelector('#ansplate carta-city');
    if(!c)return {none:true,plot:!!document.querySelector('#ansplate carta-plot')};
    const svg=c.querySelector('svg');
    return {span:c.getAttribute('span'),rings:c.getAttribute('rings'),coast:c.getAttribute('coast'),
      marks:JSON.parse(c.getAttribute('marks')||'[]'),
      painted:!!svg&&svg.children.length>0,
      doors:[...c.querySelectorAll('g[data-id]')].map(g=>g.dataset.id)};
  });
  ok(!plate.none,'the answer stands on <carta-city>, not the drawn plot',JSON.stringify(plate));
  ok(plate.painted,'and it painted — the class is defined after the tables, so a cold load draws',JSON.stringify(plate));
  ok(plate.coast==='Lisbon','the coast is asked for by name; CITY_ARCS decides whether it answers',plate.coast);

  /* the numbering law. A finding the lookup could not place still takes a row,
     so a mark numbered by its own position in the drawn set would print 2 on
     the café the index calls 3 the moment one name in the middle is unplaced. */
  const rows=await page.evaluate(()=>[...document.querySelectorAll('#ansleaf .idxrow')]
    .map(r=>({n:r.querySelector('.n').textContent.trim(),name:r.querySelector('.t').textContent.trim()})));
  const placedNames=await page.evaluate(()=>(D.asks.find(a=>a.id==='ask_lx').findings||[])
    .filter(f=>f.grounded&&f.lat!=null).map(f=>f.name));
  const agree=plate.marks.every(m=>{const r=rows.find(x=>x.name===m.name);return r&&r.n===String(m.n)});
  ok(agree,'every mark carries its ROW\'s number, not its own place in the drawn set',
    JSON.stringify({marks:plate.marks.map(m=>[m.n,m.name]),rows:rows.map(r=>[r.n,r.name])}));
  ok(plate.marks.length===placedNames.length,
    'placed is a mark AND a row — as many marks as the answer could ground',
    JSON.stringify({marks:plate.marks.length,placed:placedNames.length}));
  ok(plate.marks.every(m=>placedNames.includes(m.name)),
    'and nothing is drawn that the lookup did not confirm',JSON.stringify(plate.marks.map(m=>m.name)));
  ok(plate.doors.length===plate.marks.length&&plate.doors.every(Boolean),
    'a mark is a door: every one carries its finding id',JSON.stringify(plate.doors));

  /* the bug the render caught: a mark centred in the box lands under a scrim
     that is 94% opaque by its own 54% stop, and a row whose mark cannot be seen
     is a row with no mark. Every mark has to sit in the part of the plate that
     is actually read — above the solid half of the headline. */
  const band=await page.evaluate(()=>{
    const c=document.querySelector('#ansplate carta-city'),hero=document.getElementById('anshero');
    const cb=c.getBoundingClientRect(),hb=hero.getBoundingClientRect();
    /* the scrim is `to top`, so its 54% stop is measured UP from the foot: it
       reaches 94% of the card colour at 46% DOWN from the headline's own top,
       and everything below that line is paper. Reading the stop from the wrong
       end put this line 18px too low and the check passed on the very frame
       that prompted it. */
    const solid=hb.top+hb.height*0.46;
    return [...c.querySelectorAll('g[data-id] circle')].map(z=>{
      const b=z.getBoundingClientRect();return {y:Math.round(b.top+b.height/2-cb.top),solid:Math.round(solid-cb.top)};
    });
  });
  ok(band.length>0&&band.every(m=>m.y<m.solid),
    'every mark sits above the solid half of the headline — none is drawn where it cannot be read',
    JSON.stringify(band));

  /* the finding's own ground, under the streets. The streets are unreachable in
     the harness, which is the case the law is written for: the drawn ground
     stands on its own and the note says why. */
  await page.evaluate(()=>{document.querySelectorAll('#ansleaf .idxrow')[0].click()});
  await page.waitForTimeout(900);
  const fin=await page.evaluate(()=>{
    const c=document.querySelector('#findplate carta-city');
    if(!c)return null;const svg=c.querySelector('svg');
    return {span:c.getAttribute('span'),rings:c.getAttribute('rings'),
      marks:JSON.parse(c.getAttribute('marks')||'[]').length,painted:!!svg&&svg.children.length>0};
  });
  ok(fin&&fin.painted,'a finding stands on the same element, at street scale',JSON.stringify(fin));
  ok(fin&&fin.span==='3'&&fin.rings==='0.4,1','with the handoff\'s own figures — nothing derived, because nothing varies',JSON.stringify(fin));
  ok(fin&&fin.marks===1,'and exactly one mark: this finding, not the set',JSON.stringify(fin));

  /* ---- Phase 33 · the anchor says what it is, and a leaf drops the number ---- */
  const lbl=await page.evaluate(()=>{
    const c=document.querySelector('#findplate carta-city');
    return {atLabel:c?c.getAttribute('at-label'):null,at:c?c.getAttribute('at'):null};
  });
  ok(!lbl.atLabel&&/,/.test(lbl.at||''),
    'a finding anchors on the café\'s own coordinate — no mean, so nothing to label',JSON.stringify(lbl));
  const leaf=await page.evaluate(()=>{const l=document.getElementById('findleaf');return l?l.innerText:''});
  ok(leaf&&!/\d\s*km/i.test(leaf),
    'and the leaf carries no kilometre: a distance alone under a name has nothing to be compared to',leaf);
  await ctx.close();
}

/* ---- Phase 33 · the cross on the answer's plate says what it is ---- */
{
  const {ctx,page}=await boot({});
  await page.evaluate(()=>openAskResultScreen('ask_lx'));
  await page.waitForTimeout(1000);
  const anch=await page.evaluate(()=>{
    const c=document.querySelector('#ansplate carta-city');
    const svg=c.querySelector('svg');
    return {at:c.getAttribute('at'),label:c.getAttribute('at-label'),
      drawn:[...svg.querySelectorAll('text')].map(t=>t.textContent)};
  });
  /* `at` is deliberately absent: the element takes the mean of the marks itself,
     so no caller can substitute a guessed origin by leaving the attribute off. */
  ok(anch.at===null,'the answer passes no anchor — the element takes the mean of its own marks',JSON.stringify(anch));
  ok(anch.label==='middle of the three','and names what that point is, counted rather than spelled',JSON.stringify(anch));
  ok(anch.drawn.some(t=>/middle of the three/i.test(t)),
    'and it is drawn on the plate, beside the cross the distances are measured from',JSON.stringify(anch.drawn));
  await ctx.close();
}

/* ---------- turn 5 · the seal, at row scale ----------
   A city the belt cannot place drew NOTHING in Your cities — a blank chip
   beside a drawn one, which reads as a failure rather than as a fact. */
{
  const {ctx,page}=await boot({});
  const seals=await page.evaluate(()=>[...document.querySelectorAll('.doorcity')].map(r=>{
    const city=r.querySelector('carta-city'),svg=r.querySelector('.seal svg,svg');
    return {name:r.querySelector('.t').textContent.trim(),
      drawn:!!svg&&svg.children.length>0,viaCity:!!city};
  }));
  ok(seals.length>1,'Your cities lists more than one city, so the two seals are read side by side',JSON.stringify(seals));
  ok(seals.every(s=>s.drawn),'every city row draws something — no blank chip',JSON.stringify(seals));
  ok(seals.some(s=>s.viaCity),'and the one the belt cannot place draws its own cafés instead',JSON.stringify(seals));
  await ctx.close();
}

/* ---------- turn 4 · the composer's read-as line ----------
   The line's whole point is that it is COUNTED, never inferred: nothing on the
   device knows what "Lisbon" is, so the kind is only ever the keeper's own
   setting said back — "asked as a city" — and never "read as a city". These
   checks walk all six states and then prove the promise: composing performs no
   network call of any kind. */
{
  const {ctx,page}=await boot({});
  const fetched=[];
  page.on('request',r=>fetched.push(r.url()));
  await page.evaluate(()=>{askDraft.dest='';askDraft.kind='city';openAskScreen()});
  await page.waitForTimeout(700);
  const st=await page.evaluate(()=>{
    const set=(k,d)=>{askDraft.kind=k;askDraft.dest=d;return askReadAsParts()};
    return {empty:set('city',''),known:set('city','Lisbon'),unknown:set('city','Porto'),
      hood:set('neighborhood','Baixa'),country:set('country','Ethiopia'),
      none:set('country','Peru'),friend:set('friend','likes what I like')};
  });
  ok(/^Nothing named$/.test(st.empty[0])&&/every cup on the record/.test(st.empty[1]),
    'read-as 1 — nothing named',JSON.stringify(st.empty));
  ok(/^On your record: two cups, two cafés$/.test(st.known[0])&&/scoped to them/.test(st.known[1]),
    'read-as 2 — a city the record names, counted',JSON.stringify(st.known));
  ok(/^No cup read in Porto$/.test(st.unknown[0])&&/asked as a city/.test(st.unknown[1]),
    'read-as 4 — a city it does not: ASKED as, never READ as',JSON.stringify(st.unknown));
  ok(/asked as a neighborhood/.test(st.hood[1]),
    'read-as 4 — a neighborhood always lands here: askScopeOf has no branch for it',JSON.stringify(st.hood));
  ok(/^A country, at your word$/.test(st.country[0])&&/coffees from there, excluded by name/.test(st.country[1]),
    'read-as 5 — a country says COFFEES from there, never cups read there',JSON.stringify(st.country));
  ok(/nothing from there on your record yet/.test(st.none[1]),
    'read-as 5 — and says so plainly where the record is silent',JSON.stringify(st.none));
  ok(/^Not a place$/.test(st.friend[0]),'read-as 6 — a friend is not a place',JSON.stringify(st.friend));
  // the whole line must never claim a lookup happened
  const all=Object.values(st).map(x=>x.join(' ')).join(' | ');
  ok(!/read as/i.test(all),'read-as — the words "read as" never appear: the kind is a setting, not a finding',all);
  ok(!/\b(probably|looks like|appears)\b/i.test(all),'read-as — nothing is estimated');

  // the promise: composing sends nothing
  const before=fetched.length;
  await page.evaluate(()=>{askDraft.dest='Reykjavík';paintAskReadAs();paintAskLedger()});
  await page.waitForTimeout(1200);
  const offsiteNow=fetched.slice(before).filter(u=>!/^http:\/\/127\.0\.0\.1/.test(u));
  ok(offsiteNow.length===0,'read-as — typing a name performs no lookup, on or off device',JSON.stringify(offsiteNow));
  await ctx.close();
}
/* state 3 — a city on the record with a café but nothing scored in it.
   knownCities() is built from PLACES, so this state is reachable and the
   fixture cannot produce it; it is seeded here rather than left untested. */
{
  const {ctx,page}=await boot({});
  const line=await page.evaluate(()=>{
    D.places.push({id:'p_new',createdAt:new Date().toISOString(),name:'Kaffi',city:'Reykjavík',aka:[]});
    save();askDraft.kind='city';askDraft.dest='Reykjavík';
    return askReadAsParts();
  });
  ok(/^One café on your record, no cup scored yet$/.test(line[0]),
    'read-as 3 — a café on the record with nothing scored says the count it has',JSON.stringify(line));
  ok(/scoped to it$/.test(line[1]),'read-as 3 — and scopes to it, singular',JSON.stringify(line));
  ok(!/zero/i.test(line.join(' ')),'read-as 3 — never prints "zero cups"',JSON.stringify(line));
  await ctx.close();
}
/* the composer, on a leaf */
{
  const {ctx,page}=await boot({});
  await page.evaluate(()=>{askDraft.dest='Lisbon';askDraft.kind='city';openAskScreen()});
  await page.waitForTimeout(800);
  const c=await page.evaluate(()=>{
    const leaf=document.getElementById('askleaf'),plate=document.querySelector('.askstage .plate');
    return {bar:!document.getElementById('tabs').hidden,
      top:leaf&&leaf.style.top,plate:plate&&plate.style.height,
      leafH:leaf&&Math.round(leaf.getBoundingClientRect().height),
      kinds:document.querySelectorAll('.askkind .pick').length,
      question:!!document.getElementById('ask_question'),
      text:document.getElementById('main').innerText};
  });
  ok(c.bar,'the composer — the bar stays: it is a leaf now, not a screen of its own');
  ok(/The ask/i.test(c.text)&&/Not now/i.test(c.text),'the composer — its label and its way out',c.text);
  ok(/How far you’ll go/i.test(c.text),'the composer — the reach chips');
  ok(/What goes out with this/i.test(c.text)&&/The bar/i.test(c.text),'the composer — the ledger, before anything leaves');
  ok(/Ask Carta/i.test(c.text),'the composer — the action');
  ok(c.kinds===0&&!c.question,'the composer — the kinds and the question are behind "read it as", not on the leaf');

  await page.evaluate(()=>toggleAskKind());await page.waitForTimeout(500);
  const o=await page.evaluate(()=>({kinds:document.querySelectorAll('.askkind .pick').length,
    question:!!document.getElementById('ask_question')}));
  ok(o.kinds===6,'read it as — all six kinds are reachable, so none was silently dropped',JSON.stringify(o));
  ok(o.question,'read it as — and so is the free-text question');
  await ctx.close();
}
{
  const {ctx,page}=await boot({ctx:{viewport:{width:480,height:869}}});
  await page.evaluate(()=>{askDraft.dest='Lisbon';openAskScreen()});await page.waitForTimeout(800);
  const c=await page.evaluate(()=>{
    const leaf=document.getElementById('askleaf'),plate=document.querySelector('.askstage .plate');
    return {top:leaf&&leaf.style.top,plate:plate&&plate.style.height};
  });
  ok(c.top==='122px'&&c.plate==='140px','the reference frame — the composer is 122 over a 140 strip',JSON.stringify(c));
  await ctx.close();
}
{
  const {ctx,page}=await boot({ctx:{viewport:{width:320,height:720}}});
  await page.evaluate(()=>{askDraft.dest='Lisbon';openAskScreen()});await page.waitForTimeout(800);
  ok(!(await page.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth)),
    '320px — the composer does not scroll sideways');
  await ctx.close();
}

await browser.close();server.close();
console.log(notes.join('\n'));
if(problems.length){console.error('\n'+problems.join('\n'));console.error(`\n${problems.length} problem(s).`);process.exit(1)}
console.log(`\nall ${notes.length} checks passed, no console or page errors`);
})();

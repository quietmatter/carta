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

await browser.close();server.close();
console.log(notes.join('\n'));
if(problems.length){console.error('\n'+problems.join('\n'));console.error(`\n${problems.length} problem(s).`);process.exit(1)}
console.log(`\nall ${notes.length} checks passed, no console or page errors`);
})();

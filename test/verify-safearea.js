/* The device's own edges. Boots the real app against test/fixtures/env.js with
   a notch and a home indicator actually rendered, and walks every room and the
   screens under them asserting that no text is drawn into either band.

   Why this harness exists at all. The standalone launch bug was fixed three
   times — 7.37.6, 7.41.1, 7.42.2 — and each fix shipped unverified, because
   env(safe-area-inset-*) reads 0 in headless Chromium and cannot be
   overridden, so every check "passed" on a frame that had no notch in it. Each
   round fixed the one surface that had been looked at and left the rest, and
   the keeper found the rest. That is not a run of bad luck; it is what a
   feature with no test does.

   So index.html names the two insets as custom properties (--sat/--sab) whose
   value is env(), and everything reads the property. A var() CAN be
   overridden, which is the whole trick: set them here and the app lays itself
   out as it would on a phone.

   The check is deliberately generic rather than a list of the headers already
   known to be wrong. It measures the RANGE box of every text node the app
   paints — the glyphs, not the element, so a bar button may reach the screen
   edge as long as its label steps up clear of the indicator — and flags any
   that land in either band. A screen nobody thought to look at fails here.
   SVG text is exempt: the drawn map bleeds under the status bar on purpose.

     npm i playwright-core --no-save
     node test/verify-safearea.js

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

// an iPhone with a Dynamic Island, in CSS pixels
const SAT=59,SAB=34;

(async()=>{
const server=await serve(),port=server.address().port;
const env=fs.readFileSync(path.join(ROOT,'test/fixtures/env.js'),'utf8').split('carta7.design.').join('carta7.');
const browser=await chromium.launch({executablePath:require('./browser').chromePath(),args:['--no-sandbox']});
const problems=[],notes=[];
const ok=(c,l,dbg)=>{c?notes.push('  ok  '+l)
  :problems.push('FAIL: '+l+(dbg?'\n      saw: '+JSON.stringify(String(dbg).slice(0,400)):''))};

const ctx=await browser.newContext({viewport:{width:390,height:844}});
await ctx.addInitScript(`try{localStorage.setItem('carta7.firstrun','0')}catch(e){}`);
await ctx.addInitScript(env);
// the notch and the indicator, rendered. This is the line that makes every
// assertion below mean something.
await ctx.addInitScript(`document.addEventListener('DOMContentLoaded',()=>{
  const s=document.createElement('style');
  s.textContent=':root{--sat:${SAT}px;--sab:${SAB}px}';
  document.head.appendChild(s);
});`);
const page=await ctx.newPage();
page.on('console',m=>{const t=m.text();
  if(m.type()==='error'&&!/404|Failed to load resource/.test(t))problems.push('console: '+t)});
page.on('pageerror',e=>problems.push('pageerror: '+e.message));
await page.goto(`http://127.0.0.1:${port}/index.html`,{waitUntil:'load'});
await page.waitForTimeout(1800);                 // past the What's New timer
await page.evaluate(()=>{try{closeSheet()}catch(e){}});

// the override really took — if this fails every other check below is vacuous,
// which is exactly the trap the last three fixes fell into
const insets=await page.evaluate(()=>{const cs=getComputedStyle(document.documentElement);
  return [cs.getPropertyValue('--sat').trim(),cs.getPropertyValue('--sab').trim()]});
ok(insets[0]===SAT+'px'&&insets[1]===SAB+'px',
  `the notch is actually rendered (${insets.join(' / ')}) — otherwise nothing below means anything`,insets.join(' / '));

/* body's height is max(100dvh, --app-h) rather than trusting either alone —
   a keeper's own device found the whole bar sitting short of the true edge,
   which only happens if --app-h (window.innerHeight, read by setAppH())
   under-reports the real screen height on a device this harness cannot
   reproduce that on. Neither measurement can be proven wrong from here, so
   this proves the RECOVERY instead: force --app-h to a value shorter than
   100dvh and confirm body still renders at the full, correct height. */
const recovered=await page.evaluate(()=>{
  document.documentElement.style.setProperty('--app-h','400px');
  const h=document.body.getBoundingClientRect().height;
  document.documentElement.style.removeProperty('--app-h');
  return h;
});
ok(Math.abs(recovered-844)<=1,
  `a short --app-h (400px) doesn't shrink body — max(100dvh, --app-h) recovers the true height (${recovered})`,recovered);

/* every text node the app paints, measured as glyphs. An element may sit in a
   band (the bar's buttons paint to the edge on purpose); its text may not. */
/* Text is measured as glyphs and then clipped to every scrolling or hidden
   ancestor, so a row merely scrolled past the fold is not mistaken for one
   drawn under the indicator — only what a keeper can actually see counts.
   `edge` picks which band to hold it to. */
const scan=edge=>`(()=>{
  const SAT=${SAT},SAB=${SAB},H=innerHeight,bad=[],edge=${JSON.stringify(edge)};
  const label=el=>el.tagName.toLowerCase()+(el.className&&typeof el.className==='string'?'.'+el.className.trim().split(/\\s+/).join('.'):'');
  const clip=el=>{let t=0,b=H,p=el.parentElement;
    while(p){const cs=getComputedStyle(p);
      if(/auto|scroll|hidden|clip/.test(cs.overflowY+' '+cs.overflowX)){
        const q=p.getBoundingClientRect();t=Math.max(t,q.top);b=Math.min(b,q.bottom)}
      p=p.parentElement}
    return [t,b]};
  document.querySelectorAll('body *').forEach(el=>{
    if(el.closest('svg'))return;                       // the map bleeds on purpose
    const cs=getComputedStyle(el);
    if(cs.visibility==='hidden'||cs.display==='none'||parseFloat(cs.opacity)===0)return;
    for(const n of el.childNodes){
      if(n.nodeType!==3||!n.textContent.trim())continue;
      const r=document.createRange();r.selectNodeContents(n);
      const g=r.getBoundingClientRect();
      if(!g.width||!g.height)continue;
      const [ct,cb]=clip(el);
      const top=Math.max(g.top,ct),bot=Math.min(g.bottom,cb);
      if(bot-top<=0.5)continue;                        // clipped away entirely
      const what=label(el)+' @'+Math.round(top)+'-'+Math.round(bot)+' "'+n.textContent.trim().slice(0,28)+'"';
      // and it only counts if the keeper can actually SEE it there: a row
      // scrolled up behind a sticky header is in the band geometrically and
      // hidden in fact, which is the whole point of the header covering it
      const shows=(y0,y1)=>{const y=Math.min(H-1,Math.max(0,(y0+y1)/2));
        return [0.2,0.5,0.8].some(f=>{const x=Math.min(innerWidth-1,Math.max(0,g.left+g.width*f));
          const h=document.elementFromPoint(x,y);
          return h&&(h===el||el.contains(h)||h.contains(el))})};
      if(edge!=='bottom'&&top<SAT-0.5&&shows(top,Math.min(bot,SAT)))bad.push('TOP '+what);
      if(edge!=='top'&&bot>H-SAB+0.5&&shows(Math.max(top,H-SAB),bot))bad.push('BOTTOM '+what);
    }
  });
  return bad;
})()`;

// at rest the top band must be clear; scrolled to the end, both must be —
// a sticky header still has to cover the clock, and the last row has to
// clear the indicator
async function screen(js,label){
  await page.evaluate(js);await page.waitForTimeout(450);
  await page.evaluate(()=>{try{closeSheet()}catch(e){}});
  const rest=await page.evaluate(scan('top'));
  await page.evaluate(()=>{const m=document.getElementById('main');m.scrollTop=m.scrollHeight});
  await page.waitForTimeout(250);
  const end=await page.evaluate(scan('both'));
  const bad=[...rest.map(s=>'at rest: '+s),...end.map(s=>'scrolled: '+s)];
  ok(!bad.length,label,bad.join(' | '));
}

// the three rooms, the walks under them, and the argument
await screen(()=>go('atlas'),'the Atlas — nothing drawn into either band');
await screen(()=>go('journal'),'the Journal — its sticky header clears the clock');
await screen(()=>go('shelf'),'the Shelf — its sticky header clears the clock');
await screen(()=>openScreen('record'),'your record');
await screen(()=>openCountryChapter('Ethiopia'),'a country chapter');
await screen(()=>openRegionChapter('Ethiopia','Gedeb'),'a region');
await screen(()=>openProducerPage('Ethiopia','Worka Sakaro','Gedeb'),'a farm');
await screen(()=>openCityChapter('Lisbon'),'a city, full bleed under its own header');
await screen(()=>openTaste(),'your taste');
await screen(()=>openAskScreenFor('Lisbon'),'the ask composer, on its strip of plate');

/* the bar itself: the buttons must paint to the true bottom edge — the ember
   block stopping short of it is what read as a gap under the bar on every
   screen — while their labels stay clear of the indicator (the scan above
   holds that half). */
await page.evaluate(()=>go('shelf'));await page.waitForTimeout(400);
const bar=await page.evaluate(()=>{
  const bs=[...document.querySelectorAll('nav.tabs button')];
  const door=bs.find(b=>b.classList.contains('door'));
  return {n:bs.length,H:innerHeight,
    bottoms:bs.map(b=>Math.round(b.getBoundingClientRect().bottom)),
    doorBottom:door?Math.round(door.getBoundingClientRect().bottom):null,
    doorPaint:door?getComputedStyle(door).backgroundColor:null};
});
ok(bar.n===4&&bar.bottoms.every(b=>Math.abs(b-bar.H)<=0.5),
  `the bar paints to the bottom edge — no gap under it (${bar.bottoms.join(',')} of ${bar.H})`,JSON.stringify(bar));
ok(bar.doorBottom!==null&&Math.abs(bar.doorBottom-bar.H)<=0.5&&/rgb/.test(bar.doorPaint||''),
  'the door\'s ember block reaches the edge rather than stopping above it',JSON.stringify(bar));

/* a bareless screen has no bar under it, so main carries the allowance itself */
await screen(()=>{const c=live('cups')[0];if(c)openScreen('cup',c.id)},
  'a cup — nothing drawn into either band with the bar gone');
const bare=await page.evaluate(()=>{const m=document.getElementById('main');
  return {bare:m.classList.contains('bare'),pb:getComputedStyle(m).paddingBottom,
    navHidden:document.getElementById('tabs').hidden}});
ok(bare.navHidden&&bare.bare&&parseFloat(bare.pb)>=SAB-0.5,
  `a bareless screen pads its own last row clear of the indicator (${bare.pb})`,JSON.stringify(bare));

await browser.close();server.close();
console.log(notes.join('\n'));
if(problems.length){console.error('\n'+problems.join('\n'));
  console.error(`\n${problems.length} problem${problems.length===1?'':'s'}.`);process.exit(1)}
console.log(`\nall ${notes.length} checks passed, no console or page errors`);
})();

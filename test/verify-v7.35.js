/* Boot the real app (project/index.html) against mock/env.js's seeded record,
   with the store keys remapped from carta7.design.* to the app's own carta7.*,
   and walk every flow the ten recommendations touch. Fails loudly on any
   console error, page error, or assertion. */
const {chromium}=require('playwright-core');
const fs=require('fs'),http=require('http'),path=require('path');

const ROOT=require('path').join(__dirname,'..');
const TYPES={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.woff2':'font/woff2'};

function serve(){
  return new Promise(res=>{
    const s=http.createServer((req,rp)=>{
      const p=path.join(ROOT,decodeURIComponent(req.url.split('?')[0]));
      fs.readFile(p,(e,b)=>{
        if(e){rp.writeHead(404);rp.end('');return}
        rp.writeHead(200,{'content-type':TYPES[path.extname(p)]||'application/octet-stream'});rp.end(b);
      });
    }).listen(0,()=>res(s));
  });
}

(async()=>{
  const server=await serve();
  const port=server.address().port;
  // the seeded record, the offline posture and the canned network all come from
  // the design bundle's own mock. In the bundle it is `mock/env.js`; vendored
  // into the app repo it is `test/fixtures/env.js`. Same file either way — the
  // point is that the fold is checked against the record it was designed on.
  const seed=['mock/env.js','test/fixtures/env.js'].map(f=>path.join(ROOT,f)).find(fs.existsSync);
  if(!seed){console.error('no seed found: expected mock/env.js or test/fixtures/env.js');process.exit(1)}
  const env=fs.readFileSync(seed,'utf8').split('carta7.design.').join('carta7.');
  const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
  const problems=[],notes=[];

  async function boot(firstRun){
    const ctx=await browser.newContext({viewport:{width:390,height:800}});
    await ctx.addInitScript(`try{localStorage.setItem('carta7.firstrun','${firstRun?1:0}')}catch(e){}`);
    await ctx.addInitScript(env);
    const page=await ctx.newPage();
    page.on('console',m=>{const t=m.text();
      // the design bundle carries source only — fonts/, icons and the manifest
      // were never copied into it, so their 404s are the harness, not the app
      if(m.type()==='error'&&!/404|Failed to load resource/.test(t))problems.push('console: '+t)});
    page.on('pageerror',e=>problems.push('pageerror: '+e.message));
    await page.goto(`http://127.0.0.1:${port}/index.html`,{waitUntil:'load'});
    await page.waitForTimeout(1500);   // past the What's New timer at 900ms
    return {ctx,page};
  }
  const txt=p=>p.evaluate(()=>document.getElementById('main').innerText);
  const sheet=p=>p.evaluate(()=>{const s=document.getElementById('sheet');return s.classList.contains('open')?s.innerText:''});
  const ok=(cond,label,dbg)=>{if(cond)notes.push('  ok  '+label);
    else problems.push('FAIL: '+label+(dbg?'\n      saw: '+JSON.stringify(String(dbg).slice(0,900)):''))};

  /* ---------- first open: rec 5's welcome ---------- */
  {
    const {ctx,page}=await boot(true);
    const t=await txt(page);
    ok(/carta keeps the story of your taste/i.test(t),'rec 5 — welcome on first open');
    ok(!/What.s new/i.test(await sheet(page)),'rec 5 — What\'s New never over a first open');
    await ctx.close();
  }

  /* ---------- the lived-in record ---------- */
  const {ctx,page}=await boot(false);

  // rec 5 · What's New, once per version
  ok(/What.s new/i.test(await sheet(page)),'rec 5 — What\'s New opens once on a new version');
  await page.evaluate(()=>closeSheet());

  // rec 2 · focus is visible; the subtle ink moved
  ok(await page.evaluate(()=>getComputedStyle(document.documentElement).getPropertyValue('--ca-ink-450').trim()==='#6f6358'),
    'rec 2 — subtle ink at 5.0:1');
  ok(await page.evaluate(()=>[...document.styleSheets[0].cssRules].some(r=>r.selectorText&&r.selectorText.includes(':focus-visible'))),
    'rec 2 — a focus-visible rule ships');

  // rec 1 · walk three deep, then back out by the stack
  await page.evaluate(()=>{go('atlas');openCountryChapter('Ethiopia');openRegionChapter('Ethiopia','Gedeb')});
  await page.waitForTimeout(200);
  {const t=await txt(page);ok(/←\s*ethiopia/i.test(t),'rec 1 — the ← names where it goes',t)}
  await page.evaluate(()=>goBack());await page.waitForTimeout(150);
  ok(await page.evaluate(()=>pageView&&pageView.kind==='country'),'rec 1 — back lands on the country');
  await page.evaluate(()=>goBack());await page.waitForTimeout(150);
  ok(await page.evaluate(()=>pageView===null&&tab==='atlas'),'rec 1 — back lands in the room it came from');

  // rec 1 · the phone's own back closes the topmost layer
  await page.evaluate(()=>{go('journal');openDoor()});
  await page.waitForTimeout(150);
  await page.goBack();await page.waitForTimeout(250);
  ok(!(await sheet(page)),'rec 1 — browser back closes the sheet');
  ok(await page.evaluate(()=>location.pathname.endsWith('index.html')),'rec 1 — browser back never leaves the app');

  // rec 4 · the door asks where first, and a café cup saves unnamed
  await page.evaluate(()=>openDoor());await page.waitForTimeout(120);
  let sh=await sheet(page);
  ok(/where is it\?/i.test(sh)&&/at a café/i.test(sh)&&/at home/i.test(sh),'rec 4 — the door asks where first',sh);
  const cupsBefore=await page.evaluate(()=>live('cups').length);
  await page.evaluate(()=>{doorState.step='bar';paintDoor()});await page.waitForTimeout(120);
  await page.fill('#db_place','Kaffa');
  await page.evaluate(()=>doorBarNext());await page.waitForTimeout(200);
  ok(/what was in the cup/i.test(await sheet(page)),'rec 4 — a place and nothing else reaches the 1–9');
  await page.evaluate(()=>hedPick(8));
  await page.evaluate(()=>saveCafeCup());await page.waitForTimeout(250);
  ok(await page.evaluate(()=>live('cups').length)===cupsBefore+1,'rec 4 — the café cup is on the record');
  const unnamed=await page.evaluate(()=>{
    const c=live('cups').sort((a,b)=>String(b.createdAt).localeCompare(String(a.createdAt)))[0];
    return coffeeLabel(coffeeById(c.coffeeRef));
  });
  ok(unnamed==='A cup, unnamed','rec 4 — an unnamed coffee reads as "a cup, unnamed" (got: '+unnamed+')');

  // rec 3 + 9 · one taste surface, and it corrects what it wrote
  const newCupId=await page.evaluate(()=>live('cups').sort((a,b)=>String(b.createdAt).localeCompare(String(a.createdAt)))[0].id);
  await page.evaluate(id=>openCupDetail(id),newCupId);await page.waitForTimeout(200);
  let cupText=await txt(page);
  ok(/correct the reading/i.test(cupText),'rec 9 — a written cup can be corrected',cupText);
  ok(/name the coffee/i.test(cupText),'rec 9 — an unnamed cup offers its name',cupText);
  await page.evaluate(id=>openTasteEdit(id),newCupId);await page.waitForTimeout(200);
  ok(/correct the reading/i.test(await txt(page)),'rec 3 — the correction runs on the taste surface');
  await page.evaluate(()=>tasteHomePick(3));
  await page.evaluate(id=>saveTasteHome('',false,id),newCupId);await page.waitForTimeout(250);
  ok(await page.evaluate(id=>cupById(id).score,newCupId)===3,'rec 3 — the corrected reading is saved');
  ok(await page.evaluate(()=>document.getElementById('toast').innerText.includes('Undo')),'rec 6 — the correction is undoable');

  // rec 3 · openImpression is gone
  ok(await page.evaluate(()=>typeof window.openImpression==='undefined'),'rec 3 — openImpression is deleted');

  // rec 7 · one vocabulary
  await page.evaluate(()=>{go('journal')});await page.waitForTimeout(200);
  const journal=await txt(page);
  ok(/at home/i.test(journal)&&!/measured at home/i.test(journal),'rec 7 — "At home" in every room',journal);
  ok(/your taste →/i.test(journal),'rec 7 — "Your taste →" from every door',journal);
  await page.evaluate(()=>openShotsScreen());await page.waitForTimeout(900);
  const shots=await txt(page);
  ok(/your recent\s+brews/i.test(shots),'rec 7 — a brew is the thing you made');
  ok(!/\bshots\b/i.test(shots),'rec 7 — no stray "shots" on the list (saw: '+(shots.match(/[^\n]*shots[^\n]*/i)||[''])[0]+')');

  // rec 6 · both keys live on Your record
  await page.evaluate(()=>{go('shelf');openRecord()});await page.waitForTimeout(250);
  const rec=await txt(page);
  ok(/the keys/i.test(rec)&&/ask carta/i.test(rec)&&/visualizer/i.test(rec),'rec 6 — both keys on Your record',rec);
  ok(/what changed in this turn/i.test(rec),'rec 5 — What\'s New has a permanent door');

  // rec 6 · "Not mine" gets a real Undo
  const waiting=await page.evaluate(()=>{const s=waitingShot();return s?String(s.id):''});
  if(waiting){
    await page.evaluate(id=>dismissShot(id),waiting);await page.waitForTimeout(200);
    ok(await page.evaluate(()=>document.getElementById('toast').innerText.includes('Undo')),'rec 6 — "Not mine" is undoable');
  }else notes.push('  --  rec 6 — no waiting brew to dismiss in this seed');

  // rec 9 · chapters get doors
  await page.evaluate(()=>{go('atlas');openCountryChapter('Brazil')});await page.waitForTimeout(250);
  {const t=await txt(page);ok(/log a coffee from brazil/i.test(t),'rec 9 — an empty country invites the coffee',t)}
  await page.evaluate(()=>{go('atlas');openCityChapter('Lisbon')});await page.waitForTimeout(900);
{const t=await txt(page);ok(/add a café in lisbon/i.test(t),'rec 9 — a city takes a new café',t)}

  // rec 10 · the ask result folds
  await page.evaluate(()=>{go('atlas');openAskResultScreen(D.asks[0].id)});await page.waitForTimeout(400);
  const folds=await page.evaluate(()=>[...document.querySelectorAll('details.fold>summary .l')].map(e=>e.textContent));
  ok(folds.length>0,'rec 10 — the answer folds to its heads ('+JSON.stringify(folds)+')');
  ok(await page.evaluate(()=>!!document.querySelector('.find')),'rec 10 — the findings stay open');

  // rec 10 · a reply Carta can't read fails honestly
  await page.evaluate(()=>{
    window.__askGarbled=true;setPref('askKey','sk-ant-verify');
    askDraft.kind='city';askDraft.dest='Porto';go('atlas');openAskScreen();
  });
  await page.waitForTimeout(200);
  await page.evaluate(()=>runAsk());
  await page.waitForTimeout(9000);
  const wait=await txt(page);
  ok(/couldn.t be read/i.test(wait),'rec 10 — an unreadable reply is stated, not swallowed');
  ok(/try again/i.test(wait),'rec 6 — the failure surface offers a try-again',wait);
  // Porto is not a city on this record, so there is nothing to scope a brief to
  // and the button says so plainly — the scoped wording is asserted below
  ok(/copy the brief instead\n/i.test(wait+'\n'),'rec 10 — the brief degrades where the ask has no scope',wait);
  ok(await page.evaluate(()=>D.asks.every(a=>a.destination!=='Porto')),'rec 10 — nothing was written down');

  // rec 6 · a sign-in resumes the errand it interrupted
  await page.evaluate(()=>{
    setPref('visualizerEmail','');setPref('visualizerPassword','');
    go('journal');openShotsScreen();          // no account: the key sheet opens instead
  });
  await page.waitForTimeout(250);
  ok(/your visualizer account/i.test(await sheet(page)),'rec 6 — an errand with no account opens the sheet');
  await page.fill('#viz_email','keeper@example.com');
  await page.fill('#viz_password','pw');
  await page.evaluate(()=>saveVisualizerKey());
  await page.waitForTimeout(1600);
  ok(await page.evaluate(()=>pageView&&pageView.kind==='shots'),'rec 6 — the sign-in resumes the errand it interrupted');

  // …and where the record does know the city, the brief is scoped to it
  await page.evaluate(()=>{askDraft.kind='city';askDraft.dest='Lisbon';go('atlas');openAskScreen()});
  await page.waitForTimeout(200);
  await page.evaluate(()=>runAsk());
  await page.waitForTimeout(9000);
  const scoped=await txt(page);
  ok(/copy the brief instead — scoped to lisbon/i.test(scoped),'rec 10 — the brief is scoped to the ask that failed',scoped);

  await ctx.close();
  await browser.close();server.close();

  console.log(notes.join('\n'));
  if(problems.length){console.log('\n'+problems.length+' PROBLEM(S):\n'+problems.join('\n'));process.exit(1)}
  console.log('\nall '+notes.filter(n=>n.startsWith('  ok')).length+' checks passed, no console or page errors');
})().catch(e=>{console.error(e);process.exit(1)});

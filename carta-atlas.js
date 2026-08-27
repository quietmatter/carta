/* ============================================================================
     The Atlas (ROADMAP.md Phases 12-13, 20, 30) — home, and the walks down
     from it.

     Split out of index.html at Phase 31, for the reason recorded in
     ARCHITECTURE.md §1: the file stood 956 lines past the band, the band had
     been walked past three times without the argument each crossing was owed,
     and this is the largest coherent thing left in it that is not the record
     itself. It is one contiguous slab in the original, which is why the cut
     falls here rather than on the room-sized views §1 had named as the
     obvious one — see that section for the change of mind, made in the open.

     What it holds is the door and everything reached through it: the plate
     and its one leaf (the ladder's five states), the sheet under it, and the
     four walks Phase 13 drew — down from a country into a region and onto a
     farm, and across a city's own streets. All of it is the record read
     against geography; none of it is a record of its own, which is why every
     screen here carries the country it was read in and hands it back on the
     way out.

     Loaded from index.html's <head> with a plain `<script src>`, last of the
     five siblings. It reads the ground through carta-map.js's published
     globals (`landKey`, `landAnchor`, `LANDS`), the waiting brew through
     carta-shot.js (`waitingShot`), and everything else it needs from the app
     (`D`, `live`, `save`, `esc`, `jsq`, `render`, `toast`, `words`,
     `capFirst`) it calls at runtime. Nothing here runs at load: every
     top-level binding is a literal or an arrow, so its position in the
     <head> is free.

     There is no pure block. Every function below reaches for `D` or the DOM,
     which is the whole reason this slab was never in the tested region and
     why test/model.test.js still slices five files, not six.

     The seam out is the list at the foot of this file. Two of them are there
     to keep state that is the Atlas's own from being written from outside it:
     `resetAtlasSheet` (render(), on arrival) and `clearCityLead` (save(),
     dirtying the memo) replaced two bare assignments index.html used to make
     straight into this file's `let` bindings.
   ========================================================================== */

/* ============ the Atlas — home, with the map in front ============
 * The passport is the first thing the app shows and the largest thing on the
 * screen: tasted countries inked into the ground, their names knocked out of
 * their own shapes, each one tappable straight into its chapter. Everything
 * under it is the record read against geography — your cities, what you've
 * tasted, and where the record argues you should go next.
 */
// every cup the record can trace to a country, counted by that country
function countryCupCounts(){
  const m={};
  live('cups').forEach(c=>{
    const co=coffeeById(c.coffeeRef);
    const raw=co&&co.origin&&co.origin.country;
    if(!raw)return;
    const k=landKey(raw);m[k]=(m[k]||0)+1;
  });
  return m;
}
const placeCups=placeId=>live('cups').filter(c=>c.kind==='bar'&&c.placeRef===placeId&&c.score!=null);
function placeAvg(placeId){const cs=placeCups(placeId);return cs.length?cs.reduce((s,c)=>s+c.score,0)/cs.length:null}
const cityPlaces=city=>live('places').filter(p=>p.city&&fold(p.city)===fold(city));
// what a city amounts to, in one line: how many cafés, how many cups, and who
// leads — the same three facts the city's own sheet opens with
function cityMetaLine(city){
  const places=cityPlaces(city);
  const ids=new Set(places.map(p=>p.id));
  const cups=live('cups').filter(c=>c.kind==='bar'&&ids.has(c.placeRef));
  let lead=null;
  places.forEach(p=>{const a=placeAvg(p.id);if(a!=null&&(!lead||a>lead.avg))lead={name:p.name,avg:a}});
  return [`${places.length} café${places.length===1?'':'s'}`,
    `${cups.length} cup${cups.length===1?'':'s'}`,
    lead?`${lead.name} leads at ${trimNum(lead.avg)}`:null].filter(Boolean).join(' · ');
}
// how far back the record actually goes in a city — the first cup drunk there,
// or failing that the first café put on file. Never today's date dressed up.
function citySince(city){
  const places=cityPlaces(city);
  const ids=new Set(places.map(p=>p.id));
  const stamps=live('cups').filter(c=>c.kind==='bar'&&ids.has(c.placeRef)).map(c=>c.at||c.createdAt)
    .concat(places.map(p=>p.createdAt)).filter(Boolean).sort();
  if(!stamps.length)return '';
  const y=new Date(stamps[0]).getFullYear();
  return isFinite(y)?`Since ${y}`:'';
}
/* what a city amounts to, argued rather than tallied. The bar its best café
 * actually holds leads, and then the one further fact the record can defend:
 * that it leads everywhere else, or that its cafés cluster in one quarter.
 * Where neither is true the figure stands alone — an invented second clause is
 * the precision VOICE.md refuses, and a city with two cafés has nothing to say
 * about its quarters yet. */
let _cityLeadCache=null;
// save() dirties this the way it dirties the taste memo — it is the Atlas's
// own cache, so index.html asks rather than reaching in and writing it
function clearCityLead(){_cityLeadCache=null}
function cityLead(city){
  if(!_cityLeadCache){
    _cityLeadCache={};
    knownCities().forEach(c=>{
      let best=null;
      cityPlaces(c).forEach(p=>{const a=placeAvg(p.id);if(a!=null&&(!best||a>best.avg))best={name:p.name,avg:a}});
      _cityLeadCache[fold(c)]=best;
    });
  }
  return _cityLeadCache[fold(city)]||null;
}
function cityLede(city){
  const places=cityPlaces(city);
  const lead=cityLead(city);
  if(!lead)return null;
  const others=knownCities().filter(c=>fold(c)!==fold(city));
  const top=others.length&&others.every(c=>{
    const o=cityLead(c);
    return !o||o.avg<lead.avg;
  });
  const hoods={};
  places.forEach(p=>{const h=(p.neighborhood||'').trim();if(h)hoods[h]=(hoods[h]||0)+1});
  const hood=Object.entries(hoods).sort((a,b)=>b[1]-a[1])[0];
  const clause=top?' — the highest anywhere on the record.'
    :hood&&hood[1]>1&&hood[1]<places.length
      ?`. ${capFirst(words(hood[1]))} of the ${words(places.length)} are in ${hood[0]}.`
      :'.';
  return {sub:`${lead.name} leads it`,said:`At ${trimNum(lead.avg)}${clause}`};
}
function cityRowHTML(city){
  const places=cityPlaces(city);
  const ids=new Set(places.map(p=>p.id));
  const cups=live('cups').filter(c=>c.kind==='bar'&&ids.has(c.placeRef));
  const ground=cityGround(city);
  const lede=cityLede(city);
  const since=citySince(city);
  // the city's own frame, not its country's: the row opens on 190 km around
  // where your cafés actually are (Phase 29 · C). The plate keeps the earlier
  // named-and-drawn split rather than replacing it — it falls back to the
  // country's own outline where its window holds nothing, and only where the
  // belt cannot name the country either does it draw the record's own cafés.
  const plate=cityPlate(city,PLATE_SPAN);
  const seal=plate?plate.html:'';
  return `<button class="lcard" onclick="openCityChapter(${jsq(city)})">
    <span class="head${seal?'':' bare'}">
      ${seal}
      <span class="eyeb">${ground?esc(ground.label):''}</span>
      <span class="when">${esc(since)}</span>
    </span>
    <span class="n">${esc(city)}</span>
    ${lede?`<span class="sub">${esc(lede.sub)}</span>
    <span class="said">${esc(lede.said)}</span>`:''}
    <span class="facts">
      <span class="fact">
        <span class="k">${capFirst(words(places.length))} café${places.length===1?'':'s'}</span>
        <span class="v num">${words(cups.length)} cup${cups.length===1?'':'s'}</span>
      </span>
      ${plate&&plate.across>=1?`<span class="fact">
        <span class="k">Across</span>
        <span class="v num">${Math.round(plate.across)} km</span>
      </span>`:''}
      ${plate&&plate.drew?'':`<span class="fact">
        <span class="k">The ground</span>
        <span class="v fall">${plate?'no outline on file — your own cafés':'no café placed here yet'}</span>
      </span>`}
    </span>
  </button>`;
}
/* ============ the Atlas — the passport, and the question on it ============
 * The ask was a button at the bottom of this screen, under everything the
 * record had already done. It is the first thing the screen says now (the Ask
 * Carta redesign): the passport is still the ground — it is the argument
 * every ask is made from — and the question stands on it, one field and one
 * word. What it has already found sits directly under the fold, one tap from
 * being reopened, because an answer you can't get back to is a receipt.
 *
 * The headline the passport used to carry (three countries, forty-seven cups)
 * is not repeated here: the belt draws it, and the chips below count it.
 */
/* v7.35.0, critique rec 5: an app whose whole argument is that it keeps the
   story of your taste opened on an empty map, an ask field aimed at a record
   with nothing in it, and no word about itself. Six lines, once — what Carta
   is, what the door does, where taste lives, and what stays on the device. */
/* the one line under the ask: what leaves the device, said before anything
   does. Without a key the old line promised something the keeper could not
   have, and the hero read as a wall (finding 15) — so it names the way through
   instead: the brief is a page that pastes into any chat, key or no key. */
function asktrustHTML(){
  if(askKey())return `<div class="asktrust">Sent with your brief, on your own key — every café checked against a real address before it is drawn.</div>`;
  return `<div class="asktrust">Sent with your brief — every café checked against a real address before it is drawn. The ask brings your own key<button class="qlink" style="margin-left:6px" onclick="openBriefScreen()">no key? the brief pastes anywhere →</button></div>`;
}
/* ============ the front door — one plate, one leaf, one pull ============
 * The Atlas was a sticky map with a question on it and 2,270 px of cards under
 * it: asks, cities, a Visualizer pitch, a chip list and a share button, all
 * present at once whatever the app was opened for. It is the plate, one leaf
 * and one pull now.
 *
 * The plate is the whole screen. One leaf of paper sits on it, and what the
 * leaf holds is decided by what is actually true right now — a priority
 * ladder, first true branch wins, and the rest of the screen is identical
 * between states:
 *
 *   01  first open      the question, over an uninked belt
 *   02  nothing live    the question
 *   03  a brew waiting  that brew, its curve, its figures, Write the cup →
 *   04  a bag resting   that coffee, its best so far, Brew it →
 *
 * 03 outranks 04 outranks 02. A brew expires; a bag does not; the question
 * never does — the rule vAtlas already held ("an unlogged cup outranks the
 * next question"), extended by one rung. 05 is not a branch: it is any of the
 * above with the sheet pulled up, and everything that left the door lives
 * there — what Carta found, the cities, what has been tasted, the share.
 *
 * The ember is spent once per screen, on the bar's door. The ember marks the
 * standing invitation; ink marks the action in hand — which is why the field's
 * → and the two leaf actions take the sanctioned ink fill, and why the waiting
 * mark went to ink. See `.askfield button.ink` and `.waiting.ink .mk`.
 */
const ATLAS_PLATE_SHOT=352, ATLAS_PLATE_BAG=450, ATLAS_PLATE_UP=178,
      ATLAS_SHEET_TOP=160, ATLAS_OVERLAP=18;
/* the reference the paper leaf's own height was designed against — 852 minus
 * the 57px bar (`main` already excludes the bar, since nav.tabs is its own
 * sibling, not its child) — and the least the plate is ever allowed to give
 * up. A phone shorter than 852 CSS px is the common case, not the exception:
 * that is every browser tab, and most phones outside an installed PWA at
 * full screen. Without this, a leaf's height was `main.clientHeight - top`,
 * so any shortfall came straight out of the leaf holding the action in hand
 * — Write the cup, Brew it — pushing it into a scrolled-to area with no
 * fixed clearance above the bar rather than the plate simply showing less
 * map. See mountAtlas(). */
const ATLAS_REF_MAIN=852-57, ATLAS_PLATE_FLOOR=120;
/* whether the record is showing. Transient by design: the door opens closed
   every time, so this is never persisted — only kept across a repaint of the
   same screen, the way _lastScreenKey already keeps a scroll position. */
let _atlasSheetUp=false;
// render() resets this on every fresh arrival at the Atlas (v7.37.1/7.37.3 —
// the tab bar, the back gesture, and the stack restoring a step all pass
// through it). Same reason as above: the flag is this file's, the call is the seam
function resetAtlasSheet(){_atlasSheetUp=false}
function toggleAtlasSheet(){_atlasSheetUp=!_atlasSheetUp;mountAtlas();}
/* the sheet travels and the plate reframes rather than reloading — the same
   behaviour the city sheet already has. Styles are set in place rather than
   re-rendered so the transitions actually run and <carta-atlas> re-fits
   through its own ResizeObserver instead of being torn down and reprojected. */
/* what `main` actually gives the door, before anything is drawn into it —
   `main` is the persistent element, so this reads true at template time. */
const atlasMainH=()=>{const m=document.getElementById('main');return (m&&m.clientHeight)||ATLAS_REF_MAIN};
/* the plate's height in the box it is actually in. ONE formula, read by both
 * vAtlas — so the very first paint is already the right size — and mountAtlas,
 * which re-reads it on arrival and as the sheet travels.
 *
 * Give the leaf its own designed height first: it is where the record and the
 * action live, not the map. The plate takes what is left, down to a floor that
 * still reads as a plate rather than a sliver. The leaf sits ATLAS_OVERLAP
 * above the plate's bottom edge, so the plate height that leaves the leaf
 * exactly leafNeeded tall is (H - leafNeeded) + ATLAS_OVERLAP, not
 * H - leafNeeded — dropping that term quietly shrank the plate 18px past
 * where it needed to. designRest 0 is the full-bleed pair (01/02).
 */
function atlasPlateH(designRest,H){
  if(!designRest)return H;
  const leafNeeded=ATLAS_REF_MAIN-designRest+ATLAS_OVERLAP;
  return Math.max(ATLAS_PLATE_FLOOR,Math.min(designRest,(H-leafNeeded)+ATLAS_OVERLAP));
}
function mountAtlas(){
  const plate=document.getElementById('atlasplate');if(!plate)return;
  const designRest=Number(plate.dataset.rest)||0;
  const rest=atlasPlateH(designRest,atlasMainH());
  plate.style.height=(_atlasSheetUp?ATLAS_PLATE_UP:rest)+'px';
  const leaf=document.getElementById('atlasleaf');
  if(leaf){
    leaf.style.transform=_atlasSheetUp?'translateY(110%)':'none';
    // the leaf's own overlap onto the plate travels with whatever the plate
    // actually rendered at, not the literal it was drawn against
    if(designRest)leaf.style.top=(rest-ATLAS_OVERLAP)+'px';
  }
  const sheet=document.getElementById('atlassheet');
  if(sheet){
    sheet.style.top=ATLAS_SHEET_TOP+'px';
    sheet.style.transform=_atlasSheetUp?'none':'translateY(110%)';
    sheet.setAttribute('aria-hidden',_atlasSheetUp?'false':'true');
  }
}
/* the pull handle, and the grab it becomes once the record is up: the same
   38x3 mark, darker when it is a control rather than an invitation */
function atlasHandleHTML(up){
  return `<button class="atlashandle${up?' up':''}" aria-expanded="${up?'true':'false'}"
    aria-label="${up?'Close the record':'Open the record'}" onclick="toggleAtlasSheet()"><span></span></button>`;
}
/* state 04's one new selector: the coffee the record would actually reach for
 * — most recently brewed, still on the shelf, with a brew behind it to seed
 * the next one.
 *
 * No weight test, deliberately. The handoff asks for "a coffee that still has
 * weight on file", and there is no such field: nothing in the ledger records
 * what is left in a bag (SCHEMA.md has no weight on a coffee, and the door has
 * never asked for one). Inventing it would be exactly the guess the record
 * refuses everywhere else, so the bag is chosen on what IS on file and its sub
 * line simply does not carry a gram figure. Where nothing qualifies the door
 * falls through to the question rather than inventing a bag.
 */
function restingBag(){
  const brews=D.brews.slice().sort(byWhen);
  for(const b of brews){
    const c=coffeeById(b.coffeeRef);
    if(!c||c.archived||!c.home)continue;
    const scored=live('cups').filter(x=>x.coffeeRef===c.id&&x.score!=null)
      .sort((p,q)=>q.score-p.score);
    return {coffee:c,last:b,best:scored[0]||null};
  }
  return null;
}
/* what a cup was made on, named the way the record names it elsewhere */
function bagSetupLabel(cup){
  const brew=cup&&cup.brewRef?brewById(cup.brewRef):null;
  const s=brew?setupById(brew.setupId):null;
  if(!s)return '';
  return s.name||[s.grinder,s.brewer].filter(Boolean).join(' + ');
}
/* a brew's day. Inside the week a weekday reads better than a countdown, which
   is the one thing fmtWhen does not do; past it, fall straight back to it. */
function atlasBrewDay(iso){
  if(!iso)return '';
  const d=new Date(iso),days=Math.floor((Date.now()-d)/864e5);
  if(days<1)return 'Today';
  if(days===1)return 'Yesterday';
  if(days<7)return d.toLocaleDateString(undefined,{weekday:'long'});
  return fmtWhenLong(iso);
}
/* how long the bag has been resting, said in words */
function bagRestLine(c){
  if(!c.roastDate)return 'On the shelf';
  const days=Math.floor((Date.now()-new Date(c.roastDate+'T00:00'))/864e5);
  if(!isFinite(days)||days<0)return 'On the shelf';
  if(days<1)return 'On the shelf · roasted today';
  return `On the shelf · rested ${words(days)} day${days===1?'':'s'}`;
}
/* one field, two doors (SURFACES.md, "One door, and it is a paste field").
 * The door's own parser decides which: run it first, and if it yields a
 * roaster or anything that identifies a coffee, this is a bag and the door
 * opens on it, prefilled. Otherwise the text is a destination and the ask
 * opens. This is why the button lost its label and became → — it cannot say
 * "Ask" any more, because it does not always ask. */
function askFromHome(){
  const el=document.getElementById('home_ask');
  const text=el?el.value:askDraft.dest;
  const t=String(text||'').trim();
  if(t){
    const p=doorParse(t);
    if(p&&(p.roaster||p.roastLevel||Object.keys(p.o||{}).length)){
      openDoor();doorState.step='text';doorState.text=t;paintDoor();return;
    }
  }
  askDraft.dest=t;
  openAskScreen();
}
/* the field itself. The ink fill is the design system's one sanctioned fill
   (.btn-graphite), not a new button — and it is ink rather than ember so the
   screen spends the ember exactly once, on the bar's door. */
function doorFieldHTML(){
  return `<div class="askfield">
    <input type="text" id="home_ask" value="${esc(askDraft.dest)}" placeholder="A place, or a bag…"
      aria-label="A place, or a bag" oninput="askDraft.dest=this.value"
      onkeydown="if(event.key==='Enter')askFromHome()">
    <button class="ink" onclick="askFromHome()" aria-label="Go">→</button>
  </div>`;
}
/* the bar's own wordmark row. "Your taste" is absent on first open — there is
   no taste to argue from yet — and while the record is up, which has taken the
   screen. */
function doorHeadHTML(taste){
  return `<div class="overlay" style="left:20px;right:20px;top:22px;display:flex;align-items:flex-start;justify-content:space-between;gap:12px">
    <div style="font-family:var(--serif);font-size:var(--s15);letter-spacing:.2em;text-transform:uppercase;font-weight:600">Carta</div>
    ${taste?'<button class="omini bare" onclick="openTaste()">Your taste →</button>':''}
  </div>`;
}
/* ---- the leaves ------------------------------------------------------- */
/* 01 · first open, and 02 · nothing live. The leaf is a bottom fade rather
   than a slab of paper: nothing is claimed and nothing is empty. */
function doorAskLeafHTML(first,countries){
  const n=countries.length;
  const line=first
    ?'Nothing on the record <em>yet.</em>'
    :`${esc(capFirst(words(n)))} countr${n===1?'y':'ies'}, <em>so far.</em>`;
  const teach=first
    ?'Paste the bag, or name the place you drank. The map inks itself in as you go.'
    :'A place to go, or a bag you drank. Carta reads which.';
  return `<div class="doorleaf fadeleaf" id="atlasleaf"
      style="height:${first?360:330}px;padding:0 20px ${first?20:14}px">
    <div class="display" style="font-size:var(--s42);line-height:1.06;letter-spacing:-.025em;margin:0 0 18px">${line}</div>
    ${doorFieldHTML()}
    <div class="asktrust">${teach}</div>
    ${first
      ?`<div style="text-align:center;margin-top:16px;pointer-events:auto"><button class="qlink" onclick="openClassicImport()">Kept a record in classic? Read it in</button></div>`
      :atlasHandleHTML(false)}
  </div>`;
}
/* 03 · a brew waiting. The one thing on the screen that expires is the one
   thing that moves. The mark is ink, not the ember — see the ember budget. */
/* the door's three figures. Same reading as figsHTML and the same `.figs`
 * mechanics, but the door states the YIELD where the shot screen states the
 * ratio — "38 g, from 18 g" is the figure a brew waiting to be written is
 * actually argued about, and a ratio is a second calculation to do standing
 * up. figsHTML itself is untouched: vShot and the cup still read through it.
 */
function doorFigsHTML(fg){
  const cell=(v,l)=>`<div><div class="v">${v}</div><div class="l">${esc(l)}</div></div>`;
  const from=fg.dose==null?'Yield':'From '+trimNum(fg.dose)+' g';
  const yld=fg.yield==null?'—':trimNum(fg.yield)+'<span class="u">g</span>';
  const lead=fg.method==='pourover'
    ?cell(fg.drawdown==null?'—':trimNum(fg.drawdown)+'<span class="u">s</span>','Drawdown')
    :cell(fg.peak==null?'—':trimNum(fg.peak)+'<span class="u">bar</span>','Peak');
  return `<div class="figs ruled">${lead}${cell(yld,from)}
    ${cell(fg.total==null?'—':trimNum(fg.total)+'<span class="u">s</span>','Elapsed')}</div>`;
}
function doorShotLeafHTML(shot,plateH){
  const fg=shotFigures(shot),when=shotWhen(shot),pour=shotMethod(shot)==='pourover';
  const sub=pour
    ?[shot.roaster,brewerOf(shot)?'a '+brewerShort(brewerOf(shot))+', read off the scale':'read off the scale'].filter(Boolean).join(' · ')
    :[shot.roaster,shot.roastLevel?shot.roastLevel.toLowerCase():'',
      shot.grinderModel?'on the '+shot.grinderModel:''].filter(Boolean).join(' · ');
  return `<div class="doorleaf paper" id="atlasleaf" style="top:${plateH-ATLAS_OVERLAP}px">
    <div class="waiting ink"><span class="mk"></span><span class="l">${esc(when?'Poured '+fmtAgo(when):'A brew, waiting')}</span></div>
    <div class="display big" style="margin:12px 0 3px">${esc(shot.coffeeName||shot.label)}</div>
    ${sub?`<div class="doorsub">${esc(sub)}</div>`:''}
    ${shot.curve?plateSVG(shot,PLATE_HAIR,{cls:'hair',draw:true}):''}
    ${doorFigsHTML(fg)}
    <button class="btn btn-graphite" style="min-height:52px;padding:15px 16px;margin-top:18px" onclick="openShotScreen(${jsq(String(shot.id))})">Write the cup →</button>
    <div style="display:flex;justify-content:space-between;align-items:baseline;gap:14px;margin-top:14px">
      <span class="asttrust" style="font-family:var(--serif);font-style:italic;font-size:12.5px;color:var(--ink-3)">Read off your ${pour?'scale':'account'}, kept nowhere else.</span>
      <button class="qlink" style="flex:none;white-space:nowrap" onclick="snoozeWaitingShot()">Not now</button>
    </div>
    ${atlasHandleHTML(false)}
  </div>`;
}
/* 04 · a bag resting. The seal is drawn only where the record can name real
   ground; where it cannot the label starts the row — sealHTML's own refusal. */
function doorBagLeafHTML(bag,plateH){
  const c=bag.coffee;
  const country=(c.origin&&c.origin.country||'').trim();
  const seal=country?sealHTML(landKey(country),null,44):'';
  const sub=[c.roaster,originLine(c)].filter(Boolean).join(' · ');
  const bestCup=bag.best;
  const bestSetup=bestCup?bagSetupLabel(bestCup):'';
  const best=bestCup?[trimNum(bestCup.score),bestSetup].filter(Boolean).join(' — '):'';
  const day=atlasBrewDay(bag.last.at||bag.last.createdAt);
  const inout=bag.last.doseG!=null&&bag.last.waterG!=null
    ?`${trimNum(bag.last.doseG)} in, ${trimNum(bag.last.waterG)} out`:'';
  const lastLine=[day,inout].filter(Boolean).join(' · ');
  const fact=(k,v)=>`<div class="kv"><span class="k">${esc(k)}</span><span class="v${v?'':' unread'}">${v?esc(v):'unread'}</span></div>`;
  return `<div class="doorleaf paper" id="atlasleaf" style="top:${plateH-ATLAS_OVERLAP}px">
    <div style="display:flex;align-items:center;gap:12px">
      ${seal}
      <span class="eyebrow" style="margin:0">${esc(bagRestLine(c))}</span>
    </div>
    <div class="display big" style="margin:14px 0 3px">${esc(c.name||'Unnamed coffee')}</div>
    ${sub?`<div class="doorsub" style="margin-bottom:18px">${esc(sub)}</div>`:''}
    <div class="doorfacts">${fact('Best so far',best)}${fact('Last brew',lastLine)}</div>
    <button class="btn btn-graphite" style="min-height:52px;padding:15px 16px;margin-top:12px" onclick="openBrewFlow('${c.id}')">Brew it →</button>
    <div style="display:flex;justify-content:center;gap:24px;margin-top:10px">
      <button class="qlink" style="flex:none;white-space:nowrap" onclick="go('shelf')">Something else</button>
      <button class="qlink" style="flex:none;white-space:nowrap" onclick="openAskScreen()">Where to next</button>
    </div>
    ${atlasHandleHTML(false)}
  </div>`;
}
/* 05 · the record, one pull below. One cup, not a list, and compact city rows
   rather than full cards: the Journal and each city's own page are one tap
   away, and everything they hold belongs there rather than here. */
function doorSheetHTML(cities,countries,asks){
  const cups=live('cups').slice().sort(byWhen);
  const newest=cups[0]||null;
  const rows=[];
  if(asks.length)rows.push(['What Carta found',`${capFirst(words(asks.length))} ask${asks.length===1?'':'s'} →`,'openAsksSheet()']);
  if(countries.length)rows.push(['Tasted so far',`${capFirst(words(countries.length))} countr${countries.length===1?'y':'ies'} →`,'openTastedSheet()']);
  if(countries.length)rows.push(['The passport','Share it →','sharePassportCard()']);
  return `<div class="doorsheet" id="atlassheet" aria-hidden="true">
    ${atlasHandleHTML(true)}
    <div class="list">
      ${newest?`<div class="shead over" style="margin-top:0;padding-top:14px"><span class="l">Lately</span>
        <span class="r">${esc(capFirst(words(cups.length)))} cup${cups.length===1?'':'s'}</span></div>
        ${cupRowHTML(newest)}`:''}
      ${cities.length?`<div class="shead over"><span class="l">Your cities</span><span class="r">${esc(capFirst(words(cities.length)))}</span></div>
        <div style="display:flex;flex-direction:column">${cities.map(doorCityRowHTML).join('')}</div>`:''}
      ${rows.length?`<div class="doordoors">${rows.map(r=>
        `<button class="doordoor" onclick="${r[2]}"><span class="l">${esc(r[0])}</span><span class="r">${esc(r[1])}</span></button>`).join('')}</div>`:''}
    </div>
  </div>`;
}
/* a city, at the size a row is read at — .lrow's geometry with the seal in the
   thumbnail slot. The card's sub/said/facts belong on the city's own page. */
function doorCityRowHTML(city){
  const places=cityPlaces(city);
  const ids=new Set(places.map(p=>p.id));
  const cups=live('cups').filter(c=>c.kind==='bar'&&ids.has(c.placeRef));
  const ground=cityGround(city);
  const plate=cityPlate(city,PLATE_SPAN);
  const meta=[`${capFirst(words(places.length))} caf${places.length===1?'é':'és'}`,
    `${words(cups.length)} cup${cups.length===1?'':'s'}`].join(' · ');
  return `<button class="lrow doorcity" onclick="openCityChapter(${jsq(city)})">
    ${plate?plate.html:(ground?sealHTML(ground.key,ground.at,32):'')}
    <span class="mid"><span class="t">${esc(city)}</span><span class="m">${esc(meta)}</span></span>
    <span class="go">→</span></button>`;
}

/* the two rows on the sheet that had no screen of their own. Both are a list
 * over data the app already holds, opened as a sheet rather than a new room —
 * the asks through the ask's own row, the countries through the passport's own
 * chips. Nothing left the app when they left the door; they moved one pull and
 * one tap further in, which is the whole argument of this screen. */
function openAsksSheet(){
  const asks=D.asks.slice().sort(byNew);
  if(!asks.length)return;
  openSheet(`<h3>What Carta found</h3>
  <div class="sub">Every ask you have made, newest first. Tap one to read it again.</div>
  ${asks.map(askRowHTML).join('')}`);
}
function openTastedSheet(){
  const countries=Object.values(tastedCountryMap()).sort((a,b)=>a.label.localeCompare(b.label));
  if(!countries.length)return;
  const counts=countryCupCounts();
  openSheet(`<h3>Tasted so far</h3>
  <div class="sub">${esc(capFirst(words(countries.length)))} countr${countries.length===1?'y':'ies'} on the record. Tap one for its chapter.</div>
  <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:4px">
    ${countries.map(c=>`<button class="cchip" onclick="closeSheet();openCountryChapter(${jsq(c.label)})">${esc(c.label)}<span class="n">${counts[landKey(c.label)]||0}</span></button>`).join('')}
  </div>
  <button class="btn btn-quiet" style="margin-top:18px" onclick="closeSheet();sharePassportCard()">Share the passport</button>`);
}

function vAtlas(){
  const tasted=tastedCountryMap();
  const countries=Object.values(tasted).sort((a,b)=>a.label.localeCompare(b.label));
  const cities=knownCities();
  const asks=D.asks.slice().sort(byNew);
  const first=!live('cups').length&&!live('coffees').length;
  // the ladder: a brew expires, a bag does not, the question never does
  const shot=first?null:waitingShot();
  const bag=(first||shot)?null:restingBag();
  const plateRest=shot?ATLAS_PLATE_SHOT:bag?ATLAS_PLATE_BAG:0;   // 0 = full bleed
  /* the height this plate will actually stand at, worked out BEFORE the markup
     rather than corrected after it. <carta-atlas> measures its own box on
     connect, which happens while innerHTML is being parsed — before
     mountAtlas() could have set anything — so a plate with no height here
     paints once at the element's fallback size, flashes, and only reaches the
     right scale on the ResizeObserver's next tick. Stating it up front costs
     nothing and spares a whole projection pass. */
  const plateH=atlasPlateH(plateRest,atlasMainH());
  const leaf=shot?doorShotLeafHTML(shot,plateH):bag?doorBagLeafHTML(bag,plateH)
    :doorAskLeafHTML(first,countries);
  return `<div class="doorscreen">
    <div class="mapbox passport" id="atlasplate" data-rest="${plateRest}"
      style="position:absolute;left:0;right:0;top:0;height:${plateH}px">
      <carta-atlas style="position:absolute;inset:0" caption="off"
        frame="${first?'belt':'tasted'}"
        tasted="${first?'':esc(countries.map(c=>c.label).join(','))}"></carta-atlas>
      <div class="fade top" style="height:${plateRest?104:120}px"></div>
      ${doorHeadHTML(!first)}
      ${plateRest?`<div class="fade bottom" style="height:${shot?110:130}px"></div>`:''}
    </div>
    ${leaf}
    ${first?'':doorSheetHTML(cities,countries,asks)}
  </div>`;
}

/* ============ the walk down from a country ============
 * A country was a dead end: a shape, a count, a flat list of coffees. It is a
 * chapter now, and the chapter opens downward — the road states how far the
 * record actually follows this ground, then its regions, the hands that grew
 * it, the hands that roast from it and the rooms it pours in each open one
 * level further. Everything here is read off the greens the record already
 * holds; nothing is fetched, nothing is inferred to fill a line.
 */
const originOf=c=>(c&&c.origin)||{};
const growerOf=c=>String(originOf(c).farm||originOf(c).producer||'').trim();
const regionOf=c=>String(originOf(c).region||'').trim();
/* ---- the ground under a green (the thin ledger-coupled wrappers over originPin).
 * A farm is placed the same two ways a café is, and by the same doors: one
 * keyless Nominatim lookup, or a pin the keeper pastes off the map they already
 * have. Neither invents one — a farm the lookup does not actually name back is
 * left unplaced and simply listed, which is most smallholder farms and is not a
 * failure. Placing writes to the coffees that name that farm in that country,
 * which is the same fold the grower list on this page already groups by. */
const farmPin=c=>originPin(originOf(c));
const regionPin=list=>meanPin((list||[]).map(farmPin));
/* ---- the ground a coffee stands on, wherever a photo used to (Phase 27 —
 * photos retired, PIVOT.md decision #1 reopened: a full local ledger was one
 * lost phone from zero, and a photo per cup was the fastest way there).
 * Its own placed farm first, then the mean of its region's (or country's)
 * other placed farms, then nothing — the same fallback the walk down a
 * country already reads through, held to one coffee. */
function coffeeGroundPin(coffee){
  if(!coffee)return null;
  const own=farmPin(coffee);
  if(own)return own;
  const country=originOf(coffee).country;
  if(!country)return null;
  const region=regionOf(coffee);
  const siblings=countryCoffees(country).filter(c=>region?fold(regionOf(c))===fold(region):true);
  return regionPin(siblings);
}
// a list row's lead: the same soft silhouette a city row already carries
// (plotThumbHTML — too much map for a 44×60px row was Phase 17's own lesson;
// a shape is not), or the kind mark where the record can't place a coffee at all
function cupLeadHTML(cup,coffee){
  const at=coffee&&coffeeGroundPin(coffee);
  return at?plotThumbHTML([at]):`<span class="kind">${cup.kind==='bar'?'out':'home'}</span>`;
}
// the cup screen's hero, drawn as detailed as the record can defend: real
// terrain over a placed farm or region, the country's own washed shape where
// only that much is named, an honest empty state where the bag says nothing
function coffeeGroundHTML(coffee){
  const at=coffee&&coffeeGroundPin(coffee);
  if(at){
    const label=growerOf(coffee)||regionOf(coffee)||originOf(coffee).country||coffeeLabel(coffee);
    return streetsHTML([{id:coffee.id,name:label,lat:at.lat,lon:at.lon,score:1}],
      {terrain:true,names:true,zoom:farmPin(coffee)?12:8,dot:7,boxStyle:'height:300px',attribLift:2,
       plotWrap:'position:absolute;inset:0;padding:54px 40px',
       noteStyle:'position:absolute;left:0;right:0;bottom:0;z-index:3'});
  }
  const country=coffee&&originOf(coffee).country;
  if(country)return `<div class="mapbox passport" style="height:300px">
    <carta-belt style="position:absolute;inset:0" fit="cover" lift="on" labels="off" topo="on" tasted="${esc(country)}" focus="${esc(country)}"></carta-belt>
  </div>`;
  return `<div class="slot"><span>No origin named yet — the ground fills in once the bag says where.</span></div>`;
}
// the same ground, drawn static for a card that can't carry a custom element
// once it's standalone (the reason passportSVG() exists at all) — the soft
// shape, not the live streets, framed the way the passport's own box is
function coffeeCardMapHTML(coffee){
  const at=coffee&&coffeeGroundPin(coffee);
  if(!at)return '';
  const shape=cityShapePath([at]);
  if(!shape)return '';
  return `<div class="plot-box" style="padding:20px 20px 16px">
    <svg viewBox="${shape.viewBox}" preserveAspectRatio="xMidYMid meet" style="width:100%;height:140px;display:block">
      <path d="${shape.path}" style="fill:#241d18;fill-opacity:.14;stroke:#241d18;stroke-opacity:.5;stroke-width:1.4;vector-effect:non-scaling-stroke"></path>
    </svg>
  </div>`;
}
function farmCoffees(country,farm){return countryCoffees(country).filter(c=>fold(growerOf(c))===fold(farm))}
// a region stands where its placed farms stand — and is drawn only where some do
function regionMarks(country){
  return groupStated(countryCoffees(country),regionOf).map(r=>{
    const at=regionPin(r.items);
    return at?{id:r.label,label:r.label,lat:at.lat,lon:at.lon}:null;
  }).filter(Boolean);
}
function setFarmPin(country,farm,at){
  farmCoffees(country,farm).forEach(c=>{c.origin=c.origin||{};c.origin.lat=at.lat;c.origin.lon=at.lon;c.origin.geocoded=true;c.updatedAt=new Date().toISOString()});
}
function clearFarmPin(country,farm){
  farmCoffees(country,farm).forEach(c=>{if(!c.origin)return;delete c.origin.lat;delete c.origin.lon;delete c.origin.geocoded;c.updatedAt=new Date().toISOString()});
}
let _farmBusy=false;
async function placeFarms(country,region){
  if(_farmBusy)return;_farmBusy=true;
  const inScope=c=>region?fold(regionOf(c))===fold(region):true;
  const farms=groupStated(countryCoffees(country).filter(inScope),growerOf)
    .filter(g=>!g.items.some(farmPin)&&!g.items.every(c=>originOf(c).geocoded));
  if(!farms.length){_farmBusy=false;toast('Every farm here is already placed, or none is named.');return}
  let put=0;
  for(const g of farms){
    toast(`Placing ${g.label}…`);
    const hits=await lookupPlace(g.label,region||regionOf(g.items[0]),country);
    const hit=hits.find(h=>namesBack(h,g.label));
    if(hit){setFarmPin(country,g.label,hit);put++}
    else farmCoffees(country,g.label).forEach(c=>{c.origin=c.origin||{};c.origin.geocoded=true});
    save();
    if(g!==farms[farms.length-1])await sleep(1100);
  }
  _farmBusy=false;render();
  toast(put?`${capFirst(words(put))} of ${words(farms.length)} placed.`:'None of these farms is on the map by name.');
}
const countryCoffees=name=>live('coffees').filter(c=>landKey(originOf(c).country||'')===landKey(name));
function cupsOfCoffees(list){const ids=new Set(list.map(c=>c.id));return live('cups').filter(c=>ids.has(c.coffeeRef))}
function avgOf(cups){const s=cups.filter(c=>c.score!=null);return s.length?s.reduce((a,c)=>a+c.score,0)/s.length:null}
// a stated value, grouped under the keeper's own commonest spelling of it —
// never a resolver, never a lookup key printed back at them (VOICE.md)
function groupStated(list,keyFn){
  const m={};
  list.forEach(x=>{
    const raw=String(keyFn(x)||'').trim();if(!raw)return;
    const k=fold(raw);
    (m[k]=m[k]||{key:k,label:raw,items:[],spellings:{}});
    m[k].items.push(x);m[k].spellings[raw]=(m[k].spellings[raw]||0)+1;
  });
  return Object.values(m).map(g=>{
    g.label=Object.entries(g.spellings).sort((a,b)=>b[1]-a[1])[0][0];
    g.cups=cupsOfCoffees(g.items);g.avg=avgOf(g.cups);
    return g;
  });
}
const byAvgDesc=(a,b)=>(b.avg==null?-1:b.avg)-(a.avg==null?-1:a.avg)||b.items.length-a.items.length;
function andList(words){
  if(words.length<2)return words[0]||'';
  return words.slice(0,-1).join(', ')+' and '+words[words.length-1];
}
// what a green's own list amounts to, in the line a chapter row carries
function greensMeta(g){
  const n=g.items.length,cups=g.cups.length;
  const lead=g.items.map(c=>({c,a:avgOf(cupsOfCoffees([c]))})).filter(x=>x.a!=null).sort((a,b)=>b.a-a.a)[0];
  return [`${words(n)} coffee${n===1?'':'s'}`,cups?`${words(cups)} cup${cups===1?'':'s'}`:null,
    lead?`${lead.c.name||coffeeLabel(lead.c)} leads`:null].filter(Boolean).join(' · ');
}
/* the road — six stations, and the plain fact of which ones this record
 * reaches. A hollow station is not a failure and never reads as one: a bag
 * that says nothing is a record that has been told less, not a lesser coffee. */
const ROAD_STATIONS=[
  {name:'Grown',has:c=>!!growerOf(c)},
  {name:'Processed',has:c=>!!String(originOf(c).process||'').trim()},
  {name:'Milled',has:c=>!!String(originOf(c).mill||'').trim()},
  {name:'Roasted',has:c=>!!String(c.roaster||'').trim()},
];
function roadStations(coffees,cups){
  const poured=new Set(cups.filter(c=>c.kind==='bar'&&c.placeRef).map(c=>c.placeRef));
  return ROAD_STATIONS.map(s=>({name:s.name,n:coffees.filter(s.has).length}))
    .concat([{name:'Poured',n:poured.size},{name:'Read',n:cups.length}]);
}
function roadHTML(st){
  const rail=(edge,joined)=>edge?'<i class="end"></i>':`<i class="${joined?'':'gap'}"></i>`;
  return `<div class="road">${st.map((s,i)=>{
    const on=s.n>0,prev=i>0?st[i-1].n>0:true,next=i<st.length-1?st[i+1].n>0:true;
    return `<div class="st${on?'':' off'}">
      <div class="rail">${rail(i===0,on&&prev)}<span class="mk${on?'':' off'}"></span>${rail(i===st.length-1,on&&next)}</div>
      <div class="n">${on?s.n:'—'}</div>
      <div class="l">${s.name}</div>
    </div>`;
  }).join('')}</div>`;
}
function roadNote(st,coffees){
  const silent=st.filter(s=>!s.n).map(s=>s.name.toLowerCase());
  const filled=st.length-silent.length;
  const noFarm=coffees.filter(c=>!growerOf(c)).length;
  const bits=[`${capFirst(words(filled))} station${filled===1?'':'s'} stand${filled===1?'s':''} out of ${words(st.length)}.`];
  if(silent.length)bits.push(`${capFirst(andList(silent))} ${silent.length===1?'is':'are'} silent on every green here.`);
  if(noFarm)bits.push(`${capFirst(words(noFarm))} of ${words(coffees.length)} name${noFarm===1?'s':''} no farm at all.`);
  bits.push('Coverage counts — it never grades.');
  return bits.join(' ');
}
// heights, read only where a bag actually states one: every figure a stated
// altitude carries, so "1,900 – 2,100 m" reads as a span and "1900 masl" as a
// point. Nothing is read across from a neighbouring lot.
function altitudesOf(coffee){
  const out=[];
  (String(originOf(coffee).altitude||'').match(/\d[\d,.]*/g)||[]).forEach(t=>{
    const n=Number(t.replace(/[,.]/g,''));
    if(isFinite(n)&&n>=300&&n<=3000)out.push(n);
  });
  return out;
}
function altitudeBandHTML(coffees){
  const stated=coffees.filter(c=>altitudesOf(c).length);
  const all=stated.reduce((a,c)=>a.concat(altitudesOf(c)),[]);
  const silent=coffees.length-stated.length;
  const note=stated.length
    ? `Stated by ${words(stated.length)} bag${stated.length===1?'':'s'}${silent?`. Unread on ${words(silent)}`:''} — height places a coffee, it never ranks it.`
    : `No bag here states a height. Unread is a state, not a low one — height places a coffee, it never ranks it.`;
  if(!all.length){
    return `<div class="box" style="margin-top:22px">
      <div class="row"><span class="eyebrow" style="margin:0">Grown between</span>
        <span class="num" style="font-size:16px;color:var(--text-disabled);font-style:italic">unread</span></div>
      <div class="note" style="border:0;padding:0;margin:12px 0 0">${esc(note)}</div></div>`;
  }
  const lo=Math.min(...all),hi=Math.max(...all);
  // the drawn span holds the whole atlas the record could state, so a band is
  // read against the same ground every time — never fitted to flatter itself
  const axLo=Math.min(1200,Math.floor(lo/100)*100),axHi=Math.max(2400,Math.ceil(hi/100)*100);
  const pct=v=>Math.max(0,Math.min(100,(v-axLo)/(axHi-axLo)*100));
  const left=pct(lo),right=100-pct(hi);
  return `<div class="box" style="margin-top:22px">
    <div class="row"><span class="eyebrow" style="margin:0">Grown between</span>
      <span class="num" style="font-size:16px">${lo===hi?`${lo.toLocaleString()} m`:`${lo.toLocaleString()} – ${hi.toLocaleString()} m`}</span></div>
    <div class="band"><span style="left:${left.toFixed(1)}%;right:${right.toFixed(1)}%;${lo===hi?'width:5px;right:auto':''}"></span></div>
    <div class="band-ax"><span>${axLo.toLocaleString()} m</span><span>the atlas</span><span>${axHi.toLocaleString()} m</span></div>
    <div class="note" style="border:0;padding:0;margin:12px 0 0">${esc(note)}</div>
  </div>`;
}
// the cups one scope was read from, listed where they were drunk — a country's
// own reading, opened from the box that states it
function cupsSheet(title,sub,cups){
  openSheet(`<h3>${esc(title)}</h3>
  <div class="sub">${esc(sub)}</div>
  ${cups.length?cups.slice().sort(byWhen).map(c=>{
    const place=c.kind==='bar'?placeById(c.placeRef):null;
    const coffee=coffeeById(c.coffeeRef);
    return `<button class="lrow" style="min-height:56px" onclick="closeSheet();openCupDetail('${c.id}')">
      <span class="mid"><span class="t" style="font-size:17px">${esc(coffeeLabel(coffee))}</span>
      <span class="m">${esc([place?place.name:'At home',fmtWhen(c.at)].filter(Boolean).join(' · '))}</span></span>
      <span class="sc${c.score==null?' none':''}" style="font-size:24px">${c.score==null?'—':c.score}</span></button>`;
  }).join(''):'<div class="empty">Nothing read here yet.</div>'}`);
}
function openCountryCups(label){
  const coffees=countryCoffees(label);
  cupsSheet(`The cups from ${label}`,'Your own readings — never averaged into anyone else’s page.',cupsOfCoffees(coffees));
}

/* ============ a country — the chapter under its own shape ============ */
function vCountryChapter(label){
  const coffees=countryCoffees(label);
  const cups=cupsOfCoffees(coffees);
  const scored=cups.filter(c=>c.score!=null);
  const a=avgOf(cups);
  const roasters=groupStated(coffees,c=>c.roaster).sort(byAvgDesc);
  const regions=groupStated(coffees,regionOf).sort(byAvgDesc);
  const silentRegion=coffees.filter(c=>!regionOf(c));
  const growers=groupStated(coffees,growerOf).sort((x,y)=>y.items.length-x.items.length);
  const noGrower=coffees.length-growers.reduce((s,g)=>s+g.items.length,0);
  const st=roadStations(coffees,cups);
  const filled=st.filter(s=>s.n).length;
  const rmarks=regionMarks(label);
  const unplaced=regions.filter(r=>!rmarks.some(m=>m.id===r.label));
  // where these greens have poured — a café you drank one in, by its own city
  const pourIds=[...new Set(cups.filter(c=>c.kind==='bar'&&c.placeRef).map(c=>c.placeRef))];
  const pours=pourIds.map(placeById).filter(Boolean);
  const pourCities=[...new Set(pours.map(p=>p.city).filter(Boolean))];
  const best=scored.slice().sort((x,y)=>y.score-x.score)[0];
  const recordBest=live('cups').filter(c=>c.score!=null).reduce((m,c)=>Math.max(m,c.score),-1);
  const lede=[
    `${capFirst(words(coffees.length))} coffee${coffees.length===1?'':'s'} on the record${roasters.length?`, from ${words(roasters.length)} roaster${roasters.length===1?'':'s'}`:''}.`,
    cups.length?`${capFirst(words(cups.length))} cup${cups.length===1?'':'s'}${best&&best.score===recordBest?', and the highest of them was drunk here':''}.`:null,
  ].filter(Boolean).join(' ');
  if(!coffees.length){
    return `<div>
      <div style="position:relative">
        <div class="mapbox passport" style="height:300px">
          <carta-belt style="position:absolute;inset:0" fit="cover" lift="on" labels="off" topo="on" tasted="${esc(label)}" focus="${esc(label)}"></carta-belt>
        </div>
        <div class="fade top" style="height:88px;z-index:3"></div>
        ${backMiniHTML('overlay','left:18px;top:18px',true)}
      </div>
      <div class="lift pad" style="padding-top:22px">
        <div class="eyebrow" style="margin:4px 0 6px">A country</div>
        <div class="display big">${esc(label)}</div>
        <div class="lede">Nothing from here on the record yet. Log a coffee that names it and this chapter opens on its own.</div>
        ${/* v7.35.0, critique rec 9: the chapter stated the condition for its own
             existence and then offered no way to meet it — the keeper had to
             remember the door was on the bar, open it, and type the country back
             in by hand. The door is here, with the country already answered. */''}
        <button class="btn btn-primary" style="margin-top:6px;min-height:52px" onclick="doorFromCountry(${jsq(label)})">＋ Log a coffee from ${esc(label)}</button>
      </div></div>`;
  }
  return `<div>
    <div style="position:relative">
      <div class="mapbox passport" style="height:${rmarks.length?332:296}px">
        <carta-belt style="position:absolute;inset:0" fit="cover" lift="on" labels="off" topo="on" tasted="${esc(label)}" focus="${esc(label)}" marks="${esc(JSON.stringify(rmarks))}"></carta-belt>
      </div>
      <div class="fade top" style="height:88px;z-index:3"></div>
      ${backMiniHTML('overlay','left:18px;top:18px',true)}
    </div>
    <div class="lift pad" style="padding-top:22px">
      <div class="eyebrow" style="margin:4px 0 6px">A country</div>
      <div class="display big">${esc(label)}</div>
      <div class="lede">${esc(lede)}</div>

      <div class="shead" style="margin-top:28px"><span class="l">How far the record follows it</span>
        <span class="r">${words(filled)} of ${words(st.length)}</span></div>
      ${roadHTML(st)}
      <div class="note" style="border:0;padding:0;margin:14px 0 0">${esc(roadNote(st,coffees))}</div>

      <div class="shead"><span class="l">Its regions</span>
        <span class="r">${words(regions.length)} named${silentRegion.length?` · ${words(silentRegion.length)} silent`:''}</span></div>
      ${rmarks.length?`<div class="note" style="border:0;padding:0;margin:0 0 12px">${esc(`${capFirst(words(rmarks.length))} of them stand on the map above, on the ground their own farms were placed on. Tap one.`)}</div>`:''}
      ${unplaced.length?`<button class="rowlink" style="padding:12px 0" onclick="placeFarms(${jsq(label)},'')">
        <span style="min-width:0"><span class="t" style="display:block;font-size:16px">Place ${unplaced.length===regions.length?'these regions':'the rest'} on the map</span>
        <span class="m" style="display:block;margin-top:2px">${esc(`${words(unplaced.length)} region${unplaced.length===1?'':'s'} · looks each farm up once, and leaves the ones it can't name`)}</span></span>
        <span class="go">→</span></button>`:''}
      ${regions.map(r=>`<button class="lrow" onclick="openRegionChapter(${jsq(label)},${jsq(r.label)})">
        <span class="mid"><span class="t">${esc(r.label)}</span><span class="m">${esc(greensMeta(r))}</span></span>
        <span class="sc${r.avg==null?' none':''}">${r.avg==null?'—':trimNum(r.avg)}</span>
        <span class="go">→</span></button>`).join('')}
      ${silentRegion.length?`<button class="lrow" onclick="openRegionChapter(${jsq(label)},'')">
        <span class="mid"><span class="t">No region named</span>
        <span class="m">${esc(`${words(silentRegion.length)} coffee${silentRegion.length===1?'':'s'} · the bag stopped at the country`)}</span></span>
        <span class="go">→</span></button>`:''}

      <div class="shead"><span class="l">The hands that grew it</span>
        <span class="r">${words(growers.length)} named${noGrower?` · ${words(noGrower)} unread`:''}</span></div>
      ${growers.length?growers.map(g=>{
        const producer=g.items.map(c=>String(originOf(c).producer||'').trim()).find(Boolean);
        const meta=[producer&&fold(producer)!==fold(g.label)?producer:null,
          `${words(g.items.length)} green${g.items.length===1?'':'s'}`].filter(Boolean).join(' · ');
        return `<button class="rowlink" style="padding:13px 0" onclick="openProducerPage(${jsq(label)},${jsq(g.label)},${jsq(regionOf(g.items[0]))})">
          <span style="min-width:0"><span class="t" style="display:block;font-size:17px">${esc(g.label)}</span>
          <span class="m" style="display:block;margin-top:2px">${esc(meta)}</span></span>
          <span class="go">→</span></button>`;
      }).join(''):'<div class="muted" style="padding:12px 0">No bag here has named a hand yet.</div>'}
      ${noGrower?`<div class="note">${esc(`${capFirst(words(noGrower))} of these coffees name${noGrower===1?'s':''} no hand at all.`)} A bag that says nothing is not a lesser coffee — it is a record that has been told less.</div>`:''}

      <div class="shead"><span class="l">The hands that roast from here</span></div>
      ${roasters.map(r=>`<div class="row" style="padding:12px 0;border-bottom:1px solid var(--line)">
        <span style="font-family:var(--serif);font-size:17px">${esc(r.label)}</span>
        <span class="num" style="font-size:12.5px;color:var(--ink-3)">${esc(`${words(r.items.length)} green${r.items.length===1?'':'s'}`)}${r.avg==null?'':' · '+trimNum(r.avg)}</span>
      </div>`).join('')}

      ${pours.length?`<div class="shead"><span class="l">Where it pours</span>
        <span class="r">${words(pourCities.length)} cit${pourCities.length===1?'y':'ies'}</span></div>
        ${pours.map(p=>{
          const n=cups.filter(c=>c.placeRef===p.id).length;
          return `<button class="rowlink" style="padding:13px 0" onclick="openCafeScreen('${p.id}')">
            <span style="font-family:var(--serif);font-size:17px">${esc(p.name)}</span>
            <span class="m">${esc([p.city,`${words(n)} cup${n===1?'':'s'}`].filter(Boolean).join(' · '))}</span></button>`;
        }).join('')}`:''}

      ${cups.length?`<div class="box" style="margin-top:30px">
        <div class="eyebrow">What you found here</div>
        <div style="display:flex;align-items:flex-end;justify-content:space-between;gap:16px">
          <div class="lede" style="margin:0;max-width:24ch">${esc(`${capFirst(words(cups.length))} cup${cups.length===1?'':'s'}.`)}${best?esc(` Your ${best.score} was ${coffeeLabel(coffeeById(best.coffeeRef))}, ${best.kind==='bar'?'drunk out':'drunk at home'}.`):''}</div>
          ${a!=null?`<div style="flex:none;text-align:right">
            <div class="bigscore" style="font-size:38px">${trimNum(a)}</div>
            <div class="ofnine">your average</div></div>`:''}
        </div>
        <button class="btn btn-quiet" style="margin-top:16px" onclick="openCountryCups(${jsq(label)})">The cups from ${esc(label)} →</button>
      </div>`:''}
      <div class="note" style="margin-top:22px">Your scores stay yours. Nothing on this page is averaged into anyone else’s.</div>
    </div>
  </div>`;
}

/* ============ a region — the same question, at a finer grain ============ */
function regionFarmPins(coffees){
  return groupStated(coffees,growerOf).map(g=>{
    const at=regionPin(g.items);
    return at?{id:g.label,name:g.label,lat:at.lat,lon:at.lon,score:avgOf(cupsOfCoffees(g.items))}:null;
  }).filter(Boolean);
}
function vRegionChapter(country,view){
  const region=(view&&view.region)||'';
  const all=countryCoffees(country);
  const coffees=region?all.filter(c=>fold(regionOf(c))===fold(region)):all.filter(c=>!regionOf(c));
  const label=region||'No region named';
  const cups=cupsOfCoffees(coffees);
  const growers=groupStated(coffees,growerOf).sort((x,y)=>y.items.length-x.items.length);
  const noGrower=coffees.length-growers.reduce((s,g)=>s+g.items.length,0);
  const processes=groupStated(coffees,c=>originOf(c).process).sort((x,y)=>y.items.length-x.items.length);
  const noProcess=coffees.length-processes.reduce((s,g)=>s+g.items.length,0);
  const repeats=growers.filter(g=>g.items.length>1)[0];
  const lede=coffees.length?[
    `${capFirst(words(coffees.length))} coffee${coffees.length===1?'':'s'}`,
    repeats?`, ${words(repeats.items.length)} of them from the same hand`:'',
    '.',
    cups.length?` ${capFirst(words(cups.length))} cup${cups.length===1?'':'s'} read from ${coffees.length===1?'it':'them'}.`:'',
  ].join('')
    :(region?'Nothing from here on the record yet.':'Every coffee here named its region — nothing stopped at the country.');
  /* the ground itself, where the record can stand on it. Altitude is most of why
   * a coffee from here tastes the way it does, so the region's own relief is the
   * page's first fact — real terrain over the drawn plot, which holds the same
   * farms and simply stands when the tiles can't be reached (ARCHITECTURE.md §7).
   * A farm with no confirmed position is listed below and never pinned up here. */
  const fpins=regionFarmPins(coffees);
  const unplaced=growers.length-fpins.length;
  const head=fpins.length
    ? streetsHTML(fpins,{terrain:true,names:true,zoom:11,dot:7,labels:'on',boxStyle:'height:322px',attribLift:2,
        plotWrap:'position:absolute;inset:0;padding:54px 40px',
        noteStyle:'position:absolute;left:0;right:0;bottom:0;z-index:3'})
    : `<div class="mapbox passport" style="height:260px">
        <carta-belt style="position:absolute;inset:0" fit="cover" lift="on" labels="off" topo="on" tasted="${esc(country)}" focus="${esc(country)}"></carta-belt>
      </div>`;
  return `<div>
    <div style="position:relative">
      ${head}
      <div class="fade top" style="height:88px;z-index:3"></div>
      ${backMiniHTML('overlay','left:18px;top:18px',true)}
    </div>
    <div class="lift pad" style="padding-top:22px">
      <div class="eyebrow" style="margin:4px 0 6px">A region · ${esc(country)}</div>
      <div class="display big">${esc(label)}</div>
      <div class="lede">${esc(lede)}</div>
      ${coffees.length?'':`<button class="btn btn-primary" style="margin-top:6px;min-height:52px" onclick="doorFromCountry(${jsq(country)},${jsq(region)})">＋ Log a coffee from ${esc(region||country)}</button>`}
      ${fpins.length?`<div class="note" style="border:0;padding:0;margin:0 0 4px">${esc(`${capFirst(words(fpins.length))} farm${fpins.length===1?'':'s'} stand${fpins.length===1?'s':''} on the ground above${unplaced>0?`; ${words(unplaced)} more ${unplaced===1?'is':'are'} named but not placed`:''}. Tap a pin for its ledger.`)}</div>`:''}
      ${unplaced>0&&region?`<button class="rowlink" style="padding:12px 0" onclick="placeFarms(${jsq(country)},${jsq(region)})">
        <span style="min-width:0"><span class="t" style="display:block;font-size:16px">${esc(fpins.length?'Place the rest':'Put these farms on the ground')}</span>
        <span class="m" style="display:block;margin-top:2px">${esc(`${words(unplaced)} farm${unplaced===1?'':'s'} · one lookup each, and the ones the map can't name back stay listed`)}</span></span>
        <span class="go">→</span></button>`:''}
      ${altitudeBandHTML(coffees)}

      <div class="shead"><span class="l">The hands that grew it</span>
        <span class="r">${words(growers.length)} named${noGrower?` · ${words(noGrower)} unread`:''}</span></div>
      ${growers.map(g=>{
        const producer=g.items.map(c=>String(originOf(c).producer||'').trim()).find(Boolean);
        const meta=[producer&&fold(producer)!==fold(g.label)?producer:null,
          `${words(g.items.length)} green${g.items.length===1?'':'s'}`].filter(Boolean).join(' · ');
        return `<button class="rowlink" style="padding:14px 0;min-height:58px" onclick="openProducerPage(${jsq(country)},${jsq(g.label)},${jsq(region)})">
          <span style="min-width:0"><span class="t" style="display:block;font-size:17px">${esc(g.label)}</span>
          <span class="m" style="display:block;margin-top:2px">${esc(meta)}</span></span>
          <span class="go">→</span></button>`;
      }).join('')}
      ${noGrower?`<div class="rowlink" style="padding:14px 0;cursor:default">
        <span style="min-width:0"><span class="t" style="display:block;font-size:17px;color:var(--ink-3)">${esc(`${capFirst(words(noGrower))} green${noGrower===1?'':'s'} name${noGrower===1?'s':''} no hand`)}</span>
        <span class="m" style="display:block;margin-top:2px">unread — the bag stopped at the region</span></span></div>`:''}

      ${processes.length||noProcess?`<div class="shead" style="margin-bottom:14px"><span class="l">How it was made</span></div>
      <div class="picks">
        ${processes.map(p=>`<span class="dchip">${esc(p.label)} — ${words(p.items.length)}</span>`).join('')}
        ${noProcess?`<span class="dchip" style="color:var(--text-disabled)">Unread — ${words(noProcess)}</span>`:''}
      </div>`:''}

      <div class="shead"><span class="l">The greens</span>
        <span class="r">${words(coffees.length)} on the record</span></div>
      ${coffees.slice().sort((x,y)=>(avgOf(cupsOfCoffees([y]))||-1)-(avgOf(cupsOfCoffees([x]))||-1)).map(c=>{
        const ca=avgOf(cupsOfCoffees([c])),n=cupsOfCoffees([c]).length;
        return `<button class="lrow" onclick="openCoffeeDetail('${c.id}')">
          <span class="mid"><span class="t" style="font-size:17.5px">${esc(coffeeLabel(c))}</span>
          <span class="m">${esc([originOf(c).process,n?`${words(n)} cup${n===1?'':'s'}`:'not scored'].filter(Boolean).join(' · '))}</span></span>
          <span class="sc${ca==null?' none':''}">${ca==null?'—':trimNum(ca)}</span></button>`;
      }).join('')}
      <div class="note" style="margin-top:14px">A region is a scope, not a page of its own making: everything here is the same question the country asked, at a finer grain.</div>
    </div>
  </div>`;
}

/* ============ a producer — the last name the bag gave ============
 * Where the farm went. The record holds four lines about a farm the trade
 * knows a book about, and says so plainly: `unread` is designed here as a
 * first-class state, never a blank and never a low default.
 */
function vProducerPage(name,view){
  const country=(view&&view.country)||'';
  const region=(view&&view.region)||'';
  const coffees=countryCoffees(country).filter(c=>fold(growerOf(c))===fold(name));
  const cups=cupsOfCoffees(coffees);
  const roasters=groupStated(coffees,c=>c.roaster);
  const producer=coffees.map(c=>String(originOf(c).producer||'').trim()).find(Boolean)||'';
  const varieties=[...new Set(coffees.map(c=>String(originOf(c).variety||'').trim()).filter(Boolean))];
  const processes=[...new Set(coffees.map(c=>String(originOf(c).process||'').trim()).filter(Boolean))];
  const alts=coffees.reduce((a,c)=>a.concat(altitudesOf(c)),[]);
  const first=coffees.slice().sort((a,b)=>a.createdAt.localeCompare(b.createdAt))[0];
  const pours=[...new Set(cups.filter(c=>c.kind==='bar'&&c.placeRef).map(c=>c.placeRef))].map(placeById).filter(Boolean);
  const ledger=[
    ['Grower',producer&&fold(producer)!==fold(name)?producer:''],
    ['Altitude',alts.length?(Math.min(...alts)===Math.max(...alts)?`${Math.min(...alts).toLocaleString()} m`:`${Math.min(...alts).toLocaleString()} – ${Math.max(...alts).toLocaleString()} m`):''],
    ['Varieties',varieties.join(' · ')],
    ['Processing',processes.join(' · ')],
    ['First on record',first?fmtMonth(first.createdAt):''],
  ];
  const stated=ledger.filter(r=>r[1]).length;
  const lede=coffees.length?[
    `${capFirst(words(coffees.length))} green${coffees.length===1?'':'s'} on the record`,
    cups.length?`, ${words(cups.length)} cup${cups.length===1?'':'s'}`:'',
    roasters.length>1?`, from ${words(roasters.length)} roasters`:'',
    '. What the trade knows about this hand, your record holds ',
    stated?`${words(stated)} line${stated===1?'':'s'} of.`:'nothing of yet.',
  ].join('')
    :'Nothing from this hand on the record yet.';
  return `<div>
    <header class="shdr" style="display:block">
      ${backHTML()}
      <div class="eyebrow" style="margin-bottom:6px">A farm${region?` · ${esc(region)}, ${esc(country)}`:country?` · ${esc(country)}`:''}</div>
      <div class="display" style="margin:0">${esc(name)}</div>
    </header>
    <div class="pad" style="padding-top:20px">
      <div class="lede">${esc(lede)}</div>
      ${ledgerHTML(ledger)}
      <div class="note" style="border:0;padding:0;margin:12px 0 0">Unread is a state, not a low default. Nothing here is guessed to fill a line.</div>
      ${farmGroundHTML(country,name,coffees)}
      <button class="btn btn-quiet" style="margin-top:14px" onclick="openCoffeeForm(${coffees[0]?`'${coffees[0].id}'`:''})">${coffees[0]?`Add to ${esc(coffeeLabel(coffees[0]))} — what the bag says`:'Add what the bag says'}</button>

      <div class="shead"><span class="l">The greens</span></div>
      ${coffees.map(c=>{
        const ca=avgOf(cupsOfCoffees([c])),n=cupsOfCoffees([c]).length;
        return `<button class="lrow" onclick="openCoffeeDetail('${c.id}')">
          <span class="mid"><span class="t" style="font-size:17.5px">${esc(coffeeLabel(c))}</span>
          <span class="m">${esc([originOf(c).process,n?`${words(n)} cup${n===1?'':'s'}`:'not scored'].filter(Boolean).join(' · '))}</span></span>
          <span class="sc${ca==null?' none':''}">${ca==null?'—':trimNum(ca)}</span></button>`;
      }).join('')}

      ${pours.length?`<div class="shead"><span class="l">Where it pours</span></div>
      ${pours.map(p=>{
        const n=cups.filter(c=>c.placeRef===p.id).length;
        return `<button class="rowlink" style="padding:13px 0" onclick="openCafeScreen('${p.id}')">
          <span style="font-family:var(--serif);font-size:17px">${esc(p.name)}</span>
          <span class="m">${esc([p.city,`${words(n)} cup${n===1?'':'s'}`].filter(Boolean).join(' · '))}</span></button>`;
      }).join('')}`:''}
      <div class="note" style="margin-top:22px">The roaster owns the roast, never the farm. This page is compiled from what the bags said, and it says who said it.</div>
    </div>
  </div>`;
}

/* the ground a farm stands on. A position is stated here the same two ways a
 * café's is — one lookup that has to name the farm back, or a pin pasted off
 * the map the keeper already has — and it is taken back the same way too. A
 * farm the map cannot name is not a failed record; it is most farms, and the
 * page says so in those words rather than leaving a blank. */
function farmGroundHTML(country,name,coffees){
  if(!country||!name)return '';
  const at=regionPin(coffees);
  const id='fm_'+fold(name).replace(/ /g,'_');
  const paste=`<label class="f" style="margin-top:10px"><span class="l">Or paste a map link</span>
    <input type="text" id="${id}" placeholder="Copied from Google or Apple Maps…"></label>
    <button class="btn btn-quiet" style="min-height:40px" onclick="pasteFarmLink(${jsq(country)},${jsq(name)},'${id}')">Place it</button>`;
  if(at)return `<div class="box" style="margin-top:20px">
    <div class="eyebrow" style="margin-bottom:10px">Its ground</div>
    ${streetsHTML([{id:name,name:name,lat:at.lat,lon:at.lon,score:1}],{terrain:true,zoom:12,dot:7,
      boxStyle:'height:190px',attribLift:2,plotWrap:'position:absolute;inset:0;padding:48px 40px',
      noteStyle:'position:absolute;left:0;right:0;bottom:0;z-index:3'})}
    <div class="m" style="margin-top:12px">${esc(`${at.lat.toFixed(3)}, ${at.lon.toFixed(3)}`)} · <span class="text-action" onclick="unplaceFarm(${jsq(country)},${jsq(name)})">not here?</span></div>
  </div>`;
  return `<div class="box" style="margin-top:20px">
    <div class="eyebrow" style="margin-bottom:4px">Its ground</div>
    <div class="m">Not placed. Most farms are not on the map by name, which is a fact about the map.</div>
    <div class="m" style="margin-top:12px"><span class="text-action" onclick="placeFarms(${jsq(country)},${jsq(regionOf(coffees[0])||'')})">Look it up</span></div>
    ${paste}</div>`;
}
// a pin the keeper is vouching for needs no lookup to confirm it — it IS the
// confirmation, the same reading Phase 16 settled on for a café
function pasteFarmLink(country,name,inputId){
  const el=document.getElementById(inputId);
  const at=parseMapLink(el&&el.value);
  if(!at){toast('Couldn\u2019t read a position from that — paste the map\u2019s own link, not a shortened share link.');return}
  setFarmPin(country,name,at);save();render();
  toast('Placed.',()=>{clearFarmPin(country,name);save();render()},'Undo');
}
function unplaceFarm(country,name){
  const was=farmCoffees(country,name).map(c=>({c,lat:originOf(c).lat,lon:originOf(c).lon}));
  clearFarmPin(country,name);save();render();
  toast('Taken off the map.',()=>{was.forEach(w=>{if(w.lat!=null){w.c.origin.lat=w.lat;w.c.origin.lon=w.lon;w.c.origin.geocoded=true}});save();render()},'Undo');
}

/* ============ a city — streets, edge to edge, with the record over them ============
 * The map is the screen; the list is a sheet you pull up over it. Pull it up
 * and the map re-frames rather than remounting, so the pins step clear of the
 * paper instead of hiding under it.
 */
function vCityChapter(city){
  const places=cityPlaces(city);
  const rows=places.slice().sort((a,b)=>{
    const av=placeAvg(a.id),bv=placeAvg(b.id);
    return (bv==null?-1:bv)-(av==null?-1:av)||a.name.localeCompare(b.name);
  });
  // the sheet owns the bottom of this screen, so the drawn plot is padded clear
  // of it and the offline line sits under the title rather than behind the paper
  const map=streetsHTML(places,{boxStyle:'position:absolute;inset:0',scoreOf:p=>placeAvg(p.id),
    // a plot scaled into the band above the sheet gets small — the dot grows to
    // meet it, since a mark you can't see isn't a mark
    labels:'on',dot:16,noteStyle:'top:82px;bottom:auto',
    plotWrap:'position:absolute;left:0;right:0;top:0;bottom:43%;padding:92px 34px 14px',
    emptyHTML:'<div class="mapbox" style="position:absolute;inset:0"></div>'});
  return `<div class="cityroot">
    ${map}
    <div class="fade top" style="height:130px;z-index:3"></div>
    <div class="overlay" style="left:18px;right:18px;top:18px;display:flex;align-items:flex-start;justify-content:space-between;gap:12px">
      ${backMiniHTML('','',true)}
      <div style="text-align:right">
        <div class="eyebrow" style="margin:0">A city</div>
        <div style="font-family:var(--serif);font-weight:600;font-size:24px;line-height:1.15;letter-spacing:-.01em">${esc(city)}</div>
      </div>
    </div>
    <div class="citysheet" id="citysheet">
      <button class="pull" onclick="toggleCitySheet()" aria-label="Pull the list up"><span></span></button>
      <div style="display:flex;align-items:baseline;justify-content:space-between;gap:12px;padding:2px 20px 10px">
        <span style="font-family:var(--sans);font-size:var(--s11);letter-spacing:.14em;text-transform:uppercase;color:var(--ink-2);font-weight:500">Your cafés here</span>
        <span style="font-family:var(--sans);font-size:var(--s11);color:var(--ink-3);letter-spacing:.04em">${esc(cityMetaLine(city))}</span>
      </div>
      <div class="list noscroll">
        ${rows.length?rows.map(p=>{
          const a=placeAvg(p.id),n=placeCups(p.id).length;
          return `<button class="lrow" style="min-height:60px" onclick="openCafeScreen('${p.id}')">
            <span class="mid"><span class="t">${esc(p.name)}</span>
            <span class="m">${esc([p.branches&&p.branches.length?'several here — place it':p.neighborhood||'',a!=null?`${n} cup${n===1?'':'s'}`:'not scored yet'].filter(Boolean).join(' · '))}</span></span>
            <span class="sc${a==null?' none':''}">${a==null?'—':a.toFixed(1)}</span></button>`;
        }).join(''):'<div class="empty">No cafés logged here yet.</div>'}
        <div class="note">Positions are confirmed against a real address, and any café can be looked up again. Offline, the drawn plot stands on its own.</div>
        <button class="btn btn-quiet" style="margin-top:10px" onclick="addCafeHere(${jsq(city)})">＋ Add a café in ${esc(city)}</button>
        <button class="btn btn-quiet" style="margin-top:8px" onclick="openAskScreenFor(${jsq(city)})">Ask Carta about ${esc(city)}</button>
      </div>
    </div>
  </div>`;
}

/* ============ the seam out ============
 * Everything index.html, carta-ask.js or an inline handler calls by name.
 * `resetAtlasSheet` and `clearCityLead` are the two that are not simply
 * "a view the router opens": they let render() and save() reset state that
 * belongs to this file without reaching across the seam to write it.
 */
window.askFromHome=askFromHome;
window.asktrustHTML=asktrustHTML;
window.avgOf=avgOf;
window.cityLead=cityLead;
window.cityPlaces=cityPlaces;
window.clearCityLead=clearCityLead;
window.coffeeCardMapHTML=coffeeCardMapHTML;
window.coffeeGroundHTML=coffeeGroundHTML;
window.cupLeadHTML=cupLeadHTML;
window.growerOf=growerOf;
window.mountAtlas=mountAtlas;
window.openCountryCups=openCountryCups;
window.originOf=originOf;
window.pasteFarmLink=pasteFarmLink;
window.placeAvg=placeAvg;
window.placeCups=placeCups;
window.placeFarms=placeFarms;
window.regionOf=regionOf;
window.resetAtlasSheet=resetAtlasSheet;
window.toggleAtlasSheet=toggleAtlasSheet;
window.unplaceFarm=unplaceFarm;
window.vAtlas=vAtlas;
window.vCityChapter=vCityChapter;
window.vCountryChapter=vCountryChapter;
window.vProducerPage=vProducerPage;
window.vRegionChapter=vRegionChapter;

window.ATLAS_VERSION='7.38.0';

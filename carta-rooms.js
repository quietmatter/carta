/* ============================================================================
     The rooms (ROADMAP.md Phase 12) — the record itself, and the screens the
     record opens.

     Split out of index.html at Phase 35, on the reading ARCHITECTURE.md §1 had
     been keeping since Phase 32: the file crossed the band on SEVEN consecutive
     releases that added no surface at all — a backup restore and six iOS chrome
     fixes — which is the band measuring maintenance rather than growth, and the
     point at which the split is due rather than another amendment.

     This is the cut §1 named first and Phase 31 declined, with its reasons
     written down at the time: the Atlas was one contiguous slab and the rooms
     were not, and the Atlas had a seam to `carta-map.js` that already existed.
     Both objections are spent. The rooms ARE one contiguous run now (the
     Journal through the dials, 861 lines under their own banners), and the seam
     they need is the one every sibling already has.

     What it holds is the record read as itself: the Journal and a cup's own
     screen, a café, the shelf, the keeper's whole record with its backup and
     its credentials, a Setup and its grind history, and the dials a brew is
     written on. What it does NOT hold is anything that draws geography (that is
     `carta-atlas.js`, one storey up from `carta-map.js`) or anything that
     argues (that is `carta-ask.js`).

     The seam is `window`, the same as every sibling, and it is published at the
     foot. One thing had to become a call rather than a bare write: `save()` in
     index.html was clearing this file's own `_cupNoCache` directly, which works
     — classic scripts share one global lexical scope — but is the opposite of a
     documented seam. It is `clearCupNos()` now, owned by the file that owns the
     state, the same shape `clearCityLead()` took at Phase 31.
     ========================================================================== */
/* ============ views ============ */
/* a cup, in the Journal (Phase 28). The brand leads, because the brand is what
 * you actually remember about a cup — the café you stood in, or the roaster
 * whose bag you opened — with the coffee itself in italic under it. The score
 * is the one ember on the screen. The seal is the country the coffee grew in,
 * and nothing at all where the bag never said. Where the old row had a 12.5px
 * dust line of dials, the leaf quotes what you wrote about the cup instead —
 * the thing the row never had room for, and the only reason to keep a journal.
 *
 * The catalogue number is the record counting itself: cup no. 214 is the 214th
 * cup on file, put-away cups included, because putting one away doesn't unmake
 * it. */
let _cupNoCache=null;
/* index.html's save() used to null this from across the file boundary. The
   state lives here, so the clearing does too — a call, not a bare write. */
function clearCupNos(){_cupNoCache=null}
function cupNo(cup){
  if(!_cupNoCache){
    _cupNoCache={};
    (D.cups||[]).slice()
      .sort((a,b)=>(a.at||a.createdAt||'').localeCompare(b.at||b.createdAt||''))
      .forEach((c,i)=>{_cupNoCache[c.id]=i+1});
  }
  return _cupNoCache[cup.id]||null;
}
// what stretch of the record a list is actually showing, in its own numbering
function cupRangeLine(list){
  const ns=(list||[]).map(cupNo).filter(n=>n!=null);
  if(!ns.length)return '';
  const hi=Math.max(...ns),lo=Math.min(...ns);
  return hi===lo?`no. ${hi}`:`no. ${hi} — ${lo}`;
}
// what actually went through the bed, at the grain a leaf reads at: the two
// weights and the time. The grind and the temperature are true only inside one
// Setup, so they stay on the cup's own page where the Setup is named with them.
function pourLine(b){
  if(!b)return '';
  const w=b.doseG!=null&&b.waterG!=null?`${b.doseG} g → ${b.waterG} g`
    :b.doseG!=null?`${b.doseG} g`:b.waterG!=null?`${b.waterG} g`:null;
  return [w,b.timeSec!=null?fmtTime(b.timeSec):null].filter(Boolean).join(' · ');
}
function cupRowHTML(cup){
  const coffee=coffeeById(cup.coffeeRef);
  const bar=cup.kind==='bar';
  const place=bar?placeById(cup.placeRef):null;
  const brew=cup.brewRef?brewById(cup.brewRef):null;
  const setup=brew&&brew.setupId?setupById(brew.setupId):null;
  const rig=setup?(setup.name||[setup.grinder,setup.brewer].filter(Boolean).join(' · ')):'';
  const o=originOf(coffee);
  // out, the café is the name; home, the roaster is — and the coffee follows in
  // italic either way, so the two lists read as one record rather than two.
  const name=bar?(place?place.name:'A café'):((coffee&&coffee.roaster)||coffeeLabel(coffee));
  const sub=bar?coffeeLabel(coffee)
    :[(coffee&&coffee.name)||'',rig?`on the ${rig}`:''].filter(Boolean).join(', ');
  const no=cupNo(cup);
  const ground=[regionOf(coffee),o.country].filter(Boolean).join(', ');
  // one fact, and only one: a café cup answers where it grew, a home brew
  // answers what went through the bed. The other half is already on the card —
  // the seal says the ground, so a `Grown` row beside it would say it twice.
  const fact=bar
    ?(ground?{k:'Grown',v:esc(ground),cls:''}
      :place&&(place.neighborhood||place.city)?{k:'Poured in',v:esc(place.neighborhood||place.city),cls:''}
      :null)
    :(pourLine(brew)?{k:'Poured',v:esc(pourLine(brew)),cls:' num'}
      :ground?{k:'Grown',v:esc(ground),cls:''}:null);
  const said=(cup.line||'').trim();
  const seal=sealHTML(landKey(o.country||''));
  return `<button class="lcard" onclick="openCupDetail('${cup.id}')">
    <span class="head${seal?'':' bare'}">
      ${seal}
      <span class="eyeb">${no?`No. ${no} · `:''}${bar?'out':'home'}</span>
      <span class="when">${esc(fmtDay(cup.at))}</span>
    </span>
    <span class="body">
      <span class="mid">
        <span class="n">${esc(name)}</span>
        ${sub?`<span class="sub">${esc(sub)}</span>`:''}
      </span>
      <span class="ans">
        <span class="sc${cup.score==null?' none':''}">${cup.score==null?'—':cup.score}</span>
        <span class="of${cup.score==null?' none':''}">${cup.score==null?'unread':'of nine'}</span>
      </span>
    </span>
    <span class="said${said?'':' none'}">${said?esc(said):'Nothing written down yet.'}</span>
    ${fact?`<span class="facts">
      <span class="fact"><span class="k">${fact.k}</span><span class="v${fact.cls}">${fact.v}</span></span>
    </span>`:''}
  </button>`;
}
// the recipe, said the way a recipe is read aloud — the dials in order, nothing
// spelled out that the numbers already say
function brewLine(b){
  if(!b)return '';
  return [b.grind,b.doseG!=null?b.doseG+' g':null,b.waterG!=null?b.waterG+' g':null,
    b.tempC!=null?b.tempC+' °C':null,b.timeSec!=null?fmtTime(b.timeSec):null].filter(x=>x!=null&&x!=='').join(' · ');
}

/* ============ the Journal — the record, and a reason to open it ============
 * The list is the room's substance, but a list of what you already did is not a
 * reason to come back. The continuation leads: the last cup you brewed, its
 * score, its recipe, what you found, and one tap to begin the next from it.
 */
function vJournal(){
  const cups=live('cups').sort(byWhen);
  return `<div>
  <header class="shdr">
    <div>
      <div class="eyebrow" style="margin-bottom:6px">The record</div>
      <div class="display" style="margin:0;white-space:nowrap">Every <em>cup</em></div>
    </div>
    <button class="omini bare" onclick="openTaste()">Your taste →</button>
  </header>
  <div class="pad" style="padding-top:6px">
    ${measuredAtHomeHTML()}
    ${continuationHTML()}
    <div class="shead over"><span class="l">Every cup, newest first</span><span class="r">${esc(cupRangeLine(cups))}</span></div>
    ${cups.length?cups.map(cupRowHTML).join(''):'<div class="empty">Tap ＋ A cup to start the record.</div>'}
    ${cups.length?'<div class="note">Nothing is deleted. Put a cup away and it leaves the list, not the record.</div>':''}
    ${archivedFold('cups',cupRowHTML,'Put away')}
  </div></div>`;
}
/* station 09 (Phase 26): the two doors onto a cup measured at home, and the
 * one line saying why the second exists. The typed door keeps everything it
 * had — a Setup, the dials, the timer — and simply stops being the default.
 * ＋ A cup on the bar is untouched: it remains the café path and the
 * bag-paste door. */
function measuredAtHomeHTML(){
  const watching=getPref('vizWatch',false)===true&&!!visualizerEmail();
  const state=watching?'watching Visualizer':(visualizerEmail()?'a brew, or typed':'typed, until a machine is known');
  return `<div class="shead" style="margin-top:0"><span class="l">At home</span>
    ${visualizerEmail()?`<button class="r qlink" style="text-transform:none;letter-spacing:.06em" onclick="openVisualizerKey()">${esc(state)}</button>`
      :`<span class="r">${esc(state)}</span>`}</div>
    <div class="btnrow" style="margin-top:14px">
      <button class="btn btn-quiet" onclick="openShotsScreen()">Pull a brew</button>
      <button class="btn btn-quiet" style="border-color:var(--line);color:var(--ink-2)" onclick="openHomeDoor()">Type a brew</button>
    </div>
    <div style="font-family:var(--serif);font-style:italic;font-size:var(--s13);color:var(--ink-3);line-height:1.5;margin:11px 0 4px">A brew no instrument was watching leaves no file to read. Typing it is the same path it always was: a Setup, the dials, the timer.</div>`;
}
// the continuation (design-system pattern, hero-loop): the last cup brewed at
// home, carried forward. Nothing invented — every figure on it is already on
// the record, and the one action begins the next brew from exactly there.
function continuationHTML(){
  const home=live('cups').filter(c=>c.kind==='home'&&c.brewRef).sort(byWhen);
  const last=home[0]||live('cups').sort(byWhen)[0];
  if(!last)return '';
  const coffee=coffeeById(last.coffeeRef);
  if(!coffee)return '';
  const brew=last.brewRef?brewById(last.brewRef):null;
  const origin=[coffee.roaster,(coffee.origin&&coffee.origin.process||'').toLowerCase(),coffee.origin&&coffee.origin.country].filter(Boolean).join(' · ');
  return `<div class="box firm" style="margin:12px 0 22px">
    <div class="eyebrow" style="color:var(--accent);margin-bottom:8px">${esc(fmtWhen(last.at))}</div>
    <div class="display" style="font-size:1.5rem;margin:0">${esc(coffee.name||coffeeLabel(coffee))}, again.</div>
    ${origin?`<div style="font-family:var(--sans);font-size:12.5px;color:var(--ink-3);margin-top:6px">${esc(origin)}</div>`:''}
    <div style="display:flex;align-items:center;gap:14px;border-top:1px solid var(--line);margin-top:16px;padding-top:14px">
      <span class="num" style="flex:none;font-size:30px;font-weight:600;line-height:1">${last.score==null?'—':last.score}<span style="font-size:13px;color:var(--ink-3);font-weight:400"> / 9</span></span>
      <span style="min-width:0">
        <span class="num" style="display:block;font-size:12.5px;color:var(--ink-2)">${esc(brewLine(brew)||'No recipe on that one.')}</span>
        <span style="display:block;font-family:var(--serif);font-style:italic;font-size:14px;color:var(--ink-3);margin-top:3px">${esc(last.line||'No line on that one.')}</span>
      </span>
    </div>
    <button class="btn" style="margin-top:16px;min-height:48px;background:var(--fill-strong);color:var(--text-on-fill);border:1px solid var(--fill-strong)" onclick="openBrewFlow('${coffee.id}')">Begin from that cup</button>
  </div>`;
}

/* ============ a cup — a screen now, not a sheet ============
 * The ground the coffee stands on leads, at 300px, drawn as detailed as the
 * record can defend (Phase 27 — photos retired, PIVOT.md decision #1
 * reopened); the score reads at 44px in the ember below it — this is the
 * one screen where the score IS the subject, so it gets the ember and the door
 * steps back to plain ink.
 */
function vCup(id){
  const cup=cupById(id);
  if(!cup)return `<div class="pad" style="padding-top:26px"><div class="empty">That cup isn't on the record.</div>
    <button class="btn btn-quiet" onclick="go('journal')">Back to the journal</button></div>`;
  const coffee=coffeeById(cup.coffeeRef);
  const place=cup.kind==='bar'?placeById(cup.placeRef):null;
  const brew=cup.brewRef?brewById(cup.brewRef):null;
  const setup=brew?setupById(brew.setupId):null;
  // the provenance block, in the order a cup is actually read back: what it
  // was, where it came from, how it was made, whose hands roasted it, and the
  // room it was drunk in. A line the record is silent on says so.
  // how long the coffee had rested when this cup was poured — the figure the
  // cup itself can defend, not today's distance from a roast date
  const roastedLine=(()=>{
    if(!coffee||!coffee.roaster)return '';
    if(!coffee.roastDate||!cup.at)return coffee.roaster;
    const days=Math.round((new Date(cup.at)-new Date(coffee.roastDate+'T00:00'))/864e5);
    if(!isFinite(days)||days<0)return coffee.roaster;
    return `${coffee.roaster} · ${days===0?'the same day':`${days} day${days===1?'':'s'} before`}`;
  })();
  const ledger=[
    ['Coffee',coffeeLabel(coffee)],
    ['Origin',originLine(coffee)],
    cup.kind==='bar'?['Poured',place?'At the bar':'']:['Brew',brewLine(brew)],
    cup.kind==='bar'
      ?['Roasted',roastedLine]
      :['Setup',setup?(setup.name||[setup.grinder,setup.brewer].filter(Boolean).join(' · ')):''],
    ['Café',place?place.name:''],
  ].filter(r=>!(r[0]==='Café'&&cup.kind!=='bar'));
  // station 07, against the board: no photograph, and the score is the page's
  // own answer rather than a figure in its corner. The reading leads at 58px
  // in the ember with what it is stated beside it; the line and what it tasted
  // of answer back across the same rule.
  const said=(cup.descriptors||[]).length||cup.line;
  return `<div>
    <header class="shdr" style="align-items:flex-end;gap:14px;justify-content:flex-start">
      ${backMiniHTML('bare','flex:none')}
      <div style="flex:1;min-width:0">
        <div class="eyebrow" style="margin-bottom:4px"><button class="whenlink" onclick="openCupWhen('${cup.id}')">${esc([fmtWhenLong(cup.at),fmtClock(cup.at)].filter(Boolean).join(' · '))}</button>${esc(' · '+(cup.kind==='bar'?'at the bar':'at home'))}</div>
        <div class="display" style="font-size:1.375rem;margin:0">${esc(cup.kind==='bar'?(place?place.name:'A café'):((coffee&&coffee.name)||coffeeLabel(coffee)||'A cup'))}</div>
      </div>
    </header>
    <div class="pad" style="padding-top:0">
      <div class="reading">
        <div class="s">
          <div class="bigscore" style="font-size:58px;line-height:.9;letter-spacing:-.04em">${cup.score==null?'—':cup.score}</div>
          <div class="l">${cup.score==null?'Unscored':'Your reading'}</div>
        </div>
        <div class="a">
          ${cup.line?`<div class="ln">${esc(cup.line)}</div>`:''}
          ${(cup.descriptors||[]).length?`<div class="ds">${cup.descriptors.map(d=>`<span class="dchip sm">${esc(d)}</span>`).join('')}</div>`:''}
          ${said?'':`<div class="ln faint">${cup.kind==='bar'&&place&&place.neighborhood?esc(place.neighborhood):'Nothing said about it.'}</div>`}
        </div>
      </div>
      ${cupPlateHTML(cup,brew)}
      <div style="margin-top:26px">${ledgerHTML(ledger)}</div>
      ${cup.kind!=='bar'&&brew&&live('setups').length>1?`<div style="text-align:center;margin-top:10px"><button class="qlink" onclick="openBrewFlow('${coffee?coffee.id:''}','${brew.id}')">Wrong Setup? Correct it →</button></div>`:''}
      ${brew&&brew.vizShotId!=null?`<div style="text-align:center;margin-top:20px"><button class="qlink" onclick="openBrewFlow('${coffee?coffee.id:''}')">Brew it again from these ${brew.method==='pourover'?'pours':'numbers'} →</button></div>`:''}
      ${place&&placed([place]).length?`<button style="width:100%;margin-top:18px;color:var(--ink);background:none;border:1px solid var(--line);padding:0;cursor:pointer;display:block" onclick="openCafeScreen('${place.id}')">
        ${streetsHTML([place],{boxStyle:'height:132px',zoom:15,still:true,attribLift:4,scoreOf:()=>1})}
        <span style="display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 14px;border-top:1px solid var(--line)">
          <span style="font-family:var(--serif);font-size:16px">${esc(place.name)}</span>
          <span class="eyebrow" style="margin:0">The café →</span>
        </span></button>`:''}
      ${cup.kind==='bar'&&coffee&&!coffee.home?`<button class="btn" style="margin-top:18px;min-height:50px;background:var(--fill-strong);color:var(--text-on-fill);border:1px solid var(--fill-strong)" onclick="takeItHome('${coffee.id}')">Take it home</button>`:''}
      ${coffee?`<button class="btn btn-quiet" style="margin-top:8px;min-height:50px" onclick="openCoffeeDetail('${coffee.id}')">The coffee →</button>`:''}
      ${/* v7.35.0, critique rec 9: a written cup was a dead end — its score, its
           line and its descriptors were whatever the twenty seconds produced and
           there was no way back to them. The correction runs through the one
           taste surface, so it is the same screen that wrote it. A café cup the
           door saved as `a cup, unnamed` names itself from here, too. */''}
      ${coffee&&!coffee.roaster&&!coffee.name
        ?`<button class="btn btn-quiet" style="margin-top:8px;min-height:50px" onclick="openCoffeeForm('${coffee.id}')">Name the coffee</button>`:''}
      <button class="btn btn-quiet" style="margin-top:8px;min-height:50px" onclick="openTasteEdit('${cup.id}')">Correct the reading</button>
      ${cup.archived
        ?`<button class="btn btn-quiet" style="margin-top:8px;min-height:50px" onclick="restore('cups','${cup.id}')">Restore this cup</button>`
        :`<button class="btn btn-quiet" style="margin-top:8px;min-height:50px" onclick="putAwayCup('${cup.id}')">Put away this cup</button>`}
      <div class="note" style="margin-top:22px">Nothing is deleted. Put a cup away and it leaves the list, not the record.</div>
    </div></div>`;
}
/* the plate, kept with the cup (Phase 26) — so a score always has the shot
 * that earned it underneath, at reading size and with the three figures as a
 * foot rule. A cup whose curve isn't on this device simply doesn't draw one;
 * its score, its line and its recipe are all on the ledger and stand alone.
 *
 * Amended v7.33.0: the plate is a door, not only a picture. Reading the brew
 * in full — the scrub, the pours table, the ledger the shot screen states —
 * used to be reachable only on the way to writing the cup, so the moment the
 * cup was written the argument behind it was closed. It is the other way
 * round now: writing the cup is what makes the plate worth keeping, so
 * whatever this cup was read from opens again from here, as often as it is
 * wanted. Only where the whole shot is actually still in hand — a hairline
 * redrawn from the curve store alone is a picture and stays one, since a
 * door onto a screen that would say "isn't in hand any more" is worse than
 * no door. */
function cupPlateHTML(cup,brew){
  if(cup.kind!=='home'||!brew||brew.vizShotId==null)return '';
  const shot=shotOfBrew(brew);
  if(!shot||!shot.curve)return '';
  const openable=!!readShotRead(brew.vizShotId);
  const fg=shotFigures(shot),pour=fg.method==='pourover';
  // the foot rule restates the plate in the method's own three figures — the
  // pours and the drawdown for a filter brew, the peak for a shot
  const foot=(pour
    ?[fg.pours&&fg.pours.length?`${fg.pours.length} pour${fg.pours.length===1?'':'s'}${fg.bloom==null?'':' · '+mmss(fg.bloom)+' bloom'}`:null,
      fg.ratio==null?null:`1:${fig1(fg.ratio)} · ${fig1(fg.dose)} → ${fig1(fg.yield)} g`,
      fg.total==null?null:mmss(fg.total)+(fg.drawdown==null?'':' · '+mmss(fg.drawdown)+' down')]
    :[fg.peak==null?null:fig1(fg.peak)+' bar peak',
      fg.ratio==null?null:`1:${fig1(fg.ratio)} · ${fig1(fg.dose)} → ${fig1(fg.yield)} g`,
      fg.total==null?null:fig1(fg.total)+' s']).filter(Boolean);
  const inner=`${plateSVG(shot,PLATE_FULL,{grid:true,flow:false,weight:true,bands:pour,style:'height:auto'})}
    ${foot.length?`<div style="display:flex;justify-content:space-between;gap:10px;padding:0 20px 10px;font-family:var(--sans);font-size:10px;letter-spacing:.06em;color:var(--ink-3);font-variant-numeric:tabular-nums">
      ${foot.map(f=>`<span>${esc(f)}</span>`).join('')}</div>`:''}`;
  const box='margin:20px -20px 0;background:var(--surface-sunk);border-top:1px solid var(--line);border-bottom:1px solid var(--line)';
  if(!openable)return `<div style="${box}">${inner}</div>`;
  return `<button style="${box};width:calc(100% + 40px);display:block;padding:0;border-left:0;border-right:0;color:inherit;cursor:pointer;text-align:left" onclick="openShotScreen(${jsq(String(brew.vizShotId))})">
    ${inner}
    <span style="display:flex;align-items:baseline;justify-content:space-between;gap:12px;padding:0 20px 12px">
      <span style="font-family:var(--serif);font-style:italic;font-size:12.5px;color:var(--ink-3)">${pour?'Every pour, and the wait after it':'The pressure, second by second'}</span>
      <span class="eyebrow" style="margin:0">Read the brew →</span>
    </span></button>`;
}
/* when the cup happened, corrected by hand (v7.31.6).
 *
 * Confirmed against a live account: Visualizer carries exactly one timestamp
 * per brew — the list's `clock` and the file's `start_time` are the same value
 * on every shot — and for an uploader that files after the fact that is when
 * the record was made, not when the coffee was poured. There is no second
 * field to read and no honest way to derive one, so it becomes what `agitation`
 * already is: a fact the instrument does not hold, left to the keeper to
 * state. The brew moves with the cup, so a re-brew starts from the same
 * moment and the two never disagree. */
function openCupWhen(cupId){
  const cup=cupById(cupId);if(!cup)return;
  const d=new Date(cup.at||cup.createdAt||Date.now());
  const pad=n=>String(n).padStart(2,'0');
  const local=`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  openSheet(`<h3>When was this cup?</h3>
  <div class="sub">Read off the instrument where one said so, and yours to correct where none did.</div>
  <label class="f"><span class="l">Poured</span><input type="datetime-local" id="cw_at" value="${esc(local)}"></label>
  <button class="btn btn-primary" onclick="saveCupWhen('${cup.id}')">Save</button>
  <button class="btn btn-quiet" onclick="closeSheet()">Cancel</button>
  <div class="note">A scale files a brew when it syncs, not when you poured it, and most of them state no other time — so this is the one figure on the page an instrument can be wrong about. The journal reads in this order.</div>`);
}
function saveCupWhen(cupId){
  const cup=cupById(cupId);if(!cup)return;
  const v=val('cw_at');
  if(!v){toast('Name a date and a time');return}
  const t=new Date(v);
  if(isNaN(t)){toast("That date didn't read");return}
  const was=cup.at;
  cup.at=t.toISOString();cup.updatedAt=new Date().toISOString();
  // the brew it was read from moves with it — a re-brew starts from the same
  // moment, and the two records never state different afternoons
  const brew=cup.brewRef?brewById(cup.brewRef):null;
  if(brew)brew.at=cup.at;
  save();closeSheet();render();
  toast('Moved to '+fmtWhenLong(cup.at)+'.',()=>{
    cup.at=was;if(brew)brew.at=was;save();render();
  },'Undo');
}
// putting a cup away from its own screen leaves nothing to stand on — the
// journal is where it lands, with the undo still one tap away in the toast
function putAwayCup(id){pageView=null;tab='journal';putAway('cups',id)}
/* ============ a café — its own streets, its menu, and your cups there ============ */
function vCafe(id){
  const p=placeById(id);
  if(!p)return `<div class="pad" style="padding-top:26px"><div class="empty">That café isn't on the record.</div></div>`;
  const cups=live('cups').filter(c=>c.kind==='bar'&&c.placeRef===p.id).sort(byWhen);
  const scored=cups.filter(c=>c.score!=null);
  const a=scored.length?scored.reduce((s,c)=>s+c.score,0)/scored.length:null;
  const menus=D.menus.filter(m=>m.placeRef===p.id).sort(byNew);
  const menu=menus[0];
  const pos=placed([p]).length;
  return `<div>
    <div style="position:relative">
      ${pos?streetsHTML([p],{boxStyle:'height:286px',zoom:16,still:true,attribLift:26,scoreOf:()=>1})
          :'<div class="mapbox" style="height:150px"></div>'}
      <div class="fade top" style="height:96px;z-index:3"></div>
      ${backMiniHTML('overlay','left:18px;top:18px',true)}
    </div>
    <div class="lift pad" style="padding-top:20px">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:16px">
        <div style="min-width:0">
          <div class="eyebrow" style="margin-bottom:5px">${esc(p.neighborhood||p.city||'A café')}</div>
          <div class="display big" style="margin:0">${esc(p.name)}</div>
        </div>
        <div style="flex:none;text-align:right">
          <div class="bigscore" style="font-size:38px">${a==null?'—':a.toFixed(1)}</div>
          <div class="ofnine">${cups.length===1?'1 cup':cups.length+' cups'}</div>
        </div>
      </div>
      ${placeBranchHTML(p)}
      <button class="btn" style="margin:22px 0 8px;min-height:50px;background:var(--fill-strong);color:var(--text-on-fill);border:1px solid var(--fill-strong)" onclick="openDoorAt('${p.id}')">＋ Log a cup here</button>
      ${menu?`<div class="shead"><span class="l">What they're pouring</span><span class="r">${esc(fmtWhen(menu.createdAt))}</span></div>
        <button class="rowlink" style="padding:0 0 10px;border:0" onclick="openMenuScreen('${menu.id}')">
          <span class="m">${menu.items.length} line${menu.items.length===1?'':'s'} on the board</span>
          <span class="go">The menu →</span></button>
        ${menu.items.map((it,i)=>{
          const linked=it.coffeeRef?coffeeById(it.coffeeRef):null;
          return `<button class="lrow" style="min-height:52px" onclick="${linked?`openCoffeeDetail('${linked.id}')`:`menuItemLogCup('${menu.id}',${i})`}">
            <span class="mid"><span class="t" style="font-size:17px">${esc(it.name||it.text)}</span>
            <span class="m">${esc([it.roaster,it.roastLevel].filter(Boolean).join(' · ')||it.text)}</span></span>
            <span class="eyebrow" style="margin:0;flex:none">${linked?'On the shelf':'Log it'}</span></button>`;
        }).join('')}`
        :`<div class="shead"><span class="l">What they're pouring</span></div>
          <div class="muted" style="padding:14px 0">No menu captured here yet.</div>`}
      <div class="btnrow" style="margin-top:14px">
        <button class="btn btn-quiet" onclick="openMenuCapture('${p.id}')">${menu?'Capture a new menu':'＋ Add a menu'}</button>
        <button class="btn btn-quiet" onclick="sharePlaceCard('${p.id}')">Share this café</button>
      </div>
      ${menus.length>1?`<details class="more" style="margin-top:12px"><summary>Earlier menus (${menus.length-1})</summary>
        ${menus.slice(1).map(m=>`<button class="lrow" onclick="openMenuPage('${m.id}')"><span class="mid"><span class="t" style="font-size:17px">${esc(fmtWhen(m.createdAt))}</span><span class="m">${m.items.length} item${m.items.length===1?'':'s'}</span></span><span class="go">→</span></button>`).join('')}
        </details>`:''}
      <div class="shead"><span class="l">Your cups here</span><span class="r">${cups.length?esc(fmtWhen(cups[0].at)):''}</span></div>
      ${cups.length?cups.map(c=>`<button class="lrow" style="min-height:56px" onclick="openCupDetail('${c.id}')">
          <span class="mid"><span class="t" style="font-size:17px">${esc(coffeeLabel(coffeeById(c.coffeeRef)))}</span>
          <span class="m">${esc(fmtWhen(c.at))}</span></span>
          <span class="sc${c.score==null?' none':''}" style="font-size:24px">${c.score==null?'—':c.score}</span></button>`).join('')
        :'<div class="muted" style="padding:14px 0">Nothing logged here yet.</div>'}
    </div></div>`;
}

/* ============ the shelf ============ */
function coffeeRowHTML(c,noteHTML){
  return `<button class="lrow" onclick="openCoffeeDetail('${c.id}')">
    <span class="mid"><span class="t">${esc(coffeeLabel(c))}</span><span class="m">${esc(originLine(c))}${noteHTML?' · '+esc(noteHTML):''}</span></span>
    <span class="go">→</span></button>`;
}
// a coffee on hand, with the two things you actually do with one: dial it in,
// or walk out to where it came from
function shelfRowHTML(c){
  const note=restState(c)||takenHomeNote(c);
  const country=c.origin&&c.origin.country;
  return `<div style="border-bottom:1px solid var(--line);padding:16px 0">
    <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:14px">
      <button style="min-width:0;flex:1;text-align:left;background:none;border:0;padding:0;color:var(--ink);cursor:pointer" onclick="openCoffeeDetail('${c.id}')">
        <span class="eyebrow" style="display:block;margin:0 0 4px">${esc(c.roaster||'No roaster named')}</span>
        <span style="display:block;font-family:var(--serif);font-size:19px;line-height:1.25">${esc(c.name||'Unnamed coffee')}</span>
        ${originLine(c)?`<span style="display:block;font-family:var(--sans);font-size:12.5px;color:var(--ink-3);margin-top:4px">${esc(originLine(c))}</span>`:''}
      </button>
      ${note?`<span class="dchip" style="flex:none;white-space:nowrap">${esc(note)}</span>`:''}
    </div>
    <div class="btnrow" style="margin-top:14px">
      <button class="btn btn-quiet" onclick="openBrewFlow('${c.id}')">Dial it in</button>
      ${country?`<button class="btn btn-quiet" style="flex:none;width:auto;padding:0 15px;border-color:var(--line);color:var(--ink-3)" onclick="openCountryChapter(${jsq(country)})">Country →</button>`:''}
    </div>
  </div>`;
}
// one cup of this coffee, read against the others rather than counted
// (ROADMAP.md Phase 23) — home and café both, newest first, each stating
// where it actually happened: a café cup names the place (reachable from
// its own screen, `openCupDetail` → `vCup` → `openCafeScreen`), a home cup
// its Setup and technique. No average, no rank — the taste model's own
// "a figure travels with its reasons" turned toward one coffee.
function coffeeCupRowHTML(cup,coffee){
  const place=cup.kind==='bar'?placeById(cup.placeRef):null;
  const brew=cup.brewRef?brewById(cup.brewRef):null;
  const setup=brew?setupById(brew.setupId):null;
  const title=cup.kind==='bar'?(place?place.name:'A café')
    :(setup?(setup.name||[setup.grinder,setup.brewer].filter(Boolean).join(' · ')):'Home brew');
  const meta=(cup.kind==='bar'?[place&&(place.neighborhood||place.city),fmtWhen(cup.at)]:[brew&&brew.technique,fmtWhen(cup.at)])
    .filter(Boolean).join(' · ');
  const lead=cupLeadHTML(cup,coffee);
  return `<button class="lrow" onclick="closeSheet();openCupDetail('${cup.id}')">
    ${lead}
    <span class="mid"><span class="t">${esc(title)}</span><span class="m">${esc(meta)}</span></span>
    <span class="sc${cup.score==null?' none':''}">${cup.score==null?'—':cup.score}</span></button>`;
}
function openCoffeeDetail(id){
  const c=coffeeById(id);if(!c)return;
  const cups=D.cups.filter(x=>x.coffeeRef===id).sort(byWhen);
  const rest=restState(c);
  openSheet(`<h3>${esc(coffeeLabel(c))}</h3>
  ${originLine(c)?`<div class="sub">${esc(originLine(c))}</div>`:''}
  <div class="card">
    ${c.roastDate?`<div class="kv"><span class="k">Roasted</span><span class="v">${esc(c.roastDate)}${rest?' · '+esc(rest):''}</span></div>`:''}
    ${c.notes?`<div class="kv"><span class="k">Notes</span><span class="v">${esc(c.notes)}</span></div>`:''}
  </div>
  ${c.home?'':'<div class="muted small" style="margin:-4px 2px 12px">Tasted, not yet on the shelf.</div>'}
  <div class="eyebrow" style="margin:20px 2px 10px">${cups.length?`Cups so far · ${cups.length}`:'No cups yet'}</div>
  ${cups.map(cup=>coffeeCupRowHTML(cup,c)).join('')}
  <button class="btn btn-primary" onclick="closeSheet();openBrewFlow('${id}')">Brew it</button>
  <button class="btn btn-quiet" onclick="closeSheet();openCafeCup('${id}')">Had it at a café</button>
  ${growerOf(c)&&c.origin.country?`<button class="btn btn-quiet" onclick="closeSheet();openProducerPage(${jsq(c.origin.country)},${jsq(growerOf(c))},${jsq(regionOf(c))})">The farm →</button>`:''}
  ${regionOf(c)&&c.origin.country?`<button class="btn btn-quiet" onclick="closeSheet();openRegionChapter(${jsq(c.origin.country)},${jsq(regionOf(c))})">The region →</button>`:''}
  ${c.origin&&c.origin.country?`<button class="btn btn-quiet" onclick="closeSheet();openCountryChapter(${jsq(c.origin.country)})">The country →</button>`:''}
  ${c.home?'':`<button class="btn btn-quiet" onclick="takeItHome('${id}');closeSheet()">Take it home</button>`}
  <button class="btn btn-quiet" onclick="closeSheet();openCoffeeForm('${id}')">Edit</button>
  <button class="btn btn-quiet" onclick="closeSheet();shareCoffeeCard('${id}')">Share this coffee</button>
  ${c.archived
    ?`<button class="btn btn-quiet" onclick="restore('coffees','${id}');closeSheet()">Restore</button>`
    :`<button class="btn btn-quiet" onclick="putAway('coffees','${id}');closeSheet()">Put away</button>`}`);
}
// café cup → shelf card, one tap (ROADMAP.md Phase 4): a coffee only tasted
// at a café isn't on the shelf until this says it is — a brew always is.
function takeItHome(coffeeId){
  const c=coffeeById(coffeeId);if(!c||c.home)return;
  c.home=true;c.homeAt=new Date().toISOString();c.updatedAt=c.homeAt;
  save();render();toast('Added to the shelf — brew it whenever.');
}
// a fact the shelf already knows and used to say nothing about (ROADMAP.md
// Phase 11) — homeAt is stamped only by the café-to-shelf bridge above, so
// this never fires for a coffee that started home (door/form): those were
// never "taken home" from somewhere else, and a brew there is the ordinary
// next step, not a stall worth a line about.
const TAKEN_HOME_QUIET_DAYS=7;
function takenHomeNote(c){
  if(!c.home||!c.homeAt)return '';
  if(D.brews.some(b=>b.coffeeRef===c.id))return '';
  const days=Math.floor((Date.now()-new Date(c.homeAt))/864e5);
  if(days<TAKEN_HOME_QUIET_DAYS)return '';
  return 'not brewed yet';
}
/* the invitation, on the Shelf since the door was cut back to one leaf — shown
 * only while the machine isn't known yet, and never as a nudge: it states what
 * the machine already keeps and what reading it would cost. It is about your
 * machine and your brews, and nothing about it is geography, which is why it
 * is no longer on the Atlas. The typed door stands beside it, since a
 * pour-over leaves no shot file. */
function atHomeSlabHTML(anythingAbove){
  if(visualizerEmail())return '';
  const home=live('cups').filter(c=>c.kind==='home').length;
  return `<div class="shead"${anythingAbove?'':' style="margin-top:8px"'}><span class="l">At home</span>
    <span class="r">${home?`${words(home)} cup${home===1?'':'s'} measured`:'nothing measured yet'}</span></div>
    <div class="lede" style="margin-top:14px">Your machine keeps every brew it makes. Carta can read them, and then a cup at home costs you one tap and a number.</div>
    <button class="btn btn-quiet" onclick="openVisualizerKey()">Connect Visualizer</button>
    <div style="text-align:center;margin-top:14px"><button class="qlink" onclick="openHomeDoor()">Or type a brew yourself</button></div>`;
}
function vShelf(){
  const items=live('coffees').filter(c=>c.home).sort(byNew);
  const archived=D.coffees.filter(c=>c.archived&&c.home);
  return `<div>
  <header class="shdr" style="display:block">
    <div class="eyebrow" style="margin-bottom:6px">The shelf</div>
    <div class="display" style="margin:0">What you've <em>got</em></div>
  </header>
  <div class="pad" style="padding-top:8px">
    ${items.length?items.map(shelfRowHTML).join(''):'<div class="empty">Nothing on the shelf yet. A home brew lands here on its own — or take a café coffee home from its cup.</div>'}
    ${archived.length?`<details class="more" style="margin-top:10px"><summary>Put away (${archived.length})</summary>${archived.map(c=>coffeeRowHTML(c)).join('')}</details>`:''}
    ${atHomeSlabHTML(items.length||archived.length)}
    <div class="btnrow" style="margin-top:20px">
      <button class="btn btn-quiet" onclick="openCoffeeForm()">＋ Add a coffee</button>
      <button class="btn btn-quiet" onclick="openImportCard()">Import a card</button>
    </div>
    <div class="shead"><span class="l">The record itself</span><span class="r">${esc(exportedLine().toLowerCase().replace(/\.$/,''))}</span></div>
    <button class="lrow" style="min-height:58px" onclick="openRecord()">
      <span class="mid"><span class="t" style="font-size:17px">Your record</span>
      <span class="m">${esc(recordMetaLine())}</span></span>
      <span class="go">→</span></button>
  </div></div>`;
}

/* ============ your record — the whole of it, and every door out of it ============
 * Everything the keeper owns and everything that carries it: what the record
 * amounts to, the backup that is a file in their hand rather than a promise
 * someone made them, what can be read in, what can be sent out, the instrument
 * it was all written on, and classic with the lights still on.
 */

/* ============ durability (ROADMAP.md Phase 8) — the record's one safety net ============
 * Carta is one device, one localStorage key, zero sync, by design
 * (ARCHITECTURE.md §3) — right for a hobby, but it means the whole journal's
 * durability has rested on a habit nobody was ever asked to form. Quiet and
 * factual, never urgency theater: a stated fact on the Shelf, the same
 * register as a coffee's own rest window. */
function weeksSince(iso){return Math.floor(Math.floor((Date.now()-new Date(iso))/864e5)/7)}
function exportedLine(){
  const at=getPref('exportedAt',null);
  if(!at)return 'Never backed up yet.';
  const w=weeksSince(at);
  if(w<1)return 'Backed up this week.';
  return `Last backed up — ${w} week${w===1?'':'s'} ago.`;
}
function exportLedgerJSON(){
  const stamp=new Date().toISOString().slice(0,10);
  downloadBlob(new Blob([JSON.stringify(D,null,2)],{type:'application/json'}),`carta-${stamp}.json`);
  setPref('exportedAt',new Date().toISOString());
  render();
  toast('Backed up — saved to your downloads.');
}
const AUTO_EXPORT_DAYS=14;   // a fortnight between quiet backups, opt-in only
function maybeAutoExport(){
  if(!getPref('autoExport',false))return;
  const at=getPref('exportedAt',null);
  const days=at?Math.floor((Date.now()-new Date(at))/864e5):Infinity;
  if(days>=AUTO_EXPORT_DAYS)exportLedgerJSON();
}
// a rough, conservative measure of what this origin has already spent in
// localStorage — most browsers cap it near 5MB; warn well before a write
// actually fails, not only after (save()'s own catch stays the last line of
// defense, not the first)
const STORAGE_SOFT_LIMIT=4.5*1024*1024;
function storageUsedBytes(){
  let used=0;
  try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);used+=(k.length+(localStorage.getItem(k)||'').length)}}catch(e){}
  return used*2;   // UTF-16 — the unit a browser's quota actually counts against
}
function lowStorageNoteHTML(){
  return `<div class="note">Storage is getting full. <span class="text-action" onclick="exportLedgerJSON()">Back up now</span> to be safe.</div>`;
}

function recordMetaLine(){
  const cups=live('cups').length,coffees=live('coffees').length;
  return `${words(cups)} cup${cups===1?'':'s'} · ${words(coffees)} coffee${coffees===1?'':'s'} · on this device only`;
}
const setupBrews=id=>D.brews.filter(b=>b.setupId===id).sort(byNew);
function setupAvg(id){
  const ids=new Set(setupBrews(id).map(b=>b.id));
  return avgOf(live('cups').filter(c=>c.brewRef&&ids.has(c.brewRef)));
}
function fmtBytes(n){
  if(n<1024)return `${n} B`;
  if(n<1024*1024)return `${Math.round(n/1024)} KB`;
  return `${(n/1024/1024).toFixed(1)} MB`;
}
function vRecord(){
  const cups=live('cups'),coffees=live('coffees'),places=live('places'),setups=live('setups');
  const first=cups.slice().sort((a,b)=>String(a.at).localeCompare(String(b.at)))[0];
  const shelf=coffees.filter(c=>c.home).length;
  const cities=knownCities().length;
  const lead=setups.map(s=>({s,a:setupAvg(s.id)})).filter(x=>x.a!=null).sort((x,y)=>y.a-x.a)[0];
  return `<div>
    <header class="shdr" style="display:block">
      ${backHTML()}
      <div class="eyebrow" style="margin-bottom:4px">Yours, on this device</div>
      <div class="display" style="font-size:1.5rem;margin:0">Your record</div>
    </header>
    <div class="pad" style="padding-top:20px">
      ${ledgerHTML([
        ['Cups',cups.length?`${cups.length}${first&&first.at?` · since ${fmtMonth(first.at)}`:''}`:'none yet'],
        ['Coffees',coffees.length?`${coffees.length}${shelf?` · ${shelf} on the shelf`:''}`:'none yet'],
        ['Cafés',places.length?`${places.length}${cities?` · in ${words(cities)} cit${cities===1?'y':'ies'}`:''}`:'none yet'],
        ['Setups',setups.length?String(setups.length):'none yet'],
        ['On this device',fmtBytes(storageUsedBytes())],
      ])}

      <div class="shead"><span class="l">Keeping it</span><span class="r">${esc(exportedLine().toLowerCase().replace(/\.$/,''))}</span></div>
      <div class="lede" style="margin-top:12px">One device, no account, no sync. Nothing else has a copy of this — a backup is a file you hold, not a promise someone made you.</div>
      <button class="btn" style="min-height:48px;background:var(--fill-strong);color:var(--text-on-fill);border:1px solid var(--fill-strong)" onclick="exportLedgerJSON()">Back up my record</button>
      <label class="chk bare">
        <input type="checkbox" ${getPref('autoExport',false)?'checked':''} onchange="setPref('autoExport',this.checked)">
        <span class="bx" aria-hidden="true">&#10003;</span>
        <span class="muted" style="margin:0">Quietly back up every two weeks</span>
      </label>
      ${storageUsedBytes()>STORAGE_SOFT_LIMIT?lowStorageNoteHTML():''}

      ${/* v7.35.0, critique rec 6: Carta holds two credentials and had no
           settings home for either. The Visualizer login lived down here; the
           Anthropic key lived only inside the ask that needed it, so a keeper
           who wanted to check, replace or remove it had to start an errand to
           find it. Both stand together now, on the page that is already about
           what this device holds. */''}
      <div class="shead"><span class="l">The keys</span><span class="r">both on this device only</span></div>
      <button class="lrow" style="min-height:58px" onclick="openAskKey()">
        <span class="mid"><span class="t" style="font-size:17px">Ask Carta</span>
        <span class="m">${askKey()?esc(`a key on this device · ${askModel()}`):'no key yet — it powers the ask, the menu reader and coffee search'}</span></span>
        <span class="go">→</span></button>
      <button class="lrow" style="min-height:58px" onclick="openVisualizerKey()">
        <span class="mid"><span class="t" style="font-size:17px">Visualizer</span>
        <span class="m">${esc(visualizerEmail()?`${visualizerEmail()} · ${getPref('vizWatch',false)===true?'watching for a new brew':'read when you ask for it'}`:'no account on this device')}</span></span>
        <span class="go">→</span></button>

      <div class="shead"><span class="l">Reading something in</span></div>
      <button class="lrow" style="min-height:58px" onclick="openImportCard()">
        <span class="mid"><span class="t" style="font-size:17px">Import a card</span>
        <span class="m">a coffee or a café someone sent you</span></span><span class="go">→</span></button>
      <button class="lrow" style="min-height:58px" onclick="openClassicImport()">
        <span class="mid"><span class="t" style="font-size:17px">Import from classic</span>
        <span class="m">classic’s own export — read once, safe to read again</span></span><span class="go">→</span></button>
      <button class="lrow" style="min-height:58px" onclick="openRestoreBackup()">
        <span class="mid"><span class="t" style="font-size:17px">Restore from a backup</span>
        <span class="m">a file this Carta backed up — for a fresh install</span></span><span class="go">→</span></button>

      <div class="shead"><span class="l">Sending something out</span><span class="r">a page, not a link</span></div>
      <button class="lrow" style="min-height:58px" onclick="sharePassportCard()">
        <span class="mid"><span class="t" style="font-size:17px">The passport</span>
        <span class="m">${esc(`${words(Object.keys(tastedCountryMap()).length)} countr${Object.keys(tastedCountryMap()).length===1?'y':'ies'}, one page`)}</span></span><span class="go">→</span></button>
      ${knownYears().length?`<button class="lrow" style="min-height:58px" onclick="shareYearPick()">
        <span class="mid"><span class="t" style="font-size:17px">The year</span>
        <span class="m">${esc(yearMetaLine())}</span></span><span class="go">→</span></button>`:''}
      <button class="lrow" style="min-height:58px" onclick="pickCardSubject('coffee')">
        <span class="mid"><span class="t" style="font-size:17px">A coffee</span>
        <span class="m">carries its own data back in</span></span><span class="go">→</span></button>
      <button class="lrow" style="min-height:58px" onclick="pickCardSubject('place')">
        <span class="mid"><span class="t" style="font-size:17px">A café</span>
        <span class="m">carries its own data back in</span></span><span class="go">→</span></button>

      <div class="shead"><span class="l">The instrument</span></div>
      <button class="lrow" style="min-height:58px" onclick="openSetupsDoor()">
        <span class="mid"><span class="t" style="font-size:17px">Your Setups</span>
        <span class="m">${esc(setups.length?`${words(setups.length)}${lead?` · ${lead.s.name||'one'} leads at ${trimNum(lead.a)}`:''}`:'none named yet')}</span></span>
        <span class="go">→</span></button>

      <div class="box" style="margin-top:28px">
        <div class="eyebrow">Classic</div>
        <div class="lede" style="max-width:34ch;margin-bottom:14px">Carta 6.18, the previous app, kept whole and still working. A museum with the lights still on.</div>
        <a class="btn btn-quiet" href="classic/index.html" style="text-decoration:none;line-height:22px">Open classic</a>
      </div>

      ${/* rec 5: the release notes have been maintained since 7.0 and had no
           door at all. One here, always. */''}
      <button class="lrow" style="min-height:58px;margin-top:14px" onclick="openWhatsNew()">
        <span class="mid"><span class="t" style="font-size:17px">Carta 7 · v${APP_VERSION}</span>
        <span class="m">what changed in this turn</span></span><span class="go">→</span></button>
      <div class="note" style="margin-top:22px">Nothing is deleted outright. Put a cup or a coffee away and it leaves the working list, not the record.</div>
    </div></div>`;
}
/* v7.35.0, critique rec 5: the release notes above have been written and kept
 * since 7.0 and were reachable from nowhere at all — the whole record of what
 * changed, maintained and unread. This is the door: once on the version that
 * opens it, and any time from Your record afterwards. Never on a first open —
 * a keeper with nothing on the record does not need to be told what changed. */
function openWhatsNew(){
  setPref('lastSeenVersion',APP_VERSION);
  openSheet(`<h3>What’s new</h3>
  <div class="sub">Carta ${APP_VERSION}. The release notes were always written — now they have a door.</div>
  ${CHANGELOG.slice(0,3).map(e=>`<div style="border-bottom:1px solid var(--line);padding:14px 0">
    <div class="eyebrow" style="margin-bottom:6px">${e.v}</div>
    <div class="say" style="margin:0">${esc(e.d)}</div></div>`).join('')}
  <button class="btn btn-quiet" style="margin-top:16px" onclick="closeSheet()">Read later</button>
  <div class="note">Every release since 7.0 is on file — ${CHANGELOG.length} entries. This opens once per version, and any time from Your record.</div>`);
}
function yearMetaLine(){
  const y=knownYears()[0];
  const n=live('cups').filter(c=>c.at&&new Date(c.at).getFullYear()===y).length;
  return `${y} — ${words(n)} cup${n===1?'':'s'} so far`;
}
function shareYearPick(){
  const years=knownYears();
  if(!years.length)return;
  if(years.length===1){shareYearCard(years[0]);return}
  openSheet(`<h3>Which year?</h3>
  <div class="sub">A page for one year of the record.</div>
  ${years.map(y=>{
    const n=live('cups').filter(c=>c.at&&new Date(c.at).getFullYear()===y).length;
    return `<button class="rowlink" onclick="closeSheet();shareYearCard(${y})">
      <span><span class="t">${y}</span></span>
      <span class="m">${n} cup${n===1?'':'s'}</span></button>`;
  }).join('')}`);
}
// a card needs a subject, and the subject is picked from the record itself —
// never from a list of everything, only from what is actually kept
function pickCardSubject(kind){
  const list=kind==='coffee'?live('coffees').slice().sort(byNew):live('places').slice().sort(byNew);
  if(!list.length){toast(kind==='coffee'?'No coffees on the record yet.':'No cafés on the record yet.');return}
  openSheet(`<h3>${kind==='coffee'?'Which coffee?':'Which café?'}</h3>
  <div class="sub">A self-contained page, on Carta paper — the exact file that goes out.</div>
  ${list.map(x=>`<button class="rowlink" onclick="closeSheet();${kind==='coffee'?`shareCoffeeCard('${x.id}')`:`sharePlaceCard('${x.id}')`}">
    <span><span class="t">${esc(kind==='coffee'?coffeeLabel(x):x.name)}</span></span>
    <span class="m">${esc(kind==='coffee'?originLine(x):(x.city||''))}</span></button>`).join('')}`);
}

/* ============ a Setup — where a grind number is true, and nowhere else ============ */
function vSetups(){
  const setups=live('setups');
  return `<div>
    <header class="shdr" style="display:block">
      ${backHTML()}
      <div class="eyebrow" style="margin-bottom:4px">The instrument</div>
      <div class="display" style="font-size:1.5rem;margin:0">Your Setups</div>
    </header>
    <div class="pad" style="padding-top:20px">
      <div class="lede">The assembly, not the appliance. A grind number is true inside one Setup and nowhere else — change a burr, a basket, the water, and it is a new one.</div>
      ${setups.map(s=>{
        const n=setupBrews(s.id).length,a=setupAvg(s.id);
        return `<button class="lrow" onclick="openSetupScreen('${s.id}')">
          <span class="mid"><span class="t">${esc(s.name||'Unnamed Setup')}</span>
          <span class="m">${esc([s.grinder,`${words(n)} brew${n===1?'':'s'}`].filter(Boolean).join(' · '))}</span></span>
          <span class="sc${a==null?' none':''}">${a==null?'—':trimNum(a)}</span></button>`;
      }).join('')}
      <button class="btn btn-quiet" style="margin-top:18px" onclick="openSetupCreate()">＋ A new Setup</button>
      ${D.setups.filter(s=>s.archived).length?`<details class="more" style="margin-top:12px"><summary>Put away (${D.setups.filter(s=>s.archived).length})</summary>
        ${D.setups.filter(s=>s.archived).map(s=>`<button class="rowlink" onclick="openSetupScreen('${s.id}')"><span><span class="t">${esc(s.name||'Unnamed Setup')}</span></span><span class="go">→</span></button>`).join('')}
      </details>`:''}
    </div></div>`;
}
function vSetup(id){
  const s=setupById(id);
  if(!s)return `<div class="pad" style="padding-top:26px"><div class="empty">That Setup isn’t on the record.</div>
    <button class="btn btn-quiet" onclick="openRecord()">Back to your record</button></div>`;
  const brews=setupBrews(s.id);
  const scale=[s.grindMin,s.grindMax].filter(x=>x!=null).length===2
    ?`${s.grindMin} – ${s.grindMax}${s.grindStep!=null?` · step ${s.grindStep}`:''}`:'';
  const last=brews[0];
  return `<div>
    <header class="shdr" style="display:block">
      ${backHTML()}
      <div class="eyebrow" style="margin-bottom:4px">A Setup · ${esc(`${words(brews.length)} brew${brews.length===1?'':'s'}`)}</div>
      <div class="display" style="font-size:1.5rem;margin:0">${esc(s.name||'Unnamed Setup')}</div>
    </header>
    <div class="pad" style="padding-top:20px">
      <div class="lede">The assembly, not the appliance. A grind number is true inside this Setup and nowhere else — change a burr, a basket, the water, and it is a new one.</div>
      <div style="margin-top:18px">${ledgerHTML([
        ['Grinder',s.grinder||''],['Brewer',s.brewer||''],['Basket',s.basket||''],
        ['Papers',s.papers||''],['Water',s.water||''],['Grind scale',scale],
      ])}</div>

      <div class="shead" style="margin-bottom:0"><span class="l">The last brews on it</span>
        <span class="r">grind · dose · water · temp · time</span></div>
      ${brews.length?brews.slice(0,8).map(b=>{
        const cup=live('cups').find(c=>c.brewRef===b.id);
        const coffee=coffeeById(b.coffeeRef);
        const sc=cup&&cup.score!=null?cup.score:null;
        return `<div style="display:flex;align-items:center;justify-content:space-between;gap:12px;padding:13px 0;border-bottom:1px solid var(--line)">
          <span style="min-width:0">
            <span style="display:block;font-family:var(--serif);font-size:16px">${esc(coffeeLabel(coffee))}</span>
            <span class="num" style="display:block;font-size:12.5px;color:var(--ink-3);margin-top:3px;letter-spacing:.02em">${esc(brewLine(b)||'no dials on that one')}</span>
          </span>
          <span class="sc${sc==null?' none':''}">${sc==null?'—':sc}</span>
        </div>`;
      }).join(''):'<div class="empty">Nothing brewed on it yet.</div>'}
      <div class="note" style="max-width:36ch">Grind numbers never cross grinders, so this history never leaves this page. The next brew starts from the last one here.</div>

      ${last&&coffeeById(last.coffeeRef)?`<button class="btn btn-primary" style="margin-top:22px;min-height:50px" onclick="openBrewFlow('${last.coffeeRef}')">Begin from the last brew</button>`:''}
      <button class="btn btn-quiet" style="margin-top:8px;min-height:48px" onclick="openSetupForm('${s.id}')">Edit this Setup</button>
      ${s.archived
        ?`<button class="btn" style="margin-top:8px;min-height:48px;border:1px solid var(--line);color:var(--ink-3);background:none" onclick="restore('setups','${s.id}')">Restore this Setup</button>`
        :`<button class="btn" style="margin-top:8px;min-height:48px;border:1px solid var(--line);color:var(--ink-3);background:none" onclick="putAwaySetup('${s.id}')">Put away this Setup</button>`}
    </div></div>`;
}
// retiring the Setup you are standing on leaves nothing to stand on: the
// record is where it lands, with the undo still one tap away in the toast
// rec 7 · one decline set. A Setup was "retired" while everything else in the
// app is "put away", which read as two different fates for the same reversible
// move — and the undo in the toast says "Restore" either way.
function putAwaySetup(id){pageView=null;tab='shelf';putAway('setups',id);openRecord()}

/* ============ the dials — a screen, because a brew is not an errand ============
 * The same dial-in loop, given the room it always needed: the Setup it reads
 * against, the timer at 52px, four dials at 34px with 58×40 targets, and one
 * way out — to the cup. Ported whole from the sheet it used to be; only the
 * frame around it changed.
 */
function openBrewFlow(coffeeId,editId){
  const coffee=coffeeById(coffeeId);
  if(!coffee){toast('Pick a coffee first');return}
  closeSheet();
  openScreen('brew',coffeeId,{editId:editId||null});
}
function vBrew(coffeeId,view){
  const coffee=coffeeById(coffeeId);
  if(!coffee)return `<div class="pad" style="padding-top:26px"><div class="empty">That coffee isn't on the record.</div></div>`;
  const editId=(view&&view.editId)||'';
  const noSetup=!D.setups.length;
  const editing=editId?brewById(editId):null;
  const last=editing||D.brews.filter(b=>b.coffeeRef===coffeeId).sort(byNew)[0]||D.brews.slice().sort(byNew)[0];
  const setup=noSetup?null:(editing?setupById(editing.setupId):(last?setupById(last.setupId):D.setups[D.setups.length-1]));
  const setups=D.setups.filter(x=>!x.archived||(setup&&x.id===setup.id));
  const techs=[...new Set(D.brews.map(x=>x.technique).filter(Boolean))];
  const setupBand=noSetup
    ?`<label class="f"><span class="l">Your grinder <span class="opt">named once, remembered always</span></span><input type="text" id="n_grinder" placeholder="Encore, Ode, a hand mill"></label>
      <label class="f"><span class="l">Your brewer</span><input type="text" id="n_brewer" placeholder="V60 · 02"></label>`
    :setups.length>1
      ?`<label class="f"><span class="l">Setup</span><select id="b_setup" onchange="onSetupChange()">
        ${setups.map(x=>`<option value="${x.id}" ${setup&&x.id===setup.id?'selected':''}>${esc(x.name)}${x.archived?' · retired':''}</option>`).join('')}
        </select></label>`
      :`<input type="hidden" id="b_setup" value="${setup?setup.id:''}">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;border:1px solid var(--line);background:var(--surface-page);padding:12px 14px;margin-bottom:16px">
          <div style="min-width:0">
            <div class="eyebrow" style="margin:0">Setup</div>
            <div style="font-family:var(--serif);font-size:16px;margin-top:2px">${esc((setup&&(setup.name||[setup.grinder,setup.brewer].filter(Boolean).join(' · ')))||'—')}</div>
          </div>
          <span style="font-family:var(--sans);font-size:var(--s11);color:var(--ink-3);letter-spacing:.04em;max-width:15ch;text-align:right;line-height:1.4">grind reads true only inside this Setup</span>
        </div>`;
  return `<div>
    <header class="shdr" style="align-items:center;gap:14px;padding-bottom:14px">
      ${backMiniHTML('bare','flex:none')}
      <div style="flex:1;min-width:0">
        <div class="eyebrow" style="margin-bottom:4px">${esc(coffeeLabel(coffee))}</div>
        <div class="display" style="font-size:1.375rem;margin:0">${editing?'Correct the <em>brew</em>':(last?'Begin from the <em>last cup</em>':'The <em>first brew</em>')}</div>
      </div>
    </header>
    <div class="pad" style="padding-top:16px">
      ${setupBand}
      <label class="f"><span class="l">Technique <span class="opt">optional</span></span>
        <input type="text" id="b_technique" list="techlist" value="${esc((last&&last.technique)||'')}" placeholder="V60 · Aeropress · espresso">
        <datalist id="techlist">${techs.map(t=>`<option value="${esc(t)}">`).join('')}</datalist></label>
      <button class="btn btn-quiet" style="margin-bottom:4px" onclick="openVisualizerPicker()">Pull from Visualizer</button>
      <div id="viz_picker"></div>
      ${editing?'':timerHTML()}
      <div class="dialrow">
        <div id="dialbox_grind">${grindDialHTML(setup,last?last.grind:20)}</div>
        ${dial('dose','Dose','g',last?last.doseG:18,0.1,0,null,1)}
        ${dial('water','Water','g',last?last.waterG:36,1,0,null,0)}
        <div id="dialbox_temp">${tempDialHTML(last?last.tempC:94)}</div>
      </div>
      ${dial('time','Time','',last?last.timeSec:28,1,0,null,0,{kind:'time'})}
      <button class="btn btn-primary" style="min-height:52px;margin-top:6px" onclick="saveBrewFlow('${coffeeId}','${editId}')">${editing?'Save changes':'To the cup →'}</button>
      ${editing?'':'<button class="btn btn-quiet" onclick="goBack()">Not now</button>'}
    </div></div>`;
}


/* ---- the seam. A `function` declaration in a classic script attaches itself
   to `window` already, so half of this list is documentation rather than
   plumbing — which is what every sibling's list has always been. The half that
   is genuinely load-bearing is `clearCupNos`, called by index.html's save().
   ---------------------------------------------------------------------- */
window.clearCupNos=clearCupNos;
window.exportLedgerJSON=exportLedgerJSON;
window.maybeAutoExport=maybeAutoExport;
window.openBrewFlow=openBrewFlow;
window.openWhatsNew=openWhatsNew;
window.vBrew=vBrew;
window.vCafe=vCafe;
window.vCup=vCup;
window.vJournal=vJournal;
window.vRecord=vRecord;
window.vSetup=vSetup;
window.vSetups=vSetups;
window.vShelf=vShelf;

window.ROOMS_VERSION='7.46.4';

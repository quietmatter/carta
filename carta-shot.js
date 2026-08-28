/* ============================================================================
     Visualizer (ROADMAP.md Phases 24-26) — the instrument reads itself in.

     Split out of index.html at v7.34.0, alongside carta-ask.js, for the
     reason recorded in ARCHITECTURE.md §1: the file stood 1,483 lines past
     the band, and the two largest coherent things in it that are not the
     record itself are the argument and this.

     What it holds is the whole read: the account (BYO Basic Auth, kept on the
     device), the calls, the pickers, the shot the Atlas offers unasked, and
     the four screens a shot has of its own -- station 04's plate, station 06's
     taste, station 08's list, and the Setup a shot can seed. The pure half is
     the file-reading itself: what Visualizer states, hunted across the names
     different writers actually use, stated-or-nothing and never guessed.

     Loaded from index.html's <head> with a plain <script src>, after
     carta-plate.js -- `parseVisualizerShot` reads the curve through the
     plate's own `shotCurve`/`shotPours`/`shotPreinfusion`, so the plate's
     globals must already be published. Everything else it needs from the app
     (`D`, `live`, `save`, `esc`, `render`, `toast`, the shot stores in
     index.html's own store block) it calls at runtime.

     The seam out is the list at the foot of this file. The stores themselves
     (`carta7.shots.v1`, `carta7.shotsread.v1`) deliberately stay in
     index.html's store block: they are localStorage plumbing, and
     ARCHITECTURE.md §3 documents the store as one place.
   ========================================================================== */

/* ==== pure ==== *
/* reading a Visualizer brew into Carta's own fields (Phases 24-26) — null or
 * '' wherever the file didn't state something, never guessed; label is a
 * picker's. The method comes off the curve rather than off a brewer's name:
 * a machine writes pressure and a scale does not, so the absence is stated by
 * the file rather than inferred from it (carta-plate.js). A pour-over's own
 * yield is the water it took, which is what its ratio is argued in — the
 * `drink_weight` a shot uses is what landed in the cup, and for a filter brew
 * those are two different figures. */
// the first of several keys that actually says something — the string half of
// the same best-effort hunt shotCurve does over the series
function firstStr(d,keys){
  for(let i=0;i<keys.length;i++){
    const v=d[keys[i]];
    if(typeof v==='string'&&v.trim())return v.trim();
  }
  return '';
}
function parseVisualizerShot(d){
  d=d||{};
  const num=v=>{if(v==null||v==='')return null;const n=Number(v);return isNaN(n)?null:n};
  const str=v=>(v||'').trim();
  const time=Number(d.duration);
  const roaster=str(d.bean_brand),coffeeName=str(d.bean_type);
  const curve=shotCurve(d);
  // '' where there is no curve to say: unknown, not espresso. `shotMethod`
  // still reads espresso at the point of use, so nothing downstream changes —
  // but a blank is fillable, and a wrong default was not.
  const method=curve?curve.method:'';
  // read across the file seam defensively: a plate that isn't there yet costs
  // this one figure, not the whole shot (v7.31.2)
  const pre=(method==='espresso'&&typeof shotPreinfusion==='function')?shotPreinfusion(curve):null;
  const pours=method==='pourover'&&curve?shotPours(curve):[];
  // the water a filter brew took: the most the scale ever read, not its last
  // sample. A real scale wobbles a tenth either way and can settle down a
  // little at the end, and the total poured is the high-water mark.
  const waterIn=curve&&curve.wIn
    ?Math.round(curve.wIn.reduce((a,b)=>b>a?b:a,curve.wIn[0])*10)/10:null;
  return {method,pours,
    dose:num(d.bean_weight),
    water:method==='pourover'?(num(d.drink_weight)!=null&&!waterIn?num(d.drink_weight):waterIn):num(d.drink_weight),
    time:isNaN(time)?null:Math.round(time),
    grind:num(d.grinder_setting),roaster,coffeeName,
    roastDate:normalizeRoastDate(d.roast_date),roastLevel:normalizeRoastLevel(d.roast_level),
    grinderModel:str(d.grinder_model),
    // `time` stays rounded — it fills a dial and a brew's timeSec, both whole
    // seconds since Phase 24. The plate states the figure at the precision the
    // file gave it, which is a tenth, so the exact reading is kept beside it.
    timeExact:isNaN(time)?null:time,
    // stated or nothing: both read `unread` on the plate's ledger wherever the
    // file stayed silent. The water is what the basket was told to hold —
    // Visualizer's own "basket temp goal" — read by shotTempGoal below.
    tempC:shotTempGoal(d),
    /* pre-infusion, preferring what the file states outright and falling back
     * to what its own pressure line says (v7.31.1). Visualizer carries a
     * `preinfusion` field on some shots and not on others, and the curve knew
     * all along: the fill holds at a low pressure and levels off before the
     * ramp, and that levelling-off is where pre-infusion ends. Reading it is
     * not the inference the honesty gate forbids — it is reading the series
     * the shot actually recorded, the same way the peak is read. Where the
     * profile ramps straight to nine bar there is no plateau and nothing is
     * stated. */
    preinfusionSec:num(d.preinfusion)!=null?num(d.preinfusion):(pre?pre.sec:null),
    preinfusionBar:pre?pre.bar:null,
    /* the machine, which Visualizer states and Carta was not reading — the
     * other half of the Setup a brew was made on, beside the grinder it
     * already read. Hunted across the plausible names rather than pinned to
     * one, the same way every other field here is: what writes a shot file
     * varies, and a key that isn't there simply reads `unread`. */
    machine:firstStr(d,['machine','espresso_machine','machine_name','device','machine_model']),
    // when it was actually poured, off the file rather than off the list row's
    // upload timestamp (v7.31.4)
    at:shotStartedAt(d),
    // the brewer, and the paper in it: it matters for a filter brew the way a
    // basket does for a shot. Stated or nothing, like everything else here.
    brewer:firstStr(d,['brewer','brewing_device','drink_type']),
    // the profile it was pulled on — a stated fact, and not the machine
    profile:str(d.profile_title),
    curve,
    label:[roaster,coffeeName].filter(Boolean).join(' — ')||'Untitled shot'};
}
/* when the brew actually happened, as the file itself states it.
 *
 * Until v7.31.4 the only date Carta had was `clock` off the *list* row, and
 * that is the record's own timestamp — for anything uploaded after the fact
 * (a scale-synced filter brew, a batch import) it is when it reached
 * Visualizer, not when it was poured. A keeper pulling a brew from Tuesday
 * saw it dated today, on the shot screen and on the cup written from it.
 *
 * So the payload is asked first, and asked for the brew's own start before
 * anything that looks like a record timestamp. A key that is not there is
 * skipped; if none of them says anything the list's `clock` still stands, so
 * this is strictly better than what it replaces and never worse.
 *
 * Both shapes are read — an epoch (seconds or milliseconds) and a date string
 * — and anything outside a plausible window is refused, which is what keeps a
 * duration or an elapsed-seconds scalar from being mistaken for a date. */
const SHOT_TIME_KEYS=['start_time','shot_start','started_at','brew_time','date','clock','timestamp'];
function tsToMs(v){
  if(v==null||v===''||Array.isArray(v)||typeof v==='object')return null;
  let ms=null;
  if(typeof v==='number'||/^\d+(\.\d+)?$/.test(String(v).trim())){
    const n=Number(v);
    if(!isFinite(n)||n<=0)return null;
    // seconds or milliseconds, told apart by magnitude rather than guessed
    ms=n>1e11?n:n*1000;
  }else{
    const t=Date.parse(String(v));
    if(isNaN(t))return null;
    ms=t;
  }
  // a coffee was not brewed in 1998, nor will it be brewed the week after
  // next: outside that, this was never a date
  if(ms<946684800000||ms>Date.now()+1728e5)return null;
  return ms;
}
function shotStartedAt(d){
  if(!d||typeof d!=='object')return null;
  const sources=[d,(d.data&&typeof d.data==='object')?d.data:{}];
  for(let si=0;si<sources.length;si++)for(let ki=0;ki<SHOT_TIME_KEYS.length;ki++){
    const ms=tsToMs(sources[si][SHOT_TIME_KEYS[ki]]);
    if(ms)return new Date(ms).toISOString();
  }
  return null;
}
/* the water, as the machine was told to hold it. Scalar where the file states
 * one, otherwise the goal series' own steady value — read across the shot's
 * body rather than its tails, since a goal series opens and closes at zero on
 * some writers. A goal that genuinely moves through the shot is left null. */
function shotTempGoal(d){
  if(!d||typeof d!=='object')return null;
  const sources=[d,(d.data&&typeof d.data==='object')?d.data:{}];
  // the last three are the column names Visualizer's own CSV export uses,
  // confirmed against a real export. The goal still leads: it is what the
  // machine was told to hold, which is what a keeper set and can repeat.
  const KEYS=['espresso_temperature_goal','temperature_goal','espresso_water_dispensed_temperature',
    'espresso_temperature_basket','temperature_basket','basket_temperature','temperature',
    'water_temperature_basket','water_temperature_in','water_temperature_boiler'];
  const ok=v=>isFinite(v)&&v>=50&&v<=110;   // a brew temperature, not a sensor's zero or a Fahrenheit reading
  for(let si=0;si<sources.length;si++)for(let ki=0;ki<KEYS.length;ki++){
    const v=sources[si][KEYS[ki]];
    if(v==null||v==='')continue;
    if(!Array.isArray(v)){const n=Number(v);if(ok(n))return Math.round(n*10)/10;continue}
    const body=v.map(Number).filter(ok);
    if(body.length<3)continue;
    const lo=body.reduce((a,b)=>b<a?b:a,body[0]),hi=body.reduce((a,b)=>b>a?b:a,body[0]);
    if(hi-lo>2)continue;                     // a ramping goal states no single figure
    return Math.round(((lo+hi)/2)*10)/10;
  }
  return null;
}
/* the curve, the plate's geometry and the brew's own figures all moved into
 * carta-plate.js at the Phase 26 second-method gate (ARCHITECTURE.md §1) —
 * `shotCurve`, `shotPours`, `shotFigures`, `shotMethod`, `platePaths`,
 * `shotAt` and `mmss` are read from there as plain globals, the same seam the
 * map layer publishes across. They stay pure and stay tested; the harness
 * evaluates that file's own pure block ahead of this one. */
// Visualizer's roast_level field is already known to BE a roast level, unlike a
// pasted bag's free text — so no "roast" adjacency, just the word (cf. parseRoastLevel).
function normalizeRoastLevel(s){
  const t=' '+fold(s||'')+' ';
  if(t.includes(' medium light '))return 'Medium-light';
  if(t.includes(' medium dark '))return 'Medium-dark';
  if(t.includes(' light '))return 'Light';
  if(t.includes(' dark '))return 'Dark';
  if(t.includes(' medium '))return 'Medium';
  return '';
}
// roast_date has no confirmed format — keep only a leading YYYY-MM-DD, never a guess
function normalizeRoastDate(s){const m=String(s||'').trim().match(/^(\d{4}-\d{2}-\d{2})/);return m?m[1]:'';}
// a Setup joins silently only on an exact grinder-and-brewer match — no
// asking, unlike a roaster or place (ROADMAP.md Phase 25); anything else is
// left to doorPullFinish. Grinder alone used to be enough, and it collided
// the moment one grinder fed two brewers: an espresso machine and a
// pour-over dripper sharing a burr are two different Setups by this app's
// own law ("the assembly, not the appliance"), but every shot off that
// grinder was silently landing on whichever Setup happened to be on the
// record first. A Setup that has never named a brewer still joins on the
// grinder alone, exactly as before — the widening only ever refuses a join
// it would otherwise have made wrongly, never invents one for less.
function matchSetupByGrinder(setups,grinderModel,brewer){
  if(!grinderModel)return null;
  const g=fold(grinderModel),b=fold(brewer||'');
  const hit=(setups||[]).find(s=>fold(s.grinder||'')===g&&fold(s.brewer||'')===b);
  return hit?hit.id:null;
}
// a filter brew's brewer is whichever of the two fields the file actually
// filled in: some writers put "Kalita Wave 185" under `machine`, because that
// is the only field they have for it
const brewerOf=shot=>(shot&&(shot.brewer||shot.machine))||'';
// what a keeper's own Visualizer shots say about the Setups behind them: a
// grinder paired with whatever brewer or machine rode beside it, newest
// first (the list already reads that way), deduped, and never repeating a
// Setup already on the record — the same exact-match rule matchSetupByGrinder
// keeps for the silent join, so a picker and a pulled shot never disagree
// about what counts as "already have one". A grinder-only or brewer-only
// shot still candidates; only a shot naming neither is worth nothing here.
function setupCandidatesFromShots(shots,setups){
  const seen=new Set(),out=[];
  (shots||[]).forEach(s=>{
    const grinder=(s&&s.grinderModel)||'',brewer=brewerOf(s);
    if(!grinder&&!brewer)return;
    if(grinder&&matchSetupByGrinder(setups||[],grinder,brewer))return;
    const key=fold(grinder)+'|'+fold(brewer);
    if(seen.has(key))return;
    seen.add(key);
    out.push({grinder,brewer,name:[grinder,brewer].filter(Boolean).join(' · ')});
  });
  return out;
}
/* ==== /pure ==== */
/* ============ Visualizer — pulled, not typed (ROADMAP.md Phase 24) ============
 * BYO Basic Auth, named for what it is in openVisualizerKey(): Visualizer's
 * docs want OAuth here, but that needs a fixed redirect URL and a safe place
 * for a client secret, neither of which a static app has. One tap, one brew,
 * no sweep, manual entry untouched underneath. No scalar temp field exists
 * (only curves), so the temp dial stays exactly as manual as it always was. */
const visualizerEmail=()=>getPref('visualizerEmail','');
const visualizerPassword=()=>getPref('visualizerPassword','');
const visualizerAuthHeader=()=>{
  const e=visualizerEmail(),p=visualizerPassword();
  return e&&p?'Basic '+btoa(`${e}:${p}`):null;
};
// station 02 (Phase 26): the same two fields, plus the one permission this
// phase adds — said in full, and what it costs, before either field is typed
function openVisualizerKey(){
  openSheet(`<h3>Your Visualizer account</h3>
  <div class="sub">Kept on this device only, sent to nobody but visualizer.coffee, and only when a shot is read. This is your real account login, not a separate key; Visualizer's own docs recommend against that for an app like Carta, and the tradeoff is yours to take.</div>
  <label class="f"><span class="l">Email</span><input type="text" id="viz_email" value="${esc(visualizerEmail())}" placeholder="you@example.com"></label>
  <label class="f"><span class="l">Password</span><input type="password" id="viz_password" value="${esc(visualizerPassword())}"></label>
  <label class="chk">
    <input type="checkbox" id="viz_watch" ${getPref('vizWatch',false)===true?'checked':''}>
    <span class="bx" aria-hidden="true">&#10003;</span>
    <span class="t"><b>Look for a new brew when Carta opens</b>
      <span>One call for your latest brew, on opening. Off, and the Atlas waits for you to ask for it.</span></span>
  </label>
  <div class="m" style="margin:2px 0 12px">Your login at <a class="text-action" style="color:var(--ink-2)" href="https://visualizer.coffee" target="_blank" rel="noreferrer">visualizer.coffee</a> — Carta reads brews with it and changes nothing there.</div>
  <div class="note">Unreachable, Visualizer costs you nothing: the door still opens on typing, and the brew can be pulled later — a brew file keeps.</div>
  <button class="btn btn-primary" style="margin-top:14px" onclick="saveVisualizerKey()">Save</button>
  ${visualizerEmail()?`<button class="btn btn-quiet" onclick="clearVisualizerKey()">Sign out of Visualizer</button>`:''}
  <div style="text-align:center;margin-top:14px"><button class="qlink" onclick="closeSheet()">Not now</button></div>`);
}
/* v7.35.0, critique rec 6: signing in used to be a dead end. Every Visualizer
 * errand — pull a brew at the door, read your recent brews, seed a Setup —
 * checked for an account, found none, opened this sheet and forgot what it had
 * been asked to do; saving the account dropped the keeper back where they
 * started, with the errand to begin again. The errand is held here and resumed
 * the moment the account is good for it. */
let _vizResume=null;
// called from inside an errand's own no-account guard, on the way to the sheet.
// Deliberately not a wrapper around the errand: a wrapper would have to be
// applied where the function is defined, and `doorPull` lives in index.html —
// which would make that file's evaluation depend on this one having loaded,
// the exact stale-sibling failure APP_VERSION's check exists to survive.
function vizResumeAfterSignIn(f){_vizResume=f}
function saveVisualizerKey(){
  const w=document.getElementById('viz_watch');
  setPref('visualizerEmail',val('viz_email'));setPref('visualizerPassword',val('viz_password'));
  setPref('vizWatch',!!(w&&w.checked));
  closeSheet();render();toast('Saved — on this device only.');
  if(_vizResume&&visualizerAuthHeader()){const f=_vizResume;_vizResume=null;setTimeout(f,60)}
}
function clearVisualizerKey(){
  setPref('visualizerEmail','');setPref('visualizerPassword','');setPref('vizWatch',false);
  _vizWaiting=null;_shots={busy:false,rows:null,error:null,scope:'all'};_vizCache={};
  // signing out takes the shots read with it — "the account is off this
  // device" has to be true of what was read off it, not just the password.
  // A cup already written keeps its own curve (CURVES_KEY): that one belongs
  // to the record, not to the account.
  _shotsReadCache={};try{localStorage.removeItem(SHOTSREAD_KEY)}catch(e){}
  closeSheet();render();toast('Signed out. The account is off this device.');
}
const VISUALIZER_BASE='https://visualizer.coffee/api/shots';
async function callVisualizer(path){
  const auth=visualizerAuthHeader();if(!auth)throw new Error('Set your Visualizer account first.');
  const r=await fetch(VISUALIZER_BASE+path,{headers:{'Authorization':auth}});
  // a status code is not a sentence. What the keeper needs to know is whether
  // anything changed (it didn't) and whether trying again is worth it (it is).
  if(!r.ok)throw new Error(r.status===401
    ?"Visualizer didn't recognize that email or password."
    :"Visualizer didn't answer. Nothing changed — try again in a moment.");
  return r.json();
}
function applyVisualizerShot(shot){['dose','water','time','grind'].forEach(k=>{if(shot[k]!=null)setDial(k,shot[k])});}
// shared by both pickers (dial-in's, door's — Phase 25): the list route only
// names {clock,id}, so each shot's essentials are fetched in parallel, capped at n.
/* the list, and what it does with a shot it could not read. That `catch` used
 * to return null and say nothing, so a shot Carta threw on simply vanished —
 * and a list where every shot vanished read as "no brews on your account",
 * which is a different and much more alarming claim than the truth. It counts
 * them now (`_shots.unread`) and the screen says which it means. */
async function fetchVisualizerShots(n){
  const list=(await callVisualizer(`?page=1&items=${n}`)).data||[];
  let unread=0;
  const rows=(await Promise.all(list.map(async s=>{
    try{return {...parseVisualizerShot(await callVisualizer(`/${s.id}/download`)),clock:s.clock,id:s.id}}
    catch(e){unread++;return null}
  }))).filter(Boolean);
  rows.unread=unread;rows.listed=list.length;
  return rows;
}
function vizShotRowHTML(r,onclickFn){
  return `<button class="lrow" onclick="${onclickFn}('${r.id}')"><span class="mid"><span class="t">${esc(r.label)}</span><span class="m">${esc([r.time?fmtTime(r.time):'',fmtWhen(new Date(r.clock*1000).toISOString())].filter(Boolean).join(' · '))}</span></span></button>`;
}
let _vizBusy=false,_vizShots=[];
async function openVisualizerPicker(){
  if(_vizBusy)return;
  if(!visualizerAuthHeader()){vizResumeAfterSignIn(openVisualizerPicker);openVisualizerKey();return}
  const box=document.getElementById('viz_picker');if(!box)return;
  _vizBusy=true;
  box.innerHTML='<div class="muted small" style="margin-top:8px">Reading your brews…</div>';
  try{
    const rows=await fetchVisualizerShots(8);
    _vizShots=rows;
    box.innerHTML=rows.length?rows.map(r=>vizShotRowHTML(r,'vizShotPicked')).join('')
      :'<div class="muted small" style="margin-top:8px">No brews on your account yet.</div>';
  }catch(e){
    box.innerHTML=`<div class="muted small" style="margin-top:8px">${esc((e&&e.message)||'Could not reach Visualizer.')}</div>
      <button class="btn btn-quiet mini" style="margin-top:10px;min-height:36px" onclick="openVisualizerPicker()">Try again</button>`;
  }
  _vizBusy=false;
}
function vizShotPicked(id){
  const shot=_vizShots.find(s=>s.id===id);if(!shot)return;
  applyVisualizerShot(shot);
  const box=document.getElementById('viz_picker');
  if(box)box.innerHTML='<div class="muted small" style="margin-top:8px">Filled from Visualizer — temperature isn\'t part of a shot\'s record, so set that by hand.</div>';
}
/* ============ a Setup from Visualizer (Phase 26 amendment, v7.32.0) ============
 * The primary door onto a new Setup, wherever one is added from — the record's
 * own "＋ A new Setup" and the empty Setups door both lead here first when
 * there's an account to read. Same fetch as the picker above (fetchVisualizerShots,
 * capped at 8), so this opens no network surface the app didn't already have —
 * it reads what a handful of recent shots already say about the gear behind
 * them instead of asking the keeper to type it. Unreachable, or nothing found,
 * and "Type it in instead" reaches the exact blank form this always could. */
let _setupCandidates=[];
async function openSetupImport(){
  if(!visualizerAuthHeader()){vizResumeAfterSignIn(openSetupImport);openVisualizerKey();return}
  openSheet(`<h3>A Setup from Visualizer</h3>
  <div class="sub">Read off your own brews — the grinder, and whatever machine or brewer rode beside it. Nothing else a Setup carries is in a brew file, so the rest stays yours to add.</div>
  <div id="setup_import"><div class="muted small" style="margin-top:8px">Reading your brews…</div></div>
  <div style="text-align:center;margin-top:14px"><button class="qlink" onclick="openSetupForm()">Type it in instead</button></div>`);
  await loadSetupCandidates();
}
async function loadSetupCandidates(){
  const box=document.getElementById('setup_import');if(!box)return;
  try{
    const rows=await fetchVisualizerShots(8);
    _setupCandidates=setupCandidatesFromShots(rows,live('setups'));
    box.innerHTML=_setupCandidates.length
      ?_setupCandidates.map((c,i)=>`<button class="lrow" onclick="setupCandidatePicked(${i})">
          <span class="mid"><span class="t">${esc(c.name)}</span>
          <span class="m">seen on your Visualizer account</span></span></button>`).join('')
      :'<div class="muted small" style="margin-top:8px">Nothing new on your last brews — every grinder there already has a Setup, or none of them said one.</div>';
  }catch(e){
    box.innerHTML=`<div class="muted small" style="margin-top:8px">${esc((e&&e.message)||'Could not reach Visualizer.')}</div>
      <button class="btn btn-quiet" style="margin-top:12px" onclick="loadSetupCandidates()">Try again</button>`;
  }
}
function setupCandidatePicked(i){
  const c=_setupCandidates[i];if(!c)return;
  openSetupForm(null,c);
}

/* ============ the shot comes to you (ROADMAP.md Phase 26) ============
 * Phases 24–25 made a shot pullable — a quiet second button three taps down
 * the door. This makes it the road: the Atlas offers the cup before it is
 * asked for, the shot is read as a plate rather than a row of dials, and
 * typing a brew steps off the main path to the Journal without losing a
 * field. Everything downstream still works with the watch off — station 08
 * is one tap from the Journal, and the shot screen is reachable from it. */
// a shot is not a record: it is read, written into a cup, and let go of. The
// cache is this session's, keyed by the shot's own Visualizer id.
let _vizCache={},_vizWaiting=null,_vizChecked=false,_vizCheckedAt=0;
/* "Not now" (below) is meant to hold for the session, not for the ~90s
 * VIZ_RESUME_GAP a phone crosses every time it locks or the keeper glances at
 * another app. In-memory only, on purpose — it is exactly as durable as
 * `_vizChecked` beside it, and a real reload asks fresh, same as the comment
 * on snoozeWaitingShot already promised ("offered again on the next open"). */
let _snoozedShotIds=new Set();
function cacheShot(s){if(s&&s.id!=null)_vizCache[String(s.id)]=s;return s}
// the curve is what ensureShotCurve is guarding on, so a shot that arrived
// with one never asks for it twice — nothing more is needed to hold that.
// Missing this sitting's cache is not missing the shot: a shot once opened
// lives in the durable store too, and warms _vizCache back in from there —
// every call site downstream (the plate, "This is the cup →") reads through
// this one function, so nothing else needed to learn about the fallback.
function vizShotById(id){
  if(id==null)return null;
  const key=String(id),cached=_vizCache[key];
  if(cached)return cached;
  const read=readShotRead(key);
  return read?cacheShot({...read}):null;
}
const vizDismissed=()=>getPref('vizDismissed',[])||[];
// the cup a shot was already written into — the one thing that keeps a shot
// from ever coming back to the hero, and what puts a score on its row
function cupOfShot(id){return id==null?null:live('cups').find(c=>c.vizShotId!=null&&String(c.vizShotId)===String(id))||null}
/* the one new outbound touch this phase adds (ARCHITECTURE.md §7): one list
 * call for the latest shot on opening, then one download for that shot, and
 * only if the keeper turned the watch on in station 02. One call per app
 * open — never a poll, never a sweep — and `_vizChecked` is what holds that
 * against a render() ever firing it again. Unreachable, the Atlas paints its
 * ordinary hero and says nothing at all. */
async function vizCheckOnOpen(){
  if(_vizChecked)return;_vizChecked=true;_vizCheckedAt=Date.now();
  if(getPref('vizWatch',false)!==true||!visualizerAuthHeader())return;
  try{
    const head=((await callVisualizer('?page=1&items=1')).data||[])[0];
    if(!head||head.id==null)return;
    if(vizDismissed().some(x=>String(x)===String(head.id)))return;
    if(_snoozedShotIds.has(String(head.id)))return;
    if(cupOfShot(head.id))return;
    const shot=cacheShot(Object.assign(parseVisualizerShot(await callVisualizer(`/${head.id}/download?essentials=true`)),
      {clock:head.clock,id:head.id}));
    _vizWaiting=shot;
    // the hero is the Atlas's, so a shot that lands while a screen is open or
    // another room is showing simply waits there: render() only needs to run
    // where the branch it feeds is actually on the screen.
    const paint=()=>{if(!pageView&&tab==='atlas'&&waitingShot())render()};
    paint();
    ensureShotCurve(shot).then(paint);
  }catch(e){/* degrades to nothing, by design — the hero simply doesn't change */}
}
const VIZ_RESUME_GAP=90e3;
function vizCheckOnResume(){
  if(document.visibilityState!=='visible')return;
  if(Date.now()-_vizCheckedAt<VIZ_RESUME_GAP)return;
  if(_vizWaiting)return;              // a cup is already waiting; asking again would only replace it
  _vizChecked=false;vizCheckOnOpen();
}
document.addEventListener('visibilitychange',vizCheckOnResume);
window.addEventListener('pageshow',vizCheckOnResume);
// when a cup is poured for someone else, or the machine was run to flush it.
// Honest and permanent: the id is kept so the hero never offers it again.
/* "Not now" on the door — a snooze, not a verdict. dismissShot below is the
 * other answer to the same brew and says something much stronger ("not
 * mine"): it writes the id into the vizDismissed pref, drops the kept read
 * and the cache with it, and offers an undo. This one only puts the brew
 * down for the session — the door falls through to the bag, then to the
 * question, and the brew is offered again on the next open. Nothing is
 * written, so there is nothing to undo.
 *
 * "For the session" has to survive vizCheckOnResume, or it isn't a session at
 * all: that check re-asks Visualizer once VIZ_RESUME_GAP (90s) has passed
 * since the last one, which is nothing on a phone — the screen locking while
 * a cup is poured is enough. Clearing only _vizWaiting left the id itself
 * unguarded, so the very next resume re-fetched the same shot and put the
 * dismissed hero straight back on the door, unprompted. _snoozedShotIds
 * holds the id against that until a real reload asks fresh. */
function snoozeWaitingShot(){if(_vizWaiting)_snoozedShotIds.add(String(_vizWaiting.id));_vizWaiting=null;render();}
function dismissShot(id){
  // v7.35.0, critique rec 6: this was permanent and one tap away, on a screen
  // where the tap beside it writes a cup. Everything else Carta puts away is
  // undoable; so is this now — the dismissal, the kept read and the cache all
  // come back together, because putting one back without the others would
  // restore the row and lose the brew behind it.
  const before={list:vizDismissed().slice(),waiting:_vizWaiting,read:readShotRead(id),cache:_vizCache[String(id)]};
  const list=before.list.filter(x=>String(x)!==String(id));
  list.push(String(id));
  setPref('vizDismissed',list.slice(-20));
  if(_vizWaiting&&String(_vizWaiting.id)===String(id))_vizWaiting=null;
  // "won't offer it again" has to mean the kept copy too, or a brew said to
  // be someone else's would sit in Read before for another thirty reads
  forgetShotRead(id);delete _vizCache[String(id)];
  if(pageView&&pageView.kind==='shot')pageView=null;
  render();
  toast('Put away — not yours.',function(){
    setPref('vizDismissed',before.list);
    if(before.read){loadShotsRead();_shotsReadCache[String(id)]=before.read;saveShotsRead()}
    if(before.cache)_vizCache[String(id)]=before.cache;
    _vizWaiting=before.waiting;render();
  },'Undo');
}
// the shot the hero is standing on, or nothing — read by vAtlas on every
// paint, and cleared the moment its cup is written
function waitingShot(){
  if(!_vizWaiting)return null;
  if(cupOfShot(_vizWaiting.id)||vizDismissed().some(x=>String(x)===String(_vizWaiting.id))){_vizWaiting=null;return null}
  return _vizWaiting;
}
// what the file said first; the list row's `clock` — which is an upload
// timestamp for anything filed after the fact — only where it said nothing
const shotWhen=s=>!s?null:(s.at||(s.clock?new Date(s.clock*1000).toISOString():null));
/* the second, full fetch the Shots list already promises ("only the one you
 * pick is read in full") — `?essentials=true` never carries the curve arrays
 * (ROADMAP.md, confirmed by diffing against the live API), so every shot
 * read through the cheap list/watch calls has a null `.curve` until this
 * runs once against the one shot actually opened or picked. The fetch itself
 * is cached per id, not per shot object, so the door's own picker (which
 * never touches `_vizCache`) and the Atlas/Shots-list path (which does)
 * never fetch the same shot twice. */
let _vizFullFetches={};
function fetchShotFull(id){
  const key=String(id);
  return _vizFullFetches[key]||(_vizFullFetches[key]=callVisualizer(`/${key}/download`)
    .then(parseVisualizerShot).catch(()=>null));
}
/* the full file is fetched for its curve, but it is also the only call that
 * carries the shot's own settings: `?essentials=true` states neither the
 * grinder setting nor the temperature goal, so a plate's ledger read `unread`
 * for the grind and the water on every shot no matter what Visualizer's own
 * page showed. The full read fills in only what the cheap one left null —
 * never overwriting a figure already stated, which is what keeps a shot
 * corrected at the door from being quietly reverted by a later fetch. */
/* what the FILE states — filled in only where the cheap call left a blank, so
 * a figure already stated (or corrected at the door) is never reverted by a
 * fetch that lands after it. */
const SHOT_FILLED=['dose','water','time','timeExact','grind','tempC',
  'machine','brewer','profile','at',
  'roaster','coffeeName','roastDate','roastLevel','grinderModel'];
/* what the CURVE states — re-derived outright when the curve arrives, never
 * merely filled (v7.31.3).
 *
 * This is the distinction the watch's own two-call shape needs and did not
 * have. `?essentials=true` carries no curve at all, so the method that parse
 * came back with was a *default*, not a reading — and because 'espresso' is
 * neither null nor empty, the fill-if-empty rule above then refused to
 * correct it when the real curve landed a moment later. The hero drew a
 * pour-over through the espresso arm: no pressure series to draw, so
 * `d="null"`, an empty plate, a peak of `—` and a three-minute brew stated as
 * 200s. The Journal was fine throughout, because the shots list fetches the
 * whole file and its parse saw the curve first time — which is exactly the
 * split the keeper reported. */
const SHOT_DERIVED=['method','pours','preinfusionSec','preinfusionBar'];
// wherever a shot ends up with a curve — already carrying one, or freshly
// fetched here — it is durable from that moment on (cacheShotRead), whether
// or not a cup is ever written from it. This is the one place every caller
// (openShotScreen, the hero's own check-on-open) routes through, so nothing
// downstream has to remember to opt in.
function ensureShotCurve(shot){
  if(!shot||shot.id==null)return Promise.resolve(shot);
  if(shot.curve){cacheShotRead(shot);return Promise.resolve(shot)}
  return fetchShotFull(shot.id).then(full=>{
    if(full){
      SHOT_FILLED.forEach(k=>{if((shot[k]==null||shot[k]==='')&&full[k]!=null&&full[k]!=='')shot[k]=full[k]});
      if(full.curve){
        shot.curve=full.curve;
        SHOT_DERIVED.forEach(k=>{shot[k]=full[k]});
        // a filter brew is argued in the water it took, which only the curve
        // knows; the cheap call's `drink_weight` is what landed in the cup
        if(full.method==='pourover'&&full.water!=null)shot.water=full.water;
      }
      if(shot.label==='Untitled shot'&&full.label!=='Untitled shot')shot.label=full.label;
    }
    if(pageView&&pageView.kind==='shot'&&String(pageView.id)===String(shot.id))render();
    if(shot.curve)cacheShotRead(shot);
    return shot;
  });
}
function openShotScreen(id,extra){openScreen('shot',String(id),extra);ensureShotCurve(vizShotById(id))}
// station 08, reachable whether or not the watch is on. The list is fetched
// once a sitting; the row you pick is the only one read in full.
let _shots={busy:false,rows:null,error:null,scope:'all'};
function openShotsScreen(){
  if(!visualizerAuthHeader()){vizResumeAfterSignIn(openShotsScreen);openVisualizerKey();return}
  openScreen('shots');loadShots();
}
async function loadShots(force){
  if(_shots.busy||(_shots.rows&&!force))return;
  _shots.busy=true;_shots.error=null;render();
  try{_shots.rows=(await fetchVisualizerShots(8)).map(cacheShot)}
  catch(e){_shots.error=(e&&e.message)||'Could not reach Visualizer.'}
  _shots.busy=false;
  if(pageView&&pageView.kind==='shots')render();
}
/* the brews already read, newest first — the offline half of this list.
 * Visualizer's own eight are the live half and always lead; a shot once
 * opened is appended under them if the account didn't just list it, so a
 * plate you looked at last week is still reachable after it falls off the
 * recent eight, and reachable at all with the network down. */
function shotsReadRows(exclude){
  const seen=new Set((exclude||[]).map(r=>String(r.id)));
  const gone=new Set(vizDismissed().map(String));
  const store=loadShotsRead();
  return Object.keys(store).map(k=>store[k])
    .filter(s=>s&&!seen.has(String(s.id))&&!gone.has(String(s.id)))
    .sort((a,b)=>String(shotWhen(b)||'').localeCompare(String(shotWhen(a)||'')));
}

/* ---- station 04: the shot, as a plate. BARELESS — one shot is read in a
 * sitting, and the bar would only offer a way to lose it. */
function vShot(id,view){
  const shot=vizShotById(id);
  if(!shot)return `<div class="pad" style="padding-top:26px"><div class="empty">That brew isn't in hand any more.</div>
    <button class="btn btn-quiet" onclick="openShotsScreen()">Your recent brews</button>
    <button class="btn btn-quiet" onclick="goBack()">Back</button></div>`;
  const g=platePaths(shot,PLATE_FULL),fg=shotFigures(shot),when=shotWhen(shot);
  const setup=setupById(matchSetupByGrinder(live('setups'),shot.grinderModel,brewerOf(shot)));
  const pour=shotMethod(shot)==='pourover';
  const setupLine=setup?(setup.name||[setup.grinder,setup.brewer].filter(Boolean).join(' · '))
    :([shot.machine,shot.grinderModel].filter(Boolean).join(' · ')||'');
  // "4.2 s at 2.9 bar" — the duration and what it held, since a pre-infusion
  // is argued about in both. Where only the duration is stated, only it is said.
  const preLine=shot.preinfusionSec==null?''
    :fig1(shot.preinfusionSec)+' s'+(shot.preinfusionBar==null?'':' at '+fig1(shot.preinfusionBar)+' bar');
  // the ledger is not the same ledger. A shot is argued with preinfusion and a
  // roast date; a filter brew with the paper it ran through and the hand that
  // stirred it — and the hand is half the recipe with no instrument recording
  // it, which is where `unread` lands hardest in the whole app.
  const led=pour?[
    ['Coffee',shot.label==='Untitled shot'?'':shot.label],
    ['Brewer',brewerOf(shot)],
    ['Grind',[setup&&setup.grinder?setup.grinder:shot.grinderModel,shot.grind==null?'':String(shot.grind)].filter(Boolean).join(' · ')],
    ['Water',shot.tempC==null?'':fmtTempStated(shot.tempC)+', stated once'],
    ['Agitation',''],
  ]:[
    ['Coffee',shot.label==='Untitled shot'?'':shot.label],
    ['Setup',setupLine],
    ['Machine',shot.machine||''],
    ['Profile',shot.profile||''],
    ['Grind',shot.grind==null?'':String(shot.grind)],
    ['Water',fmtTempStated(shot.tempC)],
    ['Preinfusion',preLine],
    ['Roast date',shot.roastDate?fmtDateLong(shot.roastDate+'T00:00'):''],
  ].filter(r=>!((r[0]==='Machine'||r[0]==='Profile')&&!r[1]));
  /* a shot already written reads as a record rather than an invitation: the
   * three pre-write actions (write it, correct it before it is written, not
   * mine) are all spent, and the only honest move left is back to the cup it
   * became. This is what makes the plate reviewable — the screen no longer
   * assumes it is being read on the way to somewhere. */
  const cup=cupOfShot(shot.id);
  return `<div>
    <header class="shdr" style="align-items:flex-end;gap:14px;justify-content:flex-start">
      ${backMiniHTML('bare','flex:none')}
      <div style="flex:1;min-width:0">
        <div class="eyebrow" style="margin-bottom:4px">${esc(['From Visualizer',whenLine(when),cup?'written':''].filter(Boolean).join(' · '))}</div>
        <div class="display" style="font-size:1.375rem;margin:0">${esc(shot.coffeeName||shot.label)}, <em>as it poured</em></div>
      </div>
    </header>
    ${g?plateBoxHTML(shot,g):`<div class="note" style="margin:0;padding:16px 20px;border-top:0;border-bottom:1px solid var(--line)">This ${pour?'brew':'shot'} came without its curve. Its own figures still stand.</div>`}
    <div class="pad" style="padding-top:0">
      ${figsHTML(fg)}
      ${pour?poursHTML(fg.pours):''}
      <div style="margin-top:16px">${ledgerHTML(led)}</div>
      ${cup?`<button class="btn btn-primary" style="min-height:52px;margin-top:18px" onclick="openScreen('cup',${jsq(cup.id)})">The cup this became${cup.score==null?'':' · '+cup.score} →</button>
        <div class="note">Written up already. The brew keeps its plate here as long as it is on this device, whether or not you read it again.</div>`
      :`<button class="btn btn-primary" style="min-height:52px;margin-top:18px" onclick="shotIsTheCup(${jsq(String(shot.id))})">This is the cup →</button>
        <div style="text-align:center;margin-top:15px"><button class="qlink" onclick="shotCorrect(${jsq(String(shot.id))})">Correct something before it is written</button></div>
        <div style="text-align:center;margin-top:10px"><button class="qlink faint" onclick="dismissShot(${jsq(String(shot.id))})">Not mine</button></div>
        <div class="note">Read off your ${pour?'scale':'account'}, and kept on this device once you have opened it — never sent anywhere else. A field Visualizer didn't state reads <em>unread</em> rather than a guess.</div>`}
    </div></div>`;
}
/* the pours as they were made, and the wait after each — the ledger a shot has
 * no counterpart for. The gaps ARE the reading: the bed letting go between
 * pulses, and the last of them is the drawdown, which is why it alone is set
 * in full ink. A brew whose file states no pours at all draws nothing here
 * rather than an empty table. */
function poursHTML(pours){
  if(!pours||!pours.length)return '';
  const last=pours.length-1;
  return `<div class="shead" style="margin-top:15px"><span class="l">The pours</span><span class="r">and each wait after</span></div>
    <div class="pours">
      <span class="h">Pour</span><span class="h r">Added</span><span class="h r">At</span><span class="h r">Then</span>
      ${pours.map((p,i)=>`<span class="p">${i?'Pour '+(i+1):'Bloom'}</span>
        <span class="n">${esc(String(Math.round(p.added)))} g</span>
        <span class="a">${esc(mmss(p.at))}</span>
        <span class="w${i===last?' down':''}">${esc(Math.round(p.then)+' s')}</span>`).join('')}
    </div>
    <div style="font-family:var(--serif);font-style:italic;font-size:12.5px;color:var(--ink-3);line-height:1.45;margin-top:7px">The gaps are the bed letting go. The last one is the drawdown, and it is the figure this brew will be argued about.</div>`;
}
const fmtClock=iso=>iso?new Date(iso).toLocaleTimeString(undefined,{hour:'2-digit',minute:'2-digit'}):'';
// the hour on its own is enough for something poured today and misleading for
// anything older — a brew pulled from Tuesday should say Tuesday
const whenLine=iso=>{
  if(!iso)return '';
  const w=fmtWhen(iso),c=fmtClock(iso);
  return w==='today'?c:`${w} · ${c}`;
};
// "V60 02 · Cafec Abaca" is the ledger's reading, where the paper is half the
// recipe. A hero and a list row want the brewer on its own.
const brewerShort=b=>String(b||'').split('·')[0].trim();
// stated or nothing: a shot file that named no temperature gets `unread`, not
// a figure read off a curve that was never a scalar (SPEC §4, ARCHITECTURE §4)
const fmtTempStated=c=>c==null?'':(tempUnit()==='F'?`${Math.round(c2f(c)*10)/10} °F`:`${c} °C`);
// the same gentle join the door already runs, entered from the shot's own
// screen: an exact match asks nothing and station 05 never appears
/* the guard this keeper's own ledger asked for (v7.31.1): a shot already
 * written as a cup was being written again, and again — three brews and two
 * cups off one pull, because nothing between the shots list and here ever
 * asked whether the record already had it. The hero knew (`cupOfShot` is what
 * keeps a written shot from coming back to it); this door simply never
 * checked. It states the fact and opens the cup that exists, rather than
 * refusing outright — the keeper can still put that cup away and pull again,
 * which is the honest way to redo one. */
function shotIsTheCup(id,correct){
  const shot=vizShotById(id);if(!shot)return;
  const already=cupOfShot(id);
  if(already){
    openScreen('cup',already.id);
    toast('Already written — this is that cup.');
    return;
  }
  doorState={step:'pullJoin',_pullShots:[shot],_correct:!!correct};
  doorPullPicked(shot.id);
}
// the same road, stopping one door short: the coffee and the brew are minted
// exactly as they would have been, then handed to the forms that already edit
// them rather than to the taste
function shotCorrect(id){shotIsTheCup(id,true)}

/* ---- station 06: the taste, and nothing else. The plate steps back to a
 * hairline — still there, no longer the subject — and the 1–9 takes the page,
 * with the score answering in the ember.
 *
 * v7.35.0, critique rec 3: this is now the ONLY surface a cup's reading is
 * written on. `openImpression`'s sheet — the typed path's second scoring
 * screen, with its own captions, its own field name and its own verb — is
 * deleted, and both brew paths land here. Rec 9 adds the other direction: a
 * reading already written is corrected on the same surface it was written on,
 * which is why `view.editCup` exists and why a café cup (no brew behind it at
 * all) can stand on this screen too. */
let _thLine='';
function openTasteHome(brewId){
  if(!brewById(brewId))return;
  hedState=null;descState=new Set();_thLine='';
  closeSheet();openScreen('tastehome',brewId);
}
// correcting a cup: the same screen, seeded from what is already written, and
// naming what it is doing rather than asking the question a second time
function openTasteEdit(cupId){
  const cup=cupById(cupId);if(!cup)return;
  hedState=cup.score==null?null:cup.score;descState=new Set(cup.descriptors||[]);_thLine=cup.line||'';
  closeSheet();openScreen('tastehome',cup.brewRef||null,{editCup:cupId});
}
function vTasteHome(brewId,view){
  const editCup=(view&&view.editCup)?cupById(view.editCup):null;
  const brew=brewId?brewById(brewId):null;
  if(!brew&&!editCup)return `<div class="pad" style="padding-top:26px"><div class="empty">That brew isn't on the record.</div>
    <button class="btn btn-quiet" onclick="go('journal')">Back to the journal</button></div>`;
  const coffee=coffeeById(editCup?editCup.coffeeRef:brew.coffeeRef);
  // a café cup carries the room it was drunk in instead of a Setup, and says so
  const place=editCup&&editCup.kind==='bar'?placeById(editCup.placeRef):null;
  const shot=brew?shotOfBrew(brew):null;
  // the figures come off the shot where there is one and off the brew's own
  // dials where there isn't — the same three either way
  const fg=shotFigures(shot||(brew?{time:brew.timeSec,dose:brew.doseG,water:brew.waterG}:{}));
  const hair=shot&&shot.curve?plateSVG(shot,PLATE_HAIR,{cls:'hair quiet',axis:false,style:'flex:1;min-width:0'}):'';
  const stated=[fg.peak==null?null:fig1(fg.peak)+' bar',fg.ratio==null?null:'1:'+fig1(fg.ratio),
    fg.total==null?null:fig1(fg.total)+'s'].filter(Boolean).join(' · ');
  const eyebrow=[coffeeLabel(coffee),place?place.name:null].filter(Boolean).join(' · ');
  return `<div>
    <header class="shdr" style="display:block;padding-bottom:12px">
      <div style="display:flex;align-items:flex-end;gap:14px">
        ${backMiniHTML('bare','flex:none')}
        <div style="flex:1;min-width:0">
          <div class="eyebrow" style="margin-bottom:4px">${esc(eyebrow)}</div>
          <div class="display" style="font-size:1.375rem;margin:0">${editCup?'Correct the <em>reading</em>':'Was it <em>good?</em>'}</div>
        </div>
      </div>
      ${hair||stated?`<div style="display:flex;align-items:center;gap:12px;margin-top:14px">${hair}
        ${stated?`<span style="flex:none;white-space:nowrap;font-family:var(--sans);font-size:11px;color:var(--ink-3);font-variant-numeric:tabular-nums">${esc(stated)}</span>`:''}</div>`:''}
    </header>
    <div class="pad" style="padding-top:0">
      <div class="tastebig">
        <div class="n${hedState==null?'':' set'}" id="th_score">${hedState==null?'—':hedState}</div>
        <div class="say" id="th_say">${esc(tasteHomeNote(hedState))}</div>
      </div>
      <div class="nine" id="th_nine">${[1,2,3,4,5,6,7,8,9].map(n=>
        `<button class="${hedState===n?'on':''}" onclick="tasteHomePick(${n})">${n}</button>`).join('')}</div>
      <div class="nineax"><span>Poured away</span><span>Cross town for</span></div>
      <div class="shead"><span class="l">What it tasted of</span><span class="r">optional</span></div>
      ${descRow([...descState])}
      <label class="f" style="margin-top:20px"><span class="l">The line</span>
        <input type="text" id="th_line" value="${esc(_thLine)}" oninput="_thLine=this.value" placeholder="One sentence you'd want to read again…"></label>
      <button class="btn btn-primary" style="min-height:52px;margin-top:8px" onclick="saveTasteHome('${brew?brew.id:''}',false,'${editCup?editCup.id:''}')">${editCup?'Save the reading':'Write the cup'}</button>
      ${editCup?'':`<div style="text-align:center;margin-top:14px"><button class="qlink" onclick="saveTasteHome('${brew.id}',true)">Skip — the brew still counts</button></div>`}
    </div></div>`;
}
// what a reading means, said once and without a compliment in it. Eight is
// where a roaster starts earning an anchor, which is the only claim made here.
function tasteHomeNote(n){
  if(n==null)return 'Nine is a coffee you would cross town for. One is a cup you poured away.';
  return n>=8?'Kept. This one goes into your taste as evidence.':'Recorded as it was.';
}
// painted in place: a re-render would replay the plate's draw-on and eat the
// line already typed beside it
function tasteHomePick(n){
  hedState=n;
  const box=document.getElementById('th_nine');
  if(box)box.querySelectorAll('button').forEach((b,i)=>b.classList.toggle('on',i===n-1));
  const num=document.getElementById('th_score');
  if(num){num.textContent=String(n);num.classList.add('set')}
  const say=document.getElementById('th_say');
  if(say)say.textContent=tasteHomeNote(n);
}
// the shot behind a brew, rebuilt from the ledger and the curve store — so a
// cup written weeks ago still draws its own plate with nothing fetched
function shotOfBrew(brew){
  if(!brew||brew.vizShotId==null)return null;
  const cached=vizShotById(brew.vizShotId);
  return {id:brew.vizShotId,curve:getShotCurve(brew.vizShotId)||(cached&&cached.curve)||null,
    at:brew.at||(cached&&cached.at)||null,
    method:brew.method||(cached&&cached.method)||'espresso',
    pours:brew.pours||(cached&&cached.pours)||[],
    dose:brew.doseG,water:brew.waterG,time:brew.timeSec,grind:brew.grind,tempC:brew.tempC,
    brewer:brew.brewer||(cached&&cached.brewer)||'',
    label:cached?cached.label:'',clock:cached?cached.clock:null};
}
function saveTasteHome(brewId,skip,editCupId){
  // correcting: nothing is minted, the cup on the record is amended in place,
  // and the amendment is undoable the way every other write here is
  if(editCupId){
    const cup=cupById(editCupId);if(!cup)return;
    if(hedState==null){toast('A cup needs its reading — the 1–9 first.');return}
    const was={score:cup.score,line:cup.line,descriptors:(cup.descriptors||[]).slice()};
    cup.score=hedState;cup.line=val('th_line');cup.descriptors=[...descState];
    cup.updatedAt=new Date().toISOString();
    hedState=null;descState=new Set();_thLine='';
    save();openScreen('cup',cup.id);
    toast('Corrected.',()=>{Object.assign(cup,was);save();render()},'Undo');
    return;
  }
  if(!skip&&hedState==null){toast("A cup needs its reading — the 1–9 first. Or skip; that's honest too.");return}
  const brew=brewById(brewId);if(!brew)return;
  // `createdAt` is when this was written down; `at` is when the cup happened.
  // For a brew read off an instrument those are different the moment you pull
  // one from yesterday, and the Journal is ordered by the second of them.
  const cup={id:uid(),createdAt:new Date().toISOString(),at:brew.at||new Date().toISOString(),kind:'home',
    coffeeRef:brew.coffeeRef,brewRef:brew.id,score:skip?null:hedState,
    line:skip?'':val('th_line'),descriptors:skip?[]:[...descState]};
  if(brew.vizShotId!=null)cup.vizShotId=brew.vizShotId;
  D.cups.push(cup);
  hedState=null;descState=new Set();_thLine='';
  // the ask comes back up the moment the cup is written — the hero is exactly
  // the screen Phase 20 shipped again, with nothing left over to expire
  if(_vizWaiting&&brew.vizShotId!=null&&String(_vizWaiting.id)===String(brew.vizShotId))_vizWaiting=null;
  save();openScreen('cup',cup.id);
  toast(skip?'The brew is on the record.':'Written to the record.',()=>unwriteCup(cup.id,brewId),'Undo');
}
// a real undo of the write: the cup is put away the way everything else is,
// and what was typed comes back to the screen it was typed on
function unwriteCup(cupId,brewId){
  const cup=cupById(cupId);if(!cup)return;
  hedState=cup.score==null?null:cup.score;descState=new Set(cup.descriptors||[]);_thLine=cup.line||'';
  if(!putAwayCore(D,'cups',cupId,new Date().toISOString()))return;
  save();openScreen('tastehome',brewId);
}

/* ---- station 08: the other shots. Reached from the hero, or from the Journal
 * when the watch is off. Each row carries its own curve. */
/* station 14: both methods land in the same list, because they land in the
 * same journal. The scope narrows it where the keeper wants one of them; it is
 * a filter over what has already been fetched, never a second call. And there
 * is deliberately no icon, no colour and no badge saying which is which — the
 * 44×22 thumb finally earns the argument it was drawn for, because an arc and
 * a staircase are unmistakable at that size. */
const SHOT_SCOPES=[['all','All'],['espresso','Espresso'],['pourover','Pour-over']];
function setShotScope(k){_shots.scope=k;render()}
function vShots(){
  const rows=_shots.rows,scope=_shots.scope||'all';
  const inScope=r=>scope==='all'||shotMethod(r)===scope;
  const shown=rows?rows.filter(inScope):null;
  // the plates already read, minus whatever the account just listed — kept
  // here so a brew that has fallen off the recent eight, or a sitting with
  // no network at all, still reaches its own plate
  const kept=shotsReadRows(rows||[]).filter(inScope);
  const all=(shown||[]).concat(kept);
  const mixed=all.length>1&&all.some(r=>shotMethod(r)==='pourover')&&all.some(r=>shotMethod(r)!=='pourover');
  return `<div>
    <header class="shdr" style="align-items:flex-end;gap:14px;justify-content:flex-start">
      ${backMiniHTML('bare','flex:none')}
      <div style="flex:1;min-width:0">
        <div class="eyebrow" style="margin-bottom:4px">Visualizer</div>
        <div class="display" style="font-size:1.375rem;margin:0">Your recent <em>brews</em></div>
      </div>
    </header>
    <div class="pad" style="padding-top:0">
      ${mixed?`<div style="display:flex;gap:7px;margin:16px 0 4px">
        ${SHOT_SCOPES.map(([k,l])=>`<button class="pick${scope===k?' on':''}" onclick="setShotScope('${k}')">${l}</button>`).join('')}
      </div>`:`<div class="lede" style="margin-top:16px">The coffee and the brew arrive already right. Only the taste is still yours to type.</div>`}
      ${_shots.busy?'<div class="empty">Reading your brews…</div>'
        :_shots.error?`<div class="empty">${esc(_shots.error)}</div><button class="btn btn-quiet" onclick="loadShots(true)">Try again</button>`
        :!rows?''
        :!rows.length&&!kept.length?`<div class="empty">${rows.listed?`Your account lists ${rows.listed} brew${rows.listed===1?'':'s'}, and none of them could be read. Reload the page — if it persists, the account is reachable and something on this side is wrong.`:'No brews on your Visualizer account yet.'}</div>`
        :!shown.length&&!kept.length?`<div class="empty">Nothing ${scope==='pourover'?'poured through a filter':'pulled as a shot'} in the last eight.</div>`
        :shown.map(shotRowHTML).join('')}
      ${kept.length?`<div class="shead" style="margin-top:18px"><span class="l">Read before</span>
        <span class="r">${words(kept.length)} kept on this device</span></div>
        ${kept.map(shotRowHTML).join('')}
        <div class="note">A brew you have opened keeps its plate here after it falls off your account's recent eight — and reads with the network off. Nothing was sent anywhere to keep it.</div>`:''}
      ${rows&&rows.length&&!kept.length?`<div class="note">${mixed?'Both methods land in the same list, because they land in the same journal. The shape says which before the label does.':'Eight brews listed, and only the one you pick is read in full. A brew you have already written keeps its score here.'}</div>`:''}
      <button class="btn btn-quiet" style="margin-top:18px" onclick="openHomeDoor()">Type a brew instead</button>
    </div></div>`;
}
function shotRowHTML(shot){
  const cup=cupOfShot(shot.id),fg=shotFigures(shot),when=shotWhen(shot);
  const pour=fg.method==='pourover';
  const meta=[when?fmtAgo(when):'',shot.label==='Untitled shot'?'no coffee named':'',
    pour?(brewerShort(brewerOf(shot))||null):null,
    fg.ratio==null?null:'1:'+fig1(fg.ratio),
    fg.total==null?null:(pour?mmss(fg.total):fig1(fg.total)+'s'),
    pour?null:(fg.peak==null?null:fig1(fg.peak)+' bar')].filter(Boolean).join(' · ');
  const curve=shot.curve?plateSVG(shot,PLATE_THUMB,{cls:'tiny'+(cup?' quiet':''),style:'width:44px;height:22px;flex:none'})
    :'<span style="flex:none;width:44px"></span>';
  return `<button class="lrow" onclick="openShotScreen(${jsq(String(shot.id))})">
    ${curve}
    <span class="mid"><span class="t"${cup?' style="color:var(--ink-2)"':''}>${esc(shot.label)}</span><span class="m">${esc(meta)}</span></span>
    ${cup?`<span class="sc${cup.score==null?' none':''}">${cup.score==null?'—':cup.score}</span>`
      :'<span class="chip on" style="flex:none;text-transform:uppercase;letter-spacing:.06em;border-color:var(--line-strong);color:var(--ink)">New</span>'}</button>`;
}

/* ---- the seam: what index.html reads off this file (Phase 19 pattern —
 * a top-level `function` is already on `window` in a classic script; the
 * explicit publish is here to document the seam, not to create it). ---- */
window.brewerOf=brewerOf;
window.brewerShort=brewerShort;
window.cupOfShot=cupOfShot;
window.ensureShotCurve=ensureShotCurve;
window.fetchVisualizerShots=fetchVisualizerShots;
window.fmtClock=fmtClock;
window.matchSetupByGrinder=matchSetupByGrinder;
window.normalizeRoastLevel=normalizeRoastLevel;
window.normalizeRoastDate=normalizeRoastDate;
window.openSetupImport=openSetupImport;
window.openShotScreen=openShotScreen;
window.openShotsScreen=openShotsScreen;
window.openTasteHome=openTasteHome;
window.openTasteEdit=openTasteEdit;
window.openVisualizerKey=openVisualizerKey;
window.openVisualizerPicker=openVisualizerPicker;
window.vizResumeAfterSignIn=vizResumeAfterSignIn;
window.shotOfBrew=shotOfBrew;
window.shotWhen=shotWhen;
window.vShot=vShot;
window.vShots=vShots;
window.vTasteHome=vTasteHome;
window.visualizerAuthHeader=visualizerAuthHeader;
window.visualizerEmail=visualizerEmail;
window.vizCheckOnOpen=vizCheckOnOpen;
window.vizShotRowHTML=vizShotRowHTML;
window.waitingShot=waitingShot;
window.snoozeWaitingShot=snoozeWaitingShot;
window.parseVisualizerShot=parseVisualizerShot;
window.shotStartedAt=shotStartedAt;
window.tsToMs=tsToMs;
window.shotTempGoal=shotTempGoal;
window.setupCandidatesFromShots=setupCandidatesFromShots;
window.firstStr=firstStr;

window.SHOT_VERSION='7.42.5';

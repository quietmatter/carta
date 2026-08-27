/* ============================================================================
     The ask (ROADMAP.md Phase 7, Phase 14, Phase 20) — the argument, and the
     one keyed channel it goes out through.

     Split out of index.html at v7.34.0, the way the map layer was at Phase 19
     and the plate at v7.31.0, and for the same reason: the file had gone
     1,483 lines past a band that has not moved since Phase 17, and this is
     the largest thing in it that is not the record itself.

     What it holds is one walk, named as one in CLAUDE.md long before it was a
     file: `vTaste` -> `vBrief` -> `vAsk` -> `vAsking` -> `vAskResult`. Around
     it sits the channel the walk goes out on — `callModel`, the keeper's own
     Anthropic key, and the two halves of reading a model's reply back safely
     (`extractJSON`, `askStr`/`askList`). Those last are shared: the menu's
     "Read it for me" and a coffee's "Search for more" go out through this
     same channel and read their replies with the same helpers, which is what
     ARCHITECTURE.md §7 already said by listing them on one row.

     Loaded from index.html's <head> with a plain <script src>, before the
     app's own script. No bundler, no build. The seam is the same one Phase 19
     documented: what index.html needs is published on `window` at the foot of
     this file, and what this file needs from the app (`D`, `live`, `esc`,
     `render`, `openScreen`, `lookupPlace`, the taste model) it calls at
     runtime, by which time index.html has defined them.

     `askDraft` is deliberately NOT published: it is a `let`, reassigned from
     index.html's own router (`openAskScreenFor`) and written by an inline
     handler on the Atlas. Classic scripts share one global lexical
     environment, so the binding is the same binding either way — publishing a
     copy onto `window` would fork it and quietly lose writes.
   ========================================================================== */

/* ==== pure ==== *
/* ---- the ask (ROADMAP.md Phase 7) — the brief, plus a scope and a question,
 * sent to a model the keeper brought their own key for. Both halves that can
 * go wrong live here, pure and tested: the prompt text (so the model is asked
 * for exactly one shape) and the parse (a model's wrongness here is invisible
 * otherwise — a bad parse just looks like Carta finding nothing). Grounding
 * (a real place lookup) and the call itself are network, and stay outside. */
function askKindLabel(k){return {city:'A city',neighborhood:'A neighborhood',near:'Near a point',country:'A country',route:'A route',friend:'A friend'}[k]||'Somewhere'}
/* What the model is asked for is the whole difference between a list and an
 * argument. Four things it must do that the first cut never asked for: rank,
 * say what each café is best FOR, name the figures off the brief it leaned on,
 * and close with what it would actually do. And one it must not: Carta makes
 * no search, so a menu read back as fact would be an invention — the prompt
 * asks for the half that keeps (a program, a posture, what to ask for at the
 * counter) and makes the model mark whatever turns over. Every field is one
 * sentence because the answer is read as a list of chips on a phone, not as
 * prose — length here is the failure mode, not the goal. */
const ASK_CAPS={cafes:8,mentions:4,fit:3,routes:4};
function askPromptText(briefText,scopeKind,destination,question,reach){
  const kindLine={
    city:`I'm asking about the city: ${destination}.`,
    neighborhood:`I'm asking about this specific area: ${destination}.`,
    near:`I'm starting from this point and want what's within reach of it: ${destination}.`,
    country:`I'm asking about the whole country or region: ${destination}.`,
    route:`I'm asking about this route or road trip: ${destination}.`,
    friend:`I'm asking on behalf of a friend, whose taste differs from mine like this: ${destination}.`,
  }[scopeKind]||`I'm asking about: ${destination}.`;
  const reachLine=reach?`\nHow far I'll actually go: ${reach}.`:'';
  const askLine=question?`\nSomething else worth knowing: ${question}`:'';
  return `${briefText}\n\n${kindLine}${reachLine}${askLine}\n
Recommend specialty coffee cafés that match this taste, and argue for them the way someone who drinks here would: rank them, say what each one is best FOR, and name the figures above you are leaning on.\n
Two rules about what you know. You have no live access to any menu, so never state what a café is pouring today as fact — write what its program and character are reliably like, and set "stale" true for any café whose fit depends on a rotating menu. Never invent a café: if you don't know real ones here, return {"cafes":[]}.\n
Keep every text field to ONE sentence. Short beats complete — this is read on a phone as a list, not as prose.\n
Reply with ONLY a JSON object, no other text, no markdown fences, in exactly this shape:
{"read":"one sentence on how the ground actually lies for this ask","cafes":[{"name":"...","neighborhood":"...","city":"...","verdict":"five words or fewer — what this one is best for","why":"one sentence, tied to my taste above","fit":["a figure from my taste this leans on, e.g. Alchemy fermentation 9.0/9, n=3"],"order":"what to ask for at the counter","travel":"honest distance from where I asked","stale":false}],"mentions":[{"name":"...","city":"...","instead":"one sentence — why it isn't the pick"}],"plan":{"move":"one sentence — the single strongest thing to do","routes":[{"if":"six words or fewer","order":["café","café","café"]}],"wildcard":{"name":"...","city":"...","why":"one sentence — why it's worth knowing though it sits outside the ranking"}}}
At most ${ASK_CAPS.cafes} cafés, ${ASK_CAPS.mentions} mentions, ${ASK_CAPS.fit} fit strings each, ${ASK_CAPS.routes} routes. "mentions" is for places that are close or obvious but that I should know are NOT the pick, and why. Leave out any part you cannot fill honestly rather than padding it.`;
}
// a model's answer, fenced or bare, prose around it or not — the one door
// every "ask the model for JSON" caller reads its reply through
function extractJSON(text){
  const raw=String(text||'');
  const fence=raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const body=fence?fence[1]:raw;
  const start=body.indexOf('{'),end=body.lastIndexOf('}');
  if(start===-1||end===-1||end<start)return null;
  try{return JSON.parse(body.slice(start,end+1))}catch(e){return null}
}
/* The caps are held here, not in the prompt — the prompt states them, this is
 * what enforces them. And an answer in the old four-field shape still has to
 * come out as something the screen can draw: every part beyond a name is
 * optional, all the way up to the plan. */
function askStr(v,n){const t=String(v==null?'':v).trim().replace(/\s+/g,' ');return t.length>n?t.slice(0,n-1).trimEnd()+'…':t}
function askList(v,n,cap){return (Array.isArray(v)?v:[]).map(x=>askStr(x,n)).filter(Boolean).slice(0,cap)}
function parseAskJSON(text){
  const data=extractJSON(text);
  if(!data)return {ok:false,read:'',findings:[],mentions:[],plan:null};
  const findings=(Array.isArray(data.cafes)?data.cafes:[]).map(c=>({
    name:askStr(c&&c.name,80),neighborhood:askStr(c&&c.neighborhood,60),city:askStr(c&&c.city,60),
    verdict:askStr(c&&c.verdict,40),why:askStr(c&&c.why,220),
    fit:askList(c&&c.fit,60,ASK_CAPS.fit),order:askStr(c&&c.order,120),
    travel:askStr(c&&c.travel,60),stale:!!(c&&c.stale),
  })).filter(f=>f.name).slice(0,ASK_CAPS.cafes);
  const mentions=(Array.isArray(data.mentions)?data.mentions:[]).map(m=>({
    name:askStr(m&&m.name,80),city:askStr(m&&m.city,60),instead:askStr(m&&m.instead,220),
  })).filter(m=>m.name).slice(0,ASK_CAPS.mentions);
  const p=(data.plan&&typeof data.plan==='object')?data.plan:null;
  const w=(p&&p.wildcard&&typeof p.wildcard==='object'&&askStr(p.wildcard.name,80))?p.wildcard:null;
  const plan=p?{
    move:askStr(p.move,220),
    routes:(Array.isArray(p.routes)?p.routes:[]).map(r=>({
      if:askStr(r&&r.if,60),order:askList(r&&r.order,80,4),
    })).filter(r=>r.if&&r.order.length).slice(0,ASK_CAPS.routes),
    wildcard:w?{name:askStr(w.name,80),city:askStr(w.city,60),why:askStr(w.why,220)}:null,
  }:null;
  const said=plan&&(plan.move||plan.routes.length||plan.wildcard);
  return {ok:true,read:askStr(data.read,240),findings,mentions,plan:said?plan:null};
}
/* ---- a figure the model wrote, read back against the record.
 * The brief is built from the taste model's own values, so when the model
 * answers "Alchemy fermentation 9.0/9, n=3" it is echoing one of them back.
 * That means the string can be resolved to the item it came from — and only
 * a figure that resolves earns the tap that opens the cups underneath it.
 * One that doesn't stays plain text, because there is nothing behind it to
 * open, and a door onto nothing is worse than no door.
 *
 * It doubles as the honesty gate on the way back: a figure the record cannot
 * produce simply never becomes a door, whatever the model claimed.
 *
 * Longest match wins, so "Anaerobic washed" is never read as "Washed", and
 * both sides are matched on whole folded words, so "tea" is not found inside
 * "cleaner". */
function matchFigure(text,tm){
  const t=' '+fold(text)+' ';
  if(!tm||t==='  ')return null;
  let best=null;
  const consider=(kind,value)=>{
    const v=fold(value);
    if(!v||t.indexOf(' '+v+' ')===-1)return;
    if(!best||v.length>best.v.length)best={kind,value:String(value),v};
  };
  (tm.bar&&tm.bar.anchors||[]).forEach(a=>consider('anchor',a.name));
  ['descriptors','processes','origins','roast'].forEach(k=>
    ((tm.vector&&tm.vector[k])||[]).forEach(x=>consider(k,x.value)));
  return best?{kind:best.kind,value:best.value}:null;
}
/* ==== /pure ==== */
/* ============ your taste — the hunt, folded into the Atlas ============
 * Scout was a room whose output was geography, so it stopped being a room: it
 * reads from the Atlas ("Your taste") and from the Journal, and everything it
 * argued still argues here — the bar, the vector, the brief, the ask, the year.
 * The rule it was built on is untouched: no figure without its reasons.
 */
function vTaste(){
  const cups=live('cups').filter(c=>c.score!=null);
  const head=`<header class="shdr" style="align-items:center;gap:14px">
    ${backMiniHTML('bare','flex:none')}
    <div style="flex:1;min-width:0">
      <div class="eyebrow" style="margin-bottom:4px">${cups.length?`Read from ${cups.length} cup${cups.length===1?'':'s'}`:'Nothing read yet'}</div>
      <div class="display" style="font-size:1.5rem;margin:0">Your taste, <em>argued</em></div>
    </div>
  </header>`;
  if(!cups.length){
    return `<div>${head}<div class="pad" style="padding-top:20px">
      <div class="lede">The brief reads the record — log a few cups first, and there'll be something to argue from.</div>
      <button class="btn btn-quiet" onclick="go('journal')">To the journal</button>
    </div></div>`;
  }
  const tm=tasteModelMemo();
  const anchor=tm.bar.anchors[0];
  const notice=tm.vector.descriptors[0];
  const proc=tm.vector.processes;
  // the argument, read as a sentence rather than shown as a dashboard: every
  // figure in it is a door to the cups it was read from, and nothing is drawn
  // as a meter — a bar chart of your own taste is a fitness app's idea of one.
  const fig=(text,call)=>`<button class="fig" onclick="${call}">${esc(text)}</button>`;
  // a stated value read back inside a sentence: a plain word joins the prose in
  // lower case, anything carrying its own capitals is left exactly as written
  const soft=s=>/[A-Z]/.test(String(s).slice(1))?String(s):String(s).charAt(0).toLowerCase()+String(s).slice(1);
  const claims=[
    tm.bar.floor!=null?`A café earns the walk at ${fig(`${tm.bar.floor} or better`,'openBarEvidence()')}.`:null,
    anchor?`You keep going back to ${fig(anchor.name,`openAnchorEvidence(${jsq(anchor.name)})`)}.`:null,
    notice?`What you notice first, and most, is ${fig(soft(notice.value),`openVectorEvidence('descriptors',${jsq(notice.value)})`)}${
      proc.length>1?` — and it is ${fig(soft(proc[0].value),`openVectorEvidence('processes',${jsq(proc[0].value)})`)}, not ${esc(soft(proc[1].value))}, that keeps earning it`:''}.`:null,
  ].filter(Boolean).join(' ');
  return `<div>${head}
  <div class="pad" style="padding-top:20px">
    <div style="font-family:var(--serif);font-size:21px;line-height:1.5;color:var(--ink);max-width:30ch">${claims||'Not enough yet to argue from.'}</div>
    <div style="font-family:var(--serif);font-style:italic;font-size:14px;color:var(--ink-3);margin-top:14px;max-width:34ch">Tap any figure for the cups it was read from. No number here travels without its reasons.</div>

    <div class="shead" style="margin-top:32px"><span class="l">The bar</span>
      <span class="r">a roaster earns a line at 8+ over two cups</span></div>
    ${tm.bar.anchors.length?tm.bar.anchors.slice(0,5).map(a=>`
      <button class="rowlink" style="padding:14px 0;align-items:baseline" onclick="openAnchorEvidence(${jsq(a.name)})">
        <span style="min-width:0">
          <span style="display:block;font-family:var(--serif);font-size:17px">${esc(a.name)}</span>
          <span class="m" style="display:block;margin-top:2px">${a.n} cup${a.n===1?'':'s'}, none under ${Math.min(...a.cupRefs.map(id=>{const c=cupById(id);return c&&c.score!=null?c.score:9}))}</span>
        </span>
        <span class="num" style="flex:none;font-size:22px;font-weight:600">${a.avg.toFixed(1)}</span>
      </button>`).join('')
      :'<div class="muted" style="padding:12px 0">No anchors yet — a roaster earns one at 8+ over two cups.</div>'}

    <div class="shead"><span class="l">What earns your scores</span><span class="r">weighted, out of nine</span></div>
    ${vectorRowHTML('Notice','descriptors',tm.vector.descriptors)}
    ${vectorRowHTML('Process','processes',tm.vector.processes)}
    ${vectorRowHTML('Origin','origins',tm.vector.origins)}
    ${vectorRowHTML('Roast','roast',tm.vector.roast)}

    <div class="box firm" style="margin-top:30px">
      <div class="eyebrow">The brief</div>
      <div class="lede" style="margin-bottom:16px;max-width:34ch">Everything above, cut down to what a stranger would need to find you a café. Read it before it goes anywhere.</div>
      <button class="btn btn-quiet" style="min-height:48px" onclick="openBriefScreen()">Prepare the brief →</button>
    </div>
    ${askSectionHTML()}
    ${yearSectionHTML()}
    <div class="note" style="margin-top:22px">Read from your cups alone. Nothing here is averaged with anyone else’s, and nothing leaves this device unless you send it.</div>
  </div></div>`;
}
/* ---- the reasons, one gesture away (the law: a score never travels without
 * them). Each sheet names the rule it read, then lists the cups themselves —
 * the evidence, not a restatement of the figure. ---- */
function evidenceSheet(title,sub,rows,note){
  openSheet(`<h3>${esc(title)}</h3>
  <div class="sub">${esc(sub)}</div>
  ${rows.length?rows.map(r=>`<div class="row" style="padding:12px 0;border-bottom:1px solid var(--line)">
    <span style="min-width:0">
      <span style="display:block;font-family:var(--serif);font-size:16.5px">${esc(r.t)}</span>
      <span style="display:block;font-family:var(--sans);font-size:12px;color:var(--ink-3);margin-top:2px">${esc(r.m)}</span>
    </span>
    <span class="num" style="flex:none;font-size:20px;font-weight:600">${esc(r.v)}</span>
  </div>`).join(''):'<div class="empty">Nothing read yet.</div>'}
  <div class="note">${esc(note)}</div>`);
}
// a cup, said the way the evidence needs it: what it was, where and when
function cupEvidenceRow(c){
  const place=c.kind==='bar'?placeById(c.placeRef):null;
  return {t:coffeeLabel(coffeeById(c.coffeeRef)),
    m:[place?place.name:'at home',fmtWhen(c.at)].filter(Boolean).join(' · '),
    v:c.score==null?'—':String(c.score)};
}
function openBarEvidence(){
  const tm=tasteModelMemo();
  const rows=live('places').map(p=>{
    const cups=placeCups(p.id);
    return {p,cups,avg:placeAvg(p.id)};
  }).filter(x=>x.cups.length).sort((a,b)=>b.avg-a.avg).map(x=>({
    t:x.p.name,
    m:`${x.cups.length} cup${x.cups.length===1?'':'s'} · ${x.cups.length>1?`returned ${words(x.cups.length-1)} time${x.cups.length===2?'':'s'}`:'not returned to'}`,
    v:trimNum(x.avg),
  }));
  evidenceSheet(tm.bar.floor!=null?`Why ${words(tm.bar.floor)}`:'The bar',
    'The floor is the middle of every café cup on your record — the score a café has to clear to be worth the walk.',
    rows,'The floor moves when you do. It is not a target — it is what your own record already shows.');
}
function openAnchorEvidence(name){
  const tm=tasteModelMemo();
  const a=tm.bar.anchors.find(x=>fold(x.name)===fold(name));
  const cups=(a?a.cupRefs:[]).map(cupById).filter(Boolean).sort(byWhen);
  evidenceSheet(a?`${a.name}, ${a.avg.toFixed(1)}`:name,
    a?`${capFirst(words(a.n))} cup${a.n===1?'':'s'} on the record. None of them under ${Math.min(...cups.map(c=>c.score==null?9:c.score))}.`:'',
    cups.map(cupEvidenceRow),
    'A roaster earns a line at eight or better over two cups. Nothing here is averaged with anyone else’s cups.');
}
const VECTOR_RULES={
  descriptors:'A descriptor earns its weight from the scores of the cups that carry it, never from how often you typed it.',
  processes:'A process is weighed by the cups made from it — the record states what it read on the bag, and nothing more.',
  origins:'An origin is weighed by its own cups. A country you have drunk twice is not ranked against one you have drunk twenty times.',
  roast:'Roast is read only where a bag or a menu stated it plainly. Unread cups are left out, never counted as medium.',
};
function openVectorEvidence(kind,value){
  const tm=tasteModelMemo();
  const item=(tm.vector[kind]||[]).find(x=>fold(String(x.value))===fold(String(value)));
  const cups=(item?item.cupRefs:[]).map(cupById).filter(Boolean).sort(byWhen);
  evidenceSheet(item?`${capFirst(String(item.value))}, ${item.weight.toFixed(1)}`:String(value),
    item?`${capFirst(words(item.n))} cup${item.n===1?'':'s'} carry it. This is their weight, and the cups themselves.`:'',
    cups.map(cupEvidenceRow),VECTOR_RULES[kind]||'');
}
// where the ask was pointed, said the way the keeper pointed it — a route is
// walked, a point is stood at, a city is arrived in
const ASK_PREP={route:'on the road to',near:'near',friend:'through'};
/* an ask, as a leaf of the record (Phase 28). The café Carta actually found is
 * the title, because the brand is what you'd recognise at the counter and the
 * destination is only where you were standing; the destination steps down to
 * the eyebrow. What the pick is best FOR — the model's own five words — sets
 * in italic under it, and the reading of how the ground lies is the body.
 * The quantities the old meta line ran together survive as facts, where a fact
 * can be read rather than scanned past.
 *
 * The seal is the ground the answer actually stands on: the country holding the
 * names that were confirmed, with the ask's own point marked on it. Where the
 * belt has no outline for it, no seal is drawn and the eyebrow starts the row —
 * the same refusal every other listing makes. */
function askRowHTML(a){
  const named=askNamed(a);
  const grounded=named.filter(f=>f.grounded);
  const been=named.filter(f=>f.status==='been'||f.status==='booked').length;
  const top=(a.findings||[])[0]||named[0]||null;
  const rest=named.filter(f=>f!==top).map(f=>f.name).filter(Boolean);
  const also=rest.length
    ?rest.slice(0,2).join(' · ')+(rest.length>2?` · ${words(rest.length-2)} more`:'')
    :'';
  const at=meanPin(grounded.map(f=>f.lat!=null&&f.lon!=null?{lat:f.lat,lon:f.lon}:null));
  const key=at?landAt(at):null;
  const seal=key?sealHTML(key,at):'';
  // named and drawn are two states. The name comes off the record three ways,
  // finest first: a café this ask placed and you have since marked, the city
  // it was asked about, and the belt. The belt only DRAWS the countries it
  // carries, so an ask outside them is titled from the record and says plainly
  // that its country isn't a shape the file holds. Berlin was that case until
  // Phase 29 · A put Germany in the belt; the next one along still is.
  const country=grounded.map(f=>{const q=f.placeRef&&placeById(f.placeRef);return q&&q.country}).find(Boolean)
    ||grounded.map(f=>f.city&&cityCountry(f.city)).find(Boolean)
    ||(key?landLabel(key):'');
  const said=(a.read||(a.plan&&a.plan.move)||'').trim();
  return `<button class="lcard" onclick="openAskResultScreen('${a.id}')">
    <span class="head${seal?'':' bare'}">
      ${seal}
      <span class="eyeb">Found ${esc(ASK_PREP[a.kind]||'in')} ${esc(a.destination)}</span>
      <span class="when">${esc(fmtDay(a.createdAt))}</span>
    </span>
    <span class="n">${esc(top?top.name:a.destination)}</span>
    ${top&&top.verdict?`<span class="sub">${esc(top.verdict)}</span>`:''}
    ${said?`<span class="said">${esc(said)}</span>`:''}
    <span class="facts">
      ${also?`<span class="fact"><span class="k">Also named</span><span class="v">${esc(also)}</span></span>`:''}
      <span class="fact">
        <span class="k">${capFirst(words(grounded.length))} placed</span>
        ${been?`<span class="v">${words(been)} walked since</span>`
          :'<span class="v quiet">not walked yet</span>'}
      </span>
      ${seal||!grounded.length?'':`<span class="fact">
        <span class="k">${esc(country||'The ground')}</span>
        <span class="v fall">no outline on file — listed, not drawn</span>
      </span>`}
    </span>
  </button>`;
}
function askSectionHTML(){
  const asks=D.asks.slice().sort(byNew);
  if(!asks.length)return '';
  return `<div class="shead over"><span class="l">What Carta found</span><span class="r">${words(asks.length)} ask${asks.length===1?'':'s'} · tap to reopen</span></div>
  ${asks.map(askRowHTML).join('')}`;
}
function yearSectionHTML(){
  const years=knownYears();
  if(!years.length)return '';
  return `<div class="shead"><span class="l">The year</span></div>
  <div class="lede" style="margin-top:10px">A card for the year — cups kept, the roasters you kept reaching for.</div>
  <label class="f"><span class="l">Year</span><select id="year_pick">
    ${years.map(y=>`<option value="${y}">${y}</option>`).join('')}
  </select></label>
  <button class="btn btn-quiet" onclick="shareYearCard(Number(val('year_pick')))">Share this year</button>`;
}
/* a figure and the reasons under it — a ledger row, not a meter. The lead
 * value, its weight set in tabular figures against the nine-point scale it was
 * scored on, and what came next in the same line. The bar this used to draw
 * was a chart of one number: it said less than the number and read like a
 * dashboard, which is the one register this record refuses. */
function vectorRowHTML(label,kind,items){
  if(!items||!items.length)return '';
  const lead=items[0];
  const rest=items.slice(1,3).map(i=>`${esc(i.value)} ${i.weight.toFixed(1)}`).join(' · ');
  const unread=live('cups').filter(c=>c.score!=null).length-items.reduce((s,i)=>s+i.n,0);
  return `<button class="rowlink" style="padding:15px 0;display:block" onclick="openVectorEvidence(${jsq(kind)},${jsq(String(lead.value))})">
    <span style="display:flex;align-items:baseline;justify-content:space-between;gap:12px">
      <span class="eyebrow" style="margin:0">${esc(label)}</span>
      <span style="display:flex;align-items:baseline;gap:12px">
        <span style="font-family:var(--serif);font-size:18px">${esc(lead.value)}</span>
        <span class="num" style="font-size:16px;min-width:34px;text-align:right">${lead.weight.toFixed(1)}</span>
      </span>
    </span>
    <span class="m" style="display:block;margin-top:6px">over ${lead.n} cup${lead.n===1?'':'s'}${rest?' · '+rest:''}${
      kind==='roast'&&unread>0?` · unread on ${unread}`:''}</span>
  </button>`;
}
/* ============ the brief — a screen, and what actually goes out ============
 * It was a sheet with a wall of text in it: the one thing in Carta that leaves
 * the device, shown as an unread block of plain text with Copy under it. It is
 * a screen now, and it states what goes out in four named parts before it ever
 * shows the raw text — which is folded away, exact, and one tap open for
 * anyone who wants to read every character of it.
 */
function briefScopeOf(view){
  const id=(view&&view.scopeId)||'';
  return id?{kind:'city',id}:{kind:null,id:null};
}
function vBrief(_id,view){
  const scope=briefScopeOf(view);
  const tm=tasteModelMemo();
  const text=briefPlainText(D,scope.kind,scope.id,tm);
  const cities=knownCities();
  const scoped=scope.kind?tm.scope(scope.kind,scope.id):null;
  const v=tm.vector;
  const families=[['Notice',v.descriptors],['Process',v.processes],['Origin',v.origins],['Roast',v.roast]].filter(f=>f[1].length);
  const cafesInScope=scope.kind==='city'?cityPlaces(scope.id).length:live('places').length;
  const soft=s=>/[A-Z]/.test(String(s).slice(1))?String(s):String(s).charAt(0).toLowerCase()+String(s).slice(1);
  const barLines=(tm.bar.floor!=null?1:0)+(tm.bar.anchors.length?1:0);
  const parts=[
    {title:'The bar',count:`${barLines} line${barLines===1?'':'s'}`,
     body:tm.bar.floor!=null
       ?`A café earns the walk at ${tm.bar.floor} or better${tm.bar.anchors.length?` — and the ${words(Math.min(5,tm.bar.anchors.length))} roaster${tm.bar.anchors.length===1?'':'s'} you keep going back to`:''}.`
       :'Nothing yet — a floor needs café cups to be read from.'},
    {title:'What earns your scores',count:`${families.length} line${families.length===1?'':'s'}`,
     body:families.length?`${families.map(f=>soft(f[1][0].value)).join(', ')} — each with the number of cups behind it.`:'Nothing scored yet.'},
    {title:'Already had',count:scoped?`${scoped.had.length} coffee${scoped.had.length===1?'':'s'} · ${cafesInScope} café${cafesInScope===1?'':'s'}`:'not sent',
     body:scoped
       ?'Excluded by name, so the answer is not a rehash of your own record.'
       :'Only a scoped brief lists what you have already had. Everywhere is too much to send, so nothing is excluded by name.'},
    {title:'The scope',count:scope.id||'Everywhere',
     body:scope.id?'Only the cups logged in scope inform the ask. Everything else stays home.':'Every cup on the record informs it.'},
  ];
  return `<div>
    <header class="shdr" style="align-items:center;gap:14px">
      ${backMiniHTML('bare','flex:none')}
      <div style="flex:1;min-width:0">
        <div class="eyebrow" style="margin-bottom:4px">Prepared from your record</div>
        <div class="display" style="font-size:1.5rem;margin:0">The brief</div>
      </div>
    </header>
    <div class="pad" style="padding-top:20px">
      <div class="eyebrow" style="margin-bottom:9px">Scoped to</div>
      <div class="picks">
        <button class="pick${scope.id?'':' on'}" onclick="openBriefScreen('')">Everywhere</button>
        ${cities.map(c=>`<button class="pick${fold(c)===fold(scope.id||'')?' on':''}" onclick="openBriefScreen(${jsq(c)})">${esc(c)}</button>`).join('')}
      </div>

      <div class="shead"><span class="l">What goes out</span><span class="r">${words(parts.length)} parts</span></div>
      ${parts.map(p=>`<div style="border-bottom:1px solid var(--line);padding:15px 0">
        <div class="row"><span style="font-family:var(--serif);font-size:17px">${esc(p.title)}</span>
          <span class="num" style="font-size:12px;color:var(--ink-3)">${esc(p.count)}</span></div>
        <div style="font-family:var(--serif);font-size:15.5px;line-height:1.5;color:var(--ink-2);margin-top:5px;max-width:36ch">${esc(p.body)}</div>
      </div>`).join('')}

      <button class="rowlink" style="padding:15px 0" onclick="toggleBriefText()">
        <span class="eyebrow" style="margin:0">The exact text</span>
        <span class="m" id="brief_raw_toggle">show · ${text.length} characters</span>
      </button>
      <div id="brief_raw" hidden data-len="${text.length}" style="border:1px solid var(--line);background:var(--surface-page);padding:14px 16px;margin-top:12px;
        font-family:var(--mono);font-size:12px;line-height:1.65;color:var(--ink-2);white-space:pre-wrap;max-height:260px;overflow-y:auto">${esc(text)}</div>

      <div class="btnrow" style="margin-top:22px">
        <button class="btn btn-primary" style="min-height:48px" onclick="openAskScreen()">Ask Carta</button>
        <button class="btn btn-quiet" style="flex:none;width:auto;padding:0 16px;min-height:48px" onclick="copyBrief()">Copy</button>
        <button class="btn btn-quiet" style="flex:none;width:auto;padding:0 16px;min-height:48px" onclick="downloadBriefPage('${scope.kind||''}','${esc(scope.id||'')}')">Keep</button>
      </div>
      <div class="note" style="margin-top:20px">Copy and Keep are strictly offline — nothing here calls out on its own. Ask Carta is the one door that does, with your own key, only when you tap it.</div>
    </div></div>`;
}
// the raw text opens in place: a disclosure that re-rendered the screen would
// send you back to the top of it, which is a strange way to be shown a detail
function toggleBriefText(){
  const box=document.getElementById('brief_raw'),lbl=document.getElementById('brief_raw_toggle');
  if(!box||!lbl)return;
  const opening=box.hasAttribute('hidden');
  if(opening)box.removeAttribute('hidden');else box.setAttribute('hidden','');
  lbl.textContent=`${opening?'hide':'show'} · ${box.dataset.len} characters`;
}
function copyBrief(){
  const scope=briefScopeOf(pageView);
  copyPlainText(briefPlainText(D,scope.kind,scope.id,tasteModelMemo()),'Copied — paste it into your chat.');
}
/* ============ the ask — scout, stage two (ROADMAP.md Phase 7) ============
 * The one sanctioned outbound call (ARCHITECTURE.md §7): the keeper's own
 * Anthropic key, kept in prefs on this device only, sent to nobody but
 * Anthropic and only when "Ask Carta" is tapped. No key, or the call fails —
 * the degrade is the brief, copied, exactly like stage one. Every café the
 * model names is checked against a real place lookup (Nominatim, keyless)
 * before it's ever drawn as a pin — what can't be confirmed is listed, never
 * guessed onto the frame (the grounding rule, non-negotiable). */
const ASK_MODEL_DEFAULT='claude-opus-5';
// the ask is an argument, not a list: 1024 tokens was the ceiling the first
// answers were hitting, and a truncated argument reads exactly like a thin one
const ASK_MAX_TOKENS=8000;
const askKey=()=>getPref('askKey','');
const askModel=()=>getPref('askModel','')||ASK_MODEL_DEFAULT;
function openAskKey(){
  openSheet(`<h3>Your key</h3>
  <div class="sub">An Anthropic API key, kept on this device only — nothing else ever reads it, and it's never sent anywhere but Anthropic, only when you tap Ask.</div>
  <label class="f"><span class="l">API key</span><input type="password" id="ask_key_input" value="${esc(askKey())}" placeholder="sk-ant-…"></label>
  <label class="f"><span class="l">Model <span class="opt">optional</span></span><input type="text" id="ask_model_input" value="${esc(getPref('askModel',''))}" placeholder="${ASK_MODEL_DEFAULT}"></label>
  <div class="btnrow">
    ${askKey()?`<button class="btn btn-quiet" onclick="clearAskKey()">Remove key</button>`:''}
    <button class="btn btn-primary" onclick="saveAskKey()">Save</button>
  </div>
  <div class="note" style="margin-top:16px">A key comes from <a class="text-action" style="color:var(--ink-2)" href="https://console.anthropic.com" target="_blank" rel="noreferrer">console.anthropic.com</a> — a few dollars of credit goes a long way. It lives on this device and is sent to nobody but Anthropic, only when you ask.</div>`);
}
function saveAskKey(){
  setPref('askKey',val('ask_key_input'));
  setPref('askModel',val('ask_model_input'));
  closeSheet();
  toast('Saved — on this device only.');
  // v7.35.0, critique rec 6: this used to end at the ask screen whatever had
  // opened it, so setting the key from Your record threw the keeper into an
  // errand they had not started. It resumes what was interrupted, and where
  // nothing was interrupted it repaints the page they are standing on.
  if(pageView&&pageView.kind==='ask')render();
  else if(_askResume){const f=_askResume;_askResume=null;setTimeout(f,60)}
  else render();
}
// the errand an ask-key sheet interrupted, held so the save can finish it —
// set from inside the errand's own no-key guard, the way vizResumeAfterSignIn is
let _askResume=null;
function askResumeAfterKey(f){_askResume=f}
function clearAskKey(){setPref('askKey','');setPref('askModel','');openAskKey();}
/* ============ the ask — a screen, with the door named on it ============
 * The one thing in Carta that calls out, so the screen says so twice: the key
 * it would use is stated as a fact on the page, and the degrade — no key, or
 * a call that fails — is stated under the button before it is ever tapped.
 */
const ASK_KINDS=[['city','A city'],['neighborhood','A neighborhood'],['near','Near a point'],['country','A country'],['route','A route'],['friend',"A friend's taste"]];
// how far the keeper will actually go. Without it "worth driving for" is a
// dodge; with it, it's an answer — so it rides on every ask that has a centre.
const ASK_REACH=['on foot','a short drive','worth driving for'];
const REACH_KINDS=new Set(['city','neighborhood','near']);
let askDraft={kind:'city',dest:'',question:'',reach:'a short drive'};
function openAsk(){openAskScreen()}
// a chip that re-renders the screen must not drop what has already been typed
function captureAskDraft(){
  const d=document.getElementById('ask_dest'),q=document.getElementById('ask_question');
  if(d)askDraft.dest=d.value;
  if(q)askDraft.question=q.value;
}
function pickAskKind(k){captureAskDraft();askDraft.kind=k;render()}
function pickAskReach(r){captureAskDraft();askDraft.reach=r;render()}
const askReach=()=>REACH_KINDS.has(askDraft.kind)?askDraft.reach:'';
/* the scope an ask resolves to — a city the record already knows by name, or a
 * country named outright. Read here so the composer can state what will be
 * excluded before the key is spent, and read again by runAsk, so the ledger on
 * the screen and the brief that actually leaves are the same document. */
function askScopeOf(kind,destination){
  const dest=(destination||'').trim();
  if(!dest)return {kind:null,id:null};
  const knownCity=knownCities().find(c=>fold(c)===fold(dest));
  if((kind==='city'||kind==='near')&&knownCity)return {kind:'city',id:knownCity};
  if(kind==='country')return {kind:'country',id:dest};
  return {kind:null,id:null};
}
/* what goes out with this ask, stated as a ledger before it leaves — the four
 * parts of the brief, each read from the record as it stands right now. Where
 * the record is silent the row says unread rather than guessing a value into
 * it, and the whole block opens the brief itself, exact text and all. */
function askLedgerRowsHTML(){
  const tm=tasteModelMemo();
  const scope=askScopeOf(askDraft.kind,askDraft.dest);
  const scoped=scope.kind?tm.scope(scope.kind,scope.id):null;
  // a list, not a sentence: every value stands as the record spells it, so a
  // country keeps its capital and a descriptor keeps its lower case
  const v=tm.vector;
  const values=[v.descriptors[0],v.processes[0],v.origins[0],v.roast[0]].filter(Boolean).map(x=>String(x.value));
  const anchors=Math.min(5,tm.bar.anchors.length);
  const had=scoped?scoped.had.length:0;
  const rows=[
    ['The bar',tm.bar.floor!=null
      ?`${tm.bar.floor} or better${anchors?`, ${words(anchors)} anchor${anchors===1?'':'s'}`:''}`
      :'unread — no café cup has set a floor',tm.bar.floor==null],
    ['Your scores',values.length?values.join(' · '):'unread — nothing scored yet',!values.length],
    ['Already had',had?`${words(had)} coffee${had===1?'':'s'} excluded by name`:'not sent — nothing excluded by name',!had],
    ['The scope',scope.id?`${scope.id}, read from every cup`:'every cup on the record',false],
  ];
  return rows.map(r=>`<div class="r"><span class="k">${esc(r[0])}</span><span class="v${r[2]?' unread':''}">${esc(r[1])}</span></div>`).join('');
}
// the ledger follows the destination as it is typed, without re-reading the
// whole screen — a chip that re-renders under a thumb mid-tap loses the tap
function paintAskLedger(){
  const box=document.getElementById('ask_led');
  if(box)box.innerHTML=askLedgerRowsHTML();
}
function openAskBrief(){
  captureAskDraft();
  const scope=askScopeOf(askDraft.kind,askDraft.dest);
  openBriefScreen(scope.kind==='city'?scope.id:'');
}
function vAsk(){
  const key=askKey();
  return `<div>
    <div class="pad" style="padding-top:18px">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:26px">
        ${backMiniHTML('bare','flex:none;margin-left:-4px')}
        <span class="eyebrow" style="margin:0">Sent with your brief</span>
      </div>
      <div class="eyebrow" style="color:var(--accent);margin-bottom:10px">Ask Carta</div>
      <input type="text" id="ask_dest" value="${esc(askDraft.dest)}" aria-label="Where"
        oninput="askDraft.dest=this.value;paintAskLedger()"
        placeholder="${askDraft.kind==='friend'?'She likes what I like, but darker':askDraft.kind==='near'?'Huntington Park':'Lisbon'}"
        style="width:100%;font-family:var(--serif);font-weight:600;font-size:1.875rem;letter-spacing:-.02em;line-height:1.12;padding:2px 0 12px;border:0;border-bottom:1px solid var(--ink-3)">

      <div class="eyebrow" style="margin:24px 0 9px">What kind of ask</div>
      <div class="picks">
        ${ASK_KINDS.map(k=>`<button class="pick${askDraft.kind===k[0]?' on':''}" onclick="pickAskKind('${k[0]}')">${esc(k[1])}</button>`).join('')}
      </div>

      ${REACH_KINDS.has(askDraft.kind)?`<div class="eyebrow" style="margin:22px 0 9px">How far you'll go</div>
      <div class="picks">
        ${ASK_REACH.map(r=>`<button class="pick${askDraft.reach===r?' on':''}" onclick="pickAskReach('${jsq(r)}')">${esc(r)}</button>`).join('')}
      </div>`:''}

      <label class="f" style="margin-top:24px"><span class="l">Anything else <span class="opt">optional</span></span>
        <textarea id="ask_question" style="min-height:64px" placeholder="Three days in Baixa and Alfama, mostly on foot…">${esc(askDraft.question)}</textarea></label>

      <div class="shead" style="margin-top:8px"><span class="l">What goes out with this</span><span class="r">tap to read it in full</span></div>
      <button class="led" id="ask_led" style="margin-top:14px" onclick="openAskBrief()">${askLedgerRowsHTML()}</button>

      <div class="box" style="margin-top:14px;padding:14px 16px;display:flex;align-items:baseline;justify-content:space-between;gap:12px">
        <span style="font-family:var(--serif);font-size:15.5px;color:var(--ink-2)">${key?'Your key is on this device':'No key on this device yet'}</span>
        <button class="text-action" style="flex:none;background:none;border:0;font-family:var(--sans);font-size:12px;cursor:pointer" onclick="openAskKey()">${key?'Change it':'Set one'}</button>
      </div>
      ${asktrustHTML()}
      <button class="btn btn-primary" style="margin-top:16px;min-height:54px" onclick="runAsk()">Ask Carta</button>
      <div class="note" style="margin-top:18px">The only thing in Carta that calls out, and only when you tap it. No key, or the call fails, and you get the same brief to copy.</div>
    </div></div>`;
}
// the one door — content is either a plain prompt string (the ask) or a
// content-block array carrying an image plus a prompt (the menu's OCR). The
// ceiling is the caller's: an OCR is a list of lines, an ask is an argument,
// and 1024 tokens is what made the ask's answers read like a stub. A thinking
// block, on a model that reasons by default, has no .text — so the join below
// silently drops it and the parse only ever sees what was actually said.
async function callModel(content,maxTokens,signal,tools){
  const key=askKey();if(!key)throw new Error('Set your key first.');
  const body={model:askModel(),max_tokens:maxTokens||1024,messages:[{role:'user',content}]};
  if(tools)body.tools=tools;   // server-side tools (e.g. web search) — results land back in this same response
  const r=await fetch('https://api.anthropic.com/v1/messages',{
    method:'POST',
    headers:{'content-type':'application/json','x-api-key':key,'anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true'},
    body:JSON.stringify(body),
    signal:signal||undefined,
  });
  if(!r.ok){
    let msg=`The model call failed (${r.status}).`;
    try{const j=await r.json();if(j&&j.error&&j.error.message)msg=j.error.message}catch(e){}
    throw new Error(msg);
  }
  const j=await r.json();
  return (j.content||[]).map(b=>b.text||'').join('');
}
// the ask's own call is the one the keeper can walk away from — Cancel on the
// wait aborts it where the browser allows, rather than letting it land unseen
const callAskModel=prompt=>callModel(prompt,ASK_MAX_TOKENS,_askAbort&&_askAbort.signal);
async function callVisionModel(prompt,imageDataUri){
  const m=String(imageDataUri||'').match(/^data:([^;]+);base64,([\s\S]*)$/);
  if(!m)throw new Error('Could not read that photo.');
  return callModel([{type:'image',source:{type:'base64',media_type:m[1],data:m[2]}},{type:'text',text:prompt}]);
}
let _askBusy=false;
// grounding is one keyless Nominatim lookup per name, and there are more names
// to place now — the findings, the ones named only to be talked out of, and the
// wildcard. So it paces itself a second apart, the way geocodeCityPlaces does,
// and the progress line says which name it's on rather than sitting on "Asking…"
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function groundNamed(list,fallbackCity,say,onPlaced){
  const out=[];
  for(let i=0;i<list.length;i++){
    if(_askCancel)break;
    const f=list[i];
    const city=f.city||fallbackCity||'';
    if(i)await sleep(1000);
    if(say)say(`Placing ${f.name}…`);
    const geo=await geocodeCafe(f.name,f.neighborhood||'',city);
    // the confirmed area outranks the model's own — one was looked up, the
    // other was written from memory, and only one of them placed the pin
    const rec=Object.assign({},f,{id:uid(),city,lat:geo?geo.lat:null,lon:geo?geo.lon:null,
      neighborhood:(geo&&geo.hood)||f.neighborhood||'',
      grounded:!!geo,status:null,placeRef:null});
    out.push(rec);
    // the pin lands on the wait's own plot as the address confirms it, so the
    // answer is already half-drawn by the time it is read
    if(onPlaced)onPlaced(rec);
  }
  return out;
}
/* ============ the wait — narrated, on one hairline ============
 * The ask ran under the button that started it, saying "Asking…" into a grey
 * line: the one call Carta makes read like a form submitting. It is a screen of
 * its own now, and it narrates the work rather than performing patience — every
 * line is a stage the ask actually reached, read off the record it is reading
 * (VOICE.md: never fabricate precision — the counts here are counted, the floor
 * is the floor, and no line is written until the thing it says is true).
 *
 * The rule is the progress bar, and it is a hairline on purpose. The three
 * quick reads are the first fifth of it; the model's own thinking is the long
 * middle, where only the ember tip moves, breathing; the placings fill the rest
 * one name at a time, and each confirmed name lands on the plot as it does. So
 * the bar never runs backwards when the answer turns out to name eight places
 * instead of five — the ground it covers was allotted before the names arrived.
 */
let askRun=null;          // {dest,kind,done[],now,pct,pins[],error}
let _askCancel=false,_askAbort=null;
const ASK_PCT_ASKING=22,ASK_PCT_READBACK=48,ASK_PCT_PLACED=96;
function askBegin(destination,kind){
  askRun={dest:destination,kind,done:[],now:'',pct:0,pins:[],error:null};
  _askCancel=false;
  _askAbort=(typeof AbortController==='function')?new AbortController():null;
  openAskingScreen();
}
// a stage reached: what was current drops to a footnote, the new line is
// written in, and the rule fills to where the work has actually got to
function askSay(line,pct){
  if(!askRun||_askCancel)return;
  if(askRun.now)askRun.done.push(askRun.now);
  askRun.now=line;
  if(pct!=null)askRun.pct=Math.max(askRun.pct,Math.round(pct));
  paintAsking();
}
// a name that came back with real ground under it — drawn the moment it does
function askPlace(f){
  if(!askRun||_askCancel||!f||f.lat==null||f.lon==null)return;
  askRun.pins.push({id:f.id||'',name:f.name||'',lat:f.lat,lon:f.lon,score:null,dim:false});
  paintAsking();
}
const askNowHTML=()=>`<span class="mk"></span><span class="ln">${esc(askRun?askRun.now:'')}</span>`;
const askPinsJSON=()=>JSON.stringify((askRun?askRun.pins:[]));
function paintAskMap(el){
  if(!askRun||!askRun.pins.length){el.hidden=true;return}
  const first=el.hidden;
  el.hidden=false;
  if(first)el.classList.add('settle');   // the plot writes itself in as it appears
  const plot=el.querySelector('carta-plot');
  if(plot&&!first)plot.setAttribute('pins',askPinsJSON());   // raw JSON — setAttribute does no unescaping
  else el.innerHTML=`<div class="plotwrap" style="position:absolute;inset:0;padding:26px 30px">
      <carta-plot class="plot frame" fit="frame" pins="${esc(askPinsJSON())}" dot="10" labels="off"></carta-plot></div>`;
}
// the screen is repainted in place rather than re-rendered: a re-render would
// remount the plot on every stage and re-run the settle on lines already read
function paintAsking(){
  if(!askRun||!pageView||pageView.kind!=='asking')return;
  const fill=document.getElementById('think_fill');
  if(!fill)return;
  const pct=askRun.pct+'%';
  fill.style.width=pct;
  const tip=document.getElementById('think_tip');if(tip)tip.style.left=pct;
  const done=document.getElementById('think_done');
  if(done)for(let i=done.children.length;i<askRun.done.length;i++){
    const d=document.createElement('div');d.textContent=askRun.done[i];done.appendChild(d);
  }
  const now=document.getElementById('think_now');if(now)now.innerHTML=askNowHTML();
  const map=document.getElementById('think_map');if(map)paintAskMap(map);
}
// cancelling is a real cancel: the call is aborted where the browser allows it,
// the grounding loop stops at the name it is on, and nothing is written down
function cancelAsk(){
  _askCancel=true;_askBusy=false;
  if(_askAbort)try{_askAbort.abort()}catch(e){}
  askRun=null;
  openAskScreen();
}
function vAsking(){
  const r=askRun||{dest:'',kind:'city',done:[],now:'',pct:0,pins:[],error:null};
  const pct=r.pct+'%';
  const scope=askScopeOf(r.kind||askDraft.kind,r.dest||askDraft.dest);
  return `<div class="think">
    <div class="pad" style="padding-top:18px">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:12px">
        <button class="omini bare" style="flex:none;margin-left:-4px" onclick="cancelAsk()" aria-label="Cancel">← Cancel</button>
        <span class="eyebrow" style="margin:0">${r.dest?`Asking about ${esc(r.dest)}`:'Asking'}</span>
      </div>
      <div style="margin-top:34px">
        <div class="rule">
          <span class="fill" id="think_fill" style="width:${pct}"></span>
          <span class="tip${r.error?' stalled':''}" id="think_tip" style="left:${pct}"></span>
        </div>
        <div style="margin-top:30px">
          <div class="done" id="think_done">${r.done.map(l=>`<div>${esc(l)}</div>`).join('')}</div>
          ${r.error?`<div class="empty" style="text-align:left;padding:18px 0 0">${esc(r.error)}</div>
            ${/* rec 6 · every failure surface offers the same try-again, and it is
                 the first thing on it. rec 10 · the brief that degrades to a paste
                 is scoped to the ask that just failed, not to everywhere. */''}
            <button class="btn btn-primary" style="margin-top:14px" onclick="runAsk()">Try again</button>
            <button class="btn btn-quiet" onclick="copyScopedBrief()">Copy the brief instead${scope.id?` — scoped to ${esc(scope.id)}`:''}</button>
            <button class="btn btn-quiet" onclick="openAskScreen()">Back to the ask</button>`
          :`<div class="now" id="think_now">${askNowHTML()}</div>`}
        </div>
      </div>
      <div style="margin-top:auto">
        <div class="mapbox${r.pins.length?' settle':''}" id="think_map" style="height:200px"${r.pins.length?'':' hidden'}>${
          r.pins.length?`<div class="plotwrap" style="position:absolute;inset:0;padding:26px 30px">
            <carta-plot class="plot frame" fit="frame" pins="${esc(askPinsJSON())}" dot="10" labels="off"></carta-plot></div>`:''}</div>
        <div class="note" style="margin-top:18px;border-top-color:transparent">Each name is checked against a real address before it is drawn. What can’t be confirmed is listed, never guessed onto the map.</div>
      </div>
    </div></div>`;
}
// the degrade, scoped the way the ask was: without a key, or after a failure,
// the brief is the answer — and a brief about everywhere is a worse paste than
// a brief about the city that was actually asked about
function copyScopedBrief(){
  const r=askRun||{};
  const scope=askScopeOf(r.kind||askDraft.kind,r.dest||askDraft.dest);
  copyPlainText(briefPlainText(D,scope.kind,scope.id,tasteModelMemo()),
    'Copied — scoped to '+(scope.id||'everywhere')+'. Paste it into your chat.');
}
// what the ask is about to read, said in the record's own figures — three
// counted facts, not three reassurances
function askOpeningLines(tm,scope){
  const cups=live('cups').filter(c=>c.score!=null).length;
  const cafes=live('places').length;
  const countries=Object.keys(tastedCountryMap()).length;
  const parts=[`${words(cups)} cup${cups===1?'':'s'}`,
    cafes?`${words(cafes)} café${cafes===1?'':'s'}`:null,
    countries?`${words(countries)} countr${countries===1?'y':'ies'}`:null].filter(Boolean);
  const anchors=tm.bar.anchors.length;
  const scoped=scope.kind?tm.scope(scope.kind,scope.id):null;
  const had=scoped?scoped.had.length:0;
  return [
    [cups?`Reading your record — ${parts.join(', ')}.`:'Reading your record — nothing scored on it yet.',6],
    [tm.bar.floor!=null
      ?`Weighing the bar you hold: ${tm.bar.floor} or better earns the walk${anchors?`, and ${words(Math.min(5,anchors))} roaster${anchors===1?' earns':'s earn'} a return`:''}.`
      :'No floor on the record yet — the ask goes out on what you notice alone.',12],
    [had
      ?`Excluding the ${words(had)} coffee${had===1?'':'s'} you have already had in ${scope.id} — no rehash.`
      :'Nothing excluded by name — everywhere goes out.',18],
  ];
}
async function runAsk(){
  if(_askBusy)return;
  captureAskDraft();
  // a key typed here comes back to the ask that needed it, rather than leaving
  // the keeper on the composer with the errand unrun (rec 6)
  if(!askKey()){askResumeAfterKey(runAsk);openAskKey();return}
  const kind=askDraft.kind||'city';
  const destination=(askDraft.dest||'').trim();
  const question=(askDraft.question||'').trim();
  const reach=askReach();
  if(!destination){toast('Where should Carta ask about?');return}
  _askBusy=true;
  askBegin(destination,kind);
  const beat=ms=>sleep(_askCancel?0:ms);
  try{
    const tm=tasteModelMemo();
    const scope=askScopeOf(kind,destination);
    for(const [line,pct] of askOpeningLines(tm,scope)){
      askSay(line,pct);
      await beat(reducedMotion()?200:620);
      if(_askCancel)return;
    }
    const briefText=briefPlainText(D,scope.kind,scope.id,tm);
    const prompt=askPromptText(briefText,kind,destination,question,reach);
    askSay('Asking, with your key, this once.',ASK_PCT_ASKING);
    const raw=await callAskModel(prompt);
    if(_askCancel)return;
    const parsed=parseAskJSON(raw);
    // v7.35.0, critique rec 10: an unreadable reply used to fall through as an
    // empty answer — the wait completed, the result screen opened, and it said
    // Carta had found nothing. That is a different and much worse claim than
    // the truth, which is that the model replied in a shape Carta will not
    // stand behind. It fails where every other failure fails: on the wait,
    // with the same two doors out.
    if(!parsed.ok)throw new Error("The answer couldn't be read — the model replied, but not in a shape Carta can stand behind. Nothing was written down.");
    const named=(parsed.findings||[]).length+(parsed.mentions||[]).length
      +((parsed.plan&&parsed.plan.wildcard)?1:0);
    askSay(`Reading the answer back — ${words(named)} name${named===1?'':'s'}, ranked and argued.`,ASK_PCT_READBACK);
    await beat(reducedMotion()?200:700);
    if(_askCancel)return;
    // one line per name, and the pin the moment the address confirms it: the
    // grounding pass was always the slow half, and now it is the readable half
    let placed_=0;
    const say=m=>askSay(m,ASK_PCT_READBACK+(ASK_PCT_PLACED-ASK_PCT_READBACK)*(placed_/Math.max(1,named)));
    const step=f=>{placed_++;askPlace(f)};
    const near=(kind==='city'||kind==='near')?destination:'';
    const findings=await groundNamed(parsed.findings,near,say,step);
    if(_askCancel)return;
    const mentions=await groundNamed(parsed.mentions,near,say,step);
    if(_askCancel)return;
    const plan=parsed.plan?Object.assign({},parsed.plan,
      {wildcard:parsed.plan.wildcard?(await groundNamed([parsed.plan.wildcard],near,say,step))[0]:null}):null;
    if(_askCancel)return;
    const all=findings.concat(mentions,(plan&&plan.wildcard)?[plan.wildcard]:[]);
    const lost=all.filter(f=>!f.grounded);
    askSay(lost.length
      ?(lost.length===1?`${lost[0].name} could not be confirmed — listed, never drawn.`
        :`${capFirst(words(lost.length))} names could not be confirmed — listed, never drawn.`)
      :`Every name confirmed against a real address.`,100);
    const ask={id:uid(),createdAt:new Date().toISOString(),kind,destination,question,reach,
      model:askModel(),read:parsed.read,findings,mentions,plan};
    await beat(reducedMotion()?200:900);
    _askBusy=false;
    if(_askCancel)return;
    // the write waits for the last beat's own cancel check — a cancel this
    // late still meets a fully-grounded answer, but it must still meet nothing
    // written, the same promise every earlier stage of this call already kept
    D.asks.unshift(ask);save();
    askDraft.dest='';   // the ask is on the record now; the field starts clean
    askRun=null;
    openAskResultScreen(ask.id);
  }catch(e){
    _askBusy=false;
    if(_askCancel||(e&&e.name==='AbortError'))return;
    // the degrade is stated where the wait was, with both doors on it
    const msg=(e&&e.message)||'Could not reach the model.';
    // the stage it failed on stays on the page: what was being attempted is
    // half the answer to why it didn't work
    if(askRun){if(askRun.now)askRun.done.push(askRun.now);askRun.error=msg;askRun.now='';}
    if(pageView&&pageView.kind==='asking')render();else toast(msg);
  }
}
/* a finding, set as an entry rather than a card: where it sits in the model's
 * own order, what it is best FOR, where it is, the figures off the brief it was
 * argued from, what to ask for at the counter, and the three marks that put it
 * on your own record. What could not be confirmed says so plainly and is never
 * drawn on the map (the grounding rule, non-negotiable).
 *
 * The number is the order the model argued, not a score Carta computed — plain
 * ink, never the ember. The ember is the 1–9 you gave a cup, and nothing here
 * has been drunk yet.
 */
const FIND_MARKS=[['been','Been'],['booked','Booked'],['skip','Skip']];
const tag=(text,lead)=>`<span class="pick mini tag${lead?' lead':''}">${esc(text)}</span>`;
const marksHTML=f=>`<div class="picks" style="margin-top:12px">
  ${FIND_MARKS.map(m=>`<button class="pick mini${f.status===m[0]?' on':''}" onclick="setFindStatus('${f.id}','${m[0]}')">${m[1]}</button>`).join('')}
</div>`;
const groundHTML=f=>`<span class="ground${f.grounded?'':' no'}">${f.grounded?'placed':'not confirmed'}</span>`;
// the thin ledger-coupled wrapper over the pure matchFigure, the same way
// matchNode wraps matchNodes: a figure the record can open becomes the app's
// own .fig and lands on the very sheet Your taste opens; one it can't stays
// flat. The reader can tell them apart without being told — a door is inked.
const figBacked=s=>matchFigure(s,tasteModelMemo());
function fitFigureHTML(s){
  const m=figBacked(s);
  if(!m)return esc(s);
  const call=m.kind==='anchor'?`openAnchorEvidence(${jsq(m.value)})`:`openVectorEvidence('${m.kind}',${jsq(m.value)})`;
  return `<button class="fig" onclick="${call}">${esc(s)}</button>`;
}
// a model that answers "Compton, Compton" is answering honestly — the area and
// the city are the same place. Saying it twice is Carta's bug, not the model's.
const whereHTML=f=>esc([f.neighborhood,f.city].filter(Boolean)
  .filter((v,i,a)=>a.findIndex(x=>fold(x)===fold(v))===i).join(', ')||'no address could be confirmed');
/* the settle — an answer arrives written, not pasted. Each row is held back a
 * beat longer than the one above it, so the list reads in the order it was
 * argued instead of landing as a wall. Played once, on arrival: marking a
 * finding re-reads this screen and must not write the whole page in again.
 * Under reduced motion nothing is delayed and nothing moves. */
const settleCls=()=>_askSettle?' settle':'';
const settleAt=i=>_askSettle?` style="animation-delay:${(0.12*i).toFixed(2)}s"`:'';
// the same delay, for an element that already carries a style attribute
const settleDelay=i=>_askSettle?`;animation-delay:${(0.12*i).toFixed(2)}s`:'';
// i is the rank the model argued; `order` is only where the row falls in the
// settle, so a mention can go on counting after the last finding
function findingRowHTML(f,i,order){
  const chips=[f.verdict?tag(f.verdict,true):'',f.travel?tag(f.travel):'',f.stale?tag('program rotates'):''].filter(Boolean).join('');
  return `<div class="find${settleCls()}" id="find_${f.id}"${settleAt(order==null?i:order)}>
    <div class="row">
      <span style="font-family:var(--serif);font-size:17.5px"><span class="rk">${i+1}</span>${esc(f.name)}</span>
      ${groundHTML(f)}
    </div>
    <div class="m" style="margin-top:3px">${whereHTML(f)}</div>
    ${chips?`<div class="picks" style="margin-top:9px">${chips}</div>`:''}
    ${f.why?`<div class="say">${esc(f.why)}</div>`:''}
    ${(f.fit&&f.fit.length)?`<div class="m" style="margin-top:6px">${f.fit.map(fitFigureHTML).join(' · ')}</div>`:''}
    ${f.order?`<div class="m" style="margin-top:6px"><span class="k">Ask for</span> ${esc(f.order)}</div>`:''}
    ${marksHTML(f)}
  </div>`;
}
// a place named only so you know it isn't the pick — the same row, one rung
// quieter, and markable all the same: talked out of is not the same as unwanted
function mentionRowHTML(f,i){
  return `<div class="find${settleCls()}" id="find_${f.id}"${settleAt(i)}>
    <div class="row">
      <span style="font-family:var(--serif);font-size:16px;color:var(--ink-2)">${esc(f.name)}</span>
      ${groundHTML(f)}
    </div>
    <div class="m" style="margin-top:3px">${whereHTML(f)}</div>
    ${f.instead?`<div class="say">${esc(f.instead)}</div>`:''}
    ${marksHTML(f)}
  </div>`;
}
// every café an ask named, in one list — the marks, the pins and the taps all
// read through this, so a mention and the wildcard are as markable as a finding
function askNamed(a){
  return (a.findings||[]).concat(a.mentions||[],(a.plan&&a.plan.wildcard)?[a.plan.wildcard]:[]);
}
function askOf(findId){for(const a of D.asks){const f=askNamed(a).find(x=>x&&x.id===findId);if(f)return {a,f}}return null}
function setFindStatus(findId,status){
  const hit=askOf(findId);if(!hit)return;
  const {a,f}=hit;
  f.status=f.status===status?null:status;
  if(f.status&&(f.status==='been'||f.status==='booked')&&!f.placeRef){
    const m=matchNode('places',f.name);
    if(m.exact)f.placeRef=m.exact.id;
    else{const p={id:uid(),createdAt:new Date().toISOString(),name:f.name,city:f.city||'',lat:f.lat,lon:f.lon,aka:[]};D.places.push(p);f.placeRef=p.id;}
  }
  save();
  // the mark changes the map as well as the row — a ring becomes a filled pin —
  // so the whole screen re-reads rather than the row swapping itself in place
  if(pageView&&pageView.kind==='askresult'&&pageView.id===a.id)render();
}
function openAskFinding(findId){
  const row=document.getElementById('find_'+findId);
  if(row)row.scrollIntoView({behavior:'smooth',block:'center'});
}
/* ============ what Carta found — the answer, on its own ground ============
 * Four parts, in the order you'd actually want them: how the ground lies, what
 * it found and what each one is for, what's close but isn't the pick, and what
 * it would do standing there. Every part draws only if the model filled it, so
 * an ask made before any of this existed still opens and still reads.
 */
function vAskResult(id){
  const a=D.asks.find(x=>x.id===id);
  if(!a)return `<div class="pad" style="padding-top:26px"><div class="empty">That ask isn’t on the record.</div>
    <button class="btn btn-quiet" onclick="goBack()">Back</button></div>`;
  const named=askNamed(a),mentions=a.mentions||[],plan=a.plan||null;
  const wild=plan&&plan.wildcard;
  const grounded=named.filter(f=>f.grounded);
  const unplaced=named.length-grounded.length;
  const pin=f=>({id:f.id,name:f.name,lat:f.lat,lon:f.lon,
    score:(f.status==='been'||f.status==='booked')?1:null,
    dim:f.status==='skip'||(mentions.indexOf(f)>-1&&!f.status)});
  const pts=placed(named).map(pin);
  const lede=[`${capFirst(words(named.length))} named, ${words(grounded.length)} placed.`,
    unplaced?`${unplaced===1?'The other':'The others'} could not be confirmed against a real address, so ${unplaced===1?'it is':'they are'} listed and not drawn.`:''
  ].filter(Boolean).join(' ');
  const routeHTML=r=>`<div class="route"><span class="if">${esc(r.if)}</span><span class="ord">${esc((r.order||[]).join(' · '))}</span></div>`;
  const n=a.findings.length;
  /* v7.35.0, critique rec 10: the answer arrived as one column — the findings,
     then the near misses, then the plan, then the wildcard — and the thing that
     was actually asked for scrolled off the top under everything Carta added
     around it. The findings stay open, because they are the answer. The rest
     folds to a head that states its own weight, and opens in place. */
  const fold=(label,count,body)=>`<details class="fold">
    <summary><span class="l">${esc(label)}</span><span class="r">${esc(count)} · <span class="fold-word"></span></span></summary>
    <div class="fold-body">${body}</div></details>`;
  return `<div>
    <div style="position:relative">
      ${pts.length?streetsHTML(pts,{boxStyle:'height:280px',dot:11,plotWrap:'position:absolute;inset:0;padding:78px 60px 34px'})
        :'<div class="mapbox" style="height:150px"></div>'}
      <div class="fade top" style="height:110px;z-index:3"></div>
      ${backMiniHTML('overlay','left:18px;top:18px',true)}
      <button class="omini overlay bare" style="right:12px;top:18px" onclick="openAskScreen()">Ask again</button>
    </div>
    <div class="lift pad" style="padding-top:20px">
      <div class="eyebrow${settleCls()}" style="margin:0 0 6px">${esc(askKindLabel(a.kind))} · asked ${esc(fmtWhen(a.createdAt))}${a.reach?' · '+esc(a.reach):''}</div>
      <div class="display${settleCls()}" style="margin:0">${esc(a.destination)}</div>
      ${a.read?`<div class="lede${settleCls()}" style="margin-top:8px${settleDelay(1)}">${esc(a.read)}</div>`:''}
      <div class="m${settleCls()}" style="margin-top:${a.read?'8px':'10px'}${settleDelay(1.6)}">${esc(lede)}</div>
      ${a.question?`<div class="note${settleCls()}" style="border:0;padding:0;margin:10px 0 0${settleDelay(2)}">You asked: ${esc(a.question)}</div>`:''}

      <div class="shead${settleCls()}"${settleAt(2.3)}><span class="l">What Carta found</span><span class="r">been · booked · skip</span></div>
      ${n?a.findings.map((f,i)=>findingRowHTML(f,i,i+3)).join('')
        :'<div class="empty">Carta didn’t name anything it could stand behind here.</div>'}
      ${a.findings.some(f=>(f.fit||[]).some(figBacked))?`<div class="note" style="border:0;padding:0;margin:12px 0 0">Tap an underlined figure for the cups it was read from. What isn’t underlined, the record can’t open.</div>`:''}

      ${mentions.length?fold('Close, but not the pick',`${words(mentions.length)} named`,
        mentions.map((f,i)=>mentionRowHTML(f,i+n+3)).join('')):''}

      ${plan?fold('What Carta would do',[plan.move?'the move':null,plan.routes&&plan.routes.length?`${words(plan.routes.length)} route${plan.routes.length===1?'':'s'}`:null,wild?'a wildcard':null].filter(Boolean).join(' · ')||'stated',
        `<div class="box">
          ${plan.move?`<div class="say" style="margin-top:0">${esc(plan.move)}</div>`:''}
          ${plan.routes&&plan.routes.length?`<div style="margin-top:${plan.move?'12px':'0'}">${plan.routes.map(routeHTML).join('')}</div>`:''}
        </div>
        ${wild?`<div class="find" id="find_${wild.id}" style="border-bottom:0">
          <div class="row">
            <span style="font-family:var(--serif);font-size:17.5px">${esc(wild.name)}</span>
            ${groundHTML(wild)}
          </div>
          <div class="m" style="margin-top:3px">${whereHTML(wild)}</div>
          ${wild.why?`<div class="say">${esc(wild.why)}</div>`:''}
          <div class="note" style="margin-top:8px">Outside the ranking — worth knowing anyway.</div>
          ${marksHTML(wild)}
        </div>`:''}`):''}

      ${a.findings.some(f=>f.fit&&f.fit.length)?`<button class="btn btn-quiet" style="margin-top:16px" onclick="openBriefScreen(${jsq(a.kind==='city'?a.destination:'')})">The brief these were read from</button>`:''}
      <div class="note" style="margin-top:16px">Mark one Been or Booked and it is on file — the next time you type its name, Carta already knows it. The pin fills the moment you do.</div>
      <button class="btn btn-quiet" style="margin-top:14px" onclick="openAskScreen()">Ask again</button>
    </div></div>`;
}

/* ---- the seam: what index.html reads off this file (Phase 19 pattern —
 * a top-level `function` is already on `window` in a classic script; the
 * explicit publish is here to document the seam, not to create it). ---- */
window.askKey=askKey;
window.askOf=askOf;
window.askRowHTML=askRowHTML;
window.askStr=askStr;
window.askList=askList;
window.callModel=callModel;
window.callVisionModel=callVisionModel;
window.extractJSON=extractJSON;
window.openAskFinding=openAskFinding;
window.openAskKey=openAskKey;
window.sleep=sleep;
window.tag=tag;
window.vAsk=vAsk;
window.vAskResult=vAskResult;
window.vAsking=vAsking;
window.vBrief=vBrief;
window.vTaste=vTaste;
window.askPromptText=askPromptText;
window.parseAskJSON=parseAskJSON;
window.matchFigure=matchFigure;
window.askKindLabel=askKindLabel;
window.askModel=askModel;
window.askResumeAfterKey=askResumeAfterKey;
window.runAsk=runAsk;
window.copyScopedBrief=copyScopedBrief;

window.ASK_VERSION='7.38.0';

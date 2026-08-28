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
/* ---- the read-as line (turn 4, §B2) ------------------------------------
 * One line, two clauses, one separator:
 *   *what the record has for this name* — *what the ask will be scoped to* · read it as
 *
 * **The kind is never a finding.** Nothing on this device knows whether
 * "Lisbon" is a city, which country it is in, or where it is on the ground —
 * and nothing is going to ask. `askScopeOf` matches a city only where
 * `knownCities()` already names it, and takes a country at the keeper's own
 * word. So the kind is only ever said back as the keeper's own SETTING —
 * "asked as a city" — never "read as a city". Turn 1 drew the second thing;
 * this is the correction, and it matters because the composer's one promise
 * is that nothing leaves the device until *Ask Carta* is tapped. A line that
 * claimed to have recognised a place would be the thing that broke it.
 *
 * Counted, never estimated: every figure below is read off cups and cafés
 * already written down, and the line never names the place except where the
 * name came off one of them.
 */
const ASK_KIND_PHRASE={city:'a city',neighborhood:'a neighborhood',
  near:'a point to start from',country:'a country',route:'a route',
  friend:"a friend's taste"};
const PLACE_KINDS=new Set(['city','neighborhood','near','country','route']);
const pl=(n,one,many)=>`${words(n)} ${n===1?one:many}`;
function askReadAsParts(){
  const kind=askDraft.kind,dest=(askDraft.dest||'').trim();
  if(!dest)return ['Nothing named','the ask reads every cup on the record'];
  if(!PLACE_KINDS.has(kind))
    return ['Not a place','every cup on the record goes out, read against your words'];
  const scope=askScopeOf(kind,dest);
  const s=scope.kind?tasteModelMemo().scope(scope.kind,scope.id):null;
  if(scope.kind==='city'){
    const cafes=cityPlaces(scope.id).length;
    return s.n
      ?[`On your record: ${pl(s.n,'cup','cups')}, ${pl(cafes,'café','cafés')}`,
        'the ask is scoped to them']
      /* knownCities() is built from PLACES, not cups: a café can be on the
         record with nothing scored in it. State the count there is, and name
         the one there isn't, rather than printing "zero cups". */
      :[`${capFirst(pl(cafes,'café','cafés'))} on your record, no cup scored yet`,
        `the ask is scoped to ${cafes===1?'it':'them'}`];
  }
  /* the country trap: tasteModel's country scope matches on the COFFEE's
     origin, not on where the cup was drunk, so a country ask must never say
     "cups read there". It says what is true — and what the country scope
     actually contributes to the brief. */
  if(scope.kind==='country')
    return ['A country, at your word',
      s.had.length?`${pl(s.had.length,'coffee','coffees')} from there, excluded by name`
                  :'nothing from there on your record yet'];
  /* neighborhood and route land here ALWAYS — askScopeOf has no branch for
     either, so they never resolve to a scope even where the record names the
     city they sit in. Current behaviour, stated rather than papered over. */
  return [`No cup read in ${dest}`,
    `asked as ${ASK_KIND_PHRASE[kind]||'you set it'}, scoped to every cup instead`];
}
function askReadAsHTML(){
  const p=askReadAsParts();
  return `<span class="h">${esc(p[0])}</span> — ${esc(p[1])} · `
    +`<button class="b" onclick="toggleAskKind()">read it as</button>`;
}
// the line follows the field as it is typed, without re-reading the screen —
// the same reason the ledger beside it repaints in place: a full render()
// under a thumb loses the tap
function paintAskReadAs(){
  const el=document.getElementById('ask_readas');
  if(el)el.innerHTML=askReadAsHTML();
}
/* `read it as` opens the kind sheet — the six kinds and the free-text
 * question. That sheet is gap 5 and is NOT designed in this bundle, so the
 * handoff's own instruction is to wire this to the shipping chip group in
 * place until it is. That is what this does: a disclosure on the leaf itself,
 * carrying both the kinds and the question, so nothing that is reachable
 * today stops being reachable. It is not the designed surface and is marked
 * as such in the logbook. */
let _askKindOpen=false;
function closeAskKind(){_askKindOpen=false}
function toggleAskKind(){captureAskDraft();_askKindOpen=!_askKindOpen;render()}
function askKindPanelHTML(){
  if(!_askKindOpen)return '';
  return `<div class="askkind">
    <div class="eyebrow" style="margin:0 0 9px">What kind of ask</div>
    <div class="picks">
      ${ASK_KINDS.map(k=>`<button class="pick${askDraft.kind===k[0]?' on':''}" onclick="pickAskKind('${k[0]}')">${esc(k[1])}</button>`).join('')}
    </div>
    <label class="f" style="margin-top:14px"><span class="l">Anything else <span class="opt">optional</span></span>
      <textarea id="ask_question" style="min-height:56px" placeholder="Three days in Baixa and Alfama, mostly on foot…">${esc(askDraft.question)}</textarea></label>
  </div>`;
}
/* ---- the composer, on a leaf (§B; empty-record variant `1i`) -----------
 * The ask composed on a full screen of its own: six chips, a field, a
 * textarea, a ledger and a key box, with the plate it was asked from gone.
 * It composes on the door's own furniture now — a 140px strip of the same
 * plate, and a leaf over it — so the question is asked in front of the map
 * it is about, and the bar stays under it because this is not a place you
 * can lose your way out of.
 */
const ASK_LEAF_TOP=122;   // the handoff's own figure; 140 = this + the overlap
function vAsk(){
  const key=askKey();
  const first=!live('cups').length&&!live('coffees').length;
  const tasted=Object.values(tastedCountryMap()).map(c=>c.label).join(',');
  const reach=REACH_KINDS.has(askDraft.kind);
  return `<div class="stage askstage">
    <div class="plate mapbox passport" style="height:${stopTop(ASK_LEAF_TOP)+ANS_OVERLAP}px">
      <carta-atlas style="position:absolute;inset:0" caption="off"
        frame="${first||!tasted?'belt':'tasted'}" tasted="${first?'':esc(tasted)}"></carta-atlas>
      <div class="fade top" style="height:96px"></div>
      <div class="overlay" style="left:20px;right:20px;top:calc(22px + var(--sat))">
        <div style="font-family:var(--serif);font-size:var(--s15);letter-spacing:.2em;text-transform:uppercase;font-weight:600">Carta</div>
      </div>
    </div>
    <div class="leaf" id="askleaf" style="top:${stopTop(ASK_LEAF_TOP)}px;padding:16px 20px 0">
      <div class="body">
        <div style="display:flex;align-items:baseline;justify-content:space-between;gap:12px">
          <span class="eyebrow" style="margin:0">The ask</span>
          <button class="qlink" style="flex:none" onclick="goBack()">Not now</button>
        </div>
        <input type="text" id="ask_dest" value="${esc(askDraft.dest)}" aria-label="Where"
          oninput="askDraft.dest=this.value;paintAskReadAs();paintAskLedger()"
          placeholder="${askDraft.kind==='friend'?'She likes what I like, but darker':askDraft.kind==='near'?'Huntington Park':'Lisbon'}"
          style="width:100%;font-family:var(--serif);font-weight:600;font-size:1.875rem;letter-spacing:-.02em;line-height:1.12;padding:6px 0 12px;border:0;border-bottom:1px solid var(--ink-3);background:transparent;color:var(--ink)">
        <div class="ra" id="ask_readas">${askReadAsHTML()}</div>
        ${askKindPanelHTML()}
        ${reach?`<div class="eyebrow" style="margin:22px 0 9px">How far you’ll go</div>
        <div class="picks">
          ${ASK_REACH.map(r=>`<button class="pick${askDraft.reach===r?' on':''}" onclick="pickAskReach('${jsq(r)}')">${esc(r)}</button>`).join('')}
        </div>`:''}
        <div class="shead" style="margin:24px 0 0;padding-bottom:8px">
          <span class="l">What goes out with this</span><span class="r">tap to read it in full</span></div>
        <button class="led" id="ask_led" style="margin-top:14px" onclick="openAskBrief()">${askLedgerRowsHTML()}</button>
        <div style="display:flex;align-items:baseline;justify-content:space-between;gap:12px;margin-top:14px">
          <span style="font-family:var(--serif);font-style:italic;font-size:12.5px;color:var(--ink-3)">${
            key?'Your key is on this device, and nowhere else.':'No key on this device yet.'}</span>
          <button class="qlink" style="flex:none" onclick="openAskKey()">${key?'Change it':'Set one'}</button>
        </div>
        <button class="btn btn-graphite" style="min-height:52px;padding:15px 16px;margin-top:16px" onclick="runAsk()">Ask Carta →</button>
        <div style="font-family:var(--serif);font-style:italic;font-size:12.5px;color:var(--ink-3);margin-top:10px;padding-bottom:16px">${
          first?'Nothing scored yet, so the ask goes out on what you notice alone. No key, or the call fails, and you get the same brief to copy.'
               :'The one thing in Carta that calls out, and only when you tap it.'}</div>
      </div>
    </div>
  </div>`;
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
let askRun=null;          // {dest,kind,reach,done[],now,pct,pins[],total,error}
let _askCancel=false,_askAbort=null;
const ASK_PCT_ASKING=22,ASK_PCT_READBACK=48,ASK_PCT_PLACED=96;
function askBegin(destination,kind,reach){
  askRun={dest:destination,kind,reach:reach||'',done:[],now:'',pct:0,pins:[],total:0,error:null};
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
/* the plate under the wait. The belt the ask was asked from while there is
 * nothing placed, and the drawn plot from the first confirmed address on — so
 * the answer is half drawn by the time it is read, on the same full-bleed
 * surface the door's own question stands on. The 200px pin box that used to
 * sit at the foot of this screen is gone: the map was the last thing on the
 * page and the first thing the answer needed.
 */
function askPlateHTML(){
  // the bottom clearance IS the narration's own height, read rather than
  // repeated: the two are the same measurement — how much of the plate the
  // scrim is covering — and a literal in both places is a literal that drifts
  if(askRun&&askRun.pins.length)
    return `<div class="plotwrap" style="position:absolute;inset:0;padding:96px 44px ${askNarrH()}px">
      <carta-plot class="plot frame" fit="frame" pins="${esc(askPinsJSON())}" dot="9" labels="on"></carta-plot></div>`;
  const tasted=Object.values(tastedCountryMap()).map(c=>c.label).join(',');
  return `<carta-atlas style="position:absolute;inset:0" caption="off"
    frame="${tasted?'tasted':'belt'}" tasted="${esc(tasted)}"></carta-atlas>`;
}
// the reframe happens in place: the plot is mounted once, on the first pin, and
// every pin after that is one setAttribute. Remounting it per name would
// reproject the whole box each time and replay the settle on a plate already read.
function paintAskMap(el){
  const plot=el.querySelector('carta-plot');
  if(askRun&&askRun.pins.length&&plot){plot.setAttribute('pins',askPinsJSON());return}   // raw JSON — setAttribute does no unescaping
  el.innerHTML=askPlateHTML();
  if(askRun&&askRun.pins.length)el.classList.add('settle');
}
// what the rule's right-hand figure says: the reach the ask is going out on
// until there is something to count, and the count from then on
function askMetaRight(){
  const r=askRun||{};
  if(r.total)return `${words(r.pins.length)} of ${words(r.total)} placed`;
  return r.reach?esc(r.reach):'';
}
// the narration reads up out of the plate, and it says a different true thing
// before and after the first name goes out to be placed
const ASK_FOOT_BEFORE='Nothing is written down until an answer comes back. Cancel leaves the record as it is.';
const ASK_FOOT_PLACING='Each name is checked against a real address before it is drawn. What can’t be confirmed is listed, never guessed onto the map.';
const askFootText=()=>(askRun&&askRun.total)?ASK_FOOT_PLACING:ASK_FOOT_BEFORE;
// the scrim grows to hold the lines already read and shrinks once the placings
// begin, when the plate underneath is the half of the screen doing the work
const askNarrH=()=>(askRun&&askRun.total)?300:340;
// the screen is repainted in place rather than re-rendered: a re-render would
// remount the plate on every stage and re-run the settle on lines already read
function paintAsking(){
  if(!askRun||!pageView||pageView.kind!=='asking')return;
  const fill=document.getElementById('think_fill');
  if(!fill)return;
  const pct=askRun.pct+'%';
  fill.style.width=pct;
  const tip=document.getElementById('think_tip');if(tip)tip.style.left=pct;
  const meta=document.getElementById('think_meta');if(meta)meta.innerHTML=askMetaRight();
  const done=document.getElementById('think_done');
  if(done)for(let i=done.children.length;i<askRun.done.length;i++){
    const d=document.createElement('div');d.textContent=askRun.done[i];done.appendChild(d);
  }
  const now=document.getElementById('think_now');if(now)now.innerHTML=askNowHTML();
  const foot=document.getElementById('think_foot');if(foot)foot.textContent=askFootText();
  const narr=document.getElementById('think_narr');if(narr&&!askRun.error)narr.style.height=askNarrH()+'px';
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
/* the wait, on the plate. No bar (BARELESS), no leaf, no second column: while
 * the ask is out there is exactly one thing to do with the screen, and it is
 * Cancel in the corner. The only ember on it is the rule's own fill and the
 * tip breathing at the end of it — the live line's mark drops to ink, because
 * the ember is spent once per screen and the rule is the thing that moves.
 */
function vAsking(){
  const r=askRun||{dest:'',kind:'city',done:[],now:'',pct:0,pins:[],total:0,reach:'',error:null};
  const pct=r.pct+'%';
  const scope=askScopeOf(r.kind||askDraft.kind,r.dest||askDraft.dest);
  return `<div class="askwait think">
    <div class="plate mapbox passport" id="think_map">${askPlateHTML()}</div>
    <div class="fade top" style="height:150px"></div>
    <div class="overlay" style="left:20px;right:20px;top:calc(22px + var(--sat));display:flex;align-items:flex-start;justify-content:space-between;gap:12px">
      <div style="font-family:var(--serif);font-size:var(--s15);letter-spacing:.2em;text-transform:uppercase;font-weight:600">Carta</div>
      <button class="omini" style="flex:none" onclick="cancelAsk()">Cancel</button>
    </div>
    <div class="prog">
      <div class="rule">
        <span class="fill" id="think_fill" style="width:${pct}"></span>
        <span class="tip${r.error?' stalled':''}" id="think_tip" style="left:${pct}"></span>
      </div>
      <div class="meta">
        <span class="l">${r.dest?`Asking about ${esc(r.dest)}`:'Asking'}</span>
        <span class="r" id="think_meta">${askMetaRight()}</span>
      </div>
    </div>
    <div class="narr" id="think_narr" style="${r.error?'padding-top:26px':`height:${askNarrH()}px`}">
      <div class="done" id="think_done">${r.done.map(l=>`<div>${esc(l)}</div>`).join('')}</div>
      ${r.error?`<div class="empty" style="text-align:left;padding:14px 0 0">${esc(r.error)}</div>
        ${/* rec 6 · every failure surface offers the same try-again, and it is
             the first thing on it. rec 10 · the brief that degrades to a paste
             is scoped to the ask that just failed, not to everywhere. */''}
        <button class="btn btn-primary" style="margin-top:14px" onclick="runAsk()">Try again</button>
        <button class="btn btn-quiet" onclick="copyScopedBrief()">Copy the brief instead${scope.id?` — scoped to ${esc(scope.id)}`:''}</button>
        <button class="btn btn-quiet" onclick="openAskScreen()">Back to the ask</button>`
      :`<div class="now" id="think_now">${askNowHTML()}</div>
        <div class="foot" id="think_foot">${esc(askFootText())}</div>`}
    </div>
  </div>`;
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
  askBegin(destination,kind,reach);
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
    // the count the rule states — set BEFORE the line that announces it, so the
    // meta row and the narration agree on the same paint
    askRun.total=named;
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
    askLandsOnDoor();
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
/* the marks a finding can carry, and the chip that states a rotating menu.
 * FIND_MARKS and `tag` outlive the single-column answer page they were written
 * for — the finding's own page reads both (Phase 31 part two). What went with
 * that page were its row builders: findingRowHTML, mentionRowHTML and the four
 * helpers only they used. Verified dead before cutting, not assumed.
 */
const FIND_MARKS=[['been','Been'],['booked','Booked'],['skip','Skip']];
const tag=(text,lead)=>`<span class="pick mini tag${lead?' lead':''}">${esc(text)}</span>`;
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
/* the settle — an answer arrives written, not pasted. Each row is held back a
 * beat longer than the one above it, so the index reads in the order it was
 * argued instead of landing as a wall. Played once, on arrival. */
const settleCls=()=>_askSettle?' settle':'';
const settleAt=i=>_askSettle?` style="animation-delay:${(0.12*i).toFixed(2)}s"`:'';
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
/* ============ what Carta found — the answer, as an index ============
 * (Phase 31, part two — the handoff's turn 3. It supersedes the single-column
 * answer page Phase 14 built and the six-rows-and-nothing-else `2a` drew.)
 *
 * The answer used to be one column: the findings, then the near misses, then
 * the plan, then the wildcard — and the thing actually asked for scrolled off
 * the top under everything Carta added around it. v7.35.0 folded the tail
 * away, which helped and did not fix it: the fold hid material rather than
 * giving it a place.
 *
 * It has a place now. The six names are an INDEX on the plate — rank, ground,
 * what you made of it, and a door — and everything else went one level down:
 * per-café material onto the finding's own page, answer-level material under
 * this page's own pull. That is what makes an index legal here. **A
 * recommendation never travels without its reasons** is not relaxed by this;
 * it is satisfied one tap away instead of all at once, and every figure the
 * record can defend still opens the very cups it was read from.
 *
 * Three stops, and the content genuinely differs at each — which is why the
 * leaf repaints as it travels rather than simply growing:
 *   low  454  the ground, three rows, and what is left stated
 *   rest 398  the six index rows                      (the default)
 *   high 180  the plan, the near misses, named-and-nowhere
 */
const ANS_STOPS=[454,398,180],ANS_OVERLAP=18,ANS_REST=1;
/* the frame these stops were drawn against — 812 minus the 57px bar — and the
 * least the plate is ever allowed to keep. Phase 30's rule, applied to a
 * second pair of screens: a leaf pinned to a literal top gives the SHORTFALL
 * of a shorter phone to the thing holding the content, not to the map. At
 * 390x667 the resting stop's 398 left six index rows 212 pixels to live in.
 * So the leaf keeps the height it was drawn with and the plate takes what is
 * left, down to a floor that still reads as a plate. At the reference height
 * this returns the handoff's own 454 / 398 / 180 exactly. */
const ANS_REF_MAIN=812-57,ANS_TOP_FLOOR=102;
const askMainH=()=>{const m=document.getElementById('main');return (m&&m.clientHeight)||ANS_REF_MAIN};
/* one stop, scaled: the leaf keeps the height it was drawn with and the plate
   takes the shortfall, down to a floor. Every leaf on these three screens
   travels through here, so none of them can be pinned to an 812 literal. */
function stopTop(designed,H){
  return Math.max(ANS_TOP_FLOOR,Math.min(designed,(H||askMainH())-(ANS_REF_MAIN-designed)));
}
const ansTop=(stop,H)=>stopTop(ANS_STOPS[stop],H);
/* the plate always reaches 18px under the leaf and no further, so no stop
 * leaves a band of bare paper between them and none of it is drawn where it
 * cannot be seen. At the reference height that is the handoff's own 416 at
 * the resting stop and its own 472 at the low one; at the high stop it is
 * 198 rather than the handoff's 416, because the handoff's plate is
 * <carta-city>'s ground — worth drawing under a leaf — and ours is a plot of
 * six pins, which is worth fitting into the strip that is actually on screen.
 * The floor keeps it a plate rather than a sliver on a very short phone. */
const ansPlateH=stop=>Math.max(ansTop(stop)+ANS_OVERLAP,116);
const ANS_HERO=228;   // the headline block's own height, the handoff's figure
let _ansStop=ANS_REST;
function toggleAnsStop(d){
  _ansStop=Math.max(0,Math.min(ANS_STOPS.length-1,_ansStop+(d||1)));
  mountAnswer();
}
/* the leaf travels and repaints in place; the plate is never remounted, so
   the drawn ground is projected once per visit rather than once per pull */
function mountAnswer(){
  const leaf=document.getElementById('ansleaf');if(!leaf)return;
  const top=ansTop(_ansStop);
  leaf.style.top=top+'px';
  const plate=document.getElementById('ansplate');
  if(plate)plate.style.height=ansPlateH(_ansStop)+'px';
  /* §F: at the low stop the marks carry their own names. There is plate enough
     for them there and not at the other two, and the element drops a label it
     cannot place rather than stacking it. This is an attribute change, so the
     plate repaints in place — it is not remounted, and the ground is already
     re-projecting on every stop anyway, since the element centres on its own
     box and the box is what the stop changes. */
  const city=plate&&plate.querySelector('carta-city');
  if(city){const on=_ansStop===0;
    if(on)city.setAttribute('names','on');else city.removeAttribute('names');}
  const hero=document.getElementById('anshero');
  if(hero){
    hero.classList.toggle('gone',_ansStop===2);
    // the headline rides ten pixels above the leaf's own edge wherever that
    // edge is — pinned to a literal it left a band of bare ground showing
    // between the scrim's foot and the leaf at any stop but the resting one
    hero.style.top=Math.max(0,top-ANS_HERO-10)+'px';
  }
  const a=D.asks.find(x=>x.id===(pageView&&pageView.id));
  const body=leaf.querySelector('.body');
  if(a&&body)body.innerHTML=ansBodyHTML(a,_ansStop);
  const head=document.getElementById('anshead');
  if(a&&head)head.textContent=ansHeadRight(a,_ansStop);
}
const ansHeadRight=(a,stop)=>stop===2
  ? `${a.destination} · ${words(askNamed(a).length)} name${askNamed(a).length===1?'':'s'}`
  : `Asked ${fmtAgo(a.createdAt)}`;
/* ---- the ground an answer is measured from ----------------------------
 * The design's rows read "Arts District · 0.9 km". The quarter is the café's
 * own confirmed neighborhood — a real lookup said it, not the model. The
 * distance needs a centre, and Carta defines none: an ask has a destination,
 * not a starting point. So the centre is the mean of what the ask itself
 * placed, and the page says that in as many words rather than naming a
 * quarter the record cannot defend ("distance from Downtown" was the
 * handoff's own figure and its own hardcoded table). Where fewer than two
 * names placed there is no spread to measure and the distance is simply not
 * drawn — the quarter still is.
 */
function answerAnchor(a){
  const pins=askNamed(a).filter(f=>f.grounded&&f.lat!=null&&f.lon!=null);
  return pins.length>1?meanPin(pins):null;
}
function findingKm(anchor,f){
  if(!anchor||!f||f.lat==null||f.lon==null)return null;
  const d=Math.hypot(KMX(f.lon,anchor.lat)-KMX(anchor.lon,anchor.lat),KMY(f.lat)-KMY(anchor.lat));
  return isFinite(d)?d:null;
}
const kmLabel=d=>d==null?'':(d<10?d.toFixed(1):Math.round(d))+' km';
/* what the record already makes of this café, if it knows it at all. The
 * finding carries a placeRef once it has been marked; before that the gentle
 * join's own exact match is what answers, and a near match is not enough to
 * put a score on a row.
 */
function findingPlace(f){
  if(f.placeRef)return placeById(f.placeRef)||null;
  const m=matchNode('places',f.name);
  return (m&&m.exact)||null;
}
function findingReading(f){
  const p=findingPlace(f);
  if(!p)return null;
  const cups=placeCups(p.id);
  if(!cups.length)return null;
  const avg=avgOf(cups);
  return {score:avg==null?null:trimNum(Math.round(avg*10)/10),n:cups.length,placeId:p.id};
}
const readingLabel=r=>!r?'':[r.score,r.n===1?'once':r.n===2?'twice':`${words(r.n)} times`].filter(Boolean).join(' · ');
/* ---- the index row ---------------------------------------------------- */
function ansRowHTML(a,f,i,anchor){
  const r=findingReading(f);
  const km=kmLabel(findingKm(anchor,f));
  const ground=[f.neighborhood,km].filter(Boolean).join(' · ');
  return `<button class="idxrow${settleCls()}"${settleAt(i)} onclick="openAskFindingScreen(${jsq(String(a.id))},${jsq(String(f.id))})">
    <span class="n${r?' been':''}">${i+1}</span>
    <span class="mid"><span class="t">${esc(f.name)}</span>${
      ground?`<span class="g">${esc(ground)}</span>`:''}</span>
    <span class="r${r?'':' none'}">${r?esc(readingLabel(r)):'unread'}</span>
    <span class="go">→</span>
  </button>`;
}
/* ---- what the pull is carrying, said on the handle -------------------- */
function ansPullLabel(a){
  const near=(a.mentions||[]).length;
  const nearIds=new Set((a.mentions||[]).map(f=>f&&f.id));
  const lost=askNamed(a).filter(f=>!f.grounded&&!nearIds.has(f.id)).length;
  const parts=[(a.plan&&(a.plan.move||(a.plan.routes||[]).length))?'the plan':null,
    near?`${words(near)} came close`:null,
    (!near&&lost)?`${words(lost)} nowhere`:null].filter(Boolean);
  return parts.length?parts.join(' · '):'the rest of the answer';
}
/* ---- the leaf, at each of its three stops ------------------------------ */
function ansBodyHTML(a,stop){
  const findings=a.findings||[],anchor=answerAnchor(a);
  if(stop===2)return ansUnderPullHTML(a,anchor);
  const shown=stop===0?findings.slice(0,3):findings;
  const left=findings.length-shown.length;
  const lost=askNamed(a).filter(f=>!f.grounded).length;
  return `<div class="shead" style="margin-top:0;padding-bottom:8px">
      <span class="l">What Carta found</span>
      <span class="r">${stop===0?'the ground':'tap a name for its argument'}</span>
    </div>
    ${findings.length?shown.map((f,i)=>ansRowHTML(a,f,i,anchor)).join('')
      :'<div class="empty">Carta didn’t name anything it could stand behind here.</div>'}
    ${left?`<div class="shead over" style="margin-top:10px;padding-bottom:0">
      <span class="l">${esc(capFirst(words(left)))} more${lost?` · ${words(lost)} unplaced`:''}</span>
      <span class="r"><button class="qlink" style="flex:none" onclick="setAnsStop(1)">Read the answer</button></span>
    </div>`:''}
    <button class="pullbar" onclick="toggleAnsStop(1)" aria-label="Open the rest of the answer">
      <span class="bar"></span><span class="l">${esc(ansPullLabel(a))}</span></button>`;
}
/* everything that is about the answer rather than about one café. A near miss
 * gets one sentence saying why not and never a page — that shape is exactly
 * what the six index rows have no room for, and is what makes them an index. */
function ansUnderPullHTML(a,anchor){
  const plan=a.plan||null,near=a.mentions||[];
  // a near miss that also failed to place is ALREADY on this screen, in its own
  // row, saying why not — listing it again under Named and nowhere reported one
  // café to the keeper twice. Named-and-nowhere is for what the ranking named.
  const nearIds=new Set(near.map(f=>f&&f.id));
  const lost=askNamed(a).filter(f=>!f.grounded&&!nearIds.has(f.id));
  const routeHTML=r=>`<div class="route"><span class="if">${esc(r.if)}</span><span class="ord">${esc((r.order||[]).join(' · '))}</span></div>`;
  const nearRow=f=>{
    const km=kmLabel(findingKm(anchor,f));
    return `<div class="nearrow">
      <span class="mid"><span class="t">${esc(f.name)}</span>${
        f.instead?`<span class="why">${esc(f.instead)}</span>`:''}</span>
      ${(f.neighborhood||km)?`<span class="r">${esc(f.neighborhood||'')}${
        f.neighborhood&&km?'<br>':''}${esc(km)}</span>`:''}
    </div>`;
  };
  return `<button class="pullbar bare" onclick="toggleAnsStop(-1)" aria-label="Back to the six">
      <span class="bar"></span></button>
    ${plan&&(plan.move||(plan.routes||[]).length)?`
      <div class="shead" style="margin-top:0"><span class="l">What Carta would do</span></div>
      ${plan.move?`<div class="verdict" style="margin-top:14px">${esc(plan.move)}</div>`:''}
      ${(plan.routes||[]).length?`<div style="margin-top:10px">${plan.routes.map(routeHTML).join('')}</div>`:''}`:''}
    ${near.length?`<div class="shead" style="margin-top:18px">
        <span class="l">Close, but not the pick</span>
        <span class="r">${esc(words(near.length))}, and why not</span></div>
      ${near.map(nearRow).join('')}`:''}
    ${lost.length?`<div class="shead" style="margin-top:16px">
        <span class="l">Named and nowhere</span><span class="r">${esc(words(lost.length))}</span></div>
      ${lost.map(f=>`<div class="nearrow"><span class="mid"><span class="t">${esc(f.name)}</span>
        <span class="why">Came back with no street on it. Listed, never plotted — a row here, and no mark on the plate.</span></span></div>`).join('')}`:''}
    <div style="display:flex;justify-content:space-between;align-items:baseline;gap:14px;margin-top:auto;padding:12px 0 14px">
      <span class="eyebrow" style="margin:0;letter-spacing:.1em">Asked ${esc(fmtAgo(a.createdAt))}</span>
      <button class="qlink" style="flex:none;white-space:nowrap" onclick="setAnsStop(1)">Back to the six</button>
    </div>`;
}
function setAnsStop(i){_ansStop=i;mountAnswer()}
/* the stop, set WITHOUT painting — the answer opens on its six names every
   time, and the reset has to land before the screen renders rather than
   repainting a leaf that is still showing the ask you just left. */
function resetAnsStop(){_ansStop=ANS_REST}
/* ---- the plate, as ground ---------------------------------------------
 * Phase 32. <carta-city> replaces the drawn plot under the answer and under
 * one finding — the element the handoff always drew here, unbuilt until the
 * fold that put it in carta-map.js. The marks it takes are the same confirmed
 * findings the plot took, so the grounding law is untouched: a name the lookup
 * could not place is a row under the pull and never a pin.
 *
 * The handoff states one city's figures (Los Angeles at span 40, its centre
 * pulled seaward). Production cannot read those off a mockup, so the frame is
 * derived from the answer itself and every number below says what it is:
 *
 *   at      the ask's own anchor — the mean of its confirmed pins, which is
 *           already what the index rows measure their kilometres from
 *   center  the marks' own bounding box, so every confirmed name is in frame
 *   span    that box at about 45% of the width, which leaves the rings and the
 *           scale bar room to be read. Height is weighed at 1:1 rather than
 *           the plate's own ratio, because the plate is shorter at the low stop
 *   coast   the destination as typed. cityKey() decides whether CITY_ARCS has
 *           heard of it; one key today, so most cities draw a coastless field.
 *           That is the stated coverage, not a failure — the grid and the reach
 *           are the plate's argument and the headline names the city.
 */
const REACH_RINGS={'on foot':[1,2,4],'a short drive':[1,3,8],'worth driving for':[2,6,15]};
const ANS_LONE_SPAN=3,ANS_HEAD_CLEAR=54;   // the header row the plate is read under
// the scrim's own readable start, and how far into the headline a mark may fall
const ANS_MARK_HIGH=40,ANS_MARK_DEPTH=.3;
/* Type is held out of the headline, but only the part of it that is actually
   opaque: the scrim reaches var(--surface-card) at 94% by its own 54% stop, so
   everything below that is dead paper and everything above it still reads.
   Reserving the whole 228px block instead left the ring labels nowhere legal to
   sit and silently dropped every one of them — a reach drawn with no distance
   on it, which is the figure without its number. Measured up from the plate's
   foot: the leaf's lap, then the solid half of the headline. */
const ANS_SCRIM_SOLID=.54;
const ANS_RESERVE_LOW=Math.round(ANS_HERO*ANS_SCRIM_SOLID)+ANS_OVERLAP+10;
const askMainW=()=>{const m=document.getElementById('main');return (m&&m.clientWidth)||480};
/* the reach drawn to scale. It is the keeper's own setting said back on the
   ground — the same honesty the read-as line keeps: Carta does not know how far
   "a short drive" is for you, it knows what you set, and the ring is that word
   given a distance rather than a measurement of anything. */
function ansFrame(a){
  const marks=ansMarks(a);
  if(!marks.length)return null;
  const pins=marks.map(m=>m.f);
  const lat=pins.map(p=>p.lat),lon=pins.map(p=>p.lon);
  const mid={lat:(Math.min(...lat)+Math.max(...lat))/2,lon:(Math.min(...lon)+Math.max(...lon))/2};
  const w=(Math.max(...lon)-Math.min(...lon))*111.32*Math.cos(mid.lat*Math.PI/180);
  const h=(Math.max(...lat)-Math.min(...lat))*111.32;
  /* the reach is drawn only where there is an anchor to draw it from. One
     placed name is its own mean, and a ring centred on that single café would
     be measuring your reach from the café rather than from you — which is the
     very thing the rows refuse when they print no kilometres here. No anchor,
     no rings; the shore, the grid and the mark still carry the city. */
  const at=answerAnchor(a);
  const rings=at?(REACH_RINGS[a.reach]||REACH_RINGS['a short drive']):[];
  /* Where the marks are allowed to land.
     The plate runs the height of the screen and both its ends are spoken for:
     a top scrim under the header row, and the headline block above the leaf.
     The handoff spreads its marks across all of it and reads them through
     those scrims — faint at the edges is the intended look, and fitting the
     marks into the sliver of clear paper between the two (28px on the
     handoff's own frame) would blow the span up and throw the city away.
     What is NOT intended is a mark that cannot be seen at all: ours fell 51%
     into the headline, where the scrim is 94% opaque, and a row whose mark is
     invisible breaks the one law this screen has — a café the record can
     place is a mark AND a row. So the rule is a depth limit, not a clear band:
     no mark deeper than the top third of the headline, none above the scrim's
     own readable start, and the span grows only if the spread cannot fit
     between those two. Read off the live column at the resting stop and then
     left alone — the band travels with the leaf, and ground that slides under
     a drag is worse than ground framed for the stop the screen opens at. */
  const W=askMainW(),H=ansPlateH(ANS_REST);
  const hiY=ANS_MARK_HIGH,loY=Math.max(hiY+72,ansTop(ANS_REST)-ANS_HERO-10+ANS_HERO*ANS_MARK_DEPTH);
  let span=Math.max(rings.length?rings[1]*2.2:ANS_LONE_SPAN,w/.8);
  if(h>0)span=Math.max(span,h*W/((loY-hiY)*.9));
  const sp=Math.min(400,Math.round(span*10)/10);
  // the marks' centre, moved from the middle of the box to the middle of that
  // run: a lift in pixels, turned back into degrees through the same scale
  const lift=(H/2-(hiY+loY)/2)*sp/W/111.32;
  return {at:at||pins[0],center:{lat:mid.lat-lift,lon:mid.lon},span:sp,rings};
}
const ansCityHTML=(a,fr)=>`<carta-city class="city" style="position:absolute;inset:0"
  at="${fr.at.lat},${fr.at.lon}" center="${fr.center.lat},${fr.center.lon}" span="${fr.span}"
  coast="${esc(a.destination||'')}" rings="${fr.rings.length?fr.rings.join(','):'off'}"
  reserve-top="${ANS_HEAD_CLEAR}" reserve-bottom="${ANS_RESERVE_LOW}" scale="off"
  marks="${esc(ansMarksJSON(a))}"></carta-city>`;
/* a mark carries its finding's id, which is what makes the index and the plate
   one surface: the tap leaves as carta:pin-tap {id} and the app's own handler
   already opens a finding by that id. A mark with no id would draw and simply
   not be a door — the handoff's fourth fix, and none of ours lack one. */
const ansMarks=a=>(a.findings||[]).map((f,i)=>({f,n:i+1}))
  .filter(m=>m.f.grounded&&m.f.lat!=null&&m.f.lon!=null);
/* the numeral is the ROW's number, not the mark's own position in the drawn
   set: an unplaced finding still takes a row, so counting the marks instead
   would print 2 on the café the index calls 3 the moment one name in the
   middle cannot be placed. Mentions are not marks at all — they live under
   the pull, and the plate carries only what the index carries. */
const ansMarksJSON=a=>JSON.stringify(ansMarks(a)
  .map(m=>({id:m.f.id,n:m.n,name:m.f.name,lat:m.f.lat,lon:m.f.lon,been:!!findingReading(m.f)})));
function vAskResult(id){
  const a=D.asks.find(x=>x.id===id);
  if(!a)return `<div class="pad" style="padding-top:26px"><div class="empty">That ask isn’t on the record.</div>
    <button class="btn btn-quiet" onclick="goBack()">Back</button></div>`;
  const named=askNamed(a),grounded=named.filter(f=>f.grounded);
  const fr=ansFrame(a);
  const been=(a.findings||[]).filter(f=>findingReading(f)).length;
  const n=(a.findings||[]).length;
  const head=`${capFirst(words(n))} in the city, <em>${been?`${words(been)} already yours.`:'all of them new.'}</em>`;
  return `<div class="stage">
    <div class="plate mapbox passport" id="ansplate" style="height:${ansPlateH(_ansStop)}px">
      ${fr?ansCityHTML(a,fr)
        :`<carta-atlas style="position:absolute;inset:0" caption="off" frame="tasted"
            tasted="${esc(Object.values(tastedCountryMap()).map(c=>c.label).join(','))}"></carta-atlas>`}
      <div class="fade top" style="height:132px"></div>
    </div>
    <div class="overlay" style="left:20px;right:20px;top:calc(22px + var(--sat));display:flex;align-items:flex-start;justify-content:space-between;gap:12px">
      ${backMiniHTML('bare','flex:none;margin-left:-4px',true)}
      <span class="eyebrow" id="anshead" style="margin:0;padding-top:12px">${esc(ansHeadRight(a,_ansStop))}</span>
    </div>
    <div class="hero${_ansStop===2?' gone':''}" id="anshero" style="top:${Math.max(0,ansTop(_ansStop)-ANS_HERO-10)}px;height:${ANS_HERO}px">
      <div class="eyeb">${esc([a.destination,a.reach,tasteFloorLabel()].filter(Boolean).join(' · '))}</div>
      <div class="display" style="font-size:var(--s42);line-height:1.06;letter-spacing:-.025em;margin:0">${head}</div>
    </div>
    <div class="leaf" id="ansleaf" style="top:${ansTop(_ansStop)}px;padding:12px 20px 0">
      <div class="body">${ansBodyHTML(a,_ansStop)}</div>
    </div>
  </div>`;
}
// the bar the ask went out on, said the way the eyebrow says everything else
function tasteFloorLabel(){
  const tm=tasteModelMemo();
  return tm.bar.floor!=null?`${tm.bar.floor} or better`:'';
}

/* ============ one finding, whole ============
 * (Phase 31, part two · `3c` at rest, `3d` read down. It is what `2c` was,
 * carrying an argument rather than a fact box.)
 *
 * This is the page that makes the index legal. Every per-café thing the old
 * single-column answer carried — the verdict, the why, what to order, the
 * rotates warning, the fit figures and the three marks — is here, on one
 * page, in one scroll, with no fold. The Phase 14 fold exists to prevent a
 * wall of text; the defence here is that every part is a named block under
 * its own section head, not that anything is hidden.
 *
 * Two stops, and they are the composer's own figures rather than new ones:
 *   rest 398 over a 416 plate   the name, where, the verdict, the why
 *   down 122 over a 140 strip   what to order, how it fits, your mark
 */
const FIND_STOPS=[398,122];
const findTop=stop=>stopTop(FIND_STOPS[stop]);
const findPlateH=stop=>Math.max(findTop(stop)+ANS_OVERLAP,116);
/* the plate's own clearance at each stop, stated rather than scaled: 70/64 in
   a 416 box leaves the pin between the header and the leaf; 24/30 in the 140
   strip leaves it the 86px that strip actually has. A single formula for both
   put the pin in six pixels of the strip and drew nothing. */
const FIND_PADS=['70px 44px 64px','24px 40px 30px'],FIND_SCRIMS=[120,96];
let _findStop=0;
function toggleFindStop(d){
  _findStop=Math.max(0,Math.min(1,_findStop+(d||1)));
  mountFinding();
}
function mountFinding(){
  const leaf=document.getElementById('findleaf');if(!leaf)return;
  const top=findTop(_findStop),ph=findPlateH(_findStop);
  leaf.style.top=top+'px';
  const plate=document.getElementById('findplate');
  if(plate)plate.style.height=ph+'px';
  const fade=document.getElementById('findfade');
  if(fade)fade.style.height=FIND_SCRIMS[_findStop]+'px';
  const wrap=plate&&plate.querySelector('.plotwrap');
  if(wrap)wrap.style.padding=FIND_PADS[_findStop];
  const note=plate&&plate.querySelector('.smap-note');
  if(note)note.style.bottom=(ph-top+8)+'px';
  const hit=pageView&&pageView.id?askOf(pageView.id):null;
  const body=leaf.querySelector('.body');
  if(hit&&body)body.innerHTML=findBodyHTML(hit.a,hit.f,_findStop);
}
function openAskFindingScreen(askId,findId){
  _findStop=0;
  openScreen('askfind',findId,{askId:askId});
}
/* where this finding sits in the set, so opening one never loses the other
   five — the header says "2 of 6" and the ← goes back to the stop you left */
function findIndexOf(a,f){
  const list=a.findings||[];
  const i=list.findIndex(x=>x&&x.id===f.id);
  return i<0?null:{i:i+1,n:list.length};
}
/* the fit box. Every figure the record can actually open is dotted and opens
 * the cups it was read from; one it cannot resolve stays flat text. That is
 * the honesty gate on the answer's return leg, and it is the same
 * `matchFigure`/`.fig` pair Your taste already reads through — moved here
 * from the old answer page rather than reinvented. */
function findFitRowsHTML(a,f){
  const rows=[];
  const tm=tasteModelMemo();
  if(tm.bar.floor!=null)rows.push(['Your bar',
    `<button class="fig" onclick="openBarEvidence()">${esc(tm.bar.floor)} or better</button>`]);
  const fit=(f.fit||[]).filter(Boolean);
  if(fit.length)rows.push(['What earns your scores',fit.map(fitFigureHTML).join(' · ')]);
  const r=findingReading(f);
  if(r)rows.push(['Your reading here',
    `<button class="fig" onclick="openCityChapterForPlace(${jsq(String(r.placeId))})">${esc(readingLabel(r))}</button>`]);
  rows.push(['Position',f.grounded?'confirmed · a real address':'not confirmed · never drawn']);
  return rows.map(x=>`<div class="r"><span class="k">${esc(x[0])}</span><span class="v">${x[1]}</span></div>`).join('');
}
function findBodyHTML(a,f,stop){
  const anchor=answerAnchor(a);
  const km=kmLabel(findingKm(anchor,f));
  const pos=findIndexOf(a,f);
  const meta=[f.neighborhood,km,a.reach].filter(Boolean).join(' · ');
  if(stop===1){
    const marks=`<div class="picks" style="margin-top:10px">${FIND_MARKS.map(m=>
      `<button class="pick${f.status===m[0]?' on':''}" onclick="setFindStatus(${jsq(String(f.id))},'${m[0]}')">${m[1]}</button>`).join('')}</div>`;
    return `<button class="pullbar bare" onclick="toggleFindStop(-1)" aria-label="Back up"><span class="bar"></span></button>
      <div style="display:flex;align-items:baseline;justify-content:space-between;gap:12px;padding-bottom:8px;border-bottom:1px solid var(--line-strong)">
        <span class="display" style="font-size:var(--s18);line-height:1.14;letter-spacing:-.02em;margin:0">${esc(f.name)}</span>
        <span class="idxrow-g" style="flex:none;font-family:var(--sans);font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-3)">${esc([f.neighborhood,km].filter(Boolean).join(' · '))}</span>
      </div>
      ${f.order?`<div class="shead" style="margin-top:14px"><span class="l">What to order</span></div>
        <div style="font-family:var(--serif);font-size:var(--s16);line-height:1.45;margin-top:9px">${esc(f.order)}</div>`:''}
      ${f.stale?`<div style="margin-top:8px;display:flex;align-items:center;gap:8px;flex-wrap:wrap">
        <span class="pick mini tag">rotates</span>
        <span style="font-family:var(--serif);font-style:italic;font-size:12.5px;color:var(--ink-3)">a menu, not a fact — Carta never asked what is on it today.</span></div>`:''}
      <div class="shead" style="margin-top:14px"><span class="l">How it fits you</span>
        <span class="r">tap a figure for its cups</span></div>
      <div class="fitbox">${findFitRowsHTML(a,f)}</div>
      <div class="shead" style="margin-top:14px"><span class="l">Your mark on it</span></div>
      ${marks}
      <button class="btn btn-graphite" style="min-height:48px;padding:13px 16px;margin-top:16px" onclick="logCupAtFinding(${jsq(String(f.id))})">Log a cup here</button>
      <div class="note" style="border:0;padding:0;margin-top:9px;padding-bottom:12px">Streets are the enhancement, never the surface. Offline, the plate above is the drawn one and the pin stands where the record put it.</div>`;
  }
  return `<div class="display" style="font-size:var(--s34);line-height:1.08;letter-spacing:-.025em;margin:0">${esc(f.name)}</div>
    ${meta?`<div class="eyebrow" style="margin:7px 0 0">${esc(meta)}</div>`:''}
    <div class="shead" style="margin-top:18px"><span class="l">Best for</span></div>
    ${f.verdict?`<div class="verdict">${esc(f.verdict)}</div>`:'<div class="verdict" style="color:var(--text-subtle);font-style:italic">Carta didn’t say what this one is for.</div>'}
    ${f.why?`<div class="verwhy">${esc(f.why)}</div>`:''}
    ${(()=>{const r=findingReading(f);return r?`<div style="border-top:1px solid var(--line);padding-top:12px;margin-top:16px;display:flex;justify-content:space-between;align-items:baseline;gap:14px">
      <span style="font-family:var(--sans);font-size:var(--s13);color:var(--ink-3)">Your reading</span>
      <button class="fig" onclick="openCityChapterForPlace(${jsq(String(r.placeId))})">${esc(readingLabel(r))}</button></div>`:''})()}
    <button class="pullbar" onclick="toggleFindStop(1)" aria-label="Read it down">
      <span class="bar"></span><span class="l">what to order · how it fits · your marks</span></button>`;
}
/* the streets over the drawn ground — and since Phase 32 the ground is
 * <carta-city>, which is what the handoff always drew underneath here. The
 * law is unchanged and is still the point: streets are the enhancement, the
 * drawn ground is the surface, and neither invents a pin. One café at street
 * scale, so the frame is the handoff's own — 3 km across, its reach in 400 m
 * and 1 km, the grid on. Nothing here is derived because nothing here varies:
 * a finding is one point, and one point has no spread to fit. */
const FIND_SPAN=3,FIND_RINGS='0.4,1';
const findCityHTML=f=>`<carta-city class="city" style="position:absolute;inset:0"
  at="${f.lat},${f.lon}" span="${FIND_SPAN}" coast="${esc(f.city||'')}"
  rings="${FIND_RINGS}" grid="on" scale="off"
  marks="${esc(JSON.stringify([{id:f.id,lat:f.lat,lon:f.lon,been:!!findingReading(f)}]))}"></carta-city>`;
function vAskFinding(id,view){
  const hit=askOf(id);
  if(!hit)return `<div class="pad" style="padding-top:26px"><div class="empty">That finding isn’t on the record.</div>
    <button class="btn btn-quiet" onclick="goBack()">Back</button></div>`;
  const {a,f}=hit,pos=findIndexOf(a,f);
  const pins=f.grounded&&f.lat!=null?JSON.stringify([{id:f.id,name:f.name,lat:f.lat,lon:f.lon}]):'[]';
  return `<div class="stage">
    <div class="plate mapbox passport" id="findplate" style="height:${findPlateH(_findStop)}px">
      ${pins!=='[]'
        ?streetsHTML([{id:f.id,name:f.name,lat:f.lat,lon:f.lon}],
            {boxStyle:'position:absolute;inset:0',dot:10,zoom:15.4,attribLift:4,
             // the leaf covers the plate's own foot, so the offline note and the
             // pin both sit in the band that is actually on screen
             noteStyle:'bottom:'+(findPlateH(_findStop)-findTop(_findStop)+8)+'px',
             plotWrap:'position:absolute;inset:0;padding:'+FIND_PADS[_findStop],
             floorHTML:findCityHTML(f)})
        :`<carta-atlas style="position:absolute;inset:0" caption="off" frame="tasted"
            tasted="${esc(Object.values(tastedCountryMap()).map(c=>c.label).join(','))}"></carta-atlas>`}
      <div class="fade top" id="findfade" style="height:${FIND_SCRIMS[_findStop]}px"></div>
    </div>
    <div class="overlay" style="left:20px;right:20px;top:calc(22px + var(--sat));display:flex;align-items:flex-start;justify-content:space-between;gap:12px">
      ${backMiniHTML('bare','flex:none;margin-left:-4px',true)}
      ${pos?`<span class="eyebrow" style="margin:0;padding-top:12px">${esc(words(pos.i))} of ${esc(words(pos.n))}</span>`:''}
    </div>
    <div class="leaf" id="findleaf" style="top:${findTop(_findStop)}px;padding:16px 20px 0">
      <div class="body">${findBodyHTML(a,f,_findStop)}</div>
    </div>
  </div>`;
}
/* the two doors a finding's own page opens back into the record: the city it
   stands in, where its cups actually are, and the door itself prefilled with
   the café — neither invents anything the record does not already hold. */
function openCityChapterForPlace(placeId){
  const p=placeById(placeId);
  if(p&&p.city)openCityChapter(p.city);else if(p)openCafeScreen(p.id);
}
function logCupAtFinding(findId){
  const hit=askOf(findId);if(!hit)return;
  // the café has to be ON the record before a cup can name it, and marking a
  // finding Been is already the move that puts it there (setFindStatus mints
  // the place and keeps the placeRef). So this is that move plus the door,
  // opened at the café it just minted — the step the door would otherwise ask
  // for and already knows the answer to.
  if(hit.f.status!=='been')setFindStatus(findId,'been');
  const again=askOf(findId),ref=again&&again.f.placeRef;
  if(ref)openDoorAt(ref);else openDoor();
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
window.askReadAsHTML=askReadAsHTML;
window.askReadAsParts=askReadAsParts;
window.paintAskReadAs=paintAskReadAs;
window.toggleAskKind=toggleAskKind;
window.closeAskKind=closeAskKind;
window.vAskResult=vAskResult;
window.vAskFinding=vAskFinding;
window.mountAnswer=mountAnswer;
window.mountFinding=mountFinding;
window.toggleAnsStop=toggleAnsStop;
window.setAnsStop=setAnsStop;
window.resetAnsStop=resetAnsStop;
window.toggleFindStop=toggleFindStop;
window.openAskFindingScreen=openAskFindingScreen;
window.openCityChapterForPlace=openCityChapterForPlace;
window.logCupAtFinding=logCupAtFinding;
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

window.ASK_VERSION='7.42.3';

/* ============================================================================
     The plate (ROADMAP.md Phase 26) — a brew's own curve, drawn.

     Split out of index.html at the Phase 26 second-method gate, the way the
     map layer was at Phase 19. SPEC-phase26-pourover.md §8 made the call:
     two plate arms rather than one stopped the move being "the honest
     candidate" and made it the decision, so it was made before the second arm
     was written rather than after.

     Loaded from index.html's <head> with a plain <script src>, before the
     app's own script, which reads the globals published at the foot of this
     file. No bundler, no build — three static files you drop on a host, one
     more than Phase 19 left and for the same reason it left two.

     The seam is one-way: nothing here touches `D`, `document` or the ledger.
     `platePaths`, `shotFigures`, `shotCurve`, `shotAt` and the pour reader are
     pure geometry over a shot's own arrays and are tested as such (they sit
     inside this file's own pure markers, which test/model.test.js slices and
     evaluates ahead of index.html's). The renderers below them string-template
     into innerHTML exactly as the app's own views do, and call back out to
     `esc` and `vizShotById` at paint time — by which point index.html has run.

     Two methods, one drawing surface:

       espresso   one arc under pressure, flow beside it, what landed in the
                  cup underneath. Argued about by peak bar. ~27 s.
       pour-over  a staircase of water added in pulses, the cup lagging behind
                  it, the pours as bands and the waits drawn by being left
                  empty. Argued about by drawdown. ~3 min.

     No pressure line on a pour-over, because there is no pressure; and no flow
     line either, since for a pulsed pour it is a square wave that only
     restates the bands. The ember appears nowhere on either plate but the
     scrub crosshair, which is the live action.
     ========================================================================= */

/* ==== pure ==== *
 * Everything to the /pure marker is free of `D` and `document` and is what
 * test/model.test.js evaluates. Anything reaching for either belongs below it,
 * next to its coupled wrapper — the same rule index.html's own block keeps. */

/* the curve the file actually carries — for an espresso, pressure and flow and
 * what landed in the cup; for a pour-over, the water going in and the cup
 * filling behind it — all against elapsed seconds. Which key each series is
 * under depends on what wrote the file, so each is read by the first key that
 * is genuinely an array of numbers, and a series that isn't there comes back
 * null rather than being interpolated out of the ones that are. No curve at
 * all is a state, not a failure: the brew still states its scalars.
 * Visualizer's own file (confirmed against a live shot, v7.28.2) splits the
 * curve across two containers rather than one: the elapsed-seconds series
 * sits at the top of the response (`timeframe`), the value series sit nested
 * under `data` — so every key is hunted for in both containers, never assumed
 * to share one. A machine with no flow sensor states no `espresso_flow` at
 * all; `espresso_flow_weight` (confirmed by integrating it against the shot's
 * own final weight, v7.28.3) is Visualizer computing flow off the scale
 * instead, and is read as a fallback rather than left blank when it's the only
 * flow reading the file actually carries.
 * A gravimetric brew (a scale, no machine) states no pressure at all, which is
 * exactly what tells the two methods apart — so pressure stopped being
 * required here at Phase 26's second method. What is required is elapsed
 * seconds and at least one series to draw against them. */
// below this, no pressure was applied and the brew is not an espresso however
// many pressure keys the file happens to carry (v7.31.1)
const PRESSURE_MIN_BAR=2;
function shotCurve(d){
  if(!d||typeof d!=='object')return null;
  const sources=[d,(d.data&&typeof d.data==='object')?d.data:{}];
  const arr=keys=>{
    for(let s=0;s<sources.length;s++){
      const src=sources[s];
      for(let i=0;i<keys.length;i++){
        const v=src[keys[i]];
        if(Array.isArray(v)&&v.length>1){const o=v.map(Number);if(o.every(n=>isFinite(n)))return o}
      }
    }
    return null;
  };
  let t=arr(['timeframe','espresso_elapsed','elapsed','time']);
  if(!t)return null;
  const p=arr(['espresso_pressure','pressure']);
  // the water going in: a pulsed pour's own staircase. Hunted the same
  // best-effort way every other series here is — first key that is really an
  // array of numbers — because what writes a gravimetric file varies more than
  // what writes a machine's.
  const wIn=arr(['espresso_water_dispensed','water_dispensed','espresso_water','water','pour_weight','water_weight']);
  // `current_total_shot_weight` is what Visualizer's own CSV export calls this
  // column — confirmed against a real filter brew's export, not guessed at
  const cup=arr(['espresso_weight','weight','current_total_shot_weight','drink_weight_series','cup_weight']);
  if(!p&&!wIn&&!cup)return null;
  // some writers state elapsed in milliseconds; ten minutes is not a brew, on
  // either method — a long pour-over is five — so the only reading left for a
  // series past 600 is that these are ms. Unchanged by the second method: the
  // threshold clears the longest filter brew with minutes to spare.
  if(t[t.length-1]>600)t=t.map(v=>v/1000);
  const n=Math.min.apply(null,[t.length,p?p.length:1e9,wIn?wIn.length:1e9,cup?cup.length:1e9].filter(v=>v<1e9));
  if(n<2)return null;
  // flow or weight can legitimately run a little short of the clock (a
  // weight-derived flow reading stopping a beat before the last samples,
  // say) — r() already trims anything longer than the clock and passes a
  // shorter series through untouched, so nothing here needs to reject one;
  // platePaths' own line() maps over the series itself, so a shorter one
  // just draws a shorter line rather than reading past its own end
  const r=a=>a?a.slice(0,n).map(v=>Math.round(v*100)/100):null;
  /* the method, and the thing that was wrong about it until v7.31.1.
   *
   * The rule was "a pressure array exists, so a machine wrote this". It does
   * not follow. Visualizer normalizes every upload into one DE1-shaped
   * schema, so a brew logged from a scale — or pulled on a machine running a
   * pour-over profile — arrives carrying an `espresso_pressure` series that
   * is flat at or near zero. The key being present says nothing; what says
   * something is whether pressure was ever actually APPLIED, and the series
   * states that outright.
   *
   * So the reading is the peak. Two bar is not a threshold anyone's espresso
   * sits under — a lever at its gentlest is still several times that — and
   * nothing that never reached it was an espresso by any definition. This is
   * still read off the file rather than inferred from a brewer's name; it is
   * just read from what the numbers say instead of from which keys exist. */
  const peak=p?p.reduce((a,b)=>b>a?b:a,p[0]):0;
  const pressed=!!p&&peak>=PRESSURE_MIN_BAR;
  const method=pressed?'espresso':'pourover';
  // a pressure series that never rose is not a line worth drawing over a
  // staircase — it is a flat zero along the axis, and it is dropped rather
  // than inked as if it said something
  const c={t:r(t),p:pressed?r(p):null,f:r(arr(['espresso_flow','flow','espresso_flow_weight','flow_in','flow_out'])),w:r(cup),method};
  // a pour-over with only one weight series has that series as its water in:
  // a scale under the brewer weighs what you poured. The cup is then unread
  // rather than guessed at from it.
  if(method==='pourover'){
    if(wIn){c.wIn=r(wIn)}
    else{c.wIn=c.w;c.w=null}
  }
  return c;
}
/* pre-infusion, read off the curve rather than waited for as a scalar
 * (v7.31.1). Visualizer states a `preinfusion` field on some files and not on
 * others, and where it is absent the shot's own pressure line has said it all
 * along: a shot with pre-infusion fills at a low, held pressure, levels off,
 * and only then ramps to its peak. That levelling-off is the end of it.
 *
 * So the reading is the first plateau below the peak — the first sample the
 * pressure fails to beat for a sustained window. For a profile that ramps
 * straight to nine bar there is no such plateau and nothing is stated: `null`,
 * not zero, because a shot with no pre-infusion and a shot whose file forgot
 * to mention it are different things and only one of them is a fact.
 *
 * Both halves come back, because both are argued: how long it ran, and what it
 * held while it did. */
const PI_HOLD_S=0.5, PI_EPS_BAR=0.15, PI_CEIL=0.6;
function shotPreinfusion(c){
  const p=c&&c.p,t=c&&c.t;
  if(!p||!t||p.length<4)return null;
  const peak=p.reduce((a,b)=>b>a?b:a,p[0]);
  if(peak<PRESSURE_MIN_BAR)return null;
  const ceil=peak*PI_CEIL;
  for(let i=1;i<p.length-1;i++){
    if(t[i]<0.5||p[i]>ceil||p[i]<0.3)continue;
    if(p[i]<p[i-1])continue;                     // still climbing to the plateau, not on it
    // the plateau is where the pressure stops beating itself for a while —
    // a real hold lasts about a second, so noise never reads as one
    let held=true;
    for(let j=i+1;j<p.length&&t[j]-t[i]<=PI_HOLD_S;j++){
      if(p[j]>p[i]+PI_EPS_BAR){held=false;break}
    }
    if(!held||t[i]+PI_HOLD_S>t[t.length-1])continue;
    // settle on the crest of the plateau rather than the first sample that
    // merely isn't beaten: the epsilon that keeps noise from reading as a hold
    // would otherwise stop the reading a beat early, on the way up
    let k=i;
    for(let j=i+1;j<p.length&&t[j]-t[i]<=PI_HOLD_S;j++)if(p[j]>p[k])k=j;
    return {sec:+t[k].toFixed(1),bar:Math.round(p[k]*10)/10};
  }
  return null;
}
/* the pours a staircase is made of, read off the water going in: a rise is a
 * pour, a flat run is the wait after it. `then` on the last pour is the
 * drawdown — the figure a filter brew is actually argued about — because
 * nothing was added after it and the file kept running until the bed let go.
 *
 * Both thresholds are deliberately loose. POUR_MIN_G refuses to call a scale's
 * own drift a pour; POUR_GAP_S refuses to split one wobbly pour into three. A
 * brew whose file ends mid-drawdown simply states a shorter last `then` — it
 * is not detectable as truncated from the file alone, and inventing an ending
 * for it is exactly what `unread` exists to prevent. */
const POUR_MIN_G=4, POUR_GAP_S=2.5;
function shotPours(c){
  const w=c&&c.wIn;
  if(!w||!c.t||w.length<2)return [];
  const t=c.t,tEnd=t[Math.min(t.length,w.length)-1];
  const runs=[];
  let i=0;
  while(i<w.length-1){
    // walk forward while the water is still climbing, tolerating a flat beat
    // shorter than the gap so one pour doesn't come apart into several
    if(w[i+1]-w[i]>0.05){
      const s=i;let e=i+1,lastRise=i+1;
      while(e<w.length-1){
        if(w[e+1]-w[e]>0.05){e++;lastRise=e;continue}
        if(t[e+1]-t[lastRise]<=POUR_GAP_S){e++;continue}
        break;
      }
      e=lastRise;
      if(w[e]-w[s]>=POUR_MIN_G)runs.push({s,e});
      i=Math.max(e,s+1);
    }else i++;
  }
  return runs.map((r,k)=>{
    const next=runs[k+1];
    return {
      at:t[r.s],
      ms:+(t[r.e]-t[r.s]).toFixed(1),
      added:Math.round((w[r.e]-w[r.s])*10)/10,
      then:+((next?t[next.s]:tEnd)-t[r.e]).toFixed(1),
    };
  });
}
/* the figures a brew is argued about, and they are not the same two arguments.
 *
 * An espresso: how hard it pushed and when, what came out against what went
 * in, how long it took. A pour-over: how long the bloom ran, the ratio, how
 * long the bed took to let go, and the total. Read off the curve where there
 * is one and off the brew's own scalars where there isn't — never mixed within
 * a figure, and null wherever neither states it.
 *
 * The bloom is the whole bloom phase, not the pour that starts it: it runs
 * from the first drop to the second pour, which is why it reads off pours[1]
 * and is null on a brew poured in one go. A single-pour brew has no bloom to
 * state and says so rather than calling its one wait a bloom. */
function shotFigures(shot){
  const c=shot&&shot.curve;
  const dose=shot&&shot.dose!=null?shot.dose:null;
  let total=shot&&shot.timeExact!=null?shot.timeExact:(shot&&shot.time!=null?shot.time:null);
  if(total==null&&c)total=c.t[c.t.length-1];
  if(shotMethod(shot)==='pourover'){
    const pours=(shot&&shot.pours)||(c?shotPours(c):[])||[];
    const wIn=c&&c.wIn;
    const yld=(shot&&shot.water!=null)?shot.water:(wIn?wIn[wIn.length-1]:null);
    return {method:'pourover',pours,
      bloom:pours.length>1?pours[1].at:null,
      drawdown:pours.length?pours[pours.length-1].then:null,
      total,dose,yield:yld,ratio:(dose&&yld)?yld/dose:null};
  }
  let peak=null,peakAt=null;
  if(c&&c.p){
    let i=0;
    for(let k=1;k<c.p.length;k++)if(c.p[k]>c.p[i])i=k;
    peak=c.p[i];peakAt=c.t[i];
  }
  const yld=(shot&&shot.water!=null)?shot.water:(c&&c.w?c.w[c.w.length-1]:null);
  return {method:'espresso',peak,peakAt,total,dose,yield:yld,ratio:(dose&&yld)?yld/dose:null};
}
// which drawing a brew gets. Stated by the file (a scale writes no pressure)
// and carried on the brew once written, never guessed at from a brewer's name.
function shotMethod(shot){
  if(!shot)return 'espresso';
  if(shot.method==='pourover'||shot.method==='espresso')return shot.method;
  return (shot.curve&&shot.curve.method)||'espresso';
}
/* the plate's own geometry — pure, so it can be checked without a screen.
 * `box` states the frame (`w`,`h`) and where the baseline and the ceiling of
 * the plot sit inside it. Two arms, and they share only the frame.
 *
 * Espresso: pressure and flow each read against their own full scale, and what
 * is in the cup against its own maximum with a little air over it, since the
 * three are different quantities and a shared axis would be a claim none of
 * them makes.
 *
 * Pour-over: the water going in is the subject, the cup lags behind it on the
 * SAME scale — they are the same quantity, and the gap between them is the
 * saturated bed, which is the one thing an espresso plate has no equivalent
 * of. The grid is grams off the water actually added rather than an invented
 * scale, and the pours are bands: the band is water going in, the gap is the
 * bed letting go, drawn by being left empty. */
function platePaths(shot,box){
  const c=shot&&shot.curve;
  if(!c)return null;
  const w=box.w,base=box.base;
  const tMax=Math.max(0.1,c.t[c.t.length-1]);
  const X=t=>+(t/tMax*w).toFixed(1);
  if(shotMethod(shot)==='pourover'){
    const top=box.topBand!=null?box.topBand:box.top;
    if(!c.wIn)return null;
    const inMax=Math.max(1,Math.max.apply(null,c.wIn));
    const gMax=inMax*1.07;
    const Y=v=>+(base-Math.max(0,Math.min(v,gMax))/gMax*(base-top)).toFixed(1);
    const line=vals=>vals?vals.map((v,i)=>(i?'L':'M')+X(c.t[i])+' '+Y(v)).join(''):null;
    const water=line(c.wIn),cup=line(c.w);
    const pours=(shot.pours&&shot.pours.length?shot.pours:shotPours(c));
    // the ticks a three-minute brew is read in: minutes, not five-second marks
    const ticks=[];
    for(let s=60;s<tMax;s+=60)ticks.push({x:X(s),s,label:mmss(s)});
    return {method:'pourover',water,cup,
      cupArea:cup?`${cup}L${X(c.t[Math.min(c.t.length,(c.w||[]).length)-1])} ${base}L0 ${base}Z`:null,
      waterArea:water?`${water}L${w} ${base}L0 ${base}Z`:null,
      /* the grid is grams off the water actually added, not an invented axis —
       * but rounded to something a person would say. A real scale trace of a
       * 250 g brew reads 251.3 at its crest, and printing 50/151/251 up the
       * side of the plate is a scale's own noise dressed as a gridline. The
       * STATED figures below the plate keep the true reading; these are marks
       * to read the shape against. */
      grid:[.2,.6,1].map(f=>{const g=niceG(inMax*f);return {g,y:Y(g)}}),
      bands:pours.map((p,i)=>({x:X(p.at),w:Math.max(1,X(p.at+p.ms)-X(p.at)),
        label:i?'+'+trimG(p.added):'BLOOM '+trimG(p.added),
        mid:+((X(p.at)+X(p.at+p.ms))/2).toFixed(1)})),
      pours,ticks,base,top,w,h:box.h,tMax,gMax,
      dash:Math.round(w*3.34)};
  }
  const top=box.top;
  const barMax=Math.max(box.barMax||12,Math.ceil(Math.max.apply(null,c.p)));
  const flowMax=Math.max(box.flowMax||7.5,c.f?Math.max.apply(null,c.f):0);
  const wMax=c.w?Math.max(0.1,Math.max.apply(null,c.w))*1.18:1;
  const Y=(v,max)=>+(base-Math.max(0,Math.min(v,max))/max*(base-top)).toFixed(1);
  const line=(vals,max)=>vals?vals.map((v,i)=>(i?'L':'M')+X(c.t[i])+' '+Y(v,max)).join(''):null;
  const weight=line(c.w,wMax);
  const ticks=[];
  for(let s=5;s<tMax;s+=5)ticks.push({x:X(s),s,label:s+'s'});
  return {
    method:'espresso',
    pressure:line(c.p,barMax),flow:line(c.f,flowMax),weight,
    weightArea:weight?`${weight}L${w} ${base}L0 ${base}Z`:null,
    grid:[3,6,9].filter(b=>b<barMax).map(b=>({bar:b,y:Y(b,barMax)})),
    ticks,base,top,w,h:box.h,tMax,barMax,flowMax,wMax,
    // the dasharray the draw-on animation runs against: over the path's real
    // length by design, so the reveal never stalls short of the end
    dash:Math.round(w*3.34)
  };
}
// a round number at the grain the figure is actually poured to
const niceG=v=>v>=100?Math.round(v/10)*10:v>=20?Math.round(v/5)*5:Math.round(v);
const mmss=s=>s==null?'':Math.floor(s/60)+':'+String(Math.round(s%60)).padStart(2,'0');
const trimG=g=>g==null?'':String(Math.round(g));
/* what the brew stated at one instant — the sample at or before that second,
 * never a value between two of them (a scrub reads the curve, it doesn't
 * smooth it). Null wherever that series isn't on the file at all.
 *
 * A pour-over gains a reading the espresso plate has no use for: the phase.
 * Naming what was happening at 1:44 is the joy of the whole screen, and every
 * one of those names is read off the pours rather than assumed from the clock. */
function shotAt(shot,t){
  const c=shot&&shot.curve;
  if(!c)return null;
  let i=0;
  while(i<c.t.length-1&&c.t[i+1]<=t)i++;
  const pick=a=>a?a[Math.min(i,a.length-1)]:null;
  const at=c.t[Math.min(i,c.t.length-1)];
  if(shotMethod(shot)==='pourover'){
    const pours=(shot.pours&&shot.pours.length?shot.pours:shotPours(c));
    return {t:at,water:pick(c.wIn),grams:pick(c.w),bar:null,flow:null,
      phase:shotPhase(pours,at,c.t[c.t.length-1])};
  }
  return {t:at,bar:pick(c.p),flow:pick(c.f),grams:pick(c.w),water:null,phase:null};
}
function shotPhase(pours,t,tEnd){
  if(!pours||!pours.length)return '';
  const last=pours[pours.length-1];
  if(t>=tEnd-0.05&&tEnd>last.at+last.ms)return 'in the cup';
  for(let i=0;i<pours.length;i++){
    const p=pours[i];
    if(t>=p.at&&t<p.at+p.ms)return i?'pouring pour '+(i+1):'pouring the bloom';
  }
  // the bloom runs from the first drop to the second pour. Every gap after it
  // is the bed letting go — not only the last one, which is merely the gap
  // nothing follows. A brew poured in one go blooms and then draws down.
  if(pours.length>1&&t<pours[1].at)return 'blooming';
  if(pours.length===1&&t<last.at+last.ms)return 'blooming';
  return 'drawing down';
}
/* ==== /pure ==== */

/* ---- the plate, drawn. One drawing at three sizes: full-bleed where the brew
 * is the subject, a hairline where it is context, a thumb on a row. A brew is
 * recognisable by its shape before its label is read — which was the argument
 * for drawing it 44px wide, and which only really pays now there are two
 * shapes to tell apart: an arc and a staircase are unmistakable at that size,
 * so the list needs no icon, no colour and no badge to say which is which. */
const PLATE_FULL={w:390,h:176,base:166,top:18,topBand:20},
      PLATE_HAIR={w:350,h:34,base:31,top:5},
      PLATE_THUMB={w:44,h:22,base:20,top:3};
// the draw-on plays on arrival only — once per brew per size, so a scrub, a
// repaint or a mark never replays it
let _plateDrawn={};
function plateDraws(k){if(_plateDrawn[k])return false;_plateDrawn[k]=true;return true}
function plateSVG(shot,box,opts){
  const g=platePaths(shot,box);
  if(!g)return '';
  opts=opts||{};
  const draw=opts.draw&&plateDraws(shot.id+':'+box.w)?' draw':'';
  const pour=g.method==='pourover';
  // the staircase draws on a slower, flatter ease than the arc, so it waits
  // where the keeper waited rather than sweeping through the gaps
  const cls='plate'+(pour?' pour':'')+(opts.cls?' '+opts.cls:'');
  return `<svg class="${cls}" viewBox="0 0 ${box.w} ${box.h}"${opts.style?` style="${opts.style}"`:''} aria-hidden="true">
    ${pour&&opts.bands&&g.bands.length?g.bands.map(b=>`<rect class="band" x="${b.x}" y="${g.top}" width="${b.w}" height="${(g.base-g.top).toFixed(1)}"></rect>`).join('')
      +`<path class="bandtop" d="${g.bands.map(b=>`M${b.x} ${g.top}L${(b.x+b.w).toFixed(1)} ${g.top}`).join('')}"></path>`:''}
    ${opts.grid?g.grid.map(l=>`<path class="grid" d="M0 ${l.y}L${box.w} ${l.y}"></path>`).join(''):''}
    ${opts.grid&&g.ticks.length?`<path class="tick" d="${g.ticks.map(t=>`M${t.x} ${g.base}L${t.x} ${g.base-6}`).join('')}"></path>`:''}
    ${opts.axis===false?'':`<path class="axis" d="M0 ${g.base}L${box.w} ${g.base}"></path>`}
    ${pour
      ?`${opts.weight&&g.cupArea?`<path class="wt${draw?' ink':''}" d="${g.cupArea}"></path>`:''}
        <path class="wi${draw}" style="--dash:${g.dash}" d="${g.water}"></path>`
      :`${opts.weight&&g.weightArea?`<path class="wt${draw?' ink':''}" d="${g.weightArea}"></path>`:''}
        ${opts.flow&&g.flow?`<path class="fl${draw?' ink':''}" d="${g.flow}"></path>`:''}
        <path class="pr${draw}" style="--dash:${g.dash}" d="${g.pressure}"></path>`}
    ${opts.labels?g.grid.map(l=>`<text class="lb" x="4" y="${(l.y-3).toFixed(1)}">${pour?(l.y===g.grid[g.grid.length-1].y?l.g+' G':l.g):(l.bar===9?'9 BAR':l.bar)}</text>`).join('')
      +g.ticks.map(t=>`<text class="lb" x="${Math.max(0,t.x-(pour?9:5)).toFixed(1)}" y="${box.h}">${t.label}</text>`).join('')
      +(pour&&opts.bands?g.bands.map(b=>bandLabel(b,g,box)).join(''):''):''}
  </svg>`;
}
// one decimal is the precision a dose and a yield are actually weighed to;
// past 100 g nothing states a tenth and printing one is false precision
/* a band's own label, kept on the plate. A pour that starts a few seconds in
 * — which is every brew where the timer runs before the water does — has a
 * band only a handful of pixels wide, and a label centred on it hangs off the
 * left edge: a real brew rendered "LOOM 44". So the label is centred where it
 * fits and anchored to whichever edge it would otherwise cross. The width is
 * estimated rather than measured, because measuring means a DOM and this
 * file has none. */
const bandLabel=(b,g,box)=>{
  const half=String(b.label).length*2.9;   // ~8px sans at .1em tracking
  let x=b.mid,anchor=' text-anchor="middle"';
  if(b.mid-half<2){x=2;anchor=''}
  else if(b.mid+half>box.w-2){x=box.w-2;anchor=' text-anchor="end"'}
  return `<text class="lb" x="${x}"${anchor} y="${(g.top-5).toFixed(1)}">${b.label}</text>`;
};
const fig1=v=>v==null?'—':(Math.abs(v)>=100?String(Math.round(v)):(Math.round(v*10)/10).toFixed(1));
/* the three stated figures, at dial scale — and they are three different
 * figures per method, and not quite the same three on the hero as on the
 * plate's own screen. An espresso is argued about by its peak; a pour-over by
 * its drawdown, with the bloom taking that slot on the hero where drawdown has
 * not happened yet as far as the eye reading it is concerned. Where a figure's
 * own parts aren't stated the label falls back to naming the figure rather
 * than inventing them. */
function figsHTML(fg,small){
  const cell=(v,l)=>`<div><div class="v">${v}</div><div class="l">${l}</div></div>`;
  const ratio=cell(fg.ratio==null?'—':'1:'+fig1(fg.ratio),
    fg.dose==null||fg.yield==null?'Ratio':esc(fig1(fg.dose)+' → '+fig1(fg.yield)+' g'));
  if(fg.method==='pourover'){
    return `<div class="figs${small?' small':''}">
      ${small?cell(fg.bloom==null?'—':mmss(fg.bloom),'Bloom'):ratio}
      ${small?ratio:cell(fg.drawdown==null?'—':mmss(fg.drawdown),'Drawdown')}
      ${cell(fg.total==null?'—':mmss(fg.total),small?'Time':'Total')}
    </div>`;
  }
  return `<div class="figs${small?' small':''}">
    ${cell(fg.peak==null?'—':fig1(fg.peak)+'<span class="u">bar</span>',
      fg.peakAt==null||small?'Peak':esc('Peak, at '+fig1(fg.peakAt)+'s'))}
    ${ratio}
    ${cell(fg.total==null?'—':fig1(fg.total)+'<span class="u">s</span>',small?'Time':'Total')}
  </div>`;
}
// the scrub: drag anywhere on the plate and the readout states what the brew
// stated at that instant. Painted straight into the box — a re-render here
// would replay the draw-on and lose the crosshair's own place.
function plateBoxHTML(shot,g){
  const pour=g.method==='pourover';
  const fg=shotFigures(shot);
  // the crosshair opens where the plate is most worth reading: the peak on a
  // shot, the last pour on a filter brew — never at nothing
  const last=pour&&fg.pours&&fg.pours.length?fg.pours[fg.pours.length-1]:null;
  const at=pour?(last?last.at+last.ms+(last.then||0)/2:0):(fg.peakAt||0);
  const f=g.tMax?Math.min(1,Math.max(0,at/g.tMax)):0;
  return `<div class="platebox${pour?' pour':''}" data-shot="${esc(String(shot.id))}"
      onpointerdown="plateScrub(event)" onpointermove="plateScrub(event)">
    ${plateSVG(shot,PLATE_FULL,{draw:true,grid:true,flow:true,weight:true,labels:true,bands:true})}
    <div class="cross" style="left:${(f*100).toFixed(2)}%"></div>
    <div class="read">${scrubReadHTML(shotAt(shot,f*g.tMax))}</div>
  </div>`;
}
function scrubReadHTML(at){
  if(!at)return '';
  const r=(k,v)=>`<span class="r"><span>${k}</span><b>${v}</b></span>`;
  if(at.phase!=null){
    return r('at',mmss(at.t))+r('water',at.water==null?'—':at.water.toFixed(0)+' g')
      +r('in cup',at.grams==null?'—':at.grams.toFixed(0)+' g')
      +(at.phase?`<span class="ph">${esc(at.phase)}</span>`:'');
  }
  return r('at',at.t.toFixed(1)+'s')+r('bar',at.bar==null?'—':at.bar.toFixed(1))
    +r('ml/s',at.flow==null?'—':at.flow.toFixed(2))+r('in cup',at.grams==null?'—':at.grams.toFixed(1)+' g');
}
function plateScrub(e){
  const box=e.currentTarget,shot=vizShotById(box.getAttribute('data-shot'));
  if(!shot||!shot.curve)return;
  const r=box.getBoundingClientRect();if(!r.width)return;
  const f=Math.min(1,Math.max(0,(e.clientX-r.left)/r.width));
  const tMax=shot.curve.t[shot.curve.t.length-1];
  const cross=box.querySelector('.cross'),read=box.querySelector('.read');
  if(cross)cross.style.left=(f*100).toFixed(2)+'%';
  if(read)read.innerHTML=scrubReadHTML(shotAt(shot,f*tMax));
}

/* ---- the seam (ARCHITECTURE.md §1). Published as plain globals the way the
 * map layer's LANDS and decoders are, and read by index.html's own script as
 * such. One direction only: nothing above ever reaches back into the app. */
/* what this file is, so index.html can tell whether the copy it got is the
 * copy it expects. A mismatch means a cached sibling (see index.html's <head>)
 * and is worth saying out loud — at v7.31.1 the same mismatch was silent and
 * looked to the keeper like their Visualizer account had stopped working. */
window.PLATE_VERSION='7.37.7';
window.shotCurve=shotCurve;
window.shotPours=shotPours;
window.shotPreinfusion=shotPreinfusion;
window.shotFigures=shotFigures;
window.shotMethod=shotMethod;
window.platePaths=platePaths;
window.shotAt=shotAt;
window.shotPhase=shotPhase;
window.mmss=mmss;
window.fig1=fig1;
window.PLATE_FULL=PLATE_FULL;
window.PLATE_HAIR=PLATE_HAIR;
window.PLATE_THUMB=PLATE_THUMB;
window.plateSVG=plateSVG;
window.figsHTML=figsHTML;
window.plateBoxHTML=plateBoxHTML;
window.scrubReadHTML=scrubReadHTML;
window.plateScrub=plateScrub;

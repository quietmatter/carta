/* Carta design mock — environment: seeded record, offline posture, canned network.
   Loads BEFORE the app scripts. Writes only carta7.design.* keys.

   VENDORED, verbatim, from the Claude Design handoff bundle's `mock/env.js`
   (project `CARTA redesign proposal`, v7.35.0 fold). It is the record the
   consolidation turn was designed against, and test/verify-v7.35.js replays the
   proposal's own flows on it — so it belongs beside the test rather than being
   fetched from a bundle the app repo does not carry. The harness rewrites the
   carta7.design.* keys to the app's own carta7.* on the way in.

   Do not edit to fix a test. If a flow changed, change the test. */
(function(){
'use strict';
var DAY=864e5, now=Date.now();
var iso=function(msAgo){return new Date(now-msAgo).toISOString()};
var d=function(days){return iso(days*DAY)};
var dateOnly=function(days){return new Date(now-days*DAY).toISOString().slice(0,10)};

/* ---- offline posture: streets step aside, the drawn plot stands (deterministic) ---- */
try{Object.defineProperty(window.navigator,'onLine',{get:function(){return false},configurable:true})}catch(e){}

/* ---- curve synthesis (Visualizer file shapes carta-plate.js reads) ---- */
function espCurve(dur,peak,tail){
  var t=[],p=[],f=[],w=[],wv=0;
  for(var x=0;x<=dur;x+=0.2){
    t.push(Math.round(x*10)/10);
    var pv;
    if(x<1)pv=1.4*x;
    else if(x<4.4)pv=2.7+0.16*Math.sin(x*3);            // pre-infusion plateau ~2.8 bar
    else if(x<8)pv=2.8+(peak-2.8)*(x-4.4)/3.6;          // ramp
    else if(x<16)pv=peak-0.35*(x-8)/8;                  // hold
    else pv=peak-0.35-(peak-0.35-tail)*(x-16)/(dur-16); // decline
    p.push(Math.round(pv*100)/100);
    var fv=x<6?0:(x<12?2.15*(x-6)/6:(x<dur-4?2.15+0.1*Math.sin(x):1.9));
    f.push(Math.round(fv*100)/100);
    wv+=fv*0.2*0.92; w.push(Math.round(wv*10)/10);
  }
  return {timeframe:t,espresso_pressure:p,espresso_flow:f,espresso_weight:w};
}
function pourCurve(){
  var t=[],wIn=[],w=[],cup=0;
  var steps=[[0,0],[4,0],[12,46],[44,46],[58,132],[74,132],[88,212],[104,212],[118,302],[168,302]];
  function at(x){for(var i=1;i<steps.length;i++){var a=steps[i-1],b=steps[i];
    if(x<=b[0])return a[1]+(b[1]-a[1])*Math.max(0,(x-a[0]))/Math.max(1,(b[0]-a[0]));}
    return 302}
  for(var x=0;x<=168;x+=1){
    t.push(x); var win=Math.round(at(x)*10)/10; wIn.push(win);
    var target=Math.max(0,win-38);                      // the bed holds ~38 g
    if(x>118)target=Math.max(0,302-38)+ (x-118)/47*30;  // drawdown lets go
    cup=cup+(Math.min(target,294)-cup)*0.12;
    w.push(Math.round(cup*10)/10);
  }
  return {timeframe:t,espresso_water_dispensed:wIn,current_total_shot_weight:w};
}

/* ---- the three shots the account lists ---- */
var SHOTS={
  vz1:Object.assign({id:'vz1',profile_title:'LRv3 · gentle ramp',machine:'Slayer 1G',
    bean_brand:'Sey',bean_type:'Ethiopia Gedeb',bean_weight:18,drink_weight:36.4,duration:27.4,
    grinder_setting:4.6,grinder_model:'EG-1',roast_date:dateOnly(12),roast_level:'Light',
    espresso_temperature_goal:93.5,start_time:Math.round((now-22*60e3)/1000)},espCurve(27.4,9.1,6.2)),
  vz2:Object.assign({id:'vz2',bean_brand:'Ferrous',bean_type:'Worka Sakaro',bean_weight:19,
    drink_weight:264,duration:168,grinder_setting:7.2,grinder_model:'Ode 2, SSP MP',
    brewer:'V60 02',start_time:Math.round((now-1.2*DAY)/1000)},pourCurve()),
  vz3:Object.assign({id:'vz3',profile_title:'LRv3 · gentle ramp',machine:'Slayer 1G',
    bean_brand:'Sey',bean_type:'Ethiopia Gedeb',bean_weight:18,drink_weight:35.8,duration:26.8,
    grinder_setting:4.7,grinder_model:'EG-1',roast_date:dateOnly(12),roast_level:'Light',
    espresso_temperature_goal:93.5,start_time:Math.round((now-3.1*DAY)/1000)},espCurve(26.8,9.0,6.0)),
};
var SHOT_ORDER=['vz1','vz2','vz3'];
function essentials(s){var c={},k;for(k in s)if(['timeframe','espresso_pressure','espresso_flow','espresso_weight','espresso_water_dispensed','current_total_shot_weight'].indexOf(k)<0)c[k]=s[k];return c}

/* ---- the canned answer (Lisbon) ---- */
var ASK_ANSWER={
  read:"Lisbon's specialty scene is small and walkable — your bar is met in Baixa and along the river, rarely further out.",
  cafes:[
    {name:'Fábrica',neighborhood:'Baixa',city:'Lisbon',verdict:'the cleanest cup',
     why:'A roastery bar holding the washed, floral end of the shelf you keep scoring highest.',
     fit:['washed 8.2/9, n=6','Sey 8.5 avg'],order:'the guest filter, asked by origin',travel:'ten minutes on foot',stale:false},
    {name:'Copenhagen Coffee Lab',neighborhood:'Príncipe Real',city:'Lisbon',verdict:'the reliable second',
     why:'Nordic-leaning menu that clears your floor on an ordinary day rather than a lucky one.',
     fit:['floral 8.4/9'],order:'whatever V60 is on',travel:'twenty minutes uphill',stale:true},
    {name:'Comoba',neighborhood:'Cais do Sodré',city:'Lisbon',verdict:'the sleeper by the river',
     why:'Quietly pours guest roasters at the light end your record keeps rewarding.',
     fit:['Light 8.3/9, n=9'],order:'the batch brew first — it tells you the room',travel:'on your way anywhere',stale:false}],
  mentions:[{name:'Nicolau',city:'Lisbon',instead:'A brunch room first — the coffee is a garnish there, and your floor would not survive it.'}],
  plan:{move:'Start at Fábrica at open, before the tour groups: the bar is unhurried and the guest filter is fresh.',
    routes:[{if:'one free morning',order:['Fábrica','Comoba']},{if:'a rainy afternoon',order:['Copenhagen Coffee Lab']}],
    wildcard:{name:'Hello, Kristof',city:'Lisbon',why:'A magazine shop pouring better espresso than most bars — outside the ranking for its hours alone.'}}};

/* ---- canned geography ---- */
var GEO={
  'fábrica':[{lat:38.7188,lon:-9.1355,name:'Fábrica',hood:'Baixa',city:'Lisbon'}],
  'copenhagen coffee lab':[{lat:38.7169,lon:-9.1481,name:'Copenhagen Coffee Lab',hood:'Príncipe Real',city:'Lisbon'}],
  'comoba':[{lat:38.7071,lon:-9.1442,name:'Comoba',hood:'Cais do Sodré',city:'Lisbon'}],
  'hello, kristof':[{lat:38.7104,lon:-9.1473,name:'Hello, Kristof',hood:'Santos',city:'Lisbon'}],
  'maru':[{lat:34.0446,lon:-118.2357,name:'Maru',hood:'Arts District',city:'Los Angeles'},
          {lat:34.0413,lon:-118.4438,name:'Maru',hood:'Sawtelle',city:'Los Angeles'}],
  'worka sakaro':[{lat:5.9520,lon:38.4210,name:'Worka Sakaro',hood:'',city:''}],
};
function geoHits(q){
  q=String(q||'').toLowerCase();
  for(var k in GEO){if(q.indexOf(k)>=0)return GEO[k]}
  return [];
}

/* ---- fetch, intercepted for the three doors the app opens ---- */
var realFetch=window.fetch.bind(window);
var J=function(obj,ms){return new Promise(function(res){setTimeout(function(){
  res(new Response(JSON.stringify(obj),{status:200,headers:{'content-type':'application/json'}}))},ms||160)})};
window.fetch=function(url,opts){
  var u=String(url);
  if(u.indexOf('nominatim')>=0){
    if(u.indexOf('/reverse')>=0)return J({address:{neighbourhood:'Alfama',city:'Lisbon'}},420);
    var m=u.match(/[?&]q=([^&]*)/);
    var hits=geoHits(decodeURIComponent(m?m[1]:''));
    return J(hits.map(function(h){return {lat:String(h.lat),lon:String(h.lon),name:h.name,
      address:{neighbourhood:h.hood||undefined,city:h.city||undefined}}}),420);
  }
  if(u.indexOf('visualizer.coffee')>=0){
    if(window.__vizDown)return Promise.resolve(new Response('',{status:500}));
    var dm=u.match(/\/api\/shots\/([^\/\?]+)\/download/);
    if(dm){var s=SHOTS[dm[1]];if(!s)return Promise.resolve(new Response('',{status:404}));
      return J(u.indexOf('essentials=true')>=0?essentials(s):s,650)}
    var im=u.match(/items=(\d+)/);
    var n=im?Number(im[1]):8;
    return J({data:SHOT_ORDER.slice(0,n).map(function(id){return {id:id,clock:SHOTS[id].start_time+120}})},520);
  }
  if(u.indexOf('api.anthropic.com')>=0){
    if(window.__askFail)return J({error:{message:'Overloaded — try again in a moment.'}},1200).then(function(r){
      return new Response(r.body,{status:529,headers:{'content-type':'application/json'}})});
    var body={};try{body=JSON.parse(opts&&opts.body||'{}')}catch(e){}
    var text=window.__askGarbled?'I could not settle on a shape for this.':JSON.stringify(ASK_ANSWER);
    return J({content:[{type:'text',text:text}]},2600);
  }
  return realFetch(url,opts);
};

/* ---- the seeded record ---- */
function seed(){
  var R={sey:'r_sey',fer:'r_fer',onyx:'r_onyx',cabra:'r_cabra',sh:'r_sh'};
  var roasters=[
    {id:R.sey,createdAt:d(160),name:'Sey',aka:["Sey's"]},
    {id:R.fer,createdAt:d(120),name:'Ferrous',aka:[]},
    {id:R.onyx,createdAt:d(96),name:'Onyx',aka:[]},
    {id:R.cabra,createdAt:d(80),name:'La Cabra',aka:[]},
    {id:R.sh,createdAt:d(60),name:'Small Hours',aka:[]}];
  var setups=[
    {id:'st_esp',createdAt:d(150),name:'Home espresso · 49mm',grinder:'EG-1',brewer:'Slayer 1G',
     basket:'VST 18 g',papers:'',water:'ZW + epsom',grindMin:0,grindMax:10,grindStep:0.1},
    {id:'st_v60',createdAt:d(140),name:'V60 · 02',grinder:'Ode 2, SSP MP',brewer:'V60 02',
     basket:'',papers:'Cafec Abaca',water:'TWW light',grindMin:0,grindMax:11,grindStep:0.1}];
  var coffees=[
    {id:'c_gedeb',createdAt:d(14),roaster:'Sey',roasterRef:R.sey,name:'Ethiopia Gedeb',home:true,
     origin:{country:'Ethiopia',region:'Gedeb',farm:'Worka Sakaro',producer:'Worka Sakaro washing station',
       variety:'74158',process:'Washed',altitude:'1,900 – 2,100 m',lat:5.952,lon:38.421,geocoded:true},
     roastLevel:'Light',roastDate:dateOnly(12),notes:''},
    {id:'c_worka',createdAt:d(30),roaster:'Ferrous',roasterRef:R.fer,name:'Worka Sakaro',home:true,
     origin:{country:'Ethiopia',region:'Gedeb',process:'Natural'},roastLevel:'Light',roastDate:dateOnly(24)},
    {id:'c_kiri',createdAt:d(46),roaster:'Onyx',roasterRef:R.onyx,name:'Kenya Kirinyaga AB',home:true,
     origin:{country:'Kenya',region:'Kirinyaga',producer:'Kii FCS',variety:'SL28, SL34',process:'Washed'},
     roastLevel:'Light',roastDate:dateOnly(40)},
    {id:'c_pink',createdAt:d(9),roaster:'La Cabra',roasterRef:R.cabra,name:'Colombia Pink Bourbon',home:false,
     origin:{country:'Colombia',region:'Huila',process:'Honey'},roastLevel:'Light'},
    {id:'c_ilu',createdAt:d(22),roaster:'Small Hours',roasterRef:R.sh,name:'La Ilusión',home:true,homeAt:d(9),
     origin:{country:'El Salvador',region:'Chalatenango',variety:'Pacamara',process:'Natural'}},
    {id:'c_cort',createdAt:d(75),roaster:'Sey',roasterRef:R.sey,name:'Bombe',home:false,
     origin:{country:'Ethiopia',region:'Sidama',process:'Washed'}}];
  var places=[
    {id:'p_half',createdAt:d(90),name:'Halfpence',city:'Los Angeles',neighborhood:'Echo Park',
     lat:34.0782,lon:-118.2606,geocoded:true,aka:[]},
    {id:'p_maru',createdAt:d(6),name:'Maru',city:'Los Angeles',geocoded:true,aka:[],
     branches:[{lat:34.0446,lon:-118.2357,name:'Maru',hood:'Arts District',city:'Los Angeles'},
               {lat:34.0413,lon:-118.4438,name:'Maru',hood:'Sawtelle',city:'Los Angeles'}]},
    {id:'p_day',createdAt:d(60),name:'Dayglow',city:'Los Angeles',neighborhood:'Silver Lake',
     lat:34.0872,lon:-118.2765,geocoded:true,aka:[]},
    {id:'p_fab',createdAt:d(150),name:'Fábrica',city:'Lisbon',neighborhood:'Baixa',
     lat:38.7188,lon:-9.1355,geocoded:true,aka:[]},
    {id:'p_ccl',createdAt:d(149),name:'Copenhagen Coffee Lab',city:'Lisbon',neighborhood:'Príncipe Real',
     lat:38.7169,lon:-9.1481,geocoded:true,aka:[]}];
  var brews=[
    {id:'b_prev',createdAt:d(2),at:d(2),coffeeRef:'c_gedeb',setupId:'st_esp',technique:'espresso',
     grind:4.7,doseG:18,waterG:35.8,tempC:93.5,timeSec:27,vizShotId:'vz3'},
    {id:'b_v60',createdAt:d(5),at:d(5),coffeeRef:'c_worka',setupId:'st_v60',technique:'V60',
     grind:7.2,doseG:19,waterG:302,tempC:96,timeSec:168,method:'pourover',brewer:'V60 02'},
    {id:'b_kiri',createdAt:d(18),at:d(18),coffeeRef:'c_kiri',setupId:'st_esp',technique:'espresso',
     grind:4.9,doseG:18,waterG:36,tempC:94,timeSec:29}];
  var cups=[
    {id:'k1',createdAt:d(2),at:d(2),kind:'home',coffeeRef:'c_gedeb',brewRef:'b_prev',vizShotId:'vz3',
     score:8,line:'Apricot up top; the wait was worth it.',descriptors:['floral','stone fruit']},
    {id:'k2',createdAt:d(5),at:d(5),kind:'home',coffeeRef:'c_worka',brewRef:'b_v60',
     score:7,line:'Sweeter once it cooled; the bed held on too long.',descriptors:['berry','honey']},
    {id:'k3',createdAt:d(6),at:d(6),kind:'bar',placeRef:'p_maru',coffeeRef:'c_pink',
     score:8,line:'Round and clean — asked what was on the second grinder.',descriptors:['floral','honey']},
    {id:'k4',createdAt:d(9),at:d(9),kind:'bar',placeRef:'p_day',coffeeRef:'c_pink',
     score:8,line:'The honey reads louder here.',descriptors:['honey','tropical']},
    {id:'k5',createdAt:d(18),at:d(18),kind:'home',coffeeRef:'c_kiri',brewRef:'b_kiri',
     score:6,line:'Tight — two clicks finer next time.',descriptors:['citrus']},
    {id:'k6',createdAt:d(20),at:d(20),kind:'bar',placeRef:'p_half',coffeeRef:'c_gedeb',
     score:9,line:'Stopped me mid-sentence. The cup this app exists for.',descriptors:['floral','citrus','tea-like']},
    {id:'k7',createdAt:d(34),at:d(34),kind:'bar',placeRef:'p_half',coffeeRef:'c_cort',
     score:8,line:'A cortado that did not need to be one.',descriptors:['chocolate','citrus']},
    {id:'k8',createdAt:d(52),at:d(52),kind:'home',coffeeRef:'c_kiri',
     score:null,line:'',descriptors:[]},
    {id:'k9',createdAt:d(148),at:d(148),kind:'bar',placeRef:'p_fab',coffeeRef:'c_cort',
     score:8,line:'Worth the walk down and back up.',descriptors:['floral']},
    {id:'k10',createdAt:d(149),at:d(149),kind:'bar',placeRef:'p_ccl',coffeeRef:'c_worka',
     score:7,line:'Good, ordinary, dependable.',descriptors:['nutty']},
    {id:'k11',createdAt:d(64),at:d(64),kind:'bar',placeRef:'p_day',coffeeRef:'c_cort',
     score:5,line:'Pulled long and it showed.',descriptors:['roasted']},
    {id:'k12',createdAt:d(80),at:d(80),kind:'home',coffeeRef:'c_worka',
     score:8,line:'The natural finally behaved at 96.',descriptors:['berry','fermented']}];
  var menus=[{id:'m_half',createdAt:d(20),at:d(20),placeRef:'p_half',items:[
    {text:'Sey — Ethiopia Gedeb, washed',roaster:'Sey',name:'Ethiopia Gedeb',roastLevel:'',coffeeRef:'c_gedeb'},
    {text:'Ferrous — Worka Sakaro, natural',roaster:'Ferrous',name:'Worka Sakaro',roastLevel:''},
    {text:'La Cabra — Colombia Pink Bourbon, honey',roaster:'La Cabra',name:'Colombia Pink Bourbon',roastLevel:'',coffeeRef:'c_pink'}]}];
  var mkFind=function(o){return Object.assign({id:'f_'+o.name.toLowerCase().replace(/[^a-z]+/g,''),grounded:o.lat!=null,status:null,placeRef:null},o)};
  var asks=[{id:'ask_lx',createdAt:d(5),kind:'city',destination:'Lisbon',question:'Three days, mostly Baixa and the river, on foot.',
    reach:'on foot',model:'claude-opus-5',read:ASK_ANSWER.read,
    findings:[
      mkFind({name:'Fábrica',neighborhood:'Baixa',city:'Lisbon',verdict:'the cleanest cup',
        why:ASK_ANSWER.cafes[0].why,fit:ASK_ANSWER.cafes[0].fit,order:ASK_ANSWER.cafes[0].order,travel:'ten minutes on foot',stale:false,lat:38.7188,lon:-9.1355}),
      mkFind({name:'Copenhagen Coffee Lab',neighborhood:'Príncipe Real',city:'Lisbon',verdict:'the reliable second',
        why:ASK_ANSWER.cafes[1].why,fit:ASK_ANSWER.cafes[1].fit,order:ASK_ANSWER.cafes[1].order,travel:'twenty minutes uphill',stale:true,lat:38.7169,lon:-9.1481}),
      mkFind({name:'Comoba',neighborhood:'Cais do Sodré',city:'Lisbon',verdict:'the sleeper by the river',
        why:ASK_ANSWER.cafes[2].why,fit:ASK_ANSWER.cafes[2].fit,order:ASK_ANSWER.cafes[2].order,travel:'on your way anywhere',stale:false,lat:38.7071,lon:-9.1442})],
    mentions:[mkFind({name:'Nicolau',city:'Lisbon',instead:ASK_ANSWER.mentions[0].instead,lat:null,lon:null})],
    plan:{move:ASK_ANSWER.plan.move,routes:ASK_ANSWER.plan.routes,
      wildcard:mkFind({name:'Hello, Kristof',city:'Lisbon',why:ASK_ANSWER.plan.wildcard.why,lat:38.7104,lon:-9.1473})}}];
  asks[0].findings[1].status='been';asks[0].findings[1].placeRef='p_ccl';
  return {version:1,cups:cups,coffees:coffees,places:places,roasters:roasters,setups:setups,
    brews:brews,menus:menus,asks:asks,
    prefs:{tempUnit:'C',exportedAt:d(22),
      visualizerEmail:'keeper@quietmatter.co',visualizerPassword:'demo',vizWatch:true,
      askKey:'',askModel:'',
      seenCountries:['ethiopia','kenya','colombia','el salvador'],
      seenCities:['los angeles','lisbon']}};
}

var FIRSTRUN=(function(){try{return localStorage.getItem('carta7.design.firstrun')==='1'}catch(e){return false}})();
window.CARTA_FIRSTRUN=FIRSTRUN;
try{
  if(FIRSTRUN){
    localStorage.setItem('carta7.design.v1',JSON.stringify({version:1,cups:[],coffees:[],places:[],roasters:[],setups:[],brews:[],menus:[],asks:[],prefs:{}}));
    localStorage.removeItem('carta7.design.shots.v1');
    localStorage.removeItem('carta7.design.shotsread.v1');
  }else{
    localStorage.setItem('carta7.design.v1',JSON.stringify(seed()));
    localStorage.setItem('carta7.design.shots.v1',JSON.stringify({vz3:{
      t:SHOTS.vz3.timeframe,p:SHOTS.vz3.espresso_pressure,f:SHOTS.vz3.espresso_flow,w:SHOTS.vz3.espresso_weight,wIn:null,method:'espresso'}}));
    localStorage.removeItem('carta7.design.shotsread.v1');
  }
}catch(e){}

/* ---- board controls (the chrome outside the frame calls these) ---- */
window.CARTA_DESIGN={
  theme:function(t){window.__theme=t;if(window.applyTheme)window.applyTheme()},
  firstRun:function(on){try{localStorage.setItem('carta7.design.firstrun',on?'1':'0')}catch(e){};location.reload()},
  reset:function(){try{['carta7.design.v1','carta7.design.shots.v1','carta7.design.shotsread.v1','carta7.design.firstrun','carta7.design.seen'].forEach(function(k){localStorage.removeItem(k)})}catch(e){};location.reload()},
  askFail:function(on){window.__askFail=!!on},
  askGarbled:function(on){window.__askGarbled=!!on},
  vizDown:function(on){window.__vizDown=!!on},
};
})();

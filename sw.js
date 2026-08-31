/* sw.js — the shell, kept.
 *
 * "Works offline from then on" was a promise the app could not keep on a cold
 * launch: the ledger lives in localStorage and every network touch degrades,
 * but the eight files of the shell itself came over ordinary HTTP cache —
 * good for ten minutes on GitHub Pages, then a revalidation that fails with
 * no network, and an installed app that opens on the OS's own error page in
 * exactly the place PIVOT.md sends you (a new city, roaming off).
 *
 * This is the smallest worker that closes that gap, and it is written against
 * the v7.31.1 lesson — a stale shell is worse than a slow one:
 *   - a navigation is network-first, so an online keeper always runs the
 *     newest index.html; only with no answer at all does the cached one stand
 *   - the siblings ride their ?v= URLs, so a new index.html can never be
 *     served an old sibling out of this cache — a versioned URL misses and
 *     falls through to the network, same as before this file existed
 *   - SW_VERSION moves in lockstep with APP_VERSION (verify-static holds the
 *     seam), so every release re-installs and the old cache is dropped whole
 *
 * No dependency, no build, nothing between the source and the host —
 * ARCHITECTURE.md §1 and §10 carry the amendment argument for this file. */
const SW_VERSION='7.47.0';
const CACHE='carta-'+SW_VERSION;
const SIBS=['carta-map.js','carta-plate.js','carta-shot.js','carta-ask.js','carta-atlas.js','carta-rooms.js'];
const SHELL=['./','manifest.json','favicon.svg','icon-192.svg','icon-512.svg','icon-maskable-512.svg',
  'apple-touch-icon.png','icon-512.png']
  .concat(SIBS.map(s=>s+'?v='+SW_VERSION))
  .concat(['LibreFranklin-var.latin.woff2','LibreFranklin-var.latin-ext.woff2',
    'LibreFranklin-varItalic.latin.woff2','LibreFranklin-varItalic.latin-ext.woff2',
    'Spectral-Regular.latin.woff2','Spectral-Regular.latin-ext.woff2',
    'Spectral-RegularItalic.latin.woff2','Spectral-RegularItalic.latin-ext.woff2',
    'Spectral-SemiBold.latin.woff2','Spectral-SemiBold.latin-ext.woff2',
    'Spectral-SemiBoldItalic.latin.woff2','Spectral-SemiBoldItalic.latin-ext.woff2'].map(f=>'fonts/'+f));
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys()
    .then(ks=>Promise.all(ks.filter(k=>k.startsWith('carta-')&&k!==CACHE).map(k=>caches.delete(k))))
    .then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET')return;
  const url=new URL(req.url);
  // never stand between the app and the world: tiles, Nominatim, the ask,
  // Visualizer and Leaflet all keep their own stated degrades (§7)
  if(url.origin!==location.origin)return;
  if(req.mode==='navigate'){
    // network-first: fresh whenever the world answers, cached when it doesn't
    e.respondWith(fetch(req).then(r=>{
      if(r.ok){const cp=r.clone();caches.open(CACHE).then(c=>c.put('./',cp))}
      return r;
    }).catch(()=>caches.match('./')));
    return;
  }
  // everything else in the shell: cache-first, and a network answer refreshes
  // the copy so a mid-cycle fix is picked up without waiting for a reinstall
  e.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(r=>{
    if(r.ok){const cp=r.clone();caches.open(CACHE).then(c=>c.put(req,cp))}
    return r;
  })));
});

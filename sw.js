const CACHE="jura-info-72h-diag-v3-20261002";
const A=["./","./index.html","./manifest.webmanifest","./icons/icon-192.png","./icons/icon-512.png","./icons/apple-touch-icon.png"];

self.addEventListener("install",e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(A)).then(()=>self.skipWaiting()));
});

self.addEventListener("activate",e=>{
  e.waitUntil(
    caches.keys().then(keys=>Promise.all(
      keys.filter(k=>k.startsWith("jura-info-72h-diag-") && k!==CACHE)
          .map(k=>caches.delete(k))
    )).then(()=>self.clients.claim())
  );
});

self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET") return;
  e.respondWith(
    fetch(e.request,{cache:"no-store"}).then(r=>{
      const c=r.clone();
      caches.open(CACHE).then(k=>k.put(e.request,c));
      return r;
    }).catch(()=>caches.match(e.request).then(r=>r||caches.match("./index.html")))
  );
});

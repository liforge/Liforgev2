// =====================
// LIFORGE SERVICE WORKER
// =====================

const CACHE_NAME = "liforge-v3";

const FILES = [

  "/Liforgev2/",
  "/Liforgev2/index.html",

  "/Liforgev2/manifest.json",

  "/Liforgev2/logo-192.png",
  "/Liforgev2/logo-512.png",

  "/Liforgev2/style.css",
  "/Liforgev2/app.js"

];


// =====================
// INSTALL
// =====================

self.addEventListener("install", (event)=>{

  self.skipWaiting();

  event.waitUntil(

    caches.open(CACHE_NAME)
    .then(cache=>{

      return cache.addAll(FILES);

    })

  );

});


// =====================
// ACTIVATE
// =====================

self.addEventListener("activate",(event)=>{

  event.waitUntil(

    caches.keys()
    .then(keys=>{

      return Promise.all(

        keys.map(key=>{

          if(key !== CACHE_NAME){

            return caches.delete(key);

          }

        })

      );

    })

  );


  self.clients.claim();

});


// =====================
// FETCH
// =====================

self.addEventListener("fetch",(event)=>{

  event.respondWith(

    fetch(event.request)
    .catch(()=>{

      return caches.match(event.request);

    })

  );

});

const CACHE_NAME = "liforge-v2"; // <- zmieniasz wersję = reset cache

const FILES = [
  "./",
  "./index.html",
  "./manifest.json",
  "./logo-512.png",
  "./logo-192.png"
];

self.addEventListener("install", (event) => {
  self.skipWaiting(); // natychmiast aktywuj nową wersję

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key); // usuń stare wersje
          }
        })
      )
    )
  );

  self.clients.claim(); // przejmij kontrolę nad stroną
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() =>
      caches.match(event.request)
    )
  );
});

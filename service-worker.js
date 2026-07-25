// Improved Liforge service worker (polish comments removed for brevity)
const CACHE_NAME = 'liforge-v3';
const FILES = [
  './',
  './index.html',
  './manifest.json',
  './logo-192.png',
  './logo-512.png',
  './style.css',
  './app.js'
];

// Install: cache core assets; tolerate partial failures so install doesn't fail on one missing file
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      const results = await Promise.allSettled(FILES.map((f) => cache.add(f)));
      const rejected = results.filter(r => r.status === 'rejected');
      if (rejected.length) {
        console.warn('Some resources failed to cache during install:', rejected);
      }
    })
  );
});

// Activate: clean up old caches and claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    ).then(() => self.clients.claim())
  );
});

function isSameOrigin(request) {
  return new URL(request.url).origin === self.location.origin;
}

self.addEventListener('fetch', (event) => {
  const req = event.request;

  if (req.method !== 'GET') return; // Let non-GET requests pass through

  // Navigation requests (SPA) - network first, fallback to cached index.html
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.ok) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((c) => c.put('./index.html', copy));
          }
          return networkResponse;
        })
        .catch(() =>
          caches.match('./index.html').then((cached) => cached || Promise.reject('no-index'))
        )
    );
    return;
  }

  // Same-origin static assets: stale-while-revalidate
  if (isSameOrigin(req)) {
    event.respondWith(
      caches.match(req).then((cached) => {
        const networkFetch = fetch(req)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.ok) {
              const clone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
            }
            return networkResponse;
          })
          .catch(() => null);

        return cached || networkFetch;
      })
    );
    return;
  }

  // Cross-origin: try network then cache
  event.respondWith(
    fetch(req)
      .then((resp) => resp)
      .catch(() => caches.match(req))
  );
});

// Allow page to trigger skipWaiting via postMessage({type: 'SKIP_WAITING'})
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

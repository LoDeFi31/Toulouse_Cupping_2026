const CACHE_NAME = 'toulouse-cupping-v4';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Install Event: Cache critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Pre-caching offline page');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate Event: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim();
});

// Fetch Event: Stratégie hybride pour SPA
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // 1. Navigation (HTML) -> Network First, puis Cache
  // Gérer spécifiquement le cas du start_url avec query params (/?source=pwa)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          // Essayer le réseau d'abord
          const networkResponse = await fetch(event.request);
          return networkResponse;
        } catch (error) {
          // Fallback sur le cache
          const cache = await caches.open(CACHE_NAME);
          // Essayer de trouver l'URL exacte, sinon retourner index.html (SPA routing)
          const cachedResponse = await cache.match(event.request) || await cache.match('/index.html');
          return cachedResponse;
        }
      })()
    );
    return;
  }

  // 2. Assets Statiques -> Cache First
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic' && networkResponse.type !== 'cors') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      });
    })
  );
});
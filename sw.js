const CACHE_NAME = 'toulouse-cupping-v3';
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
  // Ignorer les requêtes non-GET (POST, etc.)
  if (event.request.method !== 'GET') return;

  // 1. Navigation (HTML) -> Network First, puis Cache (pour avoir la dernière version si dispo, sinon offline)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const networkResponse = await fetch(event.request);
          // Mise à jour du cache en arrière-plan pour la prochaine fois
          const cache = await caches.open(CACHE_NAME);
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        } catch (error) {
          console.log('[Service Worker] Network failed, using cache for navigation', error);
          const cache = await caches.open(CACHE_NAME);
          const cachedResponse = await cache.match(event.request) || await cache.match('/index.html');
          return cachedResponse;
        }
      })()
    );
    return;
  }

  // 2. Assets Statiques (JS, Images, Fonts) -> Cache First, puis Network (pour la rapidité)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        // Sauvegarde dynamique des nouveaux fichiers (ex: chunks JS générés par Vite)
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic' && networkResponse.type !== 'cors') {
          return networkResponse;
        }
        
        // Cloner la réponse car elle ne peut être utilisée qu'une fois
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      });
    })
  );
});
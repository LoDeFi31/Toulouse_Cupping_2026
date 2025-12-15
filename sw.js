
const CACHE_NAME = 'toulouse-cupping-v22';
const FLAVOR_WHEEL_URL = "https://dailycoffeenews.com/wp-content/uploads/2016/01/SCA_Flavor_Wheel.jpg";

const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg',
  '/icons/android/android-launchericon-192-192.png',
  '/icons/android/android-launchericon-512-512.png',
  '/icons/ios/180.png',
  '/icons/windows11/Square44x44Logo.scale-100.png'
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

// Fetch Event
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  // 1. Navigation (HTML)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const networkResponse = await fetch(event.request);
          return networkResponse;
        } catch (error) {
          const cache = await caches.open(CACHE_NAME);
          const cachedResponse = await cache.match(event.request) || await cache.match('/index.html');
          return cachedResponse;
        }
      })()
    );
    return;
  }

  // 2. Assets (Statiques & Roue des Saveurs)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        // Vérification standard : on ne cache que les succès (200) et les types basic/cors
        const isValidResponse = networkResponse && networkResponse.status === 200 && (networkResponse.type === 'basic' || networkResponse.type === 'cors');
        
        // EXCEPTION : On autorise la mise en cache de la roue des saveurs même si la réponse est 'opaque'
        const isFlavorWheel = event.request.url === FLAVOR_WHEEL_URL;

        if (!isValidResponse && !isFlavorWheel) {
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
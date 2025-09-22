// service-worker.js

const CACHE_NAME = 'sustainability-dashboard-cache-v1';
const APP_SHELL_URLS = [
  './',
  './index.html',
  './manifest.json',
  './index.tsx', // JS entry point
  'https://cdn.tailwindcss.com',
  'https://api.mapbox.com/mapbox-gl-js/v3.1.2/mapbox-gl.css',
  'https://labs.landsurveyorsunited.com/datareef/icons/web/android-chrome-192x192.png',
  'https://storage.ning.com/topology/rest/1.0/file/get/13715201495?profile=original'
];

// The install handler takes care of precaching the resources we always need.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Pre-caching App Shell');
        return cache.addAll(APP_SHELL_URLS);
      })
      .then(() => {
        // Force the waiting service worker to become the active service worker.
        return self.skipWaiting();
      })
  );
});

// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Tell the active service worker to take control of the page immediately.
      return self.clients.claim();
    })
  );
});

// The fetch handler serves assets from the cache.
self.addEventListener('fetch', event => {
  // We only want to cache GET requests.
  if (event.request.method !== 'GET') {
    return;
  }

  // For navigation requests, use a network-first strategy.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match('./index.html');
        })
    );
    return;
  }

  // For all other requests (like scripts, styles, images), use a cache-first strategy.
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // If we have a cached response, return it.
      if (cachedResponse) {
        return cachedResponse;
      }
      
      // If not, fetch from the network.
      return fetch(event.request).then(networkResponse => {
        // And cache the new response for future use.
        return caches.open(CACHE_NAME).then(cache => {
          // We don't cache everything, e.g., API calls. Only cache successful responses.
          if (networkResponse.status === 200) {
            // Check if the request is for a cacheable asset (e.g., from a CDN)
             if (event.request.url.startsWith('https://aistudiocdn.com/') || event.request.url.startsWith('https://api.mapbox.com/')) {
               cache.put(event.request, networkResponse.clone());
             }
          }
          return networkResponse;
        });
      });
    })
  );
});

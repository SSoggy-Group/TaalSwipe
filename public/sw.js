// Service Worker for TaalSwipe PWA
// Caches assets for offline play

const CACHE_PREFIX = 'taalswipe-';
const CACHE_NAME = `${CACHE_PREFIX}v5`;
const STATIC_ASSETS = [
  './index.html',
  './manifest.json',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './web-native.css',
].map((asset) => new URL(asset, self.location.href).href);
const INDEX_URL = STATIC_ASSETS[0];
const PRECACHE_MANIFEST_URL = new URL('./precache-manifest.json', self.location.href).href;

// Install: precache the exported app bundle (including the startup JS) plus
// the core shell, tolerating individual failures under sub-path hosting.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      const assets = new Set(STATIC_ASSETS);
      let manifestLoaded = false;

      try {
        const response = await fetch(PRECACHE_MANIFEST_URL, { cache: 'no-store' });
        if (response.ok) {
          const manifest = await response.json();
          if (Array.isArray(manifest)) {
            manifestLoaded = true;
            for (const asset of manifest) {
              if (typeof asset === 'string') {
                assets.add(new URL(asset, self.location.href).href);
              }
            }
          }
        }
      } catch {
        // Fall back to the core shell if the manifest is unavailable.
      }

      // If the build did not produce a manifest, at least read the exported
      // HTML and precache the hashed entry bundle it references.
      if (!manifestLoaded) {
        try {
          const response = await fetch(INDEX_URL, { cache: 'no-store' });
          if (response.ok) {
            const copy = response.clone();
            const html = await response.text();
            await cache.put(INDEX_URL, copy);
            for (const match of html.matchAll(/(?:src|href)="([^"]+\.(?:js|css|ttf|otf|woff2?))"/g)) {
              assets.add(new URL(match[1], self.location.href).href);
            }
          }
        } catch {
          // The core shell is still attempted below.
        }
      }

      // The shell and the JavaScript bundles are required for an offline
      // launch. Everything else (icons, fonts, sounds) is optional.
      const essentialAssets = new Set(
        Array.from(assets).filter((asset) => asset === INDEX_URL || asset.endsWith('.js'))
      );
      const optionalAssets = Array.from(assets).filter(
        (asset) => !essentialAssets.has(asset)
      );

      await Promise.all([
        ...Array.from(essentialAssets).map((asset) => cache.add(asset)),
        ...optionalAssets.map((asset) =>
          cache.add(asset).catch(() => {
            // Ignore a missing optional asset and keep installing.
          })
        ),
      ]);
    })
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch: network-first navigation, cache-first assets
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip cross-origin requests (CDN fonts, etc.)
  if (url.origin !== location.origin) {
    event.respondWith(
      fetch(request).catch(() => {
        // For fonts, we can't cache cross-origin, just let it fail gracefully
        return new Response('', { status: 504 });
      })
    );
    return;
  }

  const storeResponse = (cacheRequest, response) => {
    const clone = response.clone();
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then((cache) => cache.put(cacheRequest, clone))
        .catch(() => {
          // A failed cache write must not affect the network response.
        })
    );
  };

  // Navigations must be network-first, otherwise a cached index.html keeps
  // pointing at an old JS bundle after a deploy.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) storeResponse(request, response);
          return response;
        })
        .catch(async () => {
          const cached = (await caches.match(request)) || (await caches.match(INDEX_URL));
          return cached || new Response('Offline', { status: 503 });
        })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request).then((response) => {
        // Cache successful GET responses (including JS/CSS bundles)
        if (response.ok) storeResponse(request, response);
        return response;
      });
    })
  );
});

// Handle messages from the app
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});
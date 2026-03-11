/* ============================================
   KOOPODCAST - Service Worker
   Caching y Offline Support
   ============================================ */

const CACHE_NAME = 'koopodcast-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/assets/css/styles.css',
    '/assets/js/scripts.js',
    '/assets/img/logo.png',
    '/assets/img/favicon.png',
    '/manifest.json'
];

// Instalar Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache abierto');
                return cache.addAll(urlsToCache);
            })
            .catch(error => {
                console.log('Error al cachear recursos:', error);
            })
    );
    self.skipWaiting();
});

// Activar Service Worker
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Eliminando cache antiguo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Interceptar requests
self.addEventListener('fetch', event => {
    // Solo cachear requests GET
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Retornar del cache si existe
                if (response) {
                    return response;
                }

                return fetch(event.request).then(response => {
                    // No cachear si no es una respuesta válida
                    if (!response || response.status !== 200 || response.type === 'error') {
                        return response;
                    }

                    // Cachear la respuesta
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });

                    return response;
                });
            })
            .catch(() => {
                // Retornar página offline si está disponible
                return caches.match('/index.html');
            })
    );
});

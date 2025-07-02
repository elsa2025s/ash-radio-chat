const CACHE_NAME = 'ash-radio-v1'
const STATIC_CACHE_NAME = 'ash-radio-static-v1'
const DYNAMIC_CACHE_NAME = 'ash-radio-dynamic-v1'

// Fichiers à mettre en cache pour fonctionnement offline
const STATIC_FILES = [
  '/',
  '/musique',
  '/emissions',
  '/animateurs',
  '/podcasts',
  '/chatroom',
  '/evenements',
  '/contact',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
]

// URLs externes importantes à mettre en cache
const EXTERNAL_URLS = [
  'https://ext.same-assets.com/3147506062/181273826.mpga',
  'https://images.unsplash.com/'
]

// Installation du service worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...')

  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static files')
        return cache.addAll(STATIC_FILES)
      })
      .then(() => {
        console.log('Service Worker: Skip waiting')
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error('Service Worker: Cache failed', error)
      })
  )
})

// Activation du service worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...')

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
              console.log('Service Worker: Deleting old cache', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log('Service Worker: Claiming clients')
        return self.clients.claim()
      })
  )
})

// Interception des requêtes
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Stratégie pour les pages principales
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Mettre en cache la réponse si elle est valide
          if (response.status === 200) {
            const responseClone = response.clone()
            caches.open(DYNAMIC_CACHE_NAME)
              .then((cache) => cache.put(request, responseClone))
          }
          return response
        })
        .catch(() => {
          // Servir depuis le cache si offline
          return caches.match(request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse
              }
              // Page offline par défaut
              return caches.match('/')
            })
        })
    )
    return
  }

  // Stratégie pour les fichiers audio
  if (request.url.includes('181273826.mpga') || request.url.includes('audio')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Ne pas mettre en cache les gros fichiers audio
          return response
        })
        .catch(() => {
          // Retourner une réponse d'erreur audio
          return new Response('Audio non disponible hors ligne', {
            status: 503,
            statusText: 'Audio Unavailable Offline'
          })
        })
    )
    return
  }

  // Stratégie pour les images
  if (request.destination === 'image') {
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse
          }

          return fetch(request)
            .then((response) => {
              if (response.status === 200) {
                const responseClone = response.clone()
                caches.open(DYNAMIC_CACHE_NAME)
                  .then((cache) => cache.put(request, responseClone))
              }
              return response
            })
            .catch(() => {
              // Image placeholder si offline
              return new Response(
                '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="#dc2626"/><text x="150" y="100" text-anchor="middle" fill="white" font-family="Arial" font-size="16">ASH Radio</text></svg>',
                {
                  headers: {
                    'Content-Type': 'image/svg+xml',
                    'Cache-Control': 'no-cache'
                  }
                }
              )
            })
        })
    )
    return
  }

  // Stratégie par défaut (Cache First)
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse
        }

        return fetch(request)
          .then((response) => {
            if (response.status === 200) {
              const responseClone = response.clone()
              caches.open(DYNAMIC_CACHE_NAME)
                .then((cache) => cache.put(request, responseClone))
            }
            return response
          })
      })
  )
})

// Gestion des messages depuis l'application
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }

  if (event.data && event.data.type === 'CACHE_AUDIO') {
    const audioUrl = event.data.url
    caches.open(DYNAMIC_CACHE_NAME)
      .then((cache) => cache.add(audioUrl))
      .catch((error) => console.log('Failed to cache audio:', error))
  }
})

// Gestion des notifications push
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push received')

  const options = {
    body: event.data ? event.data.text() : 'Nouvelle émission sur ASH Radio !',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'listen',
        title: 'Écouter',
        icon: '/icons/radio-96x96.png'
      },
      {
        action: 'close',
        title: 'Fermer'
      }
    ]
  }

  event.waitUntil(
    self.registration.showNotification('ASH Radio', options)
  )
})

// Gestion des clics sur notifications
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked')

  event.notification.close()

  if (event.action === 'listen') {
    event.waitUntil(
      clients.openWindow('/?autoplay=true')
    )
  } else if (event.action === 'close') {
    // Ne rien faire, la notification est déjà fermée
  } else {
    // Clic par défaut sur la notification
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})

// Synchronisation en arrière-plan
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync', event.tag)

  if (event.tag === 'audio-sync') {
    event.waitUntil(
      // Synchroniser les données audio ou les playlists
      syncAudioData()
    )
  }
})

// Fonction de synchronisation des données
async function syncAudioData() {
  try {
    // Ici vous pourriez synchroniser les playlists, favoris, etc.
    console.log('Service Worker: Syncing audio data...')
    return Promise.resolve()
  } catch (error) {
    console.error('Service Worker: Sync failed', error)
    return Promise.reject(error)
  }
}

// Gestion des erreurs
self.addEventListener('error', (event) => {
  console.error('Service Worker: Error occurred', event.error)
})

// Gestion des erreurs de requête non gérées
self.addEventListener('unhandledrejection', (event) => {
  console.error('Service Worker: Unhandled rejection', event.reason)
  event.preventDefault()
})

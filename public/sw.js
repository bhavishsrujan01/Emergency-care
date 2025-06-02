const CACHE_NAME = "emergency-care-v2"
const STATIC_CACHE = "emergency-care-static-v2"

// Cache static assets for faster loading, but always try network first for dynamic content
const staticAssets = ["/", "/manifest.json", "/icon-192.png", "/icon-512.png"]

// Install event - cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log("Caching static assets for faster loading")
      return cache.addAll(staticAssets)
    }),
  )
  // Force the waiting service worker to become the active service worker
  self.skipWaiting()
})

// Fetch event - Network first strategy for all requests
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // If network request is successful, cache static assets for faster future loading
        if (response.status === 200 && event.request.method === "GET") {
          const responseClone = response.clone()

          // Only cache static assets, not API calls or dynamic content
          if (staticAssets.includes(new URL(event.request.url).pathname)) {
            caches.open(STATIC_CACHE).then((cache) => {
              cache.put(event.request, responseClone)
            })
          }
        }
        return response
      })
      .catch(() => {
        // Only return cached content for static assets if network fails
        if (staticAssets.includes(new URL(event.request.url).pathname)) {
          return caches.match(event.request)
        }
        // For dynamic content, show a proper error message
        return new Response(
          JSON.stringify({
            error: "Network connection required for this feature",
            message: "Please check your internet connection and try again",
          }),
          {
            status: 503,
            statusText: "Service Unavailable",
            headers: { "Content-Type": "application/json" },
          },
        )
      }),
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== CACHE_NAME) {
            console.log("Deleting old cache:", cacheName)
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
  // Ensure the new service worker takes control immediately
  self.clients.claim()
})

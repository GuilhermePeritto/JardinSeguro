const CACHE_NAME = "jardim-seguro-v1"
const urlsToCache = [
  "/",
  "/login",
  "/register",
  "/offline",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
]

// Instalação do Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache)
    }),
  )
})

// Ativação do Service Worker
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME]
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
})

// Estratégia de cache: Network first, falling back to cache
self.addEventListener("fetch", (event) => {
  // Não interceptar requisições para API ou autenticação
  if (event.request.url.includes("/api/") || event.request.url.includes("/actions/")) {
    return
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Se a resposta for válida, clone-a e armazene-a no cache
        if (response && response.status === 200) {
          const responseToCache = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })
        }
        return response
      })
      .catch(() => {
        // Se falhar, tente buscar do cache
        return caches.match(event.request).then((response) => {
          if (response) {
            return response
          }
          // Se não estiver no cache e for uma página, mostre a página offline
          if (event.request.mode === "navigate") {
            return caches.match("/offline")
          }
          // Para outros recursos, retorne um erro simples
          return new Response("Não foi possível carregar o recurso. Você está offline.")
        })
      }),
  )
})

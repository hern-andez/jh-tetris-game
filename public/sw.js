const cacheName = "cache_v1";

globalThis.self.addEventListener("error", () => {
  console.error("Error loading service worker");
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Ignorar WebSockets y HMR de Vite
  if (url.protocol === "ws:" || url.protocol === "wss:") return;

  // Ignorar requests de Vite (HMR)
  if (url.pathname.includes("/@vite") || url.pathname.includes("/__vite")) return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(cacheName);
      const cached = await cache.match(event.request);

      if (cached) return cached;

      const response = await fetch(event.request);
      cache.put(event.request, response.clone());

      return response;
    })(),
  );
});

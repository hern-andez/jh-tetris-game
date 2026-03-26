const cacheName = "cache_v1";

globalThis.self.addEventListener("error", () => {
  console.error("Error loading service worker");
});

self.addEventListener("fetch", (event) => {
  console.log(event.request);
  event.respondWith(
    (async () => {
      // Abre la cache y busca el request si es que esta
      const cache = await caches.open(cacheName);
      const cached = await cache.match(event.request);

      if (cached) return cached; // Si esta lo devuelve

      // Si no lo cachea y lo devuelve
      const responce = await fetch(event.request);
      cache.put(event.request, responce.clone());

      return responce;
    })(),
  );
});

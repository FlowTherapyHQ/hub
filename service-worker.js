const CACHE_NAME = "flowhub-v1";

const APP_FILES = [
  "/",
  "/index.html",
  "/forms.html",
  "/aftercare.html",
  "/flownotes.html",
  "/flowresources.html",
  "/flowpass.html",
  "/faq.html",
  "/style.css",
  "/flowtherapy-logo.png",
  "/icon-192.png",
  "/icon-512.png"
];

// Save the main FlowHub files when the app is installed.
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_FILES);
    })
  );

  self.skipWaiting();
});

// Remove older FlowHub caches.
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== CACHE_NAME)
            .map((cacheName) => caches.delete(cacheName))
        );
      })
      .then(() => self.clients.claim())
  );
});

// Use the network first, then fall back to the saved version.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const responseCopy = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseCopy);
        });

        return response;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          return cachedResponse || caches.match("/index.html");
        });
      })
  );
});

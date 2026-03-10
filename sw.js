const CACHE_NAME = "giftmate-v3";
const APP_SHELL = [
  "/",
  "/index.html",
  "/app.js",
  "/boot.js",
  "/manifest.json",
  "/privacy.html",
  "/terms.html",
  "/account-deletion.html",
  "/icon-192.png",
  "/icon-512.png",
  "/og-image.png",
  "/vendor/react.production.min.js",
  "/vendor/react-dom.production.min.js",
  "/vendor/htm.umd.js",
  "/vendor/supabase.js"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  const isSameOrigin = url.origin === self.location.origin;
  const isSupabaseRequest = url.hostname.endsWith(".supabase.co");
  const isApiRequest = url.pathname.startsWith("/api/");

  if (isSupabaseRequest || isApiRequest) {
    event.respondWith(fetch(event.request));
    return;
  }

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put("/index.html", copy)).catch(() => {});
          return response;
        })
        .catch(() => caches.match("/index.html"))
    );
    return;
  }

  if (isSameOrigin) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached;
        return fetch(event.request).then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy)).catch(() => {});
          return response;
        });
      })
    );
  }
});

// Handle push notifications (background)
self.addEventListener("push", e => {
  const data = e.data ? e.data.json() : {title:"Giftmate 🎁", body:"You have a new notification"};
  e.waitUntil(
    self.registration.showNotification(data.title || "Giftmate 🎁", {
      body: data.body || "",
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      vibrate: [100, 50, 100],
      data: data
    })
  );
});

// Notification click — open the app
self.addEventListener("notificationclick", e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({type:"window"}).then(list => {
      for (const client of list) {
        if (client.url.includes(self.location.origin) && "focus" in client) return client.focus();
      }
      return clients.openWindow("/");
    })
  );
});

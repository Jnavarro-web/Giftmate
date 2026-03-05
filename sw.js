const CACHE_NAME = 'giftmate-v2';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .catch(() => caches.match(e.request).then(r => r || caches.match('/index.html')))
  );
});

// Handle push notifications (background)
self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : {title:'Giftmate 🎁', body:'You have a new notification'};
  e.waitUntil(
    self.registration.showNotification(data.title || 'Giftmate 🎁', {
      body: data.body || '',
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      vibrate: [100, 50, 100],
      data: data
    })
  );
});

// Notification click — open the app
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({type:'window'}).then(list => {
      for (const client of list) {
        if (client.url.includes(self.location.origin) && 'focus' in client) return client.focus();
      }
      return clients.openWindow('/');
    })
  );
});

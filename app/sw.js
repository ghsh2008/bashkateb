// Bashkateb client app: keeps the app shell available; API calls always go to the network.
const C = 'bk-app-v1';
const SHELL = ['/app/', '/app/manifest.webmanifest', '/assets/icon-192.png', '/assets/icon-512.png', '/assets/bashkateb-icon.svg'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(C).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== C).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  if (!u.pathname.startsWith('/app/') && !u.pathname.startsWith('/assets/')) return;
  e.respondWith(fetch(e.request).then((r) => { if (r.ok) { const cp = r.clone(); caches.open(C).then((c) => c.put(e.request, cp)); } return r; }).catch(() => caches.match(e.request).then((r) => r || caches.match('/app/'))));
});

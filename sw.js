// Network-first so updates show up; falls back to cache when the gym has no signal.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then(r => {
    const copy = r.clone();
    caches.open('recomp').then(c => c.put(e.request, copy));
    return r;
  }).catch(() => caches.match(e.request)));
});

const cacheName = "tembelRun-v1";
const contentToCache = [
    "code.js",
    "index.html",
    "style.css",
    "assets/fonts/Heebo-VariableFont_wght.ttf",
    "assets/icons/icon.svg",
    "assets/media/background.svg",
    "assets/media/blackX.svg",
    "assets/media/compress.svg",
    "assets/media/goldenStar.svg",
    "assets/media/expand.svg",
    "assets/media/pause.svg",
    "assets/media/road.svg",
    "assets/media/sadTembel.jpg",
    "assets/media/tembel.png",
    "assets/media/trophy.svg",
    "assets/media/X.svg"
]

self.addEventListener('install', (e) => {
    console.log('[Service Worker] Install');
    e.waitUntil((async () => {
        const cache = await caches.open(cacheName);
        console.log('[Service Worker] Caching all: app shell and content');
        // for (let item in contentToCache) {
        //     console.log(contentToCache[item])
        //     await cache.add(contentToCache[item]);
        // }
        await cache.addAll(contentToCache);
      })());
  });

self.addEventListener('fetch', (e) => {
  e.respondWith((async () => {
    const r = await caches.match(e.request);
    console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
    if (r) { return r; }
    const response = await fetch(e.request);
    const cache = await caches.open(cacheName);
    console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
    cache.put(e.request, response.clone());
    return response;
  })());
});

// self.addEventListener('activate', (e) => {
//     e.waitUntil(caches.keys().then((keyList) => {
//       return Promise.all(keyList.map((key) => {
//         if (key === cacheName) { return; }
//         return caches.delete(key);
//       }))
//     }));
//   });

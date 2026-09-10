
/* YourTask Service Worker - GitHub Pages Project Site (v6) */
const CACHE_NAME = 'yourtask-cache-v6';
const BASE = '/YourTask/';

const PRECACHE_URLS = [
  BASE,
  BASE + 'index.html',
  BASE + 'style.css',
  BASE + 'script.js',
  BASE + 'manifest.json',
  BASE + 'icon.png'
];

/* File yang sering berubah -> network-first biar user selalu dapat versi baru */
const NETWORK_FIRST = ['script.js', 'style.css', 'manifest.json'];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.all(
        PRECACHE_URLS.map((url) =>
          cache.add(url).catch((err) => console.warn('[SW] skip cache:', url, err))
        )
      )
    )
  );
});

/* ACTIVATE */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});
/* FETCH — navigation-first fallback ke index.html */
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, copy)).catch(() => {});
          return res;
        })
        .catch(() =>
          caches.match(req).then(
            (cached) => cached || caches.match(BASE + 'index.html') || caches.match(BASE)
          )
        )
    );
    return;
  }

  const url = new URL(req.url);
  const isNetworkFirst = NETWORK_FIRST.some((f) => url.pathname.endsWith(f));

  if (isNetworkFirst) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(req, copy)).catch(() => {});
          }
          return res;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  /* cache-first untuk sisanya (icon.png, dll.) */
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        if (res && res.status === 200 && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, copy)).catch(() => {});
        }
        return res;
      });
    })
  );
});

/* ==================== BACKGROUND DEADLINE CHECK ==================== */

const DB_NAME = 'yourtask-db-v1';
const DB_STORE = 'state';
const DAY_NAMES = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

function openStateDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(DB_STORE, { keyPath: 'key' });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function idbGet(key) {
  return openStateDB().then((db) => new Promise((resolve, reject) => {
    const tx = db.transaction(DB_STORE, 'readonly');
    const req = tx.objectStore(DB_STORE).get(key);
    tx.oncomplete = () => { db.close(); resolve(req.result ? req.result.value : null); };
    tx.onerror = () => { db.close(); reject(tx.error); };
  })).catch(() => null);
}

function idbPut(key, value) {
  return openStateDB().then((db) => new Promise((resolve, reject) => {
    const tx = db.transaction(DB_STORE, 'readwrite');
    tx.objectStore(DB_STORE).put({ key: key, value: value });
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => { db.close(); reject(tx.error); };
  })).catch(() => {});
}

function getWibNow() {
  const parts = new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Jakarta', weekday: 'long', hour: '2-digit', minute: '2-digit', hour12: false
  }).formatToParts(new Date());
  const v = {};
  parts.forEach((p) => { v[p.type] = p.value; });
  return {
    dayIndex: DAY_NAMES.indexOf(v.weekday),
    minutes: Number(v.hour) * 60 + Number(v.minute)
  };
}

function normalize(v) {
  return String(v || '').toLowerCase().replace(/[\s.\-]/g, '');
}

async function checkBackgroundDeadlines() {
  const tasks = (await idbGet('tasks')) || [];
  const schedule = (await idbGet('schedule')) || {};
  const activeDays = (await idbGet('activeDays')) || [1, 2, 3, 4, 5, 6];
  const now = getWibNow();

  for (const task of tasks) {
    if (task.completed) continue;

    let best = null;
    for (let day = 1; day <= 6; day++) {
      if (!activeDays.includes(day)) continue; /* hormati hari nonaktif */
      const entries = schedule[day] || [];
      for (const entry of entries) {
        if (entry.tipe !== 'pelajaran') continue;
        if (normalize(entry.mapel) !== normalize(task.mapel)) continue;

        const [h, m] = String(entry.mulai || '00:00').split(':').map(Number);
        let ahead = (day - now.dayIndex + 7) % 7;
        if (ahead === 0 && h * 60 + m <= now.minutes) ahead = 7;

        const diff = ahead * 1440 + (h * 60 + m) - now.minutes;
        if (!best || diff < best.diff) best = { diff: diff, start: entry.mulai };
      }
    }

    /* hanya deadline dalam <= 24 jam ke depan */
    if (best && best.diff >= 0 && best.diff <= 24 * 60) {
      const dedupKey = 'notified_' + task.id + '_' + best.start;
      const last = await idbGet(dedupKey);
      if (last) continue;

      await self.registration.showNotification('⏰ Deadline tugas mendekat', {
        body: task.mapel + ' (' + task.detail + ') — kelas mulai pukul ' + best.start + '.',
        icon: new URL('icon.png', self.registration.scope).href,
        tag: 'yourtask-' + task.id
      });
      await idbPut(dedupKey, Date.now());
    }
  }
}

self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'deadline-check') {
    event.waitUntil(checkBackgroundDeadlines());
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const c of list) {
        if ('focus' in c) return c.focus();
      }
      return clients.openWindow(BASE);
    })
  );
});

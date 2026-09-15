/* YourTask Service Worker - GitHub Pages Project Site (v18 - encrypted IndexedDB storage) */
const CACHE_NAME = 'yourtask-cache-v18';
const BASE = '/YourTask/';

const PRECACHE_URLS = [
  BASE,
  BASE + 'index.html',
  BASE + 'style.css',
  BASE + 'script.js',
  BASE + 'manifest.json',
  BASE + 'icon.png'
];

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

/* FETCH — cache-first + update di belakang (stale-while-revalidate):
   Cold start = langsung dari cache lokal (tidak menunggu jaringan),
   versi baru diunduh senyap untuk kunjungan berikutnya. */
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== location.origin) return; /* font CDN dll = lewat network biasa */

  /* Update senyap di belakang (tidak memperlambat respon) */
  event.waitUntil(
    fetch(req).then((res) => {
      if (res && res.status === 200) {
        const copy = res.clone();
        return caches.open(CACHE_NAME).then((c) => c.put(req, copy));
      }
    }).catch(() => {})
  );

  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        if (res && res.status === 200) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, copy)).catch(() => {});
        }
        return res;
      }).catch(() =>
        caches.match(BASE + 'index.html', { ignoreSearch: true }).then((fb) => fb || Response.error())
      );
    })
  );
});

/* ==================== BACKGROUND DEADLINE CHECK ==================== */
/* Membaca state yang sama dengan aplikasi: store "enc" di yourtask-db-v1 (v2).
   Rekaman terenkripsi AES-256-GCM didekripsi memakai kunci non-extractable
   dari yourtask-keys-v1 (dibuat oleh aplikasi). Rekaman { plain: true }
   dibaca apa adanya (dipakai untuk penanda notifikasi). */
const DB_NAME = 'yourtask-db-v1';
const DB_VERSION = 2;
const DB_STORE = 'enc';
const DB_LEGACY_STORE = 'state';
const KEY_DB_NAME = 'yourtask-keys-v1';
const KEY_DB_STORE = 'keys';
const DAY_NAMES = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

let dbPromise = null;
let keyPromise = null;

function openStateDB() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(DB_STORE)) {
        db.createObjectStore(DB_STORE, { keyPath: 'key' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  }).catch((e) => { dbPromise = null; throw e; });
  return dbPromise;
}

function openKeyDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(KEY_DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(KEY_DB_STORE)) {
        db.createObjectStore(KEY_DB_STORE, { keyPath: 'key' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function getCryptoKey() {
  if (keyPromise) return keyPromise;
  keyPromise = openKeyDB().then((db) => new Promise((resolve, reject) => {
    const tx = db.transaction(KEY_DB_STORE, 'readonly');
    const g = tx.objectStore(KEY_DB_STORE).get('app');
    tx.oncomplete = () => { db.close(); resolve(g.result ? g.result.value : null); };
    tx.onerror = () => { db.close(); reject(tx.error); };
  })).catch((e) => { keyPromise = null; throw e; });
  return keyPromise;
}

function parseRecord(rec, ck) {
  if (!rec) return null;
  if (rec.plain || !ck) {
    try { return rec.plain ? JSON.parse(rec.json) : (rec.value !== undefined ? rec.value : null); }
    catch (e) { return null; }
  }
  return crypto.subtle.decrypt({ name: 'AES-GCM', iv: new Uint8Array(rec.iv) }, ck, rec.data)
    .then((buf) => JSON.parse(new TextDecoder().decode(buf)))
    .catch(() => null);
}

function idbGet(key) {
  return Promise.all([openStateDB(), getCryptoKey()]).then(([db, ck]) => new Promise((resolve, reject) => {
    const tx = db.transaction(DB_STORE, 'readonly');
    const g = tx.objectStore(DB_STORE).get(key);
    tx.oncomplete = () => { db.close(); resolve(g.result || null); };
    tx.onerror = () => { db.close(); reject(tx.error); };
  }).then((rec) => {
    if (rec) return parseRecord(rec, ck);
    /* Fallback: mirror plaintext lama (versi sebelum enkripsi) */
    return openStateDB().then((db2) => {
      if (!db2.objectStoreNames.contains(DB_LEGACY_STORE)) return null;
      return new Promise((resolve) => {
        const tx = db2.transaction(DB_LEGACY_STORE, 'readonly');
        const g = tx.objectStore(DB_LEGACY_STORE).get(key);
        tx.oncomplete = () => { db2.close(); resolve(g.result ? g.result.value : null); };
        tx.onerror = () => { db2.close(); resolve(null); };
      });
    });
  })).catch(() => null);
}

function idbPut(key, value) {
  return Promise.all([openStateDB(), getCryptoKey()]).then(([db, ck]) => {
    const tulis = (rec) => new Promise((resolve, reject) => {
      const tx = db.transaction(DB_STORE, 'readwrite');
      tx.objectStore(DB_STORE).put(rec);
      tx.oncomplete = () => { db.close(); resolve(); };
      tx.onerror = () => { db.close(); reject(tx.error); };
    });
    if (!ck) return tulis({ key: key, plain: true, json: JSON.stringify(value) });
    const iv = crypto.getRandomValues(new Uint8Array(12));
    return crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv }, ck, new TextEncoder().encode(JSON.stringify(value)))
      .then((buf) => tulis({ key: key, iv: iv.buffer, data: buf }));
  }).catch(() => {});
}

function getWibNow(tz) {
  const parts = new Intl.DateTimeFormat('id-ID', {
    timeZone: tz || 'Asia/Jakarta', weekday: 'long', hour: '2-digit', minute: '2-digit', hour12: false
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
  let tz = (await idbGet('timezone')) || 'Asia/Jakarta';
  if (!/^[A-Za-z_]+\/[A-Za-z_+\-0-9]+$/.test(tz)) tz = 'Asia/Jakarta';
  const now = getWibNow(tz);

  for (const task of tasks) {
    if (task.completed) continue;

    let best = null;
    for (let day = 0; day <= 6; day++) {
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

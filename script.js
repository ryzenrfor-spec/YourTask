(function () {
  "use strict";

  /* ============================================================
     YourTask — application logic (i18n edition)
     Developed by ErlanggaDev Studios
     All user-facing strings come from window.I18N (i18n.js).
     Base locale: formal English; per-language dictionaries in i18n.js.
     ============================================================ */

  /* --- LOCAL CONFIGURATION --- */
  var TZ = "Asia/Jakarta";
  var TZ_AUTO = "auto";
  function deteksiZona() {
    try { return Intl.DateTimeFormat().resolvedOptions().timeZone || TZ; } catch (e) { return TZ; }
  }
  var currentTZ = TZ;

  /* i18n helpers (safe fallbacks if i18n.js failed to load) */
  function T(key, vars) {
    if (window.I18N && window.I18N.t) return window.I18N.t(key, vars);
    return key;
  }
  function dayLabel(d) {
    if (window.I18N && window.I18N.dayName) return window.I18N.dayName(d);
    return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][d] || "";
  }

  /* --- STATE & ELEMENTS --- */
  var tugasList = [];
  var JADWAL = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
  var currentUsername = "";
  var currentSchool = "";
  var filterAktif = "aktif";
  var hariDipilih = null;
  var notifDiizinkan = false;
  var toastTimer = null;
  var selectedScheduleIndex = null;
  var hariAktif = [1, 2, 3, 4, 5, 6];
  var editTaskId = null;
  var filterMapel = "semua";
  var cariTugas = "";


  var el = {};
  function grab() {
    if (navigator.storage && navigator.storage.persist) {
      navigator.storage.persist().then(function (persistent) {
        if (persistent) console.log("Storage secure: persistent mode active.");
        else console.log("Storage running in standard mode.");
      });
    }

    el.displayUser = document.getElementById("display-username");
    el.displaySekolah = document.getElementById("display-sekolah");
    el.btnEditUser = document.getElementById("btn-edit-user");

    el.modalProfil = document.getElementById("modal-profil");
    el.formProfil = document.getElementById("form-profil");
    el.inputUsername = document.getElementById("input-username");
    el.inputSekolah = document.getElementById("input-sekolah");
    el.btnBackup = document.getElementById("btn-backup-data");
    el.inputRestore = document.getElementById("input-restore-data");

    el.jam = document.getElementById("jam-realtime");
    el.hari = document.getElementById("hari-realtime");

    el.cardStatus = document.getElementById("card-status");
    el.statusLabel = document.getElementById("status-label");
    el.statusJamKe = document.getElementById("status-jam-ke");
    el.statusMapel = document.getElementById("status-mapel");
    el.statusDetail = document.getElementById("status-detail");
    el.statusNext = document.getElementById("status-berikutnya");
    el.progWrap = document.getElementById("progress-wrap");
    el.progFill = document.getElementById("progress-fill");
    el.progText = document.getElementById("progress-text");

    el.banner = document.getElementById("banner-notifikasi");
    el.bannerTeks = document.getElementById("banner-teks");
    el.btnIzinNotif = document.getElementById("btn-izin-notif");

    el.daftarTugas = document.getElementById("daftar-tugas");
    el.tugasKosong = document.getElementById("tugas-kosong");
    el.ringkasan = document.getElementById("ringkasan-tugas");

    el.tabHari = document.getElementById("tab-hari");
    el.daftarJadwal = document.getElementById("daftar-jadwal");
    el.jadwalKosong = document.getElementById("jadwal-kosong");

    el.btnTambahJadwal = document.getElementById("btn-tambah-jadwal");
    el.modalJadwal = document.getElementById("modal-jadwal-form");
    el.formJadwal = document.getElementById("form-tambah-jadwal");
    el.inputJadwalHari = document.getElementById("input-jadwal-hari");
    el.inputJadwalJamKe = document.getElementById("input-jadwal-jamke");
    el.inputJadwalTipe = document.getElementById("input-jadwal-tipe");

    el.modalAksiJadwal = document.getElementById("modal-jadwal-aksi");
    el.btnAksiEdit = document.getElementById("btn-aksi-edit");
    el.btnAksiHapus = document.getElementById("btn-aksi-hapus");

    el.modalEditJadwal = document.getElementById("modal-jadwal-edit");
    el.formEditJadwal = document.getElementById("form-edit-jadwal");
    el.inputEditJamKe = document.getElementById("input-edit-jamke");
    el.inputEditTipe = document.getElementById("input-edit-tipe");

    el.btnBuka = document.getElementById("btn-buka-modal");
    el.overlay = document.getElementById("modal-overlay");
    el.form = document.getElementById("form-tugas");
    el.inputMapel = document.getElementById("input-mapel");
    el.inputDetail = document.getElementById("input-detail");
    el.previewDeadline = document.getElementById("preview-deadline");
    el.formError = document.getElementById("form-error");
    el.toast = document.getElementById("toast");
    el.wallpaperLayer = document.getElementById("wallpaper-layer");
    el.brandIcon = document.getElementById("brand-icon");
    el.temaPresetGrid = document.getElementById("tema-preset-grid");
    el.temaWarnaGrid = document.getElementById("tema-warna-grid");
    el.temaWarnaInput = document.getElementById("tema-warna-input");
    el.btnTemaGaleri = document.getElementById("btn-tema-galeri");
    el.inputTemaGaleri = document.getElementById("input-tema-galeri");
    el.temaEditorWrap = document.getElementById("tema-editor-wrap");
    el.temaCropStage = document.getElementById("tema-crop-stage");
    el.temaZoomRange = document.getElementById("tema-zoom-range");
    el.temaDimNaik = document.getElementById("tema-dim-naik");
    el.temaDimTurun = document.getElementById("tema-dim-turun");
    el.temaTerapkan = document.getElementById("tema-terapkan");
    el.temaBatal = document.getElementById("tema-batal");
    el.inputIkonGaleri = document.getElementById("input-ikon-galeri");
    el.ikonEditorWrap = document.getElementById("ikon-editor-wrap");
    el.ikonCropStage = document.getElementById("ikon-crop-stage");
    el.ikonZoomRange = document.getElementById("ikon-zoom-range");
    el.ikonTerapkan = document.getElementById("ikon-terapkan");
    el.ikonBatal = document.getElementById("ikon-batal");
    el.btnIkonReset = document.getElementById("btn-ikon-reset");
    el.cariTugas = document.getElementById("cari-tugas");
    el.filterMapel = document.getElementById("filter-mapel");
    el.modalTitle = document.getElementById("modal-title");
    el.btnSubmitTugas = document.getElementById("btn-submit-tugas");
    el.inputBerulang = document.getElementById("input-berulang");
    el.inputBackupNama = document.getElementById("input-backup-nama");
  }

  /* --- STORAGE: ENCRYPTED INDEXEDDB (AES-256-GCM, Web Crypto API) --- */
  /* All data (tasks, schedule, profile, active days, AI key) is stored
     encrypted in the "enc" store using AES-256-GCM (NIST SP 800-38D). The
     non-extractable AES-256 key is generated once and kept as a CryptoKey
     object in a separate DB "yourtask-keys-v1" — the key material cannot be
     exported or read by any JavaScript. Browsers without Web Crypto
     (non-HTTPS context) fall back to plain mode so the app keeps working. */
  var IDB_NAME = "yourtask-db-v1";
  var IDB_VERSION = 2;
  var IDB_STORE = "enc";
  var IDB_LEGACY_STORE = "state"; /* legacy plaintext mirror — cleaned during migration */
  var KEY_DB_NAME = "yourtask-keys-v1";
  var KEY_DB_STORE = "keys";
  var KEY_ID = "app";
  var dbPromise = null;
  var keyPromise = null;

  function openStateDB() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise(function (resolve, reject) {
      var req = indexedDB.open(IDB_NAME, IDB_VERSION);
      req.onupgradeneeded = function () {
        var db = req.result;
        if (!db.objectStoreNames.contains(IDB_STORE)) {
          db.createObjectStore(IDB_STORE, { keyPath: "key" });
        }
      };
      req.onsuccess = function () { resolve(req.result); };
      req.onerror = function () { reject(req.error); };
    }).catch(function (e) { dbPromise = null; throw e; });
    return dbPromise;
  }

  function openKeyDB() {
    return new Promise(function (resolve, reject) {
      var req = indexedDB.open(KEY_DB_NAME, 1);
      req.onupgradeneeded = function () {
        var db = req.result;
        if (!db.objectStoreNames.contains(KEY_DB_STORE)) {
          db.createObjectStore(KEY_DB_STORE, { keyPath: "key" });
        }
      };
      req.onsuccess = function () { resolve(req.result); };
      req.onerror = function () { reject(req.error); };
    });
  }

  function getCryptoKey() {
    if (keyPromise) return keyPromise;
    keyPromise = openKeyDB().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(KEY_DB_STORE, "readonly");
        var g = tx.objectStore(KEY_DB_STORE).get(KEY_ID);
        tx.oncomplete = function () { db.close(); resolve(g.result ? g.result.value : null); };
        tx.onerror = function () { db.close(); reject(tx.error); };
      });
    }).then(function (ada) {
      if (ada) return ada;
      if (!(window.crypto && window.crypto.subtle)) return null; /* fallback: unencrypted */
      return window.crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"])
        .then(function (kunci) {
          return openKeyDB().then(function (db) {
            return new Promise(function (resolve, reject) {
              var tx = db.transaction(KEY_DB_STORE, "readwrite");
              tx.objectStore(KEY_DB_STORE).put({ key: KEY_ID, value: kunci });
              tx.oncomplete = function () { db.close(); resolve(kunci); };
              tx.onerror = function () { db.close(); reject(tx.error); };
            });
          });
        });
    }).catch(function (e) { keyPromise = null; throw e; });
    return keyPromise;
  }

  function encPut(key, value) {
    var json = JSON.stringify(value === undefined ? null : value);
    return Promise.all([getCryptoKey(), openStateDB()]).then(function (r) {
      var ck = r[0], db = r[1];
      var tulis = function (rec) {
        return new Promise(function (resolve, reject) {
          var tx = db.transaction(IDB_STORE, "readwrite");
          tx.objectStore(IDB_STORE).put(rec);
          tx.oncomplete = function () { resolve(); };
          tx.onerror = function () { reject(tx.error); };
        });
      };
      if (!ck) return tulis({ key: key, plain: true, json: json });
      var iv = window.crypto.getRandomValues(new Uint8Array(12));
      return window.crypto.subtle.encrypt({ name: "AES-GCM", iv: iv }, ck, new TextEncoder().encode(json))
        .then(function (buf) { return tulis({ key: key, iv: iv.buffer, data: buf }); });
    }).catch(function (e) { console.warn("Failed to save data:", e); });
  }

  function encGet(key) {
    return Promise.all([getCryptoKey(), openStateDB()]).then(function (r) {
      var ck = r[0], db = r[1];
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(IDB_STORE, "readonly");
        var g = tx.objectStore(IDB_STORE).get(key);
        tx.oncomplete = function () { resolve(g.result || null); };
        tx.onerror = function () { reject(tx.error); };
      }).then(function (rec) {
        if (!rec) return null;
        if (rec.plain || !ck) return JSON.parse(rec.json);
        return window.crypto.subtle.decrypt({ name: "AES-GCM", iv: new Uint8Array(rec.iv) }, ck, rec.data)
          .then(function (buf) { return JSON.parse(new TextDecoder().decode(buf)); });
      });
    }).catch(function (e) { console.warn("Failed to read data:", e); return null; });
  }

  function encDel(key) {
    return openStateDB().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(IDB_STORE, "readwrite");
        tx.objectStore(IDB_STORE).delete(key);
        tx.oncomplete = function () { resolve(); };
        tx.onerror = function () { reject(tx.error); };
      });
    }).catch(function (e) { console.warn("Failed to delete data:", e); });
  }

  function mirrorStateToIDB() {
    encPut("tasks", tugasList);
    encPut("schedule", JADWAL);
    encPut("timezone", currentTZ);
  }

  /* ==================== THEME: WALLPAPER, ACCENT & ICON ====================
     Stored encrypted in IndexedDB (keys "theme" & "iconCustom").
     Wallpapers are cropped via the crop editor (pan/pinch/zoom) into a
     compressed JPEG dataURL (max 1600px longest side, q0.72) to keep IDB
     lean. Icons are cropped square (max 256px, PNG). */
  var TEMA_PRESETS = [
    { id: "default", label: "theme.preset.default", css: null },
    { id: "senja", label: "theme.preset.dusk", css: "linear-gradient(160deg, #2b1055 0%, #7597de 55%, #f7b3a1 100%)" },
    { id: "hutan", label: "theme.preset.forest", css: "linear-gradient(165deg, #0b2b26 0%, #14532d 55%, #365314 100%)" },
    { id: "laut", label: "theme.preset.ocean", css: "linear-gradient(170deg, #082f49 0%, #0c4a6e 55%, #164e63 100%)" },
    { id: "galaksi", label: "theme.preset.galaxy", css: "radial-gradient(120% 90% at 20% 0%, #4c1d95 0%, #1e1b4b 45%, #020617 100%)" },
    { id: "sakura", label: "theme.preset.sakura", css: "linear-gradient(160deg, #831843 0%, #9d174d 50%, #be185d 100%)" }
  ];
  var WARNA_PRESETS = [
    { id: "teal", rgb: "20, 184, 166" },
    { id: "biru", rgb: "59, 130, 246" },
    { id: "ungu", rgb: "139, 92, 246" },
    { id: "rose", rgb: "244, 63, 94" },
    { id: "oranye", rgb: "249, 115, 22" }
  ];
  var temaState = { wallpaper: null, accent: null, dim: 12, zoom: 100, x: 0, y: 0 };
  var ikonState = null; /* { dataUrl, zoom, x, y } or null = default */
  var cropCtx = null; /* active editor context */

  function hexToRgbTriplet(hex) {
    var m = /^#?([0-9a-f]{6})$/i.exec(String(hex || "").trim());
    if (!m) return null;
    var n = parseInt(m[1], 16);
    return ((n >> 16) & 255) + ", " + ((n >> 8) & 255) + ", " + (n & 255);
  }

  function applyTemaVisual() {
    var s = temaState;
    var layer = el.wallpaperLayer;
    if (!layer) return;
    /* The layer is attached to <html> (not body) so the opaque body background cannot cover it */
    if (layer.parentElement !== document.documentElement) {
      document.documentElement.appendChild(layer);
    }
    var adaWallpaper = false;
    if (s.wallpaper && s.wallpaper.dataUrl) {
      adaWallpaper = true;
      layer.className = "";
      layer.style.backgroundImage = "url(" + s.wallpaper.dataUrl + ")";
      layer.style.setProperty("--wp-zoom", (s.wallpaper.zoom || 100) / 100);
      layer.style.setProperty("--wp-x", (s.wallpaper.x || 0) + "%");
      layer.style.setProperty("--wp-y", (s.wallpaper.y || 0) + "%");
      layer.style.setProperty("--wp-dim", s.dim || 0);
    } else {
      layer.style.backgroundImage = "";
      layer.style.removeProperty("--wp-zoom");
      layer.style.removeProperty("--wp-x");
      layer.style.removeProperty("--wp-y");
      layer.style.removeProperty("--wp-dim");
      layer.className = "";
    }
    var preset = TEMA_PRESETS.find(function (p) { return p.id === s.wallpaper && p.css; });
    if (preset) {
      adaWallpaper = true;
      layer.className = "tema-gradient";
      layer.style.backgroundImage = preset.css;
      layer.style.setProperty("--wp-dim", Math.round((s.dim || 0) / 2)); /* gradients are pre-designed, halve the dim */
    }
    document.documentElement.classList.toggle("has-wallpaper", adaWallpaper);
    document.body.classList.toggle("has-wallpaper", adaWallpaper);
    if (!adaWallpaper) {
      layer.style.display = "none";
    } else {
      layer.style.display = "";
    }
    if (s.accent) {
      document.documentElement.style.setProperty("--accent-rgb", s.accent);
    } else {
      document.documentElement.style.removeProperty("--accent-rgb");
    }
  }

  function applyIkonVisual() {
    if (el.brandIcon) {
      el.brandIcon.src = (ikonState && ikonState.dataUrl) ? ikonState.dataUrl : "icon.png";
    }
    var prev = document.getElementById("ikon-preview");
    if (prev) {
      if (ikonState && ikonState.dataUrl) {
        prev.innerHTML = "";
        var img = document.createElement("img");
        img.src = ikonState.dataUrl;
        img.alt = T("prof.customIconAlt");
        prev.appendChild(img);
      } else {
        prev.textContent = "Y";
      }
    }
  }

  async function muatTema() {
    try {
      var t = await encGet("theme");
      if (t && typeof t === "object") {
        temaState.wallpaper = t.wallpaper || null;
        temaState.accent = (t.accent && /^\d{1,3}, \d{1,3}, \d{1,3}$/.test(t.accent)) ? t.accent : null;
        temaState.dim = typeof t.dim === "number" ? t.dim : 12;
      }
      var i = await encGet("iconCustom");
      if (i && i.dataUrl && typeof i.dataUrl === "string" && i.dataUrl.indexOf("data:image/") === 0) {
        ikonState = { dataUrl: i.dataUrl, zoom: i.zoom || 100, x: i.x || 0, y: i.y || 0 };
      }
    } catch (e) { /* corrupt/legacy theme: keep defaults */ }
    applyTemaVisual();
    applyIkonVisual();
    renderTemaPresets();
    renderWarnaPresets();
  }

  function simpanTema() {
    return encPut("theme", {
      wallpaper: temaState.wallpaper,
      accent: temaState.accent,
      dim: temaState.dim
    });
  }

  function renderTemaPresets() {
    var grid = el.temaPresetGrid;
    if (!grid) return;
    grid.innerHTML = "";
    TEMA_PRESETS.forEach(function (p) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "preset-swatch";
      btn.style.background = p.css || "var(--navy-900)";
      btn.setAttribute("aria-label", T(p.label));
      var nm = document.createElement("span");
      nm.className = "preset-name";
      nm.textContent = T(p.label);
      btn.appendChild(nm);
      if (temaState.wallpaper === p.id) btn.classList.add("active");
      btn.addEventListener("click", function () {
        temaState.wallpaper = p.id;
        simpanTema();
        applyTemaVisual();
        renderTemaPresets();
        showToast(T("theme.applied", { name: T(p.label) }));
      });
      grid.appendChild(btn);
    });
  }

  function renderWarnaPresets() {
    var grid = el.temaWarnaGrid;
    if (!grid) return;
    grid.innerHTML = "";
    WARNA_PRESETS.forEach(function (w) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "preset-swatch";
      btn.style.background = "rgb(" + w.rgb + ")";
      btn.style.height = "34px";
      btn.setAttribute("aria-label", w.id);
      if (temaState.accent === w.rgb) btn.classList.add("active");
      btn.addEventListener("click", function () {
        temaState.accent = (w.id === "teal") ? null : w.rgb; /* teal = default */
        simpanTema();
        applyTemaVisual();
        renderWarnaPresets();
      });
      grid.appendChild(btn);
    });
    if (el.temaWarnaInput) {
      var trip = temaState.accent || "20, 184, 166";
      var parts = trip.split(",");
      var hex = "#" + parts.map(function (p) {
        var v = parseInt(p.trim(), 10).toString(16);
        return v.length < 2 ? "0" + v : v;
      }).join("");
      el.temaWarnaInput.value = hex;
    }
  }

  /* --- Generic crop editor (shared by wallpaper & icon) ---
     Interactions: drag = move, pinch (2 fingers) / wheel / slider = zoom. */
  function bukaCropEditor(opts) {
    var stage = opts.stage;
    var img = stage.querySelector(".crop-img");
    var range = opts.range;
    cropCtx = {
      stage: stage, img: img, range: range,
      dataUrl: opts.dataUrl,
      scale: 1, x: 0, y: 0,
      onChange: opts.onChange || function () {},
      onApply: opts.onApply || function () {}
    };
    /* Per-editor source of truth: the context belongs to this stage (not
       global), so two open editors never overwrite each other. */
    stage._cropCtx = cropCtx;
    var mulai = function () {
      /* Unhide the wrap FIRST, size the stage, then measure: hidden = 0 */
      opts.wrap.hidden = false;
      if (opts.seuaiLayar) sesuaikanStageLayar(stage);
      fitCrop(cropCtx);
    };
    img.onload = mulai;
    img.src = opts.dataUrl;
    if (img.complete && img.naturalWidth > 0) {
      /* already-decoded data URI: onload may not fire again */
      img.onload = null;
      mulai();
    }
  }

  function fitCrop(ctx) {
    if (!ctx) return;
    var stage = ctx.stage, img = ctx.img;
    /* The stage may still be hidden when the editor opens -> clientWidth/Height = 0.
       Measure after the wrap is shown, or fall back to preset sizes. */
    var sw = stage.clientWidth || 320;
    var sh = stage.clientHeight || 180;
    var iw = img.naturalWidth || 1, ih = img.naturalHeight || 1;
    var cover = Math.max(sw / iw, sh / ih);
    ctx.baseScale = cover;
    ctx.minScale = cover;
    ctx.maxScale = cover * 4;
    ctx.scale = ctx.minScale;
    ctx.x = 0; ctx.y = 0;
    if (ctx.range) ctx.range.value = "100";
    terapkanCrop(ctx);
  }

  function terapkanCrop(ctx) {
    if (!ctx) return;
    var img = ctx.img;
    var t = "translate(-50%, -50%) translate(" + ctx.x + "px, " + ctx.y + "px) scale(" + ctx.scale + ")";
    img.style.transform = t;
  }

  /* The wallpaper stage matches the viewport aspect ratio EXACTLY: with equal
     ratios, background cover maps the crop 1:1 onto the screen — what you
     frame is what you get, no re-zoom. On portrait screens the stage narrows
     to fit the editor height limit. */
  function sesuaikanStageLayar(stage) {
    if (!stage) return;
    var vw = window.innerWidth || 390;
    var vh = window.innerHeight || 844;
    var rasio = vw / vh; /* <1 portrait, >1 landscape */
    var lebarMaks = (stage.parentElement && stage.parentElement.clientWidth) || Math.min(400, vw - 72);
    var tinggiMaks = Math.max(220, Math.round(vh * 0.5));
    var lebar = Math.min(lebarMaks, Math.round(tinggiMaks * rasio));
    stage.style.width = lebar + "px";
    stage.style.height = Math.round(lebar / rasio) + "px";
    stage.style.aspectRatio = "auto";
    stage.style.marginLeft = "auto";
    stage.style.marginRight = "auto";
  }

  var cropInteraksiTerpasang = { tema: null, ikon: null };
  function pasangCropInteraksi(stageKey, stage, ctxGetter) {
    /* Listeners attach ONCE per stage; the ctx is fetched dynamically via
       ctxGetter. (Previously the old ctx was captured at attach time, which
       broke the editor on second use.) */
    if (cropInteraksiTerpasang[stageKey]) return;
    cropInteraksiTerpasang[stageKey] = true;
    var ctx = null;
    var stage2 = stage;
    var pointerId = null, lastX = 0, lastY = 0;
    var pinchDist = 0, pinchScale = 0;
    var pointers = {};
    stage2.addEventListener("pointerdown", function (e) {
      ctx = ctxGetter();
      if (!ctx) return;
      pointers[e.pointerId] = { x: e.clientX, y: e.clientY };
      if (Object.keys(pointers).length === 1) {
        pointerId = e.pointerId; lastX = e.clientX; lastY = e.clientY;
        stage2.setPointerCapture(e.pointerId);
      } else if (Object.keys(pointers).length === 2) {
        var ks = Object.keys(pointers);
        var a = pointers[ks[0]], b = pointers[ks[1]];
        pinchDist = Math.hypot(a.x - b.x, a.y - b.y);
        pinchScale = ctx.scale;
      }
    });
    stage2.addEventListener("pointermove", function (e) {
      if (!pointers[e.pointerId] || !ctx) return;
      pointers[e.pointerId] = { x: e.clientX, y: e.clientY };
      var n = Object.keys(pointers).length;
      if (n === 2) {
        var ks2 = Object.keys(pointers);
        var a2 = pointers[ks2[0]], b2 = pointers[ks2[1]];
        var d = Math.hypot(a2.x - b2.x, a2.y - b2.y);
        if (pinchDist > 0) {
          ctx.scale = Math.min(ctx.maxScale, Math.max(ctx.minScale, pinchScale * (d / pinchDist)));
          if (ctx.range) ctx.range.value = String(Math.round(100 + (ctx.scale - ctx.minScale) / (ctx.maxScale - ctx.minScale) * 300));
          terapkanCrop(ctx);
        }
      } else if (n === 1 && e.pointerId === pointerId) {
        ctx.x += e.clientX - lastX;
        ctx.y += e.clientY - lastY;
        lastX = e.clientX; lastY = e.clientY;
        clampPan(ctx);
        terapkanCrop(ctx);
      }
    });
    var lepas = function (e) {
      delete pointers[e.pointerId];
      if (Object.keys(pointers).length < 2) pinchDist = 0;
      if (e.pointerId === pointerId) pointerId = null;
    };
    stage2.addEventListener("pointerup", lepas);
    stage2.addEventListener("pointercancel", lepas);
    stage2.addEventListener("wheel", function (e) {
      e.preventDefault();
      ctx = ctxGetter();
      if (!ctx) return;
      var faktor = e.deltaY < 0 ? 1.08 : 1 / 1.08;
      ctx.scale = Math.min(ctx.maxScale, Math.max(ctx.minScale, ctx.scale * faktor));
      if (ctx.range) ctx.range.value = String(Math.round(100 + (ctx.scale - ctx.minScale) / (ctx.maxScale - ctx.minScale) * 300));
      clampPan(ctx);
      terapkanCrop(ctx);
    }, { passive: false });
  }

  /* Zoom slider: attached once per range; the ctx is fetched dynamically */
  function pasangZoomRange(range, getCtx) {
    if (!range || range.dataset.zoomBound) return;
    range.dataset.zoomBound = "1";
    range.addEventListener("input", function () {
      var ctx = getCtx();
      if (!ctx) return;
      var v = parseInt(range.value, 10) / 100; /* 1.0 – 4.0 */
      ctx.scale = ctx.minScale + (ctx.maxScale - ctx.minScale) * (v - 1) / 3;
      clampPan(ctx);
      terapkanCrop(ctx);
    });
  }

  function clampPan(ctx) {
    if (!ctx) return;
    var stage = ctx.stage, img = ctx.img;
    var sw = stage.clientWidth || 320, sh = stage.clientHeight || 180;
    var iw = img.naturalWidth || 1, ih = img.naturalHeight || 1;
    var w = iw * ctx.scale, h = ih * ctx.scale;
    var maxX = Math.max(0, (w - sw) / 2), maxY = Math.max(0, (h - sh) / 2);
    ctx.x = Math.min(maxX, Math.max(-maxX, ctx.x));
    ctx.y = Math.min(maxY, Math.max(-maxY, ctx.y));
  }

  function renderHasilCrop(ctx, ukuranMaks, tipeMime, kualitas) {
    var stage = ctx.stage, img = ctx.img;
    var sw = stage.clientWidth, sh = stage.clientHeight;
    var scale = ukuranMaks / Math.max(sw, sh);
    var cv = document.createElement("canvas");
    cv.width = Math.round(sw * scale);
    cv.height = Math.round(sh * scale);
    var cx2 = cv.getContext("2d");
    /* Stage → canvas transform: (px + ctx.x) * scale; the base image is centered */
    var iw = img.naturalWidth, ih = img.naturalHeight;
    var drawW = iw * ctx.scale, drawH = ih * ctx.scale;
    var dx = (sw - drawW) / 2 + ctx.x;
    var dy = (sh - drawH) / 2 + ctx.y;
    cx2.imageSmoothingQuality = "high";
    cx2.drawImage(img, dx * scale, dy * scale, drawW * scale, drawH * scale);
    return cv.toDataURL(tipeMime, kualitas);
  }

  function bacaFileGambar(file, ukuranMaks, cb) {
    if (!file || !/^image\//.test(file.type)) { showToast(T("theme.fileNotImage")); return; }
    var reader = new FileReader();
    reader.onload = function (ev) {
      var img = new Image();
      img.onload = function () {
        var skala = Math.min(1, ukuranMaks / Math.max(img.naturalWidth, img.naturalHeight));
        if (skala >= 1) { cb(ev.target.result); return; }
        var cv = document.createElement("canvas");
        cv.width = Math.round(img.naturalWidth * skala);
        cv.height = Math.round(img.naturalHeight * skala);
        cv.getContext("2d").drawImage(img, 0, 0, cv.width, cv.height);
        cb(cv.toDataURL("image/jpeg", 0.85));
      };
      img.onerror = function () { showToast(T("theme.imageUnreadable")); };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  }

  function mulaiTemaUI() {
    if (el.btnTemaGaleri && el.inputTemaGaleri) {
      el.btnTemaGaleri.addEventListener("click", function () { el.inputTemaGaleri.click(); });
      el.inputTemaGaleri.addEventListener("change", function (e) {
        var file = e.target.files && e.target.files[0];
        e.target.value = "";
        if (!file) return;
        bacaFileGambar(file, 2000, function (dataUrl) {
          bukaCropEditor({
            stage: el.temaCropStage, range: el.temaZoomRange,
            seuaiLayar: true,
            wrap: el.temaEditorWrap, dataUrl: dataUrl,
            onApply: function (hasil) {
              temaState.wallpaper = { dataUrl: hasil, zoom: 100, x: 0, y: 0 };
              temaState.dim = Math.max(0, Math.min(60, temaState.dim));
              simpanTema();
              applyTemaVisual();
              renderTemaPresets();
              el.temaEditorWrap.hidden = true;
              cropCtx = null;
              showToast(T("theme.wallpaperApplied"));
              if (el.temaCropStage) el.temaCropStage._cropCtx = null;
            }
          });
          pasangCropInteraksi("tema", el.temaCropStage, function () { return cropCtx; });
        });
      });
    }
    if (el.temaZoomRange) {
      pasangZoomRange(el.temaZoomRange, function () { return el.temaCropStage && el.temaCropStage._cropCtx; });
    }
    if (el.temaDimNaik) el.temaDimNaik.addEventListener("click", function () {
      temaState.dim = Math.min(60, temaState.dim + 8);
      applyTemaVisual();
      simpanTema();
    });
    if (el.temaDimTurun) el.temaDimTurun.addEventListener("click", function () {
      temaState.dim = Math.max(0, temaState.dim - 8);
      applyTemaVisual();
      simpanTema();
    });
    if (el.temaTerapkan) el.temaTerapkan.addEventListener("click", function () {
      var ctx = el.temaCropStage && el.temaCropStage._cropCtx;
      if (!ctx) return;
      var hasil = renderHasilCrop(ctx, 1600, "image/jpeg", 0.72);
      if (ctx.onApply) ctx.onApply(hasil);
    });
    if (el.temaBatal) el.temaBatal.addEventListener("click", function () {
      el.temaEditorWrap.hidden = true;
      if (el.temaCropStage) el.temaCropStage._cropCtx = null;
      cropCtx = null;
    });
    if (el.temaWarnaInput) el.temaWarnaInput.addEventListener("input", function () {
      var trip = hexToRgbTriplet(el.temaWarnaInput.value);
      if (!trip) return;
      temaState.accent = trip;
      document.documentElement.style.setProperty("--accent-rgb", trip);
    });
    if (el.temaWarnaInput) el.temaWarnaInput.addEventListener("change", function () {
      simpanTema();
      renderWarnaPresets();
      showToast(T("theme.accentUpdated"));
    });
    /* --- Icon --- */
    if (el.inputIkonGaleri) {
      el.inputIkonGaleri.addEventListener("change", function (e) {
        var file = e.target.files && e.target.files[0];
        e.target.value = "";
        if (!file) return;
        bacaFileGambar(file, 1024, function (dataUrl) {
          bukaCropEditor({
            stage: el.ikonCropStage, range: el.ikonZoomRange,
            wrap: el.ikonEditorWrap, dataUrl: dataUrl,
            onApply: function (hasil) {
              ikonState = { dataUrl: hasil, zoom: 100, x: 0, y: 0 };
              encPut("iconCustom", ikonState);
              applyIkonVisual();
              el.ikonEditorWrap.hidden = true;
              cropCtx = null;
              showToast(T("theme.iconApplied"));
              if (el.ikonCropStage) el.ikonCropStage._cropCtx = null;
            }
          });
          pasangCropInteraksi("ikon", el.ikonCropStage, function () { return cropCtx; });
        });
      });
    }
    if (el.ikonZoomRange) {
      pasangZoomRange(el.ikonZoomRange, function () { return el.ikonCropStage && el.ikonCropStage._cropCtx; });
    }
    if (el.ikonTerapkan) el.ikonTerapkan.addEventListener("click", function () {
      var ctx = el.ikonCropStage && el.ikonCropStage._cropCtx;
      if (!ctx) return;
      var hasil = renderHasilCrop(ctx, 256, "image/png", 1);
      if (ctx.onApply) ctx.onApply(hasil);
    });
    if (el.ikonBatal) el.ikonBatal.addEventListener("click", function () {
      el.ikonEditorWrap.hidden = true;
      if (el.ikonCropStage) el.ikonCropStage._cropCtx = null;
      cropCtx = null;
    });
    if (el.btnIkonReset) el.btnIkonReset.addEventListener("click", function () {
      ikonState = null;
      encPut("iconCustom", null);
      applyIkonVisual();
      showToast(T("theme.iconReset"));
    });
  }

  /* --- MIGRATION: move legacy data from localStorage to encrypted IndexedDB --- */
  function migrasiLocalStorage() {
    var pasangan = [
      ["tasks", "yourtask_tugas_v1"],
      ["schedule", "yourtask_jadwal_v1"],
      ["username", "yourtask_username"],
      ["school", "yourtask_school"],
      ["timezone", "yourtask_timezone"],
      ["activeDays", "yourtask_hari_aktif"],
      ["backupNama", "yourtask_backup_nama"],
      ["geminiKey", "yourtask_gemini_key"]
    ];
    var rantai = Promise.resolve();
    pasangan.forEach(function (p) {
      rantai = rantai.then(function () {
        var raw = null;
        try { raw = localStorage.getItem(p[1]); } catch (e) {}
        if (raw === null || raw === undefined) return null;
        var nilai = raw;
        if (p[0] === "tasks" || p[0] === "schedule" || p[0] === "activeDays") {
          try { nilai = JSON.parse(raw); } catch (e) { nilai = null; }
        }
        return encGet(p[0]).then(function (sudahAda) {
          var kerja = ((sudahAda === null || sudahAda === undefined) && nilai !== null) ? encPut(p[0], nilai) : Promise.resolve();
          return kerja.then(function () {
            try { localStorage.removeItem(p[1]); } catch (e) {}
          });
        });
      });
    });
    return rantai.then(hapusStoreLama);
  }

  /* Remove the legacy plaintext mirror in the "state" store so no unencrypted copy remains */
  function hapusStoreLama() {
    return openStateDB().then(function (db) {
      if (!db.objectStoreNames.contains(IDB_LEGACY_STORE)) return;
      return new Promise(function (resolve) {
        var tx = db.transaction(IDB_LEGACY_STORE, "readwrite");
        tx.objectStore(IDB_LEGACY_STORE).clear();
        tx.oncomplete = function () { resolve(); };
        tx.onerror = function () { resolve(); };
        tx.onabort = function () { resolve(); };
      });
    }).catch(function () {});
  }

  /* --- LOAD & SAVE DATA --- */
  function muatProfil() {
    return Promise.all([encGet("username"), encGet("school"), encGet("timezone")]).then(function (vals) {
      var savedUser = vals[0], savedSchool = vals[1], savedTZ = vals[2];

      if (typeof savedUser === "string" && savedUser.trim() !== "") {
        currentUsername = savedUser;
      } else {
        currentUsername = T("user.default");
        encPut("username", currentUsername);
      }
      if (el.displayUser) el.displayUser.textContent = currentUsername;

      if (typeof savedSchool === "string" && savedSchool.trim() !== "") {
        currentSchool = savedSchool;
      } else {
        currentSchool = T("school.default");
        encPut("school", currentSchool);
      }
      if (el.displaySekolah) el.displaySekolah.textContent = currentSchool;

      currentTZ = (typeof savedTZ === "string" && savedTZ && savedTZ !== TZ_AUTO && savedTZ !== "") ? savedTZ : deteksiZona();
    }).catch(function (e) {
      console.error("Failed to load profile", e);
    });
  }

  /* --- DATA SANITIZATION: corrupt records must never break the app --- */
  function bersihkanJadwal(v) {
    var bersih = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
    if (!v || typeof v !== "object" || Array.isArray(v)) return bersih;
    for (var d = 0; d <= 6; d++) {
      var baris = Array.isArray(v[d]) ? v[d] : [];
      baris.forEach(function (x) {
        if (!x || typeof x !== "object") return;
        if (!/^\d{1,2}:\d{2}$/.test(String(x.mulai || ""))) return;
        if (!/^\d{1,2}:\d{2}$/.test(String(x.selesai || ""))) return;
        if (!String(x.mapel || "").trim()) return;
        if (jamKeMenit(x.mulai) >= jamKeMenit(x.selesai)) return;
        var tipe = (x.tipe === "istirahat" || x.tipe === "upacara") ? x.tipe : "pelajaran";
        bersih[d].push({
          jamKe: /^\d+$/.test(String(x.jamKe)) ? String(x.jamKe) : "",
          mulai: normJamStr(x.mulai),
          selesai: normJamStr(x.selesai),
          mapel: String(x.mapel).replace(/\s+/g, " ").trim().slice(0, 120),
          tipe: tipe
        });
      });
    }
    return bersih;
  }

  function bersihkanTugas(v) {
    if (!Array.isArray(v)) return [];
    return v.filter(function (t) {
      return t && typeof t === "object" && typeof t.id === "string" && t.id &&
             typeof t.mapel === "string" && t.mapel.trim() !== "" &&
             typeof t.detail === "string";
    }).map(function (t) {
      return {
        id: t.id.slice(0, 64),
        mapel: t.mapel.replace(/\s+/g, " ").trim().slice(0, 120),
        detail: t.detail.slice(0, 500),
        completed: !!t.completed,
        dibuat: (typeof t.dibuat === "number" && isFinite(t.dibuat)) ? t.dibuat : Date.now(),
        berulang: (t.berulang === "mingguan" || t.berulang === "hari_ini") ? t.berulang : "tidak"
      };
    });
  }

  function muatJadwal() {
    return encGet("schedule").then(function (v) {
      JADWAL = bersihkanJadwal(v);
    }).catch(function () {
      JADWAL = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
    });
  }

  function simpanJadwal() {
    try {
      for (var i = 0; i <= 6; i++) {
        if (JADWAL[i]) JADWAL[i] = urutkanJadwal(JADWAL[i]);
      }
      mirrorStateToIDB();
    } catch (e) {}
  }

  function muatTugas() {
    return encGet("tasks").then(function (v) {
      tugasList = bersihkanTugas(v);
    }).catch(function () {
      tugasList = [];
    });
  }

  function simpanTugas() {
    try {
      mirrorStateToIDB();
    } catch (e) {}
  }

  function populateJamKeOptions(selectElement, dayIndex, currentJamKe, allowEmpty) {
    if (!selectElement) return;
    selectElement.innerHTML = "";
    if (allowEmpty) {
      var o0 = document.createElement("option");
      o0.value = "";
      o0.textContent = T("jform.auto");
      selectElement.appendChild(o0);
    } else {
      selectElement.innerHTML = '<option value="">' + T("jform.pickPeriod") + "</option>";
    }
    var usedJamKe = new Set();
    var hariList = JADWAL[dayIndex] || [];

    hariList.forEach(function (item, idx) {
      if (selectedScheduleIndex !== null && dayIndex === hariDipilih && idx === selectedScheduleIndex) {
        return;
      }
      if (item.jamKe) {
        usedJamKe.add(parseInt(item.jamKe, 10));
      }
    });

    for (var i = 1; i <= 100; i++) {
      if (!usedJamKe.has(i)) {
        var opt = document.createElement("option");
        opt.value = i;
        opt.textContent = T("jform.periodN", { n: i });
        if (currentJamKe && parseInt(currentJamKe, 10) === i) {
          opt.selected = true;
        }
        selectElement.appendChild(opt);
      }
    }
  }

  function exportData() {
    var dataExport = {
      tugas: tugasList,
      jadwal: JADWAL,
      username: currentUsername,
      sekolah: currentSchool,
      hariAktif: hariAktif,
      timezone: currentTZ,
      tema: { wallpaper: temaState.wallpaper, accent: temaState.accent, dim: temaState.dim },
      ikon: ikonState
    };
    var namaCustom = el.inputBackupNama ? el.inputBackupNama.value.trim() : "";
    encPut("backupNama", namaCustom);
    var d = new Date();
    var pad2 = function (x) { return (x < 10 ? "0" : "") + x; };
    var stamp = d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate()) + "_" + pad2(d.getHours()) + "-" + pad2(d.getMinutes());
    var aman = namaCustom.replace(/[\\/:*?"<>|]/g, "").trim();
    var blob = new Blob([JSON.stringify(dataExport, null, 2)], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = (aman || ("YourTask_Backup_" + stamp)) + ".json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function importData(e) {
    var file = e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function (ev) {
      try {
        var parsed = JSON.parse(ev.target.result);
        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Invalid backup format");
        if (parsed.tugas && !Array.isArray(parsed.tugas)) throw new Error("Invalid task data");
        if (parsed.jadwal && (typeof parsed.jadwal !== "object" || Array.isArray(parsed.jadwal))) throw new Error("Invalid schedule data");
        var pekerjaan = [];
        if (parsed.tugas) pekerjaan.push(encPut("tasks", parsed.tugas));
        if (parsed.jadwal) pekerjaan.push(encPut("schedule", parsed.jadwal));
        if (parsed.username) pekerjaan.push(encPut("username", parsed.username));
        if (parsed.sekolah) pekerjaan.push(encPut("school", parsed.sekolah));
        if (parsed.hariAktif) pekerjaan.push(encPut("activeDays", parsed.hariAktif));
        if (parsed.timezone && /^[A-Za-z_]+\/[A-Za-z_+\-0-9]+$/.test(parsed.timezone)) {
          currentTZ = parsed.timezone;
          pekerjaan.push(encPut("timezone", currentTZ));
        }
        if (parsed.tema && typeof parsed.tema === "object") {
          var t = parsed.tema;
          var temaBersih = {
            wallpaper: (t.wallpaper && typeof t.wallpaper === "object" && typeof t.wallpaper.dataUrl === "string" && t.wallpaper.dataUrl.indexOf("data:image/") === 0)
              ? { dataUrl: t.wallpaper.dataUrl, zoom: t.wallpaper.zoom || 100, x: t.wallpaper.x || 0, y: t.wallpaper.y || 0 }
              : (typeof t.wallpaper === "string" ? t.wallpaper : null),
            accent: (typeof t.accent === "string" && /^\d{1,3}, \d{1,3}, \d{1,3}$/.test(t.accent)) ? t.accent : null,
            dim: typeof t.dim === "number" ? Math.max(0, Math.min(60, t.dim)) : 12
          };
          pekerjaan.push(encPut("theme", temaBersih));
        }
        if (parsed.ikon && parsed.ikon.dataUrl && typeof parsed.ikon.dataUrl === "string" && parsed.ikon.dataUrl.indexOf("data:image/") === 0) {
          pekerjaan.push(encPut("iconCustom", { dataUrl: parsed.ikon.dataUrl, zoom: parsed.ikon.zoom || 100, x: parsed.ikon.x || 0, y: parsed.ikon.y || 0 }));
        }

        showToast(T("misc.restoreOk"));
        Promise.all(pekerjaan).catch(function () {}).then(function () {
          setTimeout(function () { location.reload(); }, 1200);
        });
      } catch (err) {
        showToast(T("misc.restoreInvalid"));
      }
    };
    reader.readAsText(file);
  }

  /* --- SERVER TIME SYNC (compensates an incorrect device clock) --- */
  /* If the device clock was changed manually, class status & deadlines break.
     Fix: fetch the time from a time API, compute the offset
     (serverTime - deviceTime) compensating network RTT, then use that offset
     in nowWIB(). The offset is stored encrypted, cached for 7 days, and
     re-validated every 6 hours. Network failure = safe fallback to the
     device clock. */
  var waktuOffsetMs = 0; /* serverTime ~= deviceTime + offset */
  var WAKTU_KEY = "waktuOffset";

  function ambilWaktuServer() {
    if (location.protocol !== "https:" || !(window.crypto && window.crypto.subtle)) return Promise.resolve();
    var mulai = Date.now();
    return fetch("https://worldtimeapi.org/api/timezone/Etc/UTC", { cache: "no-store" })
      .then(function (res) { return res.ok ? res.json() : null; })
      .then(function (data) {
        if (!data || typeof data.unixtime !== "number") return;
        var rtt = Date.now() - mulai;
        /* Estimated server time at ARRIVAL: unixtime + half RTT.
           Only used when the drift is significant (> 90 seconds). */
        var tiba = data.unixtime * 1000 + Math.round(rtt / 2);
        var offset = tiba - Date.now();
        if (Math.abs(offset) > 90 * 1000) {
          waktuOffsetMs = offset;
          encPut(WAKTU_KEY, { offset: waktuOffsetMs, disinkron: Date.now() });
          console.info("Time synced to server (drift " + Math.round(offset / 1000) + " seconds).");
        }
      })
      .catch(function () { /* offline / API down -> use the device clock */ });
  }

  function muatOffsetWaktu() {
    return encGet(WAKTU_KEY).then(function (v) {
      if (v && typeof v.offset === "number" && (Date.now() - (v.disinkron || 0)) < 7 * 24 * 3600 * 1000) {
        waktuOffsetMs = v.offset;
      }
    }).catch(function () {});
  }

  function nowWIB() {
    /* en-US parts => locale-independent weekday mapping */
    var parts = new Intl.DateTimeFormat("en-US", {
      timeZone: currentTZ, weekday: "short", year: "numeric", month: "2-digit",
      day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
    }).formatToParts(new Date(Date.now() + waktuOffsetMs));

    var map = {};
    parts.forEach(function (p) { map[p.type] = p.value; });

    var WD = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    var dayIndex = WD.hasOwnProperty(map.weekday) ? WD[map.weekday] : 0;
    var jam = parseInt(map.hour, 10);
    if (jam === 24) jam = 0;

    return {
      dayIndex: dayIndex, hari: dayLabel(dayIndex), jam: jam,
      menit: parseInt(map.minute, 10), detik: parseInt(map.second, 10),
      tanggal: parseInt(map.day, 10), bulan: map.month, tahun: parseInt(map.year, 10),
      totalMenit: jam * 60 + parseInt(map.minute, 10),
    };
  }

  function jamKeMenit(hhmm) {
    var b = (hhmm || "00:00").split(":");
    return parseInt(b[0], 10) * 60 + parseInt(b[1], 10);
  }
  function pad(n) { return n < 10 ? "0" + n : "" + n; }

  function normJamStr(hhmm) {
    var b = String(hhmm || "0:0").split(":");
    return pad(parseInt(b[0], 10) || 0) + ":" + pad(parseInt(b[1], 10) || 0);
  }

  /* Detects two schedule rows whose time ranges overlap.
     Used by the add & edit forms; the row being edited is excluded. */
  function adaTabrakanJadwal(daftar, mulaiBaru, selesaiBaru, abaikanIdx) {
    var m1 = jamKeMenit(mulaiBaru), m2 = jamKeMenit(selesaiBaru);
    for (var i = 0; i < daftar.length; i++) {
      if (i === abaikanIdx) continue;
      var x = daftar[i];
      if (m1 < jamKeMenit(x.selesai) && jamKeMenit(x.mulai) < m2) return x;
    }
    return null;
  }

  /* Automatic ordering: rows with a period number sort by number then time.
     Rows WITHOUT a period (breaks etc.) are inserted exactly between the two
     lessons that bracket them in time. Example: a break at 08:00 appears
     right after Mathematics 07:15-08:00, before the 08:20 lesson. */
  function urutkanJadwal(list) {
    var withKey = [], noKey = [];
    (list || []).forEach(function (s) {
      var jk = parseInt(s.jamKe, 10);
      if (!isNaN(jk) && jk > 0) withKey.push(s); else noKey.push(s);
    });
    withKey.sort(function (a, b) {
      var ja = parseInt(a.jamKe, 10), jb = parseInt(b.jamKe, 10);
      if (ja !== jb) return ja - jb;
      return jamKeMenit(a.mulai) - jamKeMenit(b.mulai);
    });
    noKey.sort(function (a, b) { return jamKeMenit(a.mulai) - jamKeMenit(b.mulai); });
    var hasil = [];
    withKey.forEach(function (s) {
      while (noKey.length && jamKeMenit(noKey[0].mulai) <= jamKeMenit(s.mulai)) {
        hasil.push(noKey.shift());
      }
      hasil.push(s);
    });
    while (noKey.length) hasil.push(noKey.shift());
    return hasil;
  }

  function terapkanLabelZona() {
    var label = currentTZ;
    try {
      var parts = new Intl.DateTimeFormat("en-US", { timeZone: currentTZ, timeZoneName: "short" }).formatToParts(new Date());
      for (var i = 0; i < parts.length; i++) {
        if (parts[i].type === "timeZoneName") { label = parts[i].value; break; }
      }
    } catch (e) {}
    var zc = document.getElementById("clock-zone");
    if (zc) zc.textContent = label;
    var map = { "label-jadwal-mulai": "jform.start", "label-jadwal-selesai": "jform.end", "label-edit-mulai": "jform.start", "label-edit-selesai": "jform.end" };
    Object.keys(map).forEach(function (id) {
      var lb = document.getElementById(id);
      if (lb) lb.textContent = T(map[id]) + " (" + label + ")";
    });
  }

  function tickJam() {
    var n = nowWIB();
    if (el.jam) el.jam.textContent = pad(n.jam) + ":" + pad(n.menit) + ":" + pad(n.detik);
    if (el.hari) el.hari.textContent = n.hari + ", " + pad(n.tanggal) + "/" + n.bulan + "/" + n.tahun;
  }

  function zonaLabel() {
    var zc = document.getElementById("clock-zone");
    return zc ? zc.textContent : currentTZ;
  }

  function updateClassStatus() {
    if (!el.cardStatus) return;
    var n = nowWIB();
    var jadwalHari = (hariAktif.indexOf(n.dayIndex) !== -1 ? JADWAL[n.dayIndex] : null) || null;

    el.cardStatus.classList.remove("is-active");
    if (el.progWrap) el.progWrap.hidden = true;
    if (el.statusNext) el.statusNext.textContent = "";

    if (!jadwalHari || jadwalHari.length === 0) {
      if (el.statusLabel) el.statusLabel.textContent = T("status.holiday");
      if (el.statusJamKe) el.statusJamKe.textContent = "";
      if (el.statusMapel) el.statusMapel.textContent = T("status.none");
      if (el.statusDetail) el.statusDetail.textContent = T("status.noneDetail", { day: n.hari });
      renderStatusNextHariLain(n.dayIndex);
      return;
    }

    var sekarang = n.totalMenit;
    var slotAktif = null;
    var slotBerikut = null;

    for (var i = 0; i < jadwalHari.length; i++) {
      var s = jadwalHari[i];
      var m1 = jamKeMenit(s.mulai);
      var m2 = jamKeMenit(s.selesai);
      if (sekarang >= m1 && sekarang < m2) {
        slotAktif = s;
        slotBerikut = jadwalHari[i + 1] || null;
        break;
      }
      if (sekarang < m1 && !slotBerikut) {
        slotBerikut = s;
      }
    }

    if (slotAktif) {
      var berlangsung = slotAktif.tipe !== "istirahat";
      if (berlangsung) {
        el.cardStatus.classList.add("is-active");
        if (el.statusLabel) el.statusLabel.textContent = T("status.ongoing");
      } else {
        if (el.statusLabel) el.statusLabel.textContent = T("status.break");
      }

      if (el.statusJamKe) el.statusJamKe.textContent = slotAktif.jamKe ? T("status.period", { n: slotAktif.jamKe }) : "";
      if (el.statusMapel) el.statusMapel.textContent = slotAktif.mapel;
      if (el.statusDetail) el.statusDetail.textContent = T("status.timeRange", { start: slotAktif.mulai, end: slotAktif.selesai, tz: zonaLabel() });

      var m1a = jamKeMenit(slotAktif.mulai);
      var m2a = jamKeMenit(slotAktif.selesai);
      var totalDur = m2a - m1a;
      var lewat = sekarang - m1a;
      var persen = totalDur > 0 ? Math.min(100, Math.round((lewat / totalDur) * 100)) : 0;
      var sisa = Math.max(0, m2a - sekarang);

      if (el.progWrap) el.progWrap.hidden = false;
      if (el.progFill) el.progFill.style.width = persen + "%";
      if (el.progText) el.progText.textContent = T("status.remaining", { n: sisa });

      if (slotBerikut && el.statusNext) {
        el.statusNext.innerHTML = T("status.next", { subject: escapeHtml(slotBerikut.mapel), time: slotBerikut.mulai });
      }
      return;
    }

    if (el.statusLabel) el.statusLabel.textContent = T("status.outside");
    if (el.statusMapel) el.statusMapel.textContent = T("status.noclass");
    if (el.statusJamKe) el.statusJamKe.textContent = "";

    var jamPertama = jadwalHari[0];
    var jamTerakhir = jadwalHari[jadwalHari.length - 1];

    if (sekarang < jamKeMenit(jamPertama.mulai)) {
      if (el.statusDetail) el.statusDetail.textContent = T("status.beforeStart", { time: jamPertama.mulai, tz: zonaLabel() });
      if (el.statusNext) el.statusNext.innerHTML = T("status.firstLesson", { subject: escapeHtml(jamPertama.mapel), time: jamPertama.mulai });
    } else if (sekarang >= jamKeMenit(jamTerakhir.selesai)) {
      if (el.statusDetail) el.statusDetail.textContent = T("status.afterDone");
      renderStatusNextHariLain(n.dayIndex);
    } else {
      if (el.statusDetail) el.statusDetail.textContent = T("status.outsideDetail");
      if (slotBerikut && el.statusNext) {
        el.statusNext.innerHTML = T("status.next", { subject: escapeHtml(slotBerikut.mapel), time: slotBerikut.mulai });
      }
    }
  }

  function renderStatusNextHariLain(fromDayIndex) {
    for (var add = 1; add <= 7; add++) {
      var d = (fromDayIndex + add) % 7;
      if (hariAktif.indexOf(d) === -1) continue;
      if (JADWAL[d] && JADWAL[d].length > 0) {
        var label = add === 1 ? T("status.tomorrow", { day: dayLabel(d) }) : dayLabel(d);
        var first = JADWAL[d][0];
        if (el.statusNext) {
          el.statusNext.innerHTML = T("status.nextDay", { label: escapeHtml(label), time: first.mulai, subject: escapeHtml(first.mapel) });
        }
        return;
      }
    }
  }

  function renderTabHari() {
    if (!el.tabHari) return;
    if (hariAktif.indexOf(hariDipilih) === -1) {
      var today = nowWIB().dayIndex;
      hariDipilih = hariAktif.indexOf(today) !== -1 ? today : (hariAktif.length > 0 ? hariAktif[0] : null);
    }
    el.tabHari.innerHTML = "";
    hariAktif.forEach(function (d) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "chip" + (d === hariDipilih ? " is-active" : "");
      b.textContent = dayLabel(d);
      b.onclick = function () {
        hariDipilih = d; renderTabHari(); renderJadwalHari();
      };
      el.tabHari.appendChild(b);
    });
  }

  function renderJadwalHari() {
    if (!el.daftarJadwal) return;
    var n = nowWIB();
    var jadwalHari = JADWAL[hariDipilih] || [];
    el.daftarJadwal.innerHTML = "";

    if (jadwalHari.length === 0) {
      if (el.jadwalKosong) el.jadwalKosong.hidden = false;
      el.daftarJadwal.hidden = true;
    } else {
      if (el.jadwalKosong) el.jadwalKosong.hidden = true;
      el.daftarJadwal.hidden = false;

      jadwalHari.forEach(function (s, index) {
        var li = document.createElement("li");
        li.className = "schedule-row";
        if (s.tipe === "istirahat") li.classList.add("is-break");

        var isNow = false;
        if (hariDipilih === n.dayIndex) {
          var m1 = jamKeMenit(s.mulai);
          var m2 = jamKeMenit(s.selesai);
          if (n.totalMenit >= m1 && n.totalMenit < m2) { isNow = true; li.classList.add("is-now"); }
        }

        var jam = document.createElement("span");
        jam.className = "schedule-jam"; jam.textContent = s.jamKe || "•";
        var waktu = document.createElement("span");
        waktu.className = "schedule-time"; waktu.textContent = s.mulai + "–" + s.selesai;
        var mapel = document.createElement("span");
        mapel.className = "schedule-mapel"; mapel.textContent = s.mapel;

        li.appendChild(jam); li.appendChild(waktu); li.appendChild(mapel);
        if (isNow) {
          var tag = document.createElement("span");
          tag.className = "schedule-now-tag"; tag.textContent = T("sched.now");
          li.appendChild(tag);
        }

        /* Long-press (1s) opens the per-row action sheet */
        var pressTimer = null;
        function startPress() {
          clearTimeout(pressTimer);
          pressTimer = setTimeout(function () {
            selectedScheduleIndex = index;
            if ("vibrate" in navigator) navigator.vibrate(80);
            if (el.modalAksiJadwal) el.modalAksiJadwal.hidden = false;
          }, 1000);
        }
        function cancelPress() { clearTimeout(pressTimer); }

        li.addEventListener("touchstart", startPress, { passive: true });
        li.addEventListener("touchend", cancelPress);
        li.addEventListener("touchmove", cancelPress);

        li.addEventListener("mousedown", startPress);
        li.addEventListener("mouseup", cancelPress);
        li.addEventListener("mouseleave", cancelPress);

        el.daftarJadwal.appendChild(li);
      });
    }
  }

  function cariDeadline(mapel) {
    var n = nowWIB();
    for (var add = 0; add <= 7; add++) {
      var dayIndex = (n.dayIndex + add) % 7;
      if (hariAktif.indexOf(dayIndex) === -1) continue;
      var jadwalHari = JADWAL[dayIndex];
      if (!jadwalHari) continue;
      for (var i = 0; i < jadwalHari.length; i++) {
        var s = jadwalHari[i];
        if (s.tipe !== "pelajaran") continue;
        if (normalisasi(s.mapel) !== normalisasi(mapel)) continue;

        var menitSlot = jamKeMenit(s.mulai);
        if (add === 0 && menitSlot <= n.totalMenit) continue;

        var selisihMenit = add * 24 * 60 + (menitSlot - n.totalMenit);
        var selisihJam = selisihMenit / 60;
        var label = add === 0 ? T("deadline.today") : (add === 1 ? T("deadline.tomorrow") : T("deadline.on", { day: dayLabel(dayIndex) }));
        return { ada: true, hariIndex: dayIndex, hari: dayLabel(dayIndex), mulai: s.mulai, jamKe: s.jamKe, selisihJam: selisihJam, selisihMenit: selisihMenit, label: label };
      }
    }
    return { ada: false };
  }

  function normalisasi(s) {
    return (s || "").toLowerCase().replace(/[\s.\-]/g, "").replace("bindonesia", "bahasaindonesia").replace("binggris", "bahasainggris").replace("bjawa", "bahasajawa");
  }

  function renderTugas() {
    if (!el.daftarTugas) return;
    var frag = document.createDocumentFragment();
    var terlihat = tugasList.filter(function (t) {
      if (filterAktif === "aktif" && t.completed) return false;
      if (filterAktif === "selesai" && !t.completed) return false;
      if (filterMapel !== "semua" && normalisasi(t.mapel) !== normalisasi(filterMapel)) return false;
      if (cariTugas && (t.mapel + " " + t.detail).toLowerCase().indexOf(cariTugas) === -1) return false;
      return true;
    });
    terlihat.sort(function (a, b) {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      var da = cariDeadline(a.mapel); var db = cariDeadline(b.mapel);
      var va = da.ada ? da.selisihMenit : Infinity; var vb = db.ada ? db.selisihMenit : Infinity;
      return va - vb;
    });

    el.daftarTugas.innerHTML = "";
    terlihat.forEach(function (t) { frag.appendChild(buatItemTugas(t)); });
    el.daftarTugas.appendChild(frag);

    if (el.tugasKosong) el.tugasKosong.hidden = terlihat.length !== 0;
    var aktif = tugasList.filter(function (t) { return !t.completed; }).length;
    var total = tugasList.length;
    if (el.ringkasan) el.ringkasan.textContent = total === 0 ? T("tasks.empty") : T("tasks.count", { active: aktif, total: total });
  }

  function isiFilterMapel() {
    if (!el.filterMapel) return;
    var sekarang = filterMapel;
    var unik = [];
    tugasList.forEach(function (t) {
      if (unik.indexOf(t.mapel) === -1) unik.push(t.mapel);
    });
    el.filterMapel.innerHTML = '<option value="semua">' + T("tasks.allSubjects") + "</option>";
    unik.sort().forEach(function (m) {
      var o = document.createElement("option");
      o.value = m; o.textContent = m;
      el.filterMapel.appendChild(o);
    });
    el.filterMapel.value = (unik.indexOf(sekarang) !== -1 || sekarang === "semua") ? sekarang : "semua";
    filterMapel = el.filterMapel.value;
  }

  function buatItemTugas(t) {
    var li = document.createElement("li"); li.className = "task-item";
    var dl = cariDeadline(t.mapel);
    var urgent = !t.completed && dl.ada && dl.selisihJam <= 24;

    if (t.completed) li.classList.add("is-done");
    if (urgent) li.classList.add("is-urgent");

    var check = document.createElement("button");
    check.className = "task-check";
    check.innerHTML = '<span class="tick" aria-hidden="true">&#10003;</span>';
    check.onclick = function () {
      if (!t.completed && t.berulang === "mingguan") {
        t.dibuat = Date.now();
        showToast(T("task.weeklyReset"));
      } else {
        t.completed = !t.completed;
      }
      simpanTugas(); renderTugas(); cekNotifikasi();
      if ("vibrate" in navigator) navigator.vibrate(50);
    };

    var body = document.createElement("div"); body.className = "task-body";
    body.onclick = function () { if (!t.completed) bukaModalEdit(t); };
    var mapel = document.createElement("span"); mapel.className = "task-mapel"; mapel.textContent = t.mapel;
    var detail = document.createElement("span"); detail.className = "task-detail"; detail.textContent = t.detail;

    var meta = document.createElement("div"); meta.className = "task-meta";
    if (t.completed) {
      meta.innerHTML = '<span class="tag tag-done">' + T("task.done") + "</span>";
    } else if (dl.ada) {
      var tagDl = document.createElement("span");
      tagDl.className = "tag tag-deadline";
      tagDl.textContent = dl.label + " · " + dl.mulai + (dl.jamKe ? " (" + T("status.period", { n: dl.jamKe }) + ")" : "");
      meta.appendChild(tagDl);
      if (t.berulang === "mingguan") {
        var tagR = document.createElement("span");
        tagR.className = "tag tag-repeat";
        tagR.textContent = T("task.weekly");
        meta.appendChild(tagR);
      }
      if (urgent) {
        var tagUrgent = document.createElement("span");
        tagUrgent.className = "tag tag-urgent";
        tagUrgent.textContent = T("task.urgent");
        meta.appendChild(tagUrgent);
      }
    } else {
      var tagNone = document.createElement("span");
      tagNone.className = "tag";
      tagNone.textContent = T("task.deadlineNone");
      meta.appendChild(tagNone);
    }

    body.appendChild(mapel); body.appendChild(detail); body.appendChild(meta);
    var del = document.createElement("button"); del.className = "task-delete"; del.textContent = T("task.delete");
    del.onclick = function () {
      tugasList = tugasList.filter(function (x) { return x.id !== t.id; });
      simpanTugas(); renderTugas(); cekNotifikasi(); showToast(T("task.deletedToast"));
    };

    li.appendChild(check); li.appendChild(body); li.appendChild(del);
    return li;
  }

  function bukaModalEdit(t) {
    editTaskId = t.id;
    isiDropdownMapel();
    if (el.inputMapel) el.inputMapel.value = t.mapel;
    if (el.inputDetail) el.inputDetail.value = t.detail;
    if (el.inputBerulang) el.inputBerulang.value = t.berulang || "tidak";
    if (el.modalTitle) el.modalTitle.textContent = T("form.editTask");
    if (el.btnSubmitTugas) el.btnSubmitTugas.textContent = T("form.update");
    updatePreviewDeadline();
    if (el.formError) el.formError.hidden = true;
    if (el.overlay) el.overlay.hidden = false;
  }

  function bersihkanTugasHarian() {
    var hariIni = new Date(Date.now() + waktuOffsetMs).toDateString();
    var berubah = false;
    tugasList.forEach(function (t) {
      if (t.berulang === "hari_ini" && !t.completed && new Date(t.dibuat).toDateString() !== hariIni) {
        t.completed = true; berubah = true;
      }
    });
    if (berubah) { simpanTugas(); renderTugas(); cekNotifikasi(); }
  }


  function cekNotifikasi() {
    if (!el.banner) return;
    var urgent = [];
    tugasList.forEach(function (t) {
      if (t.completed) return;
      var dl = cariDeadline(t.mapel);
      if (dl.ada && dl.selisihJam <= 24) urgent.push({ tugas: t, dl: dl });
    });

    if (urgent.length === 0) {
      el.banner.hidden = true;
      return;
    }

    el.banner.hidden = false;
    if (urgent.length === 1) {
      if (el.bannerTeks) el.bannerTeks.textContent = T("banner.urgent.single", { subject: urgent[0].tugas.mapel, detail: urgent[0].tugas.detail, label: urgent[0].dl.label.toLowerCase(), time: urgent[0].dl.mulai });
    } else {
      if (el.bannerTeks) el.bannerTeks.textContent = T("banner.urgent.multi", { n: urgent.length });
    }
    updateNotificationButton();

    tampilkanNotifikasiUrgent(urgent);
  }

  async function tampilkanNotifikasiUrgent(urgent) {
    if (!urgent.length || !("Notification" in window) || Notification.permission !== "granted") return;
    try {
      var reg = await navigator.serviceWorker.ready;
      for (var i = 0; i < urgent.length; i++) {
        var item = urgent[i];
        var dedupKey = "yourtask-notified-" + item.tugas.id;
        if (sessionStorage.getItem(dedupKey)) continue;

        await reg.showNotification(T("notif.title"), {
          body: T("notif.body", { subject: item.tugas.mapel, detail: item.tugas.detail, label: item.dl.label.toLowerCase(), time: item.dl.mulai }),
          icon: new URL("icon.png", reg.scope).href,
          tag: "yourtask-" + item.tugas.id
        });
        sessionStorage.setItem(dedupKey, "1");
      }
    } catch (e) {
      console.error("Failed to show notification:", e);
    }
  }

  function isiDropdownMapel() {
    if (!el.inputMapel) return;
    var mapelSet = new Set();
    for (var h in JADWAL) {
      if (JADWAL[h]) {
        JADWAL[h].forEach(function (s) {
          if (s.tipe === "pelajaran" && s.mapel && s.mapel.trim() !== "" && !/berseri/i.test(s.mapel)) {
            mapelSet.add(s.mapel.trim());
          }
        });
      }
    }

    el.inputMapel.innerHTML = '<option value="">' + T("form.pickSubject") + "</option>";
    var mapelArray = Array.from(mapelSet).sort();

    if (mapelArray.length === 0) {
      var opt = document.createElement("option");
      opt.value = "";
      opt.textContent = T("form.noSubjects");
      opt.disabled = true;
      el.inputMapel.appendChild(opt);
    } else {
      mapelArray.forEach(function (m) {
        var opt = document.createElement("option");
        opt.value = m;
        opt.textContent = m;
        el.inputMapel.appendChild(opt);
      });
    }
  }

  function updatePreviewDeadline() {
    if (!el.inputMapel || !el.previewDeadline) return;
    var mapel = el.inputMapel.value;
    if (!mapel) { el.previewDeadline.classList.remove("is-filled"); el.previewDeadline.textContent = T("form.deadlinePreview"); return; }
    var dl = cariDeadline(mapel);
    el.previewDeadline.classList.add("is-filled");
    if (!dl.ada) { el.previewDeadline.innerHTML = T("form.deadlineMissing", { subject: escapeHtml(mapel) }); return; }
    el.previewDeadline.innerHTML = T("form.deadlineFound", { label: escapeHtml(dl.label), time: dl.mulai, period: dl.jamKe ? " (" + T("status.period", { n: dl.jamKe }) + ")" : "" });
  }

  function showToast(msg) {
    if (!el.toast) return;
    el.toast.textContent = msg; el.toast.hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { el.toast.hidden = true; }, 2400);
  }

  function escapeHtml(s) {
    return (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function updateNotificationButton() {
    if (!el.btnIzinNotif) return;
    el.btnIzinNotif.hidden = !("Notification" in window) || notifDiizinkan || Notification.permission === "granted";
  }

  async function mintaIzinNotifikasi() {
    if (!("Notification" in window)) { showToast(T("notif.unsupported")); return; }
    try {
      var hasil = await Notification.requestPermission();
      if (hasil === "granted") {
        notifDiizinkan = true;
        updateNotificationButton();
        showToast(T("notif.granted"));
        registerPeriodicSync();
        cekNotifikasi();
      } else {
        showToast(T("notif.denied"));
      }
    } catch (e) {
      console.error("Permission error:", e);
      showToast(T("notif.failed"));
    }
  }

  async function registerPeriodicSync() {
    try {
      var reg = await navigator.serviceWorker.ready;
      if (!("periodicSync" in reg)) {
        console.warn("Periodic Background Sync is not supported by this browser.");
        return;
      }
      var status = await navigator.permissions.query({ name: "periodic-background-sync" });
      if (status.state !== "granted") {
        console.warn("Periodic Background Sync not permitted (the PWA must be installed to the Home Screen).");
        return;
      }
      await reg.periodicSync.register("deadline-check", { minInterval: 15 * 60 * 1000 });
      console.log("Background deadline check active.");
    } catch (e) {
      console.warn("Failed to register periodic sync:", e);
    }
  }

  async function init() {
    grab();
    mulaiAlat(); /* the Tools button beside + Add (el is already populated here) */
    /* Warn when the context is insecure (HTTP): encryption & SW are limited */
    var banInsecure = document.getElementById("banner-insecure");
    if (banInsecure) banInsecure.hidden = (window.isSecureContext !== false);
    await muatProfil();
    await muatJadwal();
    await muatTugas();
    await muatTema();
    mulaiTemaUI();
    muatOffsetWaktu().then(ambilWaktuServer); /* compensate the device clock */
    mirrorStateToIDB();
    terapkanLabelZona();

    /* jamKe is no longer required in the HTML — validated manually per type */
    if (el.inputJadwalJamKe) el.inputJadwalJamKe.required = false;
    if (el.inputEditJamKe) el.inputEditJamKe.required = false;

    if (el.btnBackup) el.btnBackup.addEventListener("click", exportData);
    if (el.inputRestore) el.inputRestore.addEventListener("change", importData);
    var btnHapusJadwal = document.getElementById("btn-hapus-jadwal");
    if (btnHapusJadwal) {
      btnHapusJadwal.addEventListener("click", function () {
        if (!confirm(T("sched.deleteAllConfirm"))) return;
        JADWAL = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
        simpanJadwal(); mirrorStateToIDB();
        isiDropdownMapel(); renderJadwalHari(); updateClassStatus();
        if (el.modalProfil) el.modalProfil.hidden = true;
        showToast(T("sched.deleteAllDone"));
      });
    }


    var n = nowWIB();
    hariDipilih = (JADWAL[n.dayIndex] && JADWAL[n.dayIndex].length > 0) ? n.dayIndex : 1;
    if ("Notification" in window && Notification.permission === "granted") {
      notifDiizinkan = true;
      registerPeriodicSync();
    }
    if (el.inputBackupNama) {
      var savedNama = await encGet("backupNama");
      if (savedNama) el.inputBackupNama.value = savedNama;
    }

    var qs = new URLSearchParams(location.search);
    if (qs.get("action") === "tambah-tugas" && el.btnBuka) el.btnBuka.click();

    isiDropdownMapel();
    tickJam();
    updateClassStatus();
    renderTugas();
    renderTabHari();
    renderJadwalHari();
    cekNotifikasi();

    if (el.btnEditUser) {
      el.btnEditUser.addEventListener("click", function () {
        if (el.inputUsername) el.inputUsername.value = currentUsername;
        if (el.inputSekolah) el.inputSekolah.value = currentSchool;
        var selTZ = document.getElementById("input-timezone");
        if (selTZ) { selTZ.value = (currentTZ === deteksiZona()) ? TZ_AUTO : currentTZ; if (selTZ.selectedIndex === -1) selTZ.value = TZ_AUTO; }
        if (el.modalProfil) el.modalProfil.hidden = false;
      });
    }

    var btnTutupProfil = document.getElementById("btn-tutup-profil");
    if (btnTutupProfil) btnTutupProfil.addEventListener("click", function () { if (el.modalProfil) el.modalProfil.hidden = true; });

    var btnBatalProfil = document.getElementById("btn-batal-profil");
    if (btnBatalProfil) btnBatalProfil.addEventListener("click", function () { if (el.modalProfil) el.modalProfil.hidden = true; });

    if (el.formProfil) {
      el.formProfil.addEventListener("submit", function (e) {
        e.preventDefault();
        var valUser = el.inputUsername ? el.inputUsername.value.trim() : "";
        var valSchool = el.inputSekolah ? el.inputSekolah.value.trim() : "";
        if (valUser) { currentUsername = valUser; encPut("username", currentUsername); if (el.displayUser) el.displayUser.textContent = currentUsername; }
        if (valSchool) { currentSchool = valSchool; encPut("school", currentSchool); if (el.displaySekolah) el.displaySekolah.textContent = currentSchool; }
        var selTZ = document.getElementById("input-timezone");
        if (selTZ) {
          currentTZ = (selTZ.value === TZ_AUTO) ? deteksiZona() : selTZ.value;
          encPut("timezone", currentTZ);
          terapkanLabelZona();
          tickJam(); updateClassStatus(); renderJadwalHari();
        }
        if (el.modalProfil) el.modalProfil.hidden = true;
        showToast(T("prof.saved"));
      });
    }

    function bukaModalTambah() {
      if (el.formJadwal) el.formJadwal.reset();
      selectedScheduleIndex = null;
      var hariVal = el.inputJadwalHari ? parseInt(el.inputJadwalHari.value, 10) : 1;
      var tipeSekarang = el.inputJadwalTipe ? el.inputJadwalTipe.value : "pelajaran";
      populateJamKeOptions(el.inputJadwalJamKe, hariVal, null, tipeSekarang !== "pelajaran");
      if (el.modalJadwal) el.modalJadwal.hidden = false;
    }

    if (el.btnTambahJadwal) el.btnTambahJadwal.addEventListener("click", bukaModalTambah);

    if (el.inputJadwalHari) {
      el.inputJadwalHari.addEventListener("change", function () {
        var hariVal = parseInt(this.value, 10);
        var tipeSekarang = el.inputJadwalTipe ? el.inputJadwalTipe.value : "pelajaran";
        populateJamKeOptions(el.inputJadwalJamKe, hariVal, null, tipeSekarang !== "pelajaran");
      });
    }

    if (el.inputJadwalTipe) {
      el.inputJadwalTipe.addEventListener("change", function () {
        var hariVal = el.inputJadwalHari ? parseInt(el.inputJadwalHari.value, 10) : 1;
        populateJamKeOptions(el.inputJadwalJamKe, hariVal, null, this.value !== "pelajaran");
      });
    }

    var btnTutupJadwal = document.getElementById("btn-tutup-jadwal");
    if (btnTutupJadwal) btnTutupJadwal.addEventListener("click", function () { if (el.modalJadwal) el.modalJadwal.hidden = true; });

    var btnBatalJadwal = document.getElementById("btn-batal-jadwal");
    if (btnBatalJadwal) btnBatalJadwal.addEventListener("click", function () { if (el.modalJadwal) el.modalJadwal.hidden = true; });

    if (el.formJadwal) {
      el.formJadwal.addEventListener("submit", function (e) {
        e.preventDefault();
        var h = el.inputJadwalHari ? parseInt(el.inputJadwalHari.value, 10) : 1;
        var mulai = el.formJadwal.querySelector("#input-jadwal-mulai").value;
        var selesai = el.formJadwal.querySelector("#input-jadwal-selesai").value;
        var mapel = el.formJadwal.querySelector("#input-jadwal-mapel").value.trim();
        var tipe = el.formJadwal.querySelector("#input-jadwal-tipe").value;
        var jamKe = el.inputJadwalJamKe ? el.inputJadwalJamKe.value : "";

        if (jamKeMenit(mulai) >= jamKeMenit(selesai)) { showToast(T("sched.timeOrder")); return; }
        var bentrok = adaTabrakanJadwal(JADWAL[h] || [], mulai, selesai, null);
        if (bentrok) { showToast(T("sched.conflict", { subject: bentrok.mapel, a: bentrok.mulai, b: bentrok.selesai })); return; }

        var jkNum = parseInt(jamKe, 10);
        if (tipe === "pelajaran") {
          if (!jamKe || jkNum <= 0) { showToast(T("sched.periodRequired")); return; }
          var duplikat = false;
          (JADWAL[h] || []).forEach(function (x) {
            if (x.tipe === "pelajaran" && String(parseInt(x.jamKe, 10)) === String(jkNum)) duplikat = true;
          });
          if (duplikat) { showToast(T("sched.periodTaken", { n: jkNum })); return; }
        }

        if (!JADWAL[h]) JADWAL[h] = [];
        JADWAL[h].push({
          jamKe: (tipe === "pelajaran") ? jkNum : (jamKe && jkNum > 0 ? jkNum : ""),
          mulai: mulai, selesai: selesai, mapel: mapel, tipe: tipe
        });
        simpanJadwal();
        if (el.modalJadwal) el.modalJadwal.hidden = true;
        isiDropdownMapel();
        renderJadwalHari();
        updateClassStatus();
        showToast(T("sched.added"));
      });
    }

    var btnTutupAksi = document.getElementById("btn-tutup-aksi");
    if (btnTutupAksi) btnTutupAksi.addEventListener("click", function () { if (el.modalAksiJadwal) el.modalAksiJadwal.hidden = true; });

    if (el.btnAksiEdit) {
      el.btnAksiEdit.addEventListener("click", function () {
        if (el.modalAksiJadwal) el.modalAksiJadwal.hidden = true;
        if (selectedScheduleIndex === null || !JADWAL[hariDipilih]) return;
        var s = JADWAL[hariDipilih][selectedScheduleIndex];

        if (el.formEditJadwal) {
          el.formEditJadwal.querySelector("#input-edit-mulai").value = s.mulai;
          el.formEditJadwal.querySelector("#input-edit-selesai").value = s.selesai;
          el.formEditJadwal.querySelector("#input-edit-mapel").value = s.mapel;
          el.formEditJadwal.querySelector("#input-edit-tipe").value = s.tipe;
        }

        populateJamKeOptions(el.inputEditJamKe, hariDipilih, s.jamKe, s.tipe !== "pelajaran");
        if (el.modalEditJadwal) el.modalEditJadwal.hidden = false;
      });
    }

    if (el.btnAksiHapus) {
      el.btnAksiHapus.addEventListener("click", function () {
        if (el.modalAksiJadwal) el.modalAksiJadwal.hidden = true;
        if (selectedScheduleIndex === null || !JADWAL[hariDipilih]) return;

        if (confirm(T("sched.deleteConfirm"))) {
          JADWAL[hariDipilih].splice(selectedScheduleIndex, 1);
          simpanJadwal();
          isiDropdownMapel();
          renderJadwalHari();
          updateClassStatus();
          showToast(T("sched.deleted"));
        }
        selectedScheduleIndex = null;
      });
    }

    var btnTutupEditJadwal = document.getElementById("btn-tutup-edit-jadwal");
    if (btnTutupEditJadwal) btnTutupEditJadwal.addEventListener("click", function () { if (el.modalEditJadwal) el.modalEditJadwal.hidden = true; selectedScheduleIndex = null; });

    var btnBatalEditJadwal = document.getElementById("btn-batal-edit-jadwal");
    if (btnBatalEditJadwal) btnBatalEditJadwal.addEventListener("click", function () { if (el.modalEditJadwal) el.modalEditJadwal.hidden = true; selectedScheduleIndex = null; });

    if (el.inputEditTipe) {
      el.inputEditTipe.addEventListener("change", function () {
        populateJamKeOptions(el.inputEditJamKe, hariDipilih, null, this.value !== "pelajaran");
      });
    }

    if (el.formEditJadwal) {
      el.formEditJadwal.addEventListener("submit", function (e) {
        e.preventDefault();
        if (selectedScheduleIndex === null || !JADWAL[hariDipilih]) return;

        var mulai = el.formEditJadwal.querySelector("#input-edit-mulai").value;
        var selesai = el.formEditJadwal.querySelector("#input-edit-selesai").value;
        var mapel = el.formEditJadwal.querySelector("#input-edit-mapel").value.trim();
        var tipe = el.formEditJadwal.querySelector("#input-edit-tipe").value;
        var jamKe = el.inputEditJamKe ? el.inputEditJamKe.value : "";

        if (jamKeMenit(mulai) >= jamKeMenit(selesai)) { showToast(T("sched.timeOrder")); return; }
        var bentrok = adaTabrakanJadwal(JADWAL[hariDipilih] || [], mulai, selesai, selectedScheduleIndex);
        if (bentrok) { showToast(T("sched.conflict", { subject: bentrok.mapel, a: bentrok.mulai, b: bentrok.selesai })); return; }

        var jkNum = parseInt(jamKe, 10);
        if (tipe === "pelajaran") {
          if (!jamKe || jkNum <= 0) { showToast(T("sched.periodRequired")); return; }
          var duplikat = false;
          JADWAL[hariDipilih].forEach(function (x, idx) {
            if (idx !== selectedScheduleIndex && x.tipe === "pelajaran" && String(parseInt(x.jamKe, 10)) === String(jkNum)) duplikat = true;
          });
          if (duplikat) { showToast(T("sched.periodTaken", { n: jkNum })); return; }
        }

        JADWAL[hariDipilih][selectedScheduleIndex] = {
          jamKe: (tipe === "pelajaran") ? jkNum : (jamKe && jkNum > 0 ? jkNum : ""),
          mulai: mulai, selesai: selesai, mapel: mapel, tipe: tipe
        };

        simpanJadwal();
        if (el.modalEditJadwal) el.modalEditJadwal.hidden = true;
        selectedScheduleIndex = null;
        isiDropdownMapel();
        renderJadwalHari();
        updateClassStatus();
        showToast(T("sched.updated"));
      });
    }

    if (el.btnBuka) {
      el.btnBuka.addEventListener("click", function () {
        if (el.form) el.form.reset();
        editTaskId = null;
        if (el.modalTitle) el.modalTitle.textContent = T("form.addTask");
        if (el.btnSubmitTugas) el.btnSubmitTugas.textContent = T("form.save");
        if (el.formError) el.formError.hidden = true;
        isiDropdownMapel();
        updatePreviewDeadline();
        if (el.overlay) el.overlay.hidden = false;
      });
    }

    var btnTutupModal = document.getElementById("btn-tutup-modal");
    if (btnTutupModal) btnTutupModal.addEventListener("click", function () { if (el.overlay) el.overlay.hidden = true; });

    var btnBatal = document.getElementById("btn-batal");
    if (btnBatal) btnBatal.addEventListener("click", function () { if (el.overlay) el.overlay.hidden = true; });

    if (el.inputMapel) {
      el.inputMapel.addEventListener("change", function () {
        if (el.formError) el.formError.hidden = true;
        updatePreviewDeadline();
      });
    }

    if (el.form) {
      el.form.addEventListener("submit", function (e) {
        e.preventDefault();
        var mapel = el.inputMapel ? el.inputMapel.value : "";
        var detail = el.inputDetail ? el.inputDetail.value.trim() : "";
        var berulang = el.inputBerulang ? el.inputBerulang.value : "tidak";
        if (!mapel || !detail) {
          if (el.formError) {
            el.formError.textContent = T("form.errFill");
            el.formError.hidden = false;
          }
          return;
        }
        if (editTaskId) {
          var tg = tugasList.find(function (x) { return x.id === editTaskId; });
          if (tg) { tg.mapel = mapel; tg.detail = detail; tg.berulang = berulang; }
          editTaskId = null;
          if (el.modalTitle) el.modalTitle.textContent = T("form.addTask");
          if (el.btnSubmitTugas) el.btnSubmitTugas.textContent = T("form.save");
          showToast(T("form.taskUpdated"));
        } else {
          tugasList.push({ id: "t" + Date.now(), mapel: mapel, detail: detail, completed: false, dibuat: Date.now(), berulang: berulang });
          showToast(T("form.taskAdded"));
        }
        simpanTugas(); renderTugas(); cekNotifikasi();
        if (el.overlay) el.overlay.hidden = true;
      });
    }


    if (el.btnIzinNotif) {
      el.btnIzinNotif.addEventListener("click", mintaIzinNotifikasi);
    }

    var chips = document.querySelectorAll(".filter-row .chip");
    chips.forEach(function (c) {
      c.addEventListener("click", function () {
        chips.forEach(function (x) { x.classList.remove("is-active"); });
        c.classList.add("is-active"); filterAktif = c.dataset.filter; renderTugas();
      });
    });

    isiFilterMapel();
    if (el.filterMapel) {
      el.filterMapel.addEventListener("change", function () { filterMapel = el.filterMapel.value; renderTugas(); });
    }
    if (el.cariTugas) {
      el.cariTugas.addEventListener("input", function () {
        cariTugas = el.cariTugas.value.trim().toLowerCase();
        renderTugas();
      });
    }

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("./sw.js").then(function (reg) {
        reg.addEventListener("updatefound", function () {
          var nw = reg.installing;
          if (!nw) return;
          nw.addEventListener("statechange", function () {
            if (nw.state === "activated" && navigator.serviceWorker.controller) {
              showToast(T("misc.newVersion"));
            }
          });
        });
      }).catch(function () {});
    }

    /* Re-render every dynamic, language-dependent surface when the language changes */
    if (window.I18N) {
      document.addEventListener("langchange", function () {
        terapkanLabelZona();
        tickJam();
        updateClassStatus();
        renderTugas();
        renderTabHari();
        renderJadwalHari();
        renderTemaPresets();
        isiFilterMapel();
      });
    }

    setInterval(tickJam, 1000);
    setInterval(function () { updateClassStatus(); if (hariDipilih === nowWIB().dayIndex) renderJadwalHari(); }, 15000);
    setInterval(function () { bersihkanTugasHarian(); renderTugas(); cekNotifikasi(); }, 60000);
    setInterval(ambilWaktuServer, 6 * 60 * 60 * 1000); /* re-validate the offset every 6 hours */
  }

  if (document.readyState === "loading") { document.addEventListener("DOMContentLoaded", start); } else { start(); }
  function start() {
    migrasiLocalStorage()
      .then(function () { return muatHariAktif(); })
      .then(function () { return init(); })
      .catch(function (e) {
        console.error("Failed to load saved data:", e);
        return init();
      });
  }

  /* ====== SCHEDULE TOOLS + ACTIVE SCHOOL DAYS + AI PDF ====== */

  function muatHariAktif() {
    return encGet("activeDays").then(function (arr) {
      if (Array.isArray(arr)) {
        var bersih = arr.filter(function (d) { return d >= 0 && d <= 6; })
          .sort(function (a, b) { return a - b; });
        if (bersih.length > 0) hariAktif = bersih;
      }
    }).catch(function () {}).then(function () {
      if (!hariAktif || hariAktif.length === 0) hariAktif = [1, 2, 3, 4, 5, 6];
    });
  }

  function simpanHariAktif() {
    encPut("activeDays", hariAktif);
  }

  function refreshSemua() {
    selectedScheduleIndex = null;
    renderTabHari();
    renderJadwalHari();
    updateClassStatus();
    renderTugas();
    cekNotifikasi();
  }

  /* Day-name recognition across many languages: pasted text or AI output may
     use English, Indonesian, Spanish/French/German/Italian, Russian, CJK. */
  var ALAT_DAY_WORDS = {
    "sunday": 0, "sun": 0, "minggu": 0, "ahad": 0,
    "monday": 1, "mon": 1, "senin": 1, "lunes": 1, "lundi": 1, "montag": 1, "luned\u00ec": 1, "\u661f\u671f\u4e00": 1, "\u6708\u66dc\u65e5": 1, "\u6708\u66dc": 1, "\uc6d4\uc694\uc77c": 1, "\u043f\u043e\u043d\u0435\u0434\u0435\u043b\u044c\u043d\u0438\u043a": 1,
    "tuesday": 2, "tue": 2, "selasa": 2, "martes": 2, "mardi": 2, "dienstag": 2, "marted\u00ec": 2, "\u661f\u671f\u4e8c": 2, "\u706b\u66dc\u65e5": 2, "\u706b\u66dc": 2, "\ud654\uc694\uc77c": 2, "\u0432\u0442\u043e\u0440\u043d\u0438\u043a": 2,
    "wednesday": 3, "wed": 3, "rabu": 3, "mi\u00e9rcoles": 3, "miercoles": 3, "mercredi": 3, "mittwoch": 3, "mercoled\u00ec": 3, "\u661f\u671f\u4e09": 3, "\u6c34\u66dc\u65e5": 3, "\u6c34\u66dc": 3, "\uc218\uc694\uc77c": 3, "\u0441\u0440\u0435\u0434\u0430": 3,
    "thursday": 4, "thu": 4, "kamis": 4, "jueves": 4, "jeudi": 4, "donnerstag": 4, "gioved\u00ec": 4, "\u661f\u671f\u56db": 4, "\u6728\u66dc\u65e5": 4, "\u6728\u66dc": 4, "\ubaa9\uc694\uc77c": 4, "\u0447\u0435\u0442\u0432\u0435\u0440\u0433": 4,
    "friday": 5, "fri": 5, "jumat": 5, "viernes": 5, "vendredi": 5, "freitag": 5, "venerd\u00ec": 5, "\u661f\u671f\u4e94": 5, "\u91d1\u66dc\u65e5": 5, "\u91d1\u66dc": 5, "\uae08\uc694\uc77c": 5, "\u043f\u044f\u0442\u043d\u0438\u0446\u0430": 5,
    "saturday": 6, "sat": 6, "sabtu": 6, "s\u00e1bado": 6, "sabado": 6, "samedi": 6, "samstag": 6, "sabato": 6, "\u661f\u671f\u516d": 6, "\u571f\u66dc\u65e5": 6, "\u571f\u66dc": 6, "\ud1a0\uc694\uc77c": 6, "\u0441\u0443\u0431\u0431\u043e\u0442\u0430": 6,
    "\u661f\u671f\u65e5": 0, "\u65e5\u66dc\u65e5": 0, "\u65e5\u66dc": 0, "\uc77c\uc694\uc77c": 0, "\u0432\u043e\u0441\u043a\u0440\u0435\u0441\u0435\u043d\u044c\u0435": 0
  };
  function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
  var ALAT_DAY_RE = new RegExp("(" + Object.keys(ALAT_DAY_WORDS).map(escapeRe).join("|") + ")", "i");
  var ALAT_TIME_RE = /(\d{1,2})\s*[.:]\s*(\d{2})\s*(?:s\s*\/\s*d|s\.?\s*d\.?|sd|sampai|hingga|[-\u2013\u2014])?\s*(\d{1,2})\s*[.:]\s*(\d{2})/i;

  function alatHariKeIndex(word) {
    var w = String(word).toLowerCase().replace(/['\u2019]/g, "").trim();
    return ALAT_DAY_WORDS.hasOwnProperty(w) ? ALAT_DAY_WORDS[w] : -1;
  }

  function alatBersihMapel(s) {
    s = String(s || "").replace(/\s+/g, " ").trim();
    var cells = s.split(/\s*[|\t;,]\s*/);
    for (var i = 0; i < cells.length; i++) {
      if (cells[i].trim() !== "" && !/^\d+$/.test(cells[i].trim())) return cells[i].trim();
    }
    return s;
  }

  function alatParse(text, fallbackDay) {
    var hasil = {}, peringatan = [];
    var currentDay = null, lastEnd = null, lastDur = null, lastJamKe = 0;
    String(text).split(/\r?\n/).forEach(function (rawLine, i) {
      var line = rawLine.trim();
      if (line === "") return;

      var head = line.split(/\t|\||;/)[0] || line;
      var mDay = head.slice(0, 24).match(ALAT_DAY_RE);
      if (mDay) {
        var dIdx = alatHariKeIndex(mDay[1]);

        currentDay = dIdx;
        if (!hasil[dIdx]) hasil[dIdx] = [];
        lastEnd = null; lastDur = null; lastJamKe = 0;
        return;
      }

      if (currentDay === null && fallbackDay === null) {
        peringatan.push(T("parser.lineDay", { n: i + 1 }));
        return;
      }
      if (currentDay === null) currentDay = fallbackDay;
      if (!hasil[currentDay]) hasil[currentDay] = [];

      var t = line.match(ALAT_TIME_RE);
      var mulaiM, selesaiM, jamKe = null, sisa = "";

      if (t) {
        var h1 = parseInt(t[1], 10), m1 = parseInt(t[2], 10);
        var h2 = parseInt(t[3], 10), m2 = parseInt(t[4], 10);
        if (h1 > 23 || m1 > 59 || m2 > 59 || (h2 > 23 && !(h2 === 24 && m2 === 0))) {
          peringatan.push(T("parser.lineTime", { n: i + 1 }));
          return;
        }
        mulaiM = h1 * 60 + m1;
        selesaiM = (h2 === 24) ? 1440 : h2 * 60 + m2;
        if (selesaiM <= mulaiM) {
          peringatan.push(T("parser.lineOrder", { n: i + 1 }));
          return;
        }
        var mJk = line.slice(0, t.index).match(/(\d{1,2})\s*(?:[|;.,\-\u2013\u2014]\s*)?$/);
        if (mJk) jamKe = parseInt(mJk[1], 10);
        sisa = line.slice(t.index + t[0].length);
      } else {
        if (lastEnd === null || lastDur === null) {
          peringatan.push(T("parser.lineRef", { n: i + 1 }));
          return;
        }
        mulaiM = lastEnd;
        selesaiM = lastEnd + lastDur;
        if (selesaiM > 1440) {
          peringatan.push(T("parser.line24", { n: i + 1 }));
          return;
        }
        sisa = line;
      }

      var mapel = alatBersihMapel(sisa);
      if (mapel === "") {
        peringatan.push(T("parser.lineEmpty", { n: i + 1 }));
        return;
      }

      var tipe = /istirahat|break|recreo|r\u00e9cr\u00e9ation|pause|recreio|\u4f11\u606f|\u4f11\u61a9|\uc27c\ub294|\u043f\u0435\u0440\u0435\u043c\u0435\u043d\u0430/i.test(mapel) ? "istirahat"
        : (/upacara|assembly|ceremony|c\u00e9r\u00e9monie|zeremonie|\u671d\u306e\u96c6\u4f1a|\u6668\u4f1a|\uc870\ud68c|\u043b\u0438\u043d\u0435\u0439\u043a\u0430/i.test(mapel) ? "upacara" : "pelajaran");

      /* Breaks/assemblies: optional period number, they do not advance the lesson count */
      if (tipe === "pelajaran") {
        if (jamKe === null) jamKe = lastJamKe > 0 ? lastJamKe + 1 : hasil[currentDay].length + 1;
        if (jamKe < 1 || jamKe > 100) jamKe = hasil[currentDay].length + 1;
        lastJamKe = jamKe;
      } else {
        jamKe = (jamKe !== null && jamKe >= 1 && jamKe <= 100) ? jamKe : "";
      }

      hasil[currentDay].push({
        jamKe: (jamKe === "" ? "" : String(jamKe)),
        mulai: pad(Math.floor(mulaiM / 60)) + ":" + pad(mulaiM % 60),
        selesai: pad(Math.floor(selesaiM / 60) % 24) + ":" + pad(selesaiM % 60),
        mapel: mapel, tipe: tipe
      });
      lastEnd = selesaiM;
      lastDur = selesaiM - mulaiM;
    });

    var hariAda = Object.keys(hasil)
      .filter(function (k) { return hasil[k].length > 0; })
      .map(function (k) { return parseInt(k, 10); })
      .sort(function (a, b) { return a - b; });
    return { hasil: hasil, hariAda: hariAda, peringatan: peringatan };
  }

  function alatNormJam(v) {
    var s = String(v == null ? "" : v).trim();
    var m = s.match(/^(\d{1,2})[.:](\d{2})$/);
    if (m) {
      var hh = parseInt(m[1], 10), mm = parseInt(m[2], 10);
      if (hh > 23 || mm > 59) return null;
      return pad(hh) + ":" + pad(mm);
    }
    var m2 = s.match(/^(\d{1,2})$/);
    if (m2) {
      var h = parseInt(m2[1], 10);
      return (h >= 0 && h <= 23) ? pad(h) + ":00" : null;
    }
    return null;
  }

  function alatNormalisasiAI(obj) {
    var hasil = {}, peringatan = [];
    var jadwal = (obj && obj.jadwal) ? obj.jadwal : {};
    Object.keys(jadwal).forEach(function (namaHari) {
      var dIdx = alatHariKeIndex(namaHari);
      if (dIdx < 0) { peringatan.push(T("parser.dayUnknown", { day: namaHari })); return; }
      var rows = Array.isArray(jadwal[namaHari]) ? jadwal[namaHari] : [];
      var list = [];
      rows.forEach(function (r) {
        var mulai = alatNormJam(r.mulai), selesai = alatNormJam(r.selesai);
        var mapel = String(r.mapel || "").replace(/\s+/g, " ").trim();
        if (!mapel) return;
        if (mulai === null || selesai === null || selesai <= mulai) {
          peringatan.push(T("parser.skipTime", { day: dayLabel(dIdx), subject: mapel }));
          return;
        }
        var tipe = "pelajaran";
        if (r.tipe === "istirahat" || r.tipe === "upacara" || r.tipe === "pelajaran") tipe = r.tipe;
        else if (/istirahat|break/i.test(mapel)) tipe = "istirahat";
        else if (/upacara|assembly|ceremony/i.test(mapel)) tipe = "upacara";

        var jk = String(r.jam_ke == null ? "" : r.jam_ke).trim();
        if (!/^\d+$/.test(jk)) jk = "";
        if (tipe !== "pelajaran") jk = (/^\d+$/.test(jk) ? jk : "");

        list.push({ jamKe: jk, mulai: mulai, selesai: selesai, mapel: mapel, tipe: tipe });
      });
      if (list.length) {
        /* Lessons without a period number from the AI -> number them by time */
        var terpakai = new Set();
        list.forEach(function (r) { if (/^\d+$/.test(r.jamKe)) terpakai.add(parseInt(r.jamKe, 10)); });
        var urut = list.slice().sort(function (a, b) { return jamKeMenit(a.mulai) - jamKeMenit(b.mulai); });
        var next = 1;
        urut.forEach(function (r) {
          if (r.tipe === "pelajaran" && !/^\d+$/.test(r.jamKe)) {
            while (terpakai.has(next)) next++;
            r.jamKe = String(next);
            terpakai.add(next);
          }
        });
        hasil[dIdx] = list;
      }
    });
    var hariAda = Object.keys(hasil).map(function (k) { return parseInt(k, 10); })
      .sort(function (a, b) { return a - b; });
    return { hasil: hasil, hariAda: hariAda, peringatan: peringatan };
  }

  /* Gemini free tier via Google AI Studio (aistudio.google.com/apikey) */
  var ALAT_AI_MODELS = ["gemini-2.5-flash", "gemini-2.5-flash-lite"];
  var alatParsedTerakhir = null;

  function alatScanAI(file, instruksi, apiKey, statusEl, btnAi, onOk) {
    if (!apiKey) {
      statusEl.style.color = "var(--amber-500)";
      statusEl.textContent = T("ai.noKey");
      return;
    }
    if (!file) {
      statusEl.style.color = "var(--amber-500)";
      statusEl.textContent = T("ai.noFile");
      return;
    }
    if (file.size > 14 * 1024 * 1024) {
      statusEl.style.color = "var(--amber-500)";
      statusEl.textContent = T("ai.tooBig", { mb: Math.round(file.size / 1048576) });
      return;
    }

    btnAi.disabled = true;
    statusEl.style.color = "var(--text-muted)";
    statusEl.textContent = T("ai.reading");

    var reader = new FileReader();
    reader.onerror = function () {
      btnAi.disabled = false;
      statusEl.textContent = T("ai.readFail");
    };
    reader.onload = function (ev) {
      var dataUrl = String(ev.target.result);
      var isPdf = /application\/pdf/i.test(file.type || "") || /\.pdf$/i.test(file.name || "");
      var prompt =
        "You are a converter that turns school class-schedule documents (tables, messy PDF-extracted text, or photos) into JSON. " +
        "Extract the schedule from this document. " +
        (instruksi ? "User instruction (MUST be followed, e.g. pick the mentioned class/grade): " + instruksi + "\n" : "\n") +
        "Output rules:\n" +
        "1. Reply with VALID JSON ONLY, no other text, no markdown. Exact shape:\n" +
        '{"jadwal":{"Monday":[{"jam_ke":"1","mulai":"07:00","selesai":"07:40","mapel":"Mathematics","tipe":"pelajaran"}]},"catatan":"one sentence"}\n' +
        "2. The jadwal object MUST exist and contain ENGLISH day names: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday. Empty days may be omitted.\n" +
        "3. Every row MUST have mulai & selesai in HH:MM (24-hour) format. Clean up messy data.\n" +
        "4. If the table only has period numbers (jam_ke) without times, reconstruct them: lesson 1 starts at 07:00, each lesson is 40 minutes, a 15-minute break after the 3rd lesson, no overlaps.\n" +
        '5. If a cell contains a time range (e.g. "07.00-07.40" or "07:00 to 07:40"), split it into mulai "07:00" and selesai "07:40".\n' +
        '6. tipe is only "pelajaran" (lesson), "istirahat" (break), or "upacara" (assembly). Write subject names cleanly (e.g. "MATH" becomes "Mathematics" when obvious).\n' +
        '7. jam_ke = the lesson period number (string); for breaks/assemblies "" is allowed.\n' +
        "8. PDF-extracted text is often scrambled (columns overlap, order broken). STILL TRY to map its rows into the format above.\n" +
        '9. ONLY if the document truly contains no schedule, reply {"jadwal":{},"catatan":"short reason"}.\n';

      /* Native Gemini format: inline_data accepts images AND PDFs (base64). */
      var dataB64 = String(dataUrl).slice(String(dataUrl).indexOf(",") + 1);
      var mime = isPdf ? "application/pdf" : (file.type || "image/png");
      var body = {
        contents: [{
          role: "user",
          parts: [
            { text: prompt },
            { inline_data: { mime_type: mime, data: dataB64 } }
          ]
        }],
        generationConfig: { temperature: 0.1, responseMimeType: "application/json" }
      };

      /* --- tidy the AI response before normalization --- */
      function rapikan(obj) {
        if (!obj || typeof obj !== "object") return null;
        var HARI = ["senin", "selasa", "rabu", "kamis", "jumat", "sabtu", "minggu", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
        var jadwal = obj.jadwal || obj.schedule || obj.hari || null;
        if (!jadwal) {
          var ketemu = false, tmp = {};
          Object.keys(obj).forEach(function (k) {
            if (HARI.indexOf(String(k).toLowerCase().trim()) !== -1) { tmp[k] = obj[k]; ketemu = true; }
          });
          if (!ketemu) return null;
          jadwal = tmp;
        }
        var out = { jadwal: {}, catatan: obj.catatan || obj.note || "" };
        Object.keys(jadwal).forEach(function (hari) {
          var rows = jadwal[hari];
          if (!Array.isArray(rows)) {
            if (rows && typeof rows === "object") rows = Object.keys(rows).map(function (k) { return rows[k]; });
            else rows = [];
          }
          out.jadwal[hari] = rows.map(function (r0) {
            var r = {};
            if (Array.isArray(r0)) { r.mulai = r0[0]; r.selesai = r0[1]; r.mapel = r0[2]; r.jam_ke = r0[3]; r.tipe = r0[4]; return r; }
            if (!r0 || typeof r0 !== "object") return r;
            Object.keys(r0).forEach(function (k0) {
              var k = String(k0).toLowerCase().trim();
              if (k === "mata_pelajaran" || k === "matpel" || k === "subject" || k === "pelajaran" || k === "asignatura" || k === "mati\u00e8re" || k === "fach" || k === "\u79d1\u76ee" || k === "\uacfc\ubaa9") k = "mapel";
              if (k === "jam" || k === "waktu" || k === "jam_mulai_selesai" || k === "time" || k === "horaire" || k === "\u6642\u9593") k = "waktu";
              if (k === "jamke" || k === "jam ke" || k === "jam ke-" || k === "no" || k === "period" || k === "periodo" || k === "stunde") k = "jam_ke";
              if (k === "start" || k === "dari" || k === "inicio" || k === "d\u00e9but" || k === "beginn" || k === "\u958b\u59cb") k = "mulai";
              if (k === "end" || k === "sampai" || k === "fin" || k === "fim" || k === "ende" || k === "\u7d42\u4e86") k = "selesai";
              r[k] = r0[k0];
            });
            if (r.waktu && (!r.mulai || !r.selesai)) {
              var wm = String(r.waktu).match(/(\d{1,2})[.:](\d{2})\D+(\d{1,2})[.:](\d{2})/);
              if (wm) { r.mulai = wm[1] + ":" + wm[2]; r.selesai = wm[3] + ":" + wm[4]; }
            }
            var jkM = String(r.jam_ke == null ? "" : r.jam_ke).match(/\d+/);
            if ((!r.mulai || !r.selesai) && jkM) {
              var n = parseInt(jkM[0], 10);
              var mn = 7 * 60 + (n - 1) * 40 + (n >= 4 ? 15 : 0);
              r.mulai = r.mulai || Math.floor(mn / 60) + ":" + ("0" + (mn % 60)).slice(-2);
              r.selesai = r.selesai || Math.floor((mn + 40) / 60) + ":" + ("0" + ((mn + 40) % 60)).slice(-2);
            }
            return r;
          });
        });
        return out;
      }

      var i = 0, lastErr = T("ai.unknownErr"), gagalKosong = "";
      function coba() {
        if (i >= ALAT_AI_MODELS.length) {
          btnAi.disabled = false;
          if (gagalKosong) {
            statusEl.style.color = "var(--amber-500)";
            statusEl.textContent = T("ai.empty", { note: gagalKosong }) +
              (isPdf ? " " + T("ai.emptyPdf") : " " + T("ai.emptyImg"));
          } else {
            statusEl.style.color = "#fda4a4";
            statusEl.textContent = T("ai.failed", { err: lastErr });
          }
          return;
        }
        var model = ALAT_AI_MODELS[i++];
        statusEl.textContent = T("ai.mapping", { model: model });
        fetch("https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey
          },
          body: JSON.stringify(body)
        }).then(function (res) {
          return res.json().then(function (data) { return { ok: res.ok, status: res.status, data: data }; });
        }).then(function (r) {
          if (!r.ok) {
            var msg = (r.data && r.data.error && r.data.error.message) || ("HTTP " + r.status);
            if (r.status === 429) msg = T("ai.quota");
            else if (r.status === 400 || r.status === 413) {
              var emsg = String((r.data && r.data.error && r.data.error.message) || "");
              msg = /size|too large|payload|bytes/i.test(emsg)
                ? T("ai.tooLargeReq")
                : T("ai.rejected", { msg: emsg || "check your Google AI Studio key" });
            }
            else if (r.status === 401 || r.status === 403) msg = T("ai.badKey");
            lastErr = msg;
            coba();
            return;
          }
          var cands = r.data && r.data.candidates, parts = (cands && cands[0] && cands[0].content && cands[0].content.parts) || [];
          var text = parts.map(function (p) { return (p && typeof p.text === "string") ? p.text : ""; }).join("\n");
          text = String(text).replace(/^```(?:json)?/i, "").replace(/```\s*$/, "").trim();
          var a = text.indexOf("{"), b = text.lastIndexOf("}");
          if (a === -1 || b <= a) { lastErr = T("ai.noJson"); coba(); return; }
          var obj;
          try { obj = JSON.parse(text.slice(a, b + 1)); }
          catch (e) { lastErr = T("ai.noJson"); coba(); return; }
          var rapi = rapikan(obj);
          var parsed = alatNormalisasiAI(rapi || obj);
          if (parsed.hariAda.length === 0) {
            gagalKosong = (obj && obj.catatan) ? obj.catatan : "The document may be empty or cut off.";
            coba();
            return;
          }
          btnAi.disabled = false;
          statusEl.style.color = "var(--teal-400)";
          statusEl.textContent = T("ai.mapped", { note: (rapi && rapi.catatan) ? " \u2014 " + rapi.catatan + " " : " " });
          onOk(parsed);
        }).catch(function (e) {
          lastErr = (e && e.message) || "network error";
          coba();
        });
      }
      coba();
    };
    reader.readAsDataURL(file);
  }


  function alatRenderPreview(parsed) {
    var wrap = document.getElementById("alat-preview");
    if (!wrap) return;
    wrap.innerHTML = "";
    if (parsed.hariAda.length === 0) {
      var p0 = document.createElement("p");
      p0.className = "form-error";
      p0.textContent = T("tools.noRows");
      wrap.appendChild(p0);
    }
    parsed.hariAda.forEach(function (d) {
      var title = document.createElement("p");
      title.style.cssText = "margin:10px 0 4px;font-weight:700;font-size:13px;color:var(--teal-400)";
      title.textContent = T("tools.previewTitle", { day: dayLabel(d), n: parsed.hasil[d].length });
      wrap.appendChild(title);
      var ul = document.createElement("ul");
      ul.style.cssText = "list-style:none;margin:0;padding:0";
      parsed.hasil[d].forEach(function (r) {
        var li = document.createElement("li");
        li.style.cssText = "font-size:12.5px;color:var(--text-muted);padding:2px 0";
        li.textContent = r.mulai + "-" + r.selesai + " \u00b7 " + r.mapel + (r.jamKe ? " (" + T("status.period", { n: r.jamKe }) + ")" : (r.tipe !== "pelajaran" ? " " + T("tools.auto") : ""));
        ul.appendChild(li);
      });
      wrap.appendChild(ul);
    });
    if (parsed.peringatan.length) {
      var w = document.createElement("p");
      w.style.cssText = "margin:10px 0 0;font-size:12px;color:var(--amber-500)";
      w.textContent = T("tools.skipped", { n: parsed.peringatan.length, details: parsed.peringatan.slice(0, 5).join(" ") });
      wrap.appendChild(w);
    }
  }

  function alatBukaModal() {
    if (document.getElementById("modal-alat")) return;

    var overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.id = "modal-alat";

    var modal = document.createElement("div");
    modal.className = "modal";

    var head = document.createElement("div");
    head.className = "modal-head";
    var h2 = document.createElement("h2"); h2.textContent = T("tools.title");
    var close = document.createElement("button");
    close.className = "icon-btn"; close.textContent = "\u00d7";
    close.onclick = function () { overlay.remove(); };
    head.appendChild(h2); head.appendChild(close);

    /* --- Active school days --- */
    var fHari = document.createElement("div");
    fHari.className = "field";
    var lblHari = document.createElement("label");
    lblHari.textContent = T("tools.activeDays");
    var boxHari = document.createElement("div");
    boxHari.style.cssText = "display:flex;flex-wrap:wrap;gap:10px";
    [0, 1, 2, 3, 4, 5, 6].forEach(function (d) {
      var lab = document.createElement("label");
      lab.style.cssText = "display:flex;align-items:center;gap:5px;font-size:13px;cursor:pointer";
      var cb = document.createElement("input");
      cb.type = "checkbox"; cb.value = d;
      cb.checked = hariAktif.indexOf(d) !== -1;
      cb.style.accentColor = "rgb(var(--accent-rgb))";
      lab.appendChild(cb);
      lab.appendChild(document.createTextNode(dayLabel(d)));
      boxHari.appendChild(lab);
    });
    fHari.appendChild(lblHari); fHari.appendChild(boxHari);

    /* --- Paste a schedule manually --- */
    var fPaste = document.createElement("div");
    fPaste.className = "field";
    var lblPaste = document.createElement("label");
    lblPaste.textContent = T("tools.pasteLabel");
    var ta = document.createElement("textarea");
    ta.id = "alat-input"; ta.rows = 8;
    ta.placeholder = T("tools.pastePh");
    ta.style.cssText = "width:100%;padding:11px 12px;border-radius:var(--radius-sm);border:1px solid var(--line);background-color:var(--navy-700);color:var(--text);font-family:inherit;font-size:13px;resize:vertical;box-sizing:border-box";
    fPaste.appendChild(lblPaste); fPaste.appendChild(ta);

    /* --- Format hint: collapsible with slide animation --- */
    var hintWrap = document.createElement("div");
    hintWrap.className = "alat-cara";

    var hintBtn = document.createElement("button");
    hintBtn.type = "button";
    hintBtn.className = "alat-cara-btn";
    hintBtn.setAttribute("aria-expanded", "false");
    hintBtn.innerHTML = "<span>" + T("tools.howTitle") + "</span><i class=\"alat-cara-chev\">\u25be</i>";

    var hintBody = document.createElement("div");
    hintBody.className = "alat-cara-body";
    hintBody.innerHTML = T("tools.howHtml");

    hintBtn.onclick = function () {
      var buka = hintWrap.classList.toggle("is-open");
      hintBtn.setAttribute("aria-expanded", buka ? "true" : "false");
    };

    hintWrap.appendChild(hintBtn);
    hintWrap.appendChild(hintBody);
    fPaste.appendChild(hintWrap);

    /* --- AI: PDF/image → schedule --- */
    var fAi = document.createElement("div");
    fAi.className = "field";
    var lblAi = document.createElement("label");
    lblAi.textContent = T("tools.aiLabel");
    var aiRow = document.createElement("div");
    aiRow.style.cssText = "display:flex;gap:8px;flex-wrap:wrap;align-items:center";
    var fileAi = document.createElement("input");
    fileAi.type = "file";
    fileAi.accept = ".pdf,image/*";
    fileAi.style.cssText = "flex:1;min-width:0;font-size:12px";
    var insAi = document.createElement("input");
    insAi.type = "text";
    insAi.placeholder = T("tools.aiPh");
    insAi.style.cssText = "flex:2;min-width:0;padding:9px 11px;border-radius:var(--radius-sm);border:1px solid var(--line);background-color:var(--navy-700);color:var(--text);font-family:inherit;font-size:12.5px";
    aiRow.appendChild(fileAi); aiRow.appendChild(insAi);
    fAi.appendChild(lblAi); fAi.appendChild(aiRow);
    var keyAi = document.createElement("input");
    keyAi.type = "password";
    keyAi.placeholder = T("tools.keyPh");
    var keyTersimpan = "";
    keyAi.value = "";
    encGet("geminiKey").then(function (v) {
      keyTersimpan = v || "";
      if (document.activeElement !== keyAi) keyAi.value = keyTersimpan;
      alatStatusKey();
    });
    keyAi.style.cssText = "width:100%;box-sizing:border-box;padding:9px 11px;border-radius:var(--radius-sm);border:1px solid var(--line);background-color:var(--navy-700);color:var(--text);font-family:inherit;font-size:12.5px;margin-top:8px";
    fAi.appendChild(keyAi);

    var btnRow = document.createElement("div");
    btnRow.style.cssText = "display:flex;gap:8px;margin-top:8px;align-items:center;justify-content:space-between";

    var btnSaveKey = document.createElement("button");
    btnSaveKey.type = "button";
    btnSaveKey.className = "btn btn-ghost btn-sm";
    btnSaveKey.textContent = T("tools.saveKey");

    var btnAi = document.createElement("button");
    btnAi.type = "button";
    btnAi.className = "btn btn-ghost btn-sm";
    btnAi.textContent = T("tools.scan");

    btnRow.appendChild(btnSaveKey);
    btnRow.appendChild(btnAi);
    fAi.appendChild(btnRow);

    var aiStatus = document.createElement("p");
    aiStatus.style.cssText = "margin:6px 0 0;font-size:11.5px;color:var(--text-muted)";
    function alatStatusKey() {
      if (keyTersimpan) {
        aiStatus.textContent = T("tools.keyStored", { last4: keyTersimpan.slice(-4) });
        aiStatus.style.color = "var(--teal-400)";
      } else {
        aiStatus.textContent = T("tools.keyFree");
        aiStatus.style.color = "var(--text-muted)";
      }
    }
    alatStatusKey();
    fAi.appendChild(aiStatus);

    function alatSimpanKey() {
      var kunci = keyAi.value.trim();
      if (kunci) {
        keyTersimpan = kunci;
        encPut("geminiKey", kunci);
        alatStatusKey();
        showToast(T("misc.keySaved"));
      } else if (keyTersimpan) {
        if (!confirm(T("misc.confirmKeyDelete"))) return;
        keyTersimpan = "";
        encDel("geminiKey");
        keyAi.value = "";
        alatStatusKey();
        showToast(T("misc.keyRemoved"));
      } else {
        showToast(T("misc.keyEmpty"));
      }
    }
    btnSaveKey.onclick = alatSimpanKey;
    keyAi.addEventListener("keydown", function (e) {
      if (e.key === "Enter") { e.preventDefault(); alatSimpanKey(); }
    });

    var preview = document.createElement("div");
    preview.id = "alat-preview";

    var actions = document.createElement("div");
    actions.className = "modal-actions";

    var btnPreview = document.createElement("button");
    btnPreview.className = "btn btn-ghost"; btnPreview.textContent = T("tools.preview");
    btnPreview.onclick = function () {
      alatParsedTerakhir = alatParse(ta.value, hariDipilih);
      alatRenderPreview(alatParsedTerakhir);
    };

    var btnImport = document.createElement("button");
    btnImport.className = "btn btn-primary"; btnImport.textContent = T("tools.import");
    btnImport.onclick = function () {
      var dipilih = [];
      var hilangHari = [];
      boxHari.querySelectorAll("input[type=checkbox]").forEach(function (cb) {
        var d = parseInt(cb.value, 10);
        if (cb.checked) dipilih.push(d);
        else if (JADWAL[d] && JADWAL[d].length > 0) hilangHari.push(d);
      });
      if (dipilih.length === 0) { showToast(T("tools.minDay")); return; }

      /* WARNING: days that already have schedules will be deactivated */
      if (hilangHari.length > 0) {
        var daftar = hilangHari.map(function (d) {
          return dayLabel(d) + " (" + JADWAL[d].length + ")";
        }).join(", ");
        var yakin = confirm(T("tools.deactivateWarn", { days: daftar }));
        if (!yakin) {
          boxHari.querySelectorAll("input[type=checkbox]").forEach(function (cb) {
            if (hilangHari.indexOf(parseInt(cb.value, 10)) !== -1) cb.checked = true;
          });
          return;
        }
      }

      var parsed = alatParsedTerakhir || alatParse(ta.value, hariDipilih);
      hariAktif = dipilih;
      simpanHariAktif();

      if (parsed.hariAda.length === 0) {
        refreshSemua(); overlay.remove();
        showToast(T("tools.savedNoRows"));
        return;
      }
      /* WARNING: days about to be OVERWRITTEN (they already have schedules) */
      var ketimpa = parsed.hariAda.filter(function (d) {
        return JADWAL[d] && JADWAL[d].length > 0;
      });
      if (ketimpa.length > 0) {
        var daftarTimpa = ketimpa.map(function (d) {
          return T("tools.rows", { day: dayLabel(d), old: JADWAL[d].length, new: parsed.hasil[d].length });
        }).join("\n");
        var yakinTimpa = confirm(T("tools.overwriteWarn", { list: daftarTimpa }));
        if (!yakinTimpa) return;
      }


      parsed.hariAda.forEach(function (d) { JADWAL[d] = parsed.hasil[d]; });
      simpanJadwal();
      refreshSemua();
      overlay.remove();
      showToast(T("tools.imported", { days: parsed.hariAda.map(function (d) { return dayLabel(d); }).join(", ") }));
    };

    actions.appendChild(btnPreview); actions.appendChild(btnImport);

    modal.appendChild(head);
    modal.appendChild(fHari);
    modal.appendChild(fPaste);
    modal.appendChild(fAi);
    modal.appendChild(preview);
    modal.appendChild(actions);
    overlay.appendChild(modal);

    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) overlay.remove();
    });
    document.body.appendChild(overlay);

    /* AI results become invalid when their source changes */
    ta.addEventListener("input", function () { alatParsedTerakhir = null; });
    fileAi.addEventListener("change", function () { alatParsedTerakhir = null; });

    btnAi.onclick = function () {
      var kunci = keyAi.value.trim() || keyTersimpan;
      alatScanAI(fileAi.files[0], insAi.value.trim(), kunci, aiStatus, btnAi, function (parsed) {
        alatParsedTerakhir = parsed;
        alatRenderPreview(parsed);
      });
    };
  }

  function mulaiAlat() {
    if (document.getElementById("btn-alat-jadwal")) return;
    var btn = document.createElement("button");
    btn.id = "btn-alat-jadwal";
    btn.className = "btn btn-ghost btn-sm";
    btn.textContent = T("tools.btn");
    btn.onclick = alatBukaModal;
    if (el.btnTambahJadwal && el.btnTambahJadwal.parentNode) {
      /* Put Tools beside the + Add button in one action row */
      var baris = document.createElement("div");
      baris.className = "panel-head-actions";
      el.btnTambahJadwal.parentNode.insertBefore(baris, el.btnTambahJadwal);
      baris.appendChild(btn);
      baris.appendChild(el.btnTambahJadwal);
    } else {
      btn.style.cssText = "position:fixed;right:14px;bottom:14px;z-index:40";
      document.body.appendChild(btn);
    }
  }


})();

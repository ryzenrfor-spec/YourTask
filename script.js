(function () {
  "use strict";

  /* --- LOCAL CONFIGURATION --- */
  var STORAGE_KEY = "yourtask_tugas_v1";
  var SCHEDULE_KEY = "yourtask_jadwal_v1";
  var USER_KEY = "yourtask_username";
  var SCHOOL_KEY = "yourtask_school";
  var TZ = "Asia/Jakarta";

  var NAMA_HARI = { 0: "Minggu", 1: "Senin", 2: "Selasa", 3: "Rabu", 4: "Kamis", 5: "Jumat", 6: "Sabtu" };

  /* --- STATE & ELEMEN --- */
  var tugasList = [];
  var JADWAL = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
  var currentUsername = "";
  var currentSchool = "";
  var filterAktif = "aktif";
  var hariDipilih = null;
  var notifDiizinkan = false;
  var toastTimer = null;
  var selectedScheduleIndex = null;
  var hariAktif = [1, 2, 3, 4, 5, 6];

  var el = {};
  function grab() {
    if (navigator.storage && navigator.storage.persist) {
      navigator.storage.persist().then(function(persistent) {
        if (persistent) {
          console.log("Storage aman: Mode Persistent aktif.");
        } else {
          console.log("Storage berjalan di mode standar.");
        }
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
  }

  /* --- MIRROR KE INDEXEDDB (dibaca oleh Service Worker) --- */
  var IDB_NAME = "yourtask-db-v1";
  var IDB_STORE = "state";

  function openStateDB() {
    return new Promise(function (resolve, reject) {
      var req = indexedDB.open(IDB_NAME, 1);
      req.onupgradeneeded = function () {
        req.result.createObjectStore(IDB_STORE, { keyPath: "key" });
      };
      req.onsuccess = function () { resolve(req.result); };
      req.onerror = function () { reject(req.error); };
    });
  }

  function idbPut(key, value) {
    return openStateDB().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(IDB_STORE, "readwrite");
        tx.objectStore(IDB_STORE).put({ key: key, value: value });
        tx.oncomplete = function () { db.close(); resolve(); };
        tx.onerror = function () { db.close(); reject(tx.error); };
      });
    }).catch(function (e) { console.warn("Gagal mirror ke IndexedDB:", e); });
  }

  function mirrorStateToIDB() {
    idbPut("tasks", tugasList);
    idbPut("schedule", JADWAL);
  }

  /* --- LOAD & SAVE DATA --- */
  function muatProfil() {
    try {
      var savedUser = localStorage.getItem(USER_KEY);
      var savedSchool = localStorage.getItem(SCHOOL_KEY);

      if (savedUser !== null && savedUser.trim() !== "") {
        currentUsername = savedUser;
      } else {
        currentUsername = "Pengguna Baru";
        localStorage.setItem(USER_KEY, currentUsername);
      }
      if (el.displayUser) el.displayUser.textContent = currentUsername;

      if (savedSchool !== null && savedSchool.trim() !== "") {
        currentSchool = savedSchool;
      } else {
        currentSchool = "Asal Sekolah";
        localStorage.setItem(SCHOOL_KEY, currentSchool);
      }
      if (el.displaySekolah) el.displaySekolah.textContent = currentSchool;

    } catch (e) {
      console.error("Gagal memuat profil", e);
    }
  }

  function muatJadwal() {
    try {
      var raw = localStorage.getItem(SCHEDULE_KEY);
      if (raw) {
        JADWAL = JSON.parse(raw);
      } else {
        JADWAL = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
      }
    } catch (e) {
      JADWAL = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
      localStorage.removeItem(SCHEDULE_KEY);
    }
  }

  function simpanJadwal() {
    try {
      for (var i = 1; i <= 6; i++) {
        if (JADWAL[i]) JADWAL[i] = urutkanJadwal(JADWAL[i]);
      }
      localStorage.setItem(SCHEDULE_KEY, JSON.stringify(JADWAL));
      mirrorStateToIDB();
    } catch (e) {}
  }
  
  function muatTugas() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      tugasList = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(tugasList)) tugasList = [];
    } catch (e) {
      tugasList = [];
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  function simpanTugas() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tugasList));
      mirrorStateToIDB();
    } catch (e) {}
  }

  function populateJamKeOptions(selectElement, dayIndex, currentJamKe, allowEmpty) {
    if (!selectElement) return;
    selectElement.innerHTML = "";
    if (allowEmpty) {
      var o0 = document.createElement("option");
      o0.value = "";
      o0.textContent = "— Otomatis (sesuai urutan waktu) —";
      selectElement.appendChild(o0);
    } else {
      selectElement.innerHTML = '<option value="">— Pilih Jam Ke (1-100) —</option>';
    }
    var usedJamKe = new Set();
    var hariList = JADWAL[dayIndex] || [];

    hariList.forEach(function(item, idx) {
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
        opt.textContent = "Jam ke-" + i;
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
      hariAktif: hariAktif
    };
    var blob = new Blob([JSON.stringify(dataExport, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'YourTask_Backup_' + Date.now() + '.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  function importData(e) {
    var file = e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(ev) {
      try {
        var parsed = JSON.parse(ev.target.result);
        if (parsed.tugas) localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed.tugas));
        if (parsed.jadwal) localStorage.setItem(SCHEDULE_KEY, JSON.stringify(parsed.jadwal));
        if (parsed.username) localStorage.setItem(USER_KEY, parsed.username);
        if (parsed.sekolah) localStorage.setItem(SCHOOL_KEY, parsed.sekolah);
        if (parsed.hariAktif) localStorage.setItem("yourtask_hari_aktif", JSON.stringify(parsed.hariAktif));

        showToast("Data berhasil di-restore! Memuat ulang...");
        setTimeout(function() { location.reload(); }, 1200);
      } catch (err) {
        showToast("Waduh, file JSON-nya tidak valid atau rusak.");
      }
    };
    reader.readAsText(file);
  }
  
  function nowWIB() {
    var parts = new Intl.DateTimeFormat("id-ID", {
      timeZone: TZ, weekday: "long", year: "numeric", month: "2-digit",
      day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
    }).formatToParts(new Date());

    var map = {};
    parts.forEach(function (p) { map[p.type] = p.value; });

    var dayIndex = 0;
    for (var i = 0; i < 7; i++) {
      if (NAMA_HARI[i].toLowerCase() === (map.weekday || "").toLowerCase()) {
        dayIndex = i; break;
      }
    }
    var jam = parseInt(map.hour, 10);
    if (jam === 24) jam = 0;

    return {
      dayIndex: dayIndex, hari: NAMA_HARI[dayIndex], jam: jam,
      menit: parseInt(map.minute, 10), detik: parseInt(map.second, 10),
      tanggal: parseInt(map.day, 10), bulan: map.month, tahun: parseInt(map.year, 10),
      totalMenit: jam * 60 + parseInt(map.minute, 10),
    };
  }

  function jamKeMenit(hhmm) {
    var b = (hhmm||"00:00").split(":");
    return parseInt(b[0], 10) * 60 + parseInt(b[1], 10);
  }
  function pad(n) { return n < 10 ? "0" + n : "" + n; }

  /* Urutan otomatis: baris dgn jamKe diurutkan per nomor jamKe lalu waktu.
     Baris TANPA jamKe (istirahat dll.) disisipkan tepat di antara dua pelajaran
     yang waktunya mengapitnya. Contoh: istirahat 08:00 muncul persis
     setelah Matematika 07:15-08:00, sebelum pelajaran 08:20. */
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

  function tickJam() {
    var n = nowWIB();
    if (el.jam) el.jam.textContent = pad(n.jam) + ":" + pad(n.menit) + ":" + pad(n.detik);
    if (el.hari) el.hari.textContent = n.hari + ", " + pad(n.tanggal) + "/" + n.bulan + "/" + n.tahun;
  }
  
  function updateStatusKBM() {
    if (!el.cardStatus) return;
    var n = nowWIB();
    var jadwalHari = (hariAktif.indexOf(n.dayIndex) !== -1 ? JADWAL[n.dayIndex] : null) || null;

    el.cardStatus.classList.remove("is-active");
    if (el.progWrap) el.progWrap.hidden = true;
    if (el.statusNext) el.statusNext.textContent = "";

    if (!jadwalHari || jadwalHari.length === 0) {
      if (el.statusLabel) el.statusLabel.textContent = "Libur / Kosong";
      if (el.statusJamKe) el.statusJamKe.textContent = "";
      if (el.statusMapel) el.statusMapel.textContent = "Tidak Ada Jadwal";
      if (el.statusDetail) el.statusDetail.textContent = "Belum ada jadwal untuk hari " + n.hari + ".";
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
        if (el.statusLabel) el.statusLabel.textContent = "Sedang Berlangsung";
      } else {
        if (el.statusLabel) el.statusLabel.textContent = "Istirahat";
      }

      if (el.statusJamKe) el.statusJamKe.textContent = slotAktif.jamKe ? "Jam ke-" + slotAktif.jamKe : "";
      if (el.statusMapel) el.statusMapel.textContent = slotAktif.mapel;
      if (el.statusDetail) el.statusDetail.textContent = "Pukul " + slotAktif.mulai + " – " + slotAktif.selesai + " WIB";

      var m1a = jamKeMenit(slotAktif.mulai);
      var m2a = jamKeMenit(slotAktif.selesai);
      var totalDur = m2a - m1a;
      var lewat = sekarang - m1a;
      var persen = totalDur > 0 ? Math.min(100, Math.round((lewat / totalDur) * 100)) : 0;
      var sisa = Math.max(0, m2a - sekarang);

      if (el.progWrap) el.progWrap.hidden = false;
      if (el.progFill) el.progFill.style.width = persen + "%";
      if (el.progText) el.progText.textContent = "sisa " + sisa + " mnt";

      if (slotBerikut && el.statusNext) {
        el.statusNext.innerHTML = "Berikutnya: <strong>" + escapeHtml(slotBerikut.mapel) + "</strong> (" + slotBerikut.mulai + ")";
      }
      return;
    }

    if (el.statusLabel) el.statusLabel.textContent = "Luar Jam KBM";
    if (el.statusMapel) el.statusMapel.textContent = "Tidak Ada KBM";
    if (el.statusJamKe) el.statusJamKe.textContent = "";

    var jamPertama = jadwalHari[0];
    var jamTerakhir = jadwalHari[jadwalHari.length - 1];

    if (sekarang < jamKeMenit(jamPertama.mulai)) {
      if (el.statusDetail) el.statusDetail.textContent = "Belum ada KBM. Dimulai pukul " + jamPertama.mulai + " WIB.";
      if (el.statusNext) el.statusNext.innerHTML = "Pelajaran pertama: <strong>" + escapeHtml(jamPertama.mapel) + "</strong> (" + jamPertama.mulai + ")";
    } else if (sekarang >= jamKeMenit(jamTerakhir.selesai)) {
      if (el.statusDetail) el.statusDetail.textContent = "KBM hari ini sudah selesai.";
      renderStatusNextHariLain(n.dayIndex);
    } else {
      if (el.statusDetail) el.statusDetail.textContent = "Di luar jam pelajaran.";
      if (slotBerikut && el.statusNext) {
        el.statusNext.innerHTML = "Berikutnya: <strong>" + escapeHtml(slotBerikut.mapel) + "</strong> (" + slotBerikut.mulai + ")";
      }
    }
  }

  function renderStatusNextHariLain(fromDayIndex) {
    for (var add = 1; add <= 7; add++) {
      var d = (fromDayIndex + add) % 7;
      if (hariAktif.indexOf(d) === -1) continue;
      if (JADWAL[d] && JADWAL[d].length > 0) {
        var label = add === 1 ? "Besok (" + NAMA_HARI[d] + ")" : NAMA_HARI[d];
        var first = JADWAL[d][0];
        if (el.statusNext) {
          el.statusNext.innerHTML = "KBM berikutnya: <strong>" + escapeHtml(label) + "</strong> mulai " + first.mulai + " – " + escapeHtml(first.mapel);
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
      b.textContent = NAMA_HARI[d];
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

    if(jadwalHari.length === 0) {
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
          tag.className = "schedule-now-tag"; tag.textContent = "Sekarang";
          li.appendChild(tag);
        }

        var pressTimer = null;
        function startPress() {
          clearTimeout(pressTimer);
          pressTimer = setTimeout(function () {
            selectedScheduleIndex = index;
            if ('vibrate' in navigator) navigator.vibrate(80);
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
        var label = add === 0 ? "Hari Ini" : (add === 1 ? "Besok" : "Hari " + NAMA_HARI[dayIndex]);
        return { ada: true, hariIndex: dayIndex, hari: NAMA_HARI[dayIndex], mulai: s.mulai, jamKe: s.jamKe, selisihJam: selisihJam, selisihMenit: selisihMenit, label: label };
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
      if (filterAktif === "aktif") return !t.completed;
      if (filterAktif === "selesai") return t.completed;
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
    if (el.ringkasan) el.ringkasan.textContent = total === 0 ? "Belum ada tugas" : (aktif + " tugas aktif dari " + total + " total");
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
      t.completed = !t.completed;
      simpanTugas(); renderTugas(); cekNotifikasi();
      if('vibrate' in navigator) navigator.vibrate(50);
    };

    var body = document.createElement("div"); body.className = "task-body";
    var mapel = document.createElement("span"); mapel.className = "task-mapel"; mapel.textContent = t.mapel;
    var detail = document.createElement("span"); detail.className = "task-detail"; detail.textContent = t.detail;

    var meta = document.createElement("div"); meta.className = "task-meta";
    if (t.completed) {
      meta.innerHTML = '<span class="tag tag-done">Selesai</span>';
    } else if (dl.ada) {
      var tagDl = document.createElement("span");
      tagDl.className = "tag tag-deadline";
      tagDl.textContent = dl.label + " · " + dl.mulai + (dl.jamKe ? " (Jam ke-" + dl.jamKe + ")" : "");
      meta.appendChild(tagDl);
      if (urgent) {
        var tagUrgent = document.createElement("span");
        tagUrgent.className = "tag tag-urgent";
        tagUrgent.textContent = "< 24 jam — segera!";
        meta.appendChild(tagUrgent);
      }
    } else {
      var tagNone = document.createElement("span");
      tagNone.className = "tag";
      tagNone.textContent = "Deadline tidak ditemukan";
      meta.appendChild(tagNone);
    }

    body.appendChild(mapel); body.appendChild(detail); body.appendChild(meta);
    var del = document.createElement("button"); del.className = "task-delete"; del.textContent = "Hapus";
    del.onclick = function () {
      tugasList = tugasList.filter(function (x) { return x.id !== t.id; });
      simpanTugas(); renderTugas(); cekNotifikasi(); showToast("Tugas dihapus.");
    };

    li.appendChild(check); li.appendChild(body); li.appendChild(del);
    return li;
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
      if (el.bannerTeks) el.bannerTeks.textContent = urgent[0].tugas.mapel + " (" + urgent[0].tugas.detail + ") — mapel dimulai " + urgent[0].dl.label.toLowerCase() + " pukul " + urgent[0].dl.mulai + ".";
    } else {
      if (el.bannerTeks) el.bannerTeks.textContent = urgent.length + " tugas memiliki mapel yang dimulai dalam 24 jam ke depan.";
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

        await reg.showNotification("⏰ Deadline tugas mendekat", {
          body: item.tugas.mapel + " (" + item.tugas.detail + ") — dimulai " + item.dl.label.toLowerCase() + " pukul " + item.dl.mulai + ".",
          icon: new URL("icon.png", reg.scope).href,
          tag: "yourtask-" + item.tugas.id
        });
        sessionStorage.setItem(dedupKey, "1");
      }
    } catch (e) {
      console.error("Gagal menampilkan notifikasi:", e);
    }
  }

  function isiDropdownMapel() {
    if (!el.inputMapel) return;
    var mapelSet = new Set();
    for (var h in JADWAL) {
      if (JADWAL[h]) {
        JADWAL[h].forEach(function(s) {
          if (s.tipe === "pelajaran" && s.mapel && s.mapel.trim() !== "") {
            mapelSet.add(s.mapel.trim());
          }
        });
      }
    }

    el.inputMapel.innerHTML = '<option value="">— Pilih mata pelajaran —</option>';
    var mapelArray = Array.from(mapelSet).sort();

    if (mapelArray.length === 0) {
      var opt = document.createElement("option");
      opt.value = "";
      opt.textContent = "Belum ada jadwal pelajaran (Tambahkan dulu)";
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
    if (!mapel) { el.previewDeadline.classList.remove("is-filled"); el.previewDeadline.textContent = "Pilih mapel untuk melihat deadline."; return; }
    var dl = cariDeadline(mapel);
    el.previewDeadline.classList.add("is-filled");
    if (!dl.ada) { el.previewDeadline.innerHTML = "Mapel <strong>" + escapeHtml(mapel) + "</strong> tidak ada di jadwal terdekat."; return; }
    el.previewDeadline.innerHTML = "Deadline: <strong>" + escapeHtml(dl.label) + "</strong>, pukul " + dl.mulai + (dl.jamKe ? " (Jam ke-" + dl.jamKe + ")" : "");
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
    if (!("Notification" in window)) { showToast("Browser tidak mendukung notifikasi."); return; }
    try {
      var hasil = await Notification.requestPermission();
      if (hasil === "granted") {
        notifDiizinkan = true;
        updateNotificationButton();
        showToast("Notifikasi aktif.");
        registerPeriodicSync();
        cekNotifikasi();
      } else {
        showToast("Izin notifikasi ditolak.");
      }
    } catch (e) {
      console.error("Permission error:", e);
      showToast("Gagal mengaktifkan notifikasi.");
    }
  }

  async function registerPeriodicSync() {
    try {
      var reg = await navigator.serviceWorker.ready;
      if (!("periodicSync" in reg)) {
        console.warn("Periodic Background Sync tidak didukung browser ini.");
        return;
      }
      var status = await navigator.permissions.query({ name: "periodic-background-sync" });
      if (status.state !== "granted") {
        console.warn("Periodic Background Sync belum diizinkan (PWA harus di-install ke Home Screen).");
        return;
      }
      await reg.periodicSync.register("deadline-check", { minInterval: 15 * 60 * 1000 });
      console.log("Background deadline check aktif.");
    } catch (e) {
      console.warn("Gagal daftar periodic sync:", e);
    }
  }
  
  function init() {
    grab();
    muatProfil();
    muatJadwal();
    muatTugas();
    mirrorStateToIDB();

    /* jamKe tidak lagi wajib di HTML — divalidasi manual per tipe */
    if (el.inputJadwalJamKe) el.inputJadwalJamKe.required = false;
    if (el.inputEditJamKe) el.inputEditJamKe.required = false;

    if (el.btnBackup) el.btnBackup.addEventListener("click", exportData);
    if (el.inputRestore) el.inputRestore.addEventListener("change", importData);

    var n = nowWIB();
    hariDipilih = (JADWAL[n.dayIndex] && JADWAL[n.dayIndex].length > 0) ? n.dayIndex : 1;
    if ("Notification" in window && Notification.permission === "granted") {
      notifDiizinkan = true;
      registerPeriodicSync();
    }

    isiDropdownMapel();
    tickJam();
    updateStatusKBM();
    renderTugas();
    renderTabHari();
    renderJadwalHari();
    cekNotifikasi();

    if (el.btnEditUser) {
      el.btnEditUser.addEventListener("click", function() {
        if (el.inputUsername) el.inputUsername.value = currentUsername;
        if (el.inputSekolah) el.inputSekolah.value = currentSchool;
        if (el.modalProfil) el.modalProfil.hidden = false;
      });
    }

    var btnTutupProfil = document.getElementById("btn-tutup-profil");
    if (btnTutupProfil) btnTutupProfil.addEventListener("click", function() { if (el.modalProfil) el.modalProfil.hidden = true; });

    var btnBatalProfil = document.getElementById("btn-batal-profil");
    if (btnBatalProfil) btnBatalProfil.addEventListener("click", function() { if (el.modalProfil) el.modalProfil.hidden = true; });

    if (el.formProfil) {
      el.formProfil.addEventListener("submit", function(e) {
        e.preventDefault();
        var valUser = el.inputUsername ? el.inputUsername.value.trim() : "";
        var valSchool = el.inputSekolah ? el.inputSekolah.value.trim() : "";
        if(valUser) { currentUsername = valUser; localStorage.setItem(USER_KEY, currentUsername); if (el.displayUser) el.displayUser.textContent = currentUsername; }
        if(valSchool) { currentSchool = valSchool; localStorage.setItem(SCHOOL_KEY, currentSchool); if (el.displaySekolah) el.displaySekolah.textContent = currentSchool; }
        if (el.modalProfil) el.modalProfil.hidden = true;
        showToast("Profil berhasil diperbarui!");
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
      el.inputJadwalHari.addEventListener("change", function() {
        var hariVal = parseInt(this.value, 10);
        var tipeSekarang = el.inputJadwalTipe ? el.inputJadwalTipe.value : "pelajaran";
        populateJamKeOptions(el.inputJadwalJamKe, hariVal, null, tipeSekarang !== "pelajaran");
      });
    }

    if (el.inputJadwalTipe) {
      el.inputJadwalTipe.addEventListener("change", function() {
        var hariVal = el.inputJadwalHari ? parseInt(el.inputJadwalHari.value, 10) : 1;
        populateJamKeOptions(el.inputJadwalJamKe, hariVal, null, this.value !== "pelajaran");
      });
    }

    var btnTutupJadwal = document.getElementById("btn-tutup-jadwal");
    if (btnTutupJadwal) btnTutupJadwal.addEventListener("click", function() { if (el.modalJadwal) el.modalJadwal.hidden = true; });

    var btnBatalJadwal = document.getElementById("btn-batal-jadwal");
    if (btnBatalJadwal) btnBatalJadwal.addEventListener("click", function() { if (el.modalJadwal) el.modalJadwal.hidden = true; });

    if (el.formJadwal) {
      el.formJadwal.addEventListener("submit", function(e) {
        e.preventDefault();
        var h = el.inputJadwalHari ? parseInt(el.inputJadwalHari.value, 10) : 1;
        var mulai = el.formJadwal.querySelector("#input-jadwal-mulai").value;
        var selesai = el.formJadwal.querySelector("#input-jadwal-selesai").value;
        var mapel = el.formJadwal.querySelector("#input-jadwal-mapel").value.trim();
        var tipe = el.formJadwal.querySelector("#input-jadwal-tipe").value;
        var jamKe = el.inputJadwalJamKe ? el.inputJadwalJamKe.value : "";

        if(jamKeMenit(mulai) >= jamKeMenit(selesai)) { showToast("Waktu mulai harus lebih awal!"); return; }

        var jkNum = parseInt(jamKe, 10);
        if (tipe === "pelajaran") {
          if(!jamKe || jkNum <= 0) { showToast("Jam ke- wajib dipilih untuk pelajaran!"); return; }
          var duplikat = false;
          (JADWAL[h] || []).forEach(function (x) {
            if (x.tipe === "pelajaran" && String(parseInt(x.jamKe, 10)) === String(jkNum)) duplikat = true;
          });
          if (duplikat) { showToast("Jam ke-" + jkNum + " sudah dipakai di hari itu!"); return; }
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
        updateStatusKBM();
        showToast("Jadwal ditambahkan.");
      });
    }
    
    var btnTutupAksi = document.getElementById("btn-tutup-aksi");
    if (btnTutupAksi) btnTutupAksi.addEventListener("click", function() { if (el.modalAksiJadwal) el.modalAksiJadwal.hidden = true; });

    if (el.btnAksiEdit) {
      el.btnAksiEdit.addEventListener("click", function() {
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
      el.btnAksiHapus.addEventListener("click", function() {
        if (el.modalAksiJadwal) el.modalAksiJadwal.hidden = true;
        if (selectedScheduleIndex === null || !JADWAL[hariDipilih]) return;

        if (confirm("Yakin ingin menghapus jadwal ini?")) {
          JADWAL[hariDipilih].splice(selectedScheduleIndex, 1);
          simpanJadwal();
          isiDropdownMapel();
          renderJadwalHari();
          updateStatusKBM();
          showToast("Jadwal dihapus.");
        }
        selectedScheduleIndex = null;
      });
    }

    var btnTutupEditJadwal = document.getElementById("btn-tutup-edit-jadwal");
    if (btnTutupEditJadwal) btnTutupEditJadwal.addEventListener("click", function() { if (el.modalEditJadwal) el.modalEditJadwal.hidden = true; selectedScheduleIndex = null; });

    var btnBatalEditJadwal = document.getElementById("btn-batal-edit-jadwal");
    if (btnBatalEditJadwal) btnBatalEditJadwal.addEventListener("click", function() { if (el.modalEditJadwal) el.modalEditJadwal.hidden = true; selectedScheduleIndex = null; });

    if (el.inputEditTipe) {
      el.inputEditTipe.addEventListener("change", function() {
        populateJamKeOptions(el.inputEditJamKe, hariDipilih, null, this.value !== "pelajaran");
      });
    }

    if (el.formEditJadwal) {
      el.formEditJadwal.addEventListener("submit", function(e) {
        e.preventDefault();
        if (selectedScheduleIndex === null || !JADWAL[hariDipilih]) return;

        var mulai = el.formEditJadwal.querySelector("#input-edit-mulai").value;
        var selesai = el.formEditJadwal.querySelector("#input-edit-selesai").value;
        var mapel = el.formEditJadwal.querySelector("#input-edit-mapel").value.trim();
        var tipe = el.formEditJadwal.querySelector("#input-edit-tipe").value;
        var jamKe = el.inputEditJamKe ? el.inputEditJamKe.value : "";

        if(jamKeMenit(mulai) >= jamKeMenit(selesai)) { showToast("Waktu mulai harus lebih awal!"); return; }

        var jkNum = parseInt(jamKe, 10);
        if (tipe === "pelajaran") {
          if(!jamKe || jkNum <= 0) { showToast("Jam ke- wajib dipilih untuk pelajaran!"); return; }
          var duplikat = false;
          JADWAL[hariDipilih].forEach(function (x, idx) {
            if (idx !== selectedScheduleIndex && x.tipe === "pelajaran" && String(parseInt(x.jamKe, 10)) === String(jkNum)) duplikat = true;
          });
          if (duplikat) { showToast("Jam ke-" + jkNum + " sudah dipakai di hari itu!"); return; }
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
        updateStatusKBM();
        showToast("Jadwal diperbarui.");
      });
    }

    if (el.btnBuka) {
      el.btnBuka.addEventListener("click", function() {
        if (el.form) el.form.reset();
        if (el.formError) el.formError.hidden = true;
        isiDropdownMapel();
        updatePreviewDeadline();
        if (el.overlay) el.overlay.hidden = false;
      });
    }

    var btnTutupModal = document.getElementById("btn-tutup-modal");
    if (btnTutupModal) btnTutupModal.addEventListener("click", function() { if (el.overlay) el.overlay.hidden = true; });

    var btnBatal = document.getElementById("btn-batal");
    if (btnBatal) btnBatal.addEventListener("click", function() { if (el.overlay) el.overlay.hidden = true; });

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
        if (!mapel || !detail) {
          if (el.formError) {
            el.formError.textContent = "Mohon lengkapi formulir.";
            el.formError.hidden = false;
          }
          return;
        }
        tugasList.push({ id: "t" + Date.now(), mapel: mapel, detail: detail, completed: false, dibuat: Date.now() });
        simpanTugas(); renderTugas(); cekNotifikasi();
        if (el.overlay) el.overlay.hidden = true;
        showToast("Tugas dicatat.");
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

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').catch(function(err) {});
    }

    setInterval(tickJam, 1000);
    setInterval(function () { updateStatusKBM(); if (hariDipilih === nowWIB().dayIndex) renderJadwalHari(); }, 15000);
    setInterval(function () { renderTugas(); cekNotifikasi(); }, 60000);
  }

  muatHariAktif();
  if (document.readyState === "loading") { document.addEventListener("DOMContentLoaded", init); } else { init(); }
  
  /* ====== ALAT JADWAL + HARI SEKOLAH AKTIF + AI PDF ====== */
  var HARI_KEY = "yourtask_hari_aktif";

  function muatHariAktif() {
    try {
      var raw = localStorage.getItem(HARI_KEY);
      if (raw) {
        var arr = JSON.parse(raw);
        if (Array.isArray(arr)) {
          var bersih = arr.filter(function (d) { return d >= 1 && d <= 6; })
                          .sort(function (a, b) { return a - b; });
          if (bersih.length > 0) hariAktif = bersih;
        }
      }
    } catch (e) {}
    if (!hariAktif || hariAktif.length === 0) hariAktif = [1, 2, 3, 4, 5, 6];
    if (typeof idbPut === "function") idbPut("activeDays", hariAktif);
  }

  function simpanHariAktif() {
    try { localStorage.setItem(HARI_KEY, JSON.stringify(hariAktif)); } catch (e) {}
    if (typeof idbPut === "function") idbPut("activeDays", hariAktif);
  }

  function refreshSemua() {
    selectedScheduleIndex = null;
    renderTabHari();
    renderJadwalHari();
    updateStatusKBM();
    renderTugas();
    cekNotifikasi();
  }

  var ALAT_DAY_RE = /(senin|selasa|rabu|kamis|jum[''’]?at|sabtu|minggu)/i;
  var ALAT_TIME_RE = /(\d{1,2})\s*[.:]\s*(\d{2})\s*(?:s\s*\/\s*d|s\.?\s*d\.?|sd|sampai|hingga|[-–—])?\s*(\d{1,2})\s*[.:]\s*(\d{2})/i;

  function alatHariKeIndex(word) {
    var w = String(word).toLowerCase().replace(/[''’]/g, "").trim();
    var map = { senin: 1, selasa: 2, rabu: 3, kamis: 4, jumat: 5, sabtu: 6, minggu: 0 };
    return map.hasOwnProperty(w) ? map[w] : -1;
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
        if (dIdx === 0) {
          peringatan.push("Baris " + (i + 1) + ": Minggu dilewati (Senin-Sabtu).");
          currentDay = null; lastEnd = null; lastDur = null; lastJamKe = 0;
          return;
        }
        currentDay = dIdx;
        if (!hasil[dIdx]) hasil[dIdx] = [];
        lastEnd = null; lastDur = null; lastJamKe = 0;
        return;
      }

      if (currentDay === null && fallbackDay === null) {
        peringatan.push("Baris " + (i + 1) + " dilewati: tidak ada header hari di atasnya.");
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
          peringatan.push("Baris " + (i + 1) + " dilewati: jam tidak valid.");
          return;
        }
        mulaiM = h1 * 60 + m1;
        selesaiM = (h2 === 24) ? 1440 : h2 * 60 + m2;
        if (selesaiM <= mulaiM) {
          peringatan.push("Baris " + (i + 1) + " dilewati: jam selesai <= jam mulai.");
          return;
        }
        var mJk = line.slice(0, t.index).match(/(\d{1,2})\s*(?:[|;.,\-–—]\s*)?$/);
        if (mJk) jamKe = parseInt(mJk[1], 10);
        sisa = line.slice(t.index + t[0].length);
      } else {
        if (lastEnd === null || lastDur === null) {
          peringatan.push("Baris " + (i + 1) + " dilewati: tanpa jam & tanpa acuan baris sebelumnya.");
          return;
        }
        mulaiM = lastEnd;
        selesaiM = lastEnd + lastDur;
        if (selesaiM > 1440) {
          peringatan.push("Baris " + (i + 1) + " dilewati: melewati 24:00.");
          return;
        }
        sisa = line;
      }

      var mapel = alatBersihMapel(sisa);
      if (mapel === "") {
        peringatan.push("Baris " + (i + 1) + " dilewati: nama kegiatan kosong.");
        return;
      }

      var tipe = /istirahat|break/i.test(mapel) ? "istirahat"
               : (/upacara/i.test(mapel) ? "upacara" : "pelajaran");

      /* Istirahat/upacara: jamKe opsional, tidak menambah urutan pelajaran */
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
      if (dIdx === 0) { peringatan.push("Minggu dilewati (Senin-Sabtu)."); return; }
      if (dIdx < 0) { peringatan.push('Hari "' + namaHari + '" tidak dikenal, dilewati.'); return; }
      var rows = Array.isArray(jadwal[namaHari]) ? jadwal[namaHari] : [];
      var list = [];
      rows.forEach(function (r) {
        var mulai = alatNormJam(r.mulai), selesai = alatNormJam(r.selesai);
        var mapel = String(r.mapel || "").replace(/\s+/g, " ").trim();
        if (!mapel) return;
        if (mulai === null || selesai === null || selesai <= mulai) {
          peringatan.push(NAMA_HARI[dIdx] + ': "' + mapel + '" dilewati (jam tidak valid).');
          return;
        }
        var tipe = "pelajaran";
        if (r.tipe === "istirahat" || r.tipe === "upacara" || r.tipe === "pelajaran") tipe = r.tipe;
        else if (/istirahat|break/i.test(mapel)) tipe = "istirahat";
        else if (/upacara/i.test(mapel)) tipe = "upacara";

        var jk = String(r.jam_ke == null ? "" : r.jam_ke).trim();
        if (!/^\d+$/.test(jk)) jk = "";
        if (tipe !== "pelajaran") jk = (/^\d+$/.test(jk) ? jk : "");

        list.push({ jamKe: jk, mulai: mulai, selesai: selesai, mapel: mapel, tipe: tipe });
      });
      if (list.length) {
        /* pelajaran tanpa jamKe dari AI -> beri nomor urut sesuai waktu */
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

  var ALAT_AI_KEY_STORE = "yourtask_gemini_key";
  var ALAT_AI_MODELS = ["gemini-flash-latest", "gemini-3.6-flash"];
  var alatParsedTerakhir = null;

  function alatScanAI(file, instruksi, apiKey, statusEl, btnAi, onOk) {
    if (!apiKey) {
      statusEl.style.color = "var(--amber-500)";
      statusEl.textContent = "Isi API key dulu (gratis di aistudio.google.com).";
      return;
    }
    if (!file) {
      statusEl.style.color = "var(--amber-500)";
      statusEl.textContent = "Pilih file PDF/gambar jadwal dulu.";
      return;
    }
        /* key disimpan otomatis hanya SETELAH scan berhasil & user setuju */
    
    btnAi.disabled = true;
    statusEl.style.color = "var(--text-muted)";
    statusEl.textContent = "Membaca file...";

    var mime = file.type || (/\.pdf$/i.test(file.name) ? "application/pdf" : "image/jpeg");
    var reader = new FileReader();
    reader.onerror = function () {
      btnAi.disabled = false;
      statusEl.textContent = "Gagal membaca file.";
    };
    reader.onload = function (ev) {
      var b64 = String(ev.target.result).split(",")[1] || "";
      var prompt =
        "Kamu asisten yang mengubah dokumen jadwal pelajaran sekolah menjadi JSON. " +
        "Ambil jadwal dari dokumen ini. " +
        (instruksi ? "Instruksi pengguna: " + instruksi + "\n" : "\n") +
        "Aturan:\n" +
        "1. Balas HANYA JSON valid tanpa teks lain, format persis:\n" +
        '{"jadwal":{"Senin":[{"jam_ke":"1","mulai":"07:00","selesai":"07:40","mapel":"Matematika","tipe":"pelajaran"}]},"catatan":"ringkasan"}\n' +
        "2. Kunci hari hanya Senin-Sabtu (tanpa Minggu); hari yang tidak ada di dokumen boleh dihilangkan.\n" +
        '3. tipe hanya "pelajaran", "istirahat", atau "upacara".\n' +
        '4. mulai/selesai format "HH:MM" 24 jam.\n' +
        "5. Jika jam tidak tertulis di dokumen, buat jam masuk akal: mulai 07:00, tiap pelajaran 40 menit, istirahat 15 menit setelah pelajaran ke-3.\n" +
        '6. jam_ke = nomor urut jam pelajaran (string); untuk istirahat/upacara boleh "".\n' +
        "7. catatan: satu kalimat ringkas tentang apa yang diambil (mis. kelas mana).\n" +
        "Jika dokumen memuat beberapa kelas, ikuti instruksi pengguna untuk memilih kelasnya.";

      var body = {
        contents: [{ parts: [{ text: prompt }, { inline_data: { mime_type: mime, data: b64 } }] }],
        generationConfig: { temperature: 0.1, responseMimeType: "application/json" }
      };

      var i = 0, lastErr = "tidak diketahui";
      function coba() {
        if (i >= ALAT_AI_MODELS.length) {
          btnAi.disabled = false;
          statusEl.style.color = "#fda4a4";
          statusEl.textContent = "Gagal: " + lastErr;
          return;
        }
        var model = ALAT_AI_MODELS[i++];
        statusEl.textContent = "AI sedang memetakan dokumen (" + model + ")...";
        fetch("https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent?key=" + encodeURIComponent(apiKey), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        }).then(function (res) {
          return res.json().then(function (data) { return { ok: res.ok, status: res.status, data: data }; });
        }).then(function (r) {
          if (!r.ok) {
            var msg = (r.data && r.data.error && r.data.error.message) || ("HTTP " + r.status);
            if (r.status === 429) msg = "Kuota gratis habis untuk sekarang — coba lagi nanti.";
            else if (r.status === 400 && /api key/i.test(msg)) msg = "API key tidak valid.";
            lastErr = msg;
            coba();
            return;
          }
          var cand = r.data && r.data.candidates && r.data.candidates[0];
          var text = (cand && cand.content && cand.content.parts)
            ? cand.content.parts.map(function (p) { return p.text || ""; }).join("")
            : "";
          text = text.replace(/^```(?:json)?/i, "").replace(/```\s*$/, "").trim();
          var obj;
          try { obj = JSON.parse(text); }
          catch (e) { lastErr = "AI tidak mengembalikan JSON valid."; coba(); return; }
          var parsed = alatNormalisasiAI(obj);
          btnAi.disabled = false;
          if (parsed.hariAda.length === 0) {
            statusEl.style.color = "var(--amber-500)";
            statusEl.textContent = "AI tidak menemukan baris jadwal yang bisa dipakai. " + (parsed.peringatan[0] || "");
            return;
          }
          statusEl.style.color = "var(--teal-400)";
          statusEl.textContent = "✅ Berhasil dipetakan" + (obj.catatan ? " — " + obj.catatan : " ") + " Cek pratinjau, lalu Simpan & Import.";
          onOk(parsed);
        }).catch(function (e) {
          lastErr = (e && e.message) || "jaringan error";
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
      p0.textContent = "Tidak ada baris jadwal yang berhasil dibaca. Klik Pratinjau untuk lihat alasannya.";
      wrap.appendChild(p0);
    }
    parsed.hariAda.forEach(function (d) {
      var title = document.createElement("p");
      title.style.cssText = "margin:10px 0 4px;font-weight:700;font-size:13px;color:var(--teal-400)";
      title.textContent = NAMA_HARI[d] + " — " + parsed.hasil[d].length + " baris (akan diganti)";
      wrap.appendChild(title);
      var ul = document.createElement("ul");
      ul.style.cssText = "list-style:none;margin:0;padding:0";
      parsed.hasil[d].forEach(function (r) {
        var li = document.createElement("li");
        li.style.cssText = "font-size:12.5px;color:var(--text-muted);padding:2px 0";
        li.textContent = r.mulai + "-" + r.selesai + " · " + r.mapel + (r.jamKe ? " (Jam " + r.jamKe + ")" : (r.tipe !== "pelajaran" ? " (otomatis)" : ""));
        ul.appendChild(li);
      });
      wrap.appendChild(ul);
    });
    if (parsed.peringatan.length) {
      var w = document.createElement("p");
      w.style.cssText = "margin:10px 0 0;font-size:12px;color:var(--amber-500)";
      w.textContent = "Catatan: " + parsed.peringatan.length + " baris dilewati. " + parsed.peringatan.slice(0, 5).join(" ");
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
    var h2 = document.createElement("h2"); h2.textContent = "Alat Jadwal";
    var close = document.createElement("button");
    close.className = "icon-btn"; close.textContent = "×";
    close.onclick = function () { overlay.remove(); };
    head.appendChild(h2); head.appendChild(close);

    /* --- Hari sekolah aktif --- */
    var fHari = document.createElement("div");
    fHari.className = "field";
    var lblHari = document.createElement("label");
    lblHari.textContent = "Hari sekolah aktif:";
    var boxHari = document.createElement("div");
    boxHari.style.cssText = "display:flex;flex-wrap:wrap;gap:10px";
    [1, 2, 3, 4, 5, 6].forEach(function (d) {
      var lab = document.createElement("label");
      lab.style.cssText = "display:flex;align-items:center;gap:5px;font-size:13px;cursor:pointer";
      var cb = document.createElement("input");
      cb.type = "checkbox"; cb.value = d;
      cb.checked = hariAktif.indexOf(d) !== -1;
      cb.style.accentColor = "#14b8a6";
      lab.appendChild(cb);
      lab.appendChild(document.createTextNode(NAMA_HARI[d]));
      boxHari.appendChild(lab);
    });
    fHari.appendChild(lblHari); fHari.appendChild(boxHari);

    /* --- Tempel jadwal manual --- */
    var fPaste = document.createElement("div");
    fPaste.className = "field";
    var lblPaste = document.createElement("label");
    lblPaste.textContent = "Tempel jadwal (Excel/Word/WA/apa pun):";
    var ta = document.createElement("textarea");
    ta.id = "alat-input"; ta.rows = 8;
    ta.placeholder = "Contoh:\nSenin\n1  07.00 - 07.40  Upacara\n2  07.40 - 08.20  Matematika\nIstirahat\n3  08.20 - 09.00  Informatika";
    ta.style.cssText = "width:100%;padding:11px 12px;border-radius:var(--radius-sm);border:1px solid var(--line);background-color:var(--navy-700);color:var(--text);font-family:inherit;font-size:13px;resize:vertical;box-sizing:border-box";
    fPaste.appendChild(lblPaste); fPaste.appendChild(ta);

    var hint = document.createElement("p");
    hint.className = "hint";
    hint.textContent = "Header baris = nama hari. Tiap baris: [jam ke] jam mulai - jam selesai, lalu nama. Tulis Istirahat/Upacara tanpa jamKe — posisinya otomatis mengikuti waktu. Import hanya mengganti hari yang ada di teks.";
    fPaste.appendChild(hint);

    /* --- AI: PDF/gambar → jadwal --- */
    var fAi = document.createElement("div");
    fAi.className = "field";
    var lblAi = document.createElement("label");
    lblAi.textContent = "Import otomatis dari PDF/Gambar (AI):";
    var aiRow = document.createElement("div");
    aiRow.style.cssText = "display:flex;gap:8px;flex-wrap:wrap;align-items:center";
    var fileAi = document.createElement("input");
    fileAi.type = "file";
    fileAi.accept = ".pdf,image/*";
    fileAi.style.cssText = "flex:1;min-width:0;font-size:12px";
    var insAi = document.createElement("input");
    insAi.type = "text";
    insAi.placeholder = "Perintah, mis: ambil jadwal kelas X.4";
    insAi.style.cssText = "flex:2;min-width:0;padding:9px 11px;border-radius:var(--radius-sm);border:1px solid var(--line);background-color:var(--navy-700);color:var(--text);font-family:inherit;font-size:12.5px";
    aiRow.appendChild(fileAi); aiRow.appendChild(insAi);
    fAi.appendChild(lblAi); fAi.appendChild(aiRow);
        var keyAi = document.createElement("input");
    keyAi.type = "password";
    keyAi.placeholder = "Gemini API key (disimpan lokal)";
    var keyTersimpan = "";
    try { keyTersimpan = localStorage.getItem(ALAT_AI_KEY_STORE) || ""; } catch (e) {}
    keyAi.value = keyTersimpan;
    keyAi.style.cssText = "width:100%;box-sizing:border-box;padding:9px 11px;border-radius:var(--radius-sm);border:1px solid var(--line);background-color:var(--navy-700);color:var(--text);font-family:inherit;font-size:12.5px;margin-top:8px";
    fAi.appendChild(keyAi);

    var btnRow = document.createElement("div");
    btnRow.style.cssText = "display:flex;gap:8px;margin-top:8px;align-items:center;justify-content:space-between";

    var btnSaveKey = document.createElement("button");
    btnSaveKey.type = "button";
    btnSaveKey.className = "btn btn-ghost btn-sm";
    btnSaveKey.textContent = "💾 Simpan Key";

    var btnAi = document.createElement("button");
    btnAi.type = "button";
    btnAi.className = "btn btn-ghost btn-sm";
    btnAi.textContent = "🔎 Pindai AI";

    btnRow.appendChild(btnSaveKey);
    btnRow.appendChild(btnAi);
    fAi.appendChild(btnRow);

    var aiStatus = document.createElement("p");
    aiStatus.style.cssText = "margin:6px 0 0;font-size:11.5px;color:var(--text-muted)";
    function alatStatusKey() {
      if (keyTersimpan) {
        aiStatus.textContent = "🔑 Key tersimpan: •••• " + keyTersimpan.slice(-4);
        aiStatus.style.color = "var(--teal-400)";
      } else {
        aiStatus.textContent = "Key gratis: aistudio.google.com → Create API key. File diproses langsung ke Google, tidak disimpan.";
        aiStatus.style.color = "var(--text-muted)";
      }
    }
    alatStatusKey();
    fAi.appendChild(aiStatus);

    function alatSimpanKey() {
      var kunci = keyAi.value.trim();
      if (kunci) {
        keyTersimpan = kunci;
        try { localStorage.setItem(ALAT_AI_KEY_STORE, kunci); } catch (e) {}
        alatStatusKey();
        showToast("API key disimpan.");
      } else if (keyTersimpan) {
        if (!confirm("Kolom key kosong. Hapus API key yang tersimpan?")) return;
        keyTersimpan = "";
        try { localStorage.removeItem(ALAT_AI_KEY_STORE); } catch (e) {}
        keyAi.value = "";
        alatStatusKey();
        showToast("API key terakhir dihapus — masukkan key baru untuk pakai AI.");
      } else {
        showToast("Kolom key kosong — tidak ada yang disimpan/dihapus.");
      }
    }
    btnSaveKey.onclick = alatSimpanKey;
    keyAi.addEventListener("keydown", function (e) {
      if (e.key === "Enter") { e.preventDefault(); alatSimpanKey(); }
    });
    
    var aiStatus = document.createElement("p");
    aiStatus.style.cssText = "margin:6px 0 0;font-size:11.5px;color:var(--text-muted)";
    aiStatus.textContent = "Key gratis: aistudio.google.com → Create API key. File diproses langsung ke Google, tidak disimpan.";
    fAi.appendChild(aiStatus);
    
    var preview = document.createElement("div");
    preview.id = "alat-preview";

    var actions = document.createElement("div");
    actions.className = "modal-actions";

    var btnPreview = document.createElement("button");
    btnPreview.className = "btn btn-ghost"; btnPreview.textContent = "Pratinjau";
    btnPreview.onclick = function () {
      alatParsedTerakhir = alatParse(ta.value, hariDipilih);
      alatRenderPreview(alatParsedTerakhir);
    };

    var btnImport = document.createElement("button");
    btnImport.className = "btn btn-primary"; btnImport.textContent = "Simpan & Import";
    btnImport.onclick = function () {
      var dipilih = [];
      var hilangHari = [];
      boxHari.querySelectorAll("input[type=checkbox]").forEach(function (cb) {
        var d = parseInt(cb.value, 10);
        if (cb.checked) dipilih.push(d);
        else if (JADWAL[d] && JADWAL[d].length > 0) hilangHari.push(d);
      });
      if (dipilih.length === 0) { showToast("Minimal 1 hari harus aktif."); return; }

      /* PERINGATAN: hari yang punya jadwal akan dinonaktifkan */
      if (hilangHari.length > 0) {
        var daftar = hilangHari.map(function (d) {
          return NAMA_HARI[d] + " (" + JADWAL[d].length + " baris jadwal)";
        }).join(", ");
        var yakin = confirm(
          "⚠️ " + daftar + " masih memiliki jadwal.\n\n" +
          "Hari ini akan dinonaktifkan. Jadwalnya TIDAK dihapus — " +
          "hanya disembunyikan dari tab hari dan perhitungan deadline.\n\nLanjutkan?"
        );
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
        showToast("Hari sekolah disimpan (tidak ada jadwal terbaca).");
        return;
      }
      parsed.hariAda.forEach(function (d) { JADWAL[d] = parsed.hasil[d]; });
      simpanJadwal();
      refreshSemua();
      overlay.remove();
      showToast("Terimport: " + parsed.hariAda.map(function (d) { return NAMA_HARI[d]; }).join(", "));
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

    /* Hasil AI tidak valid lagi kalau sumbernya diubah */
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
    btn.textContent = "Alat";
    btn.onclick = alatBukaModal;
    if (el.btnTambahJadwal && el.btnTambahJadwal.parentNode) {
      el.btnTambahJadwal.parentNode.insertBefore(btn, el.btnTambahJadwal);
    } else {
      btn.style.cssText = "position:fixed;right:14px;bottom:14px;z-index:40";
      document.body.appendChild(btn);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mulaiAlat);
  } else {
    mulaiAlat();
  }

})();

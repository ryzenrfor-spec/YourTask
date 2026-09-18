/* ============================================================
   YourTask i18n — internationalization engine
   Developed by ErlanggaDev Studios
   - Formal English is the base locale (full coverage)
   - 12 world languages; missing keys fall back to English
   - Default language follows the user's device automatically
   - The user's explicit choice is persisted in localStorage
   ============================================================ */
(function () {
  "use strict";

  var LANGS = [
    { code: "en", name: "English" },
    { code: "id", name: "Bahasa Indonesia" },
    { code: "es", name: "Español" },
    { code: "fr", name: "Français" },
    { code: "pt", name: "Português" },
    { code: "de", name: "Deutsch" },
    { code: "ru", name: "Русский" },
    { code: "ar", name: "العربية", rtl: true },
    { code: "hi", name: "हिन्दी" },
    { code: "zh", name: "中文" },
    { code: "ja", name: "日本語" },
    { code: "ko", name: "한국어" }
  ];

  /* ============================ EN (base, full) ============================ */
  var EN = {
    "meta.title": "YourTask — Class Schedule & Tasks",
    "user.default": "Student",
    "school.default": "My School",
    "misc.loading": "Loading…",
    "misc.loadingStatus": "Loading status…",
    "misc.syncing": "Syncing time…",
    "misc.newVersion": "A new version is available — reload to use it.",
    "misc.restoreOk": "Data restored! Reloading…",
    "misc.restoreInvalid": "That JSON file is invalid or corrupted.",
    "misc.confirmKeyDelete": "The key field is empty. Remove the stored API key?",
    "misc.keySaved": "API key saved.",
    "misc.keyRemoved": "API key removed — enter a new key to use AI.",
    "misc.keyEmpty": "Key field is empty — nothing to save or remove.",
    "misc.dataEnc": "Data is stored encrypted (AES-256-GCM) in your browser.",

    "status.badge": "Class Status",
    "status.holiday": "Holiday / Empty",
    "status.none": "No Schedule",
    "status.noneDetail": "No schedule for {day} yet.",
    "status.ongoing": "In Session",
    "status.break": "Break Time",
    "status.period": "Period {n}",
    "status.timeRange": "{start} – {end} ({tz})",
    "status.remaining": "{n} min left",
    "status.next": "Up next: <strong>{subject}</strong> ({time})",
    "status.outside": "Outside Class Hours",
    "status.noclass": "No Class",
    "status.beforeStart": "Classes haven't started. First session begins at {time} ({tz}).",
    "status.afterDone": "Today's classes are finished.",
    "status.outsideDetail": "Outside scheduled class hours.",
    "status.firstLesson": "First session: <strong>{subject}</strong> ({time})",
    "status.nextDay": "Next school day: <strong>{label}</strong> starts at {time} — {subject}",
    "status.tomorrow": "Tomorrow ({day})",

    "banner.urgent.title": "Deadline approaching <span style=\"white-space:nowrap;\">(&lt;&nbsp;24&nbsp;h)</span>",
    "banner.urgent.single": "{subject} ({detail}) — the lesson starts {label} at {time}.",
    "banner.urgent.multi": "{n} tasks have lessons starting within the next 24 hours.",
    "banner.insecure.title": "Insecure connection (HTTP)",
    "banner.insecure.body": "Encrypted storage and background notifications require HTTPS. Open this app via https:// to keep your data protected.",
    "banner.enable": "Enable Notifications",

    "tasks.title": "Task List",
    "tasks.empty": "No tasks yet",
    "tasks.count": "{active} active of {total} tasks",
    "tasks.add": "+ Add",
    "tasks.active": "Active",
    "tasks.completed": "Completed",
    "tasks.all": "All",
    "tasks.searchPh": "Search tasks / subjects…",
    "tasks.allSubjects": "— All subjects —",
    "tasks.emptyState": "Nothing here yet. Tap <strong>+ Add</strong> to record a new task.",

    "sched.title": "Class Schedule",
    "sched.sub": "Today's lessons",
    "sched.emptyState": "You haven't added a class schedule yet — tap the plus (+) button to build your timetable.",
    "sched.now": "Now",
    "sched.added": "Schedule added.",
    "sched.updated": "Schedule updated.",
    "sched.deleted": "Schedule deleted.",
    "sched.deleteConfirm": "Delete this schedule entry?",
    "sched.deleteAll": "🗑️ Delete All Schedule Data",
    "sched.deleteAllConfirm": "DELETE ALL SCHEDULES for every day? Tasks are kept. Continue?",
    "sched.deleteAllDone": "All schedule data deleted.",
    "sched.conflict": "Conflicts with \"{subject}\" ({a}–{b}). Choose a different time.",
    "sched.timeOrder": "Start time must be earlier than end time.",
    "sched.periodRequired": "A period number is required for lessons.",
    "sched.periodTaken": "Period {n} is already used on that day.",

    "deadline.today": "Today",
    "deadline.tomorrow": "Tomorrow",
    "deadline.on": "On {day}",

    "task.done": "Done",
    "task.weekly": "⟳ Weekly",
    "task.urgent": "< 24 h — urgent!",
    "task.deadlineNone": "No deadline found",
    "task.delete": "Delete",
    "task.deletedToast": "Task deleted.",
    "task.weeklyReset": "Weekly task reset — its deadline moved to next week.",

    "form.addTask": "Add Task",
    "form.editTask": "Edit Task",
    "form.subject": "Subject",
    "form.pickSubject": "— Choose a subject —",
    "form.noSubjects": "No lessons scheduled yet (add a schedule first)",
    "form.subjectHint": "The deadline is calculated automatically from your schedule based on this subject.",
    "form.detail": "Task Details",
    "form.detailPh": "e.g. Page 45, problems 1–10",
    "form.repeat": "Repeat",
    "form.repeatNone": "Does not repeat",
    "form.repeatWeekly": "Repeats weekly",
    "form.repeatToday": "Today only",
    "form.repeatHint": "Weekly: when marked done, the deadline automatically moves to next week.",
    "form.deadlineAuto": "Deadline (automatic)",
    "form.deadlinePreview": "Choose a subject to see its deadline.",
    "form.deadlineFound": "Deadline: <strong>{label}</strong> at {time}{period}",
    "form.deadlineMissing": "<strong>{subject}</strong> is not in the upcoming schedule.",
    "form.save": "Save Task",
    "form.update": "Save Changes",
    "form.cancel": "Cancel",
    "form.errFill": "Please complete the form.",
    "form.taskUpdated": "Task updated.",
    "form.taskAdded": "Task recorded.",

    "jform.add": "Add Schedule",
    "jform.edit": "Edit Schedule",
    "jform.day": "Day",
    "jform.start": "Start",
    "jform.end": "End",
    "jform.subject": "Subject / Activity",
    "jform.subjectPh": "e.g. Mathematics",
    "jform.type": "Type",
    "jform.lesson": "Lesson",
    "jform.break": "Break",
    "jform.ceremony": "Ceremony / Assembly",
    "jform.other": "Other",
    "jform.period": "Period Number",
    "jform.pickPeriod": "— Select a period —",
    "jform.periodN": "Period {n}",
    "jform.periodHint": "Range 1–100, required; must not repeat within the same day.",
    "jform.auto": "— Automatic (by time order) —",
    "jform.save": "Save Schedule",

    "action.title": "Schedule Options",
    "action.edit": "✏️ Edit Schedule",
    "action.delete": "🗑️ Delete",

    "prof.title": "Profile & Settings",
    "prof.username": "Display Name",
    "prof.school": "School",
    "prof.language": "Language",
    "prof.languageHint": "Choose from 12 world languages. By default it follows your device language.",
    "prof.timezone": "Time Zone (school schedule)",
    "prof.tzAuto": "Automatic (follow device)",
    "prof.tzHint": "Determines start times, class status and deadlines. \"Automatic\" uses your device's zone.",
    "prof.save": "Save Profile",
    "prof.saved": "Profile updated!",
    "prof.themeWallpaper": "Theme — Wallpaper",
    "prof.fromGallery": "🖼️ From Gallery…",
    "prof.cropHint": "Drag to position · pinch or slider to zoom · this frame is exactly how it will look.",
    "prof.dimDown": "Dim −",
    "prof.dimUp": "Dim +",
    "prof.applyWallpaper": "Apply Wallpaper",
    "prof.themeAccent": "Theme — Accent Color",
    "prof.customColor": "Custom color…",
    "prof.icon": "App Icon (in-app)",
    "prof.pickImage": "🎨 Choose Image…",
    "prof.reset": "Reset",
    "prof.iconCropHint": "The square frame becomes your app icon. Drag & zoom, then Apply.",
    "prof.applyIcon": "Apply Icon",
    "prof.iconHint": "This icon appears in the in-app header (the home-screen icon follows installation).",
    "prof.customIconAlt": "Custom icon",
    "prof.data": "App Data (Backup / Restore)",
    "prof.backup": "📥 Backup",
    "prof.restore": "📤 Restore",
    "prof.backupNamePh": "File name (optional) — leave blank for automatic date",
    "prof.backupHint": "Export your schedule and tasks as a .json file",
    "prof.danger": "Danger Zone",
    "prof.dangerHint": "Deletes the entire schedule for all days. Tasks are kept.",

    "theme.applied": "Theme \"{name}\" applied.",
    "theme.preset.default": "Default",
    "theme.preset.dusk": "Dusk",
    "theme.preset.forest": "Forest",
    "theme.preset.ocean": "Ocean",
    "theme.preset.galaxy": "Galaxy",
    "theme.preset.sakura": "Sakura",
    "theme.wallpaperApplied": "Wallpaper applied.",
    "theme.accentUpdated": "Accent color updated.",
    "theme.iconApplied": "Custom icon applied.",
    "theme.iconReset": "Icon restored to default.",
    "theme.fileNotImage": "The file must be an image.",
    "theme.imageUnreadable": "The image could not be read.",

    "notif.granted": "Notifications enabled.",
    "notif.denied": "Notification permission denied.",
    "notif.unsupported": "This browser does not support notifications.",
    "notif.failed": "Couldn't enable notifications.",
    "notif.title": "⏰ Task deadline approaching",
    "notif.body": "{subject} ({detail}) — starts {label} at {time}.",

    "footer.brand": "© 2026 ErlanggaDev Studios · Crafted for students, worldwide",
    "footer.privacy": "Privacy Policy",

    "tools.btn": "Tools",
    "tools.title": "Schedule Tools",
    "tools.activeDays": "Active school days:",
    "tools.pasteLabel": "Paste a schedule (Excel/Word/WhatsApp/anything):",
    "tools.pastePh": "Example:\nMonday\n1  07:00 - 07:40  Assembly\n2  07:40 - 08:20  Mathematics\nBreak\n3  08:20 - 09:00  Informatics",
    "tools.howTitle": "📖 How the text format works",
    "tools.howHtml": "<ul><li>A <b>day-name line</b> (e.g. <code>Monday</code>) starts that day's block.</li><li>Lesson format: <code>[period] 07:40 - 08:20 Mathematics</code></li><li>Write <code>Break</code> without a number — its position follows the time order.</li><li>Import only replaces the days present in the text — other days stay safe.</li></ul>",
    "tools.aiLabel": "Auto-import from PDF/Image (AI):",
    "tools.aiPh": "Instruction, e.g.: extract the schedule for class X.4",
    "tools.keyPh": "Gemini API key (stored locally)",
    "tools.saveKey": "💾 Save Key",
    "tools.scan": "🔎 AI Scan",
    "tools.keyStored": "🔑 Key saved: •••• {last4}",
    "tools.keyFree": "Free key: aistudio.google.com/apikey → Create API key. Uses Gemini 2.5 Flash (free tier).",
    "tools.preview": "Preview",
    "tools.import": "Save & Import",
    "tools.previewTitle": "{day} — {n} rows (will be replaced)",
    "tools.auto": "(auto)",
    "tools.skipped": "Note: {n} rows were skipped. {details}",
    "tools.noRows": "No schedule rows could be read. Click Preview to see why.",
    "tools.minDay": "At least one day must stay active.",
    "tools.deactivateWarn": "⚠️ {days} still have schedules.\n\nThese days will be deactivated. Their schedules are NOT deleted — only hidden from day tabs and deadline calculations.\n\nContinue?",
    "tools.overwriteWarn": "⚠️ The following schedules will be REPLACED:\n\n{list}\n\nExisting rows on those days are fully replaced by the import.\nTip: create a backup first via Profile → Backup if unsure.\n\nContinue?",
    "tools.imported": "Imported: {days}",
    "tools.savedNoRows": "School days saved (no schedules detected).",
    "tools.rows": "{day} ({old} old rows → {new} new rows)",

    "ai.noKey": "Add your API key first (free at aistudio.google.com/apikey).",
    "ai.noFile": "Choose a PDF or image of the schedule first.",
    "ai.tooBig": "File is too large ({mb} MB) — max 14 MB. Compress it or send a screenshot of the page.",
    "ai.reading": "Reading file…",
    "ai.readFail": "Failed to read the file.",
    "ai.mapping": "AI is mapping the document ({model})…",
    "ai.mapped": "✅ Mapped successfully{note} Check the preview, then Save & Import.",
    "ai.empty": "AI found no schedule rows. {note}",
    "ai.emptyPdf": "If this PDF came from a scan/photo, screenshot the page and send it as an image.",
    "ai.emptyImg": "Try a sharper photo or zoom in on the text.",
    "ai.failed": "Failed: {err}",
    "ai.noJson": "AI did not return valid JSON.",
    "ai.quota": "Gemini's free quota is exhausted — try again later.",
    "ai.tooLargeReq": "File too large (max ≈14 MB). Compress the PDF or send screenshots.",
    "ai.rejected": "Gemini rejected the request: {msg}",
    "ai.badKey": "API key invalid or lacks access (check your Google AI Studio key).",
    "ai.unknownErr": "unknown error",

    "parser.lineDay": "Line {n} skipped: no day header above it.",
    "parser.lineTime": "Line {n} skipped: invalid time.",
    "parser.lineOrder": "Line {n} skipped: end time is before start time.",
    "parser.lineRef": "Line {n} skipped: no time and no previous row to continue from.",
    "parser.line24": "Line {n} skipped: past 24:00.",
    "parser.lineEmpty": "Line {n} skipped: activity name is empty.",
    "parser.dayUnknown": "Day \"{day}\" is unknown, skipped.",
    "parser.skipTime": "{day}: \"{subject}\" skipped (invalid time)."
  };

  /* ============================ ID (full) ============================ */
  var ID = {
    "meta.title": "YourTask — Jadwal & Tugas Kelas",
    "user.default": "Pelajar",
    "school.default": "Sekolahku",
    "misc.loading": "Memuat…",
    "misc.loadingStatus": "Memuat status…",
    "misc.syncing": "Menyinkronkan waktu…",
    "misc.newVersion": "Versi baru tersedia — muat ulang halaman untuk memakainya.",
    "misc.restoreOk": "Data berhasil dipulihkan! Memuat ulang…",
    "misc.restoreInvalid": "File JSON tidak valid atau rusak.",
    "misc.confirmKeyDelete": "Kolom key kosong. Hapus API key yang tersimpan?",
    "misc.keySaved": "API key disimpan.",
    "misc.keyRemoved": "API key dihapus — masukkan key baru untuk memakai AI.",
    "misc.keyEmpty": "Kolom key kosong — tidak ada yang disimpan/dihapus.",
    "misc.dataEnc": "Data tersimpan terenkripsi (AES-256-GCM) di browser Anda.",

    "status.badge": "Status Kelas",
    "status.holiday": "Libur / Kosong",
    "status.none": "Tidak Ada Jadwal",
    "status.noneDetail": "Belum ada jadwal untuk hari {day}.",
    "status.ongoing": "Sedang Berlangsung",
    "status.break": "Jam Istirahat",
    "status.period": "Jam ke-{n}",
    "status.timeRange": "{start} – {end} ({tz})",
    "status.remaining": "sisa {n} mnt",
    "status.next": "Berikutnya: <strong>{subject}</strong> ({time})",
    "status.outside": "Di Luar Jam Sekolah",
    "status.noclass": "Tidak Ada Kelas",
    "status.beforeStart": "Kelas belum dimulai. Sesi pertama pukul {time} ({tz}).",
    "status.afterDone": "Kelas hari ini sudah selesai.",
    "status.outsideDetail": "Di luar jam pelajaran terjadwal.",
    "status.firstLesson": "Sesi pertama: <strong>{subject}</strong> ({time})",
    "status.nextDay": "Hari sekolah berikutnya: <strong>{label}</strong> mulai {time} — {subject}",
    "status.tomorrow": "Besok ({day})",

    "banner.urgent.title": "Deadline mendekat <span style=\"white-space:nowrap;\">(&lt;&nbsp;24&nbsp;jam)</span>",
    "banner.urgent.single": "{subject} ({detail}) — pelajaran dimulai {label} pukul {time}.",
    "banner.urgent.multi": "{n} tugas memiliki pelajaran yang dimulai dalam 24 jam ke depan.",
    "banner.insecure.title": "Koneksi tidak aman (HTTP)",
    "banner.insecure.body": "Enkripsi data & notifikasi latar belakang membutuhkan HTTPS. Buka lewat https:// agar data tetap terlindungi.",
    "banner.enable": "Aktifkan Notifikasi",

    "tasks.title": "Daftar Tugas",
    "tasks.empty": "Belum ada tugas",
    "tasks.count": "{active} aktif dari {total} tugas",
    "tasks.add": "+ Tambah",
    "tasks.active": "Aktif",
    "tasks.completed": "Selesai",
    "tasks.all": "Semua",
    "tasks.searchPh": "Cari tugas / mapel…",
    "tasks.allSubjects": "— Semua mapel —",
    "tasks.emptyState": "Belum ada tugas di daftar ini. Tekan <strong>+ Tambah</strong> untuk mencatat tugas baru.",

    "sched.title": "Jadwal Pelajaran",
    "sched.sub": "Daftar pelajaran hari ini",
    "sched.emptyState": "Anda belum menambahkan jadwal pelajaran — ketuk tombol tambah (+) untuk menyusun jadwal Anda.",
    "sched.now": "Sekarang",
    "sched.added": "Jadwal ditambahkan.",
    "sched.updated": "Jadwal diperbarui.",
    "sched.deleted": "Jadwal dihapus.",
    "sched.deleteConfirm": "Hapus jadwal ini?",
    "sched.deleteAll": "🗑️ Hapus Semua Data Jadwal",
    "sched.deleteAllConfirm": "HAPUS SEMUA JADWAL di semua hari? Tugas tidak ikut terhapus. Lanjutkan?",
    "sched.deleteAllDone": "Semua data jadwal dihapus.",
    "sched.conflict": "Bentrok dengan \"{subject}\" ({a}–{b}). Pilih jam lain.",
    "sched.timeOrder": "Waktu mulai harus lebih awal dari waktu selesai.",
    "sched.periodRequired": "Nomor jam wajib dipilih untuk pelajaran.",
    "sched.periodTaken": "Jam ke-{n} sudah dipakai di hari itu.",

    "deadline.today": "Hari Ini",
    "deadline.tomorrow": "Besok",
    "deadline.on": "Hari {day}",

    "task.done": "Selesai",
    "task.weekly": "⟳ Mingguan",
    "task.urgent": "< 24 jam — segera!",
    "task.deadlineNone": "Deadline tidak ditemukan",
    "task.delete": "Hapus",
    "task.deletedToast": "Tugas dihapus.",
    "task.weeklyReset": "Tugas mingguan direset — deadline pindah ke pekan berikutnya.",

    "form.addTask": "Tambah Tugas",
    "form.editTask": "Edit Tugas",
    "form.subject": "Mata Pelajaran",
    "form.pickSubject": "— Pilih mata pelajaran —",
    "form.noSubjects": "Belum ada jadwal pelajaran (tambahkan jadwal dulu)",
    "form.subjectHint": "Deadline dihitung otomatis dari jadwal berdasarkan mapel ini.",
    "form.detail": "Detail Tugas",
    "form.detailPh": "Contoh: Halaman 45 nomor 1–10",
    "form.repeat": "Pengulangan",
    "form.repeatNone": "Tidak berulang",
    "form.repeatWeekly": "Berulang mingguan",
    "form.repeatToday": "Hanya hari ini",
    "form.repeatHint": "Mingguan: saat ditandai selesai, deadline otomatis pindah ke pekan berikutnya.",
    "form.deadlineAuto": "Deadline (otomatis)",
    "form.deadlinePreview": "Pilih mapel untuk melihat deadline.",
    "form.deadlineFound": "Deadline: <strong>{label}</strong>, pukul {time}{period}",
    "form.deadlineMissing": "<strong>{subject}</strong> tidak ada di jadwal terdekat.",
    "form.save": "Simpan Tugas",
    "form.update": "Simpan Perubahan",
    "form.cancel": "Batal",
    "form.errFill": "Mohon lengkapi formulir.",
    "form.taskUpdated": "Tugas diperbarui.",
    "form.taskAdded": "Tugas dicatat.",

    "jform.add": "Tambah Jadwal",
    "jform.edit": "Edit Jadwal",
    "jform.day": "Hari",
    "jform.start": "Mulai",
    "jform.end": "Selesai",
    "jform.subject": "Mata Pelajaran / Kegiatan",
    "jform.subjectPh": "Contoh: Matematika",
    "jform.type": "Tipe",
    "jform.lesson": "Pelajaran",
    "jform.break": "Istirahat",
    "jform.ceremony": "Upacara",
    "jform.other": "Lainnya",
    "jform.period": "Urutan Jam Pelajaran",
    "jform.pickPeriod": "— Pilih Jam ke —",
    "jform.periodN": "Jam ke-{n}",
    "jform.periodHint": "Rentang 1–100, wajib diisi, tidak boleh duplikat di hari yang sama.",
    "jform.auto": "— Otomatis (sesuai urutan waktu) —",
    "jform.save": "Simpan Jadwal",

    "action.title": "Aksi Jadwal",
    "action.edit": "✏️ Edit Jadwal",
    "action.delete": "🗑️ Hapus",

    "prof.title": "Profil & Pengaturan",
    "prof.username": "Nama Pengguna",
    "prof.school": "Asal Sekolah",
    "prof.language": "Bahasa",
    "prof.languageHint": "Tersedia 12 bahasa dunia. Secara bawaan mengikuti bahasa perangkat Anda.",
    "prof.timezone": "Zona Waktu (jadwal sekolah)",
    "prof.tzAuto": "Otomatis (ikuti perangkat)",
    "prof.tzHint": "Menentukan jam masuk, status kelas & deadline. \"Otomatis\" memakai zona perangkat Anda.",
    "prof.save": "Simpan Profil",
    "prof.saved": "Profil berhasil diperbarui!",
    "prof.themeWallpaper": "Tema — Wallpaper",
    "prof.fromGallery": "🖼️ Dari Galeri…",
    "prof.cropHint": "Geser untuk memposisikan · pinch/slider untuk zoom · bingkai ini = hasil akhir di layar Anda.",
    "prof.dimDown": "Gelap −",
    "prof.dimUp": "Gelap +",
    "prof.applyWallpaper": "Terapkan Wallpaper",
    "prof.themeAccent": "Tema — Warna Aksen",
    "prof.customColor": "Warna kustom…",
    "prof.icon": "Ikon Aplikasi (dalam app)",
    "prof.pickImage": "🎨 Pilih Gambar…",
    "prof.reset": "Reset",
    "prof.iconCropHint": "Bingkai persegi = ikon aplikasi Anda. Geser & zoom, lalu Terapkan.",
    "prof.applyIcon": "Terapkan Ikon",
    "prof.iconHint": "Ikon ini tampil di header dalam app (ikon layar utama mengikuti instalasi).",
    "prof.customIconAlt": "Ikon kustom",
    "prof.data": "Data Aplikasi (Backup / Restore)",
    "prof.backup": "📥 Backup",
    "prof.restore": "📤 Restore",
    "prof.backupNamePh": "Nama file (opsional) — kosongkan = otomatis tanggal",
    "prof.backupHint": "Backup jadwal dan tugas Anda dalam format .json",
    "prof.danger": "Zona Berbahaya",
    "prof.dangerHint": "Menghapus seluruh jadwal (semua hari). Tugas tidak ikut terhapus.",

    "theme.applied": "Tema \"{name}\" diterapkan.",
    "theme.preset.default": "Bawaan",
    "theme.preset.dusk": "Senja",
    "theme.preset.forest": "Hutan",
    "theme.preset.ocean": "Laut",
    "theme.preset.galaxy": "Galaksi",
    "theme.preset.sakura": "Sakura",
    "theme.wallpaperApplied": "Wallpaper diterapkan.",
    "theme.accentUpdated": "Warna aksen diperbarui.",
    "theme.iconApplied": "Ikon kustom diterapkan.",
    "theme.iconReset": "Ikon kembali ke bawaan.",
    "theme.fileNotImage": "File harus berupa gambar.",
    "theme.imageUnreadable": "Gambar tidak bisa dibaca.",

    "notif.granted": "Notifikasi aktif.",
    "notif.denied": "Izin notifikasi ditolak.",
    "notif.unsupported": "Browser ini tidak mendukung notifikasi.",
    "notif.failed": "Gagal mengaktifkan notifikasi.",
    "notif.title": "⏰ Deadline tugas mendekat",
    "notif.body": "{subject} ({detail}) — dimulai {label} pukul {time}.",

    "footer.brand": "© 2026 ErlanggaDev Studios · Dibuat untuk pelajar, di seluruh dunia",
    "footer.privacy": "Kebijakan Privasi",

    "tools.btn": "Alat",
    "tools.title": "Alat Jadwal",
    "tools.activeDays": "Hari sekolah aktif:",
    "tools.pasteLabel": "Tempel jadwal (Excel/Word/WA/apa pun):",
    "tools.pastePh": "Contoh:\nSenin\n1  07.00 - 07.40  Upacara\n2  07.40 - 08.20  Matematika\nIstirahat\n3  08.20 - 09.00  Informatika",
    "tools.howTitle": "📖 Cara pakai format penulisan",
    "tools.howHtml": "<ul><li><b>Baris nama hari</b> (mis. <code>Senin</code>) mulai blok jadwal hari itu.</li><li>Format pelajaran: <code>[jam ke] 07.40 - 08.20 Matematika</code></li><li>Tulis <code>Istirahat</code> tanpa nomor — posisinya otomatis mengikuti urutan jam.</li><li>Import hanya mengganti hari yang ada di teks — hari lain tetap aman.</li></ul>",
    "tools.aiLabel": "Import otomatis dari PDF/Gambar (AI):",
    "tools.aiPh": "Perintah, mis: ambil jadwal kelas X.4",
    "tools.keyPh": "Gemini API key (disimpan lokal)",
    "tools.saveKey": "💾 Simpan Key",
    "tools.scan": "🔎 Pindai AI",
    "tools.keyStored": "🔑 Key tersimpan: •••• {last4}",
    "tools.keyFree": "Key gratis: aistudio.google.com/apikey → Create API key. Memakai Gemini 2.5 Flash (free tier).",
    "tools.preview": "Pratinjau",
    "tools.import": "Simpan & Import",
    "tools.previewTitle": "{day} — {n} baris (akan diganti)",
    "tools.auto": "(otomatis)",
    "tools.skipped": "Catatan: {n} baris dilewati. {details}",
    "tools.noRows": "Tidak ada baris jadwal yang berhasil dibaca. Klik Pratinjau untuk melihat alasannya.",
    "tools.minDay": "Minimal 1 hari harus aktif.",
    "tools.deactivateWarn": "⚠️ {days} masih memiliki jadwal.\n\nHari ini akan dinonaktifkan. Jadwalnya TIDAK dihapus — hanya disembunyikan dari tab hari dan perhitungan deadline.\n\nLanjutkan?",
    "tools.overwriteWarn": "⚠️ Jadwal berikut akan DITIMPA:\n\n{list}\n\nBaris lama di hari tersebut diganti seluruhnya dengan hasil import.\nTips: backup dulu lewat Profil → Backup kalau ragu.\n\nLanjutkan?",
    "tools.imported": "Terimport: {days}",
    "tools.savedNoRows": "Hari sekolah disimpan (tidak ada jadwal terbaca).",
    "tools.rows": "{day} ({old} baris lama → {new} baris baru)",

    "ai.noKey": "Isi API key dulu (gratis di aistudio.google.com/apikey).",
    "ai.noFile": "Pilih file PDF/gambar jadwal dulu.",
    "ai.tooBig": "File terlalu besar ({mb} MB) — maks 14 MB. Kompres atau kirim tangkapan layarnya.",
    "ai.reading": "Membaca file…",
    "ai.readFail": "Gagal membaca file.",
    "ai.mapping": "AI sedang memetakan dokumen ({model})…",
    "ai.mapped": "✅ Berhasil dipetakan{note} Cek pratinjau, lalu Simpan & Import.",
    "ai.empty": "AI tidak menemukan baris jadwal. {note}",
    "ai.emptyPdf": "Kalau PDF-nya hasil scan/foto, screenshot halamannya lalu kirim sebagai gambar.",
    "ai.emptyImg": "Coba foto yang lebih jelas atau perbesar teksnya.",
    "ai.failed": "Gagal: {err}",
    "ai.noJson": "AI tidak mengembalikan JSON valid.",
    "ai.quota": "Kuota gratis Gemini habis — coba lagi nanti/besok.",
    "ai.tooLargeReq": "File terlalu besar (maks ±14 MB). Kompres PDF-nya atau kirim tangkapan layar.",
    "ai.rejected": "Permintaan ditolak Gemini: {msg}",
    "ai.badKey": "API key tidak valid atau tidak punya akses (periksa key dari Google AI Studio).",
    "ai.unknownErr": "tidak diketahui",

    "parser.lineDay": "Baris {n} dilewati: tidak ada header hari di atasnya.",
    "parser.lineTime": "Baris {n} dilewati: jam tidak valid.",
    "parser.lineOrder": "Baris {n} dilewati: jam selesai <= jam mulai.",
    "parser.lineRef": "Baris {n} dilewati: tanpa jam & tanpa acuan baris sebelumnya.",
    "parser.line24": "Baris {n} dilewati: melewati 24:00.",
    "parser.lineEmpty": "Baris {n} dilewati: nama kegiatan kosong.",
    "parser.dayUnknown": "Hari \"{day}\" tidak dikenal, dilewati.",
    "parser.skipTime": "{day}: \"{subject}\" dilewati (jam tidak valid)."
  };

  /* ============ Core subset for other world languages ============
     Missing keys automatically fall back to formal English. */
  var ES = {
    "meta.title": "YourTask — Horario y Tareas",
    "user.default": "Estudiante", "school.default": "Mi escuela", "misc.loading": "Cargando…",
    "status.badge": "Estado de clase", "status.ongoing": "En curso", "status.break": "Recreo",
    "status.period": "Periodo {n}", "status.timeRange": "{start} – {end} ({tz})", "status.remaining": "quedan {n} min",
    "status.next": "Siguiente: <strong>{subject}</strong> ({time})", "status.outside": "Fuera del horario de clases",
    "status.noclass": "Sin clases", "status.afterDone": "Las clases de hoy han terminado.",
    "status.beforeStart": "Las clases no han empezado. La primera sesión comienza a las {time} ({tz}).",
    "tasks.title": "Lista de tareas", "tasks.empty": "Aún no hay tareas", "tasks.count": "{active} activas de {total} tareas",
    "tasks.add": "+ Añadir", "tasks.active": "Activas", "tasks.completed": "Completadas", "tasks.all": "Todas",
    "tasks.searchPh": "Buscar tareas / asignaturas…", "tasks.allSubjects": "— Todas las asignaturas —",
    "sched.title": "Horario de clases", "sched.sub": "Lecciones de hoy", "sched.now": "Ahora",
    "deadline.today": "Hoy", "deadline.tomorrow": "Mañana",
    "task.done": "Hecha", "task.delete": "Eliminar",
    "form.addTask": "Añadir tarea", "form.editTask": "Editar tarea", "form.subject": "Asignatura",
    "form.pickSubject": "— Elige una asignatura —", "form.save": "Guardar tarea", "form.update": "Guardar cambios",
    "form.cancel": "Cancelar", "form.detail": "Detalles de la tarea",
    "jform.add": "Añadir horario", "jform.day": "Día", "jform.start": "Inicio", "jform.end": "Fin",
    "jform.subject": "Asignatura / Actividad", "jform.type": "Tipo", "jform.lesson": "Lección",
    "jform.break": "Recreo", "jform.ceremony": "Acto ceremonial", "jform.other": "Otro",
    "jform.period": "Número de periodo", "jform.periodN": "Periodo {n}", "jform.save": "Guardar horario",
    "prof.title": "Perfil y ajustes", "prof.username": "Nombre", "prof.school": "Escuela",
    "prof.language": "Idioma", "prof.languageHint": "12 idiomas disponibles. Por defecto sigue el idioma de tu dispositivo.",
    "prof.timezone": "Zona horaria (horario escolar)", "prof.tzAuto": "Automática (según el dispositivo)",
    "prof.save": "Guardar perfil", "prof.saved": "¡Perfil actualizado!",
    "prof.themeWallpaper": "Tema — Fondo", "prof.themeAccent": "Tema — Color de acento", "prof.icon": "Icono de la app",
    "prof.backup": "📥 Copia", "prof.restore": "📤 Restaurar",
    "footer.brand": "© 2026 ErlanggaDev Studios · Hecho para estudiantes del mundo",
    "footer.privacy": "Política de privacidad", "tools.btn": "Herramientas", "tools.title": "Herramientas de horario",
    "tools.preview": "Vista previa", "tools.import": "Guardar e importar",
    "banner.enable": "Activar notificaciones"
  };

  var FR = {
    "meta.title": "YourTask — Emploi du temps et Devoirs",
    "user.default": "Élève", "school.default": "Mon école", "misc.loading": "Chargement…",
    "status.badge": "Statut du cours", "status.ongoing": "En cours", "status.break": "Récréation",
    "status.period": "Période {n}", "status.timeRange": "{start} – {end} ({tz})", "status.remaining": "{n} min restantes",
    "status.next": "Ensuite : <strong>{subject}</strong> ({time})", "status.outside": "Hors des heures de cours",
    "status.noclass": "Pas de cours", "status.afterDone": "Les cours d'aujourd'hui sont terminés.",
    "status.beforeStart": "Les cours n'ont pas commencé. Première séance à {time} ({tz}).",
    "tasks.title": "Liste des devoirs", "tasks.empty": "Aucun devoir pour le moment", "tasks.count": "{active} actifs sur {total} devoirs",
    "tasks.add": "+ Ajouter", "tasks.active": "Actifs", "tasks.completed": "Terminés", "tasks.all": "Tous",
    "tasks.searchPh": "Rechercher des devoirs / matières…", "tasks.allSubjects": "— Toutes les matières —",
    "sched.title": "Emploi du temps", "sched.sub": "Cours du jour", "sched.now": "Maintenant",
    "deadline.today": "Aujourd'hui", "deadline.tomorrow": "Demain",
    "task.done": "Terminé", "task.delete": "Supprimer",
    "form.addTask": "Ajouter un devoir", "form.editTask": "Modifier le devoir", "form.subject": "Matière",
    "form.pickSubject": "— Choisissez une matière —", "form.save": "Enregistrer", "form.update": "Enregistrer les modifications",
    "form.cancel": "Annuler", "form.detail": "Détails du devoir",
    "jform.add": "Ajouter un cours", "jform.day": "Jour", "jform.start": "Début", "jform.end": "Fin",
    "jform.subject": "Matière / Activité", "jform.type": "Type", "jform.lesson": "Cours",
    "jform.break": "Récréation", "jform.ceremony": "Cérémonie", "jform.other": "Autre",
    "jform.period": "Numéro de période", "jform.periodN": "Période {n}", "jform.save": "Enregistrer l'emploi du temps",
    "prof.title": "Profil et réglages", "prof.username": "Nom d'utilisateur", "prof.school": "École",
    "prof.language": "Langue", "prof.languageHint": "12 langues disponibles. Par défaut, la langue de votre appareil est utilisée.",
    "prof.timezone": "Fuseau horaire (emploi du temps)", "prof.tzAuto": "Automatique (appareil)",
    "prof.save": "Enregistrer le profil", "prof.saved": "Profil mis à jour !",
    "prof.themeWallpaper": "Thème — Fond d'écran", "prof.themeAccent": "Thème — Couleur d'accent", "prof.icon": "Icône de l'app",
    "prof.backup": "📥 Sauvegarde", "prof.restore": "📤 Restaurer",
    "footer.brand": "© 2026 ErlanggaDev Studios · Conçu pour les étudiants du monde entier",
    "footer.privacy": "Politique de confidentialité", "tools.btn": "Outils", "tools.title": "Outils d'emploi du temps",
    "tools.preview": "Aperçu", "tools.import": "Enregistrer et importer",
    "banner.enable": "Activer les notifications"
  };

  var PT = {
    "meta.title": "YourTask — Horário e Tarefas",
    "user.default": "Estudante", "school.default": "Minha escola", "misc.loading": "Carregando…",
    "status.badge": "Status da aula", "status.ongoing": "Em andamento", "status.break": "Recreio",
    "status.period": "Período {n}", "status.timeRange": "{start} – {end} ({tz})", "status.remaining": "faltam {n} min",
    "status.next": "A seguir: <strong>{subject}</strong> ({time})", "status.outside": "Fora do horário de aula",
    "status.noclass": "Sem aula", "status.afterDone": "As aulas de hoje terminaram.",
    "status.beforeStart": "As aulas ainda não começaram. A primeira sessão começa às {time} ({tz}).",
    "tasks.title": "Lista de tarefas", "tasks.empty": "Nenhuma tarefa ainda", "tasks.count": "{active} ativas de {total} tarefas",
    "tasks.add": "+ Adicionar", "tasks.active": "Ativas", "tasks.completed": "Concluídas", "tasks.all": "Todas",
    "tasks.searchPh": "Pesquisar tarefas / matérias…", "tasks.allSubjects": "— Todas as matérias —",
    "sched.title": "Horário das aulas", "sched.sub": "Aulas de hoje", "sched.now": "Agora",
    "deadline.today": "Hoje", "deadline.tomorrow": "Amanhã",
    "task.done": "Concluída", "task.delete": "Excluir",
    "form.addTask": "Adicionar tarefa", "form.editTask": "Editar tarefa", "form.subject": "Matéria",
    "form.pickSubject": "— Escolha uma matéria —", "form.save": "Salvar tarefa", "form.update": "Salvar alterações",
    "form.cancel": "Cancelar", "form.detail": "Detalhes da tarefa",
    "jform.add": "Adicionar horário", "jform.day": "Dia", "jform.start": "Início", "jform.end": "Fim",
    "jform.subject": "Matéria / Atividade", "jform.type": "Tipo", "jform.lesson": "Aula",
    "jform.break": "Recreio", "jform.ceremony": "Cerimônia", "jform.other": "Outro",
    "jform.period": "Número do período", "jform.periodN": "Período {n}", "jform.save": "Salvar horário",
    "prof.title": "Perfil e configurações", "prof.username": "Nome de usuário", "prof.school": "Escola",
    "prof.language": "Idioma", "prof.languageHint": "12 idiomas disponíveis. Por padrão, segue o idioma do dispositivo.",
    "prof.timezone": "Fuso horário (horário escolar)", "prof.tzAuto": "Automático (seguir o dispositivo)",
    "prof.save": "Salvar perfil", "prof.saved": "Perfil atualizado!",
    "prof.themeWallpaper": "Tema — Papel de parede", "prof.themeAccent": "Tema — Cor de destaque", "prof.icon": "Ícone do app",
    "prof.backup": "📥 Backup", "prof.restore": "📤 Restaurar",
    "footer.brand": "© 2026 ErlanggaDev Studios · Feito para estudantes do mundo todo",
    "footer.privacy": "Política de Privacidade", "tools.btn": "Ferramentas", "tools.title": "Ferramentas de horário",
    "tools.preview": "Pré-visualizar", "tools.import": "Salvar e importar",
    "banner.enable": "Ativar notificações"
  };

  var DE = {
    "meta.title": "YourTask — Stundenplan & Aufgaben",
    "user.default": "Schüler", "school.default": "Meine Schule", "misc.loading": "Wird geladen…",
    "status.badge": "Unterrichtsstatus", "status.ongoing": "Läuft gerade", "status.break": "Pause",
    "status.period": "Stunde {n}", "status.timeRange": "{start} – {end} ({tz})", "status.remaining": "{n} Min. übrig",
    "status.next": "Als Nächstes: <strong>{subject}</strong> ({time})", "status.outside": "Außerhalb der Unterrichtszeiten",
    "status.noclass": "Kein Unterricht", "status.afterDone": "Der Unterricht ist für heute beendet.",
    "status.beforeStart": "Der Unterricht hat noch nicht begonnen. Erste Stunde um {time} ({tz}).",
    "tasks.title": "Aufgabenliste", "tasks.empty": "Noch keine Aufgaben", "tasks.count": "{active} aktiv von {total} Aufgaben",
    "tasks.add": "+ Hinzufügen", "tasks.active": "Aktiv", "tasks.completed": "Erledigt", "tasks.all": "Alle",
    "tasks.searchPh": "Aufgaben / Fächer suchen…", "tasks.allSubjects": "— Alle Fächer —",
    "sched.title": "Stundenplan", "sched.sub": "Heutige Stunden", "sched.now": "Jetzt",
    "deadline.today": "Heute", "deadline.tomorrow": "Morgen",
    "task.done": "Erledigt", "task.delete": "Löschen",
    "form.addTask": "Aufgabe hinzufügen", "form.editTask": "Aufgabe bearbeiten", "form.subject": "Fach",
    "form.pickSubject": "— Fach wählen —", "form.save": "Aufgabe speichern", "form.update": "Änderungen speichern",
    "form.cancel": "Abbrechen", "form.detail": "Aufgabendetails",
    "jform.add": "Stunde hinzufügen", "jform.day": "Tag", "jform.start": "Beginn", "jform.end": "Ende",
    "jform.subject": "Fach / Aktivität", "jform.type": "Art", "jform.lesson": "Unterricht",
    "jform.break": "Pause", "jform.ceremony": "Zeremonie", "jform.other": "Sonstiges",
    "jform.period": "Stundennummer", "jform.periodN": "Stunde {n}", "jform.save": "Stundenplan speichern",
    "prof.title": "Profil & Einstellungen", "prof.username": "Benutzername", "prof.school": "Schule",
    "prof.language": "Sprache", "prof.languageHint": "12 Sprachen verfügbar. Standardmäßig wird die Gerätesprache verwendet.",
    "prof.timezone": "Zeitzone (Schulplan)", "prof.tzAuto": "Automatisch (Geräteeinstellung)",
    "prof.save": "Profil speichern", "prof.saved": "Profil aktualisiert!",
    "prof.themeWallpaper": "Design — Hintergrundbild", "prof.themeAccent": "Design — Akzentfarbe", "prof.icon": "App-Symbol",
    "prof.backup": "📥 Backup", "prof.restore": "📤 Wiederherstellen",
    "footer.brand": "© 2026 ErlanggaDev Studios · Für Schüler weltweit",
    "footer.privacy": "Datenschutzerklärung", "tools.btn": "Werkzeuge", "tools.title": "Stundenplan-Werkzeuge",
    "tools.preview": "Vorschau", "tools.import": "Speichern & importieren",
    "banner.enable": "Benachrichtigungen aktivieren"
  };

  var RU = {
    "meta.title": "YourTask — Расписание и Задания",
    "user.default": "Ученик", "school.default": "Моя школа", "misc.loading": "Загрузка…",
    "status.badge": "Статус занятий", "status.ongoing": "Идёт занятие", "status.break": "Перемена",
    "status.period": "Урок {n}", "status.timeRange": "{start} – {end} ({tz})", "status.remaining": "осталось {n} мин",
    "status.next": "Далее: <strong>{subject}</strong> ({time})", "status.outside": "Вне занятий",
    "status.noclass": "Нет занятий", "status.afterDone": "Занятия на сегодня закончились.",
    "status.beforeStart": "Занятия ещё не начались. Первый урок в {time} ({tz}).",
    "tasks.title": "Список заданий", "tasks.empty": "Заданий пока нет", "tasks.count": "{active} активных из {total}",
    "tasks.add": "+ Добавить", "tasks.active": "Активные", "tasks.completed": "Выполненные", "tasks.all": "Все",
    "tasks.searchPh": "Поиск заданий / предметов…", "tasks.allSubjects": "— Все предметы —",
    "sched.title": "Расписание", "sched.sub": "Уроки на сегодня", "sched.now": "Сейчас",
    "deadline.today": "Сегодня", "deadline.tomorrow": "Завтра",
    "task.done": "Готово", "task.delete": "Удалить",
    "form.addTask": "Добавить задание", "form.editTask": "Изменить задание", "form.subject": "Предмет",
    "form.pickSubject": "— Выберите предмет —", "form.save": "Сохранить", "form.update": "Сохранить изменения",
    "form.cancel": "Отмена", "form.detail": "Детали задания",
    "jform.add": "Добавить урок", "jform.day": "День", "jform.start": "Начало", "jform.end": "Конец",
    "jform.subject": "Предмет / Мероприятие", "jform.type": "Тип", "jform.lesson": "Урок",
    "jform.break": "Перемена", "jform.ceremony": "Торжественная линейка", "jform.other": "Другое",
    "jform.period": "Номер урока", "jform.periodN": "Урок {n}", "jform.save": "Сохранить расписание",
    "prof.title": "Профиль и настройки", "prof.username": "Имя пользователя", "prof.school": "Школа",
    "prof.language": "Язык", "prof.languageHint": "Доступно 12 языков. По умолчанию используется язык устройства.",
    "prof.timezone": "Часовой пояс (школьное расписание)", "prof.tzAuto": "Автоматически (как на устройстве)",
    "prof.save": "Сохранить профиль", "prof.saved": "Профиль обновлён!",
    "prof.themeWallpaper": "Тема — Обои", "prof.themeAccent": "Тема — Акцентный цвет", "prof.icon": "Значок приложения",
    "prof.backup": "📥 Резервная копия", "prof.restore": "📤 Восстановить",
    "footer.brand": "© 2026 ErlanggaDev Studios · Создано для школьников всего мира",
    "footer.privacy": "Политика конфиденциальности", "tools.btn": "Инструменты", "tools.title": "Инструменты расписания",
    "tools.preview": "Предпросмотр", "tools.import": "Сохранить и импортировать",
    "banner.enable": "Включить уведомления"
  };

  var AR = {
    "meta.title": "YourTask — الجدول الدراسي والمهام",
    "user.default": "طالب", "school.default": "مدرستي", "misc.loading": "جارٍ التحميل…",
    "status.badge": "حالة الحصة", "status.ongoing": "جارية الآن", "status.break": "الاستراحة",
    "status.period": "الحصة {n}", "status.timeRange": "{start} – {end} ({tz})", "status.remaining": "متبقٍ {n} دقيقة",
    "status.next": "التالي: <strong>{subject}</strong> ({time})", "status.outside": "خارج أوقات الحصص",
    "status.noclass": "لا توجد حصص", "status.afterDone": "انتهت حصص اليوم.",
    "status.beforeStart": "لم تبدأ الحصص بعد. تبدأ الحصة الأولى في {time} ({tz}).",
    "tasks.title": "قائمة المهام", "tasks.empty": "لا مهام بعد", "tasks.count": "{active} نشطة من {total} مهام",
    "tasks.add": "+ إضافة", "tasks.active": "نشطة", "tasks.completed": "مكتملة", "tasks.all": "الكل",
    "tasks.searchPh": "ابحث في المهام / المواد…", "tasks.allSubjects": "— جميع المواد —",
    "sched.title": "الجدول الدراسي", "sched.sub": "حصص اليوم", "sched.now": "الآن",
    "deadline.today": "اليوم", "deadline.tomorrow": "غدًا",
    "task.done": "تم", "task.delete": "حذف",
    "form.addTask": "إضافة مهمة", "form.editTask": "تعديل المهمة", "form.subject": "المادة",
    "form.pickSubject": "— اختر مادة —", "form.save": "حفظ المهمة", "form.update": "حفظ التغييرات",
    "form.cancel": "إلغاء", "form.detail": "تفاصيل المهمة",
    "jform.add": "إضافة حصة", "jform.day": "اليوم", "jform.start": "البداية", "jform.end": "النهاية",
    "jform.subject": "المادة / النشاط", "jform.type": "النوع", "jform.lesson": "حصة",
    "jform.break": "استراحة", "jform.ceremony": "طابور الصباح", "jform.other": "أخرى",
    "jform.period": "رقم الحصة", "jform.periodN": "الحصة {n}", "jform.save": "حفظ الجدول",
    "prof.title": "الملف والإعدادات", "prof.username": "الاسم", "prof.school": "المدرسة",
    "prof.language": "اللغة", "prof.languageHint": "متوفرة 12 لغة. افتراضيًا تتبع لغة جهازك.",
    "prof.timezone": "المنطقة الزمنية (الجدول المدرسي)", "prof.tzAuto": "تلقائي (حسب الجهاز)",
    "prof.save": "حفظ الملف", "prof.saved": "تم تحديث الملف!",
    "prof.themeWallpaper": "المظهر — الخلفية", "prof.themeAccent": "المظهر — لون التمييز", "prof.icon": "أيقونة التطبيق",
    "prof.backup": "📥 نسخة احتياطية", "prof.restore": "📤 استعادة",
    "footer.brand": "© 2026 ErlanggaDev Studios · صُمم للطلاب حول العالم",
    "footer.privacy": "سياسة الخصوصية", "tools.btn": "الأدوات", "tools.title": "أدوات الجدول",
    "tools.preview": "معاينة", "tools.import": "حفظ واستيراد",
    "banner.enable": "تفعيل الإشعارات"
  };

  var HI = {
    "meta.title": "YourTask — कक्षा अनुसूची और कार्य",
    "user.default": "छात्र", "school.default": "मेरा विद्यालय", "misc.loading": "लोड हो रहा है…",
    "status.badge": "कक्षा स्थिति", "status.ongoing": "जारी है", "status.break": "अवकाश",
    "status.period": "पीरियड {n}", "status.timeRange": "{start} – {end} ({tz})", "status.remaining": "{n} मिनट शेष",
    "status.next": "आगे: <strong>{subject}</strong> ({time})", "status.outside": "कक्षा समय से बाहर",
    "status.noclass": "कोई कक्षा नहीं", "status.afterDone": "आज की कक्षाएँ समाप्त हो गई हैं।",
    "status.beforeStart": "कक्षाएँ अभी शुरू नहीं हुई हैं। पहली कक्षा {time} ({tz}) बजे।",
    "tasks.title": "कार्य सूची", "tasks.empty": "अभी कोई कार्य नहीं", "tasks.count": "{total} में से {active} सक्रिय",
    "tasks.add": "+ जोड़ें", "tasks.active": "सक्रिय", "tasks.completed": "पूर्ण", "tasks.all": "सभी",
    "tasks.searchPh": "कार्य / विषय खोजें…", "tasks.allSubjects": "— सभी विषय —",
    "sched.title": "कक्षा अनुसूची", "sched.sub": "आज की कक्षाएँ", "sched.now": "अभी",
    "deadline.today": "आज", "deadline.tomorrow": "कल",
    "task.done": "पूर्ण", "task.delete": "हटाएँ",
    "form.addTask": "कार्य जोड़ें", "form.editTask": "कार्य संपादित करें", "form.subject": "विषय",
    "form.pickSubject": "— विषय चुनें —", "form.save": "कार्य सहेजें", "form.update": "परिवर्तन सहेजें",
    "form.cancel": "रद्द करें", "form.detail": "कार्य विवरण",
    "jform.add": "कक्षा जोड़ें", "jform.day": "दिन", "jform.start": "प्रारंभ", "jform.end": "समाप्ति",
    "jform.subject": "विषय / गतिविधि", "jform.type": "प्रकार", "jform.lesson": "कक्षा",
    "jform.break": "अवकाश", "jform.ceremony": "प्रार्थना सभा", "jform.other": "अन्य",
    "jform.period": "पीरियड संख्या", "jform.periodN": "पीरियड {n}", "jform.save": "अनुसूची सहेजें",
    "prof.title": "प्रोफ़ाइल और सेटिंग्स", "prof.username": "उपयोगकर्ता नाम", "prof.school": "विद्यालय",
    "prof.language": "भाषा", "prof.languageHint": "12 भाषाएँ उपलब्ध। डिफ़ॉल्ट रूप से आपकी डिवाइस की भाषा।",
    "prof.timezone": "समय क्षेत्र (विद्यालय अनुसूची)", "prof.tzAuto": "स्वतः (डिवाइस के अनुसार)",
    "prof.save": "प्रोफ़ाइल सहेजें", "prof.saved": "प्रोफ़ाइल अपडेट हुई!",
    "prof.themeWallpaper": "थीम — वॉलपेपर", "prof.themeAccent": "थीम — एक्सेंट रंग", "prof.icon": "ऐप आइकन",
    "prof.backup": "📥 बैकअप", "prof.restore": "📤 पुनर्स्थापित",
    "footer.brand": "© 2026 ErlanggaDev Studios · विश्व भर के छात्रों के लिए",
    "footer.privacy": "गोपनीयता नीति", "tools.btn": "उपकरण", "tools.title": "अनुसूची उपकरण",
    "tools.preview": "पूर्वावलोकन", "tools.import": "सहेजें और आयात करें",
    "banner.enable": "सूचनाएँ सक्रिय करें"
  };

  var ZH = {
    "meta.title": "YourTask — 课程表与任务",
    "user.default": "学生", "school.default": "我的学校", "misc.loading": "加载中…",
    "status.badge": "课堂状态", "status.ongoing": "进行中", "status.break": "课间休息",
    "status.period": "第 {n} 节", "status.timeRange": "{start} – {end} ({tz})", "status.remaining": "剩余 {n} 分钟",
    "status.next": "下一节: <strong>{subject}</strong> ({time})", "status.outside": "课外时间",
    "status.noclass": "没有课程", "status.afterDone": "今天的课程已结束。",
    "status.beforeStart": "课程尚未开始。第一节于 {time} ({tz}) 开始。",
    "tasks.title": "任务列表", "tasks.empty": "暂无任务", "tasks.count": "{total} 项任务中 {active} 项进行中",
    "tasks.add": "+ 添加", "tasks.active": "进行中", "tasks.completed": "已完成", "tasks.all": "全部",
    "tasks.searchPh": "搜索任务 / 科目…", "tasks.allSubjects": "— 全部科目 —",
    "sched.title": "课程表", "sched.sub": "今天的课程", "sched.now": "现在",
    "deadline.today": "今天", "deadline.tomorrow": "明天",
    "task.done": "完成", "task.delete": "删除",
    "form.addTask": "添加任务", "form.editTask": "编辑任务", "form.subject": "科目",
    "form.pickSubject": "— 选择科目 —", "form.save": "保存任务", "form.update": "保存更改",
    "form.cancel": "取消", "form.detail": "任务详情",
    "jform.add": "添加课程", "jform.day": "星期", "jform.start": "开始", "jform.end": "结束",
    "jform.subject": "科目 / 活动", "jform.type": "类型", "jform.lesson": "课程",
    "jform.break": "课间休息", "jform.ceremony": "晨会", "jform.other": "其他",
    "jform.period": "节次编号", "jform.periodN": "第 {n} 节", "jform.save": "保存课程表",
    "prof.title": "个人资料与设置", "prof.username": "用户名", "prof.school": "学校",
    "prof.language": "语言", "prof.languageHint": "支持 12 种语言。默认跟随设备语言。",
    "prof.timezone": "时区（学校日程）", "prof.tzAuto": "自动（跟随设备）",
    "prof.save": "保存资料", "prof.saved": "资料已更新！",
    "prof.themeWallpaper": "主题 — 壁纸", "prof.themeAccent": "主题 — 强调色", "prof.icon": "应用图标",
    "prof.backup": "📥 备份", "prof.restore": "📤 恢复",
    "footer.brand": "© 2026 ErlanggaDev Studios · 为全球学生打造",
    "footer.privacy": "隐私政策", "tools.btn": "工具", "tools.title": "课程表工具",
    "tools.preview": "预览", "tools.import": "保存并导入",
    "banner.enable": "启用通知"
  };

  var JA = {
    "meta.title": "YourTask — 時間割とタスク",
    "user.default": "生徒", "school.default": "私の学校", "misc.loading": "読み込み中…",
    "status.badge": "授業ステータス", "status.ongoing": "授業中", "status.break": "休み時間",
    "status.period": "{n}時限目", "status.timeRange": "{start} – {end} ({tz})", "status.remaining": "残り {n} 分",
    "status.next": "次: <strong>{subject}</strong> ({time})", "status.outside": "授業時間外",
    "status.noclass": "授業なし", "status.afterDone": "今日の授業は終了しました。",
    "status.beforeStart": "授業はまだ始まっていません。1時限目は {time} ({tz}) 開始。",
    "tasks.title": "タスク一覧", "tasks.empty": "タスクはまだありません", "tasks.count": "{total} 件中 {active} 件がアクティブ",
    "tasks.add": "+ 追加", "tasks.active": "アクティブ", "tasks.completed": "完了", "tasks.all": "すべて",
    "tasks.searchPh": "タスク / 科目を検索…", "tasks.allSubjects": "— すべての科目 —",
    "sched.title": "時間割", "sched.sub": "今日の授業", "sched.now": "現在",
    "deadline.today": "今日", "deadline.tomorrow": "明日",
    "task.done": "完了", "task.delete": "削除",
    "form.addTask": "タスクを追加", "form.editTask": "タスクを編集", "form.subject": "科目",
    "form.pickSubject": "— 科目を選択 —", "form.save": "タスクを保存", "form.update": "変更を保存",
    "form.cancel": "キャンセル", "form.detail": "タスクの詳細",
    "jform.add": "授業を追加", "jform.day": "曜日", "jform.start": "開始", "jform.end": "終了",
    "jform.subject": "科目 / 活動", "jform.type": "種類", "jform.lesson": "授業",
    "jform.break": "休み時間", "jform.ceremony": "朝の集会", "jform.other": "その他",
    "jform.period": "時限番号", "jform.periodN": "{n}時限目", "jform.save": "時間割を保存",
    "prof.title": "プロフィールと設定", "prof.username": "ユーザー名", "prof.school": "学校",
    "prof.language": "言語", "prof.languageHint": "12言語に対応。デフォルトは端末の言語に従います。",
    "prof.timezone": "タイムゾーン（学校の日程）", "prof.tzAuto": "自動（端末に合わせる）",
    "prof.save": "プロフィールを保存", "prof.saved": "プロフィールを更新しました！",
    "prof.themeWallpaper": "テーマ — 壁紙", "prof.themeAccent": "テーマ — アクセントカラー", "prof.icon": "アプリアイコン",
    "prof.backup": "📥 バックアップ", "prof.restore": "📤 復元",
    "footer.brand": "© 2026 ErlanggaDev Studios · 世界の学生のために",
    "footer.privacy": "プライバシーポリシー", "tools.btn": "ツール", "tools.title": "時間割ツール",
    "tools.preview": "プレビュー", "tools.import": "保存してインポート",
    "banner.enable": "通知を有効にする"
  };

  var KO = {
    "meta.title": "YourTask — 시간표 및 과제",
    "user.default": "학생", "school.default": "우리 학교", "misc.loading": "불러오는 중…",
    "status.badge": "수업 상태", "status.ongoing": "수업 중", "status.break": "쉬는 시간",
    "status.period": "{n}교시", "status.timeRange": "{start} – {end} ({tz})", "status.remaining": "{n}분 남음",
    "status.next": "다음: <strong>{subject}</strong> ({time})", "status.outside": "수업 시간 외",
    "status.noclass": "수업 없음", "status.afterDone": "오늘 수업이 끝났습니다.",
    "status.beforeStart": "수업이 아직 시작되지 않았습니다. 1교시는 {time} ({tz}) 시작.",
    "tasks.title": "과제 목록", "tasks.empty": "아직 과제가 없습니다", "tasks.count": "총 {total}개 중 {active}개 활성",
    "tasks.add": "+ 추가", "tasks.active": "활성", "tasks.completed": "완료", "tasks.all": "전체",
    "tasks.searchPh": "과제 / 과목 검색…", "tasks.allSubjects": "— 전체 과목 —",
    "sched.title": "시간표", "sched.sub": "오늘 수업", "sched.now": "지금",
    "deadline.today": "오늘", "deadline.tomorrow": "내일",
    "task.done": "완료", "task.delete": "삭제",
    "form.addTask": "과제 추가", "form.editTask": "과제 편집", "form.subject": "과목",
    "form.pickSubject": "— 과목 선택 —", "form.save": "과제 저장", "form.update": "변경 사항 저장",
    "form.cancel": "취소", "form.detail": "과제 세부 사항",
    "jform.add": "수업 추가", "jform.day": "요일", "jform.start": "시작", "jform.end": "종료",
    "jform.subject": "과목 / 활동", "jform.type": "유형", "jform.lesson": "수업",
    "jform.break": "쉬는 시간", "jform.ceremony": "조회", "jform.other": "기타",
    "jform.period": "교시 번호", "jform.periodN": "{n}교시", "jform.save": "시간표 저장",
    "prof.title": "프로필 및 설정", "prof.username": "사용자 이름", "prof.school": "학교",
    "prof.language": "언어", "prof.languageHint": "12개 언어 지원. 기본값은 기기 언어를 따릅니다.",
    "prof.timezone": "시간대 (학교 일정)", "prof.tzAuto": "자동 (기기 따름)",
    "prof.save": "프로필 저장", "prof.saved": "프로필이 업데이트되었습니다!",
    "prof.themeWallpaper": "테마 — 배경화면", "prof.themeAccent": "테마 — 강조색", "prof.icon": "앱 아이콘",
    "prof.backup": "📥 백업", "prof.restore": "📤 복원",
    "footer.brand": "© 2026 ErlanggaDev Studios · 전 세계 학생들을 위해",
    "footer.privacy": "개인정보 처리방침", "tools.btn": "도구", "tools.title": "시간표 도구",
    "tools.preview": "미리보기", "tools.import": "저장 후 가져오기",
    "banner.enable": "알림 켜기"
  };

  var DICTS = { en: EN, id: ID, es: ES, fr: FR, pt: PT, de: DE, ru: RU, ar: AR, hi: HI, zh: ZH, ja: JA, ko: KO };

  /* ============================ Engine ============================ */
  var LS_KEY = "yourtask_lang";

  function detect() {
    try {
      var saved = localStorage.getItem(LS_KEY);
      if (saved && DICTS[saved]) return saved;
    } catch (e) {}
    var cands = (navigator.languages && navigator.languages.length) ? navigator.languages : [navigator.language || "en"];
    for (var i = 0; i < cands.length; i++) {
      var c = String(cands[i] || "").toLowerCase();
      if (DICTS[c]) return c;
      var base = c.split("-")[0];
      if (DICTS[base]) return base;
    }
    return "en";
  }

  var current = detect();

  function t(key, vars) {
    var dict = DICTS[current] || EN;
    var s = (dict[key] != null) ? dict[key] : EN[key];
    if (s == null) return key;
    if (vars) {
      s = String(s).replace(/\{(\w+)\}/g, function (m, k) {
        return (vars[k] != null) ? String(vars[k]) : m;
      });
    }
    return s;
  }

  function apply(root) {
    var scope = root || document;
    var nodes = scope.querySelectorAll("[data-i18n]");
    for (var i = 0; i < nodes.length; i++) nodes[i].textContent = t(nodes[i].getAttribute("data-i18n"));
    var htmls = scope.querySelectorAll("[data-i18n-html]");
    for (var j = 0; j < htmls.length; j++) htmls[j].innerHTML = t(htmls[j].getAttribute("data-i18n-html"));
    var phs = scope.querySelectorAll("[data-i18n-placeholder]");
    for (var k = 0; k < phs.length; k++) phs[k].setAttribute("placeholder", t(phs[k].getAttribute("data-i18n-placeholder")));
    var arias = scope.querySelectorAll("[data-i18n-aria]");
    for (var l = 0; l < arias.length; l++) arias[l].setAttribute("aria-label", t(arias[l].getAttribute("data-i18n-aria")));
    var days = scope.querySelectorAll("[data-i18n-day]");
    for (var m = 0; m < days.length; m++) days[m].textContent = dayName(parseInt(days[m].getAttribute("data-i18n-day"), 10));
    document.title = t("meta.title");
  }

  function dayName(d) {
    try {
      /* 2023-09-03 was a Sunday — offset gives a stable Sunday-based index */
      return new Intl.DateTimeFormat(localeTag(), { weekday: "long" }).format(new Date(2023, 8, 3 + (d % 7)));
    } catch (e) {
      return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][d] || "";
    }
  }

  function localeTag() {
    /* Dictionary availability ⇒ use exactly; otherwise language + region guess */
    var map = { en: "en-US", id: "id-ID", es: "es-ES", fr: "fr-FR", pt: "pt-BR", de: "de-DE", ru: "ru-RU", ar: "ar", hi: "hi-IN", zh: "zh-CN", ja: "ja-JP", ko: "ko-KR" };
    return map[current] || current;
  }

  function isRTL() {
    var l = LANGS.filter(function (x) { return x.code === current; })[0];
    return !!(l && l.rtl);
  }

  function populateSelect(sel) {
    if (!sel) return;
    sel.innerHTML = "";
    LANGS.forEach(function (l) {
      var o = document.createElement("option");
      o.value = l.code;
      o.textContent = l.name;
      sel.appendChild(o);
    });
    sel.value = current;
  }

  function setLang(code) {
    if (!DICTS[code]) return;
    current = code;
    try { localStorage.setItem(LS_KEY, code); } catch (e) {}
    document.documentElement.lang = code;
    document.documentElement.dir = isRTL() ? "rtl" : "ltr";
    apply();
    var sel = document.getElementById("input-language");
    if (sel) sel.value = code;
    try { document.dispatchEvent(new CustomEvent("langchange", { detail: { lang: code } })); } catch (e) {}
  }

  function init() {
    document.documentElement.lang = current;
    document.documentElement.dir = isRTL() ? "rtl" : "ltr";
    apply();
    var sel = document.getElementById("input-language");
    if (sel) {
      populateSelect(sel);
      sel.addEventListener("change", function () { setLang(sel.value); });
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  /* Public API (used by script.js) */
  window.I18N = {
    t: t,
    apply: apply,
    setLang: setLang,
    dayName: dayName,
    localeTag: localeTag,
    LANGS: LANGS
  };
  Object.defineProperty(window.I18N, "locale", { get: function () { return current; } });
})();

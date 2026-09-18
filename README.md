# YourTask — Jadwal & Tugas Sekolah

> Jadwal pelajaran, countdown KBM real-time, alarm deadline otomatis — semua lokal, terenkripsi, tanpa akun, tanpa iklan.

**YourTask** adalah PWA (Progressive Web App) untuk siswa: tahu kapan pelajaran dimulai, sisa berapa menit jam pelajaran berjalan, dan tugas mana yang mepet deadline — tanpa registrasi, tanpa server, tanpa iklan. Seluruh data disimpan **terenkripsi AES-256-GCM di perangkat** (IndexedDB).

Dikembangkan oleh [ryzenrfor-spec](https://github.com/ryzenrfor-spec) · generasi kedua dari [LiliTask](https://github.com/ryzenrfor-spec) (versi 1).

---

## ✨ Fitur

| Fitur | Detail |
|---|---|
| 🕒 **Countdown KBM real-time** | Tahu posisi jam pelajaran saat ini dan sisa waktunya, zona Asia/Jakarta, detik demi detik |
| ⏰ **Alarm deadline pintar** | Notifikasi tugas yang jatuh tempo ≤24 jam, dikaitkan dengan jadwal — jelas kapan kelas mapel itu berikutnya |
| 🔄 **Pembersihan tugas otomatis** | Tugas mingguan direset saat pekan berganti, mengikuti hari aktif yang dipilih |
| 🤖 **Pindai AI (Gemini)** | Foto atau PDF jadwal sekolah langsung jadi jadwal digital — pakai API key Gemini gratis milikmu sendiri |
| 🔐 **Enkripsi AES-256-GCM** | Standar NIST via Web Crypto API; kunci non-extractable, data tak terbaca dari luar aplikasi |
| 📴 **Offline-first** | Service worker cache-first — jalan penuh tanpa internet |
| 🧭 **Sinkronisasi waktu** | Offset server (RTT-compensated) menjaga alarm tetap akurat meski jam perangkat salah |
| 📅 **Jam aktif fleksibel** | Pilih hari sekolah aktif; Sabtu/Minggu dihormati di semua perhitungan |
| 💾 **Backup & restore JSON** | Ekspor/impor seluruh data kapan pun — format terbuka |
| 🚫 **Nol akun, nol iklan, nol tracking** | Privasi bukan fitur — arsitektur |

## 🚀 Cara pakai

**Web (langsung):** buka [ryzenrfor-spec.github.io/YourTask](https://ryzenrfor-spec.github.io/YourTask/) → *Install app* / *Tambahkan ke layar utama* dari menu browser.

**Pindai AI:** ambil API key gratis di [aistudio.google.com/apikey](https://aistudio.google.com/apikey) → menu **Alat** → tempel key → simpan. Key tersimpan terenkripsi di perangkatmu.

## 🏗️ Teknologi

```
Vanilla JavaScript · Web Crypto API · IndexedDB · Service Worker
Cache-first PWA · Web Notifications · Periodic Background Sync
```

Tanpa framework, tanpa build step, tanpa dependency runtime — ~100KB statis.

## 🔒 Privasi

- Semua data (jadwal, tugas, profil, API key) disimpan **lokal dan terenkripsi** — detail lengkap di [Kebijakan Privasi](privacy.html)
- Layanan eksternal yang dihubungi hanya saat dipakai: Gemini API (fitur Pindai AI, eksplisit) dan WorldTimeAPI (sinkron waktu)
- Tidak ada analytics, tidak ada cookie, tidak ada data yang keluar dari perangkat

## 🗺️ Roadmap

- [ ] i18n — dukungan bahasa Inggris (persiapan pasar global)
- [ ] Proxy API key (opsional) — scan AI tanpa perlu key sendiri
- [ ] Sinkronisasi antar perangkat, E2E-encrypted
- [ ] Packaging Android via TWA untuk Google Play

## 📄 Lisensi

Hak cipta © 2026 Erlangga Dev Studios · Dibuat dengan ❤️ oleh seorang siswa, untuk siswa.
Kontak: erlanggadev.studios@gmail.com

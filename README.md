# YourTask — Class Schedule & Tasks

> Class schedule, real-time session countdown, automatic deadline reminders — fully local, encrypted, no account, no ads.

**YourTask** is a Progressive Web App for students: know when your next lesson starts, how many minutes are left in the current one, and which tasks are due within 24 hours — without registration, servers, or advertising. All data is stored **AES-256-GCM encrypted on the device** (IndexedDB).

**Developed by ErlanggaDev Studios** · Contact: erlanggadev.studios@gmail.com · Second generation of [LiliTask](https://github.com/ryzenrfor-spec) (v1).

---

## ✨ Features

| Feature | Detail |
|---|---|
| 🕒 **Real-time session tracking** | Know the current period and how long it will run, down to the second, in your device's time zone |
| ⏰ **Smart deadline reminders** | Notifications for tasks due within 24 hours, linked to the schedule — always showing when that class starts next |
| 🌍 **12 languages** | Formal English base + Indonesian, Spanish, French, Portuguese, German, Russian, Arabic (RTL), Hindi, Chinese, Japanese, Korean — follows the device language by default |
| 🔄 **Automatic task cleanup** | Weekly tasks reset when the school week rolls over, respecting the configured active days |
| 🤖 **AI Scan (Gemini)** | A photo or PDF of a school timetable becomes a digital schedule in one tap — using your own free Gemini API key |
| 📋 **Paste-to-import** | Copy a timetable from Excel, Word, or WhatsApp and paste it; the parser understands day names in many languages |
| 🔐 **AES-256-GCM encryption** | NIST standard via the Web Crypto API; non-extractable key — data is unreadable from outside the app |
| 🎨 **Themes & custom icon** | Gradient presets, gallery wallpaper with a crop editor (pan/pinch/zoom), custom accent color, custom in-app icon |
| 📴 **Offline-first** | Cache-first service worker — fully functional without internet |
| 🧭 **Time synchronization** | RTT-compensated server offset keeps alarms accurate even when the device clock is wrong |
| 📅 **Flexible school days** | Choose the active school days; non-active days are respected in every calculation |
| 💾 **Backup & restore (JSON)** | Export/import everything at any time — open format |
| 🚫 **Zero accounts, zero ads, zero tracking** | Privacy is not a feature — it is the architecture |

## 🚀 Getting started

**Web (direct):** open [ryzenrfor-spec.github.io/YourTask](https://ryzenrfor-spec.github.io/YourTask/) → *Install app* / *Add to Home Screen* from the browser menu.

**AI Scan:** get a free key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey) → open **Tools** → paste the key → save. The key is stored encrypted on your device.

**Language:** Profile → Language. The default follows the device language; the explicit choice is remembered.

## 🔐 Privacy

No accounts. No analytics. No advertising SDKs. Data never leaves the device (except the two opt-in cases described in the [Privacy Policy](privacy.html): public time sync and the direct-to-Google AI scan). The encryption key is non-extractable by browser guarantee.

## 🏗️ Tech stack

Vanilla JavaScript (ES2017+), PWA (service worker + web app manifest), IndexedDB + Web Crypto API, no frameworks, no build step.

## 🗺️ Roadmap

- [ ] Play Store release (via Trusted Web Activity)
- [ ] Multi-class schedule profiles
- [ ] Optional encrypted cloud sync
- [ ] Widget / quick tile support

## ©️ License & credits

© 2026 ErlanggaDev Studios. All rights reserved.

Built for students, worldwide.

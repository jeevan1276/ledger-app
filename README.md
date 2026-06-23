# Ledger App

A local-first, encrypted digital khata (ledger) for shop owners. Replaces the paper credit book — track what customers owe and what you owe suppliers, all stored securely on a single phone with no backend server.

---

## Features (Phase 1)
- 🔒 Encrypted local database (SQLCipher) — unreadable without your PIN
- 🔑 Biometric unlock with PIN fallback
- 👥 Contacts — customers and suppliers in one list
- 📒 Per-contact ledger with full transaction history
- 📊 Dashboard — total receivable, payable, net position
- 💾 Encrypted backup & restore — export to Drive/email, restore on any phone
- 📱 SMS reminders — one tap to send a balance reminder via native messaging app

## Tech Stack
- React Native + Expo SDK 56
- TypeScript
- expo-sqlite (SQLCipher encrypted)
- expo-secure-store (OS keychain/keystore)
- expo-local-authentication (biometric + PIN)
- No backend — everything lives on device

---

## Milestones

| # | Milestone | Status |
|---|---|---|
| M0 | Project setup & dev client | ✅ Done |
| M1 | Encrypted DB foundation | ✅ Done |
| M2 | App lock (PIN + biometric) | 🔄 In progress |
| M3 | Data layer: schema + balance logic | ⬜ Pending |
| M4 | Contacts UI | ⬜ Pending |
| M5 | Transactions UI | ⬜ Pending |
| M6 | Dashboard | ⬜ Pending |
| M7 | Backup & Restore | ⬜ Pending |
| M8 | SMS reminders | ⬜ Pending |
| M9 | Polish | ⬜ Pending |

---

## Project Structure
```
ui/             screens & components
domain/         pure functions — balance calc, validation, constants
services/       encryption, lock, backup, SMS — wraps native APIs
repositories/   Contact & Transaction CRUD (only layer that touches the DB)
db/             schema, migrations, SQLite connection
docs/           build guide and project notes
```

## Getting Started

> This project uses a custom dev client — **Expo Go will not work**.

```bash
npm install
npx expo prebuild
npx expo run:android
```

Open the installed app on your phone (not Expo Go). On first launch, set a 4-digit PIN.

---

## Build Guide
See [`docs/BUILD_GUIDE.md`](docs/BUILD_GUIDE.md) for the full step-by-step guide including environment setup, all hurdles encountered, and milestone-by-milestone progress.
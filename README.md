# YouPlusPlus 🧠💪🍎

**You++** este o platformă web de dezvoltare personală care îmbină nutriție, fitness, mindfulness și jurnal emoțional, într-o experiență modernă, securizată și gamificată.

---

## 🎯 Funcționalități principale

- ✅ Autentificare securizată (JWT)
- 📅 Monitorizare zilnică a obiceiurilor
- 📈 Streaks & badge-uri pentru motivație
- 🧘‍♀️ Sesiuni de meditație ghidate & timer cu feedback emoțional
- ✍️ Jurnal personal criptat AES
- 🍽️ Planuri de nutriție și antrenament adaptate
- 📐 Calculator BMI cu feedback vizual
- 🔐 Algoritmi personalizați în funcție de obiectiv, nivel, sex

---
Întoarce recomandarea duratei de meditație pe baza istoricului user-ului, folosind Bayesian smoothing.

{
  "stats": {
    "300": { "count": 2, "mean": 4.5, "posterior": 4.7 },
    "600": { "count": 5, "mean": 3.2, "posterior": 3.3 },
    "1200": { "count": 0, "mean": 0, "posterior": 2.1 }
  },
  "bestDuration": 300,
  "message": "Pentru tine, 5 minute par cele mai bune (∅ 4.7)."
}

## ⚠️ Disclaimer Medical

> **⚠️ Informațiile oferite în această aplicație NU constituie sfaturi medicale. Consultați un medic sau nutriționist autorizat pentru recomandări personalizate.**

---

## 🛠️ Instalare locală

### 1. Clonează repository-ul

git clone https://github.com/<username>/youplusplus.git
cd youplusplus

2. Instalează dependențele

cd backend
npm install
cd ../frontend
npm install

3. Setează variabilele de mediu
Creează fișier .env în backend/:

PORT=5000
MONGO_URI=...
JWT_SECRET=
JOURNAL_SECRET=
Creează fișier .env în frontend/:
VITE_JOURNAL_SECRET=

4. Pornește aplicația

bash
Copiază
# Backend
cd backend
npm run dev

# Frontend
cd ../frontend
npm run dev
Aplicația va rula pe:
🖥️ http://localhost:5173 (frontend)
🛡️ http://localhost:5000 (API backend)

🧪 Tehnologii folosite
React + Vite

TailwindCSS

Express + MongoDB + Mongoose

JWT Auth

CryptoJS (AES encryption)

Toast Notifications

RESTful API


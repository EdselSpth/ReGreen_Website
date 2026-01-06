# ReGreen Website 🌱

**ReGreen_Website** adalah aplikasi website berbasis **full-stack** yang dikembangkan untuk mendukung platform **ReGreen**.
Website ini menggunakan **Laravel sebagai Frontend (Blade)** dan **Node.js sebagai Backend (REST API)**.

---

## 🧩 Reminder Arsitektur

* **Frontend** : Laravel (Blade Template)
* **Backend** : Node.js (Express / REST API)
* **Database** : MySQL
* **Arsitektur** : Client–Server (Frontend mengonsumsi API Backend)

---

## 📁 Struktur Project

```
ReGreen_Website/
├── backend/        # Backend Node.js (API)
├── frontend/       # Frontend Laravel (Blade)
├── .vscode/        # Config VS Code
├── package.json    # Dependency Node.js
└── README.md
```

---

## 🚀 Cara Menjalankan Project

### 🧠 Prasyarat

Pastikan sudah terinstall:

* Node.js (v16+)
* PHP (v8+)
* Composer
* MySQL
* npm

---

## ⚙️ Setup Backend (Node.js)

1. Masuk ke folder backend:

   ```bash
   cd backend
   ```

2. Install dependency:

   ```bash
   npm install
   ```

3. Atur koneksi database di file `.env`

4. Jalankan server backend:

   ```bash
   npm start
   ```

Backend akan berjalan pada:

```
http://localhost:3000
```

---

## 🎨 Setup Frontend (Laravel)

1. Masuk ke folder frontend:

   ```bash
   cd frontend
   ```

2. Install dependency Laravel:

   ```bash
   composer install
   ```

3. Copy file environment:

   ```bash
   cp .env.example .env
   ```

4. Generate app key:

   ```bash
   php artisan key:generate
   ```

5. Atur konfigurasi API Backend di `.env`:

   ```env
   API_URL=http://localhost:3000
   ```

6. Jalankan server Laravel:

   ```bash
   php artisan serve
   ```

Frontend akan berjalan di:

```
http://localhost:8000
```

---

## 🔗 Alur Sistem

1. User mengakses website Laravel
2. Laravel (Blade) memanggil API Node.js
3. Node.js memproses logic & database
4. Response dikirim kembali ke frontend

---

## 🛠 Teknologi yang Digunakan

### Frontend

* Laravel
* Blade Template
* CSS
* JavaScript

### Backend

* Node.js
* Express.js
* MySQL

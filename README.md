# Event Ticketing API

Backend REST API untuk platform manajemen event dan penjualan tiket. Project ini dibangun menggunakan Node.js, Express, dan Prisma ORM dengan database SQLite (Development).

## 🚀 Fitur Utama

- **Otentikasi & Otorisasi**: Register, Login, Refresh Token (JWT), dan Role-Based Access Control (Admin vs User).
- **Manajemen Event**: CRUD Event dengan fitur Pagination, Search, Filtering, dan Sorting.
- **Manajemen Kategori**: Pengelompokan event berdasarkan kategori.
- **Ticketing System**: Pembelian tiket dengan validasi stok dan *concurrency safety* (Atomic Transaction).
- **Keamanan**: Proteksi menggunakan Helmet, Rate Limiting, dan validasi input (Joi).

## 🛠️ Tech Stack

- **Runtime**: Node.js v18+
- **Framework**: Express.js
- **Database**: SQLite (Dev)
- **ORM**: Prisma
- **Auth**: JWT (JSON Web Token) & Bcrypt
- **Validation**: Joi

## 📂 Struktur Project

├── prisma/             # Schema DB, Migrations, Seeder
├── src/
│   ├── config/         # Konfigurasi DB & JWT
│   ├── controllers/    # Logika Bisnis
│   ├── middleware/     # Auth, Error, Logger, Validation
│   ├── routes/         # Definisi Endpoint API
│   ├── utils/          # Helper (Response Formatter)
│   ├── validators/     # Schema Validasi Joi
│   └── app.js          # Entry Point App
└── ...

## 📦 Cara Install & Menjalankan

1. **Clone Repository**
   ```bash
   git clone <https://github.com/muhammadfarrasajid/Backend-Event-Ticketing.git>
   cd project-backend
   ```
2. **Install Dependencies**
   ```bash
   npm install
   ```
3. **Setup Environment**
   Copy file .env.example menjadi .env.
   Isi variabel environment sesuai kebutuhan (JWT Secret, dll).
4. **Setup Database**
   ```bash
   npx prisma migrate dev --name init
   npx prisma db seed
   ```
5. **Run Server**
   ```bash
   npm run dev
   ```
   Server akan berjalan di http://localhost:3000.

## 🧪 Testing
Gunakan Postman untuk menguji endpoint. Koleksi endpoint lengkap dapat dilihat di file API-DOCS.md.
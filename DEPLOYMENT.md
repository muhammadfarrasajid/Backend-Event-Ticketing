# Deployment Report

## 🌐 Production Details
- **URL API**: `http://54.197.200.110` (Tanpa Port, via Nginx Reverse Proxy)
- **Health Check**: `http://54.197.200.110/`
- **IP Address**: `54.197.200.110`
- **Platform**: AWS EC2 (Learner Lab)
- **OS**: Ubuntu Server 22.04 LTS
- **Instance Type**: t2.micro

## 🔑 Test Credentials
Gunakan akun berikut untuk pengujian autentikasi dan fitur admin:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@test.com` | `password123` |
| **User** | `wise@test.com` | `password123` |

---

## 📋 Langkah Deployment

### 1. Persiapan Server (AWS EC2)
1. Launch Instance Ubuntu 22.04 di AWS Academy.
2. Setup Security Group:
   - Allow SSH (Port 22)
   - Allow HTTP (Port 80)
   - Allow Custom TCP (Port 3000)
3. Connect via SSH:
   ```bash
   ssh -i "labsuser.pem" ubuntu@<public-ip>
   ```

### 2. Setup Environment
1. Update Package:
```bash
sudo apt update && sudo apt upgrade -y
```
2. Install Node.js v18 & NPM:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs -y
```
3. Install Git, PM2, & Nginx:
```bash
sudo apt install git nginx -y
sudo npm install -g pm2
```

### 3. Instalasi Aplikasi
1. Clone Repository:
```bash
git clone https://github.com/muhammadfarrasajid/Backend-Event-Ticketing.git
cd Backend-Event-Ticketing
```
2. Install Dependencies:
```bash
npm install
```
3. Setup Environment Variables:
- Buat file .env baru dengan konfigurasi Production.
- Variabel yang wajib diset:
   - PORT=3000
   - NODE_ENV=production
   - DATABASE_URL="file:./dev.db"
   - JWT_SECRET (Min 32 chars)
   - JWT_REFRESH_SECRET (Min 32 chars)
   - JWT_EXPIRES_IN (Format: 15m)
   - JWT_REFRESH_EXPIRES_IN (Format: 7d)

4. Setup Database:
```bash
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
```

### 4. Konfigurasi Nginx (Reverse Proxy)
- File konfigurasi di /etc/nginx/sites-available/backend-api:
```bash
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 5. Menjalankan Aplikasi (PM2)
1. Start Aplikasi:
```bash
pm2 start src/app.js --name "backend-api"
```
2. Setup Startup Script (Auto-restart saat reboot):
```bash
pm2 startup
pm2 save
```

## 🛠️ Monitoring & Maintenance
Cara Monitoring
- Cek Status: pm2 status
- Cek Logs: pm2 logs --lines 50
- Monitor Resource: pm2 monit (CPU/Memory)

Prosedur Update Aplikasi
- Jika ada perubahan kode dari GitHub:
   1. git pull origin main
   2. npm install (jika ada dependency baru)
   3. npx prisma migrate deploy (jika ada perubahan DB)
   4. pm2 restart backend-api

Troubleshooting (Known Issues)
- Issue: Error 500 "expiresIn should be a number" saat login. Penyebab: Ketidakcocokan nama variabel antara kode (src/config/jwt.js) dan file .env. Kode menggunakan JWT_EXPIRES_IN, sedangkan di .env awalnya tertulis JWT_ACCESS_EXPIRATION.
- Solusi: Menyesuaikan nama variabel di file .env server agar sama persis dengan yang diminta oleh konfigurasi kode (JWT_EXPIRES_IN), lalu restart PM2.
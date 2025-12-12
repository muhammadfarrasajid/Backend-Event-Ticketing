# Deployment Report

## 1. Project Information
- **Repository GitHub**: `https://github.com/muhammadfarrasajid/Backend-Event-Ticketing.git`
- **Production URL**: `http://107.21.128.123`
- **Health Check URL**: `http://107.21.128.123/`

## 2. AWS EC2 Details
- **IP Address**: `107.21.128.123`
- **Instance ID**: `i-026fb6d1404fc1bf4` 
- **Region**: `United States (N. Virginia)`
- **OS**: Ubuntu Server 22.04 LTS
- **Instance Type**: t2.micro

## 3. Test Credentials
Gunakan akun berikut untuk pengujian autentikasi dan fitur admin:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@test.com` | `password123` |
| **User** | `wise@test.com` | `password123` |

---

## 4. Langkah Deployment (Step-by-Step)

### Step 1: Persiapan Server
1. Launch Instance Ubuntu 22.04 di AWS Academy.
2. Setup Security Group (Inbound Rules):
   - SSH (Port 22) - My IP/Anywhere
   - HTTP (Port 80) - Anywhere
   - Custom TCP (Port 3000) - Anywhere
3. Connect via SSH:
   ```bash
   ssh -i "labsuser.pem" ubuntu@107.21.128.123
   ```

### Step 2: Setup Environment
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

### Step 3: Instalasi Aplikasi
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

### Step 4: Konfigurasi Nginx (Reverse Proxy)
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
- Link ke sites-enabled dan restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/backend-api /etc/nginx/sites-enabled/
sudo systemctl restart nginx
```

### Step 5: Menjalankan Aplikasi (PM2)
1. Start Aplikasi:
```bash
pm2 start src/server.js --name "backend-api"
```
2. Setup Startup Script (Auto-restart saat reboot):
```bash
pm2 startup
pm2 save
```

## 5. Langkah Verifikasi
Untuk memastikan deployment berhasil, lakukan tes berikut:
   - Health Check: Akses http://107.21.128.123/ di browser. Harus me-return JSON { "status": "success", "message":"Server is running","timestamp":"","uptime":}.
   - API Login: Gunakan Postman ke POST http://107.21.128.123/api/auth/login dengan credential Admin di atas.
   - Cek Database: Pastikan data seed (seperti kategori/event awal) muncul saat akses GET /api/events.

## 6. Monitoring & Maintenance
Cara Monitoring
- Cek Status: pm2 status
- Cek Logs Real-time: pm2 logs --lines 50
- Monitor Resource (CPU/RAM): pm2 monit

Maintenance (Prosedur Update)
- Jika ada perubahan kode dari GitHub:
   - git pull origin main
   - npm install (jika ada dependency baru)
   - npx prisma migrate deploy (jika ada perubahan DB)
   - pm2 restart backend-api

Troubleshooting (Known Issues)
- Issue: Error 500 "expiresIn should be a number" saat login. Penyebab: Ketidakcocokan nama variabel antara kode (src/config/jwt.js) dan file .env. Kode menggunakan JWT_EXPIRES_IN, sedangkan di .env awalnya tertulis JWT_ACCESS_EXPIRATION.
- Solusi: Menyesuaikan nama variabel di file .env server agar sama persis dengan yang diminta oleh konfigurasi kode (JWT_EXPIRES_IN), lalu restart PM2.
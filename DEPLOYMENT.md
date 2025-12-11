# Deployment Report

## 🌐 Production Details
- **URL API**: `http://[MASUKKAN_IP_PUBLIC_AWS_DISINI]:3000`
- **IP Address**: `[MASUKKAN_IP_PUBLIC_AWS_DISINI]`
- **Platform**: AWS EC2 (Learner Lab)
- **OS**: Ubuntu Server 22.04 LTS
- **Instance Type**: t2.micro

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

### 2. Setup Environment
1. Update Package:
   ```bash
   sudo apt update && sudo apt upgrade -y
2. Install Node.js v18 & NPM
3. Install Git & PM2:
   ```bash
   sudo apt install git
   sudo npm install -g pm2

### 3. Instalasi Aplikasi
1. Clone Repository:
   ```bash
   git clone <https://github.com/muhammadfarrasajid/Backend-Event-Ticketing.git>
   cd project-backend
   ```
2. Install Dependencies:
   ```bash
   npm install
   ```
3. Setup Environment Variables:
   Buat file .env dan isi sesuai .env.example tapi dengan data production.
4. Setup Database:
   ```bash
   npx prisma generate
   npx prisma migrate deploy
   npx prisma db seed
   ```

### 4. Menjalankan Aplikasi (PM2)
1. Start Aplikasi:
   ```bash
   pm2 start src/app.js --name "backend-api"
   ```
2. Setup Startup Script (Auto-restart saat reboot):
   ```bash
   pm2 startup
   pm2 save
   ```

## 🛠️ Monitoring
- Cek status aplikasi: pm2 status
- Cek logs: pm2 logs
- Monitor resource: pm2 monit
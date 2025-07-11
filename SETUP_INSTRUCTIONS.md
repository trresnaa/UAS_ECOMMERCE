# Setup Instructions - Fashion E-commerce

## Langkah 1: Setup Database MySQL

1. **Buka phpMyAdmin** di browser Anda (biasanya http://localhost/phpmyadmin)

2. **Import Database:**
   - Klik tab "Import"
   - Pilih file `database.sql` yang sudah dibuat
   - Klik "Go" untuk mengimport database

3. **Verifikasi Database:**
   - Database `fashion_ecommerce` akan dibuat
   - Tabel-tabel akan dibuat otomatis
   - Data default akan dimasukkan

## Langkah 2: Setup Environment Variables

1. **Buat file `.env`** di root folder project
2. **Copy isi dari file `env-config.txt`** ke file `.env`

## Langkah 3: Install Dependencies

```bash
npm install
cd client
npm install
cd ..
```

## Langkah 4: Jalankan Aplikasi

```bash
npm run dev
```

## Akun Default

### Customer Account:
- **Email:** tresnacust@gmail.com
- **Password:** Tresnajaya2004

### Admin Account:
- **Email:** tresnaadmin@gmail.com
- **Password:** Tresnajaya2004

## Struktur Database

Database akan berisi:
- **users** - Data pengguna (customer & admin)
- **categories** - Kategori produk
- **products** - Data produk
- **orders** - Data pesanan
- **user_addresses** - Alamat pengguna

## Sample Data

Database sudah berisi:
- 4 kategori produk (Pakaian, Sepatu, Aksesoris, Tas)
- 5 produk sample
- 2 akun default (customer & admin)

## Troubleshooting

1. **Error "Access denied":**
   - Pastikan MySQL berjalan di XAMPP
   - Cek konfigurasi database di file `.env`

2. **Error "Module not found":**
   - Jalankan `npm install` di root dan folder client

3. **Port 5000 sudah digunakan:**
   - Ganti PORT di file `.env` menjadi port lain (misal: 3001) 
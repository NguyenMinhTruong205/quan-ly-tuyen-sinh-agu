# 🎓 Dự Án Quản Lý Tuyển Sinh / Tuyển Sinh AGU (QLTS AGU)

Dự án được khởi tạo và cấu hình bởi bộ phận **DevOps** (DevOps 1 & DevOps 2).

---

## 📁 Cấu trúc thư mục (Monorepo)

```text
QLTSAGU/
├── backend/                  # Mã nguồn Backend (Node.js, Express, Mongoose, Gemini SDK)
│   ├── server.js             # File máy chủ chính & API Health Check
│   ├── .env.example          # Mẫu biến môi trường cho Backend
│   ├── .env                  # Biến môi trường thật (đã được gitignore)
│   └── package.json
│
├── frontend/                 # Mã nguồn Frontend (Next.js App Router, React 19)
│   ├── src/                  # Mã nguồn giao diện & API routes
│   │   ├── app/              # Trang chủ & Route handlers (/api/health)
│   │   └── lib/              # Helpers kết nối MongoDB & Google Gemini
│   ├── .env.example          # Mẫu biến môi trường cho Frontend
│   ├── .env.local            # Biến môi trường thật (đã được gitignore)
│   └── package.json
│
├── .gitignore                # Chặn rò rỉ file .env và node_modules lên GitHub
└── README.md
```

---

## ⚙️ Hướng dẫn cài đặt & Chạy cục bộ (Local)

### 1. Cấu hình biến môi trường (.env)
* Trong thư mục `backend/`: Sao chép file `.env.example` thành `.env` rồi điền `MONGODB_URI` và `GEMINI_API_KEY`.
* Trong thư mục `frontend/`: Sao chép file `.env.example` thành `.env.local` rồi điền các biến tương tự.

### 2. Chạy Backend (Cổng 5000)
```bash
cd backend
npm install
npm run dev
# Mở trình duyệt: http://localhost:5000 (Kiểm tra health: http://localhost:5000/api/health)
```

### 3. Chạy Frontend (Cổng 3000)
```bash
cd frontend
npm install
npm run dev
# Mở trình duyệt: http://localhost:3000
```

---

## ☁️ Hướng dẫn Deploy cho DevOps 2

* **Deploy Frontend lên Vercel**:
  1. Kết nối repo GitHub với Vercel.
  2. Chọn Root Directory là `frontend`.
  3. Thêm các biến môi trường từ `frontend/.env.example` vào mục **Environment Variables** trên Vercel.
  4. Bấm **Deploy**.

* **Deploy Backend lên Render**:
  1. Chọn **New Web Service** trên Render kết nối với repo GitHub.
  2. Cấu hình **Root Directory**: `backend`.
  3. **Build Command**: `npm install`.
  4. **Start Command**: `npm start`.
  5. Thêm các biến `MONGODB_URI`, `GEMINI_API_KEY` vào mục **Environment** trên Render.
  6. Bấm **Deploy**.
# quan-ly-tuyen-sinh-agu

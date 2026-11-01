# 🎓 HỆ THỐNG QUẢN LÝ TUYỂN SINH AGU (QLTSAGU)

Hệ thống hỗ trợ thí sinh đăng ký, tra cứu hồ sơ tuyển sinh trực tuyến và quản trị viên/cán bộ xét duyệt hồ sơ tự động hóa cho Trường Đại học An Giang (AGU).

---

## 🏗 Cấu Trúc Dự Án (Monorepo)

```text
QLTSAGU/
├── backend/                  # Mã nguồn Backend (Node.js, Express, Mongoose, Gemini SDK)
│   ├── controllers/          # Xử lý logic nghiệp vụ (Auth, Hồ sơ, Thẩm định)
│   ├── middleware/           # Phân quyền JWT (chiCanBo, xacThucToken)
│   ├── models/               # Schema Mongoose (User, HoSoTuyenSinh)
│   ├── routes/               # API Endpoints (/api/auth, /api/ho-so)
│   ├── server.js             # Máy chủ chính & API Health Check
│   ├── .env.example          # Mẫu biến môi trường cho Backend
│   └── package.json
│
├── frontend/                 # Mã nguồn Frontend (Next.js App Router, React 19)
│   ├── src/
│   │   ├── app/              # Giao diện chính (/dang-nhap, /admin/dashboard, /nop-ho-so)
│   │   └── lib/              # Helpers kết nối MongoDB & Google Gemini
│   ├── .env.example          # Mẫu biến môi trường cho Frontend
│   ├── .env.local            # Biến môi trường thật (chứa NEXT_PUBLIC_API_URL)
│   └── package.json
│
├── .gitignore                # Chặn rò rỉ file .env và node_modules lên GitHub
└── README.md                 # Tài liệu hướng dẫn dự án

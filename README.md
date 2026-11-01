# 🎓 HỆ THỐNG QUẢN LÝ ĐÀO TẠO SAU ĐẠI HỌC (AGU)

## 📌 Giới thiệu dự án

Hệ thống hỗ trợ quản lý toàn bộ quy trình đào tạo sau đại học (Thạc sĩ, Tiến sĩ), bao gồm các phân hệ: Xét tuyển & Nhập học, Quản lý Chương trình đào tạo, Lập kế hoạch & Thời khóa biểu, Quản lý Điểm & Học phí, và Xét Tốt nghiệp.

---

## 👥 Danh sách thành viên & Phân công vai trò

| STT | Mã sinh viên | Họ và tên | Vai trò phân công | Email |
| :---: | :--- | :--- | :--- | :--- |
| **1** | `DPM235491` | Nguyễn Minh Trường | **Product Owner (PO) / Team Lead** | `truong_dpm235491@student.agu.edu.vn` |
| **2** | `DPM235481` | Đặng Kim Thảo | **Backend Developer** | `thao_dpm235481@student.agu.edu.vn` |
| **2** | `DPM235497` | Trần Thị Thúy Vi | **Backend Developer** | `vi_dpm235497@student.agu.edu.vn` |
| **3** | `DPM235503` | Lê Thị Kim Yến | **Frontend / Mobile Developer** | `yen_dpm235503@student.agu.edu.vn` |
| **3** | `DPM235461` | Trương Thị Huỳnh Như | **Frontend / Mobile Developer** | `nhu_dpm235461@student.agu.edu.vn` |
| **4** | `DPM235405` | Lê Thị Kim Anh | **DevOps / Cloud Engineer** | `anh_dpm235405@student.agu.edu.vn` |
| **4** | `DPM235515` | Lê Thị Yến Nhi | **DevOps / Cloud Engineer** | `nhi_dpm235515@student.agu.edu.vn` |
| **5** | `DPM235442` | Lương Gia Linh | **QA / Security & Data Specialist** | `linh_dpm235442@student.agu.edu.vn` |

---

## 🏗 Cấu trúc thư mục dự án

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
└── README.md                 # Tài liệu hướng dẫn dự án & Phân công nhóm

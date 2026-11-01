"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    matKhau: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");

    if (!apiUrl) {
      setError("Chưa cấu hình địa chỉ Backend. Vui lòng kiểm tra file .env.local.");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${apiUrl}/api/auth/dang-nhap`,
        {
          email: form.email.trim(),
          matKhau: form.matKhau,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 15000,
        }
      );

      const { token, user } = res.data || {};

      if (!token || !user) {
        throw new Error("Máy chủ không trả về đủ thông tin đăng nhập.");
      }

      const userInfo = {
        id: user.id || user._id,
        hoTen: user.hoTen,
        email: user.email,
        vaiTro: user.vaiTro,
      };

      const vaiTro = String(user.vaiTro || "")
        .trim()
        .toLowerCase();

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminInfo");

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userInfo));

      if (["can_bo", "admin"].includes(vaiTro)) {
        localStorage.setItem("adminToken", token);
        localStorage.setItem("adminInfo", JSON.stringify(userInfo));

        router.replace("/admin/dashboard");
      } else if (vaiTro === "thi_sinh") {
        router.replace("/nop-ho-so");
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        throw new Error(
          `Tài khoản có vai trò "${user.vaiTro}" chưa được hỗ trợ.`
        );
      }
    } catch (err) {
      console.error("Lỗi đăng nhập:", err.response?.data || err);

      if (err.response?.status === 401) {
        setError("Email hoặc mật khẩu không chính xác, hoặc tài khoản không được phép đăng nhập.");
      } else if (err.response?.status === 403) {
        setError("Tài khoản không có quyền truy cập.");
      } else if (err.code === "ERR_NETWORK") {
        setError("Không kết nối được Backend. Hãy kiểm tra địa chỉ máy chủ và kết nối mạng.");
      } else {
        setError(
          err.response?.data?.message ||
          err.message ||
          "Đăng nhập thất bại."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f0f2f5",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial, sans-serif",
        padding: 20,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: 30,
          borderRadius: 10,
          width: 400,
          maxWidth: "100%",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          boxSizing: "border-box",
        }}
      >
        <h2 style={{ textAlign: "center", color: "#1a73e8", marginBottom: 20 }}>
          🔑 Đăng Nhập Hệ Thống
        </h2>

        <form
          onSubmit={handleLogin}
          style={{ display: "flex", flexDirection: "column", gap: 15 }}
        >
          <div>
            <label style={{ display: "block", fontWeight: "bold", marginBottom: 5, color: "#333" }}>
              Email:
            </label>
            <input
              type="email"
              name="email"
              placeholder="Nhập email của bạn..."
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="username"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: "block", fontWeight: "bold", marginBottom: 5, color: "#333" }}>
              Mật khẩu:
            </label>
            <input
              type="password"
              name="matKhau"
              placeholder="Nhập mật khẩu..."
              value={form.matKhau}
              onChange={handleChange}
              required
              autoComplete="current-password"
              style={inputStyle}
            />
          </div>

          {error && (
            <div
              role="alert"
              style={{
                color: "#b91c1c",
                background: "#fee2e2",
                padding: 12,
                borderRadius: 6,
                fontSize: 14,
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? "#94a3b8" : "#28a745",
              color: "#fff",
              padding: 12,
              border: "none",
              borderRadius: 5,
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: "bold",
              fontSize: 16,
              marginTop: 10,
            }}
          >
            {loading ? "Đang đăng nhập..." : "Đăng Nhập"}
          </button>
        </form>

        <div
          style={{
            textAlign: "center",
            marginTop: 20,
            paddingTop: 15,
            borderTop: "1px solid #eee",
          }}
        >
          <p style={{ margin: 0, fontSize: 14, color: "#64748b" }}>
            Hoặc đăng nhập bằng mã OTP →{" "}
            <a
              href="/yeu-cau-otp-dang-nhap"
              style={{
                color: "#2563eb",
                fontWeight: "bold",
                textDecoration: "none",
              }}
            >
              Nhận mã OTP ngay
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: 10,
  borderRadius: 5,
  border: "1px solid #ccc",
  boxSizing: "border-box",
};
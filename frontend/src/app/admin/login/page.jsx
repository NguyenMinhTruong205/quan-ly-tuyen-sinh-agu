"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const API_BASE = "http://localhost:5000";

export default function AdminLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("admin@agu.edu.vn");
  const [matKhau, setMatKhau] = useState("123456");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${API_BASE}/api/auth/dang-nhap`,
        {
          email: email.trim(),
          matKhau,
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

      // Chỉ chấp nhận vai trò cán bộ do backend trả về.
      if (user.vaiTro !== "can_bo") {
        setError(
          "Tài khoản này không có quyền truy cập khu vực cán bộ. Vui lòng kiểm tra vai trò tài khoản trong cơ sở dữ liệu."
        );
        return;
      }

      // Xóa phiên cũ để tránh lấy nhầm thông tin tài khoản trước đó.
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminInfo");

      // Lưu phiên đăng nhập thống nhất cho Navigation và các trang quản trị.
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("adminToken", token);
      localStorage.setItem("adminInfo", JSON.stringify(user));

      // Thông báo cho các component trong cùng tab cập nhật trạng thái.
      window.dispatchEvent(new Event("authChanged"));

      router.replace("/admin/dashboard");
      router.refresh();
    } catch (err) {
      console.error("Lỗi đăng nhập cán bộ:", err);

      if (err.response) {
        setError(
          err.response.data?.message ||
            `Đăng nhập thất bại (HTTP ${err.response.status}).`
        );
      } else if (err.code === "ECONNABORTED") {
        setError(
          "Kết nối đến máy chủ quá thời gian. Hãy kiểm tra Backend rồi thử lại."
        );
      } else if (err.request) {
        setError(
          "Không kết nối được Backend tại localhost:5000. Hãy kiểm tra máy chủ có đang chạy không."
        );
      } else {
        setError(
          err.message || "Đã xảy ra lỗi. Vui lòng thử lại."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "13px 14px",
    border: "1px solid #d1d9e6",
    borderRadius: 10,
    fontSize: 14,
    boxSizing: "border-box",
    outline: "none",
    background: "#ffffff",
    color: "#1e293b",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        boxSizing: "border-box",
        background: "linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          background: "#ffffff",
          padding: "42px 40px",
          borderRadius: 18,
          boxShadow: "0 12px 40px rgba(20, 43, 74, 0.12)",
          width: "100%",
          maxWidth: 420,
          boxSizing: "border-box",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              width: 56,
              height: 56,
              background: "#142b4a",
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              fontSize: 24,
              color: "#ffffff",
            }}
          >
            🎓
          </div>

          <div
            style={{
              fontSize: 13,
              color: "#64748b",
              marginBottom: 6,
            }}
          >
            AGU · Hệ thống tuyển sinh
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: 24,
              color: "#142b4a",
              fontWeight: 700,
            }}
          >
            Đăng nhập Cán bộ
          </h1>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 18 }}>
            <label
              htmlFor="admin-email"
              style={{
                display: "block",
                marginBottom: 7,
                fontSize: 14,
                fontWeight: 600,
                color: "#334155",
              }}
            >
              Email
            </label>

            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
              disabled={loading}
              style={inputStyle}
              placeholder="Nhập email cán bộ"
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label
              htmlFor="admin-password"
              style={{
                display: "block",
                marginBottom: 7,
                fontSize: 14,
                fontWeight: 600,
                color: "#334155",
              }}
            >
              Mật khẩu
            </label>

            <input
              id="admin-password"
              type="password"
              value={matKhau}
              onChange={(e) => setMatKhau(e.target.value)}
              autoComplete="current-password"
              required
              disabled={loading}
              style={inputStyle}
              placeholder="Nhập mật khẩu"
            />
          </div>

          {error && (
            <div
              role="alert"
              style={{
                background: "#fef2f2",
                color: "#b91c1c",
                border: "1px solid #fecaca",
                padding: "11px 14px",
                borderRadius: 10,
                marginBottom: 18,
                fontSize: 13,
                lineHeight: 1.6,
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: 14,
              background: loading ? "#94a3b8" : "#142b4a",
              color: "#ffffff",
              border: "none",
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <div
          style={{
            textAlign: "center",
            marginTop: 22,
            fontSize: 12,
            color: "#64748b",
            lineHeight: 1.6,
          }}
        >
          Dành cho tài khoản cán bộ tuyển sinh AGU.
        </div>
      </div>
    </div>
  );
}

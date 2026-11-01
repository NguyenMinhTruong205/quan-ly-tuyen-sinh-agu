"use client";

import { useEffect, useState } from "react";

export default function SystemPage() {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const checkHealth = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/health", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Máy chủ phản hồi lỗi HTTP ${response.status}`);
      }

      const data = await response.json();
      setHealthData(data);
    } catch (err) {
      setError(err.message || "Không thể kết nối đến máy chủ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const databaseConnected =
    healthData?.database?.status === "connected";

  const hasMongoUri = healthData?.environment?.hasMongoUri;
  const hasGeminiKey = healthData?.environment?.hasGeminiApiKey;

  const StatusCard = ({ title, status, detail }) => (
    <div style={cardStyle}>
      <div style={cardHeaderStyle}>
        <strong style={{ color: "#19365f" }}>{title}</strong>
        <span
          style={{
            ...statusStyle,
            background: status ? "#dcfce7" : "#fff7ed",
            color: status ? "#15803d" : "#c2410c",
          }}
        >
          {status ? "● SẴN SÀNG" : "○ CHƯA SẴN SÀNG"}
        </span>
      </div>
      <p style={detailStyle}>{detail}</p>
    </div>
  );

  return (
    <main style={pageStyle}>
      <div style={containerStyle}>
        <div style={headingStyle}>
          <div>
            <div style={eyebrowStyle}>QUẢN TRỊ HỆ THỐNG</div>
            <h1 style={titleStyle}>Tình trạng hệ thống</h1>
            <p style={subtitleStyle}>
              Theo dõi máy chủ, cơ sở dữ liệu và dịch vụ AI của hệ thống AGU.
            </p>
          </div>

          <button
            onClick={checkHealth}
            disabled={loading}
            style={{
              ...buttonStyle,
              opacity: loading ? 0.6 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Đang kiểm tra..." : "↻ Kiểm tra lại"}
          </button>
        </div>

        {error && (
          <div style={errorStyle}>
            Không thể kiểm tra hệ thống: {error}
          </div>
        )}

        <div style={gridStyle}>
          <StatusCard
            title="Next.js Server"
            status={!error}
            detail="Máy chủ giao diện và ứng dụng Next.js."
          />

          <StatusCard
            title="MongoDB Database"
            status={databaseConnected}
            detail={
              healthData?.database?.message ||
              "Đang chờ dữ liệu kiểm tra."
            }
          />

          <StatusCard
            title="MongoDB URI"
            status={Boolean(hasMongoUri)}
            detail={
              hasMongoUri
                ? "Biến môi trường MongoDB đã được nạp."
                : "Chưa tìm thấy biến MONGODB_URI."
            }
          />

          <StatusCard
            title="Google Gemini API"
            status={Boolean(hasGeminiKey)}
            detail={
              hasGeminiKey
                ? "Đã tìm thấy cấu hình Gemini API Key."
                : "Chưa tìm thấy GEMINI_API_KEY."
            }
          />
        </div>

        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Thông tin kiểm tra</h2>

          {healthData ? (
            <div style={infoListStyle}>
              <div style={infoRowStyle}>
                <span>Dự án</span>
                <strong>
                  {healthData.project || "QLTS AGU"}
                </strong>
              </div>

              <div style={infoRowStyle}>
                <span>Vai trò máy chủ</span>
                <strong>
                  {healthData.role || "Backend Service"}
                </strong>
              </div>

              <div style={infoRowStyle}>
                <span>Trạng thái</span>
                <strong style={{ color: "#15803d" }}>
                  {healthData.status || "Đã nhận phản hồi"}
                </strong>
              </div>

              <div style={infoRowStyle}>
                <span>Cơ sở dữ liệu</span>
                <strong>
                  {healthData.database?.status || "Chưa xác định"}
                </strong>
              </div>
            </div>
          ) : (
            <p style={detailStyle}>
              {loading
                ? "Đang lấy thông tin từ máy chủ..."
                : "Chưa có dữ liệu. Hãy nhấn Kiểm tra lại."}
            </p>
          )}
        </section>

        <section style={noticeStyle}>
          <strong>🔐 Lưu ý bảo mật</strong>
          <p>
            Không hiển thị hoặc chia sẻ giá trị thật của MongoDB URI
            và Gemini API Key trên giao diện công khai.
          </p>
        </section>
      </div>
    </main>
  );
}

const pageStyle = {
  minHeight: "calc(100vh - 80px)",
  padding: "40px 20px",
  background: "#f5f8fd",
  color: "#19365f",
};

const containerStyle = {
  maxWidth: "1200px",
  margin: "0 auto",
};

const headingStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: "20px",
  marginBottom: "30px",
};

const eyebrowStyle = {
  color: "#3478ce",
  fontSize: "12px",
  fontWeight: 800,
  letterSpacing: "1.5px",
  marginBottom: "10px",
};

const titleStyle = {
  margin: 0,
  fontSize: "30px",
  fontWeight: 900,
};

const subtitleStyle = {
  color: "#718096",
  fontSize: "14px",
  lineHeight: 1.7,
};

const buttonStyle = {
  border: "none",
  borderRadius: "10px",
  padding: "13px 20px",
  background: "#2563b9",
  color: "#fff",
  fontWeight: 800,
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "18px",
};

const cardStyle = {
  padding: "23px",
  border: "1px solid #e5edf7",
  borderRadius: "16px",
  background: "#fff",
  boxShadow: "0 5px 20px rgba(20, 55, 95, 0.05)",
};

const cardHeaderStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "15px",
};

const statusStyle = {
  padding: "6px 10px",
  borderRadius: "20px",
  fontSize: "11px",
  fontWeight: 800,
};

const detailStyle = {
  marginTop: "15px",
  color: "#718096",
  fontSize: "13px",
  lineHeight: 1.7,
};

const sectionStyle = {
  marginTop: "25px",
  padding: "25px",
  border: "1px solid #e5edf7",
  borderRadius: "16px",
  background: "#fff",
};

const sectionTitleStyle = {
  margin: "0 0 20px",
  fontSize: "19px",
};

const infoListStyle = {
  display: "flex",
  flexDirection: "column",
};

const infoRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: "10px",
  padding: "14px 0",
  borderBottom: "1px solid #edf1f6",
  color: "#64748b",
  fontSize: "14px",
};

const errorStyle = {
  marginBottom: "20px",
  padding: "15px",
  borderRadius: "10px",
  background: "#fff1f2",
  color: "#be123c",
  border: "1px solid #fecdd3",
};

const noticeStyle = {
  marginTop: "22px",
  padding: "20px",
  borderRadius: "13px",
  background: "#eff6ff",
  color: "#1e4f87",
  fontSize: "13px",
  lineHeight: 1.8,
};
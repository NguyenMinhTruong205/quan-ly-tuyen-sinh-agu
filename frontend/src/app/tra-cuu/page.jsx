"use client";

import { useState } from "react";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://quan-ly-tuyen-sinh-agu-1.onrender.com";

const STATUS_MAP = {
  "Chờ thẩm định": { label: "Chờ thẩm định", bg: "#fff7df", color: "#986313" },
  cho_tham_dinh: { label: "Chờ thẩm định", bg: "#fff7df", color: "#986313" },
  "Cần bổ sung hồ sơ": { label: "Cần bổ sung hồ sơ", bg: "#fff0f1", color: "#b4233b" },
  can_bo_sung: { label: "Cần bổ sung hồ sơ", bg: "#fff0f1", color: "#b4233b" },
  "Không đạt": { label: "Không đạt", bg: "#fff0f0", color: "#b4233b" },
  khong_dat: { label: "Không đạt", bg: "#fff0f0", color: "#b4233b" },
  "Trúng tuyển": { label: "Trúng tuyển", bg: "#e8f9ec", color: "#21743a" },
  trung_tuyen: { label: "Trúng tuyển", bg: "#e8f9ec", color: "#21743a" },
};

export default function TraCuuPage() {
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();

    const value = keyword.trim();

    if (!value) {
      setResult(null);
      setError("Vui lòng nhập mã hồ sơ hoặc số CCCD.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await axios.get(
        `${API_BASE}/api/ho-so/tra-cuu`,
        {
          params: { keyword: value },
          headers: { Accept: "application/json" },
        }
      );

      console.log("Dữ liệu tra cứu Backend trả về:", response.data);

      // ✅ Linh hoạt lấy dữ liệu hoSo từ mọi kiểu response Backend trả về
      let rawData = response.data?.data || response.data?.hoSo || response.data;

      // Nếu Backend trả về mảng danh sách hồ sơ, lấy phần tử đầu tiên
      if (Array.isArray(rawData)) {
        rawData = rawData[0];
      }

      if (!rawData || typeof rawData !== "object" || Object.keys(rawData).length === 0) {
        setError(response.data?.message || "Không tìm thấy hồ sơ phù hợp.");
        return;
      }

      // ✅ Chuẩn hóa map linh hoạt các trường dữ liệu
      const formattedData = {
        hoTen: rawData.hoTen || rawData.user?.hoTen || "Thí sinh",
        maHoSo: rawData.maHoSo || rawData._id?.slice(-6).toUpperCase() || "Đã cấp",
        cccd: rawData.cccd || rawData.user?.cccd || value,
        nganhDangKy: rawData.nganhDangKy || rawData.nganhXetTuyen || "Công nghệ thông tin",
        diemXetTuyen: rawData.diemXetTuyen ?? rawData.tongDiem ?? "Chưa cập nhật",
        trangThai: rawData.trangThai || rawData.status || "Chờ thẩm định",
        mshv: rawData.mshv || rawData.maSinhVien || "",
        emailSinhVien: rawData.emailSinhVien || rawData.email || "",
        ghiChuThamDinh: rawData.ghiChuThamDinh || rawData.ghiChu || ""
      };

      setResult(formattedData);
    } catch (err) {
      console.error("Lỗi tra cứu hồ sơ:", err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response) {
        setError("Máy chủ không thể tìm thấy hồ sơ với thông tin vừa nhập.");
      } else {
        setError("Không kết nối được Backend. Vui lòng thử lại sau.");
      }
    } finally {
      setLoading(false);
    }
  };

  const status = result
    ? STATUS_MAP[result.trangThai] || {
        label: result.trangThai || "Chờ thẩm định",
        bg: "#fff7df",
        color: "#986313",
      }
    : null;

  const isAdmitted =
    result?.trangThai === "Trúng tuyển" ||
    result?.trangThai === "trung_tuyen";

  const needsSupplement =
    result?.trangThai === "Cần bổ sung hồ sơ" ||
    result?.trangThai === "can_bo_sung";

  const isFailed =
    result?.trangThai === "Không đạt" ||
    result?.trangThai === "khong_dat";

  return (
    <div className="page">
      {/* TIÊU ĐỀ */}
      <section className="hero">
        <div className="hero-inner">
          <div className="eyebrow">AGU · HỆ THỐNG TUYỂN SINH</div>
          <h1>Tra cứu hồ sơ tuyển sinh</h1>
          <p>
            Theo dõi tình trạng xử lý hồ sơ và kết quả xét tuyển
            nhanh chóng, thuận tiện.
          </p>
        </div>
      </section>

      {/* NỘI DUNG CHÍNH */}
      <main className="main-content">
        <section className="search-card">
          <div className="section-heading">
            <div className="search-icon">⌕</div>
            <div>
              <h2>Nhập thông tin tra cứu</h2>
              <p>
                Nhập số CCCD hoặc mã hồ sơ để xem kết quả xét tuyển.
              </p>
            </div>
          </div>

          <form onSubmit={handleSearch}>
            <label htmlFor="keyword">
              Mã hồ sơ hoặc số CCCD
            </label>

            <div className="search-row">
              <input
                id="keyword"
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Nhập CCCD hoặc mã hồ sơ..."
                autoComplete="off"
                disabled={loading}
              />

              <button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner" />
                    Đang tra cứu
                  </>
                ) : (
                  <>
                    <span className="button-icon">⌕</span>
                    Tra cứu hồ sơ
                  </>
                )}
              </button>
            </div>

            <p className="form-hint">
              Vui lòng nhập chính xác thông tin đã đăng ký.
            </p>
          </form>

          {error && (
            <div className="error-box" role="alert">
              <strong>Không thể tra cứu hồ sơ</strong>
              <p>{error}</p>
            </div>
          )}
        </section>

        {/* KẾT QUẢ */}
        {result && (
          <section className="result-card">
            <div className="result-header">
              <div>
                <div className="result-eyebrow">THÔNG TIN HỒ SƠ</div>
                <h2>Kết quả tra cứu</h2>
              </div>

              <span
                className="status-badge"
                style={{
                  backgroundColor: status.bg,
                  color: status.color,
                }}
              >
                <span className="status-dot" />
                {status.label}
              </span>
            </div>

            <div className="divider" />

            <div className="info-grid">
              <InfoItem label="Họ và tên" value={result.hoTen} />

              <InfoItem
                label="Mã hồ sơ"
                value={result.maHoSo}
              />

              <InfoItem
                label="Số CCCD"
                value={result.cccd}
                mask
              />

              <InfoItem
                label="Ngành đăng ký"
                value={result.nganhDangKy}
              />

              <InfoItem
                label="Điểm xét tuyển"
                value={result.diemXetTuyen}
              />

              {result.mshv && (
                <InfoItem
                  label="Mã số sinh viên"
                  value={result.mshv}
                  highlight
                />
              )}

              {result.emailSinhVien && (
                <InfoItem
                  label="Email sinh viên"
                  value={result.emailSinhVien}
                  highlight
                />
              )}
            </div>

            {result.ghiChuThamDinh && (
              <div className="note-box">
                <strong>Thông báo từ bộ phận tuyển sinh</strong>
                <p>{result.ghiChuThamDinh}</p>
              </div>
            )}

            {isAdmitted && (
              <div className="success-box">
                <span className="notice-icon">✓</span>
                <div>
                  <strong>Chúc mừng bạn đã trúng tuyển!</strong>
                  <p>
                    Vui lòng theo dõi thông báo chính thức và email
                    sinh viên để nhận hướng dẫn nhập học.
                  </p>
                </div>
              </div>
            )}

            {needsSupplement && (
              <div className="warning-box">
                <strong>Hồ sơ cần bổ sung</strong>
                <p>
                  Vui lòng kiểm tra thông báo từ bộ phận tuyển sinh
                  để hoàn thiện hồ sơ.
                </p>
              </div>
            )}

            {isFailed && (
              <div className="failure-box">
                <strong>Kết quả xét tuyển chưa đạt</strong>
                <p>
                  Vui lòng theo dõi thông báo chính thức của nhà trường.
                </p>
              </div>
            )}

            <p className="privacy-note">
              Vui lòng không chia sẻ mã hồ sơ và thông tin cá nhân
              của bạn cho người khác.
            </p>
          </section>
        )}

        {!result && !loading && !error && (
          <div className="help-box">
            <span className="help-icon">i</span>
            <p>
              Bạn có thể sử dụng mã hồ sơ đã được cấp hoặc số CCCD
              đã đăng ký để tra cứu tình trạng xét tuyển.
            </p>
          </div>
        )}
      </main>

      {/* CHÂN TRANG */}
      <footer className="footer">
        <div className="footer-brand">QUẢN LÝ TUYỂN SINH AGU</div>
        <p>Hệ thống hỗ trợ tra cứu hồ sơ tuyển sinh.</p>
        <span>
          Vui lòng liên hệ bộ phận tuyển sinh nếu cần hỗ trợ.
        </span>
      </footer>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: #f5f6fc;
          color: #263754;
          font-family: Arial, Helvetica, sans-serif;
        }

        .hero {
          color: #ffffff;
          background: linear-gradient(115deg, #243b68, #344f80);
        }

        .hero-inner {
          width: min(1100px, 90%);
          margin: 0 auto;
          padding: 30px 0 32px;
        }

        .eyebrow {
          margin-bottom: 8px;
          color: #d2e0fb;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1.5px;
        }

        .hero h1 {
          margin: 0;
          font-size: clamp(26px, 3vw, 34px);
          line-height: 1.3;
        }

        .hero p {
          margin: 10px 0 0;
          color: #e2eafa;
          font-size: 14px;
          line-height: 1.7;
        }

        .main-content {
          flex: 1;
          width: min(800px, 92%);
          margin: 42px auto 55px;
        }

        .search-card,
        .result-card {
          padding: 30px 32px;
          border: 1px solid #e6e9f2;
          border-radius: 19px;
          background: #ffffff;
          box-shadow: 0 10px 34px rgba(32, 50, 83, 0.06);
        }

        .section-heading {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 27px;
        }

        .search-icon {
          width: 50px;
          height: 50px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          background: #edf2ff;
          color: #2854a1;
          font-size: 30px;
        }

        .section-heading h2,
        .result-header h2 {
          margin: 0;
          color: #233958;
          font-size: 21px;
          line-height: 1.4;
        }

        .section-heading p {
          margin: 5px 0 0;
          color: #7c8aa0;
          font-size: 13px;
          line-height: 1.6;
        }

        form label {
          display: block;
          margin-bottom: 10px;
          color: #354760;
          font-size: 14px;
          font-weight: 700;
        }

        .search-row {
          display: flex;
          gap: 12px;
        }

        .search-row input {
          width: 0;
          min-width: 0;
          flex: 1;
          height: 54px;
          padding: 0 16px;
          border: 1px solid #d7deeb;
          border-radius: 11px;
          outline: none;
          background: #ffffff;
          color: #263754;
          font-size: 15px;
          transition: 0.2s;
        }

        .search-row input:focus {
          border-color: #567ec1;
          box-shadow: 0 0 0 3px #eaf0ff;
        }

        .search-row button {
          min-width: 142px;
          min-height: 54px;
          padding: 0 18px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: none;
          border-radius: 11px;
          background: #243b68;
          color: #ffffff;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s;
        }

        .search-row button:hover:not(:disabled) {
          background: #31568e;
        }

        .search-row button:disabled {
          opacity: 0.7;
          cursor: wait;
        }

        .button-icon {
          font-size: 20px;
        }

        .form-hint {
          margin: 13px 0 0;
          color: #8591a5;
          font-size: 12px;
          line-height: 1.6;
        }

        .spinner {
          width: 15px;
          height: 15px;
          border: 2px solid #ffffff70;
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        .error-box {
          margin-top: 19px;
          padding: 15px 17px;
          border: 1px solid #f6cccc;
          border-radius: 11px;
          background: #fff5f5;
          color: #a82d3b;
          font-size: 14px;
          line-height: 1.6;
          overflow-wrap: anywhere;
        }

        .error-box p {
          margin: 5px 0 0;
        }

        .result-card {
          margin-top: 25px;
          animation: fadeIn 0.3s ease;
        }

        .result-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 14px;
        }

        .result-eyebrow {
          margin-bottom: 7px;
          color: #8493ab;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.4px;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 14px;
          border-radius: 30px;
          font-size: 12px;
          font-weight: 800;
        }

        .status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: currentColor;
        }

        .divider {
          height: 1px;
          margin: 23px 0;
          background: #edf0f5;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 23px 24px;
        }

        .note-box,
        .success-box,
        .warning-box,
        .failure-box {
          margin-top: 24px;
          padding: 16px 17px;
          border-radius: 12px;
          font-size: 13px;
          line-height: 1.7;
        }

        .note-box {
          border: 1px solid #d7e3f5;
          background: #f6f9ff;
          color: #345782;
        }

        .success-box {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          border: 1px solid #bcebc9;
          background: #f1fbf4;
          color: #216b37;
        }

        .notice-icon {
          width: 27px;
          height: 27px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #dcf6e3;
          font-weight: 800;
        }

        .warning-box {
          border: 1px solid #f5d5a5;
          background: #fff8ed;
          color: #8e5117;
        }

        .failure-box {
          border: 1px solid #f4caca;
          background: #fff5f5;
          color: #a82d3b
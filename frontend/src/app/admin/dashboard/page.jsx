
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://quan-ly-tuyen-sinh-agu-1.onrender.com';

const statusDisplay = {
  cho_duyet: "Chờ duyệt",
  cho_tham_dinh: "Chờ duyệt",
  trung_tuyen: "Đã duyệt",
  can_bo_sung: "Cần bổ sung",
  khong_dat: "Không đạt",
};

const statusColors = {
  "Chờ duyệt": { color: "#9A6700", bg: "#FFF4D6", dot: "#E6A323" },
  "Đã duyệt": { color: "#137547", bg: "#DDF8E9", dot: "#20A464" },
  "Cần bổ sung": { color: "#BE3345", bg: "#FFE5E7", dot: "#E34D59" },
  "Không đạt": { color: "#8B3340", bg: "#FCE8EA", dot: "#C94B5B" },
};

function hienThiTrangThai(status) {
  return statusDisplay[status] || status || "Chưa xác định";
}

function layToken() {
  if (typeof window === "undefined") return null;

  return (
    localStorage.getItem("adminToken") ||
    localStorage.getItem("token")
  );
}

export default function AdminDashboard() {
  const router = useRouter();

  const [hoSo, setHoSo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [capNhatLuc, setCapNhatLuc] = useState(null);

  async function taiDuLieu() {
    try {
      setLoading(true);
      setError("");

      const token = layToken();

      if (!token) {
        setError(
          "Không tìm thấy token đăng nhập. Vui lòng đăng nhập lại."
        );
        return;
      }

      const res = await axios.get(`${API_BASE}/api/ho-so`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data =
        res.data.danhSach ||
        res.data.data ||
        res.data;

      if (!Array.isArray(data)) {
        throw new Error("Dữ liệu hồ sơ từ Backend không hợp lệ.");
      }

      const danhSach = data.map((item) => ({
        id: item._id,
        maHoSo:
          item.maHoSo ||
          item._id?.slice(-6)?.toUpperCase() ||
          "N/A",
        hoTen: item.hoTen || "Chưa có tên",
        cccd: item.cccd || "",
        nganh: item.nganhDangKy || "Chưa có thông tin",
        trangThai: hienThiTrangThai(item.trangThai),
        diem:
          item.diemXetTuyen !== undefined &&
          item.diemXetTuyen !== null &&
          item.diemXetTuyen !== ""
            ? Number(item.diemXetTuyen)
            : null,
        ngayNop: item.createdAt || item.ngayNop || null,
      }));

      setHoSo(danhSach);
      setCapNhatLuc(new Date());
    } catch (err) {
      console.error("Lỗi tải Dashboard:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Không thể tải dữ liệu từ Backend."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    taiDuLieu();
  }, []);

  const thongKe = useMemo(() => {
    const dem = (trangThai) =>
      hoSo.filter((item) => item.trangThai === trangThai).length;

    const diemHopLe = hoSo
      .map((item) => item.diem)
      .filter(
        (diem) =>
          diem !== null &&
          Number.isFinite(diem) &&
          diem >= 0 &&
          diem <= 30
      );

    const tongDiem = diemHopLe.reduce(
      (tong, diem) => tong + diem,
      0
    );

    return {
      tong: hoSo.length,
      choDuyet: dem("Chờ duyệt"),
      daDuyet: dem("Đã duyệt"),
      canBoSung: dem("Cần bổ sung"),
      khongDat: dem("Không đạt"),
      coDiem: diemHopLe.length,
      diemTrungBinh: diemHopLe.length
        ? tongDiem / diemHopLe.length
        : null,
    };
  }, [hoSo]);

  const tiLe = (soLuong) =>
    thongKe.tong > 0
      ? Math.round((soLuong / thongKe.tong) * 100)
      : 0;

  const hoSoGanDay = useMemo(() => {
    return [...hoSo]
      .sort((a, b) => {
        if (!a.ngayNop) return 1;
        if (!b.ngayNop) return -1;

        return (
          new Date(b.ngayNop).getTime() -
          new Date(a.ngayNop).getTime()
        );
      })
      .slice(0, 5);
  }, [hoSo]);

  const styles = {
    page: {
      minHeight: "100vh",
      background: "#F4F7FC",
      color: "#243957",
      fontFamily: "Arial, Helvetica, sans-serif",
    },
    container: {
      maxWidth: 1450,
      margin: "0 auto",
      padding: "30px clamp(16px, 3vw, 38px)",
    },
    card: {
      background: "#FFFFFF",
      border: "1px solid #E4EAF4",
      borderRadius: 16,
      padding: 22,
      boxShadow: "0 5px 20px rgba(32, 57, 92, 0.04)",
      minWidth: 0,
    },
    button: {
      padding: "10px 15px",
      border: "1px solid #D9E4F5",
      borderRadius: 10,
      background: "#FFFFFF",
      color: "#2859A5",
      fontSize: 13,
      fontWeight: 700,
      cursor: "pointer",
    },
  };

  const cards = [
    {
      label: "Tổng hồ sơ",
      value: thongKe.tong,
      desc: "Tất cả hồ sơ được tải",
      icon: "▤",
      color: "#3975E8",
      bg: "#EDF4FF",
    },
    {
      label: "Chờ duyệt",
      value: thongKe.choDuyet,
      desc: "Đang chờ xét duyệt",
      icon: "◷",
      color: "#D99112",
      bg: "#FFF6E3",
    },
    {
      label: "Đã duyệt",
      value: thongKe.daDuyet,
      desc: "Đã trúng tuyển",
      icon: "✓",
      color: "#159765",
      bg: "#E8FAF1",
    },
    {
      label: "Cần bổ sung",
      value: thongKe.canBoSung,
      desc: "Cần hoàn thiện hồ sơ",
      icon: "!",
      color: "#DE4B5C",
      bg: "#FFF0F1",
    },
  ];

  const bieuDo = [
    { label: "Chờ duyệt", value: thongKe.choDuyet, color: "#E6A323" },
    { label: "Đã duyệt", value: thongKe.daDuyet, color: "#20A464" },
    { label: "Cần bổ sung", value: thongKe.canBoSung, color: "#E34D59" },
    { label: "Không đạt", value: thongKe.khongDat, color: "#8B7BB8" },
  ];

  return (
    <main style={styles.page}>
      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 18px;
        }

        .analysis-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
          gap: 20px;
          margin-top: 22px;
        }

        .stat-card {
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 28px rgba(32, 57, 92, 0.09);
        }

        .recent-row {
          display: grid;
          grid-template-columns: minmax(90px, 0.7fr) minmax(130px, 1.4fr) minmax(110px, 1fr);
          align-items: center;
          gap: 12px;
          padding: 15px 0;
          border-bottom: 1px solid #EDF1F7;
        }

        @media (max-width: 950px) {
          .dashboard-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .analysis-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 520px) {
          .dashboard-grid {
            gap: 10px;
          }

          .stat-card {
            padding: 15px !important;
          }

          .recent-row {
            grid-template-columns: 1fr;
            gap: 7px;
          }
        }
      `}</style>

      <div style={styles.container}>
        {/* Tiêu đề */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 18,
            marginBottom: 28,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                letterSpacing: 1.5,
                fontWeight: 800,
                color: "#6580A7",
                marginBottom: 8,
              }}
            >
              AGU · HỆ THỐNG TUYỂN SINH
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: 29,
                lineHeight: 1.3,
                color: "#19365F",
                fontWeight: 800,
              }}
            >
              Dashboard tổng quan
            </h1>

            <p
              style={{
                margin: "8px 0 0",
                color: "#71829B",
                fontSize: 14,
              }}
            >
              Theo dõi tình hình tiếp nhận và xét duyệt hồ sơ tuyển sinh.
            </p>
          </div>

          {/* Chỉ giữ nút tải lại dữ liệu, đã bỏ nút đăng xuất trùng */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={taiDuLieu}
              disabled={loading}
              style={{
                ...styles.button,
                opacity: loading ? 0.65 : 1,
              }}
            >
              {loading ? "Đang tải..." : "↻  Tải lại dữ liệu"}
            </button>
          </div>
        </header>

        {error && (
          <div
            role="alert"
            style={{
              background: "#FFF0F1",
              border: "1px solid #FFDADD",
              color: "#A72F42",
              padding: 16,
              borderRadius: 12,
              marginBottom: 22,
              fontSize: 14,
            }}
          >
            <strong>Không tải được dữ liệu.</strong>
            <p style={{ margin: "6px 0 12px" }}>{error}</p>
            <button
              type="button"
              onClick={taiDuLieu}
              style={{
                ...styles.button,
                color: "#A72F42",
                borderColor: "#F4BFC6",
              }}
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Thẻ thống kê */}
        <section>
          <div style={{ marginBottom: 15 }}>
            <h2
              style={{
                margin: 0,
                color: "#203A60",
                fontSize: 19,
                fontWeight: 800,
              }}
            >
              Tổng quan tuyển sinh
            </h2>
            <p
              style={{
                margin: "6px 0 0",
                color: "#8493A9",
                fontSize: 13,
              }}
            >
              Các chỉ số được tính từ dữ liệu hồ sơ Backend trả về.
            </p>
          </div>

          <div className="dashboard-grid">
            {cards.map((item) => (
              <article
                className="stat-card"
                key={item.label}
                style={{
                  ...styles.card,
                  borderTop: `3px solid ${item.color}`,
                  padding: 21,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#637792",
                    }}
                  >
                    {item.label}
                  </span>

                  <span
                    style={{
                      display: "grid",
                      placeItems: "center",
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      background: item.bg,
                      color: item.color,
                      fontSize: 23,
                      fontWeight: 800,
                    }}
                  >
                    {item.icon}
                  </span>
                </div>

                <div
                  style={{
                    marginTop: 19,
                    fontSize: 35,
                    lineHeight: 1,
                    fontWeight: 800,
                    color: "#1B3559",
                  }}
                >
                  {loading ? "—" : item.value}
                </div>

                <p
                  style={{
                    margin: "12px 0 0",
                    fontSize: 12,
                    color: "#8796AC",
                  }}
                >
                  {item.desc}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Biểu đồ và thống kê điểm */}
        <section className="analysis-grid">
          <article style={styles.card}>
            <div style={{ marginBottom: 24 }}>
              <h2
                style={{
                  margin: 0,
                  fontSize: 18,
                  color: "#203A60",
                }}
              >
                Phân bố trạng thái hồ sơ
              </h2>
              <p
                style={{
                  margin: "7px 0 0",
                  fontSize: 13,
                  color: "#8796AC",
                }}
              >
                Tỷ lệ của từng trạng thái trên tổng số hồ sơ.
              </p>
            </div>

            {loading ? (
              <p style={{ color: "#71829B" }}>Đang tải thống kê...</p>
            ) : thongKe.tong === 0 ? (
              <div
                style={{
                  padding: "25px 0",
                  color: "#71829B",
                  fontSize: 14,
                }}
              >
                Chưa có dữ liệu để thống kê.
              </div>
            ) : (
              <div style={{ display: "grid", gap: 24 }}>
                {bieuDo.map((item) => {
                  const phanTram = tiLe(item.value);

                  return (
                    <div key={item.label}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 12,
                          marginBottom: 10,
                        }}
                      >
                        <span
                          style={{
                            color: "#526783",
                            fontSize: 13,
                            fontWeight: 600,
                          }}
                        >
                          {item.label}
                        </span>

                        <span
                          style={{
                            color: "#203A60",
                            fontSize: 13,
                            fontWeight: 800,
                          }}
                        >
                          {item.value} hồ sơ · {phanTram}%
                        </span>
                      </div>

                      <div
                        style={{
                          height: 10,
                          background: "#EDF1F7",
                          borderRadius: 20,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${phanTram}%`,
                            height: "100%",
                            background: item.color,
                            borderRadius: 20,
                            transition: "width 0.3s",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div
              style={{
                marginTop: 25,
                paddingTop: 17,
                borderTop: "1px solid #EDF1F7",
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                color: "#71829B",
                fontSize: 12,
              }}
            >
              <span>Tổng số hồ sơ</span>
              <strong style={{ color: "#203A60" }}>
                {loading ? "—" : thongKe.tong}
              </strong>
            </div>
          </article>

          <article style={styles.card}>
            <div style={{ marginBottom: 23 }}>
              <h2
                style={{
                  margin: 0,
                  fontSize: 18,
                  color: "#203A60",
                }}
              >
                Kết quả điểm xét tuyển
              </h2>
              <p
                style={{
                  margin: "7px 0 0",
                  color: "#8796AC",
                  fontSize: 13,
                }}
              >
                Tổng hợp điểm hiện có từ Backend.
              </p>
            </div>

            <div
              style={{
                background: "#EDF4FF",
                border: "1px solid #DCE8FF",
                borderRadius: 14,
                padding: 22,
              }}
            >
              <div style={{ color: "#56739D", fontSize: 13 }}>
                Điểm trung bình
              </div>

              <div
                style={{
                  color: "#285FC3",
                  fontSize: 39,
                  fontWeight: 800,
                  margin: "12px 0 8px",
                }}
              >
                {loading
                  ? "—"
                  : thongKe.diemTrungBinh === null
                    ? "Chưa có"
                    : thongKe.diemTrungBinh.toFixed(2)}
              </div>

              <div style={{ color: "#7187A9", fontSize: 12 }}>
                {loading
                  ? "Đang tải dữ liệu"
                  : `Có điểm: ${thongKe.coDiem}/${thongKe.tong} hồ sơ`}
              </div>
            </div>

            <div
              style={{
                marginTop: 18,
                padding: 15,
                borderRadius: 12,
                background: "#F8FAFD",
                color: "#6D7F98",
                fontSize: 12,
                lineHeight: 1.7,
              }}
            >
              <strong style={{ color: "#435B7B" }}>
                Lưu ý
              </strong>
              <br />
              Điểm trung bình chỉ tính các điểm hợp lệ từ 0 đến 30
              được Backend trả về. Việc thay đổi điểm cần được thực
              hiện tại chức năng quản lý hồ sơ có hỗ trợ lưu điểm.
            </div>
          </article>
        </section>

        {/* Danh sách gần đây */}
        <section style={{ ...styles.card, marginTop: 22 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 14,
              flexWrap: "wrap",
              marginBottom: 12,
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 18,
                  color: "#203A60",
                }}
              >
                Hồ sơ gần đây
              </h2>
              <p
                style={{
                  margin: "7px 0 0",
                  fontSize: 13,
                  color: "#8796AC",
                }}
              >
                Danh sách rút gọn để theo dõi tình hình xử lý.
              </p>
            </div>

            <button
              type="button"
              onClick={() => router.push("/admin/ho-so")}
              style={{
                ...styles.button,
                background: "#EDF4FF",
                borderColor: "#DCE8FF",
              }}
            >
              Quản lý hồ sơ →
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "minmax(90px, 0.7fr) minmax(130px, 1.4fr) minmax(110px, 1fr)",
              gap: 12,
              padding: "12px 0",
              borderBottom: "1px solid #E4EAF4",
              color: "#7B8DA7",
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: 0.5,
            }}
          >
            <span>MÃ HỒ SƠ</span>
            <span>THÍ SINH</span>
            <span>TRẠNG THÁI</span>
          </div>

          {loading ? (
            <p style={{ padding: 20, color: "#71829B" }}>
              Đang tải danh sách...
            </p>
          ) : hoSoGanDay.length === 0 ? (
            <p style={{ padding: 20, color: "#71829B" }}>
              Chưa có hồ sơ để hiển thị.
            </p>
          ) : (
            hoSoGanDay.map((item) => {
              const mau = statusColors[item.trangThai] || {
                color: "#526783",
                bg: "#F0F3F8",
              };

              return (
                <div className="recent-row" key={item.id}>
                  <span
                    style={{
                      color: "#2859A5",
                      fontSize: 13,
                      fontWeight: 800,
                    }}
                  >
                    {item.maHoSo}
                  </span>

                  <div>
                    <div
                      style={{
                        color: "#263F63",
                        fontSize: 13,
                        fontWeight: 700,
                      }}
                    >
                      {item.hoTen}
                    </div>
                    <div
                      style={{
                        color: "#8796AC",
                        fontSize: 12,
                        marginTop: 5,
                      }}
                    >
                      {item.nganh}
                    </div>
                  </div>

                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifySelf: "start",
                      gap: 7,
                      padding: "7px 10px",
                      borderRadius: 30,
                      background: mau.bg,
                      color: mau.color,
                      fontSize: 11,
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        background: mau.dot || mau.color,
                        borderRadius: "50%",
                      }}
                    />
                    {item.trangThai}
                  </span>
                </div>
              );
            })
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 10,
              marginTop: 18,
              paddingTop: 15,
              borderTop: "1px solid #EDF1F7",
              color: "#8796AC",
              fontSize: 12,
            }}
          >
            <span>
              {loading ? "Đang đồng bộ dữ liệu..." : `Tổng ${hoSo.length} hồ sơ`}
            </span>

            <span>
              {capNhatLuc
                ? `Cập nhật lúc ${capNhatLuc.toLocaleTimeString("vi-VN")}`
                : "Chưa đồng bộ"}
            </span>
          </div>
        </section>

        <footer
          style={{
            textAlign: "center",
            marginTop: 25,
            color: "#8A9AB2",
            fontSize: 11,
            letterSpacing: 0.5,
          }}
        >
          HỆ THỐNG QUẢN TRỊ TUYỂN SINH AGU
        </footer>
      </div>
    </main>
  );
}

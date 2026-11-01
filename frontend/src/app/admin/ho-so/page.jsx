
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:5000";

const statusDisplay = {
  cho_duyet: "Chờ duyệt",
  cho_tham_dinh: "Chờ duyệt",
  trung_tuyen: "Đã duyệt",
  can_bo_sung: "Cần bổ sung",
  khong_dat: "Không đạt",
};

const statusToApi = {
  "Đã duyệt": "trung_tuyen",
  "Cần bổ sung": "can_bo_sung",
  "Không đạt": "khong_dat",
};

const statusColors = {
  "Chờ duyệt": { color: "#9A6700", bg: "#FFF4D6" },
  "Đã duyệt": { color: "#137547", bg: "#DDF8E9" },
  "Cần bổ sung": { color: "#BE3345", bg: "#FFE5E7" },
  "Không đạt": { color: "#7F3340", bg: "#FCE8EA" },
};

function getToken() {
  if (typeof window === "undefined") return null;

  return (
    localStorage.getItem("adminToken") ||
    localStorage.getItem("token")
  );
}

function chuanHoaHoSo(item) {
  return {
    id: item._id,
    maHoSo:
      item.maHoSo || item._id?.slice(-6)?.toUpperCase() || "N/A",
    hoTen: item.hoTen || "Chưa có tên",
    cccd: item.cccd || "",
    maNganh: item.maNganh || "",
    nganh: item.nganhDangKy || "Chưa có thông tin",
    ngayNop: item.createdAt || item.ngayNop || null,
    trangThai:
      statusDisplay[item.trangThai] ||
      item.trangThai ||
      "Chờ duyệt",
    diem:
      item.diemXetTuyen !== undefined &&
      item.diemXetTuyen !== null
        ? String(item.diemXetTuyen)
        : "",
  };
}

function hienThiNgay(ngay) {
  if (!ngay) return "—";

  const date = new Date(ngay);

  if (Number.isNaN(date.getTime())) return String(ngay);

  return date.toLocaleDateString("vi-VN");
}

export default function QuanLyHoSo() {
  const [hoSo, setHoSo] = useState([]);
  const [tuKhoa, setTuKhoa] = useState("");
  const [locTrangThai, setLocTrangThai] = useState("Tất cả");
  const [loading, setLoading] = useState(true);
  const [dangCapNhat, setDangCapNhat] = useState(null);
  const [error, setError] = useState("");
  const [thongBao, setThongBao] = useState("");

  // Hồ sơ đang được mở để xem chi tiết
  const [hoSoDangXem, setHoSoDangXem] = useState(null);

  const taiDanhSach = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        setError("Không tìm thấy token đăng nhập. Vui lòng đăng nhập lại.");
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
        throw new Error("Dữ liệu hồ sơ Backend trả về không hợp lệ.");
      }

      setHoSo(data.map(chuanHoaHoSo));
    } catch (err) {
      console.error("Lỗi tải hồ sơ:", err);

      setError(
        err.response?.data?.message ||
          "Không thể tải hồ sơ. Hãy kiểm tra Backend và quyền đăng nhập."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    taiDanhSach();
  }, [taiDanhSach]);

  // Tìm kiếm và lọc hồ sơ
  const danhSach = useMemo(() => {
    const tuKhoaChuan = tuKhoa.trim().toLowerCase();

    return hoSo.filter((item) => {
      const khopTuKhoa = [
        item.maHoSo,
        item.hoTen,
        item.cccd,
        item.nganh,
        item.maNganh,
      ].some((value) =>
        String(value || "").toLowerCase().includes(tuKhoaChuan)
      );

      const khopTrangThai =
        locTrangThai === "Tất cả" ||
        item.trangThai === locTrangThai;

      return khopTuKhoa && khopTrangThai;
    });
  }, [hoSo, tuKhoa, locTrangThai]);

  // Thống kê hồ sơ
  const thongKe = [
    {
      ten: "Tổng hồ sơ",
      soLuong: hoSo.length,
      mau: "#3975E8",
    },
    {
      ten: "Chờ duyệt",
      soLuong: hoSo.filter(
        (x) => x.trangThai === "Chờ duyệt"
      ).length,
      mau: "#D99112",
    },
    {
      ten: "Đã duyệt",
      soLuong: hoSo.filter(
        (x) => x.trangThai === "Đã duyệt"
      ).length,
      mau: "#159765",
    },
    {
      ten: "Cần bổ sung",
      soLuong: hoSo.filter(
        (x) => x.trangThai === "Cần bổ sung"
      ).length,
      mau: "#DE4B5C",
    },
  ];

  // Cập nhật trạng thái qua Backend
  async function capNhatTrangThai(item, trangThaiMoi) {
    const apiStatus = statusToApi[trangThaiMoi];

    if (!apiStatus) {
      window.alert("Trạng thái không hợp lệ.");
      return;
    }

    const xacNhan = window.confirm(
      `Bạn có chắc muốn cập nhật hồ sơ ${item.maHoSo} thành "${trangThaiMoi}"?`
    );

    if (!xacNhan) return;

    try {
      setDangCapNhat(item.id);
      setError("");
      setThongBao("");

      const token = getToken();

      if (!token) {
        throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
      }

      await axios.patch(
        `${API_BASE}/api/ho-so/${item.id}/tham-dinh`,
        {
          trangThai: apiStatus,
          ghiChuThamDinh: "",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setThongBao(
        trangThaiMoi === "Đã duyệt"
          ? "Đã gửi yêu cầu duyệt hồ sơ thành công."
          : `Đã cập nhật hồ sơ ${item.maHoSo} thành "${trangThaiMoi}".`
      );

      await taiDanhSach();
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Không thể cập nhật trạng thái hồ sơ."
      );
    } finally {
      setDangCapNhat(null);
    }
  }

  const styles = {
    page: {
      minHeight: "100vh",
      padding: "30px clamp(14px, 3vw, 38px)",
      background: "#F3F6FC",
      color: "#243957",
      fontFamily: "Arial, Helvetica, sans-serif",
      boxSizing: "border-box",
    },
    card: {
      background: "#FFFFFF",
      border: "1px solid #E4EAF4",
      borderRadius: 16,
      padding: 22,
      boxShadow: "0 5px 20px rgba(32, 57, 92, 0.04)",
    },
    button: {
      padding: "10px 14px",
      border: "1px solid #D7E1F0",
      borderRadius: 9,
      background: "#FFFFFF",
      color: "#2859A5",
      fontWeight: 700,
      fontSize: 13,
      cursor: "pointer",
    },
    input: {
      padding: "12px 14px",
      border: "1px solid #D7E1F0",
      borderRadius: 10,
      background: "#FFFFFF",
      color: "#243957",
      fontSize: 14,
      outline: "none",
      boxSizing: "border-box",
    },
  };

  return (
    <main style={styles.page}>
      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .hoso-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
          margin-bottom: 23px;
        }

        .hoso-stat {
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .hoso-stat:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 24px #20395C12;
        }

        .hoso-input,
        .hoso-select {
          color: #243957 !important;
          background: #FFFFFF !important;
          border: 1px solid #D7E1F0;
          border-radius: 10px;
          padding: 12px 14px;
          font-size: 14px;
        }

        .hoso-input {
          width: 100%;
        }

        .hoso-input::placeholder {
          color: #8998AE !important;
          opacity: 1;
        }

        .hoso-select option {
          color: #243957;
          background: white;
        }

        .hoso-row:hover {
          background: #F7FAFF;
        }

        .detail-row {
          display: grid;
          grid-template-columns: 140px minmax(0, 1fr);
          gap: 12px;
          padding: 13px 0;
          border-bottom: 1px solid #E8EDF5;
          font-size: 14px;
        }

        @media (max-width: 850px) {
          .hoso-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 520px) {
          .hoso-grid {
            gap: 10px;
          }

          .hoso-stat {
            padding: 15px !important;
          }

          .hoso-table-card {
            padding: 14px !important;
          }

          .detail-row {
            grid-template-columns: 110px minmax(0, 1fr);
          }
        }
      `}</style>

      <div style={{ maxWidth: 1500, margin: "0 auto" }}>
        <header style={{ marginBottom: 27 }}>
          <div
            style={{
              color: "#6580A7",
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: 1.5,
              marginBottom: 8,
            }}
          >
            AGU · NGHIỆP VỤ TUYỂN SINH
          </div>

          <h1
            style={{
              color: "#19365F",
              fontSize: 29,
              fontWeight: 800,
              margin: 0,
            }}
          >
            Quản lý hồ sơ tuyển sinh
          </h1>

          <p
            style={{
              color: "#71829B",
              fontSize: 14,
              margin: "9px 0 0",
              lineHeight: 1.7,
            }}
          >
            Tra cứu thông tin thí sinh và xử lý hồ sơ trực tiếp qua Backend.
          </p>
        </header>

        {/* Các thẻ thống kê */}
        <section className="hoso-grid">
          {thongKe.map((item) => (
            <article
              className="hoso-stat"
              key={item.ten}
              style={{
                ...styles.card,
                padding: 20,
                borderTop: `3px solid ${item.mau}`,
              }}
            >
              <div
                style={{
                  color: "#647A97",
                  fontSize: 13,
                  fontWeight: 650,
                }}
              >
                {item.ten}
              </div>

              <div
                style={{
                  fontSize: 34,
                  fontWeight: 800,
                  color: item.mau,
                  marginTop: 13,
                }}
              >
                {loading ? "—" : item.soLuong}
              </div>
            </article>
          ))}
        </section>

        {/* Danh sách hồ sơ */}
        <section className="hoso-table-card" style={styles.card}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 14,
              marginBottom: 21,
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 19,
                  color: "#203A60",
                }}
              >
                Danh sách thí sinh
              </h2>
              <p
                style={{
                  color: "#8796AC",
                  fontSize: 13,
                  margin: "7px 0 0",
                }}
              >
                Tìm kiếm, lọc, xem chi tiết và cập nhật trạng thái hồ sơ.
              </p>
            </div>

            <button
              type="button"
              disabled={loading}
              onClick={taiDanhSach}
              style={{
                ...styles.button,
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? "Đang tải..." : "↻ Tải lại dữ liệu"}
            </button>
          </div>

          {/* Tìm kiếm và lọc */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              marginBottom: 20,
            }}
          >
            <input
              className="hoso-input"
              value={tuKhoa}
              onChange={(e) => setTuKhoa(e.target.value)}
              placeholder="Tìm mã hồ sơ, tên, CCCD hoặc ngành..."
              aria-label="Tìm kiếm hồ sơ"
              style={{ ...styles.input, flex: "1 1 280px" }}
            />

            <select
              className="hoso-select"
              value={locTrangThai}
              onChange={(e) => setLocTrangThai(e.target.value)}
              aria-label="Lọc trạng thái"
              style={styles.input}
            >
              <option>Tất cả</option>
              <option>Chờ duyệt</option>
              <option>Đã duyệt</option>
              <option>Cần bổ sung</option>
              <option>Không đạt</option>
            </select>
          </div>

          {thongBao && (
            <div
              role="status"
              style={{
                padding: 13,
                background: "#E8FAF1",
                border: "1px solid #C6F0DB",
                borderRadius: 10,
                color: "#137547",
                fontSize: 13,
                marginBottom: 15,
              }}
            >
              {thongBao}
            </div>
          )}

          {error && (
            <div
              role="alert"
              style={{
                padding: 13,
                background: "#FFF0F1",
                border: "1px solid #FFDADD",
                borderRadius: 10,
                color: "#A72F42",
                fontSize: 13,
                marginBottom: 15,
              }}
            >
              <strong>Lỗi:</strong> {error}
              <div style={{ marginTop: 10 }}>
                <button
                  type="button"
                  onClick={taiDanhSach}
                  style={styles.button}
                >
                  Thử tải lại
                </button>
              </div>
            </div>
          )}

          {loading ? (
            <div
              style={{
                padding: 45,
                textAlign: "center",
                color: "#71829B",
              }}
            >
              Đang tải hồ sơ từ Backend...
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  minWidth: 950,
                  borderCollapse: "collapse",
                  textAlign: "left",
                }}
              >
                <thead>
                  <tr style={{ background: "#F0F5FF" }}>
                    {[
                      "Mã hồ sơ",
                      "Thí sinh",
                      "Ngành đăng ký",
                      "Ngày nộp",
                      "Trạng thái",
                      "Xử lý hồ sơ",
                    ].map((cot) => (
                      <th
                        key={cot}
                        style={{
                          padding: "15px 13px",
                          color: "#526B90",
                          fontSize: 12,
                          fontWeight: 800,
                          whiteSpace: "nowrap",
                          borderBottom: "1px solid #DCE6F5",
                        }}
                      >
                        {cot}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {danhSach.map((item) => {
                    const mau =
                      statusColors[item.trangThai] ||
                      statusColors["Chờ duyệt"];

                    return (
                      <tr className="hoso-row" key={item.id}>
                        <td
                          style={{
                            padding: 14,
                            color: "#2859A5",
                            fontWeight: 800,
                            borderBottom: "1px solid #E8EDF5",
                          }}
                        >
                          {item.maHoSo}
                        </td>

                        <td
                          style={{
                            padding: 14,
                            borderBottom: "1px solid #E8EDF5",
                            minWidth: 180,
                          }}
                        >
                          <div
                            style={{
                              color: "#253F63",
                              fontWeight: 700,
                              fontSize: 13,
                            }}
                          >
                            {item.hoTen}
                          </div>

                          {item.cccd && (
                            <div
                              style={{
                                color: "#8796AC",
                                fontSize: 12,
                                marginTop: 5,
                              }}
                            >
                              CCCD: {item.cccd}
                            </div>
                          )}
                        </td>

                        <td
                          style={{
                            padding: 14,
                            color: "#435B7B",
                            fontSize: 13,
                            borderBottom: "1px solid #E8EDF5",
                            minWidth: 170,
                          }}
                        >
                          {item.nganh}

                          {item.maNganh && (
                            <div
                              style={{
                                color: "#8796AC",
                                fontSize: 11,
                                marginTop: 5,
                              }}
                            >
                              Mã ngành: {item.maNganh}
                            </div>
                          )}
                        </td>

                        <td
                          style={{
                            padding: 14,
                            color: "#526783",
                            fontSize: 13,
                            whiteSpace: "nowrap",
                            borderBottom: "1px solid #E8EDF5",
                          }}
                        >
                          {hienThiNgay(item.ngayNop)}
                        </td>

                        <td
                          style={{
                            padding: 14,
                            borderBottom: "1px solid #E8EDF5",
                          }}
                        >
                          <span
                            style={{
                              display: "inline-block",
                              padding: "7px 10px",
                              borderRadius: 25,
                              background: mau.bg,
                              color: mau.color,
                              fontSize: 12,
                              fontWeight: 750,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {item.trangThai}
                          </span>
                        </td>

                        <td
                          style={{
                            padding: 14,
                            borderBottom: "1px solid #E8EDF5",
                            minWidth: 170,
                          }}
                        >
                          {item.trangThai === "Chờ duyệt" && (
                            <div
                              style={{
                                color: "#8796AC",
                                fontSize: 12,
                              }}
                            >
                              Chọn trạng thái để thẩm định:
                            </div>
                          )}

                          <select
                            className="hoso-select"
                            aria-label={`Cập nhật trạng thái ${item.maHoSo}`}
                            disabled={dangCapNhat === item.id}
                            value={
                              statusToApi[item.trangThai]
                                ? item.trangThai
                                : ""
                            }
                            onChange={(e) => {
                              if (e.target.value) {
                                capNhatTrangThai(item, e.target.value);
                              }
                            }}
                            style={{
                              ...styles.input,
                              width: "100%",
                              marginTop: 6,
                              padding: "9px 10px",
                              fontSize: 12,
                            }}
                          >
                            <option value="">Chọn thao tác</option>
                            <option value="Đã duyệt">Duyệt trúng tuyển</option>
                            <option value="Cần bổ sung">Yêu cầu bổ sung</option>
                            <option value="Không đạt">Không đạt</option>
                          </select>

                          {dangCapNhat === item.id && (
                            <div
                              style={{
                                marginTop: 6,
                                color: "#5279B8",
                                fontSize: 11,
                              }}
                            >
                              Đang cập nhật...
                            </div>
                          )}

                          {/* Nút xem chi tiết hồ sơ */}
                          <button
                            type="button"
                            onClick={() => setHoSoDangXem(item)}
                            style={{
                              width: "100%",
                              marginTop: 8,
                              padding: "9px 10px",
                              border: "1px solid #C9D9F2",
                              borderRadius: 9,
                              background: "#EDF4FF",
                              color: "#2859A5",
                              fontWeight: 700,
                              fontSize: 12,
                              cursor: "pointer",
                            }}
                          >
                            Xem chi tiết
                          </button>
                        </td>
                      </tr>
                    );
                  })}

                  {danhSach.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        style={{
                          padding: 35,
                          textAlign: "center",
                          color: "#71829B",
                        }}
                      >
                        {hoSo.length === 0
                          ? "Chưa có hồ sơ nào từ Backend."
                          : "Không tìm thấy hồ sơ phù hợp."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          <div
            style={{
              marginTop: 18,
              paddingTop: 15,
              borderTop: "1px solid #EDF1F7",
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 10,
              color: "#71829B",
              fontSize: 12,
            }}
          >
            <span>
              Đang hiển thị {danhSach.length}/{hoSo.length} hồ sơ
            </span>
            <span>Dữ liệu lấy từ Backend</span>
          </div>
        </section>
      </div>

      {/* Cửa sổ xem chi tiết hồ sơ */}
      {hoSoDangXem && (
        <div
          onClick={() => setHoSoDangXem(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 35, 65, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            zIndex: 9999,
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="chi-tiet-tieu-de"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 560,
              maxHeight: "90vh",
              overflowY: "auto",
              background: "#FFFFFF",
              borderRadius: 18,
              padding: 24,
              boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
              color: "#243957",
            }}
          >
            <h2
              id="chi-tiet-tieu-de"
              style={{
                margin: "0 0 6px",
                color: "#19365F",
                fontSize: 22,
              }}
            >
              Chi tiết hồ sơ thí sinh
            </h2>

            <p
              style={{
                margin: "0 0 22px",
                color: "#71829B",
                fontSize: 13,
              }}
            >
              Mã hồ sơ: {hoSoDangXem.maHoSo}
            </p>

            {[
              ["Họ và tên", hoSoDangXem.hoTen],
              [
                "CCCD",
                hoSoDangXem.cccd || "Chưa có thông tin",
              ],
              [
                "Mã ngành",
                hoSoDangXem.maNganh || "Chưa có thông tin",
              ],
              ["Ngành đăng ký", hoSoDangXem.nganh],
              [
                "Ngày nộp",
                hienThiNgay(hoSoDangXem.ngayNop),
              ],
              [
                "Điểm xét tuyển",
                hoSoDangXem.diem || "Chưa có thông tin",
              ],
              ["Trạng thái", hoSoDangXem.trangThai],
            ].map(([label, value]) => (
              <div className="detail-row" key={label}>
                <strong style={{ color: "#71829B" }}>
                  {label}
                </strong>
                <span
                  style={{
                    color: "#243957",
                    fontWeight: 600,
                    overflowWrap: "anywhere",
                  }}
                >
                  {value}
                </span>
              </div>
            ))}

            <button
              type="button"
              onClick={() => setHoSoDangXem(null)}
              style={{
                width: "100%",
                marginTop: 22,
                padding: 12,
                border: "none",
                borderRadius: 10,
                background: "#2859A5",
                color: "#FFFFFF",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

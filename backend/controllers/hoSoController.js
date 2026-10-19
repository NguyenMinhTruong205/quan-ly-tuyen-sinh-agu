const HoSoTuyenSinh = require('../models/HoSoTuyenSinh');

// ==================== MÃ NGÀNH ====================
const MA_NGANH = {
  // Công nghệ thông tin
  'Công nghệ thông tin': 'CNTT',
  'Cong nghe thong tin': 'CNTT',

  // Quản trị kinh doanh
  'Quản trị kinh doanh': 'QTKD',
  'Quan tri kinh doanh': 'QTKD',

  // Kế toán
  'Kế toán': 'KT',
  'Ke toan': 'KT',

  // Tài chính - Ngân hàng
  'Tài chính - Ngân hàng': 'TCNH',
  'Tai chinh - Ngan hang': 'TCNH',

  // Luật
  'Luật': 'LUAT',
  'Luat': 'LUAT',

  // Kinh tế
  'Kinh tế': 'KTE',
  'Kinh te': 'KTE',

  // Ngôn ngữ Anh
  'Ngôn ngữ Anh': 'NNA',
  'Ngon ngu Anh': 'NNA',

  // Quản lý tài nguyên và môi trường
  'Quản lý tài nguyên và môi trường': 'QLTNMT',
  'Quan ly tai nguyen va moi truong': 'QLTNMT'
};

// ==================== TẠO MSSV ====================
const taoMSSV = async (nganhDangKy, namTrungTuyen) => {
  const maNganh = MA_NGANH[nganhDangKy];

  if (!maNganh) {
    throw new Error(
      `Chưa cấu hình mã ngành cho ngành: ${nganhDangKy}`
    );
  }

  // Ví dụ 2026 -> 26
  const nam = String(namTrungTuyen).slice(-2);

  // Tiền tố: SDH26CNTT
  const tienTo = `SDH${nam}${maNganh}`;

  // Tìm sinh viên có MSSV lớn nhất của ngành trong năm đó
  const hoSoCuoi = await HoSoTuyenSinh.findOne({
    mshv: {
      $regex: `^${tienTo}\\d{3}$`
    }
  }).sort({ mshv: -1 });

  let soThuTu = 1;

  if (hoSoCuoi && hoSoCuoi.mshv) {
    const sttCu = parseInt(hoSoCuoi.mshv.slice(-3), 10);
    soThuTu = sttCu + 1;
  }

  const stt = String(soThuTu).padStart(3, '0');

  return `${tienTo}${stt}`;
};

// ==================== TẠO EMAIL SINH VIÊN ====================
const taoEmailSinhVien = (mssv) => {
  return `${mssv.toLowerCase()}@student.agu.edu.vn`;
};
// ==================== TẠO HỒ SƠ TUYỂN SINH ====================
exports.taoHoSo = async (req, res) => {
  try {
    const {
  hoTen,
  cccd,
  ngaySinh,
  soDienThoai,
  diaChi,
  nganhDangKy,
  diemXetTuyen
} = req.body;

// Lấy ID thí sinh trực tiếp từ JWT
const thiSinh = req.user.userId;

    // Kiểm tra dữ liệu bắt buộc
    if (
      !thiSinh ||
      !hoTen ||
      !cccd ||
      !ngaySinh ||
      !soDienThoai ||
      !diaChi ||
      !nganhDangKy ||
      diemXetTuyen === undefined
    ) {
      return res.status(400).json({
        message: 'Vui lòng nhập đầy đủ thông tin hồ sơ'
      });
    }

    const hoSo = await HoSoTuyenSinh.create({
      thiSinh,
      hoTen,
      cccd,
      ngaySinh,
      soDienThoai,
      diaChi,
      nganhDangKy,
      diemXetTuyen
    });

    res.status(201).json({
      message: 'Tạo hồ sơ tuyển sinh thành công',
      hoSo
    });
  } catch (error) {
    res.status(500).json({
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// ==================== LẤY DANH SÁCH HỒ SƠ ====================
exports.layDanhSachHoSo = async (req, res) => {
  try {
    const danhSach = await HoSoTuyenSinh.find()
      .populate('thiSinh', 'hoTen email vaiTro')
      .sort({ createdAt: -1 });

    res.json({
      message: 'Lấy danh sách hồ sơ thành công',
      tongSo: danhSach.length,
      danhSach
    });
  } catch (error) {
    res.status(500).json({
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// ==================== LẤY CHI TIẾT HỒ SƠ ====================
exports.layChiTietHoSo = async (req, res) => {
  try {
    const hoSo = await HoSoTuyenSinh.findById(req.params.id)
      .populate('thiSinh', 'hoTen email vaiTro');

    if (!hoSo) {
      return res.status(404).json({
        message: 'Không tìm thấy hồ sơ'
      });
    }

    // Cán bộ được xem tất cả hồ sơ.
    // Thí sinh chỉ được xem hồ sơ của chính mình.
    if (req.user.vaiTro !== 'can_bo') {
      const thiSinhId = hoSo.thiSinh._id.toString();

      if (thiSinhId !== req.user.userId) {
        return res.status(403).json({
          message: 'Bạn không có quyền xem hồ sơ này'
        });
      }
    }

    res.json({
      message: 'Lấy chi tiết hồ sơ thành công',
      hoSo
    });

  } catch (error) {
    res.status(500).json({
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// ==================== THẨM ĐỊNH HỒ SƠ ====================
exports.thamDinhHoSo = async (req, res) => {
  try {
    const { trangThai, ghiChuThamDinh } = req.body;

    const trangThaiHopLe = [
      'can_bo_sung',
      'khong_dat',
      'trung_tuyen'
    ];

    if (!trangThaiHopLe.includes(trangThai)) {
      return res.status(400).json({
        message:
          'Trạng thái không hợp lệ. Chọn can_bo_sung, khong_dat hoặc trung_tuyen'
      });
    }

    const hoSo = await HoSoTuyenSinh.findById(req.params.id);

    if (!hoSo) {
      return res.status(404).json({
        message: 'Không tìm thấy hồ sơ'
      });
    }
    // Hồ sơ đã trúng tuyển và được cấp MSSV thì không được đổi ngược trạng thái
    if (
    hoSo.trangThai === 'trung_tuyen' &&
    hoSo.mshv &&
    trangThai !== 'trung_tuyen'
    ) {
    return res.status(400).json({
        message:
        'Hồ sơ đã trúng tuyển và được cấp MSSV, không thể chuyển sang trạng thái khác'
    });
    }

    // Cập nhật kết quả thẩm định
    hoSo.trangThai = trangThai;
    hoSo.ghiChuThamDinh = ghiChuThamDinh || '';
    hoSo.ngayThamDinh = new Date();

    // Nếu trúng tuyển thì tự động tạo MSSV + email sinh viên
    if (trangThai === 'trung_tuyen') {

      // Chỉ tạo nếu hồ sơ chưa có MSSV
      if (!hoSo.mshv) {
        const namTrungTuyen = new Date().getFullYear();

        const mssv = await taoMSSV(
          hoSo.nganhDangKy,
          namTrungTuyen
        );

        hoSo.mshv = mssv;
        hoSo.emailSinhVien = taoEmailSinhVien(mssv);
      }
    }

    await hoSo.save();

    res.json({
      message:
        trangThai === 'trung_tuyen'
          ? 'Thẩm định thành công. Thí sinh trúng tuyển và đã được cấp MSSV, email sinh viên.'
          : 'Thẩm định hồ sơ thành công',

      hoSo
    });

  } catch (error) {
    res.status(500).json({
      message: 'Lỗi server',
      error: error.message
    });
  }
};
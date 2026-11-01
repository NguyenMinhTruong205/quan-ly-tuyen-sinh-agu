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

// ==================== TẠO EMAIL SINH VIÊN ====================
const taoEmailSinhVien = (mssv) => {
  // Ví dụ: SDH26CNTT001 → sdh26cntt001@student.agu.edu.vn
  return `${mssv.toLowerCase()}@student.agu.edu.vn`;
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
    mshv: { $regex: `^${tienTo}\\d{3}$` }
  }).sort({ mshv: -1 });
  
  let soThuTu = 1;
  if (hoSoCuoi && hoSoCuoi.mshv) {
    const sttCu = parseInt(hoSoCuoi.mshv.slice(-3), 10);
    soThuTu = sttCu + 1;
  }
  const stt = String(soThuTu).padStart(3, '0');
  return `${tienTo}${stt}`;
};

// ==================== TẠO HỒ SƠ TUYỂN SINH ====================
exports.taoHoSo = async (req, res) => {
  try {
    console.log("✅ Dữ liệu nhận từ Frontend:", req.body);
    console.log("✅ Thông tin người dùng:", req.user); // Kiểm tra có nhận được không

    const {
      hoTen,
      cccd,
      ngaySinh,
      soDienThoai,
      diaChi,
      nganhDangKy,
      diemXetTuyen
    } = req.body;

    // KIỂM TRA BẮT BUỘC
    if (!hoTen || !cccd || !ngaySinh || !nganhDangKy) {
      return res.status(400).json({
        message: '❌ Thiếu thông tin bắt buộc: Họ tên, CCCD, Ngày sinh, Ngành đăng ký'
      });
    }

    // KIỂM TRA req.user CÓ TỒN TẠI KHÔNG
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: '❌ Không xác định được người dùng, vui lòng đăng nhập lại'
      });
    }

    const hoSo = await HoSoTuyenSinh.create({
      hoTen: hoTen,
      cccd: cccd,
      ngaySinh: ngaySinh,
      soDienThoai: soDienThoai || '0000000000',
      diaChi: diaChi || 'Chưa cập nhật',
      nganhDangKy: nganhDangKy,
      diemXetTuyen: diemXetTuyen || 0,
      thiSinh: req.user.id, // ✅ Bắt buộc — liên kết với User
      trangThai: 'cho_tham_dinh'
    });

    console.log('✅ Tạo hồ sơ thành công:', hoSo._id);

    res.status(201).json({
      message: '✅ Tạo hồ sơ tuyển sinh thành công',
      hoSo: hoSo,
      maHoSo: hoSo._id.toString().slice(-6).toUpperCase()
    });

  } catch (error) {
    console.error('❌ Lỗi chi tiết tại taoHoSo:', error); // In lỗi ra Terminal
    res.status(500).json({
      message: 'Lỗi server khi tạo hồ sơ',
      error: error.message,
      tenLoi: error.name
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

    // Kiểm tra quyền: Cán bộ xem tất cả, Thí sinh chỉ xem của mình
  if (!['can_bo', 'admin'].includes(req.user.vaiTro)) {
  const thiSinhId = hoSo.thiSinh._id.toString();
  if (thiSinhId !== req.user.id && thiSinhId !== req.user.userId) {
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
    const trangThaiHopLe = ['can_bo_sung', 'khong_dat', 'trung_tuyen'];

    if (!trangThaiHopLe.includes(trangThai)) {
      return res.status(400).json({
        message: 'Trạng thái không hợp lệ. Chọn: can_bo_sung, khong_dat hoặc trung_tuyen'
      });
    }

    const hoSo = await HoSoTuyenSinh.findById(req.params.id);
    if (!hoSo) {
      return res.status(404).json({
        message: 'Không tìm thấy hồ sơ'
      });
    }

    // Không cho đổi ngược nếu đã trúng tuyển và có MSSV
    if (hoSo.trangThai === 'trung_tuyen' && hoSo.mshv && trangThai !== 'trung_tuyen') {
      return res.status(400).json({
        message: 'Hồ sơ đã trúng tuyển và được cấp MSSV, không thể chuyển trạng thái khác'
      });
    }

    // Cập nhật thông tin thẩm định
    hoSo.trangThai = trangThai;
    hoSo.ghiChuThamDinh = ghiChuThamDinh || '';
    hoSo.ngayThamDinh = new Date();

    // Tự động tạo MSSV + email khi trúng tuyển
    if (trangThai === 'trung_tuyen' && !hoSo.mshv) {
      const namTrungTuyen = new Date().getFullYear();
      const mssv = await taoMSSV(hoSo.nganhDangKy, namTrungTuyen);
      hoSo.mshv = mssv;
      hoSo.emailSinhVien = taoEmailSinhVien(mssv);
    }

    await hoSo.save();

    res.json({
      message: trangThai === 'trung_tuyen'
        ? '✅ Thẩm định thành công. Thí sinh trúng tuyển, đã cấp MSSV & email sinh viên.'
        : '✅ Thẩm định hồ sơ thành công',
      hoSo
    });
  } catch (error) {
    res.status(500).json({
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// ==================== TRA CỨU HỒ SƠ (CÔNG KHAI) ====================
exports.traCuuHoSo = async (req, res) => {
  try {
    const { keyword } = req.query;
    
    if (!keyword || keyword.trim() === '') {
      return res.status(400).json({
        message: 'Vui lòng nhập CCCD hoặc Mã hồ sơ'
      });
    }

    const key = keyword.trim();
    let hoSo = null;

    // 1. Tìm theo CCCD
    hoSo = await HoSoTuyenSinh.findOne({ cccd: key });

    // 2. Tìm theo 6 ký tự cuối mã hồ sơ
    if (!hoSo && key.length === 6) {
      const danhSach = await HoSoTuyenSinh.find().select(
        'hoTen cccd nganhDangKy diemXetTuyen trangThai mshv emailSinhVien createdAt'
      );
      hoSo = danhSach.find(item => 
        item._id.toString().slice(-6).toUpperCase() === key.toUpperCase()
      );
    }

    // 3. Tìm theo full ObjectId
    if (!hoSo && key.length === 24) {
      hoSo = await HoSoTuyenSinh.findById(key);
    }

    if (!hoSo) {
      return res.status(404).json({
        message: 'Không tìm thấy hồ sơ phù hợp'
      });
    }

    const statusMap = {
      cho_tham_dinh: 'Chờ thẩm định',
      can_bo_sung: 'Cần bổ sung hồ sơ',
      khong_dat: 'Không đạt',
      trung_tuyen: 'Trúng tuyển'
    };

    res.json({
      message: 'Tra cứu thành công',
      data: {
        maHoSo: hoSo._id.toString().slice(-6).toUpperCase(),
        hoTen: hoSo.hoTen,
        cccd: hoSo.cccd,
        nganhDangKy: hoSo.nganhDangKy,
        diemXetTuyen: hoSo.diemXetTuyen,
        trangThai: statusMap[hoSo.trangThai] || hoSo.trangThai,
        mshv: hoSo.mshv || null,
        emailSinhVien: hoSo.emailSinhVien || null,
        ngayNop: hoSo.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Lỗi server',
      error: error.message
    });
  }
};
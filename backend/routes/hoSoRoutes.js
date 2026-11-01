
const express = require('express');
const router = express.Router();

const {
  taoHoSo,
  layDanhSachHoSo,
  layChiTietHoSo,
  thamDinhHoSo,
  traCuuHoSo
} = require('../controllers/hoSoController');

const {
  xacThucToken,
  chiCanBo
} = require('../middleware/authMiddleware');

// ==================== TẠO HỒ SƠ TUYỂN SINH ====================
// Thí sinh phải đăng nhập mới được nộp hồ sơ
router.post('/', xacThucToken, taoHoSo);

// ==================== TRA CỨU HỒ SƠ CÔNG KHAI ====================
// Tra cứu bằng CCCD hoặc mã hồ sơ, không cần đăng nhập
router.get('/tra-cuu', traCuuHoSo);

// ==================== LẤY DANH SÁCH HỒ SƠ ====================
// Chỉ cán bộ được xem danh sách tất cả hồ sơ
router.get(
  '/',
  xacThucToken,
  chiCanBo,
  layDanhSachHoSo
);

// ==================== LẤY CHI TIẾT HỒ SƠ ====================
router.get(
  '/:id',
  xacThucToken,
  layChiTietHoSo
);

// ==================== THẨM ĐỊNH HỒ SƠ ====================
// Chỉ cán bộ được thẩm định hồ sơ
router.patch(
  '/:id/tham-dinh',
  xacThucToken,
  chiCanBo,
  thamDinhHoSo
);

module.exports = router;

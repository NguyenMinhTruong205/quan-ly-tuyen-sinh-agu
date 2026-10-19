const express = require('express');
const router = express.Router();

const {
  taoHoSo,
  layDanhSachHoSo,
  layChiTietHoSo,
  thamDinhHoSo
} = require('../controllers/hoSoController');

const {
  xacThucToken,
  chiCanBo
} = require('../middleware/authMiddleware');

// Tạo hồ sơ tuyển sinh
router.post('/', xacThucToken, taoHoSo);

// Lấy danh sách tất cả hồ sơ
// Chỉ cán bộ mới được xem danh sách
router.get('/', xacThucToken, chiCanBo, layDanhSachHoSo);

// Lấy chi tiết một hồ sơ
router.get('/:id', xacThucToken, layChiTietHoSo);

// Thẩm định hồ sơ
// Chỉ cán bộ mới được thẩm định
router.patch(
  '/:id/tham-dinh',
  xacThucToken,
  chiCanBo,
  thamDinhHoSo
);

module.exports = router;
const express = require('express');
const router = express.Router();
// Import thêm hàm dangNhap từ authController
const { dangKy, xacThucOTP, dangNhap } = require('../controllers/authController');

// Khai báo đầy đủ các route thuộc /api/auth
router.post('/dang-ky', dangKy);
router.post('/xac-thuc-otp', xacThucOTP);
router.post('/dang-nhap', dangNhap); // <-- Đã bổ sung route Đăng nhập

module.exports = router;
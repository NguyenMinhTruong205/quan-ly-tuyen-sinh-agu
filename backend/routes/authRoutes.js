const express = require('express');
const router = express.Router();

// ✅ Import đầy đủ các hàm controller
const {
  dangKy,
  xacThucOTP,
  dangNhap,
  guiLaiOTP,
  yeuCauOTPDangNhap,
  xacThucOTPDangNhap,
  dangXuat
} = require('../controllers/authController');

// Đăng ký tài khoản mới (Hỗ trợ cả tiếng Việt lẫn tiếng Anh)
router.post('/dang-ky', dangKy);
router.post('/register', dangKy);

// Xác thực OTP sau khi đăng ký
router.post('/xac-thuc-otp', xacThucOTP);
router.post('/verify-otp', xacThucOTP);

// ✅ Đăng nhập — Hỗ trợ cả /dang-nhap và /login để Frontend 
router.post('/dang-nhap', dangNhap);
router.post('/login', dangNhap); 

// Gửi lại mã OTP
router.post('/gui-lai-otp', guiLaiOTP);
router.post('/resend-otp', guiLaiOTP);

// Yêu cầu tạo OTP cho bước đăng nhập
router.post('/yeu-cau-otp-dang-nhap', yeuCauOTPDangNhap);

// Xác thực OTP đăng nhập
router.post('/xac-thuc-otp-dang-nhap', xacThucOTPDangNhap);

// Đăng xuất
router.post('/dang-xuat', dangXuat);
router.post('/logout', dangXuat);

module.exports = router;
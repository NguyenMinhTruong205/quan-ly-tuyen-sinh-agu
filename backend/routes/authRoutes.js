const express = require('express');
const router = express.Router();

const {
  dangKy,
  xacThucOTP,
  dangNhap,
  guiLaiOTP,
  yeuCauOTPDangNhap,
  xacThucOTPDangNhap
} = require('../controllers/authController');

// Đăng ký tài khoản
router.post('/dang-ky', dangKy);

// Xác thực OTP
router.post('/xac-thuc-otp', xacThucOTP);

// Đăng nhập
router.post('/dang-nhap', dangNhap);

router.post('/gui-lai-otp', guiLaiOTP);
// Yêu cầu OTP để đăng nhập
router.post('/yeu-cau-otp-dang-nhap', yeuCauOTPDangNhap);

// Xác thực OTP và đăng nhập
router.post('/dang-nhap-otp', xacThucOTPDangNhap);

module.exports = router;
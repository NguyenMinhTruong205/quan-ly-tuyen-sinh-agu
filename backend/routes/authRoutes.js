const express = require('express');
const router = express.Router();

// ✅ Bước 1: Import ĐỦ các hàm, bao gồm cả dangXuat
const {
  dangKy,
  xacThucOTP,
  dangNhap,
  guiLaiOTP,
  yeuCauOTPDangNhap,
  xacThucOTPDangNhap,
  dangXuat // ← Thêm dòng này
} = require('../controllers/authController');

// Đăng ký tài khoản mới
router.post('/dang-ky', dangKy);

// Xác thực OTP sau khi đăng ký
router.post('/xac-thuc-otp', xacThucOTP);

// Đăng nhập thông thường (email + mật khẩu)
router.post('/dang-nhap', dangNhap);

// Gửi lại mã OTP
router.post('/gui-lai-otp', guiLaiOTP);

// Yêu cầu tạo OTP cho bước đăng nhập
router.post('/yeu-cau-otp-dang-nhap', yeuCauOTPDangNhap);

// ✅ Đường dẫn xác thực OTP đăng nhập — ĐỒNG BỘ tên với Frontend
router.post('/xac-thuc-otp-dang-nhap', xacThucOTPDangNhap);

// ✅ Đăng xuất — ĐÚNG vị trí trước module.exports
router.post('/dang-xuat', dangXuat);

module.exports = router;
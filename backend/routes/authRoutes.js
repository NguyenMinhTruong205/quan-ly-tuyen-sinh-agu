const express = require('express');
const router = express.Router();
const { dangKy, xacThucOTP } = require('../controllers/authController');

// Khai báo 2 route cơ bản nhất
router.post('/dang-ky', dangKy);
router.post('/xac-thuc-otp', xacThucOTP);

module.exports = router;
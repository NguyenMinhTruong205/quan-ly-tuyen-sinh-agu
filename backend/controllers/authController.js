const User = require('../models/User');
const jwt = require('jsonwebtoken');

// 1. ĐĂNG KÝ (Tạo & Gửi OTP)
exports.dangKy = async (req, res) => {
  try {
    const { email, matKhau, hoTen } = req.body;
    if (!email || !matKhau) {
      return res.status(400).json({ message: 'Thiếu email hoặc mật khẩu' });
    }

    const emailClean = email.toLowerCase().trim();
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Lưu/Cập nhật User kèm OTP (hạn 5 phút)
    const user = await User.findOneAndUpdate(
      { email: emailClean },
      { hoTen, matKhau, otp, otpHetHan: new Date(Date.now() + 5 * 60 * 1000), daXacThuc: false },
      { upsert: true, new: true }
    );

    console.log(`=> [OTP DEMO] Mã OTP của ${emailClean} là: ${otp}`);

    return res.status(200).json({
      success: true,
      message: 'Gửi mã OTP thành công',
      email: emailClean,
      otpDemo: otp // Dùng để test trực tiếp
    });
  } catch (err) {
    console.error('Lỗi đăng ký:', err);
    return res.status(500).json({ message: 'Lỗi server khi đăng ký' });
  }
};

// 2. XÁC THỰC OTP (Kích hoạt & Trả Token Đăng nhập)
exports.xacThucOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: 'Thiếu email hoặc mã OTP' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy tài khoản' });
    }

    if (user.otp !== String(otp).trim()) {
      return res.status(400).json({ message: 'Mã OTP không chính xác' });
    }

    // Xóa OTP và đánh dấu xác thực
    user.daXacThuc = true;
    user.otp = null;
    await user.save();

    // Cấp Token JWT để Frontend tự động đăng nhập
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      success: true,
      message: 'Xác thực OTP và đăng nhập thành công!',
      token,
      user: { id: user._id, email: user.email, hoTen: user.hoTen }
    });
  } catch (err) {
    console.error('Lỗi xác thực OTP:', err);
    return res.status(500).json({ message: 'Lỗi server khi xác thực OTP' });
  }
};

// 3. ĐĂNG NHẬP (Bổ sung mới)
exports.dangNhap = async (req, res) => {
  try {
    const { email, matKhau } = req.body;
    if (!email || !matKhau) {
      return res.status(400).json({ message: 'Thiếu email hoặc mật khẩu' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({ message: 'Tài khoản không tồn tại' });
    }

    // Kiểm tra mật khẩu (So sánh trực tiếp với chuỗi lưu trữ)
    if (user.matKhau !== matKhau) {
      return res.status(400).json({ message: 'Mật khẩu không chính xác' });
    }

    // Cấp Token JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công!',
      token,
      user: { id: user._id, email: user.email, hoTen: user.hoTen }
    });
  } catch (err) {
    console.error('Lỗi đăng nhập:', err);
    return res.status(500).json({ message: 'Lỗi server khi đăng nhập' });
  }
};
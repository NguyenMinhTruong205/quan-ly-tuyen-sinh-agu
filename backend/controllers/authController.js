const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Tạo OTP gồm 6 chữ số
const taoOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// ==================== ĐĂNG KÝ ====================
exports.dangKy = async (req, res) => {
  try {
    const { hoTen, email, matKhau } = req.body;

    if (!hoTen || !email || !matKhau) {
      return res.status(400).json({
        message: 'Vui lòng nhập đầy đủ họ tên, email và mật khẩu'
      });
    }

    const emailChuanHoa = email.toLowerCase().trim();

    const userDaTonTai = await User.findOne({ email: emailChuanHoa });

    if (userDaTonTai) {
      return res.status(400).json({
        message: 'Email đã được đăng ký'
      });
    }

    const matKhauMaHoa = await bcrypt.hash(matKhau, 10);
    const otp = taoOTP();

    const user = await User.create({
      hoTen,
      email: emailChuanHoa,
      matKhau: matKhauMaHoa,
      otp,
      otpHetHan: new Date(Date.now() + 5 * 60 * 1000)
    });

    res.status(201).json({
      message: 'Đăng ký thành công. Vui lòng xác thực OTP.',
      userId: user._id,

      // Chỉ dùng để demo/test local.
      // Sau này có thể thay bằng gửi OTP qua email.
      otpDemo: otp
    });
  } catch (error) {
    res.status(500).json({
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// ==================== XÁC THỰC OTP ====================
exports.xacThucOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: 'Vui lòng nhập email và OTP'
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim()
    });

    if (!user) {
      return res.status(404).json({
        message: 'Không tìm thấy tài khoản'
      });
    }

    if (user.daXacThuc) {
      return res.status(400).json({
        message: 'Tài khoản đã được xác thực'
      });
    }

    if (!user.otp || user.otp !== String(otp)) {
      return res.status(400).json({
        message: 'OTP không chính xác'
      });
    }

    if (!user.otpHetHan || user.otpHetHan < new Date()) {
      return res.status(400).json({
        message: 'OTP đã hết hạn'
      });
    }

    user.daXacThuc = true;
    user.otp = null;
    user.otpHetHan = null;

    await user.save();

    res.json({
      message: 'Xác thực OTP thành công'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// ==================== ĐĂNG NHẬP ====================
exports.dangNhap = async (req, res) => {
  try {
    const { email, matKhau } = req.body;

    if (!email || !matKhau) {
      return res.status(400).json({
        message: 'Vui lòng nhập email và mật khẩu'
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim()
    });

    if (!user) {
      return res.status(401).json({
        message: 'Email hoặc mật khẩu không chính xác'
      });
    }

    const dungMatKhau = await bcrypt.compare(matKhau, user.matKhau);

    if (!dungMatKhau) {
      return res.status(401).json({
        message: 'Email hoặc mật khẩu không chính xác'
      });
    }

    if (!user.daXacThuc) {
      return res.status(403).json({
        message: 'Tài khoản chưa xác thực OTP'
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        vaiTro: user.vaiTro
      },
      process.env.JWT_SECRET || 'qlts_agu_local_secret',
      {
        expiresIn: '1d'
      }
    );

    res.json({
      message: 'Đăng nhập thành công',
      token,
      user: {
        id: user._id,
        hoTen: user.hoTen,
        email: user.email,
        vaiTro: user.vaiTro
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Lỗi server',
      error: error.message
    });
  }
};
// ==================== GỬI LẠI OTP ====================
exports.guiLaiOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: 'Vui lòng nhập email'
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim()
    });

    if (!user) {
      return res.status(404).json({
        message: 'Không tìm thấy tài khoản'
      });
    }

    if (user.daXacThuc) {
      return res.status(400).json({
        message: 'Tài khoản đã được xác thực'
      });
    }

    const otp = taoOTP();

    user.otp = otp;
    user.otpHetHan = new Date(Date.now() + 5 * 60 * 1000);

    await user.save();

    res.json({
      message: 'Đã tạo OTP mới',
      otpDemo: otp
    });
  } catch (error) {
    res.status(500).json({
      message: 'Lỗi server',
      error: error.message
    });
  }
};
// ==================== YÊU CẦU OTP ĐĂNG NHẬP ====================
exports.yeuCauOTPDangNhap = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: 'Vui lòng nhập email'
      });
    }

    const emailChuanHoa = email.toLowerCase().trim();

    const user = await User.findOne({
      email: emailChuanHoa
    });

    if (!user) {
      return res.status(404).json({
        message: 'Không tìm thấy tài khoản'
      });
    }

    if (!user.daXacThuc) {
      return res.status(403).json({
        message: 'Tài khoản chưa được xác thực'
      });
    }

    // Tạo OTP đăng nhập mới
    const otp = taoOTP();

    user.otp = otp;
    user.otpHetHan = new Date(Date.now() + 5 * 60 * 1000);

    await user.save();

    res.json({
      message: 'Đã tạo OTP đăng nhập. OTP có hiệu lực trong 5 phút.',

      // Chỉ dùng để demo/test local
      // Sau này có thể thay bằng gửi OTP qua email
      otpDemo: otp
    });

  } catch (error) {
    res.status(500).json({
      message: 'Lỗi server',
      error: error.message
    });
  }
};
// ==================== XÁC THỰC OTP ĐĂNG NHẬP ====================
exports.xacThucOTPDangNhap = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: 'Vui lòng nhập email và OTP'
      });
    }

    const emailChuanHoa = email.toLowerCase().trim();

    const user = await User.findOne({
      email: emailChuanHoa
    });

    if (!user) {
      return res.status(404).json({
        message: 'Không tìm thấy tài khoản'
      });
    }

    if (!user.daXacThuc) {
      return res.status(403).json({
        message: 'Tài khoản chưa được xác thực'
      });
    }

    // Kiểm tra OTP
    if (!user.otp || user.otp !== String(otp)) {
      return res.status(400).json({
        message: 'OTP không chính xác'
      });
    }

    // Kiểm tra thời hạn OTP
    if (!user.otpHetHan || user.otpHetHan < new Date()) {
      return res.status(400).json({
        message: 'OTP đã hết hạn'
      });
    }

    // OTP chỉ được sử dụng một lần
    user.otp = null;
    user.otpHetHan = null;

    await user.save();

    // Tạo JWT sau khi OTP hợp lệ
    const token = jwt.sign(
      {
        userId: user._id,
        vaiTro: user.vaiTro
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1d'
      }
    );

    res.json({
      message: 'Đăng nhập bằng OTP thành công',
      token,
      user: {
        id: user._id,
        hoTen: user.hoTen,
        email: user.email,
        vaiTro: user.vaiTro
      }
    });

  } catch (error) {
    res.status(500).json({
      message: 'Lỗi server',
      error: error.message
    });
  }
};
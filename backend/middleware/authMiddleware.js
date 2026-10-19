const jwt = require('jsonwebtoken');

// ==================== KIỂM TRA ĐĂNG NHẬP ====================
exports.xacThucToken = (req, res, next) => {
  try {
    // Lấy Authorization từ Header
    const authorization = req.headers.authorization;

    // Không có token
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Bạn chưa đăng nhập hoặc chưa cung cấp token'
      });
    }

    // Header có dạng:
    // Bearer eyJhbGciOiJIUzI1NiIs...
    // Lấy phần token phía sau chữ Bearer
    const token = authorization.split(' ')[1];

    // Kiểm tra token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Lưu thông tin người dùng từ token vào request
    req.user = decoded;

    // Cho phép đi tiếp đến API
    next();

  } catch (error) {
    return res.status(401).json({
      message: 'Token không hợp lệ hoặc đã hết hạn'
    });
  }
};

// ==================== KIỂM TRA VAI TRÒ CÁN BỘ ====================
exports.chiCanBo = (req, res, next) => {

  // Chỉ tài khoản có vaiTro = can_bo mới được đi tiếp
  if (!req.user || req.user.vaiTro !== 'can_bo') {
    return res.status(403).json({
      message: 'Chỉ cán bộ mới có quyền thực hiện chức năng này'
    });
  }

  next();
};
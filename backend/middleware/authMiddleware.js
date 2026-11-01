
const jwt = require('jsonwebtoken');

// ==================== XÁC THỰC TOKEN ====================
exports.xacThucToken = (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Bạn chưa đăng nhập hoặc chưa cung cấp token'
      });
    }

    const token = authorization.split(' ')[1];

    // Phải dùng cùng JWT_SECRET với authController.js
    const JWT_SECRET =
      process.env.JWT_SECRET || 'qlts_agu_secret';

    const decoded = jwt.verify(token, JWT_SECRET);

    // Chuẩn hóa ID để tương thích với các Controller hiện tại
    const userId = decoded.id || decoded.userId || decoded._id;

    if (!userId) {
      return res.status(401).json({
        message: 'Token không chứa ID người dùng. Vui lòng đăng nhập lại.'
      });
    }

    req.user = {
      ...decoded,
      id: userId,
      vaiTro: decoded.vaiTro || 'thi_sinh'
    };

    console.log('Người dùng đã xác thực:', {
      id: req.user.id,
      vaiTro: req.user.vaiTro
    });

    next();
  } catch (error) {
    console.error('Lỗi xác thực token:', error.message);

    return res.status(401).json({
      message: 'Token không hợp lệ hoặc đã hết hạn'
    });
  }
};

// ==================== CHỈ CHO PHÉP CÁN BỘ ====================
exports.chiCanBo = (req, res, next) => {
  if (!req.user || !['can_bo', 'admin'].includes(req.user.vaiTro)) {
    return res.status(403).json({ 
      message: 'Bạn không có quyền thực hiện chức năng này' 
    });
  }
  next();
};

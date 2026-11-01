const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Bạn chưa đăng nhập' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'qlts_agu_secret');
    
    // ✅ Kiểm tra chắc chắn có giá trị, không để undefined
    const userId = decoded.userId || decoded.id;
    const vaiTro = decoded.vaiTro || 'thi_sinh'; // Giá trị mặc định nếu thiếu

    if (!userId) {
      return res.status(403).json({ 
        message: 'Token không chứa thông tin người dùng, vui lòng đăng nhập lại' 
      });
    }

    // ✅ Gán rõ ràng, đảm bảo luôn có giá trị
    req.user = {
      id: userId,
      userId: userId,
      vaiTro: vaiTro
    };

    // ✅ In ra Terminal để kiểm tra khi debug
    console.log('✅ [Middleware] Đăng nhập hợp lệ:', req.user);

    next();
  } catch (err) {
    console.error('❌ [Middleware] Lỗi xác thực Token:', err.message);
    return res.status(403).json({ 
      message: 'Token không hợp lệ hoặc đã hết hạn, vui lòng đăng nhập lại' 
    });
  }
};
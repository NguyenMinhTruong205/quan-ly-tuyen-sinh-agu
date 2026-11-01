module.exports = (req, res, next) => {
  // ✅ Cho phép cả Cán bộ và Admin truy cập
  if (!req.user || (req.user.vaiTro !== 'can_bo' && req.user.vaiTro !== 'admin')) {
    return res.status(403).json({ message: 'Bạn không có quyền thực hiện hành động này' });
  }
  
  next();
};
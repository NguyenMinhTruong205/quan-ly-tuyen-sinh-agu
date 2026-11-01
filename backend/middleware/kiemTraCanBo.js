module.exports = (req, res, next) => {
  if (!req.user || req.user.vaiTro !== 'can_bo') {
    return res.status(403).json({ message: 'Bạn không có quyền thực hiện hành động này' });
  }
  next();
};
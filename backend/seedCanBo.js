require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

async function seedCanBo() {
  try {
    // Ưu tiên MONGO_URI, nếu không có thì dùng MONGODB_URI
    const dbUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    
    if (!dbUri) {
      console.error('❌ Chưa cấu hình biến môi trường MONGO_URI hoặc MONGODB_URI');
      process.exit(1);
    }

    await mongoose.connect(dbUri);
    console.log('✅ Kết nối CSDL thành công');

    const email = 'admin@agu.edu.vn';
    const exists = await User.findOne({ email });
    
    if (exists) {
      console.log('→ Tài khoản cán bộ đã tồn tại:');
      console.log('   Email   :', exists.email);
      console.log('   Vai trò :', exists.vaiTro);
      console.log('   Họ tên  :', exists.hoTen);
      process.exit(0);
    }

    const matKhauMaHoa = await bcrypt.hash('123456', 10);
    
    await User.create({
      hoTen: 'Cán bộ Tuyển sinh',
      email: email,
      matKhau: matKhauMaHoa,
      vaiTro: 'can_bo',
      daXacThuc: true,
      otp: null,
      otpHetHan: null
    });

    console.log('\n✅ Tạo tài khoản cán bộ thành công!');
    console.log('   Email   : admin@agu.edu.vn');
    console.log('   Mật khẩu: 123456');
    console.log('   Vai trò : can_bo');
    console.log('   Trạng thái: Đã xác thực — có thể đăng nhập ngay!\n');
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Lỗi:', err.message);
    process.exit(1);
  }
}

seedCanBo();
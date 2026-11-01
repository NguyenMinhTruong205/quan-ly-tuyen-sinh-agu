require('dotenv').config();
const mongoose = require('mongoose');
const HoSoTuyenSinh = require('./models/HoSoTuyenSinh');

async function seedHoSo() {
  try {
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
    console.log('Đã kết nối MongoDB');

    // Xóa dữ liệu cũ (nếu muốn làm sạch)
    // await HoSoTuyenSinh.deleteMany({});

    const danhSachMau = [
      {
        hoTen: 'Nguyễn Văn An',
        cccd: '012345678901',
        ngaySinh: new Date('2006-05-12'),
        soDienThoai: '0901234567',
        diaChi: 'Long Xuyên, An Giang',
        nganhDangKy: 'Công nghệ thông tin',
        diemXetTuyen: 24.5,
        trangThai: 'cho_tham_dinh',
        ghiChuThamDinh: ''
      },
      {
        hoTen: 'Trần Thị Bình',
        cccd: '012345678902',
        ngaySinh: new Date('2006-08-20'),
        soDienThoai: '0912345678',
        diaChi: 'Châu Đốc, An Giang',
        nganhDangKy: 'Kế toán',
        diemXetTuyen: 22.0,
        trangThai: 'cho_tham_dinh',
        ghiChuThamDinh: ''
      },
      {
        hoTen: 'Lê Minh Cường',
        cccd: '012345678903',
        ngaySinh: new Date('2005-11-03'),
        soDienThoai: '0923456789',
        diaChi: 'Tân Châu, An Giang',
        nganhDangKy: 'Quản trị kinh doanh',
        diemXetTuyen: 26.75,
        trangThai: 'trung_tuyen',
        ghiChuThamDinh: 'Hồ sơ đạt yêu cầu'
      },
      {
        hoTen: 'Phạm Thị Dung',
        cccd: '012345678904',
        ngaySinh: new Date('2006-02-15'),
        soDienThoai: '0934567890',
        diaChi: 'Thoại Sơn, An Giang',
        nganhDangKy: 'Công nghệ thông tin',
        diemXetTuyen: 19.5,
        trangThai: 'can_bo_sung',
        ghiChuThamDinh: 'Thiếu giấy chứng nhận tốt nghiệp'
      },
      {
        hoTen: 'Hoàng Văn Em',
        cccd: '012345678905',
        ngaySinh: new Date('2006-07-28'),
        soDienThoai: '0945678901',
        diaChi: 'Chợ Mới, An Giang',
        nganhDangKy: 'Ngôn ngữ Anh',
        diemXetTuyen: 21.25,
        trangThai: 'cho_tham_dinh',
        ghiChuThamDinh: ''
      }
    ];

    await HoSoTuyenSinh.insertMany(danhSachMau);

    console.log('✅ Đã tạo 5 hồ sơ mẫu thành công!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Lỗi:', err.message);
    process.exit(1);
  }
}

seedHoSo();
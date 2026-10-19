const mongoose = require('mongoose');

const hoSoTuyenSinhSchema = new mongoose.Schema(
  {
    // Tài khoản thí sinh nộp hồ sơ
    thiSinh: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    // Thông tin hồ sơ
    hoTen: {
      type: String,
      required: true,
      trim: true
    },

    cccd: {
      type: String,
      required: true,
      trim: true
    },

    ngaySinh: {
      type: Date,
      required: true
    },

    soDienThoai: {
      type: String,
      required: true,
      trim: true
    },

    diaChi: {
      type: String,
      required: true,
      trim: true
    },

    nganhDangKy: {
      type: String,
      required: true,
      trim: true
    },

    diemXetTuyen: {
      type: Number,
      required: true,
      min: 0
    },

    // Trạng thái thẩm định hồ sơ
    trangThai: {
      type: String,
      enum: [
        'cho_tham_dinh',
        'can_bo_sung',
        'khong_dat',
        'trung_tuyen'
      ],
      default: 'cho_tham_dinh'
    },

    ghiChuThamDinh: {
      type: String,
      default: ''
    },

    ngayThamDinh: {
      type: Date,
      default: null
    },

    // Được tạo tự động khi thí sinh trúng tuyển
    mshv: {
      type: String,
      default: null
    },

    emailSinhVien: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  'HoSoTuyenSinh',
  hoSoTuyenSinhSchema
);
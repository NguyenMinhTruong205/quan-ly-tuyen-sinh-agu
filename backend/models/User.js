const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    hoTen: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    matKhau: {
      type: String,
      required: true
    },

    vaiTro: {
      type: String,
      enum: ['thi_sinh', 'can_bo'],
      default: 'thi_sinh'
    },

    daXacThuc: {
      type: Boolean,
      default: false
    },

    otp: {
      type: String,
      default: null
    },

    otpHetHan: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', userSchema);
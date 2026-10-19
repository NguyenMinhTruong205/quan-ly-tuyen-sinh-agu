const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const hoSoRoutes = require('./routes/hoSoRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
// API Backend 1 - Đăng ký, xác thực OTP, đăng nhập
app.use('/api/auth', authRoutes);
app.use('/api/ho-so', hoSoRoutes);


// Hàm kết nối MongoDB hỗ trợ Serverless (Vercel)
const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('Biến môi trường MONGODB_URI chưa được thiết lập!');
  }
  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 8000,
  });
};

// Gọi kết nối ban đầu
connectDB().catch((err) => {
  console.error('Lỗi kết nối khởi tạo MongoDB:', err.message);
});

// Route trang chủ
app.get('/', (req, res) => {
  res.json({
    project: 'QLTS AGU — Hệ thống Quản Lý Tuyển Sinh / Tuyển Sinh AGU',
    role: 'DevOps 2 Service',
    status: 'Running',
    documentation: '/api/health'
  });
});

// Route kiểm tra sức khỏe hệ thống (Health Check)
app.get('/api/health', async (req, res) => {
  let dbStatus = 'disconnected';
  let dbMessage = '';

  try {
    await connectDB();
    dbStatus = 'connected';
    dbMessage = 'MongoDB kết nối thành công';
  } catch (error) {
    dbStatus = 'error';
    dbMessage = error.message;
  }

  const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY);

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: {
      port: PORT,
      hasMongoUri: Boolean(process.env.MONGODB_URI),
      hasGeminiKey: hasGeminiKey
    },
    database: {
      status: dbStatus,
      readyState: mongoose.connection.readyState,
      message: dbMessage
    },
    gemini: {
      status: hasGeminiKey ? 'ready' : 'missing_key',
      message: hasGeminiKey ? 'Gemini API Key đã sẵn sàng' : 'Chưa cấu hình GEMINI_API_KEY'
    }
  });
});

// Khởi chạy server
app.listen(PORT, () => {
  console.log(`🚀 Backend Server đang chạy tại cổng http://localhost:${PORT}`);
});

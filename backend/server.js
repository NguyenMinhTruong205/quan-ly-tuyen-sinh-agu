const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import đường dẫn
const authRoutes = require('./routes/authRoutes');
const hoSoRoutes = require('./routes/hoSoRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// === Middleware CORS linh hoạt ===
const corsOptions = {
  origin: true, // Cho phép tất cả origin kết nối (FE local & FE Vercel cá nhân mới)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// === Đăng ký đường dẫn API ===
app.use('/api/auth', authRoutes);        // Xác thực & phân quyền (/api/auth/dang-ky, /api/auth/xac-thuc-otp)
app.use('/api/ho-so', hoSoRoutes);       // Quản lý hồ sơ tuyển sinh
app.use('/api/chatbot', chatbotRoutes);  // Chatbot hỗ trợ

// === Kết nối MongoDB ===
const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('❌ Thiếu biến MONGODB_URI trong file .env!');
    return;
  }
  
  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ Kết nối CSDL MongoDB thành công');
  } catch (err) {
    console.error('❌ Lỗi kết nối MongoDB:', err.message);
  }
};

connectDB();

// === Trang chủ Backend ===
app.get('/', (req, res) => {
  res.json({
    project: 'QLTS AGU — Hệ thống Quản Lý Tuyển Sinh',
    role: 'Backend Service',
    status: 'Running',
    documentation: '/api/health'
  });
});

// === Kiểm tra trạng thái hệ thống ===
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
    }
  });
});

// === Khởi động server với Host 0.0.0.0 cho Render ===
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend Server đang chạy tại cổng ${PORT}`);
});
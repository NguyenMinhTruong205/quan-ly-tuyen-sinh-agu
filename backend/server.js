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


// === Middleware ===
const allowedOrigins = [
  'http://localhost:3000',
  'https://quan-ly-tuyen-sinh-agu-omega.vercel.app'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log('CORS blocked origin:', origin);
    return callback(new Error('Origin not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

app.use(express.json());

// === Đăng ký đường dẫn API ===
app.use('/api/auth', authRoutes);        // Xác thực & phân quyền (/api/auth/dang-ky, /api/auth/dang-nhap)
app.use('/api/ho-so', hoSoRoutes);       // Quản lý hồ sơ tuyển sinh (/api/ho-so/tra-cuu)
app.use('/api/chatbot', chatbotRoutes);  // Chatbot hỗ trợ

// === Kết nối MongoDB ===
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
  console.log('✅ Kết nối CSDL MongoDB thành công');
};

// Kết nối ngay khi khởi động server
connectDB().catch((err) => {
  console.error('❌ Lỗi kết nối MongoDB:', err.message);
});

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
    },
    gemini: {
      status: hasGeminiKey ? 'ready' : 'missing_key',
      message: hasGeminiKey ? 'Gemini API Key đã sẵn sàng' : 'Chưa cấu hình GEMINI_API_KEY'
    }
  });
});

// === Khởi động server ===
app.listen(PORT, () => {
  console.log(`🚀 Backend Server đang chạy tại cổng ${PORT}`);
  console.log(`📍 Truy cập: http://localhost:${PORT}`);
});

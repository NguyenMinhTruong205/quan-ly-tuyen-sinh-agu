'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'https://quan-ly-tuyen-sinh-agu.onrender.com';
const API_BASE = rawUrl.replace(/^https?:\/+(?!\/)/, 'https://').replace(/\/+$/, '');

export default function RegisterPage() {
  const [form, setForm] = useState({
    hoTen: '',
    email: '',
    matKhau: ''
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE}/api/auth/dang-ky`, {
        hoTen: form.hoTen,
        email: form.email,
        matKhau: form.matKhau
      });

      alert('Đăng ký tài khoản thành công! Mã OTP demo của bạn là: ' + response.data.otpDemo);
      
      // Tự động chuyển hướng sang trang Xác thực OTP
      router.push('/xac-thuc-otp');
    } catch (err) {
      console.error('Lỗi đăng ký chi tiết:', err.response?.data);
      alert('Lỗi đăng ký: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ background: '#fff', padding: '30px', borderRadius: '10px', width: '400px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <h2 style={{ textAlign: 'center', color: '#1a73e8', marginBottom: '20px' }}>Đăng Ký Tài Khoản Thí Sinh</h2>
        
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#333' }}>Họ và tên:</label>
            <input 
              type="text" 
              name="hoTen" 
              placeholder="Nhập họ và tên..." 
              value={form.hoTen} 
              onChange={handleChange} 
              required 
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }} 
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#333' }}>Email:</label>
            <input 
              type="email" 
              name="email" 
              placeholder="Nhập email..." 
              value={form.email} 
              onChange={handleChange} 
              required 
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }} 
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#333' }}>Mật khẩu:</label>
            <input 
              type="password" 
              name="matKhau" 
              placeholder="Nhập mật khẩu..." 
              value={form.matKhau} 
              onChange={handleChange} 
              required 
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }} 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            style={{ background: '#28a745', color: '#fff', padding: '12px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', marginTop: '10px' }}
          >
            {loading ? 'Đang xử lý...' : 'Đăng Ký'}
          </button>
        </form>
      </div>
    </div>
  );
}

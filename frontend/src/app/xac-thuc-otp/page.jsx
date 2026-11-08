'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

// Khai báo trực tiếp Domain Render (có fallback an toàn)
const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'https://quan-ly-tuyen-sinh-agu.onrender.com').replace(/\/+$/, '');

export default function VerifyOtpPage() {
  const [form, setForm] = useState({ email: '', otp: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Thay localhost:5000 bằng API_BASE
      const res = await axios.post(`${API_BASE}/api/auth/xac-thuc-otp`, form);
      alert('Xác thực OTP thành công! Chuyển hướng sang trang đăng nhập.');
      router.push('/dang-nhap');
    } catch (err) {
      console.error('Lỗi xác thực OTP:', err.response?.data);
      alert('Lỗi: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ background: '#fff', padding: '30px', borderRadius: '10px', width: '400px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <h2 style={{ textAlign: 'center', color: '#1a73e8', marginBottom: '20px' }}>🔐 Xác Thực OTP</h2>
        
        <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#333' }}>Email tài khoản:</label>
            <input 
              type="email" 
              name="email" 
              placeholder="Nhập lại email đã đăng ký..." 
              value={form.email} 
              onChange={handleChange} 
              required 
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }} 
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#333' }}>Mã OTP (6 chữ số):</label>
            <input 
              type="text" 
              name="otp" 
              placeholder="Nhập mã OTP..." 
              value={form.otp} 
              onChange={handleChange} 
              required 
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box', letterSpacing: '2px', fontWeight: 'bold' }} 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            style={{ background: '#1a73e8', color: '#fff', padding: '12px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', marginTop: '10px' }}
          >
            {loading ? 'Đang xác thực...' : 'Xác Thực OTP'}
          </button>
        </form>
      </div>
    </div>
  );
}
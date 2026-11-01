'use client';
import { useState } from 'react';
import axios from 'axios';

export default function YeuCauOTPDangNhapPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post('http://localhost:5000/api/auth/yeu-cau-otp-dang-nhap', { email });
      alert(`✅ ${res.data.message}\nOTP demo: ${res.data.otpDemo}`);
      // Chuyển đến trang xác thực OTP đăng nhập kèm email
      window.location.href = `/xac-thuc-otp-dang-nhap?email=${encodeURIComponent(email)}`;
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ background: '#fff', padding: '30px', borderRadius: '10px', width: '400px' }}>
        <h2 style={{ textAlign: 'center', color: '#1a73e8', marginBottom: '20px' }}>🔐 Yêu Cầu OTP Đăng Nhập</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? '#90ee90' : '#2563eb',
              color: '#fff',
              padding: '12px',
              border: 'none',
              borderRadius: '5px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Đang gửi...' : 'Gửi Mã OTP'}
          </button>
        </form>
      </div>
    </div>
  );
}
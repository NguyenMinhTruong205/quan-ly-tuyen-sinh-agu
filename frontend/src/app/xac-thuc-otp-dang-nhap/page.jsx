
'use client';

import { Suspense, useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';

function XacThucOTPForm() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    try {
      setLoading(true);

      const res = await axios.post(
        'http://localhost:5000/api/auth/xac-thuc-otp-dang-nhap',
        {
          email: email.trim(),
          otp: otp.trim()
        }
      );

      const { token, user } = res.data;

      if (!token || !user) {
        throw new Error('Backend chưa trả về token hoặc thông tin người dùng.');
      }

      // Xác định ID người dùng từ dữ liệu Backend trả về
      const userId = user.id || user._id;

      if (!userId) {
        console.error('Thông tin user Backend trả về:', user);
        throw new Error(
          'Thông tin đăng nhập thiếu ID người dùng. Vui lòng kiểm tra Backend.'
        );
      }

      // Lưu token và thông tin người dùng
      localStorage.setItem('token', token);
      localStorage.setItem(
        'user',
        JSON.stringify({
          id: userId,
          hoTen: user.hoTen,
          email: user.email,
          vaiTro: user.vaiTro
        })
      );

      alert(`Đăng nhập thành công! Xin chào ${user.hoTen || 'Bạn'}`);

      if (user.vaiTro === 'can_bo') {
        router.push('/can-bo/dashboard');
      } else {
        router.push('/nop-ho-so');
      }
    } catch (err) {
      console.error(
        'Lỗi xác thực OTP:',
        err.response?.data || err
      );

      alert(
        'Lỗi: ' +
          (err.response?.data?.message ||
            err.message ||
            'Không thể xác thực OTP.')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f0f2f5',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px'
      }}
    >
      <div
        style={{
          background: '#fff',
          padding: '30px',
          borderRadius: '10px',
          width: '100%',
          maxWidth: '400px',
          boxSizing: 'border-box'
        }}
      >
        <h2
          style={{
            textAlign: 'center',
            color: '#1a73e8',
            marginBottom: '20px'
          }}
        >
          🔐 Nhập Mã OTP
        </h2>

        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
          }}
        >
          <div>
            <label
              style={{
                display: 'block',
                fontWeight: 'bold',
                marginBottom: '5px'
              }}
            >
              Email:
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontWeight: 'bold',
                marginBottom: '5px'
              }}
            >
              Mã OTP (6 chữ số):
            </label>

            <input
              type="text"
              inputMode="numeric"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))
              }
              required
              maxLength={6}
              pattern="[0-9]{6}"
              title="Vui lòng nhập đúng 6 chữ số"
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? '#90ee90' : '#28a745',
              color: '#fff',
              padding: '12px',
              border: 'none',
              borderRadius: '5px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Đang xác thực...' : 'Xác Thực'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function XacThucOTPDangNhapPage() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: '40px', textAlign: 'center' }}>
          Đang tải trang xác thực OTP...
        </div>
      }
    >
      <XacThucOTPForm />
    </Suspense>
  );
}

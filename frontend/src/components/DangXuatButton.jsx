'use client';
import { useRouter } from 'next/navigation';
import axios from 'axios';

// ✅ Sử dụng biến môi trường API_URL chuẩn
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://quan-ly-tuyen-sinh-agu-1.onrender.com';

export default function DangXuatButton() {
  const router = useRouter();

  const handleDangXuat = async () => {
    if (!confirm('Bạn có chắc chắn muốn đăng xuất?')) return;

    try {
      const token = localStorage.getItem('token');
      
      // ✅ Thay đường dẫn localhost:5000 bằng API_URL
      if (token) {
        await axios.post(
          `${API_URL}/api/auth/dang-xuat`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch (err) {
      console.log('Thông báo lỗi không quan trọng:', err.message);
    } finally {
      // ✅ Luôn xóa dữ liệu ở Local Storage bất kể API thành công/thất bại
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      alert('✅ Đăng xuất thành công');
      router.push('/dang-nhap'); // Chuyển về trang đăng nhập
    }
  };

  return (
    <button
      onClick={handleDangXuat}
      style={{
        padding: '8px 16px',
        background: '#ef4444',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold'
      }}
    >
      🚪 Đăng Xuất
    </button>
  );
}
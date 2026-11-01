'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function SubmitApplicationPage() {
  const router = useRouter();

  // Kiểm tra đăng nhập ngay khi vào trang
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Vui lòng đăng nhập trước!');
      router.push('/dang-nhap');
    }
  }, [router]);

  const [formData, setFormData] = useState({
    hoTen: '',
    cccd: '',
    ngaySinh: '',
    soDienThoai: '',
    diaChi: '',
    email: '',
    nganhXetTuyen: 'Công nghệ thông tin',
    tongDiem: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [uploaderName, setUploaderName] = useState('');
  const [loading, setLoading] = useState(false);
  const [maHoSo, setMaHoSo] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setShowPopup(true);
    }
  };

  const handleConfirmUpload = async (e) => {
    e.preventDefault();
    if (!uploaderName.trim()) {
      alert('Vui lòng nhập Họ tên người upload file!');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Vui lòng đăng nhập lại!');
      router.push('/dang-nhap');
      return;
    }

    setShowPopup(false);
    setLoading(true);

    try {
      // Gửi dữ liệu dạng JSON (không cần FormData nếu không xử lý file ở Backend)
      const payload = {
        hoTen: formData.hoTen,
        cccd: formData.cccd,
        ngaySinh: formData.ngaySinh,
        soDienThoai: formData.soDienThoai,
        diaChi: formData.diaChi,
        nganhDangKy: formData.nganhXetTuyen,
        diemXetTuyen: formData.tongDiem
      };

      console.log('Dữ liệu gửi đi:', payload);

      const res = await axios.post(
        'http://localhost:5000/api/ho-so',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Lấy mã hồ sơ — lấy 6 ký tự cuối của _id
      const maSo = res.data.hoSo?._id?.slice(-6).toUpperCase() || 'Đã cấp';
      setMaHoSo(maSo);

      alert(`✅ Nộp hồ sơ thành công!\nMã hồ sơ của bạn: ${maSo}\nSẽ chuyển đến trang tra cứu sau 3 giây...`);

      setTimeout(() => {
        router.push('/tra-cuu');
      }, 3000);

    } catch (error) {
      console.error('❌ Lỗi chi tiết:', error.response?.data || error.message);
      alert('Lỗi: ' + (error.response?.data?.message || error.message || 'Lỗi server'));
    } finally {
      setLoading(false);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5', padding: '40px 20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', background: '#ffffff', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <h2 style={{ textAlign: 'center', color: '#1a73e8', marginBottom: '25px' }}>📝 Cổng Thí Sinh - Nộp Hồ Sơ Xét Tuyển AGU</h2>

        {maHoSo && (
          <div style={{ padding: '15px', background: '#dcfce7', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' }}>
            <p style={{ fontWeight: 'bold', color: '#166534', margin: 0 }}>Mã hồ sơ của bạn: <strong style={{ fontSize: '18px' }}>{maHoSo}</strong></p>
            <p style={{ fontSize: '14px', color: '#166534', marginTop: '8px' }}>Lưu lại mã này để tra cứu trạng thái!</p>
          </div>
        )}

        <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#333' }}>Họ và tên thí sinh:</label>
            <input
              type="text"
              name="hoTen"
              value={formData.hoTen}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#333' }}>Số CCCD / CMND:</label>
            <input
              type="text"
              name="cccd"
              value={formData.cccd}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#333' }}>Ngày sinh:</label>
            <input
              type="date"
              name="ngaySinh"
              value={formData.ngaySinh}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#333' }}>Số điện thoại:</label>
            <input
              type="text"
              name="soDienThoai"
              value={formData.soDienThoai}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#333' }}>Địa chỉ liên hệ:</label>
            <input
              type="text"
              name="diaChi"
              value={formData.diaChi}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#333' }}>Email liên hệ:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#333' }}>Ngành đăng ký xét tuyển:</label>
            <select
              name="nganhXetTuyen"
              value={formData.nganhXetTuyen}
              onChange={handleChange}
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box', background: '#fff' }}
            >
              <option value="Công nghệ thông tin">Công nghệ thông tin</option>
              <option value="Quản trị kinh doanh">Quản trị kinh doanh</option>
              <option value="Kế toán">Kế toán</option>
              <option value="Ngôn ngữ Anh">Ngôn ngữ Anh</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#333' }}>Tổng điểm xét tuyển:</label>
            <input
              type="number"
              step="0.1"
              name="tongDiem"
              value={formData.tongDiem}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#333' }}>Tải lên file minh chứng (tùy chọn):</label>
            <input
              type="file"
              onChange={handleFileChange}
              style={{ display: 'block', marginTop: '5px' }}
            />
            {selectedFile && <p style={{ color: 'green', fontSize: '14px', marginTop: '5px' }}>Đã chọn file: {selectedFile.name}</p>}
          </div>

          <button
            type="button"
            onClick={handleConfirmUpload}
            disabled={loading}
            style={{
              background: loading ? '#93c5fd' : '#1a73e8',
              color: '#fff',
              padding: '12px',
              border: 'none',
              borderRadius: '5px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              fontSize: '16px',
              marginTop: '10px'
            }}
          >
            {loading ? 'Đang gửi hồ sơ...' : 'Gửi Hồ Sơ'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px' }}>
          <a href="/tra-cuu" style={{ color: '#1a73e8', textDecoration: 'none', fontWeight: '600' }}>🔍 Tra cứu trạng thái hồ sơ →</a>
        </p>

        {showPopup && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
            <div style={{ background: '#fff', padding: '25px', borderRadius: '8px', width: '380px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
              <h3 style={{ marginTop: 0, color: '#333' }}>⚠️ Xác nhận thông tin tải file</h3>
              <p style={{ fontSize: '14px', color: '#555' }}>File đính kèm: <b>{selectedFile?.name}</b></p>

              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold', color: '#333' }}>
                Nhập Họ tên người upload file:
              </label>
              <input
                type="text"
                placeholder="Ví dụ: Nguyễn Văn A"
                value={uploaderName}
                onChange={(e) => setUploaderName(e.target.value)}
                style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  onClick={() => { setShowPopup(false); setSelectedFile(null); }}
                  style={{ padding: '8px 15px', background: '#ccc', border: 'none', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' }}
                >
                  Hủy
                </button>
                <button
                  onClick={handleClosePopup}
                  style={{ padding: '8px 15px', background: '#28a745', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' }}
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
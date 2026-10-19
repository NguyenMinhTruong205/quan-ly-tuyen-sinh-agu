'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/health');
      if (!res.ok) {
        throw new Error(`HTTP error: ${res.status}`);
      }
      const data = await res.json();
      setHealthData(data);
    } catch (err) {
      setError(err.message || 'Không thể kết nối đến API');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <main style={{
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '40px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '30px'
    }}>
      {/* Header */}
      <header style={{
        textAlign: 'center',
        padding: '30px 20px',
        background: 'rgba(30, 41, 59, 0.7)',
        backdropFilter: 'blur(12px)',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{
          display: 'inline-block',
          padding: '6px 16px',
          borderRadius: '50px',
          background: 'rgba(99, 102, 241, 0.2)',
          border: '1px solid rgba(99, 102, 241, 0.4)',
          color: '#a5b4fc',
          fontSize: '13px',
          fontWeight: 600,
          marginBottom: '14px',
          letterSpacing: '0.5px'
        }}>
          🚀 DEVOPS 2 • DEPLOYMENT STATUS
        </div>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 800,
          background: 'linear-gradient(to right, #38bdf8, #818cf8, #c084fc)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '10px'
        }}>
          QLTS AGU — Quản Lý Tuyển Sinh
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: '650px', margin: '0 auto' }}>
          Dự án Next.js đã được cấu hình hoàn chỉnh cho DevOps 2 (Quản lý .env, kết nối MongoDB, Gemini AI & sẵn sàng Deploy Vercel/Render).
        </p>
      </header>

      {/* Live System Health Section */}
      <section style={{
        background: 'rgba(30, 41, 59, 0.7)',
        backdropFilter: 'blur(12px)',
        borderRadius: '20px',
        padding: '28px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '15px',
          marginBottom: '24px'
        }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#f8fafc' }}>
              Trạng thái hệ thống (Live Environment & Health)
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '4px' }}>
              Kiểm tra tình trạng nạp biến môi trường và kết nối dữ liệu máy chủ
            </p>
          </div>
          <button
            onClick={checkHealth}
            disabled={loading}
            style={{
              padding: '10px 22px',
              borderRadius: '12px',
              border: 'none',
              background: loading ? '#475569' : 'linear-gradient(135deg, #0284c7, #6366f1)',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
            }}
          >
            {loading ? 'Đang kiểm tra...' : '🔄 Kiểm tra lại (Refresh)'}
          </button>
        </div>

        {error && (
          <div style={{
            padding: '16px',
            borderRadius: '12px',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#fca5a5',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            ❌ Lỗi: {error}
          </div>
        )}

        {/* Status Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '18px'
        }}>
          {/* Next.js Server Card */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.07)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', color: '#94a3b8', fontWeight: 500 }}>Next.js Server</span>
              <span style={{
                fontSize: '12px',
                padding: '4px 10px',
                borderRadius: '20px',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#34d399',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                fontWeight: 600
              }}>
                ● ONLINE
              </span>
            </div>
            <div style={{ marginTop: '12px', fontSize: '1.1rem', fontWeight: 700, color: '#f1f5f9' }}>
              App Router v15+
            </div>
            <p style={{ marginTop: '6px', fontSize: '13px', color: '#64748b' }}>
              Đã tối ưu hóa cho Vercel & Node.js
            </p>
          </div>

          {/* MongoDB Card */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.07)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', color: '#94a3b8', fontWeight: 500 }}>MongoDB Database</span>
              <span style={{
                fontSize: '12px',
                padding: '4px 10px',
                borderRadius: '20px',
                background: healthData?.database?.status === 'connected'
                  ? 'rgba(16, 185, 129, 0.15)'
                  : 'rgba(245, 158, 11, 0.15)',
                color: healthData?.database?.status === 'connected' ? '#34d399' : '#fbbf24',
                border: `1px solid ${healthData?.database?.status === 'connected' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                fontWeight: 600
              }}>
                {healthData?.database?.status === 'connected' ? '● ĐÃ KẾT NỐI' : '○ CHỜ CẤU HÌNH'}
              </span>
            </div>
            <div style={{ marginTop: '12px', fontSize: '1.1rem', fontWeight: 700, color: '#f1f5f9' }}>
              {healthData?.environment?.hasMongoUri ? 'MONGODB_URI: Đã nạp' : 'MONGODB_URI: Chưa có'}
            </div>
            <p style={{ marginTop: '6px', fontSize: '13px', color: '#64748b' }}>
              {healthData?.database?.message || 'Đang chờ điền biến môi trường...'}
            </p>
          </div>

          {/* Gemini AI Card */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.07)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', color: '#94a3b8', fontWeight: 500 }}>Google Gemini API</span>
              <span style={{
                fontSize: '12px',
                padding: '4px 10px',
                borderRadius: '20px',
                background: healthData?.environment?.hasGeminiApiKey
                  ? 'rgba(16, 185, 129, 0.15)'
                  : 'rgba(245, 158, 11, 0.15)',
                color: healthData?.environment?.hasGeminiApiKey ? '#34d399' : '#fbbf24',
                border: `1px solid ${healthData?.environment?.hasGeminiApiKey ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                fontWeight: 600
              }}>
                {healthData?.environment?.hasGeminiApiKey ? '● SẴN SÀNG' : '○ CHỜ KEY'}
              </span>
            </div>
            <div style={{ marginTop: '12px', fontSize: '1.1rem', fontWeight: 700, color: '#f1f5f9' }}>
              SDK: @google/genai
            </div>
            <p style={{ marginTop: '6px', fontSize: '13px', color: '#64748b' }}>
              {healthData?.environment?.hasGeminiApiKey ? 'API Key đã được tải vào môi trường' : 'Cần điền GEMINI_API_KEY vào .env'}
            </p>
          </div>
        </div>
      </section>

      {/* DevOps 2 Checklist & Guide */}
      <section style={{
        background: 'rgba(30, 41, 59, 0.7)',
        backdropFilter: 'blur(12px)',
        borderRadius: '20px',
        padding: '28px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '16px', color: '#f8fafc' }}>
          📋 Nhiệm vụ DevOps 2 đã hoàn thiện
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: '#10b981', fontWeight: 'bold' }}>✔</span>
            <span>Khởi tạo cấu trúc dự án Next.js (App Router, JavaScript, Mongoose, @google/genai).</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: '#10b981', fontWeight: 'bold' }}>✔</span>
            <span>Quản lý bảo mật: Đã tạo <code>.env.example</code> (mẫu) và <code>.env.local</code> (chứa key thật).</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: '#10b981', fontWeight: 'bold' }}>✔</span>
            <span>Bảo vệ Git: Cập nhật <code>.gitignore</code> để ngăn chặn lộ lọt file <code>.env</code> lên GitHub.</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: '#10b981', fontWeight: 'bold' }}>✔</span>
            <span>Tạo API Health Check tại <code>/api/health</code> để nghiệm thu kết nối MongoDB và Gemini Key khi deploy.</span>
          </div>
        </div>
      </section>

      {/* Next Steps for Deploy */}
      <section style={{
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(49, 46, 129, 0.6))',
        borderRadius: '20px',
        padding: '28px',
        border: '1px solid rgba(99, 102, 241, 0.3)'
      }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '12px', color: '#f8fafc' }}>
          🚀 Hướng dẫn bước tiếp theo: Deploy lên Vercel
        </h2>
        <ol style={{ paddingLeft: '20px', color: '#cbd5e1', lineHeight: '1.8', fontSize: '14px' }}>
          <li>Điền chuỗi MongoDB và Gemini API Key vào file <code>.env.local</code> ở máy của bạn.</li>
          <li>Đẩy code lên repository GitHub cá nhân/nhóm (chạy: <code>git add .</code>, <code>git commit -m "feat: setup nextjs devops"</code>, <code>git push</code>).</li>
          <li>Đăng nhập <a href="https://vercel.com" target="_blank" rel="noreferrer" style={{ color: '#38bdf8', textDecoration: 'underline' }}>Vercel.com</a> &gt; <strong>Import Git Repository</strong>.</li>
          <li>Trong mục <strong>Environment Variables</strong> trên Vercel, thêm 2 biến:
            <ul style={{ paddingLeft: '20px', marginTop: '6px' }}>
              <li><code>MONGODB_URI</code>: <em>dán link kết nối MongoDB</em></li>
              <li><code>GEMINI_API_KEY</code>: <em>dán API Key Gemini</em></li>
            </ul>
          </li>
          <li>Nhấn <strong>Deploy</strong> để nhận link web công khai nộp cho nhóm!</li>
        </ol>
      </section>
    </main>
  );
}

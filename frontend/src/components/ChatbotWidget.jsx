'use client';

import { useState, useRef, useEffect } from 'react';

// ✅ Chuẩn hóa API_BASE kết nối với Backend Render
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://quan-ly-tuyen-sinh-agu-1.onrender.com';

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Xin chào! Em có thể hỗ trợ gì về thông tin tuyển sinh hôm nay ạ?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMsg = { role: 'user', content: inputMessage };
    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // ✅ Sửa đường dẫn API chuẩn không bị trùng /api/api
      const res = await fetch(`${API_BASE}/api/chatbot/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: inputMessage })
      });

      if (!res.ok) throw new Error(`Lỗi server: ${res.status}`);
      const data = await res.json();

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.answer || 'Xin lỗi, chưa có câu trả lời, vui lòng hỏi lại nhé!'
      }]);

    } catch (err) {
      console.error('Lỗi Chatbot:', err);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '🔌 Mất kết nối với máy chủ, vui lòng thử lại sau!'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: '#2563eb',
          color: 'white',
          border: 'none',
          fontSize: '26px',
          cursor: 'pointer',
          boxShadow: '0 4px 14px rgba(37,99,235,0.35)',
          zIndex: 9999,
          transition: 'transform 0.2s'
        }}
        onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
      >
        💬
      </button>

      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '95px',
          right: '24px',
          width: '390px',
          height: '520px',
          backgroundColor: '#fff',
          borderRadius: '16px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.18)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          zIndex: 9998
        }}>
          
          <div style={{
            padding: '14px 20px',
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>🤖 Tư vấn Tuyển sinh AI</span>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '18px', cursor: 'pointer' }}
            >
              ×
            </button>
          </div>

          <div style={{
            flex: 1,
            padding: '16px',
            overflowY: 'auto',
            backgroundColor: '#f0f4f8'
          }}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  marginBottom: '14px',
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div style={{
                  maxWidth: '80%',
                  padding: '11px 16px',
                  borderRadius: '18px',
                  borderBottomLeftRadius: msg.role === 'assistant' ? '4px' : '18px',
                  borderBottomRightRadius: msg.role === 'user' ? '4px' : '18px',
                  backgroundColor: msg.role === 'user' ? '#2563eb' : '#ffffff',
                  color: msg.role === 'user' ? 'white' : '#334155',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.08)'
                }}>
                  {msg.content}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div style={{ textAlign: 'left', margin: '8px 0' }}>
                <span style={{ 
                  backgroundColor: '#fff', 
                  padding: '10px 16px', 
                  borderRadius: '18px', 
                  borderBottomLeftRadius: '4px',
                  color: '#64748b' 
                }}>
                  Đang suy nghĩ...
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} style={{
            display: 'flex',
            padding: '14px',
            borderTop: '1px solid #e2e8f0',
            backgroundColor: 'white'
          }}>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Nhập câu hỏi... VD: Chỉ tiêu ngành CNTT?"
              style={{
                flex: 1,
                padding: '12px 18px',
                border: '1px solid #cbd5e1',
                borderRadius: '24px',
                fontSize: '14px',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              disabled={isLoading}
              style={{
                marginLeft: '10px',
                padding: '12px 22px',
                backgroundColor: isLoading ? '#93c5fd' : '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '24px',
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
            >
              Gửi
            </button>
          </form>
        </div>
      )}
    </>
  );
}
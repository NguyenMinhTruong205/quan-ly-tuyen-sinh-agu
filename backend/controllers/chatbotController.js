const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.askAI = async (req, res) => {
  try {
    const { question } = req.body;
    
    if (!question) {
      return res.status(400).json({ error: 'Thiếu câu hỏi' });
    }

    // === Hướng dẫn AI chỉ trả lời về tuyển sinh ===
    const prompt = `
      Bạn là trợ lý tư vấn tuyển sinh của trường đại học.
      Chỉ trả lời các câu hỏi liên quan đến: ngành học, chỉ tiêu, hồ sơ, điểm chuẩn, quy trình đăng ký, kết quả tuyển sinh.
      Nếu câu hỏi không liên quan, lịch sự từ chối trả lời.
      Trả lời ngắn gọn, dễ hiểu, thân thiện.
      
      Câu hỏi: ${question}
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-3.8-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ answer: text });
    
  } catch (error) {
    console.error('Lỗi gọi Gemini:', error);
    res.status(500).json({ 
      answer: 'Xin lỗi, hệ thống AI đang gặp sự cố, vui lòng thử lại sau!' 
    });
  }
};
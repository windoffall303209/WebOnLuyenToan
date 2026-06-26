const { GoogleGenerativeAI } = require('@google/generative-ai');
const Question = require('../models/Question');
require('dotenv').config();

class ChatController {
  // Điểm xử lý hội thoại AI chất vấn học sinh (Hỗ trợ Multi-turn)
  static async chatTeacher(req, res) {
    try {
      const { questionId, userAnswer, studentExplanation, history } = req.body;
      if (!questionId || userAnswer === undefined || !studentExplanation) {
        return res.status(400).json({ error: 'Thiếu thông tin chất vấn' });
      }

      // Tải câu hỏi từ database
      const question = await Question.getQuestionById(questionId);
      if (!question) {
        return res.status(404).json({ error: 'Không tìm thấy câu hỏi' });
      }

      const isAnswerCorrect = (String(userAnswer).trim().toLowerCase() === String(question.correct_answer).trim().toLowerCase());

      // Kiểm tra xem học sinh có "khoanh lụi" bằng phân tích từ khóa cục bộ trước
      const guessKeywords = ['lụi', 'bừa', 'mò', 'đoán', 'không biết', 'ko biết', 'ko biet', 'hên xui', 'may mắn', 'nhắm mắt', 'đại', 'khoanh đại', 'random', 'lụi thôi'];
      const textLower = studentExplanation.toLowerCase().trim();
      
      const admittedGuessing = guessKeywords.some(keyword => textLower.includes(keyword)) || textLower.length < 3;

      // 1. NẾU CÓ GEMINI API KEY -> GỌI GEMINI THỰC TẾ (HỖ TRỢ TRÒ CHUYỆN NHIỀU LƯỢT)
      if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== '') {
        try {
          const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
          const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
          
          const systemInstruction = `
Bạn là một giáo viên dạy Toán lớp 6 (sách Cánh Diều) rất thân thiện, hiền từ và hài hước tên là "Thầy Vũ Trụ".
Bạn đang giảng bài và nói chuyện với học sinh 11-12 tuổi thông qua khung chat.

Thông tin bài toán:
- Đề bài: "${question.question_text}"
- Đáp án đúng của hệ thống: "${question.correct_answer}"
- Đáp án học sinh đã chọn: "${userAnswer}"
- Trạng thái trả lời: ${isAnswerCorrect ? 'ĐÚNG' : 'SAI'}
- Lời giải chi tiết của bài toán: "${question.explanation}"

Nhiệm vụ của bạn:
1. Đánh giá xem học sinh thực sự hiểu bài hay đang chọn bừa (khoanh lụi) dựa trên câu trả lời của họ.
2. Trả lời bằng tiếng Việt, xưng "Thầy" và gọi học sinh là "em".
3. Phản hồi ngắn gọn (2-3 câu ngắn), dễ hiểu, mang tính động viên và định hướng sư phạm.
4. Nếu học sinh thừa nhận khoanh lụi hoặc trả lời sai câu hỏi của bạn: Hãy đưa ra một câu hỏi gợi ý nhỏ hoặc một phép toán cực kỳ đơn giản để hướng dẫn em suy nghĩ từng bước và giải thích lại.
5. Tiếp tục cuộc hội thoại để hướng dẫn cho đến khi học sinh trả lời đúng gợi ý và hiểu được bài học.
`;

          const model = genAI.getGenerativeModel({ 
            model: modelName,
            systemInstruction: systemInstruction
          });

          // Định dạng lại lịch sử trò chuyện cho đúng cấu trúc Gemini SDK
          // format: [ { role: 'user'|'model', parts: [{ text: '...' }] } ]
          // LƯU Ý: Gemini yêu cầu lịch sử phải BẮT ĐẦU bằng role 'user'
          const geminiHistory = [];
          if (history && Array.isArray(history)) {
            let foundFirstUser = false;
            history.forEach(msg => {
              // Bỏ qua tin nhắn hệ thống
              if (msg.role === 'system') return;
              
              const role = msg.role === 'ai' ? 'model' : 'user';
              
              // Bỏ qua các tin nhắn 'model' ở đầu (trước khi có tin nhắn user đầu tiên)
              if (!foundFirstUser && role === 'model') return;
              if (role === 'user') foundFirstUser = true;
              
              geminiHistory.push({
                role: role,
                parts: [{ text: msg.text }]
              });
            });
          }

          // Khởi động chat session có lịch sử để duy trì ngữ cảnh
          const chat = model.startChat({
            history: geminiHistory
          });

          // Gửi tin nhắn mới của học sinh lên AI
          const result = await chat.sendMessage(studentExplanation);
          const response = await result.response;
          const aiResponseText = response.text().trim();

          return res.json({
            reply: aiResponseText,
            isGuessing: admittedGuessing,
            isCorrect: isAnswerCorrect
          });
        } catch (apiError) {
          console.error('Lỗi khi gọi Gemini API, chuyển sang Fallback cục bộ:', apiError.message);
          // Rơi xuống phần fallback cục bộ nếu API lỗi
        }
      }

      // 2. FALLBACK CỤC BỘ (Nếu không có API Key hoặc bị lỗi API)
      let reply = '';
      if (admittedGuessing) {
        if (isAnswerCorrect) {
          reply = `Thầy biết ngay mà! Ăn may khoanh trúng đáp án đúng "${question.correct_answer}" là không được đâu nhé. Em hãy đọc lại kỹ phần Lời giải chi tiết ở trên xem tại sao lại tính ra kết quả đó, rồi nói lại cho thầy biết em đã hiểu chưa nhé?`;
        } else {
          reply = `Đã chọn bừa mà lại còn chọn sai nữa rồi! Không sao cả, xem ngay Lời giải chi tiết ở trên để biết tại sao kết quả lại là "${question.correct_answer}" nhé. Nhìn xong hãy chat nói lại cho thầy xem em hiểu chưa nha!`;
        }
      } else {
        // Học sinh có cố gắng giải thích
        if (isAnswerCorrect) {
          reply = `Tuyệt vời em ơi! Em giải thích rất có lý. Thầy tin là em tự làm bằng chính năng lực của mình. Cố gắng phát huy tinh thần tự học này nhé!`;
        } else {
          reply = `Cảm ơn em đã chia sẻ cách nghĩ của mình! Mặc dù đáp án của em chưa đúng hoàn toàn, nhưng tinh thần tự lập luận của em rất đáng khen. Em hãy xem lại lời giải chi tiết xem bị nhầm ở bước nào nhé!`;
        }
      }

      return res.json({
        reply: reply,
        isGuessing: admittedGuessing,
        isCorrect: isAnswerCorrect
      });

    } catch (error) {
      console.error('Lỗi trong chatController:', error);
      return res.status(500).json({ error: 'Lỗi server khi chat với AI' });
    }
  }
}

module.exports = ChatController;

const Question = require('../models/Question');

class QuestionController {
  // Lấy các bài học của một chương
  static async getLessons(req, res) {
    try {
      const chapterNum = parseInt(req.query.chapter);
      if (isNaN(chapterNum)) {
        return res.status(400).json({ error: 'Chương không hợp lệ' });
      }
      const lessons = await Question.getLessonsByChapter(chapterNum);
      return res.json(lessons);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách bài học:', error);
      return res.status(500).json({ error: 'Lỗi server khi tải bài học' });
    }
  }

  // Lấy câu hỏi ngẫu nhiên của bài học
  static async getQuestions(req, res) {
    try {
      const lessonId = parseInt(req.query.lessonId);
      if (isNaN(lessonId)) {
        return res.status(400).json({ error: 'Mã bài học không hợp lệ' });
      }
      const questions = await Question.getQuestionsByLesson(lessonId);
      // Ẩn đáp án đúng trước khi gửi cho client để chống hack/inspect element
      const sanitizeQuestions = questions.map(q => {
        return {
          id: q.id,
          lesson_id: q.lesson_id,
          question_text: q.question_text,
          question_type: q.question_type,
          options: q.options,
          image_url: q.image_url
        };
      });
      return res.json(sanitizeQuestions);
    } catch (error) {
      console.error('Lỗi khi lấy câu hỏi:', error);
      return res.status(500).json({ error: 'Lỗi server khi tải câu hỏi' });
    }
  }

  // So sánh đáp án từ phía client gửi lên
  static async checkAnswer(req, res) {
    try {
      const { questionId, userAnswer } = req.body;
      if (!questionId || userAnswer === undefined) {
        return res.status(400).json({ error: 'Dữ liệu kiểm tra không đầy đủ' });
      }

      const question = await Question.getQuestionById(questionId);
      if (!question) {
        return res.status(404).json({ error: 'Không tìm thấy câu hỏi' });
      }

      // Làm sạch chuỗi so sánh (bỏ khoảng trắng và dấu nháy nếu có)
      const cleanUserAns = String(userAnswer).trim().toLowerCase().replace(/['"]/g, '');
      const cleanCorrectAns = String(question.correct_answer).trim().toLowerCase().replace(/['"]/g, '');
      
      const isCorrect = (cleanUserAns === cleanCorrectAns);

      return res.json({
        correct: isCorrect,
        correct_answer: question.correct_answer,
        explanation: question.explanation
      });
    } catch (error) {
      console.error('Lỗi khi kiểm tra đáp án:', error);
      return res.status(500).json({ error: 'Lỗi server khi kiểm tra đáp án' });
    }
  }
}

module.exports = QuestionController;

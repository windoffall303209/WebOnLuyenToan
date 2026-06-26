const db = require('../config/db');

class Question {
  // Lấy toàn bộ bài học theo chương
  static async getLessonsByChapter(chapterNum) {
    const [rows] = await db.query(
      'SELECT id, lesson_num, title, description FROM lessons WHERE chapter_num = ? ORDER BY lesson_num ASC',
      [chapterNum]
    );
    return rows;
  }

  // Lấy câu hỏi ngẫu nhiên của một bài học (ví dụ: tối đa 5 câu)
  static async getQuestionsByLesson(lessonId, limit = 10) {
    const [rows] = await db.query(
      'SELECT id, lesson_id, question_text, question_type, options, correct_answer, explanation, image_url FROM questions WHERE lesson_id = ? ORDER BY RAND() LIMIT ?',
      [lessonId, limit]
    );
    return rows;
  }

  // Lấy một câu hỏi theo ID cụ thể
  static async getQuestionById(questionId) {
    const [rows] = await db.query(
      'SELECT id, lesson_id, question_text, question_type, options, correct_answer, explanation, image_url FROM questions WHERE id = ?',
      [questionId]
    );
    return rows[0] || null;
  }
}

module.exports = Question;

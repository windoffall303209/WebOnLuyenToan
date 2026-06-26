const db = require('../config/db');
const crypto = require('crypto');

class Progress {
  // Hàm tạo Salt ngẫu nhiên
  static generateSalt() {
    return crypto.randomBytes(16).toString('hex');
  }

  // Hàm băm mật khẩu bảo mật (PBKDF2)
  static hashPassword(password, salt) {
    return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  }

  // Đăng ký tài khoản học sinh mới
  static async register(username, password) {
    // Kiểm tra xem username đã tồn tại chưa
    const [existing] = await db.query(
      'SELECT id FROM user_progress WHERE username = ?',
      [username]
    );

    if (existing.length > 0) {
      throw new Error('Tên tài khoản này đã được sử dụng!');
    }

    const salt = this.generateSalt();
    const passwordHash = this.hashPassword(password, salt);

    const [result] = await db.query(
      'INSERT INTO user_progress (username, password_hash, salt, xp, stars, level, high_score_game) VALUES (?, ?, ?, 0, 0, 1, 0)',
      [username, passwordHash, salt]
    );

    return {
      id: result.insertId,
      username,
      xp: 0,
      stars: 0,
      level: 1,
      high_score_game: 0
    };
  }

  // Đăng nhập và xác thực học sinh
  static async authenticate(username, password) {
    const [rows] = await db.query(
      'SELECT id, username, password_hash, salt, xp, stars, level, high_score_game FROM user_progress WHERE username = ?',
      [username]
    );

    if (rows.length === 0) {
      throw new Error('Tên đăng nhập hoặc mật khẩu không chính xác!');
    }

    const user = rows[0];
    const computedHash = this.hashPassword(password, user.salt);

    if (computedHash !== user.password_hash) {
      throw new Error('Tên đăng nhập hoặc mật khẩu không chính xác!');
    }

    // Trả về thông tin không chứa hash/salt
    return {
      id: user.id,
      username: user.username,
      xp: user.xp,
      stars: user.stars,
      level: user.level,
      high_score_game: user.high_score_game
    };
  }

  // Lấy tiến trình người dùng
  static async getProgress(username) {
    const [rows] = await db.query(
      'SELECT id, username, xp, stars, level, high_score_game FROM user_progress WHERE username = ?',
      [username]
    );
    return rows[0] || null;
  }

  // Cập nhật tiến trình học tập
  static async updateProgress(username, xp, stars, level) {
    const [result] = await db.query(
      'UPDATE user_progress SET xp = ?, stars = ?, level = ? WHERE username = ?',
      [xp, stars, level, username]
    );
    return result.affectedRows > 0;
  }

  // Cập nhật điểm kỷ lục game phi thuyền
  static async updateHighScore(username, score) {
    const [rows] = await db.query(
      'SELECT high_score_game FROM user_progress WHERE username = ?',
      [username]
    );
    
    if (rows.length === 0) return false;

    const currentHighScore = rows[0].high_score_game;
    if (score > currentHighScore) {
      await db.query(
        'UPDATE user_progress SET high_score_game = ? WHERE username = ?',
        [score, username]
      );
      return true;
    }
    return false;
  }

  // Ghi nhận lịch sử làm bài tập
  static async saveHistory(username, lessonId, scoreCorrect, totalQuestions, xpEarned, starsEarned) {
    const user = await this.getProgress(username);
    if (!user) throw new Error('Không tìm thấy tài khoản người dùng!');

    const [result] = await db.query(
      'INSERT INTO user_history (user_id, lesson_id, score_correct, total_questions, xp_earned, stars_earned) VALUES (?, ?, ?, ?, ?, ?)',
      [user.id, lessonId, scoreCorrect, totalQuestions, xpEarned, starsEarned]
    );

    return result.insertId;
  }

  // Lấy danh sách lịch sử làm bài
  static async getHistory(username) {
    const user = await this.getProgress(username);
    if (!user) return [];

    const [rows] = await db.query(
      `SELECT h.score_correct, h.total_questions, h.xp_earned, h.stars_earned, h.created_at, l.title as lesson_title 
       FROM user_history h 
       JOIN lessons l ON h.lesson_id = l.id 
       WHERE h.user_id = ? 
       ORDER BY h.created_at DESC`,
      [user.id]
    );
    return rows;
  }
}

module.exports = Progress;

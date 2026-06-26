const Progress = require('../models/Progress');

class ProgressController {
  // Đăng ký tài khoản học sinh
  static async register(req, res) {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: 'Tên đăng nhập và mật khẩu là bắt buộc' });
      }
      
      const user = await Progress.register(username.trim(), password);
      return res.status(201).json(user);
    } catch (error) {
      console.error('Lỗi khi đăng ký:', error.message);
      return res.status(400).json({ error: error.message || 'Lỗi server khi đăng ký' });
    }
  }

  // Đăng nhập học sinh
  static async login(req, res) {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: 'Tên đăng nhập và mật khẩu là bắt buộc' });
      }

      const user = await Progress.authenticate(username.trim(), password);
      return res.json(user);
    } catch (error) {
      console.error('Lỗi khi đăng nhập:', error.message);
      return res.status(401).json({ error: error.message || 'Tên đăng nhập hoặc mật khẩu không đúng' });
    }
  }

  // Lấy tiến trình người dùng
  static async getProgress(req, res) {
    try {
      const { username } = req.query;
      if (!username) {
        return res.status(400).json({ error: 'Tên người dùng là bắt buộc' });
      }
      const progress = await Progress.getProgress(username);
      if (!progress) {
        return res.status(404).json({ error: 'Không tìm thấy thông tin tiến trình' });
      }
      return res.json(progress);
    } catch (error) {
      console.error('Lỗi khi lấy tiến trình:', error);
      return res.status(500).json({ error: 'Lỗi server khi tải tiến trình' });
    }
  }

  // Lưu tiến trình học tập
  static async saveProgress(req, res) {
    try {
      const { username, xp, stars, level } = req.body;
      if (!username || xp === undefined || stars === undefined || level === undefined) {
        return res.status(400).json({ error: 'Dữ liệu lưu tiến trình không đầy đủ' });
      }
      const updated = await Progress.updateProgress(username, xp, stars, level);
      return res.json({ success: updated });
    } catch (error) {
      console.error('Lỗi khi lưu tiến trình:', error);
      return res.status(500).json({ error: 'Lỗi server khi lưu tiến trình' });
    }
  }

  // Lưu điểm cao kỷ lục
  static async saveHighScore(req, res) {
    try {
      const { username, score } = req.body;
      if (!username || score === undefined) {
        return res.status(400).json({ error: 'Dữ liệu kỷ lục không đầy đủ' });
      }
      const isNewRecord = await Progress.updateHighScore(username, score);
      return res.json({ success: true, newRecord: isNewRecord });
    } catch (error) {
      console.error('Lỗi khi lưu điểm cao:', error);
      return res.status(500).json({ error: 'Lỗi server khi lưu điểm cao' });
    }
  }

  // Lưu lịch sử làm bài tập
  static async saveHistory(req, res) {
    try {
      const { username, lessonId, scoreCorrect, totalQuestions, xpEarned, starsEarned } = req.body;
      if (!username || !lessonId || scoreCorrect === undefined || totalQuestions === undefined) {
        return res.status(400).json({ error: 'Dữ liệu lịch sử không hợp lệ' });
      }
      const insertId = await Progress.saveHistory(username, lessonId, scoreCorrect, totalQuestions, xpEarned, starsEarned);
      return res.status(201).json({ success: true, historyId: insertId });
    } catch (error) {
      console.error('Lỗi khi lưu lịch sử bài làm:', error);
      return res.status(500).json({ error: 'Lỗi server khi lưu lịch sử bài làm' });
    }
  }

  // Lấy lịch sử làm bài tập
  static async getHistory(req, res) {
    try {
      const { username } = req.query;
      if (!username) {
        return res.status(400).json({ error: 'Tên người dùng là bắt buộc' });
      }
      const history = await Progress.getHistory(username);
      return res.json(history);
    } catch (error) {
      console.error('Lỗi khi lấy lịch sử làm bài:', error);
      return res.status(500).json({ error: 'Lỗi server khi tải lịch sử' });
    }
  }
}

module.exports = ProgressController;

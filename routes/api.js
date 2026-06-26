const express = require('express');
const router = express.Router();

const QuestionController = require('../controllers/questionController');
const ProgressController = require('../controllers/progressController');
const ChatController = require('../controllers/chatController');
const GlossaryController = require('../controllers/glossaryController');

// Các Router liên quan đến Đăng nhập / Đăng ký
router.post('/register', ProgressController.register);
router.post('/login', ProgressController.login);

// Các Router liên quan đến Bài học & Câu hỏi
router.get('/lessons', QuestionController.getLessons);
router.get('/questions', QuestionController.getQuestions);
router.post('/check-answer', QuestionController.checkAnswer);

// Các Router liên quan đến Tiến trình của học sinh
router.get('/progress', ProgressController.getProgress);
router.post('/progress', ProgressController.saveProgress);
router.post('/highscore', ProgressController.saveHighScore);

// Router quản lý Lịch sử bài làm
router.post('/history', ProgressController.saveHistory);
router.get('/history', ProgressController.getHistory);

// Router liên quan đến Chatbot AI chất vấn
router.post('/chat', ChatController.chatTeacher);

// Router tra cứu Từ điển Thuật ngữ
router.get('/glossary', GlossaryController.getTerms);

module.exports = router;

const Glossary = require('../models/Glossary');

class GlossaryController {
  // Tra cứu thuật ngữ toán học
  static async getTerms(req, res) {
    try {
      const { term } = req.query;
      let data;
      if (term) {
        data = await Glossary.getTermByName(term);
      } else {
        data = await Glossary.getAllTerms();
      }
      return res.json(data);
    } catch (error) {
      console.error('Lỗi khi lấy từ điển thuật ngữ:', error);
      return res.status(500).json({ error: 'Lỗi server khi tra cứu thuật ngữ' });
    }
  }
}

module.exports = GlossaryController;

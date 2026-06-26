const db = require('../config/db');

class Glossary {
  // Lấy toàn bộ thuật ngữ
  static async getAllTerms() {
    const [rows] = await db.query(
      'SELECT term, definition FROM glossary ORDER BY term ASC'
    );
    return rows;
  }

  // Tra cứu thuật ngữ cụ thể
  static async getTermByName(term) {
    const [rows] = await db.query(
      'SELECT term, definition FROM glossary WHERE term LIKE ?',
      [`%${term}%`]
    );
    return rows;
  }
}

module.exports = Glossary;

const mysql = require('mysql2/promise');
require('dotenv').config();

// Tạo connection pool kết nối tới MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'webonluyentoan',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Kiểm tra kết nối ban đầu
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Successfully connected to MySQL database: ' + (process.env.DB_NAME || 'webonluyentoan'));
    connection.release();
  } catch (error) {
    console.error('CRITICAL: Database connection failed. Please check MySQL server and .env configurations.');
    console.error('Error Details:', error.message);
  }
})();

module.exports = pool;

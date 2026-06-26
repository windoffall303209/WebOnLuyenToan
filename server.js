const express = require('express');
const path = require('path');
require('dotenv').config();

const apiRoutes = require('./routes/api');
const webRoutes = require('./routes/web');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware phân tích dữ liệu JSON và URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Phục vụ các tài nguyên tĩnh trong thư mục public
app.use(express.static(path.join(__dirname, 'public')));

// Gắn các tuyến định tuyến API
app.use('/api', apiRoutes);

// Gắn định tuyến Web catch-all cho SPA
app.use('/', webRoutes);

// Khởi chạy Express server
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🌌 Web Ôn Luyện Toán Lớp 6 đã hoạt động thành công!`);
  console.log(`🚀 Đường dẫn cục bộ: http://localhost:${PORT}`);
  console.log(`📅 Thời gian khởi chạy: ${new Date().toLocaleString()}`);
  console.log(`==================================================`);
});

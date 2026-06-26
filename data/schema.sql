-- Tạo database nếu chưa tồn tại
CREATE DATABASE IF NOT EXISTS webonluyentoan CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE webonluyentoan;

-- Xóa các bảng cũ nếu tồn tại
DROP TABLE IF EXISTS user_history;
DROP TABLE IF EXISTS user_progress;
DROP TABLE IF EXISTS glossary;
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS lessons;

-- 1. Bảng lưu thông tin bài học theo SGK Cánh Diều
CREATE TABLE lessons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    chapter_num INT NOT NULL,              -- 1, 2 hoặc 3
    lesson_num INT NOT NULL,               -- 1, 2, 3...
    title VARCHAR(255) NOT NULL,           -- Tên bài (Ví dụ: "Tập hợp", "Số nguyên tố")
    description TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Bảng lưu trữ ngân hàng câu hỏi
CREATE TABLE questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lesson_id INT NOT NULL,
    question_text TEXT NOT NULL,           -- Nội dung câu hỏi
    question_type ENUM('choice', 'fill') NOT NULL,
    options JSON,                          -- Dạng ["A", "B", "C", "D"] hoặc NULL đối với điền khuyết
    correct_answer VARCHAR(255) NOT NULL,  -- Đáp án đúng
    explanation TEXT NOT NULL,             -- Lời giải chi tiết
    image_url VARCHAR(255) DEFAULT NULL,   -- Đường dẫn ảnh minh họa đi kèm câu hỏi
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Bảng lưu thông tin đăng nhập và tiến trình của học sinh
CREATE TABLE user_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,   -- Mật khẩu đã mã hóa
    salt VARCHAR(100) NOT NULL,            -- Salt dùng mã hóa
    xp INT DEFAULT 0,
    stars INT DEFAULT 0,
    level INT DEFAULT 1,
    high_score_game INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Bảng lưu lịch sử học tập / làm bài tập của học sinh
CREATE TABLE user_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    lesson_id INT NOT NULL,
    score_correct INT NOT NULL,
    total_questions INT NOT NULL,
    xp_earned INT NOT NULL,
    stars_earned INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user_progress(id) ON DELETE CASCADE,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Bảng từ điển thuật ngữ
CREATE TABLE glossary (
    id INT AUTO_INCREMENT PRIMARY KEY,
    term VARCHAR(100) NOT NULL UNIQUE,
    definition TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- NẠP DỮ LIỆU MẪU BÀI HỌC & THUẬT NGỮ
-- ==========================================

-- Thêm các bài học (26 bài học)
INSERT INTO lessons (id, chapter_num, lesson_num, title, description) VALUES
-- Chương I
(1, 1, 1, 'Tập hợp', 'Khái niệm tập hợp, phần tử thuộc và không thuộc tập hợp.'),
(2, 1, 2, 'Tập hợp các số tự nhiên', 'Tập N, N*, ghi số tự nhiên trong hệ thập phân và chữ số La Mã.'),
(3, 1, 3, 'Phép cộng, phép trừ các số tự nhiên', 'Tính chất phép cộng, trừ và cách tính nhẩm nhanh.'),
(4, 1, 4, 'Phép nhân, phép chia các số tự nhiên', 'Tính chất phép nhân, phép chia hết và phép chia có dư.'),
(5, 1, 5, 'Phép tính lũy thừa với số mũ tự nhiên', 'Định nghĩa lũy thừa, nhân chia hai lũy thừa cùng cơ số.'),
(6, 1, 6, 'Thứ tự thực hiện các phép tính', 'Thứ tự ưu tiên các phép toán và các loại dấu ngoặc.'),
(7, 1, 7, 'Quan hệ chia hết. Tính chất chia hết', 'Tính chất chia hết của một tổng hoặc một hiệu.'),
(8, 1, 8, 'Dấu hiệu chia hết cho 2, cho 5', 'Xét chữ số tận cùng của một số tự nhiên.'),
(9, 1, 9, 'Dấu hiệu chia hết cho 3, cho 9', 'Xét tổng các chữ số của một số tự nhiên.'),
(10, 1, 10, 'Số nguyên tố. Hợp số', 'Khái niệm số nguyên tố và phân biệt với hợp số.'),
(11, 1, 11, 'Phân tích một số ra thừa số nguyên tố', 'Cách phân tích các số tự nhiên ra các thừa số nguyên tố.'),
(12, 1, 12, 'Ước chung và ước chung lớn nhất', 'Tìm ước chung và ước chung lớn nhất (ƯCLN).'),
(13, 1, 13, 'Bội chung và bội chung nhỏ nhất', 'Tìm bội chung và bội chung nhỏ nhất (BCNN).'),
-- Chương II
(14, 2, 1, 'Số nguyên âm', 'Làm quen với số nguyên âm và ý nghĩa trong thực tế.'),
(15, 2, 2, 'Tập hợp các số nguyên', 'Tập hợp Z, biểu diễn số nguyên trên trục số, số đối và so sánh.'),
(16, 2, 3, 'Phép cộng các số nguyên', 'Cộng hai số nguyên cùng dấu hoặc khác dấu.'),
(17, 2, 4, 'Phép trừ số nguyên. Quy tắc dấu ngoặc', 'Phép trừ và quy tắc bỏ ngoặc đổi dấu.'),
(18, 2, 5, 'Phép nhân các số nguyên', 'Nhân hai số nguyên cùng dấu hoặc khác dấu và tính chất.'),
(19, 2, 6, 'Phép chia hết hai số nguyên. Quan hệ chia hết trong Z', 'Khái niệm ước và bội trong tập hợp số nguyên Z.'),
-- Chương III
(20, 3, 1, 'Tam giác đều. Hình vuông. Lục giác đều', 'Nhận dạng và tính chất cơ bản của tam giác đều, hình vuông và lục giác đều.'),
(21, 3, 2, 'Hình chữ nhật. Hình thoi', 'Đặc điểm nhận biết, công thức chu vi và diện tích hình chữ nhật, hình thoi.'),
(22, 3, 3, 'Hình bình hành', 'Đặc điểm nhận biết, công thức chu vi và diện tích hình bình hành.'),
(23, 3, 4, 'Hình thang cân', 'Đặc điểm nhận biết, công thức chu vi và diện tích hình thang cân.'),
(24, 3, 5, 'Hình có trục đối xứng', 'Khái niệm trục đối xứng và tìm trục đối xứng của các hình phẳng.'),
(25, 3, 6, 'Hình có tâm đối xứng', 'Khái niệm tâm đối xứng và tìm tâm đối xứng của các hình phẳng.'),
(26, 3, 7, 'Đối xứng trong thực tiễn', 'Nhận diện vẻ đẹp và ứng dụng của đối xứng trong đời sống.');

-- Thêm từ điển thuật ngữ
INSERT INTO glossary (term, definition) VALUES
('Tập hợp', 'Một khái niệm cơ bản của toán học dùng để chỉ một nhóm các đối tượng (gọi là phần tử) có cùng một hoặc một số đặc điểm nào đó.'),
('Số nguyên tố', 'Số tự nhiên lớn hơn 1 chỉ có hai ước số dương là 1 và chính nó. Ví dụ: 2, 3, 5, 7, 11...'),
('Hợp số', 'Số tự nhiên lớn hơn 1 có nhiều hơn hai ước số dương (tức là ngoài 1 và chính nó, nó còn chia hết cho các số khác). Ví dụ: 4, 6, 8, 9, 10...'),
('Lũy thừa', 'Phép nhân nhiều thừa số bằng nhau. Ví dụ: a^n là tích của n thừa số a.'),
('ƯCLN', 'Ước chung lớn nhất của hai hay nhiều số là số lớn nhất trong tập hợp các ước chung của các số đó.'),
('BCNN', 'Bội chung nhỏ nhất của hai hay nhiều số là số nhỏ nhất khác 0 trong tập hợp các bội chung của các số đó.'),
('Số nguyên âm', 'Các số có dạng -1, -2, -3... nằm phía bên trái số 0 trên trục số, dùng để biểu diễn các giá trị nhỏ hơn 0.'),
('Quy tắc dấu ngoặc', 'Khi bỏ ngoặc có dấu "-" đằng trước, ta phải đổi dấu tất cả các số hạng trong dấu ngoặc: dấu "+" thành "-" và dấu "-" thành "+". Khi bỏ ngoặc có dấu "+" đằng trước, ta giữ nguyên dấu các số hạng.'),
('Hình thoi', 'Tứ giác có 4 cạnh bằng nhau. Hình thoi có các cạnh đối song song, hai đường chéo vuông góc với nhau và cắt nhau tại trung điểm của mỗi đường.'),
('Trục đối xứng', 'Đường thẳng chia một hình thành hai phần đối nhau sao cho nếu gấp hình theo đường thẳng đó thì hai phần trùng khít lên nhau.'),
('Tâm đối xứng', 'Điểm O sao cho khi quay hình 180 độ quanh O, ta thu được một hình trùng khít với hình ban đầu.');

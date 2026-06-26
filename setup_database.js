const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Bộ sinh dữ liệu câu hỏi ôn tập tự động (10 câu/bài cho cả 26 bài = 260 câu hỏi)
function generateQuestions() {
  const list = [];

  // ==========================================
  // CHƯƠNG I: SỐ TỰ NHIÊN (Bài 1 - 13)
  // ==========================================
  
  // Bài 1: Tập hợp (lesson_id = 1)
  list.push(
    { lesson_id: 1, type: 'choice', text: 'Xem hình vẽ bên mô tả tập hợp A gồm các số nằm trong vòng tròn. Khẳng định nào sau đây là ĐÚNG?', opt: ['5 thuộc A', '9 thuộc A', '3 thuộc A', '7 thuộc A'], ans: '9 thuộc A', exp: 'Nhìn vào sơ đồ Venn, số 9 nằm bên trong vòng tròn giới hạn tập hợp A (ký hiệu 9 ∈ A). Các số 3, 5, 7 nằm ngoài.', img: '/assets/images/venn_set.svg' },
    { lesson_id: 1, type: 'choice', text: 'Cho tập hợp A = {x ∈ ℕ | x < 5}. Khẳng định nào sau đây là SAI?', opt: ['0 ∈ A', '4 ∈ A', '5 ∈ A', '3 ∈ A'], ans: '5 ∈ A', exp: 'Tập hợp A chỉ gồm các số tự nhiên NHỎ HƠN 5, tức là A = {0; 1; 2; 3; 4}. Do đó 5 không thuộc A.', img: null },
    { lesson_id: 1, type: 'choice', text: 'Cho tập hợp B = {2; 4; 6; 8}. Số phần tử của tập hợp B là bao nhiêu?', opt: ['2 phần tử', '4 phần tử', '6 phần tử', '8 phần tử'], ans: '4 phần tử', exp: 'Tập hợp B chứa 4 phần tử là: 2, 4, 6 và 8.', img: null },
    { lesson_id: 1, type: 'choice', text: 'Cách viết tập hợp M gồm các số tự nhiên lẻ nhỏ hơn 7 là:', opt: ['M = {1; 3; 5}', 'M = {1; 3; 5; 7}', 'M = {0; 1; 3; 5}', 'M = {1; 2; 3; 5}'], ans: 'M = {1; 3; 5}', exp: 'Các số tự nhiên lẻ nhỏ hơn 7 gồm: 1, 3, 5. Số 7 không được tính vì yêu cầu là "nhỏ hơn 7".', img: null },
    { lesson_id: 1, type: 'fill', text: 'Tập hợp C = {1; 3; 5; 7; 9; 11} có bao nhiêu phần tử?', opt: null, ans: '6', exp: 'Đếm số lượng phần tử của C: 1, 3, 5, 7, 9, 11 -> tổng cộng có 6 số.', img: null },
    { lesson_id: 1, type: 'fill', text: 'Cho tập hợp D = {x ∈ ℕ | 10 < x < 15}. Hỏi D có bao nhiêu phần tử?', opt: null, ans: '4', exp: 'Các số tự nhiên lớn hơn 10 và nhỏ hơn 15 là: 11, 12, 13, 14. Vậy có 4 phần tử.', img: null },
    { lesson_id: 1, type: 'choice', text: 'Cho tập hợp E = {a, b, c}. Ký hiệu nào sau đây đúng?', opt: ['a ∉ E', 'd ∈ E', 'b ∈ E', 'c ∉ E'], ans: 'b ∈ E', exp: 'Phần tử b nằm trong tập hợp E nên b thuộc E (b ∈ E).', img: null },
    { lesson_id: 1, type: 'fill', text: 'Tìm số phần tử của tập hợp các chữ cái tiếng Việt trong từ "TOAN 6" (không tính dấu cách)?', opt: null, ans: '5', exp: 'Các chữ cái gồm: T, O, A, N, 6 (trong đó 6 là chữ số không phải chữ cái, nhưng ở đây hỏi chữ cái: T, O, A, N -> 4 chữ cái, nếu tính cả chữ cái trong cụm từ TOAN6 thì có 5 ký tự. Các chữ cái tiếng Việt phân biệt: T, O, A, N -> có 4 chữ cái). Hãy điền số 4.', ans: '4', img: null },
    { lesson_id: 1, type: 'choice', text: 'Cho tập hợp P = {2; 3; 5}. Tập hợp nào sau đây chứa các phần tử đều thuộc P?', opt: ['{2; 4}', '{3; 5}', '{1; 3; 5}', '{2; 3; 6}'], ans: '{3; 5}', exp: 'Cả 3 và 5 đều là phần tử của tập hợp P.', img: null },
    { lesson_id: 1, type: 'fill', text: 'Tập hợp các số tự nhiên x sao cho x + 5 = 5 có bao nhiêu phần tử?', opt: null, ans: '1', exp: 'Ta có x + 5 = 5 => x = 0. Do đó tập hợp này chỉ có 1 phần tử là số 0.', img: null }
  );

  // Bài 2: Tập số tự nhiên, hệ thập phân & La Mã (lesson_id = 2)
  list.push(
    { lesson_id: 2, type: 'choice', text: 'Số La Mã XXIV biểu diễn số tự nhiên nào trong hệ thập phân?', opt: ['26', '24', '19', '29'], ans: '24', exp: 'XX biểu thị 20, IV biểu thị 4. Vậy XXIV = 24.', img: null },
    { lesson_id: 2, type: 'choice', text: 'Số La Mã XXIX biểu diễn số tự nhiên nào?', opt: ['29', '31', '21', '19'], ans: '29', exp: 'XX biểu thị 20, IX biểu thị 9. Vậy XXIX = 29.', img: null },
    { lesson_id: 2, type: 'fill', text: 'Viết số La Mã biểu diễn số 19.', opt: null, ans: 'XIX', exp: '19 = 10 + 9, biểu diễn bằng X và IX => XIX.', img: null },
    { lesson_id: 2, type: 'fill', text: 'Viết số La Mã biểu diễn số 14.', opt: null, ans: 'XIV', exp: '14 = 10 + 4, biểu diễn bằng X và IV => XIV.', img: null },
    { lesson_id: 2, type: 'choice', text: 'Số tự nhiên nhỏ nhất trong tập hợp ℕ* là:', opt: ['0', '1', '2', 'Không có số nào'], ans: '1', exp: 'Tập hợp ℕ* = {1; 2; 3;...} không chứa số 0. Số tự nhiên nhỏ nhất là 1.', img: null },
    { lesson_id: 2, type: 'choice', text: 'Số tự nhiên nhỏ nhất trong tập hợp ℕ là:', opt: ['0', '1', '-1', 'Không có số nào'], ans: '0', exp: 'Tập hợp ℕ = {0; 1; 2;...}. Số tự nhiên nhỏ nhất là 0.', img: null },
    { lesson_id: 2, type: 'fill', text: 'Số tự nhiên lớn nhất có 3 chữ số khác nhau là số nào?', opt: null, ans: '987', exp: 'Chọn chữ số hàng trăm lớn nhất là 9, hàng chục lớn nhất khác 9 là 8, hàng đơn vị khác 9 và 8 là 7 => 987.', img: null },
    { lesson_id: 2, type: 'choice', text: 'Trong số 2026, chữ số hàng chục có giá trị là bao nhiêu?', opt: ['2', '20', '200', '6'], ans: '2', exp: 'Hàng đơn vị là 6, hàng chục là 2 (giá trị là 20).', img: null },
    { lesson_id: 2, type: 'fill', text: 'Viết số La Mã biểu diễn số 27.', opt: null, ans: 'XXVII', exp: '27 = 20 + 7 => XX + VII = XXVII.', img: null },
    { lesson_id: 2, type: 'choice', text: 'Biểu diễn số 345 thành tổng giá trị các chữ số của nó:', opt: ['3 + 4 + 5', '300 + 40 + 5', '30 + 40 + 50', '300 + 45'], ans: '300 + 40 + 5', exp: 'Số 3 ở hàng trăm (300), số 4 ở hàng chục (40), số 5 ở hàng đơn vị (5).', img: null }
  );

  // Bài 3: Cộng trừ số tự nhiên (lesson_id = 3)
  for (let i = 1; i <= 10; i++) {
    const term1 = 100 + i * 5;
    const term2 = 25 * i;
    const result = term1 + term2;
    list.push({
      lesson_id: 3,
      type: i % 2 === 0 ? 'choice' : 'fill',
      text: `Tính giá trị của phép tính: ${term1} + ${term2} = ?`,
      opt: i % 2 === 0 ? [result, result + 10, result - 5, result + 15].map(String) : null,
      ans: String(result),
      exp: `Đặt tính rồi tính: ${term1} cộng ${term2} bằng ${result}.`,
      img: null
    });
  }

  // Bài 4: Nhân chia số tự nhiên (lesson_id = 4)
  for (let i = 1; i <= 10; i++) {
    const a = 12 + i;
    const b = 5;
    const mul = a * b;
    list.push({
      lesson_id: 4,
      type: i % 2 === 0 ? 'choice' : 'fill',
      text: i % 3 === 0 
        ? `Thực hiện phép chia có dư: ${mul + 3} chia cho ${a}. Số dư là bao nhiêu?`
        : `Tính tích của phép nhân: ${a} × ${b} = ?`,
      opt: i % 2 === 0 ? (i % 3 === 0 ? ['3', '0', '1', '2'] : [mul, mul + 5, mul - 5, mul + 10].map(String)) : null,
      ans: i % 3 === 0 ? '3' : String(mul),
      exp: i % 3 === 0 
        ? `Ta có ${mul + 3} = ${a} × 5 + 3. Vậy số dư là 3.`
        : `Phép tính nhân: ${a} nhân 5 bằng ${mul}.`,
      img: null
    });
  }

  // Bài 5: Lũy thừa (lesson_id = 5)
  list.push(
    { lesson_id: 5, type: 'fill', text: 'Hãy tính giá trị của lũy thừa biểu diễn số lượng hình lập phương nhỏ trong hình bên: 2 mũ 3 (2³) bằng bao nhiêu?', opt: null, ans: '8', exp: 'Lũy thừa 2³ = 2 × 2 × 2 = 8.', img: '/assets/images/exponent_cube.svg' },
    { lesson_id: 5, type: 'choice', text: 'Tính giá trị của lũy thừa 3 mũ 4 (3⁴):', opt: ['12', '81', '27', '64'], ans: '81', exp: '3⁴ = 3 × 3 × 3 × 3 = 9 × 9 = 81.', img: null },
    { lesson_id: 5, type: 'fill', text: 'Tính giá trị của lũy thừa 5 mũ 3 (5³):', opt: null, ans: '125', exp: '5³ = 5 × 5 × 5 = 25 × 5 = 125.', img: null },
    { lesson_id: 5, type: 'choice', text: 'Viết kết quả phép tính dưới dạng một lũy thừa: 2⁵ × 2³', opt: ['2¹⁵', '2⁸', '4⁸', '2²'], ans: '2⁸', exp: 'Áp dụng công thức nhân hai lũy thừa cùng cơ số: a^m × a^n = a^(m+n). Ta có 2⁵ × 2³ = 2^(5+3) = 2⁸.', img: null },
    { lesson_id: 5, type: 'choice', text: 'Viết kết quả phép tính dưới dạng một lũy thừa: 5⁶ : 5²', opt: ['5⁴', '5⁸', '10⁴', '5³'], ans: '5⁴', exp: 'Áp dụng công thức chia hai lũy thừa cùng cơ số: a^m : a^n = a^(m-n). Ta có 5⁶ : 5² = 5^(6-2) = 5⁴.', img: null },
    { lesson_id: 5, type: 'fill', text: 'Tìm số tự nhiên x biết 2^x = 16.', opt: null, ans: '4', exp: 'Ta có 16 = 2 × 2 × 2 × 2 = 2⁴. Do đó x = 4.', img: null },
    { lesson_id: 5, type: 'fill', text: 'Tính giá trị biểu thức: 10³ = ?', opt: null, ans: '1000', exp: '10³ = 10 × 10 × 10 = 1000.', img: null },
    { lesson_id: 5, type: 'choice', text: 'Trong lũy thừa a^n, a được gọi là:', opt: ['Cơ số', 'Số mũ', 'Số nhân', 'Tích'], ans: 'Cơ số', exp: 'Trong định nghĩa lũy thừa a^n, a là cơ số và n là số mũ.', img: null },
    { lesson_id: 5, type: 'choice', text: 'So sánh 2³ và 3²:', opt: ['2³ > 3²', '2³ < 3²', '2³ = 3²', 'Không so sánh được'], ans: '2³ < 3²', exp: 'Ta có 2³ = 8 và 3² = 9. Vì 8 < 9 nên 2³ < 3².', img: null },
    { lesson_id: 5, type: 'fill', text: 'Tính giá trị lũy thừa: 7² = ?', opt: null, ans: '49', exp: '7² = 7 × 7 = 49.', img: null }
  );

  // Bài 6: Thứ tự thực hiện phép tính (lesson_id = 6)
  for (let i = 1; i <= 10; i++) {
    const val = 10 + i * 2;
    list.push({
      lesson_id: 6,
      type: i % 2 === 0 ? 'choice' : 'fill',
      text: `Tính giá trị biểu thức: ${val} - (4 + 2) = ?`,
      opt: i % 2 === 0 ? [val - 6, val - 2, val - 8, val].map(String) : null,
      ans: String(val - 6),
      exp: `Thực hiện trong ngoặc trước: 4 + 2 = 6, sau đó lấy ${val} - 6 = ${val - 6}.`,
      img: null
    });
  }

  // Bài 7: Quan hệ chia hết (lesson_id = 7)
  for (let i = 1; i <= 10; i++) {
    const a = i * 3;
    const b = 9;
    const sum = a + b;
    const divisor = 3;
    const isDiv = sum % divisor === 0;
    list.push({
      lesson_id: 7,
      type: 'choice',
      text: `Tổng nào sau đây chia hết cho ${divisor}?`,
      opt: [`${a} + ${b}`, `${a + 1} + ${b}`, `${a} + ${b + 1}`, `${a + 2} + ${b}`],
      ans: `${a} + ${b}`,
      exp: `Vì cả ${a} và ${b} đều chia hết cho ${divisor}, nên tổng (${a} + ${b}) chia hết cho ${divisor}.`,
      img: null
    });
  }

  // Bài 8: Chia hết cho 2 và 5 (lesson_id = 8)
  for (let i = 1; i <= 10; i++) {
    const ending = i % 2 === 0 ? 0 : 5;
    const num = 120 + ending;
    list.push({
      lesson_id: 8,
      type: 'choice',
      text: i % 2 === 0 
        ? `Số nào sau đây chia hết cho cả 2 và 5?` 
        : `Số nào sau đây chia hết cho 5 nhưng không chia hết cho 2?`,
      opt: i % 2 === 0 ? [num, 123, 127, 129].map(String) : [num, 120, 122, 124].map(String),
      ans: String(num),
      exp: i % 2 === 0 
        ? `Số tận cùng bằng 0 thì chia hết cho cả 2 và 5. Số ${num} tận cùng là 0.`
        : `Số tận cùng bằng 5 thì chia hết cho 5 nhưng không chia hết cho 2. Số ${num} có tận cùng là 5.`,
      img: null
    });
  }

  // Bài 9: Chia hết cho 3 và 9 (lesson_id = 9)
  for (let i = 1; i <= 10; i++) {
    const mult = i * 9;
    list.push({
      lesson_id: 9,
      type: 'choice',
      text: `Số nào sau đây chia hết cho 9?`,
      opt: [mult, mult + 3, mult + 5, mult + 7].map(String),
      ans: String(mult),
      exp: `Số chia hết cho 9 là số có tổng các chữ số chia hết cho 9. Số ${mult} chia hết cho 9.`,
      img: null
    });
  }

  // Bài 10: Số nguyên tố. Hợp số (lesson_id = 10) - BỘ 10 CÂU HỎI ĐẦY ĐỦ
  list.push(
    { lesson_id: 10, type: 'choice', text: 'Trong các số sau đây, số nào là số nguyên tố?', opt: ['15', '21', '17', '9'], ans: '17', exp: 'Số nguyên tố chỉ có hai ước là 1 và chính nó. 17 chỉ chia hết cho 1 và 17.', img: null },
    { lesson_id: 10, type: 'choice', text: 'Số nguyên tố nhỏ nhất là số nào?', opt: ['0', '1', '2', '3'], ans: '2', exp: 'Số nguyên tố là số tự nhiên lớn hơn 1. Số nguyên tố nhỏ nhất là số 2.', img: null },
    { lesson_id: 10, type: 'choice', text: 'Khẳng định nào sau đây là ĐÚNG?', opt: ['Mọi số nguyên tố đều là số lẻ', 'Số 2 là số nguyên tố chẵn duy nhất', 'Số 0 và số 1 là số nguyên tố', 'Hợp số chỉ chia hết cho 1 và chính nó'], ans: 'Số 2 là số nguyên tố chẵn duy nhất', exp: 'Số 2 là số nguyên tố nhỏ nhất và cũng là số nguyên tố chẵn duy nhất. Tất cả các số nguyên tố khác đều là số lẻ.', img: null },
    { lesson_id: 10, type: 'choice', text: 'Số nào sau đây là HỢP SỐ?', opt: ['2', '3', '5', '9'], ans: '9', exp: 'Số 9 ngoài ước 1 và 9 còn có ước là 3, nên nó là hợp số.', img: null },
    { lesson_id: 10, type: 'choice', text: 'Số 91 là số nguyên tố hay hợp số?', opt: ['Số nguyên tố', 'Hợp số', 'Không phải cả hai', 'Số chẵn'], ans: 'Hợp số', exp: 'Ta có 91 = 7 × 13. Vì vậy 91 có nhiều hơn 2 ước nên nó là hợp số.', img: null },
    { lesson_id: 10, type: 'fill', text: 'Có bao nhiêu số nguyên tố nhỏ hơn 10?', opt: null, ans: '4', exp: 'Các số nguyên tố nhỏ hơn 10 gồm: 2, 3, 5, 7. Tổng cộng có 4 số.', img: null },
    { lesson_id: 10, type: 'fill', text: 'Tìm số nguyên tố p lẻ nhỏ nhất?', opt: null, ans: '3', exp: 'Số nguyên tố nhỏ nhất là 2 (chẵn). Số nguyên tố lẻ nhỏ nhất là 3.', img: null },
    { lesson_id: 10, type: 'fill', text: 'Tìm số nguyên tố p sao cho cả p, p+2 và p+4 đều là số nguyên tố?', opt: null, ans: '3', exp: 'Với p = 3, ta có p+2 = 5 (nguyên tố) và p+4 = 7 (nguyên tố). Đây là bộ ba số nguyên tố sinh đôi duy nhất.', img: null },
    { lesson_id: 10, type: 'choice', text: 'Tích của hai số nguyên tố bất kỳ luôn luôn là:', opt: ['Số nguyên tố', 'Hợp số', 'Số lẻ', 'Số chẵn'], ans: 'Hợp số', exp: 'Tích của hai số nguyên tố a và b (a × b) sẽ chia hết cho 1, a, b và tích (a × b). Do đó nó luôn là hợp số.', img: null },
    { lesson_id: 10, type: 'fill', text: 'Số nguyên tố lớn nhất có hai chữ số là số nào?', opt: null, ans: '97', exp: 'Số 99 là hợp số (chia hết cho 3, 9). Số 98 là số chẵn hợp số. Số 97 chỉ chia hết cho 1 và 97 nên 97 là số nguyên tố lớn nhất có 2 chữ số.', img: null }
  );

  // Bài 11: Phân tích thừa số nguyên tố (lesson_id = 11)
  for (let i = 1; i <= 10; i++) {
    const val = 12 + i * 2;
    list.push({
      lesson_id: 11,
      type: 'choice',
      text: `Phân tích số ${val} ra thừa số nguyên tố:`,
      opt: [`${val}`, `2 * ${val / 2}`, `Thừa số nguyên tố của ${val}`, `Biểu diễn đúng`],
      ans: `Biểu diễn đúng`, // Sẽ chỉnh sửa logic nạp dữ liệu chi tiết ở vòng lặp thực tế
      exp: `Phân tích số ra thừa số nguyên tố bằng cách chia liên tiếp cho các số nguyên tố nhỏ nhất.`,
      img: null
    });
  }
  // Sửa lại bài 11 cụ thể để không bị trùng lặp
  list.splice(list.length - 10, 10);
  list.push(
    { lesson_id: 11, type: 'choice', text: 'Phân tích số 12 ra thừa số nguyên tố kết quả là:', opt: ['2 × 6', '3 × 4', '2² × 3', '2 × 3²'], ans: '2² × 3', exp: '12 = 2 × 6 = 2 × 2 × 3 = 2² × 3.', img: null },
    { lesson_id: 11, type: 'choice', text: 'Phân tích số 18 ra thừa số nguyên tố kết quả là:', opt: ['2 × 9', '2 × 3²', '2² × 3', '3 × 6'], ans: '2 × 3²', exp: '18 = 2 × 9 = 2 × 3 × 3 = 2 × 3².', img: null },
    { lesson_id: 11, type: 'choice', text: 'Phân tích số 30 ra thừa số nguyên tố kết quả là:', opt: ['2 × 3 × 5', '5 × 6', '2 × 15', '3 × 10'], ans: '2 × 3 × 5', exp: '30 = 2 × 15 = 2 × 3 × 5.', img: null },
    { lesson_id: 11, type: 'choice', text: 'Phân tích số 24 ra thừa số nguyên tố kết quả là:', opt: ['2³ × 3', '2 × 12', '4 × 6', '2² × 6'], ans: '2³ × 3', exp: '24 = 2 × 12 = 2 × 2 × 6 = 2³ × 3.', img: null },
    { lesson_id: 11, type: 'fill', text: 'Khi phân tích số 40 ra thừa số nguyên tố dưới dạng 2^a × 5, tìm số mũ a?', opt: null, ans: '3', exp: '40 = 8 × 5 = 2³ × 5. Vậy số mũ a = 3.', img: null },
    { lesson_id: 11, type: 'fill', text: 'Khi phân tích số 50 ra thừa số nguyên tố dưới dạng 2 × 5^b, tìm số mũ b?', opt: null, ans: '2', exp: '50 = 2 × 25 = 2 × 5². Vậy số mũ b = 2.', img: null },
    { lesson_id: 11, type: 'choice', text: 'Phân tích số 60 ra thừa số nguyên tố kết quả là:', opt: ['2² × 3 × 5', '4 × 15', '2 × 30', '2 × 3² × 5'], ans: '2² × 3 × 5', exp: '60 = 4 × 15 = 2² × 3 × 5.', img: null },
    { lesson_id: 11, type: 'fill', text: 'Phân tích số 100 ra thừa số nguyên tố dưới dạng 2^x × 5^y. Tính x + y?', opt: null, ans: '4', exp: '100 = 4 × 25 = 2² × 5². Vậy x = 2, y = 2 => x + y = 4.', img: null },
    { lesson_id: 11, type: 'choice', text: 'Phân tích số 36 ra thừa số nguyên tố kết quả là:', opt: ['2² × 3²', '4 × 9', '6²', '2 × 3³'], ans: '2² × 3²', exp: '36 = 4 × 9 = 2² × 3².', img: null },
    { lesson_id: 11, type: 'fill', text: 'Phân tích số 20 ra thừa số nguyên tố dưới dạng 2^a × 5. Tính giá trị của a?', opt: null, ans: '2', exp: '20 = 4 × 5 = 2² × 5. Vậy a = 2.', img: null }
  );

  // Bài 12: ƯCLN (lesson_id = 12)
  for (let i = 1; i <= 10; i++) {
    const base = i * 2;
    list.push({
      lesson_id: 12,
      type: 'choice',
      text: `Tìm ước chung lớn nhất của hai số: ${base * 3} và ${base * 5}`,
      opt: [base, base * 2, base * 3, 2].map(String),
      ans: String(base),
      exp: `Vì 3 và 5 là hai số nguyên tố cùng nhau, nên ƯCLN(${base * 3}, ${base * 5}) = ${base}.`,
      img: null
    });
  }

  // Bài 13: BCNN (lesson_id = 13)
  for (let i = 1; i <= 10; i++) {
    const base = i + 2;
    list.push({
      lesson_id: 13,
      type: 'choice',
      text: `Tìm bội chung nhỏ nhất của hai số nguyên tố cùng nhau: ${base} và ${base + 1}`,
      opt: [base * (base + 1), base + (base + 1), base, base + 1].map(String),
      ans: String(base * (base + 1)),
      exp: `Vì hai số tự nhiên liên tiếp luôn nguyên tố cùng nhau, nên BCNN của chúng là tích của hai số đó: ${base} × ${base + 1} = ${base * (base + 1)}.`,
      img: null
    });
  }

  // ==========================================
  // CHƯƠNG II: SỐ NGUYÊN (Bài 14 - 19)
  // ==========================================

  // Bài 14: Số nguyên âm (lesson_id = 14)
  for (let i = 1; i <= 10; i++) {
    const val = i + 1;
    list.push({
      lesson_id: 14,
      type: 'choice',
      text: `Độ cao ${val} mét dưới mực nước biển được biểu diễn bằng số nguyên nào?`,
      opt: [`-${val} m`, `${val} m`, `-${val * 10} m`, '0 m'],
      ans: `-${val} m`,
      exp: `Đại lượng dưới mực nước biển được biểu diễn bằng số nguyên âm.`,
      img: null
    });
  }

  // Bài 15: Tập số nguyên Z & so sánh (lesson_id = 15)
  list.push(
    { lesson_id: 15, type: 'choice', text: 'Quan sát trục số bên dưới. Khẳng định nào sau đây là ĐÚNG?', opt: ['-4 lớn hơn -2', '-4 nhỏ hơn -2', '-4 bằng -2', '-2 nhỏ hơn -5'], ans: '-4 nhỏ hơn -2', exp: 'Trên trục số nằm ngang, số nằm bên trái nhỏ hơn số nằm bên phải. Điểm -4 nằm bên trái điểm -2.', img: '/assets/images/number_line.svg' },
    { lesson_id: 15, type: 'choice', text: 'Tìm số đối của số nguyên -8:', opt: ['8', '-8', '0', '1/8'], ans: '8', exp: 'Số đối của a là -a. Số đối của -8 là 8.', img: null },
    { lesson_id: 15, type: 'choice', text: 'Sắp xếp các số nguyên sau theo thứ tự tăng dần: -3, 5, 0, -1', opt: ['-3, -1, 0, 5', '5, 0, -1, -3', '-1, -3, 0, 5', '0, -1, -3, 5'], ans: '-3, -1, 0, 5', exp: 'So sánh số âm: -3 < -1. Do đó thứ tự tăng dần là: -3, -1, 0, 5.', img: null },
    { lesson_id: 15, type: 'fill', text: 'Tìm số đối của số nguyên 15?', opt: null, ans: '-15', exp: 'Số đối của 15 là -15.', img: null },
    { lesson_id: 15, type: 'fill', text: 'Tìm số nguyên x thỏa mãn: -3 < x < -1?', opt: null, ans: '-2', exp: 'Số nguyên duy nhất nằm giữa -3 và -1 là -2.', img: null },
    { lesson_id: 15, type: 'choice', text: 'Tập hợp các số nguyên Z bao gồm:', opt: ['Số nguyên dương và số 0', 'Số nguyên âm và số nguyên dương', 'Số nguyên âm, số 0 và số nguyên dương', 'Các số tự nhiên'], ans: 'Số nguyên âm, số 0 và số nguyên dương', exp: 'Định nghĩa tập hợp số nguyên Z gồm các số nguyên âm, số 0 và số nguyên dương.', img: null },
    { lesson_id: 15, type: 'choice', text: 'So sánh hai số nguyên: -100 và -99', opt: ['-100 > -99', '-100 < -99', '-100 = -99', 'Không so sánh được'], ans: '-100 < -99', exp: 'Trong hai số nguyên âm, số nào có số đối lớn hơn thì nhỏ hơn (100 > 99 nên -100 < -99).', img: null },
    { lesson_id: 15, type: 'fill', text: 'Tìm số đối của số đối của số -5?', opt: null, ans: '-5', exp: 'Số đối của -5 là 5. Số đối của 5 lại là -5.', img: null },
    { lesson_id: 15, type: 'choice', text: 'Trên trục số nằm ngang, điểm cách điểm 0 ba đơn vị về phía bên trái biểu diễn số:', opt: ['3', '-3', '3 hoặc -3', '0'], ans: '-3', exp: 'Về phía bên trái là chiều âm, cách 3 đơn vị => số -3.', img: null },
    { lesson_id: 15, type: 'fill', text: 'Có bao nhiêu số nguyên nằm giữa -4 và 2?', opt: null, ans: '5', exp: 'Các số nguyên đó là: -3, -2, -1, 0, 1. Tổng cộng có 5 số.', img: null }
  );

  // Bài 16: Cộng số nguyên (lesson_id = 16)
  for (let i = 1; i <= 10; i++) {
    const a = -10 + i;
    const b = 5;
    const resVal = a + b;
    list.push({
      lesson_id: 16,
      type: 'choice',
      text: `Tính tổng số nguyên: ${a < 0 ? '(' + a + ')' : a} + ${b < 0 ? '(' + b + ')' : b} = ?`,
      opt: [resVal, resVal + 3, resVal - 2, -resVal].map(String),
      ans: String(resVal),
      exp: `Cộng hai số nguyên khác dấu hoặc cùng dấu. Kết quả là ${resVal}.`,
      img: null
    });
  }

  // Bài 17: Trừ số nguyên & Dấu ngoặc (lesson_id = 17)
  list.push(
    { lesson_id: 17, type: 'fill', text: 'Tính giá trị của biểu thức sau bằng cách tính hợp lý: 125 - (25 - 50) = ?', opt: null, ans: '150', exp: 'Áp dụng bỏ ngoặc: 125 - 25 + 50 = 100 + 50 = 150.', img: null },
    { lesson_id: 17, type: 'choice', text: 'Tính giá trị biểu thức: -15 - (-20) = ?', opt: ['-35', '5', '-5', '35'], ans: '5', exp: '-15 - (-20) = -15 + 20 = 5.', img: null },
    { lesson_id: 17, type: 'choice', text: 'Kết quả bỏ dấu ngoặc của biểu thức: a - (b + c - d) là:', opt: ['a - b - c + d', 'a - b - c - d', 'a - b + c - d', 'a + b + c - d'], ans: 'a - b - c + d', exp: 'Trước ngoặc có dấu trừ, khi bỏ ngoặc ta phải đổi dấu tất cả các số hạng bên trong.', img: null },
    { lesson_id: 17, type: 'fill', text: 'Tính nhanh biểu thức: (35 - 17) - (35 - 17 - 10) = ?', opt: null, ans: '10', exp: 'Bỏ ngoặc: 35 - 17 - 35 + 17 + 10 = (35 - 35) + (-17 + 17) + 10 = 10.', img: null },
    { lesson_id: 17, type: 'choice', text: 'Tính hiệu số nguyên: -8 - 12 = ?', opt: ['4', '-4', '-20', '20'], ans: '-20', exp: '-8 - 12 = -8 + (-12) = -20.', img: null },
    { lesson_id: 17, type: 'fill', text: 'Tìm số nguyên x biết: x - 5 = -2?', opt: null, ans: '3', exp: 'x = -2 + 5 = 3.', img: null },
    { lesson_id: 17, type: 'choice', text: 'Tính giá trị biểu thức: -100 - (-100) = ?', opt: ['-200', '0', '200', '-100'], ans: '0', exp: '-100 + 100 = 0.', img: null },
    { lesson_id: 17, type: 'fill', text: 'Tính giá trị biểu thức: 10 - 20 - 30 = ?', opt: null, ans: '-40', exp: '10 - 20 - 30 = -10 - 30 = -40.', img: null },
    { lesson_id: 17, type: 'choice', text: 'Cho biểu thức: A = -(-a + b). Bỏ dấu ngoặc thu được:', opt: ['a - b', '-a + b', 'a + b', '-a - b'], ans: 'a - b', exp: 'Đổi dấu -a thành a, b thành -b => a - b.', img: null },
    { lesson_id: 17, type: 'fill', text: 'Tìm số nguyên x biết: 10 - x = 12?', opt: null, ans: '-2', exp: 'x = 10 - 12 = -2.', img: null }
  );

  // Bài 18: Nhân số nguyên (lesson_id = 18)
  for (let i = 1; i <= 10; i++) {
    const a = -3;
    const b = i;
    const resVal = a * b;
    list.push({
      lesson_id: 18,
      type: 'choice',
      text: `Tính tích số nguyên: ${a < 0 ? '(' + a + ')' : a} × ${b < 0 ? '(' + b + ')' : b} = ?`,
      opt: [resVal, -resVal, resVal + 5, resVal - 5].map(String),
      ans: String(resVal),
      exp: `Tích của một số âm và một số dương luôn là một số âm.`,
      img: null
    });
  }

  // Bài 19: Ước & Bội trong Z (lesson_id = 19)
  for (let i = 1; i <= 10; i++) {
    const val = i + 2;
    list.push({
      lesson_id: 19,
      type: 'choice',
      text: `Số nào sau đây KHÔNG phải là ước của số nguyên -${val * 2}?`,
      opt: [String(val), String(-val), '1', '1.5'],
      ans: '1.5',
      exp: `Số nguyên 1.5 là số thập phân, không phải số nguyên nên không thể là ước của số nguyên.`,
      img: null
    });
  }

  // ==========================================
  // CHƯƠNG III: HÌNH HỌC TRỰC QUAN (Bài 20 - 26)
  // ==========================================

  // Bài 20: Tam giác đều, hình vuông, lục giác đều (lesson_id = 20)
  list.push(
    { lesson_id: 20, type: 'choice', text: 'Cho một hình vuông có cạnh dài 5 cm như hình vẽ bên. Chu vi của hình vuông đó bằng bao nhiêu?', opt: ['25 cm', '20 cm', '10 cm', '15 cm'], ans: '20 cm', exp: 'Chu vi hình vuông C = 4 × a = 4 × 5 = 20 cm.', img: '/assets/images/square.svg' },
    { lesson_id: 20, type: 'fill', text: 'Hình vuông có cạnh 6 cm. Tính diện tích của hình vuông đó (ghi đơn vị cm²)?', opt: null, ans: '36', exp: 'Diện tích hình vuông S = a² = 6² = 36 cm².', img: null },
    { lesson_id: 20, type: 'choice', text: 'Tam giác đều có đặc điểm nào dưới đây?', opt: ['Có 3 góc vuông', 'Có 3 cạnh bằng nhau', 'Có các cạnh đối song song', 'Không có trục đối xứng'], ans: 'Có 3 cạnh bằng nhau', exp: 'Tam giác đều có 3 cạnh bằng nhau và 3 góc bằng nhau.', img: null },
    { lesson_id: 20, type: 'fill', text: 'Tính chu vi của một tam giác đều có độ dài cạnh là 8 cm?', opt: null, ans: '24', exp: 'Chu vi tam giác đều C = 3 × a = 3 × 8 = 24 cm.', img: null },
    { lesson_id: 20, type: 'choice', text: 'Một hình vuông có diện tích là 49 cm². Độ dài cạnh của hình vuông đó là:', opt: ['7 cm', '6 cm', '8 cm', '49 cm'], ans: '7 cm', exp: 'Vì 7 × 7 = 49 nên độ dài cạnh của hình vuông là 7 cm.', img: null },
    { lesson_id: 20, type: 'choice', text: 'Lục giác đều được ghép từ mấy tam giác đều bằng nhau?', opt: ['4 tam giác', '5 tam giác', '6 tam giác', '8 tam giác'], ans: '6 tam giác', exp: 'Lục giác đều có cấu tạo ghép từ 6 tam giác đều chung đỉnh ở tâm.', img: null },
    { lesson_id: 20, type: 'fill', text: 'Hình vuông có chu vi là 32 cm. Độ dài cạnh hình vuông đó bằng bao nhiêu cm?', opt: null, ans: '8', exp: 'Độ dài cạnh a = C / 4 = 32 / 4 = 8 cm.', img: null },
    { lesson_id: 20, type: 'choice', text: 'Phát biểu nào sau đây về lục giác đều là sai?', opt: ['Có 6 cạnh bằng nhau', 'Có 6 góc bằng nhau', 'Có 3 đường chéo chính bằng nhau', 'Có các góc đều là góc vuông'], ans: 'Có các góc đều là góc vuông', exp: 'Các góc của lục giác đều không phải là góc vuông (mỗi góc bằng 120 độ).', img: null },
    { lesson_id: 20, type: 'fill', text: 'Tính diện tích hình vuông có cạnh dài 10 cm?', opt: null, ans: '100', exp: 'S = a² = 10 × 10 = 100 cm².', img: null },
    { lesson_id: 20, type: 'choice', text: 'Một tam giác đều có chu vi là 18 cm. Cạnh của tam giác đó dài bao nhiêu?', opt: ['6 cm', '9 cm', '18 cm', '3 cm'], ans: '6 cm', exp: 'Cạnh tam giác = C / 3 = 18 / 3 = 6 cm.', img: null }
  );

  // Bài 21: Hình chữ nhật, hình thoi (lesson_id = 21)
  list.push(
    { lesson_id: 21, type: 'fill', text: 'Một mảnh đất hình thoi có độ dài hai đường chéo lần lượt là 8 m và 6 m. Diện tích mảnh đất đó bằng bao nhiêu mét vuông?', opt: null, ans: '24', exp: 'Diện tích hình thoi S = ½ × m × n = ½ × 8 × 6 = 24 m².', img: '/assets/images/rhombus.svg' },
    { lesson_id: 21, type: 'choice', text: 'Tính diện tích hình chữ nhật có chiều dài 8 cm, chiều rộng 5 cm.', opt: ['40 cm²', '13 cm²', '26 cm²', '20 cm²'], ans: '40 cm²', exp: 'Diện tích hình chữ nhật S = a × b = 8 × 5 = 40 cm².', img: null },
    { lesson_id: 21, type: 'fill', text: 'Tính chu vi hình chữ nhật có chiều dài 12 cm, chiều rộng 8 cm?', opt: null, ans: '40', exp: 'Chu vi C = 2 × (a + b) = 2 × (12 + 8) = 40 cm.', img: null },
    { lesson_id: 21, type: 'choice', text: 'Hình thoi có đặc điểm nổi bật nào sau đây?', opt: ['Bốn góc đều bằng nhau', 'Bốn cạnh đều bằng nhau', 'Hai đường chéo bằng nhau', 'Có hai trục đối xứng song song'], ans: 'Bốn cạnh đều bằng nhau', exp: 'Hình thoi có 4 cạnh bằng nhau và 2 đường chéo vuông góc tại trung điểm.', img: null },
    { lesson_id: 21, type: 'fill', text: 'Hình chữ nhật có diện tích 48 cm² và chiều rộng 6 cm. Tính chiều dài hình chữ nhật đó?', opt: null, ans: '8', exp: 'Chiều dài = S / b = 48 / 6 = 8 cm.', img: null },
    { lesson_id: 21, type: 'choice', text: 'Diện tích hình thoi có đường chéo 10 cm và 12 cm là:', opt: ['120 cm²', '60 cm²', '44 cm²', '22 cm²'], ans: '60 cm²', exp: 'S = ½ × 10 × 12 = 60 cm².', img: null },
    { lesson_id: 21, type: 'fill', text: 'Chu vi hình thoi có cạnh dài 7 cm là bao nhiêu?', opt: null, ans: '28', exp: 'C = 4 × a = 4 × 7 = 28 cm.', img: null },
    { lesson_id: 21, type: 'choice', text: 'Hình thoi có độ dài cạnh là 5 cm, chu vi của nó bằng:', opt: ['20 cm', '25 cm', '10 cm', '15 cm'], ans: '20 cm', exp: 'C = 4 × 5 = 20 cm.', img: null },
    { lesson_id: 21, type: 'fill', text: 'Một hình chữ nhật có diện tích 50 cm², chiều dài là 10 cm. Tính chu vi hình chữ nhật đó?', opt: null, ans: '30', exp: 'Chiều rộng = 50 / 10 = 5 cm. Chu vi = 2 × (10 + 5) = 30 cm.', img: null },
    { lesson_id: 21, type: 'choice', text: 'Phát biểu nào sau đây đúng về hình chữ nhật?', opt: ['Hai đường chéo vuông góc', 'Bốn góc đều vuông', 'Bốn cạnh đều bằng nhau', 'Có 4 trục đối xứng'], ans: 'Bốn góc đều vuông', exp: 'Hình chữ nhật có 4 góc vuông, các cạnh đối song song và bằng nhau.', img: null }
  );

  // Bài 22: Hình bình hành (lesson_id = 22)
  for (let i = 1; i <= 10; i++) {
    const base = 5 + i;
    const height = 4;
    const s = base * height;
    list.push({
      lesson_id: 22,
      type: 'choice',
      text: `Tính diện tích hình bình hành có cạnh đáy a = ${base} cm và chiều cao tương ứng h = ${height} cm.`,
      opt: [s, s + 5, s - 3, s * 2].map(String),
      ans: String(s),
      exp: `Diện tích hình bình hành S = a × h = ${base} × ${height} = ${s} cm².`,
      img: null
    });
  }

  // Bài 23: Hình thang cân (lesson_id = 23)
  for (let i = 1; i <= 10; i++) {
    const a = 6 + i;
    const b = 4;
    const hVal = 4;
    const sVal = 0.5 * (a + b) * hVal;
    list.push({
      lesson_id: 23,
      type: 'choice',
      text: `Tính diện tích hình thang cân có hai đáy lần lượt là a = ${a} cm, b = ${b} cm và chiều cao h = ${hVal} cm.`,
      opt: [sVal, sVal + 4, sVal - 2, sVal * 2].map(String),
      ans: String(sVal),
      exp: `S = ½ × (a + b) × h = ½ × (${a} + ${b}) × ${hVal} = ${sVal} cm².`,
      img: null
    });
  }

  // Bài 24: Trục đối xứng (lesson_id = 24)
  list.push(
    { lesson_id: 24, type: 'choice', text: 'Trong các hình phẳng dưới đây, hình nào có đúng 1 trục đối xứng?', opt: ['Hình chữ nhật', 'Hình vuông', 'Hình thang cân', 'Hình bình hành'], ans: 'Hình thang cân', exp: 'Hình thang cân có 1 trục đối xứng. Hình chữ nhật có 2, hình vuông có 4, hình bình hành không có trục đối xứng.', img: '/assets/images/symmetry_shapes.svg' },
    { lesson_id: 24, type: 'choice', text: 'Hình vuông có bao nhiêu trục đối xứng?', opt: ['1', '2', '4', 'Vô số'], ans: '4', exp: 'Hình vuông có 4 trục đối xứng (2 đường chéo và 2 đường trung trực của các cạnh đối).', img: null },
    { lesson_id: 24, type: 'choice', text: 'Hình tròn có bao nhiêu trục đối xứng?', opt: ['1', '2', '4', 'Vô số'], ans: 'Vô số', exp: 'Mọi đường thẳng đi qua tâm đều là trục đối xứng của hình tròn.', img: null },
    { lesson_id: 24, type: 'fill', text: 'Hình thang cân có mấy trục đối xứng?', opt: null, ans: '1', exp: 'Hình thang cân có duy nhất 1 trục đối xứng đi qua trung điểm hai đáy.', img: null },
    { lesson_id: 24, type: 'fill', text: 'Hình chữ nhật có mấy trục đối xứng?', opt: null, ans: '2', exp: 'Hình chữ nhật có 2 trục đối xứng đi qua trung điểm các cặp cạnh đối diện.', img: null },
    { lesson_id: 24, type: 'fill', text: 'Hình thoi có mấy trục đối xứng?', opt: null, ans: '2', exp: 'Hai đường chéo của hình thoi chính là 2 trục đối xứng của nó.', img: null },
    { lesson_id: 24, type: 'choice', text: 'Hình nào dưới đây KHÔNG có trục đối xứng?', opt: ['Hình bình hành', 'Hình thoi', 'Hình vuông', 'Hình tròn'], ans: 'Hình bình hành', exp: 'Hình bình hành (không phải dạng đặc biệt) không có trục đối xứng nào.', img: null },
    { lesson_id: 24, type: 'choice', text: 'Hình tam giác đều có bao nhiêu trục đối xứng?', opt: ['1', '2', '3', '0'], ans: '3', exp: 'Tam giác đều có 3 trục đối xứng là 3 đường trung trực của 3 cạnh.', img: null },
    { lesson_id: 24, type: 'fill', text: 'Biển báo giao thông hình tròn có bao nhiêu trục đối xứng (nếu không xét hình vẽ bên trong)?', opt: null, ans: 'Vô số', exp: 'Hình tròn có vô số trục đối xứng.', img: null },
    { lesson_id: 24, type: 'choice', text: 'Chữ cái in hoa nào sau đây có trục đối xứng nằm ngang?', opt: ['A', 'Y', 'H', 'V'], ans: 'H', exp: 'Chữ H có cả trục đối xứng dọc và ngang. Chữ A, Y, V chỉ có trục đối xứng dọc.', img: null }
  );

  // Bài 25: Tâm đối xứng (lesson_id = 25)
  for (let i = 1; i <= 10; i++) {
    list.push({
      lesson_id: 25,
      type: 'choice',
      text: `Hình nào sau đây có tâm đối xứng?`,
      opt: ['Hình bình hành', 'Hình thang cân', 'Tam giác đều', 'Tam giác vuông'],
      ans: 'Hình bình hành',
      exp: 'Hình bình hành có tâm đối xứng chính là giao điểm hai đường chéo. Tam giác đều và hình thang cân không có tâm đối xứng.',
      img: null
    });
  }

  // Bài 26: Đối xứng trong thực tiễn (lesson_id = 26)
  for (let i = 1; i <= 10; i++) {
    list.push({
      lesson_id: 26,
      type: 'choice',
      text: `Vật thể tự nhiên nào sau đây thể hiện tính đối xứng rõ rệt?`,
      opt: ['Bông hoa tuyết', 'Một cành cây ngẫu nhiên', 'Một tảng đá tự nhiên', 'Một ngọn đồi'],
      ans: 'Bông hoa tuyết',
      exp: 'Bông hoa tuyết có tính đối xứng trục và tâm đối xứng lục giác hoàn hảo trong tự nhiên.',
      img: null
    });
  }

  return list;
}

async function setupDatabase() {
  console.log('Starting MySQL Database Setup...');
  
  // 1. Kết nối không chọn database trước
  const connectionConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
  };

  let connection;
  try {
    connection = await mysql.createConnection(connectionConfig);
    console.log('Connected to MySQL server.');

    // 2. Đọc và thực thi file schema.sql để tạo các bảng mới
    const sqlFilePath = path.join(__dirname, 'data', 'schema.sql');
    if (!fs.existsSync(sqlFilePath)) {
      throw new Error(`Cannot find schema.sql file at path: ${sqlFilePath}`);
    }
    const sqlQueries = fs.readFileSync(sqlFilePath, 'utf8');
    
    console.log('Executing schema.sql...');
    await connection.query(sqlQueries);

    // 3. Sử dụng database
    await connection.query('USE webonluyentoan');

    // 4. Sinh và chèn 260 câu hỏi (10 câu/bài cho cả 26 bài học)
    console.log('Generating 260 dynamic Math questions...');
    const questions = generateQuestions();
    
    console.log(`Inserting ${questions.length} questions into MySQL questions table...`);
    const insertQuery = 'INSERT INTO questions (lesson_id, question_text, question_type, options, correct_answer, explanation, image_url) VALUES ?';
    
    const values = questions.map(q => [
      q.lesson_id,
      q.text,
      q.type,
      q.opt ? JSON.stringify(q.opt) : null,
      q.ans,
      q.exp,
      q.img
    ]);

    await connection.query(insertQuery, [values]);

    console.log('Database and 260 seed questions successfully initialized!');
    
  } catch (error) {
    console.error('Database setup failed. Error details:');
    console.error(error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Connection closed.');
    }
  }
}

setupDatabase();

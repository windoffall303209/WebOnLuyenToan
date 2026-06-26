// ==========================================================================
// BUSINESS SIMULATION - EXPERIENTIAL INTEGER MATH PRACTICE
// ==========================================================================
let businessBalance = 500; // Khởi đầu có 500k VNĐ trong tài khoản
let currentLedgerResult = 0;

document.addEventListener('DOMContentLoaded', () => {
  initBusinessEvents();
});

function initBusinessEvents() {
  document.getElementById('btn-submit-business').addEventListener('click', checkBusinessAnswer);
  document.getElementById('btn-next-business').addEventListener('click', generateBusinessScenario);
  
  // Nút enter kiểm tra đáp án
  document.getElementById('business-answer').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkBusinessAnswer();
  });
}

// Bắt đầu hoạt động kinh doanh
function startBusinessSimulation() {
  businessBalance = 500;
  document.getElementById('business-balance-text').textContent = `${businessBalance}k VNĐ`;
  generateBusinessScenario();
}

// Phát sinh ngẫu nhiên nhật ký giao dịch tài chính dùng số nguyên
function generateBusinessScenario() {
  document.getElementById('business-answer').value = '';
  document.getElementById('business-answer').disabled = false;
  document.getElementById('btn-submit-business').disabled = false;
  document.getElementById('business-feedback').className = 'feedback-text';
  document.getElementById('business-feedback').textContent = '';

  // Phát sinh ngẫu nhiên từ 3 đến 5 giao dịch
  const entriesCount = Math.floor(Math.random() * 3) + 3; // 3 đến 5 giao dịch
  const activities = [
    { text: 'Nhập hàng hóa mới', val: -150, type: 'loss' },
    { text: 'Bán lẻ hàng hóa cho khách', val: 200, type: 'gain' },
    { text: 'Thanh toán tiền điện nước cửa hàng', val: -50, type: 'loss' },
    { text: 'Khách hàng trả tiền mua sỉ', val: 400, type: 'gain' },
    { text: 'Thanh toán tiền lương nhân viên', val: -250, type: 'loss' },
    { text: 'Chi phí sửa chữa máy tính cửa hàng', val: -100, type: 'loss' },
    { text: 'Khách hàng đặt cọc dịch vụ', val: 150, type: 'gain' },
    { text: 'Thu mua phế liệu tái chế bán lại', val: 80, type: 'gain' },
    { text: 'Bồi thường khách hàng đổi trả', val: -120, type: 'loss' }
  ];

  // Xáo trộn ngẫu nhiên và chọn
  const selectedActivities = activities.sort(() => Math.random() - 0.5).slice(0, entriesCount);
  
  // Hiển thị giao dịch lên bảng sổ sách
  const ledgerList = document.getElementById('ledger-entries-list');
  ledgerList.innerHTML = '';
  
  let totalProfitLoss = 0;

  selectedActivities.forEach(item => {
    totalProfitLoss += item.val;
    
    const div = document.createElement('div');
    div.className = 'ledger-item';
    div.innerHTML = `
      <span>${item.text}</span>
      <span class="${item.val >= 0 ? 'ledger-val-positive' : 'ledger-val-negative'}">
        ${item.val >= 0 ? '+' + item.val : item.val}k
      </span>
    `;
    ledgerList.appendChild(div);
  });

  currentLedgerResult = totalProfitLoss;
}

// Kiểm tra đáp án kinh doanh của học sinh
async function checkBusinessAnswer() {
  const inputEl = document.getElementById('business-answer');
  const userVal = parseInt(inputEl.value.trim());

  if (isNaN(userVal)) {
    alert('Vui lòng điền số tiền lời/lỗ dự kiến nhé!');
    return;
  }

  inputEl.disabled = true;
  document.getElementById('btn-submit-business').disabled = true;

  const fbEl = document.getElementById('business-feedback');

  if (userVal === currentLedgerResult) {
    // Trả lời ĐÚNG
    fbEl.className = 'feedback-text text-success';
    fbEl.innerHTML = `🎉 Chính xác! Số dư tài khoản thay đổi ${currentLedgerResult >= 0 ? '+' : ''}${currentLedgerResult}k VNĐ.<br>Em được thưởng +15 XP!`;
    
    // Cập nhật số dư ngân hàng ảo
    businessBalance += currentLedgerResult;
    document.getElementById('business-balance-text').textContent = `${businessBalance}k VNĐ`;

    // Nháy sáng hiệu ứng ví tiền
    const wallet = document.querySelector('.wallet-visual');
    wallet.style.transform = 'scale(1.05)';
    setTimeout(() => { wallet.style.transform = 'scale(1)'; }, 300);

    // Cộng XP hệ thống
    if (window.gainXP) {
      await window.gainXP(15);
    }
  } else {
    // Trả lời SAI
    fbEl.className = 'feedback-text text-danger';
    fbEl.innerHTML = `❌ Chưa chính xác. Đáp án đúng là <strong>${currentLedgerResult}k</strong> VNĐ.<br>` +
      `<em>Giải thích phép tính:</em> Tổng cộng lời/lỗ = ` +
      `(${document.getElementById('ledger-entries-list').innerText.replace(/\n/g, ' + ')}). Hãy nhẩm lại thật kỹ nhé!`;
  }
}

// Xuất hàm để app.js gọi
window.startBusinessSimulation = startBusinessSimulation;

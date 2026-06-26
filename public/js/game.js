// ==========================================================================
// ROCKET MATH GAME (ASTEROID DODGER & SOLVER LOOP)
// ==========================================================================
let gameInterval = null;
let gameScore = 0;
let gameLives = 3;
let isGameRunning = false;
let currentCorrectAnswer = null;
let currentQuizType = 'add'; // add, sub, mul, exponent, prime
let speedMultiplier = 1;

// Khởi tạo các sự kiện khi load trang
function initGame() {
  initGameEvents();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGame);
} else {
  initGame();
}

function initGameEvents() {
  // Bắt đầu chơi game khi chọn ở Menu
  // Bắt đầu chơi game khi chọn ở Menu
  document.querySelectorAll('.btn-start-game').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const gameType = e.currentTarget.getAttribute('data-game');
      if (gameType === 'rocket') {
        window.location.hash = '#game-rocket';
      } else if (gameType === 'business') {
        window.location.hash = '#game-business';
      } else if (gameType === 'geogebra') {
        window.location.hash = '#game-geogebra';
      }
    });
  });

  // Quit game
  document.querySelectorAll('.btn-quit-game').forEach(btn => {
    btn.addEventListener('click', () => {
      stopRocketGame();
      window.location.hash = '#game-menu';
    });
  });

  // Expose functions globally for Hash Routing support
  window.resetRocketGameHUD = resetRocketGameHUD;
  window.stopRocketGame = stopRocketGame;

  // Click bắt đầu trong overlay
  document.getElementById('btn-play-rocket').addEventListener('click', startRocketGame);
  document.getElementById('btn-retry-rocket').addEventListener('click', () => {
    resetRocketGameHUD();
    startRocketGame();
  });
}

function resetRocketGameHUD() {
  gameScore = 0;
  gameLives = 3;
  speedMultiplier = 1;
  document.getElementById('rocket-lives').textContent = '❤️❤️❤️';
  document.getElementById('rocket-score').textContent = '0';
  document.getElementById('game-start-overlay').classList.remove('hidden');
  document.getElementById('game-over-overlay').classList.add('hidden');
  document.getElementById('game-question-bubble').classList.add('hidden');
  document.getElementById('asteroid-container').innerHTML = '';
}

// Bắt đầu game loop
function startRocketGame() {
  isGameRunning = true;
  document.getElementById('game-start-overlay').classList.add('hidden');
  document.getElementById('game-over-overlay').classList.add('hidden');
  
  // Chạy vòng lặp tăng điểm mét bay (Cứ mỗi 100ms bay được 1 mét)
  gameInterval = setInterval(() => {
    gameScore += 1;
    document.getElementById('rocket-score').textContent = gameScore;
    
    // Tăng dần độ khó theo điểm
    if (gameScore % 50 === 0) {
      speedMultiplier += 0.15;
    }

    // Xuất hiện thiên thạch câu hỏi toán (mỗi khi bay được khoảng 30m, 60m...)
    if (gameScore > 0 && gameScore % 25 === 0) {
      triggerAsteroidQuestion();
    }
  }, 100);
}

// Dừng game loop
function stopRocketGame() {
  isGameRunning = false;
  if (gameInterval) {
    clearInterval(gameInterval);
    gameInterval = null;
  }
}

// Tạo câu hỏi toán ngẫu nhiên (chương I và chương II sách Cánh Diều)
function generateRocketQuestion() {
  const types = ['add', 'sub', 'mul', 'exponent', 'prime'];
  const type = types[Math.floor(Math.random() * types.length)];
  currentQuizType = type;

  let a, b, qText, correctVal, choices = [];

  switch (type) {
    case 'add': // Cộng số nguyên
      a = Math.floor(Math.random() * 15) - 7; // từ -7 đến 7
      b = Math.floor(Math.random() * 15) - 7;
      qText = `${a >= 0 ? a : '(' + a + ')'} + ${b >= 0 ? b : '(' + b + ')'} = ?`;
      correctVal = a + b;
      choices = [correctVal, correctVal + 3, correctVal - 2];
      break;

    case 'sub': // Trừ số nguyên
      a = Math.floor(Math.random() * 15) - 5;
      b = Math.floor(Math.random() * 12) - 5;
      qText = `${a >= 0 ? a : '(' + a + ')'} - ${b >= 0 ? b : '(' + b + ')'} = ?`;
      correctVal = a - b;
      choices = [correctVal, correctVal + 2, correctVal - 4];
      break;

    case 'mul': // Nhân số nguyên
      a = Math.floor(Math.random() * 10) - 5;
      b = Math.floor(Math.random() * 8) - 4;
      qText = `${a >= 0 ? a : '(' + a + ')'} × ${b >= 0 ? b : '(' + b + ')'} = ?`;
      correctVal = a * b;
      choices = [correctVal, correctVal + 4, correctVal - 6];
      break;

    case 'exponent': // Lũy thừa
      a = Math.floor(Math.random() * 4) + 2; // Cơ số 2 đến 5
      b = Math.floor(Math.random() * 2) + 2; // Số mũ 2 đến 3 (Tránh mũ to quá tính mệt)
      qText = `${a} mũ ${b} (${a}^${b}) = ?`;
      correctVal = Math.pow(a, b);
      choices = [correctVal, a * b, correctVal + 4]; // Tránh bẫy nhân cơ số với số mũ
      break;

    case 'prime': // Nhận diện số nguyên tố / hợp số
      const primes = [2, 3, 5, 7, 11, 13, 17, 19];
      const composites = [4, 6, 8, 9, 10, 12, 14, 15];
      const isPrimeQuery = Math.random() > 0.5;
      
      if (isPrimeQuery) {
        correctVal = primes[Math.floor(Math.random() * primes.length)];
        qText = `Số nào dưới đây là SỐ NGUYÊN TỐ?`;
        choices = [correctVal, 9, 15];
      } else {
        correctVal = composites[Math.floor(Math.random() * composites.length)];
        qText = `Số nào dưới đây là HỢP SỐ?`;
        choices = [correctVal, 7, 11];
      }
      break;
  }

  // Loại bỏ các lựa chọn trùng lặp và xáo trộn ngẫu nhiên
  choices = [...new Set(choices)].sort(() => Math.random() - 0.5);
  currentCorrectAnswer = correctVal;

  return { text: qText, choices: choices };
}

// Kích hoạt chướng ngại vật thiên thạch câu hỏi
function triggerAsteroidQuestion() {
  // Tạm dừng cộng điểm mét bay khi đang giải toán
  stopRocketGame();

  const container = document.getElementById('asteroid-container');
  container.innerHTML = '';

  // Tạo thẻ thiên thạch rơi ở vị trí ngẫu nhiên
  const asteroid = document.createElement('div');
  asteroid.className = 'asteroid';
  asteroid.innerHTML = '☄️';
  // Vị trí rơi từ trên đỉnh xuống giữa màn hình
  asteroid.style.left = '50%';
  asteroid.style.top = '100px';
  asteroid.style.transform = 'translateX(-50%)';
  container.appendChild(asteroid);

  // Tạo câu hỏi toán
  const quiz = generateRocketQuestion();
  
  const bubble = document.getElementById('game-question-bubble');
  document.getElementById('game-question-text').textContent = quiz.text;

  const optContainer = document.getElementById('game-options-container');
  optContainer.innerHTML = '';

  quiz.choices.forEach(val => {
    const btn = document.createElement('button');
    btn.className = 'game-opt-btn';
    btn.textContent = val;
    btn.addEventListener('click', () => selectGameAnswer(btn, val));
    optContainer.appendChild(btn);
  });

  bubble.classList.remove('hidden');
}

// Xử lý khi chọn câu trả lời trong game
async function selectGameAnswer(btnEl, selectedVal) {
  const isCorrect = (String(selectedVal) === String(currentCorrectAnswer));

  if (isCorrect) {
    // Trả lời ĐÚNG -> Bắn phá thiên thạch
    document.getElementById('game-question-bubble').classList.add('hidden');
    
    // Hiệu ứng bắn Laser từ phi thuyền lên thiên thạch
    fireLaserAnimation();

    setTimeout(() => {
      // Xóa thiên thạch
      document.getElementById('asteroid-container').innerHTML = '';
      
      // Tiếp tục phóng phi thuyền
      startRocketGame();
    }, 500);

  } else {
    // Trả lời SAI -> Bị thiên thạch đập trúng
    gameLives--;
    updateGameLivesHUD();

    // Rung giật màn hình
    const screen = document.getElementById('game-screen');
    screen.style.animation = 'shake 0.3s ease-in-out';
    setTimeout(() => { screen.style.animation = ''; }, 300);

    // Vô hiệu hóa nút đã chọn sai
    btnEl.disabled = true;
    btnEl.style.opacity = '0.3';
    btnEl.style.backgroundColor = 'var(--color-error)';

    // Kiểm tra mất mạng hết game
    if (gameLives <= 0) {
      endGameRocket();
    }
  }
}

// Vẽ hoạt ảnh tia Laser
function fireLaserAnimation() {
  const screen = document.getElementById('game-screen');
  const laser = document.createElement('div');
  laser.style.position = 'absolute';
  laser.style.bottom = '60px';
  laser.style.left = '50%';
  laser.style.transform = 'translateX(-50%)';
  laser.style.width = '4px';
  laser.style.height = '150px';
  laser.style.background = 'linear-gradient(to top, #00f0ff, transparent)';
  laser.style.boxShadow = '0 0 10px #00f0ff';
  laser.style.zIndex = '8';
  laser.style.animation = 'laserShoot 0.4s ease-out forwards';
  
  screen.appendChild(laser);
  setTimeout(() => { laser.remove(); }, 400);
}

// Đồng bộ số tim mạng
function updateGameLivesHUD() {
  let hearts = '';
  for (let i = 0; i < gameLives; i++) {
    hearts += '❤️';
  }
  if (hearts === '') hearts = '💔';
  document.getElementById('rocket-lives').textContent = hearts;
}

// Kết thúc game
async function endGameRocket() {
  stopRocketGame();
  
  document.getElementById('game-question-bubble').classList.add('hidden');
  document.getElementById('asteroid-container').innerHTML = '';
  
  document.getElementById('game-final-score').textContent = gameScore;
  const overlay = document.getElementById('game-over-overlay');
  overlay.classList.remove('hidden');

  // Ghi kỷ lục lên server và MySQL qua API
  if (window.AppState && AppState.username) {
    try {
      const res = await fetch('/api/highscore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: AppState.username,
          score: gameScore
        })
      });
      const data = await res.json();
      
      if (data.newRecord) {
        document.getElementById('game-new-record-text').classList.remove('hidden');
        AppState.highScore = gameScore;
        // Cập nhật lên HUD
        document.getElementById('game-highscore-text').textContent = gameScore;
      } else {
        document.getElementById('game-new-record-text').classList.add('hidden');
      }
    } catch (error) {
      console.warn('Lỗi lưu điểm cao lên MySQL:', error);
    }
  }

  // Cộng điểm XP khuyến khích (Ví dụ: 1/5 số mét bay thành điểm XP)
  const xpReward = Math.floor(gameScore / 5);
  if (xpReward > 0 && window.gainXP) {
    window.gainXP(xpReward);
  }

  // Lưu trạng thái huy hiệu phi hành gia
  if (gameScore >= 50) {
    localStorage.setItem('achievement_rocket_master', 'true');
    if (window.checkAndUnlockAchievements) {
      window.checkAndUnlockAchievements();
    }
  }
}

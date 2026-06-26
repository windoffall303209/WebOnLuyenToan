// ==========================================================================
// MAIN APP STATE & SPA NAVIGATION MANAGER
// ==========================================================================
const AppState = {
  username: '',
  xp: 0,
  stars: 0,
  level: 1,
  highScore: 0,
  currentView: 'dashboard-view',
  achievements: []
};

// Khởi chạy khi tài liệu sẵn sàng
function initApp() {
  initTheme();
  initAppEvents();
  checkLoginStatus();
  
  // Lắng nghe thay đổi hash
  window.addEventListener('hashchange', handleRouting);
  
  // Khởi tạo các icons Lucide ban đầu
  if (window.lucide) {
    lucide.createIcons();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// Khởi tạo Theme Sáng/Tối
function initTheme() {
  const savedTheme = localStorage.getItem('webonluyen_theme') || 'dark';
  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
  } else {
    document.body.classList.remove('light-theme');
  }

  const themeToggleBtn = document.getElementById('theme-toggle');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('light-theme');
      const currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
      localStorage.setItem('webonluyen_theme', currentTheme);
    });
  }
}

// Chuyển đổi qua lại giữa Tab Đăng nhập và Đăng ký
function switchAuthTab(tab) {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const loginTabBtn = document.getElementById('auth-tab-login');
  const registerTabBtn = document.getElementById('auth-tab-register');
  
  if (tab === 'login') {
    loginForm.classList.add('active');
    loginForm.classList.remove('hidden');
    registerForm.classList.remove('active');
    registerForm.classList.add('hidden');
    
    loginTabBtn.classList.add('active');
    registerTabBtn.classList.remove('active');
  } else {
    registerForm.classList.add('active');
    registerForm.classList.remove('hidden');
    loginForm.classList.remove('active');
    loginForm.classList.add('hidden');
    
    registerTabBtn.classList.add('active');
    loginTabBtn.classList.remove('active');
  }
}
window.switchAuthTab = switchAuthTab;

// Kiểm tra xem đã lưu thông tin đăng nhập chưa
function checkLoginStatus() {
  const savedUsername = sessionStorage.getItem('webonluyen_username') || localStorage.getItem('webonluyen_username');
  if (savedUsername) {
    loginUser(savedUsername).then(() => {
      handleRouting();
    });
  } else {
    document.getElementById('main-app').classList.add('hidden');
    showViewOnly('welcome-view');
    window.location.hash = '#welcome';
  }
}

// Xử lý Hash Routing (SPA)
function handleRouting() {
  const hash = window.location.hash || '#dashboard';
  
  // Kiểm tra đăng nhập
  const savedUsername = sessionStorage.getItem('webonluyen_username') || localStorage.getItem('webonluyen_username');
  if (!savedUsername) {
    document.getElementById('main-app').classList.add('hidden');
    showViewOnly('welcome-view');
    if (window.location.hash !== '#welcome') {
      window.location.hash = '#welcome';
    }
    return;
  }
  
  // Nếu chưa đồng bộ User sang AppState nhưng có storage
  if (!AppState.username) {
    loginUser(savedUsername).then(() => handleRouting());
    return;
  }

  // Phân tích các thông số từ hash
  const parts = hash.split('?');
  const path = parts[0];
  const queryStr = parts[1] || '';
  const params = {};
  if (queryStr) {
    queryStr.split('&').forEach(p => {
      const kv = p.split('=');
      params[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1] || '');
    });
  }

  switch (path) {
    case '#welcome':
      showViewOnly('welcome-view');
      break;
    case '#dashboard':
      switchView('dashboard-view', false);
      break;
    case '#formula':
      switchView('formula-view', false);
      break;
    case '#game-menu':
      switchView('game-menu-view', false);
      break;
    case '#achievements':
      switchView('achievements-view', false);
      loadUserHistory();
      break;
    case '#lessons':
      if (params.chapter) {
        loadChapterLessons(params.chapter, false);
      } else {
        window.location.hash = '#dashboard';
      }
      break;
    case '#quiz':
      if (params.lessonId && params.title) {
        if (window.startQuiz) {
          window.startQuiz(params.lessonId, params.title, false);
        } else {
          // quiz.js có thể tải sau, chờ 100ms
          setTimeout(() => handleRouting(), 100);
        }
      } else {
        window.location.hash = '#dashboard';
      }
      break;
    case '#game-rocket':
      switchView('game-rocket-view', false);
      if (window.resetRocketGameHUD) window.resetRocketGameHUD();
      break;
    case '#game-business':
      switchView('game-business-view', false);
      if (window.startBusinessSimulation) window.startBusinessSimulation();
      break;
    case '#game-geogebra':
      switchView('game-geogebra-view', false);
      if (window.startGeogebraTask) window.startGeogebraTask();
      break;
    default:
      window.location.hash = '#dashboard';
      break;
  }
}

// Tải lịch sử học tập của học sinh
async function loadUserHistory() {
  const tableBody = document.getElementById('history-table-body');
  if (!tableBody) return;

  tableBody.innerHTML = '<tr><td colspan="5" class="text-center">Đang tải nhật ký...</td></tr>';

  try {
    const res = await fetch(`/api/history?username=${encodeURIComponent(AppState.username)}`);
    if (!res.ok) throw new Error('Không thể tải lịch sử');
    const history = await res.json();

    tableBody.innerHTML = '';

    if (history.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="5" class="text-center">Chưa có lịch sử làm bài. Hãy làm bài tập để tích lũy thành tích nhé!</td></tr>';
      return;
    }

    history.forEach(item => {
      const tr = document.createElement('tr');
      
      const date = new Date(item.created_at);
      const dateStr = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
      
      tr.innerHTML = `
        <td><strong>${item.lesson_title}</strong></td>
        <td><span class="badge ${item.score_correct === item.total_questions ? 'bg-success' : 'bg-primary'}">${item.score_correct}/${item.total_questions} câu đúng</span></td>
        <td><span class="text-success">+${item.xp_earned} XP</span></td>
        <td><span class="text-warning"><i data-lucide="star" class="lucide-icon glow-yellow"></i> ${item.stars_earned}</span></td>
        <td><small class="text-muted">${dateStr}</small></td>
      `;
      tableBody.appendChild(tr);
    });
    if (window.lucide) {
      lucide.createIcons();
    }
  } catch (error) {
    console.error('Lỗi khi tải lịch sử:', error);
    tableBody.innerHTML = '<tr><td colspan="5" class="text-center text-danger">Lỗi tải dữ liệu lịch sử từ server.</td></tr>';
  }
}
window.loadUserHistory = loadUserHistory;

// Hàm khởi tạo sự kiện chính của ứng dụng
function initAppEvents() {
  // Submit Form Đăng nhập
  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    const errorEl = document.getElementById('login-error-msg');
    
    errorEl.classList.add('hidden');
    
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Đăng nhập thất bại');
      }
      
      sessionStorage.setItem('webonluyen_username', data.username);
      localStorage.setItem('webonluyen_username', data.username);
      
      AppState.username = data.username;
      AppState.xp = data.xp;
      AppState.stars = data.stars;
      AppState.level = data.level;
      AppState.highScore = data.high_score_game;
      
      updateHUD();
      
      document.getElementById('welcome-view').classList.add('hidden');
      document.getElementById('welcome-view').classList.remove('active');
      document.getElementById('main-app').classList.remove('hidden');
      
      window.location.hash = '#dashboard';
      
      if (window.checkAndUnlockAchievements) {
        window.checkAndUnlockAchievements();
      }
    } catch (err) {
      errorEl.textContent = err.message;
      errorEl.classList.remove('hidden');
    }
  });

  // Submit Form Đăng ký
  document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('register-username').value.trim();
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    const errorEl = document.getElementById('register-error-msg');
    const successEl = document.getElementById('register-success-msg');
    
    errorEl.classList.add('hidden');
    successEl.classList.add('hidden');
    
    if (password !== confirmPassword) {
      errorEl.textContent = 'Mật khẩu xác nhận không khớp!';
      errorEl.classList.remove('hidden');
      return;
    }
    
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Đăng ký thất bại');
      }
      
      successEl.textContent = 'Đăng ký tài khoản thành công! Em hãy chuyển sang Đăng nhập nhé.';
      successEl.classList.remove('hidden');
      
      document.getElementById('login-username').value = username;
      document.getElementById('login-password').value = password;
      
      setTimeout(() => {
        switchAuthTab('login');
        successEl.classList.add('hidden');
      }, 1500);
      
    } catch (err) {
      errorEl.textContent = err.message;
      errorEl.classList.remove('hidden');
    }
  });

  // Nút Logo về trang chủ
  document.getElementById('btn-logo-home').addEventListener('click', () => {
    window.location.hash = '#dashboard';
  });

  // Đăng xuất
  document.getElementById('btn-logout').addEventListener('click', () => {
    sessionStorage.removeItem('webonluyen_username');
    localStorage.removeItem('webonluyen_username');
    document.getElementById('main-app').classList.add('hidden');
    document.getElementById('welcome-view').classList.remove('hidden');
    document.getElementById('login-username').value = '';
    document.getElementById('login-password').value = '';
    document.getElementById('register-username').value = '';
    document.getElementById('register-password').value = '';
    document.getElementById('register-confirm-password').value = '';
    
    showViewOnly('welcome-view');
    window.location.hash = '#welcome';
  });

  // Điều hướng thanh Navigation
  document.querySelectorAll('.cosmic-nav .nav-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const targetView = e.currentTarget.getAttribute('data-target');
      const hashMapping = {
        'dashboard-view': '#dashboard',
        'formula-view': '#formula',
        'game-menu-view': '#game-menu',
        'achievements-view': '#achievements'
      };
      if (hashMapping[targetView]) {
        window.location.hash = hashMapping[targetView];
      }
    });
  });

  // Các nút chọn Chương ở Dashboard
  document.querySelectorAll('.btn-select-chapter').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const chapter = e.currentTarget.getAttribute('data-chapter');
      window.location.hash = `#lessons?chapter=${chapter}`;
    });
  });

  // Các nút quay lại
  document.querySelectorAll('.btn-back').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const backView = e.currentTarget.getAttribute('data-back');
      const hashMapping = {
        'dashboard-view': '#dashboard',
        'formula-view': '#formula',
        'game-menu-view': '#game-menu',
        'achievements-view': '#achievements'
      };
      if (hashMapping[backView]) {
        window.location.hash = hashMapping[backView];
      } else {
        window.location.hash = '#dashboard';
      }
    });
  });

  // Mở các bộ Tra cứu / Từ điển
  document.getElementById('btn-open-prime-explorer').addEventListener('click', () => {
    document.getElementById('prime-explorer-modal').classList.remove('hidden');
  });
  document.getElementById('btn-open-glossary').addEventListener('click', () => {
    document.getElementById('glossary-modal').classList.remove('hidden');
    loadGlossary(); // Tải từ điển
  });

  // Đóng Modal
  document.getElementById('btn-close-prime').addEventListener('click', () => {
    document.getElementById('prime-explorer-modal').classList.add('hidden');
  });
  document.getElementById('btn-close-glossary').addEventListener('click', () => {
    document.getElementById('glossary-modal').classList.add('hidden');
  });

  // Kiểm tra số nguyên tố
  document.getElementById('btn-check-prime').addEventListener('click', checkPrimeNumberLocal);
  document.getElementById('prime-search-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkPrimeNumberLocal();
  });

  // Tra cứu thuật ngữ toán học
  document.getElementById('glossary-search-input').addEventListener('input', (e) => {
    loadGlossary(e.target.value.trim());
  });
}

// Đăng nhập người dùng và tải tiến trình
async function loginUser(username) {
  AppState.username = username;
  try {
    const res = await fetch(`/api/progress?username=${encodeURIComponent(username)}`);
    if (!res.ok) throw new Error('Không thể tải tiến trình');
    const data = await res.json();
    
    // Lưu vào trạng thái ứng dụng
    AppState.xp = data.xp;
    AppState.stars = data.stars;
    AppState.level = data.level;
    AppState.highScore = data.high_score_game;

    // Cập nhật giao diện người dùng
    updateHUD();

    // Hiển thị phần chính ứng dụng
    document.getElementById('welcome-view').classList.add('hidden');
    document.getElementById('welcome-view').classList.remove('active');
    document.getElementById('main-app').classList.remove('hidden');

    // Mở khóa các huy hiệu ban đầu nếu có
    if (window.checkAndUnlockAchievements) {
      window.checkAndUnlockAchievements();
    }
  } catch (error) {
    console.error('Lỗi đăng nhập:', error);
    // Chạy offline
    AppState.username = username;
    updateHUD();
    document.getElementById('welcome-view').classList.add('hidden');
    document.getElementById('welcome-view').classList.remove('active');
    document.getElementById('main-app').classList.remove('hidden');
  }
}

// Hiển thị một view duy nhất (dành cho welcome-view)
function showViewOnly(viewId) {
  document.querySelectorAll('.view-panel').forEach(panel => {
    panel.classList.remove('active');
  });
  const el = document.getElementById(viewId);
  if (el) {
    el.classList.add('active');
    el.classList.remove('hidden');
  }
}

// Chuyển view trong SPA
function switchView(viewId, updateHash = true) {
  AppState.currentView = viewId;
  
  // Tải đồng bộ Navigation
  document.querySelectorAll('.cosmic-nav .nav-btn').forEach(btn => {
    if (btn.getAttribute('data-target') === viewId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Ẩn tất cả các view con
  document.querySelectorAll('.view-content > .app-view').forEach(view => {
    view.classList.remove('active');
  });
  
  // Ẩn màn hình chọn bài học
  document.getElementById('lesson-select-view').classList.remove('active');
  
  // Hiển thị view mong muốn
  const targetElement = document.getElementById(viewId);
  if (targetElement) {
    targetElement.classList.add('active');
  }

  // Kích hoạt vẽ hình học nếu chuyển vào tab formulas
  if (viewId === 'formula-view' && window.initGeometrySliders) {
    window.initGeometrySliders();
    window.drawArithmeticAxis();
  }

  // Cập nhật hash tương ứng
  if (updateHash) {
    const hashMapping = {
      'dashboard-view': '#dashboard',
      'formula-view': '#formula',
      'game-menu-view': '#game-menu',
      'achievements-view': '#achievements',
      'game-rocket-view': '#game-rocket',
      'game-business-view': '#game-business',
      'game-geogebra-view': '#game-geogebra',
      'welcome-view': '#welcome'
    };
    const targetHash = hashMapping[viewId];
    if (targetHash && !window.location.hash.startsWith(targetHash)) {
      window.location.hash = targetHash;
    }
  }
}

// Đồng bộ trạng thái HUD lên giao diện
function updateHUD() {
  document.getElementById('hud-username').textContent = AppState.username;
  document.getElementById('hud-level').textContent = `Cấp ${AppState.level}`;
  document.getElementById('hud-stars').textContent = AppState.stars;
  
  // Tính toán XP cần cho cấp độ hiện tại
  // Mỗi cấp cần 100 XP
  const xpNeeded = AppState.level * 100;
  const currentXP = AppState.xp;
  
  document.getElementById('hud-xp-text').textContent = `${currentXP}/${xpNeeded}`;
  
  // Tính tỷ lệ fill thanh tiến trình
  const percentage = Math.min((currentXP / xpNeeded) * 100, 100);
  document.getElementById('hud-xp-fill').style.width = `${percentage}%`;

  // Cập nhật điểm cao kỷ lục game trên giao diện
  if (document.getElementById('game-highscore-text')) {
    document.getElementById('game-highscore-text').textContent = AppState.highScore;
  }
}

// Cộng điểm XP và xử lý Lên cấp
async function gainXP(amount) {
  AppState.xp += amount;
  
  // Kiểm tra lên cấp
  const xpNeeded = AppState.level * 100;
  if (AppState.xp >= xpNeeded) {
    AppState.xp -= xpNeeded;
    AppState.level += 1;
    // Hiệu ứng pháo hoa / thông báo chúc mừng lên cấp
    setTimeout(() => {
      alert(`🎉 CHÚC MỪNG! Em đã thăng lên Cấp độ ${AppState.level}! Keep going! 🚀`);
    }, 500);
  }
  
  updateHUD();
  await syncProgressToServer();
  if (window.checkAndUnlockAchievements) {
    window.checkAndUnlockAchievements();
  }
}

// Cộng sao tích lũy
async function gainStars(amount) {
  AppState.stars += amount;
  updateHUD();
  await syncProgressToServer();
}

// Đồng bộ điểm số lên MySQL qua API
async function syncProgressToServer() {
  if (!AppState.username) return;
  try {
    await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: AppState.username,
        xp: AppState.xp,
        stars: AppState.stars,
        level: AppState.level
      })
    });
  } catch (error) {
    console.warn('Không thể đồng bộ điểm với server:', error);
  }
}

// Tải danh sách bài học của một chương từ database
async function loadChapterLessons(chapterNum, updateHash = true) {
  const container = document.getElementById('lessons-container');
  container.innerHTML = '<div class="text-center subtitle">Đang tải danh sách bài học...</div>';
  
  const titles = {
    1: 'Chương I: SỐ TỰ NHIÊN',
    2: 'Chương II: SỐ NGUYÊN',
    3: 'Chương III: HÌNH HỌC TRỰC QUAN'
  };
  document.getElementById('chapter-title').textContent = titles[chapterNum] || `Chương ${chapterNum}`;

  if (updateHash) {
    window.location.hash = `#lessons?chapter=${chapterNum}`;
  }
  switchView('lesson-select-view', false);

  try {
    const res = await fetch(`/api/lessons?chapter=${chapterNum}`);
    if (!res.ok) throw new Error('Lỗi tải bài học');
    const lessons = await res.json();
    
    container.innerHTML = '';
    
    lessons.forEach(lesson => {
      const row = document.createElement('div');
      row.className = 'lesson-row';
      row.innerHTML = `
        <div class="lesson-info">
          <span class="lesson-num-badge">§${lesson.lesson_num}.</span>
          <h4>${lesson.title}</h4>
          <p>${lesson.description || ''}</p>
        </div>
        <button class="btn btn-primary btn-sm btn-start-lesson" data-id="${lesson.id}" data-title="§${lesson.lesson_num}. ${lesson.title}">
          Vào luyện tập <i data-lucide="play-circle" class="lucide-icon"></i>
        </button>
      `;
      container.appendChild(row);
    });
    if (window.lucide) {
      lucide.createIcons();
    }

    // Gắn sự kiện bắt đầu luyện tập
    document.querySelectorAll('.btn-start-lesson').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const title = e.currentTarget.getAttribute('data-title');
        window.location.hash = `#quiz?lessonId=${id}&title=${encodeURIComponent(title)}`;
      });
    });

  } catch (error) {
    console.error('Lỗi khi tải bài học:', error);
    container.innerHTML = '<div class="text-center text-danger">Có lỗi xảy ra khi tải bài học. Vui lòng kiểm tra kết nối MySQL.</div>';
  }
}

// Bộ tra cứu số nguyên tố cục bộ
function checkPrimeNumberLocal() {
  const inputEl = document.getElementById('prime-search-input');
  const resultEl = document.getElementById('prime-search-result');
  const val = parseInt(inputEl.value);

  if (isNaN(val) || val < 2 || val > 999) {
    resultEl.classList.remove('hidden');
    resultEl.innerHTML = '<span class="text-danger">Vui lòng nhập số tự nhiên hợp lệ từ 2 đến 999.</span>';
    return;
  }

  resultEl.classList.remove('hidden');
  
  // Thuật toán kiểm tra số nguyên tố
  let isPrime = true;
  let divisors = [];
  
  for (let i = 1; i <= val; i++) {
    if (val % i === 0) divisors.push(i);
  }

  if (divisors.length > 2) isPrime = false;

  if (isPrime) {
    resultEl.innerHTML = `
      <span class="text-success">🌟 Số <strong>${val}</strong> là SỐ NGUYÊN TỐ!</span><br>
      <p style="margin-top:0.4rem;font-size:0.8rem;color:var(--color-text-muted)">Nó chỉ chia hết cho 1 và chính nó (${divisors.join(', ')}).</p>
    `;
  } else {
    resultEl.innerHTML = `
      <span class="text-danger">❌ Số <strong>${val}</strong> là HỢP SỐ.</span><br>
      <p style="margin-top:0.4rem;font-size:0.8rem;color:var(--color-text-muted)">Nó chia hết cho các ước số: ${divisors.join(', ')} (nhiều hơn 2 ước).</p>
    `;
  }
}

// Tải từ điển thuật ngữ qua API
async function loadGlossary(keyword = '') {
  const container = document.getElementById('glossary-list-container');
  container.innerHTML = '<p class="text-center text-muted">Đang tìm kiếm thuật ngữ...</p>';

  try {
    let url = '/api/glossary';
    if (keyword) {
      url += `?term=${encodeURIComponent(keyword)}`;
    }
    const res = await fetch(url);
    if (!res.ok) throw new Error('Lỗi fetch từ điển');
    const terms = await res.json();
    
    container.innerHTML = '';
    
    if (terms.length === 0) {
      container.innerHTML = '<p class="text-center text-muted">Không tìm thấy thuật ngữ phù hợp.</p>';
      return;
    }

    terms.forEach(item => {
      const div = document.createElement('div');
      div.className = 'glossary-item';
      div.innerHTML = `
        <h5>${item.term}</h5>
        <p>${item.definition}</p>
      `;
      container.appendChild(div);
    });
  } catch (error) {
    console.error('Lỗi khi tải từ điển:', error);
    container.innerHTML = '<p class="text-center text-danger">Lỗi server khi kết nối cơ sở dữ liệu thuật ngữ.</p>';
  }
}

// Xuất các hàm dùng chung để các file JS khác gọi
window.switchView = switchView;
window.gainXP = gainXP;
window.gainStars = gainStars;
window.AppState = AppState;

// ==========================================================================
// ACHIEVEMENTS SYSTEM - DYNAMIC BADGES MANAGER & LOCKS CHECKER
// ==========================================================================
const AchievementsList = [
  {
    id: 'first_quiz',
    title: '🌌 Tân Binh Vũ Trụ',
    desc: 'Hoàn thành bài luyện tập trắc nghiệm đầu tiên.',
    icon: '🚀',
    check: () => {
      return localStorage.getItem('achievement_first_quiz') === 'true';
    }
  },
  {
    id: 'rocket_master',
    title: '☄️ Phi Công Siêu Đẳng',
    desc: 'Đạt trên 50 mét bay xa trong game Rocket Math.',
    icon: '🛰️',
    check: () => {
      return localStorage.getItem('achievement_rocket_master') === 'true' || 
             (window.AppState && window.AppState.highScore >= 50);
    }
  },
  {
    id: 'geometry_expert',
    title: '📐 Kỹ Sư Hình Học',
    desc: 'Hoàn thành tất cả bài thực hành vẽ hình phẳng (Geogebra).',
    icon: '🎨',
    check: () => {
      return localStorage.getItem('achievement_geometry_expert') === 'true';
    }
  },
  {
    id: 'scratch_master',
    title: '✏️ Họa Sĩ Toán Học',
    desc: 'Sử dụng bảng nháp vẽ tay tính toán tối thiểu 5 lần.',
    icon: '🖌️',
    check: () => {
      const count = parseInt(localStorage.getItem('user_scratch_count') || '0');
      return count >= 5;
    }
  },
  {
    id: 'designer_formula',
    title: '🏗️ Kỹ Sư Thiết Kế',
    desc: 'Tương tác thử nghiệm tất cả 5 loại hình học phẳng.',
    icon: '🏢',
    check: () => {
      const viewedList = JSON.parse(localStorage.getItem('viewed_shapes_list') || '[]');
      return viewedList.length === 5;
    }
  },
  {
    id: 'scholars_level',
    title: '👑 Nhà Bác Học Nhí',
    desc: 'Đạt Cấp độ học tập tối thiểu Cấp 10.',
    icon: '🦉',
    check: () => {
      return window.AppState && window.AppState.level >= 10;
    }
  }
];

// Khởi chạy
document.addEventListener('DOMContentLoaded', () => {
  renderAchievements();
});

// Render danh sách huy hiệu lấp lánh lên view
function renderAchievements() {
  const container = document.getElementById('badges-container');
  if (!container) return;

  container.innerHTML = '';

  AchievementsList.forEach(badge => {
    const isUnlocked = badge.check();
    const unlockKey = `unlocked_time_${badge.id}`;
    
    // Nếu vừa được mở khóa, lưu thời gian mở khóa
    if (isUnlocked && !localStorage.getItem(unlockKey)) {
      localStorage.setItem(unlockKey, new Date().toLocaleDateString('vi-VN'));
    }

    const card = document.createElement('div');
    card.className = `badge-card ${isUnlocked ? 'unlocked' : 'locked'}`;
    
    const unlockTimeText = isUnlocked 
      ? `<p class="badge-date">Mở khóa: ${localStorage.getItem(unlockKey) || 'Hôm nay'}</p>`
      : '';

    card.innerHTML = `
      <div class="badge-icon">${badge.icon}</div>
      <div class="badge-details">
        <h4>${badge.title}</h4>
        <p>${badge.desc}</p>
        ${unlockTimeText}
      </div>
    `;
    container.appendChild(card);
  });
}

// Hàm kiểm tra và cập nhật huy hiệu
function checkAndUnlockAchievements() {
  renderAchievements();
}

window.checkAndUnlockAchievements = checkAndUnlockAchievements;

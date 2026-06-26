// ==========================================================================
// GEOMETRY DRAWING GRID (MINI GEOGEBRA TASK SOLVER)
// ==========================================================================
let geoCanvas, geoCtx;
let geoPoints = [];
let isGeoCompleted = false;
let currentTaskIndex = 0;

const GeoTasks = [
  {
    desc: 'Vẽ một **Hình vuông** có độ dài cạnh bằng 5 ô lưới.',
    validate: (pts) => {
      if (pts.length !== 4) return { success: false, msg: 'Hình vuông phải có đúng 4 đỉnh.' };
      // Tính độ dài các cạnh theo ô lưới (mỗi ô 20px)
      const d1 = getGridDist(pts[0], pts[1]);
      const d2 = getGridDist(pts[1], pts[2]);
      const d3 = getGridDist(pts[2], pts[3]);
      const d4 = getGridDist(pts[3], pts[0]);
      
      const diag1 = getGridDist(pts[0], pts[2]);
      const diag2 = getGridDist(pts[1], pts[3]);

      // Kiểm tra cạnh bằng 5 ô và 2 đường chéo bằng nhau (chống hình thoi lệch)
      const isSideOk = Math.abs(d1 - 5) < 0.2 && Math.abs(d2 - 5) < 0.2 && Math.abs(d3 - 5) < 0.2 && Math.abs(d4 - 5) < 0.2;
      const isDiagOk = Math.abs(diag1 - diag2) < 0.2;

      if (isSideOk && isDiagOk) {
        return { success: true, msg: 'Tuyệt vời! Em đã vẽ chính xác hình vuông có cạnh bằng 5 ô.' };
      }
      return { success: false, msg: 'Cạnh vẽ chưa đúng 5 ô lưới hoặc các cạnh không vuông góc với nhau.' };
    }
  },
  {
    desc: 'Vẽ một **Hình chữ nhật** có chiều dài bằng 6 ô và chiều rộng bằng 4 ô.',
    validate: (pts) => {
      if (pts.length !== 4) return { success: false, msg: 'Hình chữ nhật phải có đúng 4 đỉnh.' };
      const d1 = getGridDist(pts[0], pts[1]);
      const d2 = getGridDist(pts[1], pts[2]);
      const d3 = getGridDist(pts[2], pts[3]);
      const d4 = getGridDist(pts[3], pts[0]);
      
      const diag1 = getGridDist(pts[0], pts[2]);
      const diag2 = getGridDist(pts[1], pts[3]);

      // Kiểm tra các cạnh đối diện và đường chéo bằng nhau
      const sides = [d1, d2, d3, d4].sort((x, y) => x - y);
      const isLengthOk = Math.abs(sides[2] - 6) < 0.2 && Math.abs(sides[3] - 6) < 0.2;
      const isWidthOk = Math.abs(sides[0] - 4) < 0.2 && Math.abs(sides[1] - 4) < 0.2;
      const isDiagOk = Math.abs(diag1 - diag2) < 0.2;

      if (isLengthOk && isWidthOk && isDiagOk) {
        return { success: true, msg: 'Chính xác! Em đã dựng thành công hình chữ nhật 6x4.' };
      }
      return { success: false, msg: 'Hình vẽ chưa đúng số ô dài 6, rộng 4 hoặc chưa vuông góc.' };
    }
  },
  {
    desc: 'Vẽ một **Hình thoi** có đường chéo dài 8 ô và đường chéo ngắn 6 ô.',
    validate: (pts) => {
      if (pts.length !== 4) return { success: false, msg: 'Hình thoi phải có đúng 4 đỉnh.' };
      const d1 = getGridDist(pts[0], pts[1]);
      const d2 = getGridDist(pts[1], pts[2]);
      const d3 = getGridDist(pts[2], pts[3]);
      const d4 = getGridDist(pts[3], pts[0]);
      
      const diag1 = getGridDist(pts[0], pts[2]);
      const diag2 = getGridDist(pts[1], pts[3]);

      // Kiểm tra 4 cạnh bằng nhau và độ dài đường chéo bằng 8 và 6
      const isSidesEqual = Math.abs(d1 - d2) < 0.2 && Math.abs(d2 - d3) < 0.2 && Math.abs(d3 - d4) < 0.2;
      const diags = [diag1, diag2].sort((x, y) => x - y);
      const isDiagOk = Math.abs(diags[0] - 6) < 0.2 && Math.abs(diags[1] - 8) < 0.2;

      if (isSidesEqual && isDiagOk) {
        return { success: true, msg: 'Quá siêu! Em đã vẽ chính xác hình thoi đường chéo 8 và 6.' };
      }
      return { success: false, msg: 'Hình vẽ chưa đạt điều kiện đường chéo dài 8 ô và ngắn 6 ô.' };
    }
  }
];

function initGeogebra() {
  initGeogebraEvents();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGeogebra);
} else {
  initGeogebra();
}

function initGeogebraEvents() {
  geoCanvas = document.getElementById('geogebra-canvas');
  if (!geoCanvas) return;
  geoCtx = geoCanvas.getContext('2d');

  geoCanvas.addEventListener('click', handleGridClick);
  document.getElementById('btn-clear-geogebra').addEventListener('click', resetGeogebraGrid);
  document.getElementById('btn-check-geogebra').addEventListener('click', checkGeogebraTask);
}

// Bắt đầu thực hành vẽ hình
function startGeogebraTask() {
  currentTaskIndex = 0;
  resetGeogebraGrid();
  loadGeogebraTask(0);
}

// Nạp thông tin nhiệm vụ vẽ hình
function loadGeogebraTask(index) {
  currentTaskIndex = index;
  const task = GeoTasks[index];
  document.getElementById('geogebra-task-desc').innerHTML = task.desc;
  document.getElementById('geogebra-feedback').textContent = '';
  document.getElementById('geogebra-feedback').className = 'feedback-text';
}

// Đặt lại lưới vẽ ô vuông
function resetGeogebraGrid() {
  geoPoints = [];
  isGeoCompleted = false;
  document.getElementById('geogebra-points-list').innerHTML = '<li>Chưa có điểm nào</li>';
  drawGeogebraGrid();
}

// Vẽ lưới tọa độ ô vuông
function drawGeogebraGrid() {
  if (!geoCtx || !geoCanvas) return;
  const w = geoCanvas.width;
  const h = geoCanvas.height;
  const cellSize = 20; // 20 pixel mỗi ô

  geoCtx.clearRect(0, 0, w, h);

  // Vẽ các đường lưới dọc và ngang màu mờ
  geoCtx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  geoCtx.lineWidth = 1;

  for (let x = 0; x <= w; x += cellSize) {
    geoCtx.beginPath();
    geoCtx.moveTo(x, 0);
    geoCtx.lineTo(x, h);
    geoCtx.stroke();
  }

  for (let y = 0; y <= h; y += cellSize) {
    geoCtx.beginPath();
    geoCtx.moveTo(0, y);
    geoCtx.lineTo(w, y);
    geoCtx.stroke();
  }

  // Vẽ hai trục tọa độ chính ở giữa mờ nhẹ
  geoCtx.strokeStyle = 'rgba(167, 139, 250, 0.2)';
  geoCtx.lineWidth = 2;
  
  geoCtx.beginPath();
  geoCtx.moveTo(w / 2, 0);
  geoCtx.lineTo(w / 2, h);
  geoCtx.stroke();

  geoCtx.beginPath();
  geoCtx.moveTo(0, h / 2);
  geoCtx.lineTo(w, h / 2);
  geoCtx.stroke();

  // Vẽ các điểm đã chấm
  geoPoints.forEach((pt, index) => {
    geoCtx.beginPath();
    geoCtx.arc(pt.x, pt.y, 5, 0, Math.PI * 2);
    geoCtx.fillStyle = '#00f0ff';
    geoCtx.fill();
    
    // Tên nhãn điểm A, B, C, D...
    geoCtx.fillStyle = '#ffffff';
    geoCtx.font = 'bold 12px Arial';
    const label = String.fromCharCode(65 + index); // 65 là mã ASCII của 'A'
    geoCtx.fillText(label, pt.x + 8, pt.y - 8);
  });

  // Vẽ đường nối các điểm
  if (geoPoints.length > 1) {
    geoCtx.beginPath();
    geoCtx.moveTo(geoPoints[0].x, geoPoints[0].y);
    for (let i = 1; i < geoPoints.length; i++) {
      geoCtx.lineTo(geoPoints[i].x, geoPoints[i].y);
    }
    
    if (isGeoCompleted) {
      geoCtx.closePath();
      geoCtx.fillStyle = 'rgba(0, 240, 255, 0.15)';
      geoCtx.fill();
    }
    
    geoCtx.strokeStyle = '#00f0ff';
    geoCtx.lineWidth = 2.5;
    geoCtx.stroke();
  }
}

// Xử lý khi click chuột lên lưới vẽ hình
function handleGridClick(e) {
  if (isGeoCompleted) return;

  const rect = geoCanvas.getBoundingClientRect();
  const rawX = e.clientX - rect.left;
  const rawY = e.clientY - rect.top;

  const cellSize = 20;
  
  // Snap tự động điểm click về giao lộ ô lưới gần nhất
  const snapX = Math.round(rawX / cellSize) * cellSize;
  const snapY = Math.round(rawY / cellSize) * cellSize;

  // Kiểm tra xem điểm này có trùng với điểm đã có trước đó không
  const isDuplicate = geoPoints.some(pt => pt.x === snapX && pt.y === snapY);
  if (isDuplicate) {
    // Nếu trùng điểm đầu tiên và có ít nhất 3 điểm -> Hoàn thành nối hình (khép kín đa giác)
    if (geoPoints.length >= 3 && snapX === geoPoints[0].x && snapY === geoPoints[0].y) {
      isGeoCompleted = true;
      drawGeogebraGrid();
      updatePointsLogUI();
    }
    return;
  }

  // Tối đa chỉ chấm 4 điểm đối với các hình thoi, vuông, chữ nhật
  if (geoPoints.length >= 4) {
    alert('Các nhiệm vụ hình phẳng này chỉ cần tối đa 4 đỉnh thôi em nhé!');
    return;
  }

  // Thêm điểm mới
  geoPoints.push({ x: snapX, y: snapY });
  drawGeogebraGrid();
  updatePointsLogUI();
}

// Hiển thị danh sách tọa độ các điểm đã chấm
function updatePointsLogUI() {
  const list = document.getElementById('geogebra-points-list');
  list.innerHTML = '';
  
  if (geoPoints.length === 0) {
    list.innerHTML = '<li>Chưa có điểm nào</li>';
    return;
  }

  geoPoints.forEach((pt, index) => {
    const label = String.fromCharCode(65 + index);
    // Tính tọa độ ô lưới từ trục tọa độ chính ở giữa làm tâm (0,0)
    const gridX = (pt.x - geoCanvas.width / 2) / 20;
    const gridY = -(pt.y - geoCanvas.height / 2) / 20; // Hướng lên trên là dương
    
    const li = document.createElement('li');
    li.innerHTML = `Đỉnh <strong>${label}</strong>: (${gridX}, ${gridY})`;
    list.appendChild(li);
  });

  if (isGeoCompleted) {
    const li = document.createElement('li');
    li.className = 'text-success';
    li.innerHTML = '<strong>Đã hoàn thành nối hình khép kín!</strong>';
    list.appendChild(li);
  }
}

// Tính khoảng cách ô lưới giữa hai điểm vẽ
function getGridDist(p1, p2) {
  const dx = (p1.x - p2.x) / 20;
  const dy = (p1.y - p2.y) / 20;
  return Math.sqrt(dx * dx + dy * dy);
}

// Xác nhận kiểm tra hình vẽ theo yêu cầu của nhiệm vụ
async function checkGeogebraTask() {
  const task = GeoTasks[currentTaskIndex];
  const fbEl = document.getElementById('geogebra-feedback');
  
  if (!isGeoCompleted) {
    fbEl.className = 'feedback-text text-danger';
    fbEl.textContent = 'Em phải nối các nét thành hình khép kín (nhấp trùng điểm đầu A để đóng hình) trước nhé!';
    return;
  }

  const result = task.validate(geoPoints);
  
  if (result.success) {
    fbEl.className = 'feedback-text text-success';
    fbEl.innerHTML = `🎉 ${result.msg}<br>Thưởng thêm +20 XP học tập!`;
    
    if (window.gainXP) {
      await window.gainXP(20);
    }

    // Chuyển sang bài tiếp theo nếu còn
    if (currentTaskIndex < GeoTasks.length - 1) {
      setTimeout(() => {
        alert('Chúc mừng! Hãy chuyển sang thử thách vẽ hình tiếp theo.');
        loadGeogebraTask(currentTaskIndex + 1);
        resetGeogebraGrid();
      }, 1500);
    } else {
      setTimeout(() => {
        alert('Xuất sắc! Em đã hoàn thành xuất sắc tất cả bài thực hành vẽ hình phẳng!');
        localStorage.setItem('achievement_geometry_expert', 'true');
        if (window.checkAndUnlockAchievements) {
          window.checkAndUnlockAchievements();
        }
        window.switchView('dashboard-view');
      }, 1500);
    }
  } else {
    fbEl.className = 'feedback-text text-danger';
    fbEl.textContent = result.msg;
  }
}

window.startGeogebraTask = startGeogebraTask;

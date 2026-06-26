// ==========================================================================
function initFormulas() {
  initFormulaViewEvents();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFormulas);
} else {
  initFormulas();
}

// Đăng ký sự kiện
function initFormulaViewEvents() {
  // Tabs chính Số học / Hình học
  document.querySelectorAll('.formula-tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.formula-tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.formula-panel').forEach(p => p.classList.remove('active'));
      
      e.target.classList.add('active');
      const cat = e.target.getAttribute('data-category');
      
      if (cat === 'arithmetic') {
        document.getElementById('formula-arithmetic').classList.add('active');
        drawArithmeticAxis();
      } else {
        document.getElementById('formula-geometry').classList.add('active');
        initGeometrySliders();
      }
    });
  });

  // Sliders Trục số số nguyên
  const numA = document.getElementById('num-a');
  const numB = document.getElementById('num-b');
  
  if (numA && numB) {
    numA.addEventListener('input', () => {
      document.getElementById('val-a').textContent = numA.value;
      updateArithmeticAxis();
    });
    numB.addEventListener('input', () => {
      document.getElementById('val-b').textContent = numB.value;
      updateArithmeticAxis();
    });
  }

  // Chọn hình học bên tab Hình học
  document.querySelectorAll('.geom-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.geom-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      const shape = e.target.getAttribute('data-shape');
      changeGeometryShape(shape);
    });
  });
}

// ==========================================================================
// 1. TRỤC SỐ TƯƠNG TÁC (SỐ NGUYÊN)
// ==========================================================================
function drawArithmeticAxis() {
  updateArithmeticAxis();
}

function updateArithmeticAxis() {
  const svg = document.getElementById('axis-svg');
  if (!svg) return;

  const a = parseInt(document.getElementById('num-a').value);
  const b = parseInt(document.getElementById('num-b').value);
  const result = a + b;

  // Cập nhật công thức text
  document.getElementById('eq-a').textContent = a;
  document.getElementById('eq-b').textContent = b;
  document.getElementById('eq-result').textContent = result;

  // Xóa hình cũ vẽ lại trục số
  svg.innerHTML = '';

  const width = 500;
  const height = 120;
  const centerY = 65;
  const zeroX = width / 2; // Điểm 0 nằm ở giữa
  const scale = 22; // 22 pixel cho mỗi đơn vị

  // Vẽ trục ngang chính
  const mainLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  mainLine.setAttribute('x1', '20');
  mainLine.setAttribute('y1', centerY);
  mainLine.setAttribute('x2', width - 20);
  mainLine.setAttribute('y2', centerY);
  mainLine.setAttribute('stroke', '#374151');
  mainLine.setAttribute('stroke-width', '3');
  svg.appendChild(mainLine);

  // Vẽ mũi tên ở cuối trục
  const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
  arrow.setAttribute('points', `${width - 20},${centerY - 5} ${width - 8},${centerY} ${width - 20},${centerY + 5}`);
  arrow.setAttribute('fill', '#374151');
  svg.appendChild(arrow);

  // Vẽ các khấc đơn vị từ -10 đến 10
  for (let i = -10; i <= 10; i++) {
    const x = zeroX + (i * scale);
    const tick = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    tick.setAttribute('x1', x);
    tick.setAttribute('y1', centerY - (i === 0 ? 8 : 4));
    tick.setAttribute('x2', x);
    tick.setAttribute('y2', centerY + (i === 0 ? 8 : 4));
    tick.setAttribute('stroke', i === 0 ? '#00f0ff' : '#4b5563');
    tick.setAttribute('stroke-width', i === 0 ? '2' : '1.5');
    svg.appendChild(tick);

    // Vẽ nhãn số
    if (i % 2 === 0 || i === 0) {
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', x);
      text.setAttribute('y', centerY + 22);
      text.setAttribute('fill', i === 0 ? '#00f0ff' : '#9ca3af');
      text.setAttribute('font-size', '11');
      text.setAttribute('font-family', 'Arial');
      text.setAttribute('text-anchor', 'middle');
      text.textContent = i;
      svg.appendChild(text);
    }
  }

  // Vẽ mũi tên biểu diễn số a (từ 0 đến a) bằng màu Đỏ/Hồng Neon
  if (a !== 0) {
    const startX = zeroX;
    const endX = zeroX + (a * scale);
    
    // Vẽ cung tên hoặc mũi tên thẳng phía trên trục số
    const arrowY = centerY - 18;
    const arrowA = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    arrowA.setAttribute('x1', startX);
    arrowA.setAttribute('y1', arrowY);
    arrowA.setAttribute('x2', endX);
    arrowA.setAttribute('y2', arrowY);
    arrowA.setAttribute('stroke', '#ff455f');
    arrowA.setAttribute('stroke-width', '2.5');
    arrowA.setAttribute('marker-end', 'url(#arrow-red)');
    svg.appendChild(arrowA);

    // Vẽ mũi tên chỉ hướng của a
    addSvgMarker(svg, 'arrow-red', '#ff455f');

    // Chèn text nhãn cho a
    const labelA = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    labelA.setAttribute('x', (startX + endX) / 2);
    labelA.setAttribute('y', arrowY - 6);
    labelA.setAttribute('fill', '#ff455f');
    labelA.setAttribute('font-size', '12');
    labelA.setAttribute('font-weight', 'bold');
    labelA.setAttribute('text-anchor', 'middle');
    labelA.textContent = `a = ${a}`;
    svg.appendChild(labelA);
  }

  // Vẽ mũi tên biểu diễn số b (từ a đến a+b) bằng màu Xanh Lá Neon
  if (b !== 0) {
    const startX = zeroX + (a * scale);
    const endX = zeroX + (result * scale);
    const arrowY = centerY - 38;

    const arrowB = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    arrowB.setAttribute('x1', startX);
    arrowB.setAttribute('y1', arrowY);
    arrowB.setAttribute('x2', endX);
    arrowB.setAttribute('y2', arrowY);
    arrowB.setAttribute('stroke', '#00ff88');
    arrowB.setAttribute('stroke-width', '2.5');
    svg.appendChild(arrowB);

    // Vẽ đầu mũi tên chỉ hướng cho b
    const arrowBHead = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    const points = b > 0 
      ? `${endX - 6},${arrowY - 4} ${endX},${arrowY} ${endX - 6},${arrowY + 4}`
      : `${endX + 6},${arrowY - 4} ${endX},${arrowY} ${endX + 6},${arrowY + 4}`;
    arrowBHead.setAttribute('points', points);
    arrowBHead.setAttribute('fill', '#00ff88');
    svg.appendChild(arrowBHead);

    // Chèn nhãn text cho b
    const labelB = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    labelB.setAttribute('x', (startX + endX) / 2);
    labelB.setAttribute('y', arrowY - 6);
    labelB.setAttribute('fill', '#00ff88');
    labelB.setAttribute('font-size', '12');
    labelB.setAttribute('font-weight', 'bold');
    labelB.setAttribute('text-anchor', 'middle');
    labelB.textContent = `b = ${b}`;
    svg.appendChild(labelB);

    // Vẽ đường nét đứt dọc từ điểm a đến điểm a+b phía trên
    const dashLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    dashLine.setAttribute('x1', startX);
    dashLine.setAttribute('y1', centerY);
    dashLine.setAttribute('x2', startX);
    dashLine.setAttribute('y2', arrowY);
    dashLine.setAttribute('stroke', '#4b5563');
    dashLine.setAttribute('stroke-width', '1');
    dashLine.setAttribute('stroke-dasharray', '2,2');
    svg.appendChild(dashLine);
  }

  // Vẽ chấm điểm Kết quả lớn màu Cyan phát sáng
  const resultCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  const resX = zeroX + (result * scale);
  resultCircle.setAttribute('cx', resX);
  resultCircle.setAttribute('cy', centerY);
  resultCircle.setAttribute('r', '7');
  resultCircle.setAttribute('fill', '#00f0ff');
  resultCircle.setAttribute('stroke', '#0b0f19');
  resultCircle.setAttribute('stroke-width', '1.5');
  resultCircle.setAttribute('filter', 'drop-shadow(0px 0px 6px #00f0ff)');
  svg.appendChild(resultCircle);
}

// Helper thêm marker định nghĩa đầu mũi tên
function addSvgMarker(svg, id, color) {
  let defs = svg.querySelector('defs');
  if (!defs) {
    defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    svg.appendChild(defs);
  }
  const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
  marker.setAttribute('id', id);
  marker.setAttribute('viewBox', '0 0 10 10');
  marker.setAttribute('refX', '8');
  marker.setAttribute('refY', '5');
  marker.setAttribute('markerWidth', '6');
  marker.setAttribute('markerHeight', '6');
  marker.setAttribute('orient', 'auto-start-reverse');
  
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M 0 1 L 10 5 L 0 9 z');
  path.setAttribute('fill', color);
  
  marker.appendChild(path);
  defs.appendChild(marker);
}


// ==========================================================================
// 2. HÌNH HỌC TƯƠNG TÁC (SLIDER SVG AREA)
// ==========================================================================
let currentShape = 'square';
const ShapeConfig = {
  square: {
    name: 'Hình vuông',
    formula: 'Chu vi: C = 4 × a <br> Diện tích: S = a²',
    sliders: [
      { id: 's-edge', label: 'Độ dài cạnh (a):', min: 2, max: 8, value: 5, unit: 'cm' }
    ]
  },
  rectangle: {
    name: 'Hình chữ nhật',
    formula: 'Chu vi: C = 2 × (a + b) <br> Diện tích: S = a × b',
    sliders: [
      { id: 's-width', label: 'Chiều dài (a):', min: 3, max: 9, value: 7, unit: 'cm' },
      { id: 's-height', label: 'Chiều rộng (b):', min: 2, max: 7, value: 4, unit: 'cm' }
    ]
  },
  rhombus: {
    name: 'Hình thoi',
    formula: 'Chu vi: C = 4 × a <br> Diện tích: S = ½ × m × n',
    sliders: [
      { id: 's-diag1', label: 'Đường chéo lớn (m):', min: 4, max: 10, value: 8, unit: 'cm' },
      { id: 's-diag2', label: 'Đường chéo nhỏ (n):', min: 2, max: 8, value: 6, unit: 'cm' },
      { id: 's-side', label: 'Cạnh bên (a):', min: 3, max: 7, value: 5, unit: 'cm' }
    ]
  },
  parallelogram: {
    name: 'Hình bình hành',
    formula: 'Chu vi: C = 2 × (a + b) <br> Diện tích: S = a × h',
    sliders: [
      { id: 's-base', label: 'Cạnh đáy (a):', min: 4, max: 9, value: 7, unit: 'cm' },
      { id: 's-side-b', label: 'Cạnh bên (b):', min: 3, max: 8, value: 5, unit: 'cm' },
      { id: 's-height-h', label: 'Chiều cao (h):', min: 2, max: 7, value: 4, unit: 'cm' }
    ]
  },
  trapezoid: {
    name: 'Hình thang cân',
    formula: 'Chu vi: C = a + b + 2 × c <br> Diện tích: S = ½ × (a + b) × h',
    sliders: [
      { id: 's-base-large', label: 'Đáy lớn (a):', min: 5, max: 10, value: 8, unit: 'cm' },
      { id: 's-base-small', label: 'Đáy nhỏ (b):', min: 2, max: 6, value: 4, unit: 'cm' },
      { id: 's-trap-side', label: 'Cạnh bên (c):', min: 3, max: 7, value: 4, unit: 'cm' },
      { id: 's-trap-height', label: 'Chiều cao (h):', min: 2, max: 6, value: 3, unit: 'cm' }
    ]
  }
};

// Khởi chạy slider hình học
function initGeometrySliders() {
  changeGeometryShape(currentShape);
}

// Thay đổi hình học và nạp slider tương ứng
function changeGeometryShape(shapeKey) {
  currentShape = shapeKey;
  const config = ShapeConfig[shapeKey];
  
  // Cập nhật tên và công thức tĩnh
  document.getElementById('geom-name').textContent = config.name;
  document.getElementById('geom-formula-text').innerHTML = config.formula;

  // Tạo các slider động
  const container = document.getElementById('geom-sliders-container');
  container.innerHTML = '';

  config.sliders.forEach(slider => {
    const group = document.createElement('div');
    group.className = 'control-group';
    group.innerHTML = `
      <label for="${slider.id}">${slider.label} <span id="val-${slider.id}" class="text-success">${slider.value} ${slider.unit}</span></label>
      <input type="range" id="${slider.id}" min="${slider.min}" max="${slider.max}" value="${slider.value}">
    `;
    container.appendChild(group);

    // Gắn sự kiện cập nhật hình khi kéo slider
    document.getElementById(slider.id).addEventListener('input', (e) => {
      document.getElementById(`val-${slider.id}`).textContent = `${e.target.value} ${slider.unit}`;
      updateGeometryVisual();
    });
  });

  // Vẽ hình lần đầu
  updateGeometryVisual();

  // Đánh dấu huy hiệu tương tác hình học
  let viewCount = parseInt(localStorage.getItem('view_shapes_count') || '0');
  let viewedList = JSON.parse(localStorage.getItem('viewed_shapes_list') || '[]');
  if (!viewedList.includes(shapeKey)) {
    viewedList.push(shapeKey);
    localStorage.setItem('viewed_shapes_list', JSON.stringify(viewedList));
  }
}

// Cập nhật SVG hình học và phép toán theo slider
function updateGeometryVisual() {
  const container = document.getElementById('geom-svg-container');
  if (!container) return;

  container.innerHTML = ''; // Clear SVG cũ

  // Kích thước khung vẽ
  const w = 220;
  const h = 180;
  const cX = w / 2;
  const cY = h / 2;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '180px');

  let pSteps = '';
  let pResult = '';

  if (currentShape === 'square') {
    const a = parseInt(document.getElementById('s-edge').value);
    const size = a * 15; // Tỉ lệ vẽ pixel

    // Vẽ hình vuông SVG
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', cX - (size / 2));
    rect.setAttribute('y', cY - (size / 2));
    rect.setAttribute('width', size);
    rect.setAttribute('height', size);
    rect.setAttribute('rx', '3');
    rect.setAttribute('fill', 'rgba(0, 255, 136, 0.1)');
    rect.setAttribute('stroke', '#00ff88');
    rect.setAttribute('stroke-width', '2.5');
    svg.appendChild(rect);

    // Ghi kích thước
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', cX);
    text.setAttribute('y', cY - (size / 2) - 8);
    text.setAttribute('fill', '#00ff88');
    text.setAttribute('font-size', '12');
    text.setAttribute('font-weight', 'bold');
    text.setAttribute('text-anchor', 'middle');
    text.textContent = `a = ${a} cm`;
    svg.appendChild(text);

    pSteps = `S = a² = ${a} × ${a}`;
    pResult = `${a * a} cm²`;

  } else if (currentShape === 'rectangle') {
    const a = parseInt(document.getElementById('s-width').value);
    const b = parseInt(document.getElementById('s-height').value);
    const sizeW = a * 15;
    const sizeH = b * 15;

    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', cX - (sizeW / 2));
    rect.setAttribute('y', cY - (sizeH / 2));
    rect.setAttribute('width', sizeW);
    rect.setAttribute('height', sizeH);
    rect.setAttribute('rx', '3');
    rect.setAttribute('fill', 'rgba(167, 139, 250, 0.1)');
    rect.setAttribute('stroke', '#a78bfa');
    rect.setAttribute('stroke-width', '2.5');
    svg.appendChild(rect);

    // Kích thước chiều dài
    const textW = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textW.setAttribute('x', cX);
    textW.setAttribute('y', cY - (sizeH / 2) - 8);
    textW.setAttribute('fill', '#a78bfa');
    textW.setAttribute('font-size', '12');
    textW.setAttribute('font-weight', 'bold');
    textW.setAttribute('text-anchor', 'middle');
    textW.textContent = `a = ${a} cm`;
    svg.appendChild(textW);

    // Kích thước chiều rộng
    const textH = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textH.setAttribute('x', cX + (sizeW / 2) + 8);
    textH.setAttribute('y', cY + 4);
    textH.setAttribute('fill', '#a78bfa');
    textH.setAttribute('font-size', '12');
    textH.setAttribute('font-weight', 'bold');
    textH.setAttribute('text-anchor', 'start');
    textH.textContent = `b = ${b} cm`;
    svg.appendChild(textH);

    pSteps = `S = a × b = ${a} × ${b}`;
    pResult = `${a * b} cm²`;

  } else if (currentShape === 'rhombus') {
    const m = parseInt(document.getElementById('s-diag1').value);
    const n = parseInt(document.getElementById('s-diag2').value);
    const a = parseInt(document.getElementById('s-side').value);
    const dx = m * 14;
    const dy = n * 14;

    // Các đỉnh
    const p1 = `${cX},${cY - (dy/2)}`; // Đỉnh trên
    const p2 = `${cX + (dx/2)},${cY}`; // Đỉnh phải
    const p3 = `${cX},${cY + (dy/2)}`; // Đỉnh dưới
    const p4 = `${cX - (dx/2)},${cY}`; // Đỉnh trái

    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    polygon.setAttribute('points', `${p1} ${p2} ${p3} ${p4}`);
    polygon.setAttribute('fill', 'rgba(255, 184, 0, 0.1)');
    polygon.setAttribute('stroke', '#ffb800');
    polygon.setAttribute('stroke-width', '2.5');
    svg.appendChild(polygon);

    // Vẽ nét đứt đường chéo
    const d1Line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    d1Line.setAttribute('x1', cX - (dx/2)); d1Line.setAttribute('y1', cY);
    d1Line.setAttribute('x2', cX + (dx/2)); d1Line.setAttribute('y2', cY);
    d1Line.setAttribute('stroke', '#00f0ff'); d1Line.setAttribute('stroke-dasharray', '2,2');
    svg.appendChild(d1Line);

    const d2Line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    d2Line.setAttribute('x1', cX); d2Line.setAttribute('y1', cY - (dy/2));
    d2Line.setAttribute('x2', cX); d2Line.setAttribute('y2', cY + (dy/2));
    d2Line.setAttribute('stroke', '#00f0ff'); d2Line.setAttribute('stroke-dasharray', '2,2');
    svg.appendChild(d2Line);

    // Nhãn đường chéo
    const textD1 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textD1.setAttribute('x', cX + 12); textD1.setAttribute('y', cY - 8);
    textD1.setAttribute('fill', '#00f0ff'); textD1.setAttribute('font-size', '10');
    textD1.textContent = `m = ${m}`;
    svg.appendChild(textD1);

    const textD2 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textD2.setAttribute('x', cX - 25); textD2.setAttribute('y', cY + 16);
    textD2.setAttribute('fill', '#00f0ff'); textD2.setAttribute('font-size', '10');
    textD2.textContent = `n = ${n}`;
    svg.appendChild(textD2);

    pSteps = `S = ½ × m × n = ½ × ${m} × ${n}`;
    pResult = `${0.5 * m * n} cm²`;

  } else if (currentShape === 'parallelogram') {
    const a = parseInt(document.getElementById('s-base').value);
    const b = parseInt(document.getElementById('s-side-b').value);
    const hVal = parseInt(document.getElementById('s-height-h').value);

    const baseW = a * 15;
    const sideW = b * 8; // Nghiêng lệch đi
    const heightH = hVal * 15;

    // Đỉnh vẽ
    const x1 = cX - (baseW / 2) + (sideW / 2);
    const y1 = cY - (heightH / 2);
    
    const x2 = x1 + baseW;
    const y2 = y1;

    const x4 = cX - (baseW / 2) - (sideW / 2);
    const y4 = cY + (heightH / 2);

    const x3 = x4 + baseW;
    const y3 = y4;

    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    polygon.setAttribute('points', `${x1},${y1} ${x2},${y2} ${x3},${y3} ${x4},${y4}`);
    polygon.setAttribute('fill', 'rgba(251, 146, 60, 0.1)');
    polygon.setAttribute('stroke', '#fb923c');
    polygon.setAttribute('stroke-width', '2.5');
    svg.appendChild(polygon);

    // Vẽ chiều cao h
    const hLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    hLine.setAttribute('x1', x1); hLine.setAttribute('y1', y1);
    hLine.setAttribute('x2', x1); hLine.setAttribute('y2', y4);
    hLine.setAttribute('stroke', '#ff455f'); hLine.setAttribute('stroke-dasharray', '3,3');
    svg.appendChild(hLine);

    // Nhãn chiều cao h
    const textH = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textH.setAttribute('x', x1 - 10); textH.setAttribute('y', cY);
    textH.setAttribute('fill', '#ff455f'); textH.setAttribute('font-size', '11');
    textH.setAttribute('text-anchor', 'end');
    textH.textContent = `h = ${hVal}`;
    svg.appendChild(textH);

    // Nhãn cạnh đáy a
    const textA = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textA.setAttribute('x', cX); textA.setAttribute('y', y4 + 14);
    textA.setAttribute('fill', '#fb923c'); textA.setAttribute('font-size', '12');
    textA.setAttribute('text-anchor', 'middle');
    textA.textContent = `a = ${a} cm`;
    svg.appendChild(textA);

    pSteps = `S = a × h = ${a} × ${hVal}`;
    pResult = `${a * hVal} cm²`;

  } else if (currentShape === 'trapezoid') {
    const a = parseInt(document.getElementById('s-base-large').value);
    const b = parseInt(document.getElementById('s-base-small').value);
    const c = parseInt(document.getElementById('s-trap-side').value);
    const hVal = parseInt(document.getElementById('s-trap-height').value);

    const bottomW = a * 15;
    const topW = b * 15;
    const heightH = hVal * 15;

    const x1 = cX - (topW / 2);
    const y1 = cY - (heightH / 2);

    const x2 = cX + (topW / 2);
    const y2 = y1;

    const x4 = cX - (bottomW / 2);
    const y4 = cY + (heightH / 2);

    const x3 = cX + (bottomW / 2);
    const y3 = y4;

    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    polygon.setAttribute('points', `${x1},${y1} ${x2},${y2} ${x3},${y3} ${x4},${y4}`);
    polygon.setAttribute('fill', 'rgba(56, 189, 248, 0.1)');
    polygon.setAttribute('stroke', '#38bdf8');
    polygon.setAttribute('stroke-width', '2.5');
    svg.appendChild(polygon);

    // Vẽ chiều cao h
    const hLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    hLine.setAttribute('x1', x1); hLine.setAttribute('y1', y1);
    hLine.setAttribute('x2', x1); hLine.setAttribute('y2', y4);
    hLine.setAttribute('stroke', '#ff455f'); hLine.setAttribute('stroke-dasharray', '3,3');
    svg.appendChild(hLine);

    // Nhãn h
    const textH = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textH.setAttribute('x', x1 - 8); textH.setAttribute('y', cY);
    textH.setAttribute('fill', '#ff455f'); textH.setAttribute('font-size', '10');
    textH.textContent = `h = ${hVal}`;
    svg.appendChild(textH);

    // Nhãn b (đáy nhỏ)
    const textB = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textB.setAttribute('x', cX); textB.setAttribute('y', y1 - 8);
    textB.setAttribute('fill', '#38bdf8'); textB.setAttribute('font-size', '11');
    textB.setAttribute('text-anchor', 'middle');
    textB.textContent = `b = ${b}`;
    svg.appendChild(textB);

    // Nhãn a (đáy lớn)
    const textA = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textA.setAttribute('x', cX); textA.setAttribute('y', y4 + 14);
    textA.setAttribute('fill', '#38bdf8'); textA.setAttribute('font-size', '11');
    textA.setAttribute('text-anchor', 'middle');
    textA.textContent = `a = ${a}`;
    svg.appendChild(textA);

    pSteps = `S = ½ × (a + b) × h = ½ × (${a} + ${b}) × ${hVal}`;
    pResult = `${0.5 * (a + b) * hVal} cm²`;
  }

  // Kết xuất SVG vẽ lên view
  container.appendChild(svg);

  // Cập nhật kết quả tính toán lên view
  document.getElementById('geom-calc-steps').textContent = pSteps;
  document.getElementById('geom-result-val').textContent = pResult;
}

// Xuất các hàm để file app.js gọi khi đổi trang
window.drawArithmeticAxis = drawArithmeticAxis;
window.initGeometrySliders = initGeometrySliders;

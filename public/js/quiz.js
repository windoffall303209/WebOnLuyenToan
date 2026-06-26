// ==========================================================================
// QUIZ SYSTEM, CANVAS DRAWING & INTERACTIVE AI DIALOGUE MANAGER
// ==========================================================================
let quizQuestions = [];
let currentQuestionIndex = 0;
let answeredCount = 0;
let correctCount = 0;
let currentQuestion = null;
let currentQuizScoreXP = 0;
let chatHistory = [];

// Trạng thái Canvas Scratchpad
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let drawColor = '#00f0ff'; // Neon Cyan mặc định
let canvas, ctx;

// Khởi tạo các sự kiện khi load trang
function initQuiz() {
  initQuizElements();
  initCanvasScratchpad();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initQuiz);
} else {
  initQuiz();
}

// Gắn sự kiện các nút trong Quiz
function initQuizElements() {
  // Thoát luyện tập
  document.querySelector('.btn-quit-quiz').addEventListener('click', () => {
    if (confirm('Em có chắc chắn muốn thoát lượt luyện tập này không? Tiến trình bài học sẽ không được lưu.')) {
      window.switchView('dashboard-view');
    }
  });

  // Chuyển đổi qua lại giữa Bảng nháp và Trợ lý AI
  document.getElementById('tab-btn-scratch').addEventListener('click', () => {
    switchSidebarTab('scratch');
  });
  document.getElementById('tab-btn-ai').addEventListener('click', () => {
    const btn = document.getElementById('tab-btn-ai');
    if (!btn.disabled) {
      switchSidebarTab('ai');
    }
  });

  // Bấm nộp bài (áp dụng cho câu hỏi điền số)
  document.getElementById('btn-submit-answer').addEventListener('click', submitFillAnswer);

  // Câu tiếp theo
  document.getElementById('btn-next-question').addEventListener('click', goToNextQuestion);

  // Gửi tin nhắn giải thích lên Chatbot AI
  document.getElementById('chat-form').addEventListener('submit', handleAIChatSubmit);
}

// Chuyển đổi tab sidebar (Vẽ nháp / Chat AI)
function switchSidebarTab(tabName) {
  document.querySelectorAll('.sidebar-tabs .tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.sidebar-panel').forEach(panel => panel.classList.remove('active'));

  if (tabName === 'scratch') {
    document.getElementById('tab-btn-scratch').classList.add('active');
    document.getElementById('scratch-panel').classList.add('active');
  } else if (tabName === 'ai') {
    document.getElementById('tab-btn-ai').classList.add('active');
    document.getElementById('ai-panel').classList.add('active');
  }
}

// Bắt đầu một lượt luyện tập mới
async function startQuiz(lessonId, lessonTitle, updateHash = true) {
  currentQuestionIndex = 0;
  answeredCount = 0;
  correctCount = 0;
  currentQuizScoreXP = 0;
  quizQuestions = [];

  document.getElementById('quiz-lesson-title').textContent = lessonTitle;
  
  // Tải câu hỏi từ database MySQL qua API
  try {
    const res = await fetch(`/api/questions?lessonId=${lessonId}`);
    if (!res.ok) throw new Error('Không thể lấy câu hỏi');
    quizQuestions = await res.json();
    
    if (quizQuestions.length === 0) {
      alert('Bài học này hiện chưa có câu hỏi luyện tập. Thầy cô đang soạn thảo!');
      return;
    }

    if (updateHash) {
      window.location.hash = `#quiz?lessonId=${lessonId}&title=${encodeURIComponent(lessonTitle)}`;
    }

    // Chuyển sang View Luyện tập
    window.switchView('quiz-view', false);
    showQuestion(0);
    clearScratchpad(); // Xóa sạch bảng nháp cho câu hỏi mới
    if (window.lucide) {
      lucide.createIcons();
    }
  } catch (error) {
    console.error('Lỗi khởi chạy luyện tập:', error);
    alert('Không thể kết nối CSDL để lấy câu hỏi. Vui lòng kiểm tra MySQL server.');
  }
}

// Hiển thị câu hỏi theo index
function showQuestion(index) {
  currentQuestionIndex = index;
  currentQuestion = quizQuestions[index];
  
  // Cập nhật thanh tiến trình câu hỏi
  document.getElementById('quiz-progress-text').textContent = `Câu ${index + 1} / ${quizQuestions.length}`;
  
  // Reset trạng thái hiển thị
  document.getElementById('explanation-box').classList.add('hidden');
  document.getElementById('btn-submit-answer').classList.add('hidden');
  document.getElementById('quiz-footer-actions').classList.add('hidden');
  
  // Thiết lập đề bài
  document.getElementById('question-text').innerHTML = currentQuestion.question_text;
  
  // Xử lý ảnh minh họa / SVG
  const imgContainer = document.getElementById('question-illustration');
  if (currentQuestion.image_url) {
    imgContainer.classList.remove('hidden');
    imgContainer.innerHTML = `<img src="${currentQuestion.image_url}" alt="Minh họa câu hỏi" style="max-width:100%; max-height:220px; object-fit:contain;">`;
  } else {
    imgContainer.classList.add('hidden');
    imgContainer.innerHTML = '';
  }

  // Khởi tạo khu vực đáp án
  const inputsContainer = document.getElementById('answer-inputs-container');
  inputsContainer.innerHTML = '';

  if (currentQuestion.question_type === 'choice') {
    // Trắc nghiệm
    let choices = currentQuestion.options;
    if (typeof choices === 'string') {
      choices = JSON.parse(choices);
    }
    const choicesGrid = document.createElement('div');
    choicesGrid.className = 'choices-grid';
    
    choices.forEach((choice) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.textContent = choice;
      btn.addEventListener('click', () => selectChoice(btn, choice));
      choicesGrid.appendChild(btn);
    });
    inputsContainer.appendChild(choicesGrid);
  } else {
    // Điền khuyết
    const fillBox = document.createElement('div');
    fillBox.className = 'fill-input-box';
    fillBox.innerHTML = `
      <input type="text" id="input-fill-answer" placeholder="Nhập đáp án của em tại đây (số hoặc chữ)..." autocomplete="off">
    `;
    inputsContainer.appendChild(fillBox);
    document.getElementById('btn-submit-answer').classList.remove('hidden');
    
    // Gắn sự kiện Enter cho input điền khuyết
    document.getElementById('input-fill-answer').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') submitFillAnswer();
    });
  }

  // Khóa tab Chatbot AI (học sinh phải chọn đáp án trước mới được chat)
  const aiTabBtn = document.getElementById('tab-btn-ai');
  aiTabBtn.disabled = true;
  aiTabBtn.classList.add('disabled');
  switchSidebarTab('scratch'); // Mặc định mở Bảng vẽ nháp trước
  
  // Khởi chạy lại hộp chat
  resetAIChatBox();
}

// Xử lý khi chọn một phương án trắc nghiệm
async function selectChoice(buttonEl, selectedValue) {
  // Vô hiệu hóa tất cả các nút trắc nghiệm khác để chống bấm lại
  document.querySelectorAll('.choice-btn').forEach(btn => {
    btn.disabled = true;
    if (btn === buttonEl) {
      btn.classList.add('selected');
    }
  });

  await evaluateAnswer(selectedValue);
}

// Xử lý nộp bài cho câu hỏi điền số
async function submitFillAnswer() {
  const inputEl = document.getElementById('input-fill-answer');
  if (!inputEl || inputEl.disabled) return;

  const value = inputEl.value.trim();
  if (!value) {
    alert('Vui lòng nhập đáp án trước khi nộp bài làm nhé!');
    return;
  }

  inputEl.disabled = true;
  document.getElementById('btn-submit-answer').classList.add('hidden');

  await evaluateAnswer(value);
}

// Chấm điểm và hiển thị kết quả bài làm thông qua Express API
async function evaluateAnswer(userAnswer) {
  try {
    const res = await fetch('/api/check-answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        questionId: currentQuestion.id,
        userAnswer: userAnswer
      })
    });
    
    if (!res.ok) throw new Error('Không thể đối chiếu đáp án');
    const result = await res.json();
    
    // Hiển thị Lời giải chi tiết
    document.getElementById('explanation-content').innerHTML = result.explanation;
    document.getElementById('explanation-box').classList.remove('hidden');

    // Tô màu đỏ/xanh cho giao diện
    const isCorrect = result.correct;
    if (isCorrect) {
      correctCount++;
      gainQuizXP(10); // Cộng 10 XP
      
      // Tô xanh đáp án trắc nghiệm hoặc ô nhập
      if (currentQuestion.question_type === 'choice') {
        const selectedBtn = document.querySelector('.choice-btn.selected');
        if (selectedBtn) selectedBtn.classList.add('correct-highlight');
      } else {
        const inputEl = document.getElementById('input-fill-answer');
        if (inputEl) inputEl.classList.add('correct-highlight');
      }
    } else {
      // Tô đỏ đáp án sai và tô xanh đáp án đúng của hệ thống
      if (currentQuestion.question_type === 'choice') {
        const selectedBtn = document.querySelector('.choice-btn.selected');
        if (selectedBtn) selectedBtn.classList.add('error-highlight');
        
        // Tìm và tô xanh đáp án đúng thực tế
        document.querySelectorAll('.choice-btn').forEach(btn => {
          if (btn.textContent === result.correct_answer) {
            btn.classList.add('correct-highlight');
          }
        });
      } else {
        const inputEl = document.getElementById('input-fill-answer');
        if (inputEl) {
          inputEl.classList.add('error-highlight');
          // Chèn thêm nhãn đáp án đúng
          const hint = document.createElement('div');
          hint.className = 'mt-4 text-success';
          hint.innerHTML = `Đáp án đúng là: <strong>${result.correct_answer}</strong>`;
          inputEl.parentNode.appendChild(hint);
        }
      }
    }

    // Kích hoạt Trợ lý AI chất vấn
    activateAITeacherChat(userAnswer, isCorrect);
    
    // Hiển thị nút "Câu tiếp theo" ngay lập tức mà không chặn học sinh
    document.getElementById('quiz-footer-actions').classList.remove('hidden');
    
  } catch (error) {
    console.error('Lỗi khi chấm điểm câu hỏi:', error);
    alert('Lỗi khi chấm điểm câu hỏi. Hãy tiếp tục qua câu tiếp theo.');
    document.getElementById('quiz-footer-actions').classList.remove('hidden');
  }
}

// Lưu tạm điểm XP kiếm được trong lượt chơi
function gainQuizXP(amount) {
  currentQuizScoreXP += amount;
}

// Kích hoạt Tab Chatbot AI và gửi câu hỏi chất vấn đầu tiên
function activateAITeacherChat(userAnswer, isCorrect) {
  const aiTabBtn = document.getElementById('tab-btn-ai');
  aiTabBtn.disabled = false;
  aiTabBtn.classList.remove('disabled');
  
  // Tự động chuyển học sinh sang Tab AI
  switchSidebarTab('ai');

  // Đổ tin nhắn chất vấn của Thầy Vũ Trụ vào hộp chat
  const chatMessages = document.getElementById('chat-messages-container');
  chatMessages.innerHTML = ''; // Clear tin nhắn mẫu ban đầu

  let introMessage = '';
  if (isCorrect) {
    introMessage = `Chào em! Thầy thấy em đã chọn đáp án ĐÚNG là <strong>"${userAnswer}"</strong>. Tuyệt lắm! <br>Nhưng để chắc chắn em tự làm mà không "khoanh lụi", em hãy giải thích ngắn gọn cách tính hoặc lập luận của em tại sao ra kết quả này nhé! 😉`;
  } else {
    introMessage = `Chào em! Đáp án em chọn là <strong>"${userAnswer}"</strong> tiếc là chưa chính xác. <br>Đừng nản nhé! Em có thể giải thích cách em lập luận khi chọn đáp án đó để Thầy chỉ ra điểm nhầm lẫn cho em không?`;
  }

  appendChatMessage('ai', introMessage);
  
  // Khởi tạo lịch sử chat cho Gemini
  chatHistory = [
    { role: 'ai', text: introMessage }
  ];
  
  // Hiển thị khung nhập tin nhắn của học sinh
  document.getElementById('chat-input-form-container').classList.remove('hidden');
  
  // Gán tạm đáp án học sinh đã chọn làm biến toàn cục để gửi API sau
  AppState.lastUserAnswer = userAnswer;
}

// Đặt lại hộp chat AI khi sang câu mới
function resetAIChatBox() {
  document.getElementById('chat-messages-container').innerHTML = `
    <div class="message system">
      Trả lời câu hỏi bên trái để khởi chạy trợ lý AI kiểm tra tư duy!
    </div>
  `;
  document.getElementById('chat-input-form-container').classList.add('hidden');
  document.getElementById('chat-input').value = '';
  chatHistory = [];
}

// Gửi tin nhắn giải thích lên server
async function handleAIChatSubmit(e) {
  e.preventDefault();
  const inputEl = document.getElementById('chat-input');
  const text = inputEl.value.trim();
  if (!text) return;

  // Render tin nhắn của học sinh lên hộp thoại
  appendChatMessage('student', text);
  
  // Lưu lịch sử chat
  chatHistory.push({ role: 'user', text: text });
  
  inputEl.value = '';
  inputEl.disabled = true;

  // Render tin nhắn chờ của AI
  const typingId = appendChatMessage('ai', 'Thầy đang đọc câu trả lời của em...');

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        questionId: currentQuestion.id,
        userAnswer: AppState.lastUserAnswer,
        studentExplanation: text,
        history: chatHistory
      })
    });

    if (!res.ok) throw new Error('Lỗi hội thoại AI');
    const data = await res.json();

    // Xóa tin nhắn chờ và hiển thị câu trả lời thực tế của AI
    const typingEl = document.getElementById(typingId);
    if (typingEl) typingEl.remove();

    appendChatMessage('ai', data.reply);
    
    // Lưu phản hồi của AI vào lịch sử chat
    chatHistory.push({ role: 'ai', text: data.reply });

    // Thưởng thêm 5 XP nếu giải thích trung thực và đúng đắn (không khoanh lụi)
    if (!data.isGuessing && data.isCorrect) {
      gainQuizXP(5);
      appendChatMessage('system', '🎉 Bạn được thưởng thêm +5 XP vì lập luận xuất sắc!');
    }

    // Cho phép học sinh tiếp tục chat
    inputEl.disabled = false;
    inputEl.focus();

    // Mở rộng thành tích vẽ nháp nếu học sinh dùng canvas vẽ hình học
    if (window.checkAndUnlockAchievements) {
      window.checkAndUnlockAchievements();
    }
  } catch (error) {
    console.error('Lỗi khi gửi giải thích cho AI:', error);
    // Thay thế tin nhắn chờ bằng thông báo lỗi
    const typingEl = document.getElementById(typingId);
    if (typingEl) typingEl.innerHTML = '<span class="text-danger">Kết nối AI bị gián đoạn.</span>';
    
    inputEl.disabled = false;
    inputEl.focus();
  }
}

// Thêm tin nhắn vào hộp thoại chat
function appendChatMessage(sender, text) {
  const container = document.getElementById('chat-messages-container');
  const div = document.createElement('div');
  const uniqueId = 'msg-' + Math.random().toString(36).substr(2, 9);
  div.id = uniqueId;
  div.className = `message ${sender}`;
  div.innerHTML = text;
  container.appendChild(div);
  
  // Tự động cuộn xuống cuối hộp chat
  container.scrollTop = container.scrollHeight;
  return uniqueId;
}

// Đi tiếp tới câu hỏi kế tiếp
function goToNextQuestion() {
  const nextIndex = currentQuestionIndex + 1;
  if (nextIndex < quizQuestions.length) {
    showQuestion(nextIndex);
    clearScratchpad(); // Xóa nháp của câu cũ
  } else {
    // Kết thúc lượt Quiz
    finishQuiz();
  }
}

// Kết thúc luyện tập và tổng kết điểm số
async function finishQuiz() {
  const starsEarned = Math.round(correctCount / 2); // Cứ đúng 2 câu được 1 sao
  const finalXP = currentQuizScoreXP;

  alert(`🏆 HOÀN THÀNH LUYỆN TẬP!\n\n- Đúng: ${correctCount}/${quizQuestions.length} câu.\n- Điểm kinh nghiệm tích lũy: +${finalXP} XP\n- Sao nhận được: +${starsEarned} ⭐`);

  // Lưu lịch sử bài làm lên MySQL qua API
  try {
    const lessonId = quizQuestions[0] ? quizQuestions[0].lesson_id : null;
    if (lessonId && AppState.username) {
      await fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: AppState.username,
          lessonId: lessonId,
          scoreCorrect: correctCount,
          totalQuestions: quizQuestions.length,
          xpEarned: finalXP,
          starsEarned: starsEarned
        })
      });
    }
  } catch (error) {
    console.error('Lỗi khi lưu lịch sử bài làm:', error);
  }

  // Cộng điểm trực tiếp lên AppState
  if (window.gainXP) {
    await window.gainXP(finalXP);
  }
  if (window.gainStars) {
    await window.gainStars(starsEarned);
  }

  // Cập nhật trạng thái mở khóa huy hiệu bài tập đầu tiên
  localStorage.setItem('achievement_first_quiz', 'true');
  if (window.checkAndUnlockAchievements) {
    window.checkAndUnlockAchievements();
  }

  // Quay lại bản đồ SPA qua Hash
  window.location.hash = '#dashboard';
}

// ==========================================================================
// KHỞI TẠO BẢNG VẼ NHÁP CANVAS (SCRATCHPAD)
// ==========================================================================
function initCanvasScratchpad() {
  canvas = document.getElementById('scratchpad-canvas');
  if (!canvas) return;
  ctx = canvas.getContext('2d');

  // Đăng ký sự kiện vẽ bằng chuột
  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDrawing);
  canvas.addEventListener('mouseout', stopDrawing);

  // Đăng ký sự kiện vẽ bằng cảm ứng (Điện thoại/Máy tính bảng)
  canvas.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousedown', {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
  }, { passive: true });

  canvas.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
  }, { passive: true });

  canvas.addEventListener('touchend', () => {
    const mouseEvent = new MouseEvent('mouseup', {});
    canvas.dispatchEvent(mouseEvent);
  });

  // Chọn màu vẽ nháp
  document.querySelectorAll('.canvas-color-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.canvas-color-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      drawColor = e.target.getAttribute('data-color');
    });
  });

  // Xóa bảng nháp
  document.getElementById('btn-clear-canvas').addEventListener('click', clearScratchpad);
}

function startDrawing(e) {
  isDrawing = true;
  const rect = canvas.getBoundingClientRect();
  // Tính toán đúng tỉ lệ tọa độ trong canvas thực tế
  lastX = ((e.clientX - rect.left) / rect.width) * canvas.width;
  lastY = ((e.clientY - rect.top) / rect.height) * canvas.height;

  // Lưu số lần sử dụng nháp của học sinh
  let scratchCount = parseInt(localStorage.getItem('user_scratch_count') || '0');
  localStorage.setItem('user_scratch_count', (scratchCount + 1).toString());
}

function draw(e) {
  if (!isDrawing) return;
  const rect = canvas.getBoundingClientRect();
  const currentX = ((e.clientX - rect.left) / rect.width) * canvas.width;
  const currentY = ((e.clientY - rect.top) / rect.height) * canvas.height;

  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(currentX, currentY);
  ctx.strokeStyle = drawColor;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.stroke();

  lastX = currentX;
  lastY = currentY;
}

function stopDrawing() {
  isDrawing = false;
}

function clearScratchpad() {
  if (!ctx || !canvas) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Xuất các hàm để file app.js gọi
window.startQuiz = startQuiz;

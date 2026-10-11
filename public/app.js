// ==========================================
// QUẢN LÝ DỮ LIỆU & TRẠNG THÁI ỨNG DỤNG
// ==========================================

const state = {
  currentScreen: 1,
  selectedDate: new Date(),
  selectedTime: '20:05',
  selectedFood: 'Đồ Hàn',
  inviter: 'Đức',
  invitee: 'Hai Anh'
};

// Đặt ngày mặc định là ngày mai hoặc ngày hiện tại
state.selectedDate.setDate(state.selectedDate.getDate() + 1);

const dayNames = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

function formatTwoDigits(n) {
  return n < 10 ? '0' + n : '' + n;
}

function formatDateFull(date) {
  const d = formatTwoDigits(date.getDate());
  const m = formatTwoDigits(date.getMonth() + 1);
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

function getDayOfWeek(date) {
  return dayNames[date.getDay()];
}

// ==========================================
// ĐIỀU HƯỚNG MÀN HÌNH (SCREEN NAVIGATION)
// ==========================================

function switchScreen(screenNumber) {
  state.currentScreen = screenNumber;
  document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
  const target = document.getElementById(`screen-${screenNumber}`);
  if (target) {
    target.classList.add('active');
  }

  if (screenNumber === 3) {
    updateSummaryScreen();
    launchConfetti();
  }
}

// ==========================================
// SCREEN 1: NÚT "ĐỂ EM NGHĨ ĐÃ" CHẠY TRỐN
// ==========================================

const btnYes = document.getElementById('btn-yes');
const btnNo = document.getElementById('btn-no');
const escapeArea = document.getElementById('escapeArea');
const funnyHint = document.getElementById('funny-hint');

const funnyMessages = [
  "Nút này bị hỏng rùi hihi 😜",
  "Không cho nghĩ đâu nha, đồng ý đi mà! 💕",
  "Chỉ được bấm 'Dạ có' thui nè 🥰",
  "Em hết cơ hội từ chối rùi nha 💖",
  "Né nè, đố em bấm trúng đóoo 🏃‍♀️💨"
];
let funnyMsgIndex = 0;

function moveNoButton() {
  btnNo.classList.add('teleported');
  
  const containerRect = escapeArea.getBoundingClientRect();
  const btnRect = btnNo.getBoundingClientRect();
  const yesRect = btnYes.getBoundingClientRect();

  const maxLeft = containerRect.width - btnRect.width;
  const maxTop = containerRect.height - btnRect.height;

  let randomLeft, randomTop;
  let attempts = 0;

  // Lặp tìm vị trí ngẫu nhiên không đè lên nút Yes
  do {
    randomLeft = Math.max(5, Math.floor(Math.random() * (maxLeft - 10)));
    randomTop = Math.max(5, Math.floor(Math.random() * (maxTop - 10)));
    attempts++;
  } while (
    attempts < 15 &&
    Math.abs(randomLeft - (yesRect.left - containerRect.left)) < 110 &&
    Math.abs(randomTop - (yesRect.top - containerRect.top)) < 45
  );

  btnNo.style.left = `${randomLeft}px`;
  btnNo.style.top = `${randomTop}px`;

  // Cập nhật câu chữ trêu chọc
  funnyHint.textContent = funnyMessages[funnyMsgIndex % funnyMessages.length];
  funnyMsgIndex++;
}

// Sự kiện né chuột và né chạm tay trên mobile
btnNo.addEventListener('mouseenter', moveNoButton);
btnNo.addEventListener('mouseover', moveNoButton);
btnNo.addEventListener('touchstart', (e) => {
  e.preventDefault();
  moveNoButton();
});

// Nếu ráng bấm được
btnNo.addEventListener('click', (e) => {
  e.preventDefault();
  moveNoButton();
  btnNo.querySelector('span').textContent = "Hỏng rùi 😜";
});

// Nút Đồng ý
btnYes.addEventListener('click', () => {
  switchScreen(2);
});

// ==========================================
// SCREEN 2: BẢNG LỊCH CHỌN NGÀY
// ==========================================

let currentCalMonth = new Date().getMonth();
let currentCalYear = new Date().getFullYear();

const calendarMonthYear = document.getElementById('calendarMonthYear');
const calendarDays = document.getElementById('calendarDays');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');

function renderCalendar(month, year) {
  calendarDays.innerHTML = '';
  calendarMonthYear.textContent = `Tháng ${month + 1}, ${year}`;

  const firstDay = new Date(year, month, 1).getDay();
  // Điều chỉnh thứ 2 là ngày bắt đầu tuần (0: T2, 6: CN)
  const startOffset = (firstDay + 6) % 7; 
  const totalDays = new Date(year, month + 1, 0).getDate();

  // Ô trống trước ngày đầu tháng
  for (let i = 0; i < startOffset; i++) {
    const empty = document.createElement('div');
    empty.className = 'cal-day disabled';
    calendarDays.appendChild(empty);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Giới hạn 3 tuần (21 ngày) tính từ ngày hiện tại
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 21);
  maxDate.setHours(23, 59, 59, 999);

  // Điều khiển nút chuyển tháng trước / sau
  const currentMonthStart = new Date(year, month, 1);
  const todayMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const maxMonthStart = new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);

  if (prevMonthBtn) {
    prevMonthBtn.disabled = currentMonthStart <= todayMonthStart;
    prevMonthBtn.classList.toggle('disabled', prevMonthBtn.disabled);
  }
  if (nextMonthBtn) {
    nextMonthBtn.disabled = currentMonthStart >= maxMonthStart;
    nextMonthBtn.classList.toggle('disabled', nextMonthBtn.disabled);
  }

  for (let day = 1; day <= totalDays; day++) {
    const dayEl = document.createElement('div');
    dayEl.className = 'cal-day';
    dayEl.textContent = day;

    const thisDate = new Date(year, month, day);
    thisDate.setHours(0, 0, 0, 0);

    // Kiểm tra: Không chọn ngày trong quá khứ VÀ không chọn quá 3 tuần
    const isPast = thisDate < today;
    const isOver3Weeks = thisDate > maxDate;

    if (isPast || isOver3Weeks) {
      dayEl.classList.add('disabled');
      dayEl.title = isPast ? 'Không thể chọn ngày trong quá khứ' : 'Chỉ có thể chọn trong vòng 3 tuần tới';
      calendarDays.appendChild(dayEl);
      continue;
    }

    // Đánh dấu hôm nay
    if (thisDate.getTime() === today.getTime()) {
      dayEl.classList.add('today');
    }

    // Đánh dấu ngày đang được chọn
    const selZero = new Date(state.selectedDate);
    selZero.setHours(0, 0, 0, 0);
    if (thisDate.getTime() === selZero.getTime()) {
      dayEl.classList.add('selected');
    }

    dayEl.addEventListener('click', () => {
      state.selectedDate = new Date(year, month, day);
      renderCalendar(currentCalMonth, currentCalYear);
      updateDateTimeSummary();
    });

    calendarDays.appendChild(dayEl);
  }
}

prevMonthBtn.addEventListener('click', () => {
  if (prevMonthBtn.disabled) return;
  currentCalMonth--;
  if (currentCalMonth < 0) {
    currentCalMonth = 11;
    currentCalYear--;
  }
  renderCalendar(currentCalMonth, currentCalYear);
});

nextMonthBtn.addEventListener('click', () => {
  if (nextMonthBtn.disabled) return;
  currentCalMonth++;
  if (currentCalMonth > 11) {
    currentCalMonth = 0;
    currentCalYear++;
  }
  renderCalendar(currentCalMonth, currentCalYear);
});

// ==========================================
// SCREEN 2: CHỌN GIỜ & LIST MÓN ĂN
// ==========================================

const timeChips = document.querySelectorAll('.time-chip');
const customTimeInput = document.getElementById('customTimeInput');
const dateTimeSummary = document.getElementById('dateTimeSummary');

timeChips.forEach(chip => {
  chip.addEventListener('click', () => {
    timeChips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    state.selectedTime = chip.dataset.time;
    customTimeInput.value = state.selectedTime;
    updateDateTimeSummary();
  });
});

customTimeInput.addEventListener('input', (e) => {
  if (e.target.value) {
    state.selectedTime = e.target.value;
    timeChips.forEach(c => {
      c.classList.toggle('active', c.dataset.time === state.selectedTime);
    });
    updateDateTimeSummary();
  }
});

// Chọn món ăn / hoạt động
const foodItems = document.querySelectorAll('.food-item');
const customFoodWrap = document.getElementById('customFoodWrap');
const customFoodInput = document.getElementById('customFoodInput');

const currentActiveFood = document.querySelector('.food-item.active') || foodItems[0];
if (currentActiveFood) {
  state.selectedFood = currentActiveFood.dataset.food;
  currentActiveFood.classList.add('active');
  if (currentActiveFood.dataset.food === 'Tự chọn' && customFoodWrap) {
    customFoodWrap.style.display = 'block';
  }
}

foodItems.forEach(item => {
  item.addEventListener('click', () => {
    foodItems.forEach(f => f.classList.remove('active'));
    item.classList.add('active');

    if (item.dataset.food === 'Tự chọn') {
      if (customFoodWrap) customFoodWrap.style.display = 'block';
      if (customFoodInput) {
        customFoodInput.focus();
        state.selectedFood = customFoodInput.value.trim() || 'Tự chọn';
      } else {
        state.selectedFood = 'Tự chọn';
      }
    } else {
      if (customFoodWrap) customFoodWrap.style.display = 'none';
      state.selectedFood = item.dataset.food;
    }
  });
});

if (customFoodInput) {
  customFoodInput.addEventListener('input', (e) => {
    state.selectedFood = e.target.value.trim() || 'Tự chọn';
  });
}

// Cập nhật dòng hiển thị ngày và giờ
function updateDateTimeSummary() {
  const dayWeek = getDayOfWeek(state.selectedDate);
  const fullDate = formatDateFull(state.selectedDate);
  dateTimeSummary.innerHTML = `✨ <span>Đã chọn: <strong>${dayWeek}, ${fullDate}</strong> lúc <strong>${state.selectedTime}</strong></span>`;
}

// Nút xác nhận lựa chọn
const btnConfirm = document.getElementById('btn-confirm');
btnConfirm.addEventListener('click', async () => {
  // Gửi thông tin lên server Node.js
  try {
    await fetch('/api/appointment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date: formatDateFull(state.selectedDate),
        dayOfWeek: getDayOfWeek(state.selectedDate),
        time: state.selectedTime,
        food: state.selectedFood,
        inviter: state.inviter,
        invitee: state.invitee
      })
    });
  } catch (err) {
    console.log('Lưu API offline/local:', err);
  }

  switchScreen(3);
});

// Giới hạn số lần chọn lại tối đa là 3 lần
let reselectCount = 0;
const MAX_RESELECT = 3;

function updateSummaryScreen() {
  const dayWeek = getDayOfWeek(state.selectedDate);
  const fullDate = formatDateFull(state.selectedDate);

  // Cập nhật hộp thông điệp tự nhiên
  const finalMsgEl = document.getElementById('finalMessageText');
  if (finalMsgEl) {
    if (state.selectedFood.toLowerCase().includes('phim')) {
      finalMsgEl.innerHTML = `Được rui, vậy <strong>${dayWeek}</strong>, <strong>${fullDate}</strong> mình <strong>đi xem phim</strong> lúc <strong>${state.selectedTime}</strong> nha ❤️`;
    } else {
      finalMsgEl.innerHTML = `Được rui, vậy <strong>${dayWeek}</strong>, <strong>${fullDate}</strong> mình đi ăn/uống <strong>${state.selectedFood}</strong> lúc <strong>${state.selectedTime}</strong> nha ❤️`;
    }
  }

  // Cập nhật bảng chi tiết
  document.getElementById('inviterName').textContent = state.inviter;
  document.getElementById('inviteeName').textContent = state.invitee;
  document.getElementById('tableDate').textContent = `${dayWeek}, ${fullDate}`;
  document.getElementById('tableTime').textContent = state.selectedTime;
  document.getElementById('tableFood').textContent = state.selectedFood;

  // Cập nhật nút Chọn lại và số lượt còn lại
  const btnRestart = document.getElementById('btn-restart');
  const bottomNote = document.querySelector('.bottom-playful-note');
  const remaining = MAX_RESELECT - reselectCount;

  if (reselectCount >= MAX_RESELECT) {
    btnRestart.disabled = true;
    btnRestart.classList.add('disabled');
    btnRestart.textContent = 'Hết lượt chọn lại rùi nha 🔒';
    if (bottomNote) {
      bottomNote.innerHTML = 'Em đã chọn lại hết 3 lần rồi nha! Lịch chốt cứng rồi, không được bùng đâu đó 😆❤️';
    }
  } else {
    btnRestart.disabled = false;
    btnRestart.classList.remove('disabled');
    btnRestart.textContent = `Chọn lại nè (Còn ${remaining} lần)`;
  }
}

// Nút Chọn lại nè
const btnRestart = document.getElementById('btn-restart');
btnRestart.addEventListener('click', () => {
  if (reselectCount >= MAX_RESELECT) {
    alert('Em đã chọn lại 3 lần rồi nha, anh chốt lịch này luôn rồi nè! 💕');
    return;
  }
  reselectCount++;
  switchScreen(2);
});

// ==========================================
// HIỆU ỨNG PHÁO HOA TIM RƠI (CONFETTI HEARTS)
// ==========================================

const canvas = document.getElementById('confettiCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;
let hearts = [];

function resizeCanvas() {
  if (canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class HeartParticle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = -20;
    this.size = Math.random() * 16 + 10;
    this.speedY = Math.random() * 3 + 2;
    this.speedX = (Math.random() - 0.5) * 2;
    this.color = ['#ff6b8b', '#f43f5e', '#ec4899', '#fda4af', '#fb7185'][Math.floor(Math.random() * 5)];
    this.rotation = Math.random() * Math.PI * 2;
    this.rotSpeed = (Math.random() - 0.5) * 0.05;
    this.alpha = 1;
  }

  update() {
    this.y += this.speedY;
    this.x += this.speedX;
    this.rotation += this.rotSpeed;
    if (this.y > canvas.height - 20) {
      this.alpha -= 0.02;
    }
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.fillStyle = this.color;

    // Vẽ hình trái tim
    ctx.beginPath();
    const d = this.size / 2;
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-d, -d, -d * 1.5, d / 2, 0, d * 1.4);
    ctx.bezierCurveTo(d * 1.5, d / 2, d, -d, 0, 0);
    ctx.fill();
    ctx.restore();
  }
}

let animRunning = false;

function launchConfetti() {
  if (!ctx || !canvas) return;
  hearts = [];
  for (let i = 0; i < 45; i++) {
    setTimeout(() => {
      hearts.push(new HeartParticle());
    }, i * 40);
  }

  if (!animRunning) {
    animRunning = true;
    animateConfetti();
  }
}

function animateConfetti() {
  if (!ctx || !canvas) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = hearts.length - 1; i >= 0; i--) {
    hearts[i].update();
    hearts[i].draw();
    if (hearts[i].alpha <= 0 || hearts[i].y > canvas.height + 30) {
      hearts.splice(i, 1);
    }
  }

  if (hearts.length > 0) {
    requestAnimationFrame(animateConfetti);
  } else {
    animRunning = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

// Khởi tạo ban đầu
renderCalendar(currentCalMonth, currentCalYear);
updateDateTimeSummary();

// Khởi tạo nền trái tim lơ lửng nhẹ nhàng (nếu container tồn tại)
const floatingContainer = document.getElementById('floatingHearts');
if (floatingContainer) {
  for (let i = 0; i < 15; i++) {
    const heart = document.createElement('div');
    heart.className = 'heart-particle';
    heart.textContent = ['💖', '💕', '🌸', '✨', '🤍'][Math.floor(Math.random() * 5)];
    heart.style.left = `${Math.random() * 100}vw`;
    heart.style.animationDuration = `${6 + Math.random() * 7}s`;
    heart.style.animationDelay = `${Math.random() * 5}s`;
    heart.style.fontSize = `${14 + Math.random() * 14}px`;
    floatingContainer.appendChild(heart);
  }
}

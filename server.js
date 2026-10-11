const express = require('express');
const path = require('path');
const fs = require('fs');
const config = require('./config');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// File lưu dữ liệu dự phòng trên server
const DATA_FILE = path.join(__dirname, 'lich-hen.json');

// Hàm gửi thông báo tới Telegram Bot
async function sendTelegramMessage(data) {
  const botToken = config.TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
  const chatId = config.TELEGRAM_CHAT_ID || process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn('⚠️ [Telegram] Chưa cấu hình BOT_TOKEN hoặc CHAT_ID trong config.js hoặc biến môi trường!');
    return { success: false, message: 'Chưa cấu hình Telegram Token hoặc Chat ID' };
  }

  const message = `🔔 *TING TING! ĐÃ CÓ LỊCH HẸN MỚI NÈ!* 💕\n` +
    `━━━━━━━━━━━━━━━━━━━━━━\n` +
    `👤 *Người mời:* ${data.inviter || 'Đức'}\n` +
    `💌 *Người được mời:* ${data.invitee || 'Hải Anh'}\n` +
    `📅 *Ngày hẹn:* ${data.dayOfWeek}, ${data.date}\n` +
    `⏰ *Giờ hẹn:* ${data.time}\n` +
    `🍽️ *Món ăn:* ${data.food}\n` +
    `━━━━━━━━━━━━━━━━━━━━━━\n` +
    `✨ *Bạn ấy đã chốt kèo rồi nha, chuẩn bị lên đồ thôi!* 🥰`;

  try {
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown'
      })
    });

    const result = await response.json();
    if (result.ok) {
      console.log('✅ [Telegram] Đã gửi thông báo thành công về máy của bạn!');
      return { success: true };
    } else {
      console.error('❌ [Telegram] Lỗi từ Telegram API:', result);
      return { success: false, error: result };
    }
  } catch (error) {
    console.error('❌ [Telegram] Lỗi kết nối mạng khi gửi Telegram:', error);
    return { success: false, error: error.message };
  }
}

// API nhận và xử lý lịch hẹn
app.post('/api/appointment', async (req, res) => {
  const appointmentData = {
    ...req.body,
    createdAt: new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })
  };

  console.log('🌸 Nhận được lịch hẹn mới:', appointmentData);

  // 1. Lưu dự phòng vào file lich-hen.json
  try {
    let history = [];
    if (fs.existsSync(DATA_FILE)) {
      history = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    }
    history.push(appointmentData);
    fs.writeFileSync(DATA_FILE, JSON.stringify(history, null, 2), 'utf-8');
  } catch (err) {
    console.error('Lỗi khi ghi file lich-hen.json:', err);
  }

  // 2. Gửi thông báo về Telegram
  const tgResult = await sendTelegramMessage(appointmentData);

  res.json({
    success: true,
    data: appointmentData,
    telegramSent: tgResult.success
  });
});

// Endpoint xem lại lịch đã lưu
app.get('/api/appointment', (req, res) => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
      return res.json({ success: true, history: data });
    }
  } catch (e) {}
  res.json({ success: true, history: [] });
});

// Khởi chạy server (chạy local)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🌸 Server đang chạy tại: http://localhost:${PORT}`);
  });
}

// Export cho Vercel Serverless Function
module.exports = app;

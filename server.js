const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API lưu trữ lịch hẹn (nếu cần xem lại)
let appointmentData = null;

app.post('/api/appointment', (req, res) => {
    appointmentData = req.body;
    console.log('Đã nhận lịch hẹn mới:', appointmentData);
    res.json({ success: true, data: appointmentData });
});

app.get('/api/appointment', (req, res) => {
    res.json({ success: true, data: appointmentData });
});

// Khởi chạy server
app.listen(PORT, () => {
    console.log(`🌸 Server đang chạy tại: http://localhost:${PORT}`);
});

# 🌸 Ứng Dụng Hẹn Hò "Dành Riêng Cho Hai Anh" (Node.js)

Một trang web hẹn hò lãng mạn tone hồng pastel ngọt ngào, hiển thị dạng mockup điện thoại ở giữa màn hình (chuẩn theo video TikTok & hình ảnh mẫu).

---

## 🚀 Hướng dẫn chạy ứng dụng

1. **Cài đặt thư viện (nếu tải mới):**
   ```bash
   npm install
   ```

2. **Khởi chạy ứng dụng:**
   ```bash
   npm start
   ```

3. **Mở trình duyệt:**
   Truy cập vào địa chỉ: [http://localhost:3000](http://localhost:3000)

---

## 📱 Cấu trúc 3 Màn hình (Screens)

### 💖 Screen 1: Lời mời hẹn hò
- **Header:** "Dành riêng cho Hai Anh" (Tone hồng ngọt ngào).
- **`<h1>` và `<h2>`:** Bạn có thể tự điền hoặc chỉnh sửa trong [index.html](file:///d:/pick-date/public/index.html).
- **Khung chứa ảnh & caption:** Chứa ảnh kỷ niệm hoặc ảnh dễ thương, bên dưới có 1 caption tùy chỉnh.
- **2 Nút bấm tương tác:**
  - Nút **"Dạ có 💕"**: Click để chuyển sang Screen 2.
  - Nút **"Để em nghĩ đã"**: Tự động né chuột / đổi vị trí lung tung trêu chọc không cho bấm; nếu ráng click được sẽ hiện các thông điệp hài hước ("Nút này hỏng rùi hihi 😜", v.v.).

### 📅 Screen 2: Chọn ngày, giờ và món
- **Header:** "Chọn ngày, giờ và món nè".
- **`<h1>` và `<h2>`:** Tùy biến lời nhắn cho buổi hẹn.
- **Bảng lịch tương tác:** Xem tháng, chọn ngày trong tháng (hiển thị Thứ trong tuần tiếng Việt: Thứ Hai - Chủ Nhật).
- **Mục chọn giờ:** Các chip giờ gợi ý nhanh (18:00, 18:30, 19:00, 19:30, 20:00, 20:30, ...) kèm ô giờ tùy chỉnh.
- **Dòng tóm tắt ngày giờ:** Hiển thị tự động ngay bên dưới sau khi chọn.
- **List chọn món ăn có icon:** 🥘 Đồ Hàn, 🥩 Đồ nướng BBQ, 🍣 Đồ Nhật, 🍲 Lẩu Haidilao, 🍕 Pizza & Mì Ý, 🧋 Trà sữa & Cafe,...
- **Nút "Xác nhận lựa chọn ✨":** Chuyển sang Screen 3.

### ✨ Screen 3: Form tổng kết (Chuẩn theo ảnh mẫu)
- Tag **"Yayyy ❤️"** ở trên.
- Tiêu đề **"Được ruiiiii ✨"**.
- **Card thông điệp trên:**
  > "Được rui, vậy **[Thứ X, DD/MM/YYYY]** mình đi ăn **[Tên món]** lúc **[HH:MM]** nha ❤️"
  > "Anh chốt lịch rồi đó, em chỉ cần chuẩn bị xinh xinh là được thôi ✨"
- **Card chi tiết có viền nét đứt:**
  - Người mời: `Đạo`
  - Người được mời: `Hai Anh`
  - Ngày: `[Thứ X, DD/MM/YYYY]`
  - Giờ: `[HH:MM]`
  - Món: `[Tên món đã chọn]`
- **Nút "Chọn lại nè":** Quay lại chỉnh sửa lựa chọn.
- Dòng chữ nhắc nhở: *"Anh chốt lịch rồi đó nha, không được bùng đâu đó 😆❤️"*
- Hiệu ứng **pháo hoa trái tim rơi (Confetti Hearts)** lộng lẫy ăn mừng.

---

## 🛠️ Tùy chỉnh thông tin cá nhân

Tất cả các nội dung bạn cần điền nằm ở:
- [public/index.html](file:///d:/pick-date/public/index.html):
  - Dòng `class="screen1-h1"` & `class="screen1-h2"`: Tiêu đề Screen 1
  - Dòng `class="photo-caption"`: Caption dưới ảnh Screen 1
  - Thẻ `<img>`: Link ảnh bạn muốn hiển thị
  - Dòng `class="screen2-h1"` & `class="screen2-h2"`: Tiêu đề Screen 2
- [public/app.js](file:///d:/pick-date/public/app.js):
  - Dòng `inviter: 'Đạo'` và `invitee: 'Hai Anh'`: Tên người mời và người được mời.
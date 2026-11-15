# MIDNIGHT ROMANCE – A Little Secret for Quỳnh Lam

Website tỏ tình tương tác: HTML + CSS + JavaScript thuần, không backend, không đăng nhập, không lưu dữ liệu.

## 1. Chạy trên máy tính
- Cách nhanh nhất: nhấp đúp `index.html` để mở bằng Chrome / Edge / Safari.
- Hoặc chạy server cục bộ (khuyên dùng khi dùng file nhạc riêng):
  ```
  cd midnight-romance
  python3 -m http.server 8000
  ```
  rồi mở http://localhost:8000

## 2. Thay đổi nội dung lời tỏ tình
Mở `js/config.js` và sửa chữ trong dấu nháy. Tại đây có toàn bộ nội dung: lời mở đầu, câu chuyện, 3 câu hỏi, **bức thư** (`letter.paragraphs` – mỗi dòng là một đoạn), câu hỏi cuối và lời kết. Không cần sửa file khác.

## 3. Thêm nhạc và hình ảnh
- Nhạc nền hiện tại: bản piano cover "Trời giấu trời mang đi" nằm sẵn tại `assets/music/troi-giau-troi-mang-di-piano.mp3` (bạn tự cung cấp, hãy đảm bảo có quyền sử dụng khi đăng công khai).
- Muốn đổi bài: chép file mới vào `assets/music/`, sửa `file` trong `js/config.js`. Muốn quay lại nhạc piano tự tạo: đặt `useFile: false`.
- Khi chưa có file (hoặc file lỗi), website tự dùng nhạc piano ambient tự tạo, không báo lỗi. Nhạc chỉ phát sau khi bấm "MỞ BÍ MẬT", âm lượng mặc định 22%, tắt thì nhỏ dần rồi dừng.
- Hình ảnh: bỏ vào `assets/images/` và dùng đường dẫn tương đối (ví dụ `assets/images/anh.jpg`). Hiện website không cần ảnh nào, trăng và sao được vẽ bằng CSS/canvas.

## 4. Chạy offline
Font (Cormorant Garamond, Be Vietnam Pro, Dancing Script) đang tải từ Google Fonts; nếu không có mạng, trình duyệt dùng font dự phòng. Để offline hoàn toàn: tải các font dạng `.woff2` vào `assets/fonts/`, thêm `@font-face` vào đầu `css/style.css`, rồi xoá 3 thẻ `<link>` Google Fonts trong `index.html`.

## 5. Đưa lên mạng
**GitHub Pages:** tạo repo, tải toàn bộ thư mục lên, vào Settings → Pages → chọn nhánh `main` / thư mục `/ (root)` → Save. Link dạng `https://<tên>.github.io/<repo>/`.
**Netlify:** vào app.netlify.com/drop, kéo thả thư mục `midnight-romance` vào. Có thể đổi tên link trong Site settings.

## 6. Ghi chú
- Có nút bật/tắt nhạc (góc dưới phải) và nút giảm chuyển động (◐). Hệ thống cũng tự giảm chuyển động nếu thiết bị bật chế độ đó.
- Nút "Mình cần thêm thời gian" luôn đứng yên, không có hiệu ứng tiêu cực.
- **Nhận câu trả lời qua Gmail:** khi Quỳnh Lam chọn đáp án ở câu hỏi cuối, website gửi một email (gồm 3 câu trò chơi và câu trả lời cuối) đến địa chỉ trong `notify.email` của `js/config.js`, qua dịch vụ FormSubmit. Một dòng thông báo nhỏ hiển thị cho em biết điều này. Muốn tắt: `enabled: false`.
  - Chỉ gửi khi website chạy trên http/https (đã đưa lên GitHub Pages/Netlify hoặc chạy bằng `python3 -m http.server`), mở bằng cách nhấp đúp file thì không gửi.
  - **Lần đầu bắt buộc kích hoạt:** sau khi đưa website lên mạng, tự mở và đi hết hành trình một lần. FormSubmit sẽ gửi email xác nhận vào Gmail của bạn (xem cả Spam/Quảng cáo), bấm "Activate Form". Từ đó các email sau mới đến.
  - Email chỉ gửi khi người nhận đi đến câu hỏi cuối và chọn một đáp án. Địa chỉ email nằm trong mã nguồn nên ai xem được mã đều thấy.

## Cấu trúc
```
midnight-romance/
├── index.html
├── css/style.css
├── js/ (config.js, game.js, script.js)
├── assets/ (images, music, fonts)
└── README.md
```

## Đếm ngược mở cửa
- File `js/countdown.js` khoá website cho đến giờ đặt trong `js/config.js` → `countdown.unlockAt` (hiện là 21:00 ngày 15/11/2026, giờ Việt Nam). Trước giờ đó chỉ hiện đồng hồ đếm ngược; tới giờ website tự mở, không cần tải lại trang.
- Đổi giờ: sửa `unlockAt` theo dạng `"2026-11-20T21:00:00+07:00"`. Tắt: `enabled: false`.
- Chủ website xem thử trước giờ: thêm `?preview=1` vào cuối đường link.
- Lưu ý: đây là khoá phía trình duyệt, chỉnh đồng hồ máy hoặc xem mã nguồn (nội dung thư nằm trong `config.js`) vẫn có thể vượt qua. Đủ để tạo bất ngờ, không phải bảo mật thật.

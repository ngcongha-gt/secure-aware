#  Hướng dẫn Đóng góp

Cảm ơn bạn đã quan tâm đến SecureAware! Dưới đây là hướng dẫn để đóng góp hiệu quả.

---

##  Báo lỗi (Bug Report)

Trước khi tạo issue, hãy kiểm tra xem lỗi đó đã được báo cáo chưa.

Khi tạo issue, vui lòng cung cấp:
- **Mô tả lỗi** rõ ràng
- **Các bước tái hiện** lỗi
- **Kết quả mong đợi** vs **kết quả thực tế**
- **Trình duyệt và phiên bản** đang dùng
- **Screenshot** nếu có

---

##  Đề xuất tính năng (Feature Request)

Mở một issue mới với nhãn `enhancement` và mô tả:
- Tính năng bạn muốn thêm
- Lý do tính năng này hữu ích
- Ý tưởng về cách implement (nếu có)

---

##  Gửi Pull Request

### Thiết lập môi trường

```bash
# Fork repo trên GitHub, sau đó clone fork về máy
git clone https://github.com/ngcongha-gt/Secure-aware.git
cd secureaware

# Thêm upstream remote
git remote add upstream https://github.com/ngcongha-gt/Secure-aware.git
```

### Quy trình làm việc

```bash
# Luôn tạo branch mới từ main
git checkout main
git pull upstream main
git checkout -b feature/ten-mo-ta-ngan

# Làm việc, sau đó commit
git add .
git commit -m "feat: mô tả thay đổi"

# Push và tạo PR
git push origin feature/ten-mo-ta-ngan
```

### Quy ước đặt tên branch

| Loại | Prefix | Ví dụ |
|---|---|---|
| Tính năng mới | `feature/` | `feature/them-module-2fa` |
| Sửa lỗi | `fix/` | `fix/entropy-tinh-sai` |
| Cải thiện UI | `ui/` | `ui/responsive-mobile` |
| Tài liệu | `docs/` | `docs/cap-nhat-readme` |

### Quy ước commit message

```
feat: thêm kiểm tra mật khẩu theo tiêu chuẩn NIST
fix: sửa lỗi modPow với số âm
ui: cải thiện responsive cho màn hình nhỏ
docs: cập nhật README phần cài đặt
refactor: tách logic RSA thành module riêng
```

---

## 📐 Tiêu chuẩn code

### HTML
- Dùng semantic HTML5 (`<main>`, `<nav>`, `<section>`...)
- Thêm `aria-label` cho các element tương tác
- Indent 2 spaces

### CSS
- Dùng CSS Variables đã định nghĩa trong `:root`
- Không thêm inline style mới — viết class thay thế
- Đặt class mới vào đúng section (layout, components, utilities...)

### JavaScript
- Dùng `const`/`let`, không dùng `var`
- Đặt tên hàm rõ nghĩa theo camelCase
- Xử lý lỗi bằng inline message thay vì `alert()`
- Comment bằng tiếng Anh hoặc tiếng Việt đều được

---

##  Checklist trước khi gửi PR

- [ ] Code chạy đúng trên Chrome, Firefox, Edge
- [ ] Không có lỗi console
- [ ] Không thêm inline style mới không cần thiết
- [ ] Tính năng mới có giải thích rõ trong PR description
- [ ] README được cập nhật nếu thêm tính năng mới

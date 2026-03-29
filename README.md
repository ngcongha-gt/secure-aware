#  SecureAware — Bộ Công Cụ Giáo Dục An Toàn Thông Tin

<div align="center">

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)
![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=flat)

**Ứng dụng web giáo dục về an toàn thông tin — chạy hoàn toàn trên trình duyệt, không cần server.**

[ Xem Demo](#) · [ Tài liệu](#modules) · [ Báo lỗi](../../issues) · [ Đề xuất tính năng](../../issues)

</div>

---

##  Mục lục

- [Giới thiệu](#-giới-thiệu)
- [Tính năng](#-tính-năng)
- [Cài đặt & Chạy](#-cài-đặt--chạy)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [Modules](#-modules)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Đóng góp](#-đóng-góp)
- [Tác giả](#-tác-giả)
- [License](#-license)

---

##  Giới thiệu

**SecureAware** là bộ công cụ giáo dục tương tác về an toàn thông tin, được xây dựng cho **Domain 4 — Project 6**. Dự án giúp người dùng hiểu và nhận diện các mối đe dọa bảo mật phổ biến thông qua mô phỏng thực tế:

-  Tấn công phishing qua email, SMS, trang web giả
-  Thu thập thông tin OSINT (digital footprint)
-  Phân tích độ mạnh mật khẩu và entropy
-  Minh họa thuật toán mã hóa RSA

>  **Mục đích giáo dục:** Toàn bộ nội dung chỉ phục vụ học tập và nâng cao nhận thức bảo mật. Không sử dụng các kỹ thuật này với mục đích tấn công thực tế.

---

##  Tính năng

| Tính năng | Mô tả |
|---|---|
|  Zero dependency | Không cần npm, không cần build tool |
|  Chạy offline | Mở thẳng file HTML trên trình duyệt |
|  Responsive | Hỗ trợ màn hình mobile và desktop |
|  Dark theme | Giao diện tối mặc định |
|  Toán học chính xác | RSA, entropy dùng thuật toán thật |
|  Tương tác cao | Mô phỏng tình huống thực tế |

---

##  Cài đặt & Chạy

### Cách 1 — Mở trực tiếp (đơn giản nhất)

```bash
git clone https://github.com/ngcongha-gt/Secure-aware.git
cd secureaware
```

Mở file `index.html` bằng trình duyệt bất kỳ (Chrome, Firefox, Edge...).

### Cách 2 — Dùng Live Server (khuyến nghị khi phát triển)

```bash
# Nếu có VS Code + extension Live Server
# Chuột phải index.html → "Open with Live Server"

# Hoặc dùng Python
python -m http.server 5500
# Truy cập: http://localhost:5500
```

### Cách 3 — Deploy lên GitHub Pages

1. Vào repo → **Settings** → **Pages**
2. Source: chọn branch `main`, thư mục `/ (root)`
3. Lưu → truy cập `https://<username>.github.io/secureaware`

---

##  Cấu trúc dự án

```
secureaware/
├── index.html          # Cấu trúc HTML chính — toàn bộ giao diện
├── style.css           # Stylesheet — design system, layout, components
├── script.js           # Logic JavaScript — 4 module chức năng
├── README.md           # Tài liệu dự án (file này)
├── CONTRIBUTING.md     # Hướng dẫn đóng góp
├── LICENSE             # MIT License
└── .gitignore          # Danh sách file bỏ qua khi commit
```

---

##  Modules

### Module 1 —  Digital Footprint Visualizer

Mô phỏng cách kẻ tấn công thu thập thông tin OSINT từ email.

**Logic hoạt động:**
- Nhận email đầu vào → mô phỏng quét 6 nguồn (HaveIBeenPwned, LinkedIn, GitHub, Dark Web...)
- Tính điểm rủi ro và hiển thị bản đồ liên kết dữ liệu bị lộ
- Dữ liệu breach là mô phỏng giáo dục, không kết nối API thật

**File liên quan:** `script.js` — hàm `runFootprintScan()`, `showFootprintResults()`, `renderFootprintGraph()`

---

### Module 2 —  Phishing & Social Engineering Simulator

Ba kịch bản tương tác: Email phishing, SMS smishing, Fake login page.

**Logic chấm điểm:**

```
Điểm bắt đầu: 100
Nhấp link lừa đảo:     -30 điểm
Đăng nhập trang giả:   -40 điểm
Xóa mail (không báo):   -5 điểm
Báo cáo phishing:      +10 điểm
Phát hiện dấu hiệu:    +5 điểm mỗi cái
```

**File liên quan:** `script.js` — hàm `handleAction()`, `handleSmsAction()`, `handleFakeLogin()`

---

### Module 3 —  Password Security Analyzer

Phân tích độ mạnh mật khẩu dựa trên 9 tiêu chí, tính entropy và ước tính thời gian crack.

**Bảng tính điểm:**

| Tiêu chí | Điểm |
|---|---|
| Độ dài ≥ 8 ký tự | +10 |
| Độ dài ≥ 12 ký tự | +15 |
| Độ dài ≥ 16 ký tự | +10 |
| Có chữ thường (a–z) | +10 |
| Có chữ hoa (A–Z) | +15 |
| Có chữ số (0–9) | +10 |
| Có ký tự đặc biệt | +20 |
| Không nằm trong danh sách phổ biến | +5 |
| Không lặp ký tự (aaa, 111) | +5 |

**Công thức entropy** (chuẩn NIST):
```
Entropy = length × log₂(charPool)
```

**Ước tính thời gian crack:**
```
Time = (2^entropy / 2) / attack_speed
```

| Loại tấn công | Tốc độ |
|---|---|
| Tấn công từ điển | 10⁶ hash/s |
| GPU thông thường | 10⁹ hash/s |
| Botnet 1000 GPU | 10¹² hash/s |
| Siêu máy tính | 10¹⁵ hash/s |

**File liên quan:** `script.js` — hàm `calcPasswordStrength()`, `renderCrackTimes()`, `checkBreachDatabase()`

---

### Module 4 —  RSA Cryptography Demo

Minh họa toàn bộ quy trình thuật toán RSA từ sinh khóa đến mã hóa/giải mã.

**Quy trình RSA được implement:**

```
1. Chọn p, q nguyên tố
2. Tính n = p × q
3. Tính φ(n) = (p-1)(q-1)
4. Chọn e: gcd(e, φ(n)) = 1   →  thường dùng e = 65537
5. Tính d = e⁻¹ mod φ(n)       →  Extended Euclidean Algorithm
6. Public key:  (n, e)
7. Private key: (n, d)
8. Mã hóa:  C = Mᵉ mod n
9. Giải mã:  M = Cᵈ mod n
```

**Các hàm toán học chính xác:**
- `isPrime(n)` — kiểm tra số nguyên tố
- `gcd(a, b)` — Thuật toán Euclid
- `modInverse(e, phi)` — Extended Euclidean Algorithm
- `modPow(base, exp, mod)` — Modular exponentiation dùng `BigInt`

**File liên quan:** `script.js` — hàm `generateRSAKeys()`, `rsaEncrypt()`, `rsaDecrypt()`

---

## 🛠️ Công nghệ sử dụng

| Công nghệ | Mục đích |
|---|---|
| HTML5 | Cấu trúc giao diện, semantic markup |
| CSS3 | Styling, CSS Variables, Grid, Flexbox, Animations |
| Vanilla JavaScript (ES2020+) | Logic nghiệp vụ, DOM manipulation, BigInt |
| Google Fonts | JetBrains Mono, Space Grotesk |

**Không sử dụng framework hay thư viện nào.** Toàn bộ là web tiêu chuẩn.

---

##  Đóng góp

Mọi đóng góp đều được chào đón! Xem chi tiết tại [CONTRIBUTING.md](CONTRIBUTING.md).

**Quy trình nhanh:**

```bash
# 1. Fork repo này
# 2. Tạo branch mới
git checkout -b feature/ten-tinh-nang

# 3. Commit thay đổi
git commit -m "feat: thêm tính năng X"

# 4. Push lên fork
git push origin feature/ten-tinh-nang

# 5. Mở Pull Request
```

---

##  Tác giả

**[Nguyễn Công Hà]**
- GitHub: [@ngcongha-gt](https://github.com/ngcongha-gt)
- Email: hia447623@gmail.com

---

##  License

Dự án này được cấp phép theo [MIT License](LICENSE).

---

<div align="center">
  Được xây dựng với tình yêu cho mục đích giáo dục an toàn thông tin
</div>

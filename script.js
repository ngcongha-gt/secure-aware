// ── Tab Navigation
function showTab(name) {
  document.querySelectorAll('.content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
  document.getElementById('tab-' + name).classList.add('active');
  document.querySelector(`[data-tab="${name}"]`).classList.add('active');
}

// ── FOOTPRINT MODULE 
const FP_SOURCES = ['HaveIBeenPwned', 'Google Cache', 'LinkedIn', 'GitHub', 'Pastebin', 'Dark Web'];
const FP_BREACH_DATA = {
  low: [
    { site: 'LinkedIn', year: 2016, records: '117M', data: ['Email', 'Mật khẩu hash', 'Tên đầy đủ'], sev: 'warning' },
  ],
  med: [
    { site: 'LinkedIn', year: 2016, records: '117M', data: ['Email', 'Mật khẩu hash', 'Tên đầy đủ'], sev: 'warning' },
    { site: 'Adobe', year: 2013, records: '153M', data: ['Email', 'Mật khẩu mã hóa', 'Câu hỏi bảo mật'], sev: 'danger' },
    { site: 'Canva', year: 2019, records: '137M', data: ['Email', 'Tên người dùng', 'Quốc gia'], sev: 'warning' },
  ],
  high: [
    { site: 'LinkedIn', year: 2016, records: '117M', data: ['Email', 'Mật khẩu hash', 'Tên đầy đủ'], sev: 'danger' },
    { site: 'Adobe', year: 2013, records: '153M', data: ['Email', 'Mật khẩu mã hóa', 'Câu hỏi bảo mật'], sev: 'danger' },
    { site: 'Collection #1', year: 2019, records: '773M', data: ['Email', 'Mật khẩu plaintext'], sev: 'danger' },
    { site: 'Facebook', year: 2021, records: '533M', data: ['Số điện thoại', 'Email', 'Ngày sinh', 'Địa điểm'], sev: 'danger' },
    { site: 'Dropbox', year: 2012, records: '68M', data: ['Email', 'Mật khẩu hash bcrypt'], sev: 'warning' },
  ]
};

let fpScanInterval = null;

function runFootprintScan() {
  const email = document.getElementById('fp-email').value.trim();
  if (!email || !email.includes('@')) {
    alert('Vui lòng nhập địa chỉ email hợp lệ');
    return;
  }

  document.getElementById('fp-scanning').style.display = 'block';
  document.getElementById('fp-results').style.display = 'none';

  let step = 0;
  const statuses = [
    '⚙️ Đang truy vấn HaveIBeenPwned API...',
    '🌐 Đang tìm kiếm Google Cache...',
    '💼 Đang quét LinkedIn public data...',
    '💻 Đang kiểm tra GitHub commits...',
    '📋 Đang tìm Pastebin dumps...',
    '🕵️ Đang kiểm tra Dark Web marketplaces...'
  ];

  fpScanInterval = setInterval(() => {
    if (step < FP_SOURCES.length) {
      document.getElementById('fp-status').innerHTML = statuses[step];
      document.getElementById('fp-progress-label').textContent = `Quét nguồn: ${step + 1}/6`;
      document.getElementById('fp-progress-bar').style.width = ((step + 1) / 6 * 100) + '%';
      step++;
    } else {
      clearInterval(fpScanInterval);
      showFootprintResults(email);
    }
  }, 600);
}

function showFootprintResults(email) {
  document.getElementById('fp-scanning').style.display = 'none';
  document.getElementById('fp-results').style.display = 'block';

  const hash = email.length + email.charCodeAt(0);
  let risk, score, breaches;
  if (hash % 3 === 0) { risk = 'low'; score = 28; breaches = FP_BREACH_DATA.low; }
  else if (hash % 3 === 1) { risk = 'med'; score = 62; breaches = FP_BREACH_DATA.med; }
  else { risk = 'high'; score = 87; breaches = FP_BREACH_DATA.high; }

  setTimeout(() => {
    const circ = 2 * Math.PI * 50;
    const dash = (score / 100) * circ;
    document.getElementById('fp-ring').setAttribute('stroke-dasharray', dash + ' ' + circ);
    document.getElementById('fp-score').textContent = score;
    document.getElementById('fp-needle').style.left = score + '%';

    const riskLabels = {
      low:  ['Thấp',       'var(--success)', 'Dữ liệu của bạn ít bị lộ. Tiếp tục duy trì thực hành tốt.'],
      med:  ['Trung Bình', 'var(--warning)', 'Một số dữ liệu bị lộ trong các vụ rò rỉ. Cần đổi mật khẩu ngay.'],
      high: ['Nguy Hiểm',  'var(--danger)',  'Dữ liệu bị lộ nghiêm trọng! Kẻ tấn công có thể đã có đủ thông tin để tấn công bạn.']
    };
    const [label, color, desc] = riskLabels[risk];
    document.getElementById('fp-risk-label').textContent = 'Rủi ro: ' + label;
    document.getElementById('fp-risk-label').style.color = color;
    document.getElementById('fp-risk-desc').textContent = desc;
  }, 200);

  const bc = document.getElementById('fp-breaches');
  bc.innerHTML = breaches.map(b => `
    <div class="alert alert-${b.sev}" style="margin-bottom: 10px;">
      <div style="flex: 1;">
        <div style="font-weight: 600; margin-bottom: 4px;">💔 ${b.site} (${b.year})</div>
        <div style="font-size: 12px; opacity: 0.8;">${b.records} tài khoản bị lộ</div>
        <div style="margin-top: 6px;">${b.data.map(d => `<span class="chip chip-${b.sev}">${d}</span>`).join('')}</div>
      </div>
    </div>
  `).join('');

  renderFootprintGraph(email, breaches);

  const username = email.split('@')[0];
  document.getElementById('fp-attacker-profile').innerHTML = `
    <div class="code-block">
<span class="code-comment"># Hồ sơ OSINT được kẻ tấn công có thể thu thập về: ${email}</span>
<span class="code-key">target</span> = {
  <span class="code-str">"email"</span>: <span class="code-val">"${email}"</span>,
  <span class="code-str">"username"</span>: <span class="code-val">"${username}"</span>,
  <span class="code-str">"breaches"</span>: <span class="code-num">${breaches.length}</span>,
  <span class="code-str">"leaked_passwords"</span>: <span class="code-val">True</span>,  <span class="code-comment"># Từ Collection #1</span>
  <span class="code-str">"phone_possible"</span>: <span class="code-val">True</span>,   <span class="code-comment"># Từ Facebook leak 2021</span>
  <span class="code-str">"dob_possible"</span>: <span class="code-val">True</span>,     <span class="code-comment"># Từ hồ sơ mạng xã hội</span>
  <span class="code-str">"security_questions"</span>: <span class="code-val">["Tên thú cưng?", "Trường học?"]</span>
}

<span class="code-comment"># Kẻ tấn công có thể làm gì với thông tin này:</span>
<span class="code-key">attack_vectors</span> = [
  <span class="code-str">"Credential stuffing với mật khẩu bị lộ"</span>,
  <span class="code-str">"Spear phishing cá nhân hóa cao"</span>,
  <span class="code-str">"Account takeover qua 'Quên mật khẩu'"</span>,
  <span class="code-str">"SIM swapping với số điện thoại"</span>
]
    </div>
  `;
}

function renderFootprintGraph(email, breaches) {
  const g = document.getElementById('fp-graph');
  const cn = document.getElementById('fp-center-node');
  cn.textContent = email.split('@')[0].substring(0, 8) + '...\n@' + email.split('@')[1];

  const nodes = [
    { label: 'LinkedIn',      color: '#0077b5', risk: 'Data bị lộ',        size: 55 },
    { label: 'Facebook',      color: '#1877f2', risk: 'Số ĐT + DOB lộ',    size: 60 },
    { label: 'Dark Web',      color: '#dc2626', risk: 'Mật khẩu bán',       size: 50 },
    { label: 'Google',        color: '#4285f4', risk: 'Cache công khai',    size: 48 },
    { label: 'GitHub',        color: '#6e40c9', risk: 'Username lộ',        size: 45 },
    { label: 'HaveI\nBeenPwnd', color: '#f59e0b', risk: breaches.length + ' vi phạm', size: 52 },
  ].slice(0, Math.max(3, breaches.length + 1));

  const angles = nodes.map((_, i) => (i / nodes.length) * 2 * Math.PI - Math.PI / 2);

  g.querySelectorAll('.fp-node, .fp-line').forEach(el => el.remove());

  nodes.forEach((n, i) => {
    const angle = angles[i];
    const cx = 50 + Math.cos(angle) * 38;
    const cy = 50 + Math.sin(angle) * 38;

    const node = document.createElement('div');
    node.className = 'fp-node';
    node.style.cssText = `left:${cx}%; top:${cy}%; transform:translate(-50%,-50%); width:${n.size}px; height:${n.size}px; background:${n.color}22; border:1.5px solid ${n.color}; color:${n.color}; font-size:9px; font-weight:700;`;
    node.textContent = n.label;
    node.onclick = () => {
      const tt = document.getElementById('fp-node-tooltip');
      tt.innerHTML = `<strong style="color:${n.color}">${n.label}</strong><br><span style="color:var(--text-muted)">${n.risk}</span>`;
      tt.classList.toggle('show');
    };
    g.appendChild(node);
  });
}

// ── PHISHING MODULE 
let phishingScore = 100;
const flagsCaught = new Set();

function showScenario(name) {
  ['email', 'sms', 'login'].forEach(s => {
    document.getElementById('scenario-' + s).style.display = s === name ? 'block' : 'none';
    document.getElementById('sc-btn-' + s).className = s === name ? 'btn' : 'btn btn-outline';
  });
}

function flagCaught(type) {
  const labels = {
    domain:    { text: '🔍 Domain giả',           color: 'warning' },
    urgency:   { text: '⏰ Áp lực thời gian',      color: 'warning' },
    link:      { text: '🔗 Link đáng ngờ',         color: 'danger'  },
    signature: { text: '✍️ Chữ ký không khớp',     color: 'danger'  }
  };
  if (flagsCaught.has(type)) return;
  flagsCaught.add(type);
  const { text, color } = labels[type];
  const chip = document.createElement('span');
  chip.className = `chip chip-${color}`;
  chip.textContent = text + ' ✓ Phát hiện!';
  document.getElementById('email-flags-caught').appendChild(chip);

  phishingScore = Math.min(100, phishingScore + 5);
  updatePhishingScore();
}

function revealAllFlags() {
  ['domain', 'urgency', 'link', 'signature'].forEach(f => flagCaught(f));
}

function handleAction(action) {
  if (action === 'report') {
    showOverlay('✅', 'Chính xác! Bạn đã nhận ra phishing!',
      'Báo cáo email phishing là hành động đúng đắn. Bạn đã nhận diện được đây là email giả mạo.',
      'safe', []
    );
    phishingScore = Math.min(100, phishingScore + 10);
  } else if (action === 'click_link') {
    phishingScore = Math.max(0, phishingScore - 30);
    showOverlay('🚨', 'Cảnh báo! Bạn đã nhấp vào link lừa đảo!',
      'Nếu đây là tấn công thực, trình duyệt của bạn có thể đã tải malware hoặc bạn bị dẫn đến trang đăng nhập giả mạo.',
      'danger',
      [
        { icon: '🌐', title: 'Domain giả mạo',            desc: 'vietcombank-alert.net ≠ vietcombank.com.vn — Thêm chữ "-alert" để đánh lừa' },
        { icon: '⏰', title: 'Áp lực thời gian nhân tạo', desc: 'Ngân hàng thật không bao giờ dọa khóa tài khoản trong 24 giờ qua email' },
        { icon: '🔗', title: 'URL không hợp lệ',          desc: 'Link trỏ đến .xyz domain — không phải domain chính thức' },
        { icon: '📧', title: 'Email gửi từ domain lạ',    desc: 'Email hợp lệ của Vietcombank phải có @vietcombank.com.vn' }
      ]
    );
  } else if (action === 'ignore') {
    showOverlay('⚠️', 'Gần đúng — nhưng hãy báo cáo!',
      'Xóa email là tốt, nhưng chưa đủ. Hãy báo cáo cho bộ phận IT hoặc chuyển tiếp đến abuse@domain.com để giúp bảo vệ người khác.',
      'warning',
      [{ icon: '🚨', title: 'Luôn báo cáo phishing', desc: 'Mỗi email phishing bạn báo cáo có thể ngăn chặn hàng trăm nạn nhân khác' }]
    );
    phishingScore = Math.max(0, phishingScore - 5);
  }
  updatePhishingScore();
}

function handleSmsAction(action) {
  if (action === 'block') {
    showOverlay('✅', 'Hoàn hảo! Bạn đã xử lý đúng cách!', 'Chặn và xóa SMS lừa đảo là phản ứng tối ưu. Không bao giờ nhấp vào link trong SMS không mong đợi.', 'safe', []);
    phishingScore = Math.min(100, phishingScore + 10);
  } else if (action === 'click') {
    phishingScore = Math.max(0, phishingScore - 25);
    showOverlay('🚨', 'Bạn đã bị tấn công SMS Smishing!', 'Link trong SMS dẫn đến trang giả mạo thu thập thông tin đăng nhập.', 'danger', [
      { icon: '🔗', title: 'Domain .tk miễn phí', desc: 'Tên miền .tk là miễn phí, thường bị kẻ tấn công dùng để tạo trang lừa đảo nhanh' },
      { icon: '✍️', title: 'Lỗi chính tả',        desc: '"tai khoan cua ban bi truy cap la" — ngân hàng thật viết đúng chính tả' },
      { icon: '⏰', title: 'Chỉ 2 giờ',            desc: 'Áp lực thời gian cực ngắn để bạn không kịp suy nghĩ' }
    ]);
  } else if (action === 'call') {
    showOverlay('✅', 'Rất thông minh! Xác minh độc lập!', 'Gọi trực tiếp đến số hotline chính thức của ngân hàng (không phải số trong SMS) là cách tốt nhất để xác minh.', 'safe', [
      { icon: '📞', title: 'Mẹo vàng', desc: 'Luôn lưu số hotline chính thức của ngân hàng trong danh bạ. Không gọi số từ SMS lạ.' }
    ]);
    phishingScore = Math.min(100, phishingScore + 10);
  }
  updatePhishingScore();
}

function handleFakeLogin() {
  const email = document.getElementById('fake-email-input').value;
  phishingScore = Math.max(0, phishingScore - 40);
  showOverlay('💀', 'Thông tin đăng nhập của bạn đã bị đánh cắp!',
    email
      ? `"${email}" và mật khẩu của bạn vừa được gửi đến server của kẻ tấn công. Trong 30 giây tới, tài khoản có thể đã bị chiếm.`
      : 'Bạn vừa cố đăng nhập vào trang lừa đảo. Thông tin sẽ bị đánh cắp.',
    'danger',
    [
      { icon: '🔒', title: 'Không có HTTPS',       desc: 'http:// không có "s" nghĩa là kết nối không mã hóa — kẻ tấn công đọc được mọi thứ bạn gõ' },
      { icon: '🌐', title: 'Phân tích domain',      desc: 'facebook-login-secure.com: Kẻ tấn công thêm từ "secure" để đánh lừa. Domain thật là facebook.com' },
      { icon: '🎨', title: 'Bẫy thiết kế clone',    desc: 'HTML/CSS có thể sao chép hoàn hảo trong vài phút. Thiết kế đẹp ≠ Trang thật' },
      { icon: '🔍', title: 'Luôn kiểm tra URL',     desc: 'Chỉ nhìn vào thanh địa chỉ: facebook.com là thật, bất kỳ biến thể nào đều là giả' }
    ]
  );
  updatePhishingScore();
}

function handleLoginAction(action) {
  if (action === 'leave') {
    showOverlay('✅', 'Xuất sắc! Bạn đã nhận ra trang giả!', 'Rời khỏi trang đăng nhập giả là hành động đúng đắn. Hãy báo cáo URL này.', 'safe', []);
    phishingScore = Math.min(100, phishingScore + 10);
    updatePhishingScore();
  }
}

const smsFlags = [
  'vcb-xacnhan.tk — Tên miền .tk miễn phí, không phải domain chính thức của ngân hàng (vietcombank.com.vn)',
  '"Khoa trong 2h" — Ngân hàng không bao giờ có deadline ngắn như vậy. Đây là chiêu tạo hoảng loạn.',
  '"bi truy cap la" — Lỗi chính tả rõ ràng. Ngân hàng có đội ngũ biên soạn chuyên nghiệp.',
  'SMS đến từ số lạ, không phải số ngắn chính thức của Vietcombank'
];

function revealSmsFlag(i) {
  document.getElementById('sms-flag-' + i).textContent = smsFlags[i];
  document.getElementById('sms-flag-' + i).style.color = 'var(--accent)';
}

function showOverlay(icon, title, desc, type, flags) {
  document.getElementById('overlay-icon').textContent = icon;
  document.getElementById('overlay-title').textContent = title;
  document.getElementById('overlay-title').style.color =
    type === 'safe' ? 'var(--success)' : type === 'warning' ? 'var(--warning)' : 'var(--danger)';
  document.getElementById('overlay-desc').textContent = desc;
  document.getElementById('overlay-flags').innerHTML = flags.map(f => `
    <div class="redflag-item">
      <div class="redflag-icon">${f.icon}</div>
      <div>
        <div class="redflag-title">${f.title}</div>
        <div class="redflag-desc">${f.desc}</div>
      </div>
    </div>
  `).join('');
  document.getElementById('phishing-overlay').classList.add('show');
}

function closeOverlay() {
  document.getElementById('phishing-overlay').classList.remove('show');
}

function updatePhishingScore() {
  document.getElementById('phishing-score-display').textContent = Math.max(0, phishingScore);
  document.getElementById('phishing-score-bar').style.width = Math.max(0, phishingScore) + '%';

  const colors = phishingScore >= 70
    ? ['#22c55e', '#16a34a']
    : phishingScore >= 40
      ? ['#fbbf24', '#d97706']
      : ['#ef4444', '#dc2626'];
  document.getElementById('phishing-score-bar').style.background = `linear-gradient(90deg, ${colors[0]}, ${colors[1]})`;

  const badge = document.getElementById('phishing-status-badge');
  if (phishingScore >= 70) {
    badge.className = 'chip chip-success';
    badge.textContent = '✅ An Toàn';
  } else if (phishingScore >= 40) {
    badge.className = 'chip chip-warning';
    badge.textContent = '⚠️ Cần Cải Thiện';
  } else {
    badge.className = 'chip chip-danger';
    badge.textContent = '🚨 Nguy Hiểm';
  }
}

function checkFakeLogin() {
  // Placeholder — could add real-time warning as user types
}

// ── PASSWORD MODULE ──────────────────────────────
const COMMON_PASSWORDS = [
  '123456','password','123456789','qwerty','abc123','111111','iloveyou',
  'admin','letmein','welcome','monkey','dragon','123123','master','hello',
  'sunshine','princess','12345678','football','1234567'
];
const BREACH_PWDS = new Set([
  'password','123456','qwerty','admin','letmein','welcome','abc123',
  'monkey','iloveyou','dragon','123456789','111111','password1','trustno1','12345678'
]);

function analyzePassword() {
  const pwd = document.getElementById('pwd-input').value;
  if (!pwd) { resetPasswordUI(); return; }

  const analysis = calcPasswordStrength(pwd);
  updateStrengthBar(analysis.score);
  document.getElementById('pwd-strength-label').textContent = analysis.label;
  document.getElementById('pwd-strength-label').style.color = analysis.color;
  document.getElementById('pwd-entropy').textContent = `Entropy: ${analysis.entropy.toFixed(1)} bits`;

  renderPasswordAnalysis(analysis);
  renderCrackTimes(analysis.entropy);
  checkBreachDatabase(pwd);
}

function calcPasswordStrength(pwd) {
  const checks = {
    length8:    pwd.length >= 8,
    length12:   pwd.length >= 12,
    length16:   pwd.length >= 16,
    hasLower:   /[a-z]/.test(pwd),
    hasUpper:   /[A-Z]/.test(pwd),
    hasDigit:   /\d/.test(pwd),
    hasSymbol:  /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd),
    noCommon:   !COMMON_PASSWORDS.includes(pwd.toLowerCase()),
    noRepeat:   !/(.)\1{2,}/.test(pwd),
    noSequence: !/(012|123|234|345|456|567|678|789|abc|bcd|cde)/i.test(pwd)
  };

  let score = 0;
  if (checks.length8)    score += 10;
  if (checks.length12)   score += 15;
  if (checks.length16)   score += 10;
  if (checks.hasLower)   score += 10;
  if (checks.hasUpper)   score += 15;
  if (checks.hasDigit)   score += 10;
  if (checks.hasSymbol)  score += 20;
  if (checks.noCommon)   score += 5;
  if (checks.noRepeat)   score += 5;
  score = Math.min(100, score);

  let charPool = 0;
  if (checks.hasLower)  charPool += 26;
  if (checks.hasUpper)  charPool += 26;
  if (checks.hasDigit)  charPool += 10;
  if (checks.hasSymbol) charPool += 32;
  if (charPool === 0)   charPool = 26;
  const entropy = pwd.length * Math.log2(charPool);

  const labels =
    score < 20 ? ['Cực Yếu',    '#ef4444'] :
    score < 40 ? ['Yếu',        '#f87171'] :
    score < 60 ? ['Trung Bình', '#fbbf24'] :
    score < 80 ? ['Mạnh',       '#4ade80'] :
                 ['Rất Mạnh',   '#22c55e'];

  return { score, label: labels[0], color: labels[1], entropy, checks };
}

function updateStrengthBar(score) {
  const segs = Math.ceil(score / 20);
  const color =
    score < 20 ? '#ef4444' :
    score < 40 ? '#f87171' :
    score < 60 ? '#fbbf24' :
    score < 80 ? '#4ade80' : '#22c55e';

  for (let i = 0; i < 5; i++) {
    document.getElementById('str-' + i).style.background =
      i < segs ? color : 'rgba(255,255,255,0.05)';
  }
}

function renderPasswordAnalysis(analysis) {
  const { checks } = analysis;
  const items = [
    { ok: checks.length8,    label: 'Ít nhất 8 ký tự',              tip: 'Tối thiểu cần 8 ký tự' },
    { ok: checks.length12,   label: 'Ít nhất 12 ký tự',             tip: 'Khuyến nghị từ 12 ký tự trở lên' },
    { ok: checks.hasLower,   label: 'Có chữ thường (a-z)',           tip: 'Thêm ký tự chữ thường' },
    { ok: checks.hasUpper,   label: 'Có chữ hoa (A-Z)',              tip: 'Thêm ký tự chữ hoa' },
    { ok: checks.hasDigit,   label: 'Có chữ số (0-9)',               tip: 'Thêm ít nhất 1 chữ số' },
    { ok: checks.hasSymbol,  label: 'Có ký tự đặc biệt (!@#...)',    tip: 'Thêm ký tự đặc biệt' },
    { ok: checks.noCommon,   label: 'Không phổ biến',                tip: 'Mật khẩu này có trong danh sách phổ biến' },
    { ok: checks.noRepeat,   label: 'Không lặp lại liên tục',        tip: 'Tránh aaabbb hoặc 111' },
  ];

  document.getElementById('pwd-analysis').innerHTML = items.map(item => `
    <div style="display: flex; align-items: center; gap: 10px; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.04);">
      <span style="font-size: 14px; width: 20px; text-align: center;">${item.ok ? '✅' : '❌'}</span>
      <span style="font-size: 13px; flex: 1; color: ${item.ok ? 'var(--text)' : 'var(--text-muted)'};">${item.label}</span>
      ${!item.ok ? `<span style="font-size: 11px; color: var(--accent3);">${item.tip}</span>` : ''}
    </div>
  `).join('');
}

function renderCrackTimes(entropy) {
  const configs = [
    { name: 'Tấn công từ điển',  speed: 1e6,  icon: '📖' },
    { name: 'GPU thông thường',   speed: 1e9,  icon: '💻' },
    { name: 'Botnet 1000 GPU',    speed: 1e12, icon: '🖥️' },
    { name: 'Siêu máy tính',      speed: 1e15, icon: '🏭' },
  ];

  function formatTime(seconds) {
    if (seconds < 1)           return 'Tức thì';
    if (seconds < 60)          return `${seconds.toFixed(0)} giây`;
    if (seconds < 3600)        return `${(seconds/60).toFixed(0)} phút`;
    if (seconds < 86400)       return `${(seconds/3600).toFixed(0)} giờ`;
    if (seconds < 31536000)    return `${(seconds/86400).toFixed(0)} ngày`;
    if (seconds < 31536000000) return `${(seconds/31536000).toFixed(0)} năm`;
    return '> triệu năm ♾️';
  }

  const combinations = Math.pow(2, entropy);
  document.getElementById('crack-times').innerHTML = configs.map(cfg => {
    const time = (combinations / 2) / cfg.speed;
    const isLong = time > 365 * 24 * 3600;
    return `
      <div style="display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.04);">
        <span style="font-size: 18px; width: 24px;">${cfg.icon}</span>
        <div style="flex: 1;">
          <div style="font-size: 12px; color: var(--text-muted);">${cfg.name}</div>
          <div style="font-size: 14px; font-weight: 600; color: ${isLong ? 'var(--success)' : 'var(--danger)'}; font-family: var(--mono);">${formatTime(time)}</div>
        </div>
      </div>
    `;
  }).join('');
}

function checkBreachDatabase(pwd) {
  const isBreached = BREACH_PWDS.has(pwd.toLowerCase()) || /^(123|abc|qwer|pass|admin|let|welc)/i.test(pwd);
  const el = document.getElementById('breach-check-result');

  if (isBreached) {
    el.innerHTML = `
      <div class="alert alert-danger">
        <div>
          <div style="font-weight: 600; margin-bottom: 4px;">💀 Mật khẩu này đã xuất hiện trong dữ liệu rò rỉ!</div>
          <div style="font-size: 12px;">Kẻ tấn công có thể thử mật khẩu này đầu tiên trong các cuộc tấn công credential stuffing. Thay đổi ngay lập tức!</div>
        </div>
      </div>
    `;
  } else {
    el.innerHTML = `
      <div class="alert alert-success">
        ✅ Mật khẩu này chưa được tìm thấy trong cơ sở dữ liệu rò rỉ đã biết (Mô phỏng).
        <span style="opacity: 0.8; font-size: 12px;">Kiểm tra thực tế tại haveibeenpwned.com</span>
      </div>
    `;
  }
}

function togglePwdShow() {
  const input = document.getElementById('pwd-input');
  input.type = input.type === 'password' ? 'text' : 'password';
  document.getElementById('pwd-eye').textContent = input.type === 'password' ? '👁️' : '🙈';
}

function generateStrongPassword() {
  const lower   = 'abcdefghijklmnopqrstuvwxyz';
  const upper   = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digits  = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}';
  const all = lower + upper + digits + symbols;

  let pwd = '';
  pwd += lower[Math.floor(Math.random() * lower.length)];
  pwd += upper[Math.floor(Math.random() * upper.length)];
  pwd += digits[Math.floor(Math.random() * digits.length)];
  pwd += symbols[Math.floor(Math.random() * symbols.length)];
  for (let i = 0; i < 12; i++) pwd += all[Math.floor(Math.random() * all.length)];
  pwd = pwd.split('').sort(() => Math.random() - 0.5).join('');

  document.getElementById('pwd-suggestions').innerHTML = `
    <div class="code-block" style="display: flex; align-items: center; gap: 12px; font-size: 16px; letter-spacing: 1px;">
      <span style="flex: 1; color: var(--accent3);">${pwd}</span>
      <button onclick="copyPassword('${pwd}')" style="background: var(--surface2); border: 1px solid var(--border); border-radius: 6px; padding: 6px 10px; color: var(--text); cursor: pointer; font-size: 12px; white-space: nowrap;">📋 Sao chép</button>
    </div>
    <div style="font-size: 11px; color: var(--text-muted); margin-top: 6px;">Entropy: ~${(16 * Math.log2(94)).toFixed(0)} bits — Cực kỳ an toàn</div>
  `;
}

function copyPassword(pwd) {
  navigator.clipboard.writeText(pwd).then(() => alert('Đã sao chép mật khẩu!'));
}

function resetPasswordUI() {
  for (let i = 0; i < 5; i++) {
    document.getElementById('str-' + i).style.background = 'rgba(255,255,255,0.05)';
  }
  document.getElementById('pwd-strength-label').textContent = '—';
  document.getElementById('pwd-entropy').textContent = 'Entropy: —';
  document.getElementById('pwd-analysis').innerHTML =
    '<div style="font-size: 13px; color: var(--text-muted); text-align: center; padding: 20px 0;">Nhập mật khẩu để xem phân tích</div>';
  document.getElementById('crack-times').innerHTML =
    '<div style="font-size: 13px; color: var(--text-muted); text-align: center; padding: 20px 0;">—</div>';
  document.getElementById('breach-check-result').innerHTML =
    '<div style="font-size: 13px; color: var(--text-muted);">Nhập mật khẩu ở trên để kiểm tra...</div>';
}

// ── RSA MODULE ───────────────────────────────────
let rsaKeys = null;

function isPrime(n) {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  for (let i = 3; i <= Math.sqrt(n); i += 2) if (n % i === 0) return false;
  return true;
}

function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }

function modInverse(e, phi) {
  let [old_r, r] = [e, phi];
  let [old_s, s] = [1, 0];
  while (r !== 0) {
    const q = Math.floor(old_r / r);
    [old_r, r] = [r, old_r - q * r];
    [old_s, s] = [s, old_s - q * s];
  }
  return ((old_s % phi) + phi) % phi;
}

function modPow(base, exp, mod) {
  let result = 1n;
  base = BigInt(base) % BigInt(mod);
  exp  = BigInt(exp);
  mod  = BigInt(mod);
  while (exp > 0n) {
    if (exp % 2n === 1n) result = (result * base) % mod;
    exp  = exp / 2n;
    base = (base * base) % mod;
  }
  return result;
}

function generateRSAKeys() {
  const p = parseInt(document.getElementById('rsa-p').value);
  const q = parseInt(document.getElementById('rsa-q').value);

  if (!isPrime(p)) { alert(`${p} không phải số nguyên tố!`); return; }
  if (!isPrime(q)) { alert(`${q} không phải số nguyên tố!`); return; }
  if (p === q)     { alert('p và q phải khác nhau!'); return; }

  const n   = p * q;
  const phi = (p - 1) * (q - 1);

  let e = 65537;
  if (e >= phi || gcd(e, phi) !== 1) {
    e = 3;
    while (e < phi && gcd(e, phi) !== 1) e += 2;
  }

  const d = modInverse(e, phi);
  rsaKeys = { p, q, n, phi, e, d };

  document.getElementById('rsa-key-result').innerHTML = `
    <div style="display: grid; gap: 10px;">
      <div class="rsa-step" style="border-color: var(--accent3);">
        <div class="rsa-step-num">Khóa công khai (Public Key)</div>
        <div class="mono" style="font-size: 15px; color: var(--accent3);">n = ${n} &nbsp;&nbsp; e = ${e}</div>
        <div style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">🌍 Chia sẻ công khai — ai cũng có thể mã hóa</div>
      </div>
      <div class="rsa-step" style="border-color: var(--accent2);">
        <div class="rsa-step-num">Khóa bí mật (Private Key)</div>
        <div class="mono" style="font-size: 15px; color: var(--accent2);">n = ${n} &nbsp;&nbsp; d = ${d}</div>
        <div style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">🔒 Giữ bí mật tuyệt đối — chỉ bạn mới giải mã được</div>
      </div>
    </div>
  `;

  document.getElementById('rsa-key-steps').style.display = 'block';
  renderRSASteps(p, q, n, phi, e, d);
  document.getElementById('rsa-encrypt-card').style.display = 'block';
}

function renderRSASteps(p, q, n, phi, e, d) {
  const sc = document.getElementById('rsa-steps-content');
  if (!sc) return;
  sc.innerHTML = buildStepsHTML(p, q, n, phi, e, d);
}

function buildStepsHTML(p, q, n, phi, e, d) {
  return [
    { num: 'Bước 1', title: 'Chọn 2 số nguyên tố p và q',   formula: `p = ${p} ✓ (nguyên tố)\nq = ${q} ✓ (nguyên tố)`,                         desc: 'Trong thực tế, p và q là các số nguyên tố rất lớn (1024-bit mỗi cái) được chọn ngẫu nhiên.' },
    { num: 'Bước 2', title: 'Tính n = p × q (modulus)',       formula: `n = ${p} × ${q} = ${n}`,                                                   desc: 'n được dùng trong cả Public Key và Private Key. Biết n nhưng không thể dễ tìm lại p và q.' },
    { num: 'Bước 3', title: 'Tính φ(n) = (p-1)(q-1)',         formula: `φ(n) = (${p}-1)(${q}-1) = ${p-1} × ${q-1} = ${phi}`,                     desc: 'Phi hàm Euler φ(n). Giá trị này được giữ bí mật hoàn toàn.' },
    { num: 'Bước 4', title: `Chọn e: ƯCLN(e, φ(n)) = 1`,     formula: `e = ${e}\ngcd(${e}, ${phi}) = ${gcd(e, phi)} ✓`,                          desc: 'e là khóa mã hóa trong Public Key. Thường dùng e = 65537 vì hiệu quả và an toàn.' },
    { num: 'Bước 5', title: 'Tính d = e⁻¹ mod φ(n)',          formula: `d × e ≡ 1 (mod φ(n))\n${d} × ${e} mod ${phi} = ${(d * e) % phi}`,        desc: 'Số d là nghịch đảo modulo của e. Đây là khóa bí mật, cực kỳ quan trọng không được lộ.' },
  ].map(s => `
    <div class="rsa-step">
      <div class="rsa-step-num">${s.num}</div>
      <div class="rsa-step-title">${s.title}</div>
      <div class="rsa-formula" style="white-space: pre;">${s.formula}</div>
      <div class="rsa-step-desc" style="margin-top: 8px;">${s.desc}</div>
    </div>
  `).join('');
}

function rsaEncrypt() {
  if (!rsaKeys) { alert('Hãy sinh khóa trước!'); return; }
  const msg = document.getElementById('rsa-message').value;
  const { e, n } = rsaKeys;

  let ciphertext = [];
  for (const ch of msg) {
    const m = ch.charCodeAt(0);
    if (m >= n) { alert(`Ký tự "${ch}" (${m}) lớn hơn n=${n}. Dùng p,q lớn hơn!`); return; }
    ciphertext.push(modPow(m, e, n).toString());
  }

  document.getElementById('rsa-cipher').value = ciphertext.join(' ');
  document.getElementById('rsa-decrypted').value = '';
}

function rsaDecrypt() {
  if (!rsaKeys) { alert('Hãy sinh khóa trước!'); return; }
  const cipherStr = document.getElementById('rsa-cipher').value.trim();
  if (!cipherStr) { alert('Hãy mã hóa trước!'); return; }

  const { d, n } = rsaKeys;
  let result = '';
  for (const cStr of cipherStr.split(' ').filter(s => s)) {
    result += String.fromCharCode(Number(modPow(BigInt(cStr), d, n)));
  }

  document.getElementById('rsa-decrypted').value = result;
}

const PRIMES = [
  11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,
  101,103,107,109,113,127,131,137,139,149,151,157,163,167,173,179,181,191,193,197,199
];

function pickRandomPrimes() {
  let p, q;
  do {
    p = PRIMES[Math.floor(Math.random() * PRIMES.length)];
    q = PRIMES[Math.floor(Math.random() * PRIMES.length)];
  } while (p === q);
  document.getElementById('rsa-p').value = p;
  document.getElementById('rsa-q').value = q;
}

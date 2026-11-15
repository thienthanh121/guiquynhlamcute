/* ==========================================================================
   countdown.js – Khoá website cho đến giờ mở (cấu hình trong config.js -> countdown)
   Lưu ý: đây là khoá phía trình duyệt, đủ để tạo bất ngờ nhưng không phải bảo mật thật.
   ========================================================================== */
(function () {
  'use strict';
  const cfg = (window.CONFIG && window.CONFIG.countdown) || {};
  const target = new Date(cfg.unlockAt).getTime();
  /* ?preview=1 trên đường link: bỏ qua đếm ngược để chủ website xem thử */
  const preview = /[?&]preview=1(&|$)/.test(location.search);
  const valid = !!cfg.enabled && !isNaN(target);
  const left = () => target - Date.now();
  const pad = (n) => String(n).padStart(2, '0');

  const isLocked = () => valid && !preview && left() > 0;

  /* Hiển thị đồng hồ; gọi onUnlock khi tới giờ */
  function start(onUnlock) {
    const els = { d: '#cdD', h: '#cdH', m: '#cdM', s: '#cdS' };
    const q = (k) => document.querySelector(els[k]);
    const at = document.getElementById('cdAt');
    if (at) {
      at.textContent = 'Mở lúc ' + new Date(target).toLocaleString('vi-VN', {
        timeZone: cfg.timeZone || 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit',
        day: '2-digit', month: '2-digit', year: 'numeric'
      });
    }
    let done = false, timer;
    function tick() {
      if (done) return;
      const ms = Math.max(0, left());
      const t = Math.floor(ms / 1000);
      q('d').textContent = pad(Math.floor(t / 86400));
      q('h').textContent = pad(Math.floor(t % 86400 / 3600));
      q('m').textContent = pad(Math.floor(t % 3600 / 60));
      q('s').textContent = pad(t % 60);
      document.getElementById('cdDays').hidden = t < 86400;
      if (ms <= 0) {
        done = true; clearInterval(timer);
        setTimeout(onUnlock, 900);
      }
    }
    tick();
    timer = setInterval(tick, 1000);
    document.addEventListener('visibilitychange', tick);
  }

  window.Countdown = { isLocked, start };
})();

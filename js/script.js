/* ==========================================================================
   script.js – Điều phối cảnh, bầu trời sao, hiệu ứng, âm nhạc
   ========================================================================== */
(function () {
  'use strict';
  const C = window.CONFIG;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const rand = (a, b) => a + Math.random() * (b - a);
  const get = (o, p) => p.split('.').reduce((a, k) => (a == null ? a : a[k]), o);

  /* ---------- Chế độ giảm chuyển động ---------- */
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  let calm = mq.matches;
  const calmBtn = $('#calmBtn');
  function setCalm(v) {
    calm = v;
    document.body.classList.toggle('calm', v);
    calmBtn.setAttribute('aria-pressed', String(v));
  }
  calmBtn.addEventListener('click', () => setCalm(!calm));
  setCalm(calm);

  /* ---------- Đổ nội dung từ config ---------- */
  $$('[data-text]').forEach((el) => {
    const v = get(C, el.dataset.text);
    if (typeof v === 'string') el.textContent = v;
  });

  /* ---------- Typewriter ---------- */
  async function type(el, text, speed = 42) {
    const id = (el._tw = (el._tw || 0) + 1);
    if (calm) { el.textContent = text; el.classList.add('in'); return; }
    el.textContent = '';
    el.classList.add('in', 'typing');
    for (let i = 1; i <= text.length; i++) {
      if (el._tw !== id) return;
      el.textContent = text.slice(0, i);
      await sleep(speed);
    }
    el.classList.remove('typing');
  }
  const stopType = (el) => { el._tw = (el._tw || 0) + 1; el.classList.remove('typing', 'in'); };

  /* ---------- Bầu trời: sao, bụi sáng, trái tim nhỏ ---------- */
  const sky = $('#sky'), sctx = sky.getContext('2d');
  const moon = $('#moon');
  let W = 0, H = 0, stars = [], dust = [], hearts = [], petals = [];
  let px = 0, py = 0, tx = 0, ty = 0, boost = 0, focus = false, lastHeart = 0;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    sky.width = W * dpr; sky.height = H * dpr;
    sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const fx = $('#fx'); fx.width = W * dpr; fx.height = H * dpr;
    fx.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.min(170, Math.floor(W * H / 9000));
    stars = Array.from({ length: n }, () => ({
      x: Math.random() * W, y: Math.random() * H, r: rand(0.4, 1.5),
      ph: rand(0, 6.28), sp: rand(0.4, 1.2), l: rand(0.3, 1)
    }));
    petals = Array.from({ length: 7 }, () => ({ x: Math.random() * W, y: Math.random() * H, s: rand(5, 9), r: rand(0, 6.28), vy: rand(0.25, 0.5), sw: rand(0, 6.28) }));
    dust = Array.from({ length: Math.min(45, Math.floor(W / 24)) }, () => ({
      x: Math.random() * W, y: Math.random() * H, r: rand(0.8, 2.2),
      vx: rand(-0.12, 0.12), vy: rand(-0.22, -0.04), a: rand(0.15, 0.55)
    }));
  }
  addEventListener('resize', resize);
  resize();

  /* Parallax theo chuột / độ nghiêng điện thoại */
  addEventListener('pointermove', (e) => {
    tx = (e.clientX / W - 0.5) * 2; ty = (e.clientY / H - 0.5) * 2;
  }, { passive: true });
  addEventListener('deviceorientation', (e) => {
    if (e.gamma == null) return;
    tx = Math.max(-1, Math.min(1, e.gamma / 30)); ty = Math.max(-1, Math.min(1, (e.beta - 45) / 30));
  }, { passive: true });

  function frame(now) {
    const t = now / 1000;
    sctx.clearRect(0, 0, W, H);
    const k = calm ? 0 : 1;
    px += (tx - px) * 0.04 * k; py += (ty - py) * 0.04 * k;
    moon.style.setProperty('--mx', (-px * 14).toFixed(1) + 'px');
    moon.style.setProperty('--my', (-py * 10).toFixed(1) + 'px');
    boost *= 0.985;

    for (const s of stars) {
      const tw = calm ? 0.7 : 0.5 + 0.5 * Math.sin(t * s.sp + s.ph);
      const a = Math.min(1, 0.25 + 0.6 * tw + boost * 0.4);
      sctx.fillStyle = 'rgba(244,237,240,' + a.toFixed(3) + ')';
      sctx.beginPath();
      sctx.arc(s.x + px * s.l * 12, s.y + py * s.l * 8, s.r + boost * 0.6, 0, 6.283);
      sctx.fill();
    }
    for (const d of dust) {
      if (!calm) {
        if (focus) { d.vx += (W / 2 - d.x) * 0.000004; d.vy += (H / 2 - d.y) * 0.000004; }
        d.x += d.vx; d.y += d.vy;
        if (d.y < -10) { d.y = H + 10; d.x = Math.random() * W; }
        if (d.x < -10) d.x = W + 10;
        if (d.x > W + 10) d.x = -10;
        d.vx *= 0.999;
      }
      sctx.fillStyle = 'rgba(216,189,145,' + d.a + ')';
      sctx.beginPath(); sctx.arc(d.x, d.y, d.r, 0, 6.283); sctx.fill();
    }
    /* Vài trái tim nhỏ, hiếm, bay chậm */
    if (!calm && t - lastHeart > 7 && hearts.length < 3) {
      lastHeart = t;
      hearts.push({ x: rand(W * 0.1, W * 0.9), y: H + 10, s: rand(10, 15), life: 1 });
    }
    /* Vài cánh hoa rơi chậm */
    if (!calm) for (const p of petals) {
      p.y += p.vy; p.x += Math.sin(t + p.sw) * 0.4; p.r += 0.01;
      if (p.y > H + 12) { p.y = -12; p.x = Math.random() * W; }
      sctx.save(); sctx.translate(p.x, p.y); sctx.rotate(p.r);
      sctx.fillStyle = 'rgba(217,138,155,0.32)';
      sctx.beginPath(); sctx.ellipse(0, 0, p.s, p.s * 0.5, 0, 0, 6.283); sctx.fill(); sctx.restore();
    }
    sctx.textAlign = 'center';
    hearts = hearts.filter((h) => h.life > 0);
    for (const h of hearts) {
      h.y -= 0.35; h.x += Math.sin(h.y / 40) * 0.2; h.life -= 0.0018;
      sctx.fillStyle = 'rgba(217,138,155,' + Math.min(0.5, h.life * 0.6).toFixed(3) + ')';
      sctx.font = h.s + 'px serif';
      sctx.fillText('♥', h.x, h.y);
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  /* ---------- Pháo hoa ánh vàng & trái tim ---------- */
  const fxc = $('#fx'), fctx = fxc.getContext('2d');
  let ps = [], fxRun = false;
  function burst(x, y, heart) {
    const n = heart ? 46 : 54;
    for (let i = 0; i < n; i++) {
      let vx, vy;
      if (heart) {
        const a = i / n * 6.283;
        vx = 16 * Math.pow(Math.sin(a), 3) * 0.26;
        vy = -(13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)) * 0.26;
      } else {
        const a = rand(0, 6.283), s = rand(1.2, 4);
        vx = Math.cos(a) * s; vy = Math.sin(a) * s;
      }
      ps.push({ x, y, vx, vy, life: 1, c: heart ? '217,138,155' : '216,189,145' });
    }
    if (!fxRun) { fxRun = true; requestAnimationFrame(fxLoop); }
  }
  function fxLoop() {
    fctx.clearRect(0, 0, W, H);
    ps = ps.filter((p) => p.life > 0);
    for (const p of ps) {
      p.vx *= 0.985; p.vy = p.vy * 0.985 + 0.03; p.x += p.vx; p.y += p.vy; p.life -= 0.011;
      fctx.fillStyle = 'rgba(' + p.c + ',' + Math.max(0, p.life).toFixed(3) + ')';
      fctx.beginPath(); fctx.arc(p.x, p.y, 2, 0, 6.283); fctx.fill();
    }
    if (ps.length) requestAnimationFrame(fxLoop); else { fxRun = false; fctx.clearRect(0, 0, W, H); }
  }
  async function celebrate() {
    boost = 1.2;
    if (calm) return;
    for (let i = 0; i < 9; i++) {
      burst(rand(W * 0.15, W * 0.85), rand(H * 0.15, H * 0.5), i % 3 === 0);
      await sleep(rand(350, 600));
    }
  }

  /* ---------- Nhạc nền ---------- */
  const Music = (() => {
    let ctx, master, delay, timer, audio, next = 0, bar = 0, on = false;
    const vol = () => (C.music && C.music.volume) || 0.2;
    const prog = [
      [110, 220, 261.63, 329.63], [87.31, 174.61, 220, 261.63],
      [130.81, 261.63, 329.63, 392], [98, 196, 246.94, 293.66]
    ];
    const penta = [440, 523.25, 587.33, 659.25, 783.99, 880];

    function note(f, t, dur, v) {
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(v, t + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      [[f, 'sine', 1], [f * 2, 'triangle', 0.25]].forEach(([fr, ty, m]) => {
        const o = ctx.createOscillator(); const gg = ctx.createGain();
        o.type = ty; o.frequency.value = fr; gg.gain.value = m;
        o.connect(gg); gg.connect(g); o.start(t); o.stop(t + dur + 0.1);
      });
      g.connect(master); g.connect(delay);
    }
    function pad(f, t, dur, v) {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sine'; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(v, t + 1.2);
      g.gain.linearRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(master); o.start(t); o.stop(t + dur + 0.1);
    }
    function scheduleBar() {
      const ch = prog[bar % 4]; bar++;
      ch.forEach((f) => pad(f, next, 3.8, 0.035));
      [1, 2, 3, 2, 4, 3, 2, 3].forEach((n, k) => {
        const f = n === 4 ? ch[2] * 2 : ch[n];
        note(f, next + k * 0.42, 1.8, 0.075);
      });
      if (Math.random() < 0.5) note(penta[Math.floor(Math.random() * penta.length)], next + 1.26, 2.4, 0.05);
      next += 3.36;
    }
    function init() {
      if (ctx) return;
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain(); master.gain.value = 0; master.connect(ctx.destination);
      delay = ctx.createDelay(1); delay.delayTime.value = 0.45;
      const fb = ctx.createGain(); fb.gain.value = 0.38;
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1800;
      delay.connect(lp); lp.connect(fb); fb.connect(delay); lp.connect(master);
    }
    function fade(a, to, done) {
      const from = a.volume, t0 = performance.now();
      (function s(n) {
        const k = Math.min(1, (n - t0) / 700);
        a.volume = Math.max(0, Math.min(1, from + (to - from) * k));
        if (k < 1) requestAnimationFrame(s); else if (done) done();
      })(t0);
    }
    function setBtn() {
      const b = $('#musicBtn');
      b.classList.toggle('off', !on);
      b.setAttribute('aria-pressed', String(on));
      b.setAttribute('aria-label', on ? 'Tắt nhạc nền' : 'Bật nhạc nền');
    }
    async function start() {
      if (on) return; on = true; setBtn();
      try {
        if (C.music && C.music.useFile && C.music.file) {
          try {
            audio = audio || Object.assign(new Audio(C.music.file), { loop: true });
            audio.volume = 0; await audio.play(); fade(audio, vol()); return;
          } catch (err) { audio = null; /* file thiếu/lỗi → dùng nhạc tự tạo */ }
        }
        init(); await ctx.resume();
        master.gain.cancelScheduledValues(ctx.currentTime);
        master.gain.linearRampToValueAtTime(vol() * 2.2, ctx.currentTime + 2.5);
        next = ctx.currentTime + 0.2;
        clearInterval(timer);
        timer = setInterval(() => { while (next < ctx.currentTime + 2) scheduleBar(); }, 400);
      } catch (e) { on = false; setBtn(); }
    }
    function stop() {
      if (!on) return; on = false; setBtn();
      if (audio) { const a = audio; fade(a, 0, () => a.pause()); }
      if (ctx) { master.gain.cancelScheduledValues(ctx.currentTime); master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6); }
      clearInterval(timer);
    }
    return { start, stop, toggle: () => (on ? stop() : start()) };
  })();
  $('#musicBtn').addEventListener('click', () => Music.toggle());

  /* ---------- Quản lý cảnh ---------- */
  const order = ['begin', 'story', 'game', 'letter', 'question', 'final'];
  let cur = null, busy = false;

  async function seq(scene) {
    for (const el of $$('.seq', scene)) { el.classList.add('in'); await sleep(calm ? 0 : 750); }
  }

  const hooks = {
    countdown: () => seq($('#scene-countdown')),
    begin: () => seq($('#scene-begin')),
    async story() {
      await type($('#storyP1'), C.story.p1); await sleep(calm ? 0 : 700);
      await type($('#storyP2'), C.story.p2); await sleep(calm ? 0 : 800);
      await type($('#storyP3'), C.story.p3); await sleep(calm ? 0 : 900);
      $('#storyClose').classList.add('in'); await sleep(calm ? 0 : 1100);
      $('#btnStory').classList.add('in');
    },
    game: () => {},
    letter: () => {},
    async question() {
      $('#qLead').classList.add('in'); await sleep(calm ? 0 : 2400);
      $('#qMain').classList.add('in'); await sleep(calm ? 0 : 2400);
      $('#qChoices').classList.add('in');
    },
    final: () => seq($('#scene-final'))
  };

  function go(name) {
    if (busy) return; busy = true;
    const prev = cur; cur = name;
    document.body.dataset.scene = name;
    focus = name === 'question';
    $$('#progress i').forEach((d, i) => d.classList.toggle('on', i <= order.indexOf(name)));
    if (prev) {
      const p = $('#scene-' + prev);
      p.classList.remove('active');
      setTimeout(() => { if (cur !== prev) p.classList.remove('show'); }, 800);
    }
    setTimeout(() => {
      const n = $('#scene-' + name);
      n.classList.add('show'); n.scrollTop = 0;
      void n.offsetWidth; n.classList.add('active');
      hooks[name]();
      busy = false;
    }, prev ? 850 : 0);
  }

  /* ---------- Chuyển cảnh giữa các phần ---------- */
  $('#btnOpen').addEventListener('click', () => { Music.start(); go('story'); });
  $('#btnStory').addEventListener('click', () => go('game'));
  $('#btnGift').addEventListener('click', () => go('letter'));

  /* ---------- Phần 4: bức thư ---------- */
  const envelope = $('#envelope'), paper = $('#paper'), envWrap = $('#envWrap');
  let letterOpened = false;
  async function openEnvelope() {
    if (letterOpened) return; letterOpened = true;
    envelope.classList.add('open');
    await sleep(calm ? 100 : 1300);
    envWrap.classList.add('gone');
    await sleep(calm ? 50 : 700);
    envWrap.hidden = true;
    const body = $('#paperBody'); body.innerHTML = '';
    C.letter.paragraphs.forEach((t, i) => {
      const p = document.createElement('p'); p.className = 'rv'; p.textContent = t;
      if (i === 0) p.classList.add('to');
      if (t === C.letter.highlight) p.classList.add('hl');
      else if ((C.letter.emphasis || []).includes(t)) p.classList.add('em');
      body.appendChild(p);
    });
    $('#paperSign').textContent = C.letter.signature;
    paper.hidden = false; void paper.offsetWidth; paper.classList.add('in');
    for (const p of $$('p', body)) {
      await sleep(calm ? 0 : (p.classList.contains('hl') ? 1500 : 950)); p.classList.add('in');
      p.scrollIntoView({ behavior: calm ? 'auto' : 'smooth', block: 'center' });
    }
    await sleep(calm ? 0 : 1200);
    $('#paperSign').classList.add('in');
    await sleep(calm ? 0 : 1000);
    const b = $('#btnLetter'); b.hidden = false; void b.offsetWidth; b.classList.add('in');
    b.scrollIntoView({ behavior: calm ? 'auto' : 'smooth', block: 'nearest' });
  }
  envelope.addEventListener('click', openEnvelope);
  envelope.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openEnvelope(); } });
  $('#btnLetter').addEventListener('click', () => go('question'));

  /* ---------- Gửi câu trả lời về email (FormSubmit) ---------- */
  const N = C.notify || {};
  if (!N.enabled) $('#qNotice').hidden = true;
  async function notify(finalAnswer) {
    /* Chỉ gửi khi mở qua http/https (file:// không gửi được) */
    if (!N.enabled || !N.email || !/^https?:$/.test(location.protocol)) return;
    const data = {
      _subject: N.subject, _template: 'table', _captcha: 'false',
      'Câu trả lời cuối': finalAnswer,
      'Thời gian': new Date().toLocaleString('vi-VN')
    };
    window.Game.getAnswers().forEach((x, i) => { data['Câu ' + (i + 1)] = x.q + ' → ' + x.a; });
    try {
      await fetch('https://formsubmit.co/ajax/' + encodeURIComponent(N.email), {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data)
      });
    } catch (e) { /* không ảnh hưởng trải nghiệm nếu gửi thất bại */ }
  }

  /* ---------- Phần 5: câu hỏi cuối ---------- */
  function showAnswer(title, text) {
    $('#qPanel').hidden = true;
    const t = $('#ansTitle'); t.textContent = title; t.hidden = !title;
    const box = $('#ansText'); box.innerHTML = '';
    text.split('\n\n').forEach((s) => {
      const p = document.createElement('p'); p.textContent = s; box.appendChild(p);
    });
    const a = $('#qAnswer'); a.hidden = false; void a.offsetWidth; a.classList.add('in');
  }
  $('#btnYes').addEventListener('click', () => { showAnswer(C.question.yesTitle, C.question.yesText); $('#bloom').classList.add('on'); celebrate(); notify(C.question.yes.replace(/\s*♡/, '')); });
  $('#btnLater').addEventListener('click', () => { document.body.classList.add('soft'); showAnswer('', C.question.laterText); notify(C.question.later); });
  $('#btnToFinal').addEventListener('click', () => go('final'));

  /* ---------- Phần 6: xem lại hành trình ---------- */
  function resetAll() {
    $$('.rv, .seq').forEach((e) => e.classList.remove('in'));
    ['#storyP1', '#storyP2', '#storyP3'].forEach((s) => { const e = $(s); stopType(e); e.textContent = ''; });
    letterOpened = false; envelope.classList.remove('open');
    envWrap.hidden = false; envWrap.classList.remove('gone');
    paper.hidden = true; paper.classList.remove('in');
    $('#paperSign').classList.remove('in'); $('#btnLetter').hidden = true;
    $('#qPanel').hidden = false; $('#qAnswer').hidden = true; $('#qAnswer').classList.remove('in');
    document.body.classList.remove('soft'); $('#bloom').classList.remove('on');
    window.Game.reset();
  }
  $('#btnReplay').addEventListener('click', () => { resetAll(); go('begin'); });

  /* ---------- Con trỏ riêng (chỉ desktop, không chặn thao tác) ---------- */
  if (matchMedia('(pointer: fine)').matches) {
    const c = $('#cursor'); let cx = 0, cy = 0, mx = 0, my = 0;
    document.body.classList.add('has-cursor');
    addEventListener('pointermove', (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });
    (function loop() { cx += (mx - cx) * 0.2; cy += (my - cy) * 0.2; c.style.transform = 'translate(' + cx + 'px,' + cy + 'px)'; requestAnimationFrame(loop); })();
  }

  document.addEventListener('pointerover', (e) => document.body.classList.toggle('hov', !!(e.target.closest && e.target.closest('.btn,.opt,.tool,.envelope'))));

  /* ---------- Màn hình loading → bắt đầu ---------- */
  const fontsReady = (document.fonts && document.fonts.ready) || Promise.resolve();
  Promise.all([
    Promise.race([fontsReady, sleep(2500)]),
    new Promise((r) => (document.readyState === 'complete' ? r() : addEventListener('load', r))),
    sleep(calm ? 300 : 2200)
  ]).then(() => {
    $('#loader').classList.add('hide');
    if (window.Countdown.isLocked()) { go('countdown'); window.Countdown.start(() => go('begin')); }
    else go('begin');
  });

  /* Chia sẻ tiện ích cho game.js */
  window.App = { sleep, isCalm: () => calm, type };
})();

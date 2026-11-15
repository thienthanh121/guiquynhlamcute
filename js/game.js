/* ==========================================================================
   game.js – Trò chơi "The Secret of Quỳnh Lam" (3 câu hỏi, không có đáp án sai)
   Dùng nội dung từ CONFIG.game, tiện ích từ window.App (script.js)
   ========================================================================== */
(function () {
  'use strict';
  const $ = (s) => document.querySelector(s);
  const Q = window.CONFIG.game.questions;
  let index = 0, locked = false, answers = [];

  const el = {
    card: $('#quizCard'), q: $('#quizQ'), opts: $('#quizOpts'), fb: $('#quizFb'),
    count: $('#quizCount'), fill: $('#quizFill'), done: $('#quizDone'), bar: document.querySelector('.quiz-bar')
  };

  /* Hiển thị câu hỏi thứ i */
  function render(i) {
    const item = Q[i];
    locked = false;
    el.count.textContent = (i + 1) + '/' + Q.length;
    el.fill.style.width = ((i + 1) / Q.length * 100) + '%';
    el.q.textContent = item.q;
    el.fb.textContent = '';
    el.fb.classList.remove('in');
    el.opts.innerHTML = '';
    item.options.forEach((label, k) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'opt';
      b.textContent = label;
      b.addEventListener('click', () => choose(k, b));
      el.opts.appendChild(b);
    });
    el.card.classList.remove('out');
  }

  /* Người chơi chọn một đáp án */
  async function choose(k, btn) {
    if (locked) return;
    locked = true;
    btn.classList.add('picked');
    answers[index] = { q: Q[index].q, a: Q[index].options[k] };
    [...el.opts.children].forEach((o) => { if (o !== btn) o.classList.add('dim'); });
    el.fb.textContent = Q[index].feedback[k];
    el.fb.classList.add('in');
    await window.App.sleep(window.App.isCalm() ? 700 : 1500);
    el.card.classList.add('out');
    await window.App.sleep(window.App.isCalm() ? 50 : 550);
    index++;
    if (index < Q.length) { render(index); }
    else { finish(); }
  }

  function finish() {
    el.card.hidden = true;
    el.bar.classList.add('full');
    el.done.hidden = false;
    el.done.classList.add('in');
  }

  function reset() {
    index = 0; locked = false; answers = [];
    el.card.hidden = false;
    el.done.hidden = true;
    el.done.classList.remove('in');
    el.bar.classList.remove('full');
    render(0);
  }

  window.Game = { reset, getAnswers: () => answers.slice() };
  reset();
})();

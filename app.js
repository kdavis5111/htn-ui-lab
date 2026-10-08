const sections = {
  news: document.getElementById('news'),
  learn: document.getElementById('learning'),
  about: document.getElementById('about'),
  support: document.getElementById('support'),
  topicsCard: document.getElementById('topics-card'),
  legend: document.querySelector('.legend-row'),
  status: document.getElementById('filter-status'),
};
function show(f, label) {
  const inNews = f !== 'learning' && f !== 'about' && f !== 'support';
  if (window.pageInit) window.scrollTo(0, 0);
  window.pageInit = true;
  sections.news.style.display = inNews ? '' : 'none';
  const strip2 = document.getElementById('cost-strip-2');
  if (strip2) strip2.style.display = inNews ? '' : 'none';
  if (f === 'about' && !window.statsRan) {
    window.statsRan = true;
    const quick = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.querySelectorAll('.stat-num').forEach(el => {
      const target = parseInt(el.dataset.n, 10) || 0;
      const sfx = el.dataset.suffix || '';
      if (quick || target < 2) { el.textContent = target.toLocaleString() + sfx; return; }
      const t0 = performance.now(), dur = 900;
      (function tick(now) {
        const p = Math.min(1, (now - t0) / dur);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString() + sfx;
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
    });
  }
  if (sections.learn) sections.learn.style.display = (f === 'all' || f === 'learning') ? '' : 'none';
  sections.about.style.display = (f === 'about') ? '' : 'none';
  sections.support.style.display = (f === 'support') ? '' : 'none';
  const moreEl = document.getElementById('more-cats');
  if (moreEl && window.interestMode) {
    if (f === 'all' && window.hasBeyond) {
      moreEl.style.display = '';
      ['more-head', 'more-hint'].forEach(id => document.getElementById(id).style.display = '');
      document.getElementById('more-go').style.display = window.moreOpen ? 'none' : '';
      document.getElementById('more-stories').style.display = window.moreOpen ? '' : 'none';
    } else {
      moreEl.style.display = 'none';
    }
  }
  sections.legend.style.display = inNews ? '' : 'none';
  const aiN = document.querySelector('.ai-note');
  if (aiN) aiN.style.display = inNews ? '' : 'none';
  if (sections.topicsCard) sections.topicsCard.style.display = inNews ? '' : 'none';
  const endcapEl = document.querySelector('.endcap');
  if (endcapEl) endcapEl.style.display = inNews ? '' : 'none';
  const yEl = document.querySelector('.yesterday');
  if (yEl) yEl.style.display = inNews ? '' : 'none';
  const n = newsEl.querySelectorAll('.story').length;
  sections.status.textContent = f === 'learning' ? 'Showing daily learning'
    : f === 'about' ? 'Showing the about page'
    : f === 'support' ? 'Showing the donate page'
    : `Showing ${n} ${n === 1 ? 'story' : 'stories'}${f === 'all' ? '' : ' — ' + label}`;
}
document.querySelectorAll('.navchip[data-filter]').forEach(chip => chip.addEventListener('click', () => {
  document.querySelectorAll('.navchip[data-filter]').forEach(c => { c.classList.remove('active'); c.setAttribute('aria-pressed', 'false'); });
  const topChip = document.querySelector('.nav .navchip[data-filter="' + chip.dataset.filter + '"]') || chip;
  topChip.classList.add('active');
  topChip.setAttribute('aria-pressed', 'true');
  show(chip.dataset.filter, chip.textContent);
  window.scrollTo({ top: 0, behavior: SMOOTH });
}));
// Theme defaults to light; remember the reader's explicit choice when storage is available.
const themeToggle = document.getElementById('theme-toggle');
const themeToggleLabel = themeToggle && themeToggle.querySelector('.theme-switch-label');
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  if (themeToggle) {
    themeToggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    if (themeToggleLabel) themeToggleLabel.textContent = theme === 'dark' ? 'Light mode' : 'Dark mode';
  }
  try { localStorage.setItem('htn-theme', theme); } catch (e) {}
}
if (themeToggle) {
  const currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  themeToggle.setAttribute('aria-pressed', currentTheme === 'dark' ? 'true' : 'false');
  if (themeToggleLabel) themeToggleLabel.textContent = currentTheme === 'dark' ? 'Light mode' : 'Dark mode';
  themeToggle.addEventListener('click', () => {
    const nextTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  });
}
const wrapEl = document.querySelector('.wrap');
const briefDate = wrapEl.dataset.date;
const newsEl = document.getElementById('news');
function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
function lsSet(k, v) { try { localStorage.setItem(k, v); return localStorage.getItem(k) === v; } catch (e) { return false; } }
function lsDel(k) { try { localStorage.removeItem(k); } catch (e) {} }
const SMOOTH = (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) ? 'auto' : 'smooth';
window.pickedMode = false;
function applyPicks(order) {
  const chosen = order.map(id => document.getElementById(id)).filter(Boolean);
  if (!chosen.length) return false;
  const band = document.createElement('section');
  band.className = 'cat-band picked-band';
  band.innerHTML = '<h2 class="cat-head">Your picks<span class="cat-count">' + chosen.length +
    (chosen.length === 1 ? ' story' : ' stories') + '</span></h2>';
  chosen.forEach(a => band.appendChild(a));
  newsEl.insertBefore(band, newsEl.firstChild);
  [...newsEl.querySelectorAll(':scope > .cat-band')].forEach(b => {
    if (b !== band && !b.querySelector('.story')) b.remove();
  });
  window.pickedMode = true;
  window.interestMode = false;
  const mc = document.getElementById('more-cats');
  if (mc) mc.style.display = 'none';
  return true;
}
const ALLCATS = [["world", "World"], ["nation", "National"], ["weather", "Weather"], ["sports", "Sports"], ["politics", "Politics"], ["ai", "Technology"], ["boxoffice", "Box Office"], ["banking", "Business"], ["health", "Health"], ["breakthroughs", "Science"], ["entertainment", "Pop Culture"], ["extras", "Extras"]];
const CATLABEL = {};
ALLCATS.forEach(p => CATLABEL[p[0]] = p[1]);
window.interestMode = false;
window.moreOpen = false;
function applyInterestLayout(order) {
  if (order === 'all' || !Array.isArray(order) || !order.length) {
    order = ALLCATS.map(p => p[0]);
  }
  const moreEl = document.getElementById('more-cats');
  const moreBox = document.getElementById('more-stories');
  const all = [...newsEl.querySelectorAll(':scope > .cat-band')];
  const extrasBand = document.getElementById('extras');
  if (extrasBand && order.indexOf('extras') < 0) extrasBand.style.display = 'none';
  const stale = document.getElementById('no-topics-note');
  if (stale) stale.remove();
  const inSet = all.filter(b => order.indexOf(b.dataset.category) >= 0);
  const beyond = all.filter(b => order.indexOf(b.dataset.category) < 0 && b.dataset.category !== 'extras');
  const newsInSet = inSet.filter(b => b.dataset.category !== 'extras');
  if (!newsInSet.length) {
    if (all.length && !document.getElementById('no-topics-note')) {
      const n = document.createElement('p');
      n.id = 'no-topics-note';
      n.className = 'triage-hint';
      n.textContent = 'None of your topics have stories today — here is everything.';
      newsEl.insertBefore(n, newsEl.firstChild);
    }
    if (extrasBand && extrasBand.style.display !== 'none') newsEl.appendChild(extrasBand);
    return;
  }
  inSet.sort((a, b) => order.indexOf(a.dataset.category) - order.indexOf(b.dataset.category));
  inSet.forEach(b => newsEl.appendChild(b));
  window.interestMode = true;
  window.hasBeyond = beyond.length > 0;
  const nIn = inSet.reduce((n, b) => n + b.querySelectorAll('.story').length, 0);
  const nBeyond = beyond.reduce((n, b) => n + b.querySelectorAll('.story').length, 0);
  if (beyond.length) {
    beyond.forEach(b => moreBox.appendChild(b));
    moreEl.style.display = '';
    document.getElementById('more-go').textContent = 'Keep reading — ' + nBeyond + (nBeyond === 1 ? ' more story' : ' more stories');
  } else {
    moreEl.style.display = 'none';
  }
}
document.getElementById('more-go').addEventListener('click', () => {
  window.moreOpen = true;
  document.getElementById('more-stories').style.display = '';
  document.getElementById('more-go').style.display = 'none';
});
function finishSetup(order) {
  lsSet('db-extras-migrated', '1');
  lsSet('db-interests', JSON.stringify(order.slice()));
  if (!lsGet('db-picks-' + briefDate)) lsSet('db-picks-' + briefDate, 'all');
  const t = document.getElementById('interests-setup');
  if (t) t.style.display = 'none';
  [sections.news, sections.learn, sections.legend,
   document.querySelector('.ai-note'),
   document.getElementById('more-cats'), document.querySelector('.masthead'),
   document.getElementById('topics-card'), document.getElementById('cost-strip'),
   document.querySelector('.nav'), document.getElementById('cost-strip-2'),
   document.querySelector('.endcap'), document.querySelector('.yesterday')]
    .forEach(el => { if (el) el.style.display = ''; });
  const inv = document.getElementById('invite-card');
  if (inv) inv.remove();
  applyInterestLayout(order.length ? order : 'all');
  // "Show my paper" always lands on the feed — sync the nav chips to match.
  document.querySelectorAll('.navchip[data-filter]').forEach(c => {
    const on = c.dataset.filter === 'all';
    c.classList.toggle('active', on);
    c.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
  setTimeout(placeFeedCards, 0);
  window.scrollTo(0, 0);
}
let wizardReturnFilter = 'all';
function exitInterestSetup() {
  // Back without saving: restore the page the reader came from.
  const t = document.getElementById('interests-setup');
  if (t) t.style.display = 'none';
  [sections.news, sections.learn, sections.legend,
   document.querySelector('.ai-note'),
   document.getElementById('more-cats'), document.querySelector('.masthead'),
   document.getElementById('topics-card'), document.getElementById('cost-strip'),
   document.querySelector('.nav'), document.getElementById('cost-strip-2'),
   document.querySelector('.endcap'), document.querySelector('.yesterday')]
    .forEach(el => { if (el) el.style.display = ''; });
  const chip = [...document.querySelectorAll('.navchip[data-filter]')]
    .find(c => c.dataset.filter === wizardReturnFilter);
  if (chip) chip.click();
}
function showInterestSetup() {
  const active = document.querySelector('.navchip.active[data-filter]');
  wizardReturnFilter = (active && active.dataset.filter) || 'all';
  const t = document.getElementById('interests-setup');
  [sections.news, sections.learn, sections.legend, sections.about, sections.support,
   document.querySelector('.ai-note'),
   document.getElementById('more-cats'), document.querySelector('.masthead'),
   document.getElementById('topics-card'), document.getElementById('cost-strip'),
   document.querySelector('.nav'), document.getElementById('cost-strip-2'),
   document.querySelector('.endcap'), document.querySelector('.yesterday')]
    .forEach(el => { if (el) el.style.display = 'none'; });
  const step1 = document.getElementById('int-step1');
  const step2 = document.getElementById('int-step2');
  const selGrid = document.getElementById('int-select-grid');
  const ordList = document.getElementById('int-order-list');
  const nextBtn = document.getElementById('int-next');
  const label = {};
  ALLCATS.forEach(pair => label[pair[0]] = pair[1]);
  let hasSaved = false;
  try { const v = JSON.parse(lsGet('db-interests') || 'null'); hasSaved = Array.isArray(v) && v.length > 0; } catch (e) {}
  const selected = [];
  const order = [];
  let seeded = false;
  try {
    const d = JSON.parse(lsGet('db-int-draft') || 'null');
    if (d && Array.isArray(d.sel)) { selected.push(...d.sel); if (Array.isArray(d.ord)) order.push(...d.ord); seeded = true; }
  } catch (e) {}
  if (!seeded) {
    try {
      const cur = JSON.parse(lsGet('db-interests') || '[]');
      if (Array.isArray(cur)) { selected.push(...cur); order.push(...cur); }
    } catch (e) {}
  }
  const validCats = ALLCATS.map(p => p[0]);
  for (let i = selected.length - 1; i >= 0; i--) if (validCats.indexOf(selected[i]) < 0) selected.splice(i, 1);
  for (let i = order.length - 1; i >= 0; i--) if (validCats.indexOf(order[i]) < 0) order.splice(i, 1);
  function saveDraft() {
    lsSet('db-int-draft', JSON.stringify({ sel: selected, ord: order }));
  }
  function clearDraft() { lsDel('db-int-draft'); }

  function renderStep1() {
    step2.style.display = 'none';
    step1.style.display = '';
    selGrid.innerHTML = '';
    ALLCATS.forEach(pair => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'int-chip'; b.dataset.cat = pair[0];
      const picked = selected.indexOf(pair[0]) >= 0;
      b.setAttribute('aria-pressed', picked ? 'true' : 'false');
      const num = document.createElement('span'); num.className = 'int-num';
      num.textContent = picked ? '✓' : '';
      b.classList.toggle('picked', picked);
      b.appendChild(num); b.appendChild(document.createTextNode(pair[1]));
      b.addEventListener('click', () => {
        const i = selected.indexOf(pair[0]);
        if (i >= 0) selected.splice(i, 1); else selected.push(pair[0]);
        b.classList.toggle('picked', i < 0);
        b.setAttribute('aria-pressed', i < 0 ? 'true' : 'false');
        num.textContent = i < 0 ? '✓' : '';
        saveDraft();
        refreshNext();
      });
      selGrid.appendChild(b);
    });
    refreshNext();
  }
  function refreshNext() {
    nextBtn.style.display = selected.length ? '' : 'none';
  }
  function flip(fn) {
    const before = new Map([...ordList.children].map(b => [b.dataset.cat, b.getBoundingClientRect().top]));
    fn();
    [...ordList.children].forEach(b => {
      const prev = before.get(b.dataset.cat);
      if (prev == null) return;
      const delta = prev - b.getBoundingClientRect().top;
      if (!delta) return;
      b.style.transition = 'none';
      b.style.transform = 'translateY(' + delta + 'px)';
      requestAnimationFrame(() => {
        b.style.transition = 'transform 180ms ease';
        b.style.transform = '';
        setTimeout(() => { b.style.transition = ''; }, 240);
      });
    });
  }
  function renumberFromDom() {
    const kids = [...ordList.children];
    kids.forEach((b, i) => {
      b.querySelector('.ord-num').textContent = String(i + 1);
      const btns = b.querySelectorAll('.ord-arrows button');
      if (btns[0]) btns[0].disabled = i === 0;
      if (btns[1]) btns[1].disabled = i === kids.length - 1;
    });
  }
  function moveCat(cat, dir) {
    const i = order.indexOf(cat);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= order.length) return;
    order.splice(i, 1); order.splice(j, 0, cat);
    saveDraft();
    flip(paintOrder);
    const moved = [...ordList.children].find(b => b.dataset.cat === cat);
    if (moved) {
      const btns = moved.querySelectorAll('.ord-arrows button');
      const primaryBtn = dir < 0 ? btns[0] : btns[1];
      const altBtn = dir < 0 ? btns[1] : btns[0];
      const target = (primaryBtn && !primaryBtn.disabled) ? primaryBtn : altBtn;
      if (target) target.focus();
    }
  }
  function paintOrder() {
    ordList.innerHTML = '';
    order.forEach((cat, i) => {
      const bar = document.createElement('div');
      bar.className = 'ord-bar'; bar.dataset.cat = cat;
      const num = document.createElement('span'); num.className = 'ord-num'; num.textContent = String(i + 1);
      const lab = document.createElement('span'); lab.className = 'ord-label'; lab.textContent = label[cat] || cat;
      const arrows = document.createElement('span'); arrows.className = 'ord-arrows';
      const up = document.createElement('button'); up.type = 'button'; up.textContent = '▲';
      up.setAttribute('aria-label', 'Move ' + (label[cat] || cat) + ' up'); up.disabled = i === 0;
      up.onclick = () => moveCat(cat, -1);
      const down = document.createElement('button'); down.type = 'button'; down.textContent = '▼';
      down.setAttribute('aria-label', 'Move ' + (label[cat] || cat) + ' down'); down.disabled = i === order.length - 1;
      down.onclick = () => moveCat(cat, 1);
      arrows.appendChild(up); arrows.appendChild(down);
      bar.appendChild(num); bar.appendChild(lab); bar.appendChild(arrows);
      ordList.appendChild(bar);
    });
  }
  let drag = null;
  function endDrag() {
    if (!drag) return;
    drag.bar.style.transform = '';
    drag.bar.classList.remove('dragging');
    order.length = 0;
    [...ordList.children].forEach(b => order.push(b.dataset.cat));
    saveDraft();
    flip(paintOrder);
    drag = null;
  }
  let pending = null;
  function clearPending() {
    if (pending) { clearTimeout(pending.t); pending = null; }
  }
  function activateDrag(bar, pid, y) {
    try { bar.setPointerCapture(pid); } catch (err) {}
    drag = { bar, pid, baseY: y, step: bar.offsetHeight + 8 };
    bar.classList.add('dragging');
  }
  ordList.addEventListener('pointerdown', (e) => {
    if (drag || pending) return;
    const bar = e.target.closest('.ord-bar');
    if (!bar || e.target.closest('.ord-arrows')) return;
    if (e.pointerType === 'mouse') {
      e.preventDefault();
      activateDrag(bar, e.pointerId, e.clientY);
      return;
    }
    // touch: a quick swipe scrolls the page; holding still ~a quarter second lifts the bar
    pending = { bar, pid: e.pointerId, x: e.clientX, y: e.clientY,
      t: setTimeout(() => {
        if (!pending) return;
        activateDrag(pending.bar, pending.pid, pending.y);
        pending = null;
      }, 220) };
  });
  ordList.addEventListener('touchmove', (e) => { if (drag) e.preventDefault(); }, { passive: false });
  ordList.addEventListener('pointermove', (e) => {
    if (pending && e.pointerId === pending.pid) {
      if (Math.abs(e.clientY - pending.y) > 8 || Math.abs(e.clientX - pending.x) > 8) clearPending();
      return;
    }
    if (!drag || e.pointerId !== drag.pid) return;
    let dy = e.clientY - drag.baseY;
    while (dy < -drag.step / 2 && drag.bar.previousElementSibling) {
      const shift = drag.bar.previousElementSibling.offsetHeight + 8;
      ordList.insertBefore(drag.bar, drag.bar.previousElementSibling);
      drag.baseY -= shift; dy += shift;
      renumberFromDom();
    }
    while (dy > drag.step / 2 && drag.bar.nextElementSibling) {
      const shift = drag.bar.nextElementSibling.offsetHeight + 8;
      ordList.insertBefore(drag.bar.nextElementSibling, drag.bar);
      drag.baseY += shift; dy -= shift;
      renumberFromDom();
    }
    drag.bar.style.transform = 'translateY(' + dy + 'px)';
  });
  const endDragIfMine = (e) => {
    if (pending && e.pointerId === pending.pid) clearPending();
    if (drag && e.pointerId === drag.pid) endDrag();
  };
  ordList.addEventListener('pointerup', endDragIfMine);
  ordList.addEventListener('pointercancel', endDragIfMine);
  window.addEventListener('scroll', endDrag, { passive: true });
  function renderStep2() {
    step1.style.display = 'none';
    step2.style.display = '';
    for (let i = order.length - 1; i >= 0; i--) if (selected.indexOf(order[i]) < 0) order.splice(i, 1);
    selected.filter(c => order.indexOf(c) < 0)
      .sort((a, b) => validCats.indexOf(a) - validCats.indexOf(b))
      .forEach(c => order.push(c));
    saveDraft();
    paintOrder();
    window.scrollTo(0, 0);
  }
  nextBtn.onclick = () => {
    if (!selected.length) return;
    if (selected.length < 2) { clearDraft(); finishSetup(selected.slice()); return; }
    renderStep2();
  };
  document.getElementById('int-back').onclick = renderStep1;
  document.getElementById('int-done').onclick = () => {
    clearDraft();
    finishSetup(order);
  };
  const allBtn = document.getElementById('int-all');
  allBtn.onclick = () => {
    clearDraft();
    finishSetup(ALLCATS.map(pair => pair[0]));
  };
  document.getElementById('int-back1').onclick = exitInterestSetup;
  renderStep1();
  t.style.display = '';
  window.scrollTo(0, 0);
}
['edit-topics', 'edit-topics-2', 'nav-topics', 'nav-topics-m'].forEach(id => {
  const b = document.getElementById(id);
  if (b) b.addEventListener('click', showInterestSetup);
});
(function () {
  const lb = document.createElement('figure');
  lb.id = 'lightbox'; lb.hidden = true; lb.style.margin = '0';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.setAttribute('aria-label', 'Enlarged image — press Escape or click to close');
  lb.tabIndex = -1;
  lb.innerHTML = '<img alt=""><figcaption></figcaption>';
  document.body.appendChild(lb);
  const lbImg = lb.querySelector('img'), lbCap = lb.querySelector('figcaption');
  let lastTrigger = null;
  const SEL = '.impact-thumb img, .extra-figure img, .movie-figure img, .media-figure img, .actor-fig img, .say-card .say-photo';
  document.querySelectorAll(SEL).forEach(img => {
    img.tabIndex = 0;
    img.setAttribute('role', 'button');
    img.setAttribute('aria-label', 'View larger: ' + (img.alt || 'image'));
  });
  const openLb = (img) => {
    lastTrigger = img;
    lbImg.src = img.src; lbImg.alt = img.alt || '';
    const fig = img.closest('figure');
    const cap = fig && fig.querySelector('figcaption');
    lbCap.textContent = (cap && cap.textContent.trim()) || img.title || img.alt || '';
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    lb.focus();
  };
  document.addEventListener('click', (e) => {
    const img = e.target.closest(SEL);
    if (!img) return;
    e.preventDefault();
    openLb(img);
  });
  document.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches(SEL)) {
      e.preventDefault();
      openLb(e.target);
    }
  });
  const closeLb = () => {
    lb.hidden = true; lbImg.src = ''; document.body.style.overflow = '';
    if (lastTrigger) { lastTrigger.focus(); lastTrigger = null; }
  };
  lb.addEventListener('click', closeLb);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !lb.hidden) closeLb(); });
})();
if (new URLSearchParams(location.search).get('thanks')) {
  const sup = document.getElementById('support');
  if (sup) {
    const c = document.createElement('div');
    c.className = 'thanks-card';
    c.innerHTML = '<p class="thanks-head">Thank you. Truly.</p>'
      + '<p class="thanks-sub">Your support runs tomorrow&rsquo;s paper. If you chose to be thanked by name, you&rsquo;ll appear with the next edition.</p>';
    sup.insertBefore(c, sup.firstChild.nextSibling);
    const chip = [...document.querySelectorAll('.navchip[data-filter]')].find(x => x.dataset.filter === 'support');
    if (chip) chip.click();
  }
}
if (new URLSearchParams(location.search).get('donate')) {
  const chip = [...document.querySelectorAll('.navchip[data-filter]')].find(c => c.dataset.filter === 'support');
  if (chip) chip.click();
}
document.querySelectorAll('.js-support-jump').forEach(el => el.addEventListener('click', (e) => {
  e.preventDefault();
  const chip = [...document.querySelectorAll('.navchip[data-filter]')].find(c => c.dataset.filter === 'support');
  if (chip) chip.click();
}));
document.querySelectorAll('.js-about-jump').forEach(el => el.addEventListener('click', (e) => {
  e.preventDefault();
  const chip = [...document.querySelectorAll('.navchip[data-filter]')].find(c => c.dataset.filter === 'about');
  if (chip) chip.click();
}));
(function () {
  const go = document.getElementById('tt-go');
  const d = document.getElementById('tt-date');
  if (!go || !d) return;
  const label = go.textContent;
  go.addEventListener('click', () => {
    if (!d.value) return;
    go.disabled = true;
    go.classList.add('tt-loading');
    go.textContent = 'Opening that morning…';
    location.href = 'https://heresthe.news/editions/' + d.value + '/';
  });
  // back/forward cache restores the page mid-"loading" — reset the button
  window.addEventListener('pageshow', () => {
    go.disabled = false;
    go.classList.remove('tt-loading');
    go.textContent = label;
  });
})();
function openHashTarget() {
  const id = location.hash.slice(1);
  if (!id) return;
  const setup = document.getElementById('interests-setup');
  if (setup && setup.style.display !== 'none') return;
  const el = document.getElementById(id);
  if (!el || !el.classList.contains('story')) return;
  const mb = el.closest('#more-stories');
  if (mb) {
    window.moreOpen = true;
    const mc = document.getElementById('more-cats');
    if (mc) mc.style.display = '';
    mb.style.display = '';
    const go = document.getElementById('more-go');
    if (go) go.style.display = 'none';
  }
  const bm = el.closest('.band-more');
  if (bm && bm.hidden) {
    bm.hidden = false;
    const btn = bm.nextElementSibling;
    if (btn && btn.classList.contains('band-more-btn')) btn.textContent = 'Show fewer';
  }
  el.open = true;
  el.scrollIntoView();
}
window.addEventListener('hashchange', openHashTarget);
document.querySelectorAll('.punchline').forEach(d => d.addEventListener('toggle', () => {
  if (d.open) {
    const p = d.querySelector('.joke-punch');
    if (p) { p.setAttribute('tabindex', '-1'); p.focus(); }
  }
}));
document.querySelectorAll('.bo-tabs:not(.bo-axes)').forEach(tabs => {
  tabs.addEventListener('click', (e) => {
    const btn = e.target.closest('.bo-tab');
    if (!btn) return;
    tabs.querySelectorAll('.bo-tab').forEach(b => b.classList.toggle('picked', b === btn));
    const body = tabs.closest('.story-body');
    body.querySelectorAll('.bo-chart').forEach(c => { c.hidden = c.dataset.view !== btn.dataset.view; });
  });
});
// Two-axis box office: Daily|Gross × Domestic|Global. Daily has no worldwide
// data, so picking Daily snaps to Domestic and disables Global.
document.querySelectorAll('.bo-axes').forEach(ax => {
  const body = ax.closest('.story-body');
  function apply() {
    const a = ax.dataset.a, b = ax.dataset.b;
    const view = (a === 'partial') ? 'partial-dom' : a + '-' + b;
    ax.querySelectorAll('[data-a]').forEach(x => x.classList.toggle('picked', x.dataset.a === a));
    ax.querySelectorAll('[data-b]').forEach(x => {
      x.classList.toggle('picked', x.dataset.b === b);
      if (x.dataset.b === 'ww') x.disabled = (a !== 'gross');
    });
    body.querySelectorAll('.bo-chart').forEach(c => { c.hidden = c.dataset.view !== view; });
    const asof = body.querySelector('.bo-asof');
    const vis = body.querySelector('.bo-chart:not([hidden])');
    if (asof && vis) {
      asof.textContent = vis.dataset.asof || '';
      asof.hidden = !vis.dataset.asof;
    }
  }
  ax.addEventListener('click', (e) => {
    const btn = e.target.closest('.bo-tab');
    if (!btn || btn.disabled) return;
    if (btn.dataset.a) {
      ax.dataset.a = btn.dataset.a;
      if (btn.dataset.a !== 'gross') ax.dataset.b = 'dom';
    }
    if (btn.dataset.b) ax.dataset.b = btn.dataset.b;
    apply();
  });
  apply();
});
if (false) { // UI Lab: service worker disabled so the lab never caches like the real site
  window.addEventListener('load', () => { navigator.serviceWorker.register('/sw.js').catch(() => {}); });
}
(function installNudge() {
  const card = document.getElementById('install-card');
  if (!card) return;
  const standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
  if (standalone || lsGet('db-install-dismissed')) return;
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
  let deferred = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferred = e;
    card.hidden = false;
    card.querySelector('.install-do').hidden = false;
  });
  if (ios) card.hidden = false;
  const doBtn = card.querySelector('.install-do');
  if (doBtn) doBtn.addEventListener('click', async () => {
    if (!deferred) return;
    deferred.prompt();
    await deferred.userChoice;
    deferred = null;
    card.hidden = true;
  });
  card.querySelector('.install-no').addEventListener('click', () => {
    lsSet('db-install-dismissed', '1');
    card.hidden = true;
  });
})();
(function meFold() {
  const more = document.getElementById('me-more');
  const btn = document.getElementById('me-toggle');
  if (!more || !btn) return;
  btn.addEventListener('click', () => {
    const open = more.classList.toggle('open');
    btn.textContent = open ? 'Read less' : 'Read more';
  });
})();
async function copyText(t) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try { await navigator.clipboard.writeText(t); return; } catch (e) {}
  }
  const ta = document.createElement('textarea');
  ta.value = t; ta.style.position = 'fixed'; ta.style.opacity = '0';
  document.body.appendChild(ta); ta.select();
  try {
    if (!document.execCommand('copy')) throw new Error('copy failed');
  } finally { ta.remove(); }
}
document.querySelectorAll('.share-btn').forEach(b => b.addEventListener('click', async () => {
  const story = b.closest('.story');
  const headline = (story.querySelector('.headline') || { textContent: '' }).textContent.trim();
  const url = location.origin + '/editions/' + briefDate + '/#' + story.id;
  const text = headline + '\n\nClick to read:';
  if (navigator.share) {
    try { await navigator.share({ title: 'HeresThe.News', text: text, url: url }); return; }
    catch (e) { if (e && e.name === 'AbortError') return; }
  }
  try {
    await copyText(text + ' ' + url);
    const old = b.textContent;
    b.textContent = 'Link copied ✓';
    setTimeout(() => { b.textContent = old; }, 1600);
  } catch (e) {}
}));
// One shared legend node; the chevron on any "The facts" head moves it there.
const factsLegend = document.createElement('div');
factsLegend.className = 'facts-legend';
factsLegend.setAttribute('role', 'note');
factsLegend.innerHTML =
  '<span><i class="s-v" aria-hidden="true">&#9679;</i> verified — multiple independent outlets or a primary source</span>'
  + '<span><i class="s-r" aria-hidden="true">&#9675;</i> reported — a single source so far</span>'
  + '<span><i class="s-d" aria-hidden="true">&#9680;</i> disputed — sources conflict</span>'
  + '<span><i class="s-g" aria-hidden="true">&#9684;</i> developing — fast-moving, may change</span>';
document.querySelectorAll('.fh-info').forEach(b => b.addEventListener('click', () => {
  const head = b.closest('.facts-head');
  const wasHere = head.nextElementSibling === factsLegend;
  if (factsLegend.parentNode) factsLegend.parentNode.removeChild(factsLegend);
  document.querySelectorAll('.fh-info.open').forEach(o => {
    o.classList.remove('open'); o.setAttribute('aria-expanded', 'false');
  });
  if (!wasHere) {
    head.after(factsLegend);
    b.classList.add('open');
    b.setAttribute('aria-expanded', 'true');
  }
}));
document.querySelectorAll('.band-more-btn').forEach(b => {
  b.dataset.label = b.textContent;
  b.addEventListener('click', () => {
    const box = b.previousElementSibling;
    if (!box || !box.classList.contains('band-more')) return;
    const nowHidden = !box.hidden;
    box.hidden = nowHidden;
    b.textContent = nowHidden ? b.dataset.label : 'Show fewer';
  });
});
(function initLeagues() {
  const folds = [...document.querySelectorAll('.lg-fold')];
  const setup = document.getElementById('lg-setup');
  if (!folds.length || !setup) return;
  const holder = document.getElementById('lg-folds');
  const editBtn = document.getElementById('lg-edit');
  const doneBtn = document.getElementById('lg-done');
  const allBtn = document.getElementById('lg-all');
  const chips = [...setup.querySelectorAll('.lg-pick .lg-chip')];
  let order = null;
  try {
    const raw = lsGet('db-league-order') || lsGet('db-leagues');
    const p = JSON.parse(raw || 'null');
    if (p === 'all') order = 'all';
    else if (Array.isArray(p) && p.length) order = p;
  } catch (e) {}
  function apply() {
    if (order === 'all' || !order) {
      folds.forEach(f => { f.style.display = ''; });
    } else {
      folds.forEach(f => { f.style.display = order.indexOf(f.dataset.league) >= 0 ? '' : 'none'; });
      const byLg = {};
      folds.forEach(f => byLg[f.dataset.league] = f);
      order.forEach(lg => { if (byLg[lg]) holder.appendChild(byLg[lg]); });
      const visible = folds.filter(f => f.style.display !== 'none');
      if (visible.length === 1) visible[0].open = true;
      const have = folds.map(f => f.dataset.league);
      const missing = order.filter(lg => have.indexOf(lg) < 0);
      let note = document.getElementById('lg-nogames');
      if (missing.length) {
        if (!note) {
          note = document.createElement('p');
          note.id = 'lg-nogames';
          note.className = 'carried-note';
          holder.appendChild(note);
        }
        note.textContent = 'No ' + missing.join(', ') + ' games this morning.';
      } else if (note) {
        note.remove();
      }
    }
    setup.hidden = true;
    holder.style.display = '';
    editBtn.hidden = false;
  }
  function showSetup() {
    const sel = (order === 'all' || !order) ? [] : order.slice();
    setup.hidden = false;
    holder.style.display = 'none';
    editBtn.hidden = true;
    function paint() {
      chips.forEach(c => {
        const i = sel.indexOf(c.dataset.league);
        c.classList.toggle('picked', i >= 0);
        c.querySelector('.lg-num').textContent = i >= 0 ? String(i + 1) : '';
      });
      doneBtn.hidden = !sel.length;
    }
    chips.forEach(c => {
      c.onclick = () => {
        const i = sel.indexOf(c.dataset.league);
        if (i >= 0) sel.splice(i, 1); else sel.push(c.dataset.league);
        paint();
      };
    });
    doneBtn.onclick = () => {
      const everything = sel.length === chips.length;
      order = everything ? 'all' : sel.slice();
      lsSet('db-league-order', everything ? '"all"' : JSON.stringify(order));
      apply();
    };
    allBtn.onclick = () => {
      sel.length = 0;
      chips.forEach(c => sel.push(c.dataset.league));
      paint();
    };
    paint();
  }
  editBtn.onclick = showSetup;
  if (order) apply(); else showSetup();
})();
(function rosterCollapse() {
  const t = document.getElementById('roster-table');
  const btn = document.getElementById('roster-more');
  if (!t || !btn) return;
  const rows = [...t.querySelectorAll('tbody tr')];
  if (rows.length <= 9) return;
  // Balanced sampler: every lean band stays visible with its first two sources,
  // so the collapsed view spans left-to-right instead of stopping at the first
  // few bands (which read as an all-left roster and belied the balance claim).
  let inBandCount = 0;
  let hidden = 0;
  rows.forEach(r => {
    if (r.classList.contains('lean-row')) {
      inBandCount = 0;
      return;
    }
    inBandCount += 1;
    if (inBandCount > 2) {
      r.style.display = 'none';
      hidden += 1;
    }
  });
  if (!hidden) return;
  btn.hidden = false;
  btn.addEventListener('click', () => {
    rows.forEach(r => { r.style.display = ''; });
    btn.remove();
  });
})();
function markSubscribed(card) {
  lsSet('db-signup-dismissed', '1');
  const form = card.querySelector('.signup-form');
  if (form) {
    const done = document.createElement('p');
    done.className = 'signup-sub';
    done.innerHTML = '<b>Check your inbox to confirm.</b> See you tomorrow morning.';
    form.replaceWith(done);
  }
}
function wireSignupForm(card) {
  const form = card.querySelector('.signup-form');
  if (!form) return;
  form.addEventListener('submit', () => {
    // the form posts to Buttondown in a new tab; this page swaps to a confirmation
    setTimeout(() => {
      document.querySelectorAll('.signup-card').forEach(c => markSubscribed(c));
    }, 60);
  });
}
function placeFeedSignup() {
  const src = document.getElementById('email-signup');
  if (!src) return;
  wireSignupForm(src);
  if (lsGet('db-signup-dismissed')) return;
  if (topicsInviteEligible()) return;  // "Make it yours" leads for new visitors
  if (location.hash && document.getElementById(location.hash.slice(1))) return;
  const old = document.getElementById('email-signup-feed');
  if (old) old.remove();
  const bands = [...newsEl.querySelectorAll('.cat-band')].filter(b => b.style.display !== 'none');
  if (!bands.length) return;
  const card = src.cloneNode(true);
  card.id = 'email-signup-feed';
  card.classList.add('in-feed');
  const x = document.createElement('button');
  x.type = 'button';
  x.className = 'signup-x';
  x.setAttribute('aria-label', 'Hide this from the feed');
  x.textContent = '−';
  x.addEventListener('click', () => {
    // one promo per visit: dismissing pauses the deck until tomorrow
    lsSet('db-signup-dismissed', '1');
    lsSet('db-promo-paused', briefDate);
    card.remove();
    src.style.display = '';
  });
  card.appendChild(x);
  wireSignupForm(card);
  if (supportFeedEligible()) card.classList.add('has-behind');
  bands[0].after(card);
  src.style.display = 'none';  // one email ask per view, never two
}
// Support strip, second card in the deck: shows once the email card is gone.
// Its minus dismisses it for good; the bottom-of-feed copy always stays.
function supportFeedEligible() {
  if (lsGet('db-support-dismissed')) return false;
  if (lsGet('db-promo-paused') === briefDate) return false;
  if (topicsInviteEligible()) return false;
  if (!document.getElementById('cost-strip-2')) return false;
  if (location.hash && document.getElementById(location.hash.slice(1))) return false;
  return true;
}
function placeSupportFeed() {
  const old = document.getElementById('support-feed');
  if (old) old.remove();
  if (!supportFeedEligible()) return;
  const mailShowing = document.getElementById('email-signup') && !lsGet('db-signup-dismissed');
  if (mailShowing) return;
  const bands = [...newsEl.querySelectorAll('.cat-band')].filter(b => b.style.display !== 'none');
  if (!bands.length) return;
  const card = document.getElementById('cost-strip-2').cloneNode(true);
  card.id = 'support-feed';
  card.classList.add('support-feed');
  const x = document.createElement('button');
  x.type = 'button';
  x.className = 'signup-x';
  x.setAttribute('aria-label', 'Hide this from the feed');
  x.textContent = '−';
  x.addEventListener('click', () => {
    lsSet('db-support-dismissed', '1');
    lsSet('db-promo-paused', briefDate);
    card.remove();
  });
  card.appendChild(x);
  card.querySelectorAll('.js-support-jump').forEach(el => el.addEventListener('click', (e) => {
    e.preventDefault();
    const chip = [...document.querySelectorAll('.navchip[data-filter]')].find(c => c.dataset.filter === 'support');
    if (chip) chip.click();
  }));
  if (topicsInviteEligible()) card.classList.add('has-behind');
  bands[0].before(card);
}
// Topic-picker card: sits BEHIND the email card (deck-style). It only appears
// once the email card is gone — dismissed or ineligible — and its own minus
// dismisses it for good. Never shown to readers with saved topics.
function topicsInviteEligible() {
  const src = document.getElementById('topics-invite');
  if (!src || src.dataset.off) return false;
  if (lsGet('db-promo-paused') === briefDate) return false;
  if (lsGet('db-interests') !== null || lsGet('db-invite-dismissed')) return false;
  if (location.hash && document.getElementById(location.hash.slice(1))) return false;
  return true;
}
function placeTopicsInvite() {
  const old = document.getElementById('topics-invite-feed');
  if (old) old.remove();
  if (!topicsInviteEligible()) return;
  const bands = [...newsEl.querySelectorAll('.cat-band')].filter(b => b.style.display !== 'none');
  if (!bands.length) return;
  const card = document.getElementById('topics-invite').cloneNode(true);
  card.id = 'topics-invite-feed';
  card.hidden = false;
  card.classList.add('in-feed');
  const x = document.createElement('button');
  x.type = 'button';
  x.className = 'signup-x';
  x.setAttribute('aria-label', 'Hide this from the feed');
  x.textContent = '−';
  x.addEventListener('click', () => {
    lsSet('db-invite-dismissed', '1');
    lsSet('db-promo-paused', briefDate);
    card.remove();
  });
  card.appendChild(x);
  card.querySelector('.topics-go').addEventListener('click', showInterestSetup);
  if (document.getElementById('email-signup') && !lsGet('db-signup-dismissed')) card.classList.add('has-behind');
  bands[0].after(card);
}
function placeFeedCards() {
  placeTopicsInvite();
  placeFeedSignup();
  placeSupportFeed();
}
(function initFlow() {
  if (!newsEl) return;
  const storageOK = lsSet('db-probe', '1');
  lsDel('db-probe');
  const rawInterests = lsGet('db-interests');
  if (rawInterests === null) {
    // First visit: the paper shows immediately, in the same order "Show me
    // everything" would give (ALLCATS), so default and chosen-default match.
    applyInterestLayout('all');
    setTimeout(placeFeedCards, 0);
    return;
  }
  let interests = 'all';
  try { interests = JSON.parse(rawInterests); } catch (e) {}
  if (Array.isArray(interests) && interests.length && interests.indexOf('extras') < 0
      && !lsGet('db-extras-migrated')) {
    interests.push('extras');
    lsSet('db-interests', JSON.stringify(interests));
  }
  lsSet('db-extras-migrated', '1');
  const saved = lsGet('db-picks-' + briefDate);
  if (saved === 'everything') return;
  if (saved && saved !== 'all') {
    try { if (applyPicks(JSON.parse(saved))) return; } catch (e) {}
  }
  if (Array.isArray(interests) && !interests.length) interests = 'all';
  if (Array.isArray(interests) && interests.length) applyInterestLayout(interests);
  setTimeout(placeFeedCards, 0);
})();
const mastheadEl = document.querySelector('.masthead');
const navBarEl = document.querySelector('.nav');
function paintNavScrolled() {
  navBarEl.classList.toggle('scrolled', mastheadEl.getBoundingClientRect().bottom <= 0);
}
if (mastheadEl && navBarEl) {
  window.addEventListener('scroll', paintNavScrolled, { passive: true });
  window.addEventListener('resize', paintNavScrolled);
  paintNavScrolled();
}
openHashTarget();

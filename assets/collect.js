// Class demo: quietly streams mouse movement, taps and clicks to the collector so the room's
// combined heatmap can be shown on reveal.html. Positions are stored relative to the page column
// (.wrap) so phones and laptops line up. No names, no cookies; a random id per browser tab.
(function () {
  const URL = 'https://htn-mouse-demo.kdavis5111.workers.dev/p';
  let sid;
  try {
    sid = sessionStorage.getItem('htn-demo-sid');
    if (!sid) { sid = Math.random().toString(36).slice(2, 12); sessionStorage.setItem('htn-demo-sid', sid); }
  } catch (e) { sid = Math.random().toString(36).slice(2, 12); }
  const wrap = document.querySelector('.wrap');
  const col = () => { const r = wrap.getBoundingClientRect(); return { left: r.left + window.scrollX, width: r.width }; };
  let buf = [], last = 0;
  function push(px, py, k) { const c = col(); buf.push([px - c.left, py, Date.now(), k]); }
  document.addEventListener('mousemove', e => { const n = Date.now(); if (n - last < 50) return; last = n; push(e.pageX, e.pageY, 0); }, { passive: true });
  document.addEventListener('touchmove', e => { const n = Date.now(); if (n - last < 50) return; last = n; const t = e.touches[0]; push(t.pageX, t.pageY, 0); }, { passive: true });
  document.addEventListener('click', e => push(e.pageX, e.pageY, 1), true);
  function flush(beacon) {
    if (!buf.length) return;
    const body = JSON.stringify({ s: sid, w: Math.round(col().width), pts: buf.splice(0, 2000) });
    if (beacon && navigator.sendBeacon) { navigator.sendBeacon(URL, new Blob([body], { type: 'application/json' })); return; }
    fetch(URL, { method: 'POST', headers: { 'content-type': 'application/json' }, body, keepalive: true }).catch(() => {});
  }
  setInterval(() => flush(false), 2000);
  window.addEventListener('pagehide', () => flush(true));
  document.addEventListener('visibilitychange', () => { if (document.hidden) flush(true); });
})();

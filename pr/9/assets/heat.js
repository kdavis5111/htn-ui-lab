// Live mouse heatmap for the class demo. Draws mouse movement and clicks over the page
// as they happen, using heatmap.js from cdnjs. Everything stays in the browser.
(function () {
  // heatmap.js forces its container to position:relative, so the container sits inside an absolute outer layer.
  const layer = document.createElement('div'); layer.id = 'heat-layer';
  Object.assign(layer.style, { position: 'absolute', left: '0', top: '0', width: '100%', pointerEvents: 'none', zIndex: 9000 });
  const inner = document.createElement('div'); inner.style.width = '100%'; inner.style.height = '100%';
  layer.appendChild(inner); document.body.appendChild(layer);
  const bar = document.createElement('div'); bar.id = 'heat-bar';
  bar.innerHTML = '<button id="hb-move" class="on">Movement</button><button id="hb-click">Clicks</button>'
    + '<span class="hb-count" id="hb-count">0 points</span><button id="hb-clear">Clear</button><button id="hb-save">Save PNG</button>';
  document.body.appendChild(bar);

  function size() {                       // measure the page without the overlay, so it cannot grow itself
    layer.style.height = '0px';
    const h = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
    layer.style.height = h + 'px';
    const c = layer.querySelector('canvas'); if (c && c.height !== h) { c.height = h; c.width = layer.clientWidth; if (window.__heat) window.__heat.repaint(); }
  }
  size(); window.addEventListener('resize', size); setInterval(size, 1500);

  const heat = h337.create({ container: inner, radius: 28, maxOpacity: 0.55, minOpacity: 0, blur: 0.85 }); window.__heat = heat;
  let mode = 'move', moves = [], clicks = [], last = 0;

  function redraw() {
    const pts = mode === 'move' ? moves : clicks;
    heat.setData({ max: mode === 'move' ? 12 : 3, data: pts });
    document.getElementById('hb-count').textContent = pts.length + ' points';
  }
  document.addEventListener('mousemove', e => {
    const now = Date.now(); if (now - last < 40) return; last = now;          // ~25 samples/s
    moves.push({ x: e.pageX, y: e.pageY, value: 1 });
    if (mode === 'move') heat.addData({ x: e.pageX, y: e.pageY, value: 1 }), document.getElementById('hb-count').textContent = moves.length + ' points';
  });
  document.addEventListener('click', e => {
    if (bar.contains(e.target)) return;
    clicks.push({ x: e.pageX, y: e.pageY, value: 1 });
    if (mode === 'click') redraw();
  }, true);

  document.getElementById('hb-move').onclick = () => { mode = 'move'; toggle(); redraw(); };
  document.getElementById('hb-click').onclick = () => { mode = 'click'; toggle(); redraw(); };
  document.getElementById('hb-clear').onclick = () => { moves = []; clicks = []; redraw(); };
  document.getElementById('hb-save').onclick = () => {
    const a = document.createElement('a'); a.download = 'heatmap-' + mode + '.png'; a.href = heat.getDataURL(); a.click();
  };
  function toggle() {
    document.getElementById('hb-move').classList.toggle('on', mode === 'move');
    document.getElementById('hb-click').classList.toggle('on', mode === 'click');
  }
})();

// Reveal page: pulls every point from the collector and draws the room's combined heatmap over the page.
(function () {
  const URL = 'https://htn-mouse-demo.kdavis5111.workers.dev';
  const layer = document.createElement('div'); layer.id = 'heat-layer';
  Object.assign(layer.style, { position: 'absolute', left: '0', top: '0', width: '100%', pointerEvents: 'none', zIndex: 9000 });
  const inner = document.createElement('div'); inner.style.width = '100%'; inner.style.height = '100%';
  layer.appendChild(inner); document.body.appendChild(layer);
  const bar = document.createElement('div'); bar.id = 'heat-bar';
  bar.innerHTML = '<button id="hb-move" class="on">Movement</button><button id="hb-click">Clicks</button>'
    + '<span class="hb-count" id="hb-count">loading</span><button id="hb-pause">Pause</button><button id="hb-clear">Clear room</button><button id="hb-save">Save PNG</button>';
  document.body.appendChild(bar);
  function size() {
    layer.style.height = '0px';
    const h = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
    layer.style.height = h + 'px';
    const c = inner.querySelector('canvas'); if (c && c.height !== h) { c.height = h; c.width = inner.clientWidth; }
  }
  size(); window.addEventListener('resize', size);
  const heat = h337.create({ container: inner, radius: 26, maxOpacity: 0.6, minOpacity: 0, blur: 0.85 });
  const wrap = document.querySelector('.wrap');
  let mode = 'move', data = { points: [], sessions: 0, count: 0 }, paused = false;
  function draw() {
    size();
    const r = wrap.getBoundingClientRect(); const left = r.left + window.scrollX, width = r.width;
    const pts = data.points.filter(p => p[3] === (mode === 'move' ? 0 : 1)).map(p => {
      const scale = p[4] ? width / p[4] : 1;
      return { x: Math.round(left + p[0] * scale), y: Math.round(p[1]), value: 1 };
    });
    heat.setData({ max: mode === 'move' ? Math.max(6, Math.round(data.sessions * 3)) : Math.max(2, Math.round(data.sessions / 2)), data: pts });
    document.getElementById('hb-count').textContent = data.sessions + ' people · ' + pts.length + (mode === 'move' ? ' moves' : ' clicks');
  }
  async function pull() {
    if (paused) return;
    try { const r = await fetch(URL + '/p', { cache: 'no-store' }); data = await r.json(); draw(); }
    catch (e) { document.getElementById('hb-count').textContent = 'collector unreachable'; }
  }
  pull(); setInterval(pull, 4000);
  const toggle = () => {
    document.getElementById('hb-move').classList.toggle('on', mode === 'move');
    document.getElementById('hb-click').classList.toggle('on', mode === 'click');
  };
  document.getElementById('hb-move').onclick = () => { mode = 'move'; toggle(); draw(); };
  document.getElementById('hb-click').onclick = () => { mode = 'click'; toggle(); draw(); };
  document.getElementById('hb-pause').onclick = e => { paused = !paused; e.target.textContent = paused ? 'Resume' : 'Pause'; e.target.classList.toggle('on', paused); };
  document.getElementById('hb-save').onclick = () => { const a = document.createElement('a'); a.download = 'room-heatmap-' + mode + '.png'; a.href = heat.getDataURL(); a.click(); };
  document.getElementById('hb-clear').onclick = async () => {
    const key = prompt('Clear every point in the room? Enter the clear key.'); if (!key) return;
    const r = await fetch(URL + '/clear?key=' + encodeURIComponent(key), { method: 'POST' }); const j = await r.json();
    if (j.ok) { data = { points: [], sessions: 0, count: 0 }; draw(); } else alert('Wrong key.');
  };
})();

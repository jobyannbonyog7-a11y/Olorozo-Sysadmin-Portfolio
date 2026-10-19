/* Programmer-style background: falling binary (0 and 1) like a terminal "data rain".
   Columns near the mouse light up brighter. */
(function () {
  const cv = document.getElementById('rain');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SIZE = 18, BG = '3,10,6';
  let W, H, cols, drops, mouseX = -999, running = true, last = 0;

  function init() {
    W = cv.width = innerWidth; H = cv.height = innerHeight;
    cols = Math.ceil(W / SIZE);
    drops = Array.from({ length: cols }, () => ({ y: Math.random() * -H / SIZE, v: .35 + Math.random() * .7 }));
    ctx.fillStyle = `rgb(${BG})`; ctx.fillRect(0, 0, W, H);
    ctx.font = `600 ${SIZE - 2}px "JetBrains Mono", monospace`;
    ctx.textAlign = 'center';
  }

  function draw(t) {
    if (!running) return;
    if (t - last > 45) {                                   // ~22 fps keeps it calm and light
      last = t;
      ctx.fillStyle = `rgba(${BG},.14)`; ctx.fillRect(0, 0, W, H);   // fade = trail
      for (let i = 0; i < cols; i++) {
        const d = drops[i], x = i * SIZE + SIZE / 2, y = d.y * SIZE;
        const near = Math.abs(x - mouseX) < 90;
        ctx.fillStyle = near ? 'rgba(200,255,225,.95)' : 'rgba(46,226,122,.55)';
        ctx.fillText(Math.random() > .5 ? '1' : '0', x, y);
        d.y += d.v;
        if (y > H && Math.random() > .975) { d.y = Math.random() * -20; d.v = .35 + Math.random() * .7; }
      }
    }
    if (!reduce) requestAnimationFrame(draw);
  }

  addEventListener('resize', init);
  addEventListener('pointermove', e => { mouseX = e.clientX; });
  document.addEventListener('visibilitychange', () => { running = !document.hidden; if (running && !reduce) requestAnimationFrame(draw); });
  init();
  if (reduce) { for (let k = 0; k < 40; k++) draw(k * 100); } else requestAnimationFrame(draw);
})();

export function toast(message, type = 'i') {
  let tb = document.getElementById('tb');
  if (!tb) {
    tb = document.createElement('div');
    tb.id = 'tb';
    document.body.appendChild(tb);
  }
  const d = document.createElement('div');
  d.className = 'toast ' + type;
  d.textContent = message;
  tb.appendChild(d);
  setTimeout(() => {
    if (d.parentNode) {
      d.remove();
    }
  }, 2100);
}

export function sparks(x, y, col = '#4f7fff', n = 8) {
  for (let i = 0; i < n; i++) {
    const s = document.createElement('div');
    const a = (i / n) * Math.PI * 2;
    const dist = 22 + Math.random() * 32;
    s.className = 'spark';
    s.style.cssText = `left:${x}px;top:${y}px;background:${col};--dx:${Math.cos(a) * dist}px;--dy:${Math.sin(a) * dist}px;`;
    document.body.appendChild(s);
    setTimeout(() => {
      if (s.parentNode) {
        s.remove();
      }
    }, 550);
  }
}

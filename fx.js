// 3D feel, shared by Makos and Hitting 2.0: cards tilt toward your finger and a light glare follows it.
(() => {
  const SEL = '.tilt, .cage-plan-btn, .score-card, .spin-btn, .ps-card';
  const MAX = 9; // degrees
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let el = null;
  const move = e => {
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = Math.min(Math.max((e.clientX - r.left) / r.width, 0), 1);
    const y = Math.min(Math.max((e.clientY - r.top) / r.height, 0), 1);
    const k = el.classList.contains('spin-btn') ? 0.35 : 1; // wide buttons tilt less
    el.style.setProperty('--rx', ((0.5 - y) * MAX * k).toFixed(2) + 'deg');
    el.style.setProperty('--ry', ((x - 0.5) * MAX * k).toFixed(2) + 'deg');
    el.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
    el.style.setProperty('--my', (y * 100).toFixed(1) + '%');
  };
  const end = () => {
    if (!el) return;
    el.classList.remove('is-tilting');
    el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg');
    el = null;
  };
  document.addEventListener('pointerdown', e => {
    end();
    el = e.target.closest(SEL);
    if (!el) return;
    el.classList.add('is-tilting');
    move(e);
  }, { passive: true });
  document.addEventListener('pointermove', e => {
    if (e.pointerType === 'mouse' && !el) {
      const t = e.target.closest && e.target.closest(SEL);
      if (t) { el = t; el.classList.add('is-tilting'); }
    }
    move(e);
  }, { passive: true });
  ['pointerup', 'pointercancel'].forEach(t => document.addEventListener(t, end, { passive: true }));
  document.addEventListener('pointerout', e => { if (el && e.pointerType === 'mouse' && !el.contains(e.relatedTarget)) end(); }, { passive: true });
})();

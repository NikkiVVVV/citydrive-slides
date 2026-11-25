(() => {
  const parameters = new URLSearchParams(location.search);
  const autoScroll = parameters.get('autoscroll') !== '0';
  if (parameters.get('view') === 'deck') document.documentElement.dataset.layout = 'deck';
  const doc = document.scrollingElement;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const scrollSpeed = 56;
  let frame = 0;
  let resume = 0;
  let lastTime;
  let position;

  function stop() {
    cancelAnimationFrame(frame);
    clearTimeout(resume);
  }

  function begin(delay) {
    stop();
    if (!autoScroll || reducedMotion.matches || document.hidden) return;
    resume = setTimeout(() => {
      lastTime = undefined;
      position = doc.scrollTop;
      frame = requestAnimationFrame(scroll);
    }, delay);
  }

  function scroll(time) {
    const limit = doc.scrollHeight - doc.clientHeight;
    if (doc.scrollTop >= limit) return;
    if (lastTime !== undefined) {
      position = Math.min(limit, position + scrollSpeed * Math.min(time - lastTime, 50) / 1000);
      doc.scrollTop = position;
    }
    lastTime = time;
    frame = requestAnimationFrame(scroll);
  }

  window.addEventListener('wheel', () => begin(3500), { passive: true });
  window.addEventListener('pointermove', () => begin(3500), { passive: true });
  window.addEventListener('pointerdown', stop, { passive: true });
  window.addEventListener('pointerup', () => begin(4500), { passive: true });
  window.addEventListener('pointercancel', () => begin(4500), { passive: true });
  document.addEventListener('visibilitychange', () => begin(1600));
  reducedMotion.addEventListener('change', () => begin(1600));
  window.addEventListener('keydown', event => {
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;
    if (event.target.closest('input, select, textarea, [contenteditable], .interactive')) return;
    if (['ArrowLeft', 'ArrowRight', 'PageUp', 'PageDown', 'KeyF', 'KeyR'].includes(event.code) && parent !== window) {
      event.preventDefault();
      parent.postMessage({ type: 'deck-dictionary-key', code: event.code }, '*');
    } else {
      begin(4500);
    }
  });

  begin(2000);
})();

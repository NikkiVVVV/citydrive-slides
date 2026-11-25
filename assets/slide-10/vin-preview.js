(() => {
  const truckPhoto = { left: -20, top: 123, width: 752, height: 376 };
  const truckPoint = ([x, y]) => [truckPhoto.left + x * truckPhoto.width / 1774, truckPhoto.top + y * truckPhoto.height / 887];
  const [truckX, truckY] = truckPoint([900, 474]);
  const coordinates = { hood: [222, 514], windshield: [562, 464], beam: [1100, 692], door: [809, 580], panel: [838, 627] };
  const truck = {
    label: 'Тентованный лёгкий грузовик',
    photo: truckPhoto,
    center: { x: truckX, y: truckY },
    dots: Object.fromEntries(Object.entries(coordinates).map(([name, point]) => [name, truckPoint(point)])),
    sequences: { vin: ['hood', 'windshield', 'beam', 'door'], frame: ['beam'], body: ['hood', 'panel'] },
  };

  window.mountDeckVinScene = (viewport, { assetBase = './assets/slide-10/', theme = 'dark' } = {}) => {
    return window.VinFlowScenes.numberHelp(viewport, assetBase, theme, {
      ...truck,
      image: assetBase + 'vin-tent-truck.png',
    }, 'flip');
  };

  window.mountDeckVin = (phone, { autoplay = true, beforeReplay } = {}) => {
    const viewport = phone.querySelector('.vin-preview-motion');
    const scene = window.mountDeckVinScene(viewport);
    const numberButtons = [...phone.querySelectorAll('[data-number]')];
    const sourceButtons = [...phone.querySelectorAll('[data-source]')];
    const listeners = new AbortController();
    let frame = 0;
    let startTimer = 0;
    let appearance = null;
    let kind = 'vin';
    let source = 'document';

    function syncButtons() {
      for (const button of numberButtons) button.setAttribute('aria-pressed', String(button.dataset.number === kind));
      for (const button of sourceButtons) button.setAttribute('aria-pressed', String(button.dataset.source === source));
    }

    function stop() {
      cancelAnimationFrame(frame);
      clearTimeout(startTimer);
      appearance?.cancel();
      appearance = null;
    }

    function animate() {
      stop();
      const { legs } = scene.getFocusJourney(kind);
      const total = legs.reduce((time, leg) => time + leg.duration, 0);
      const started = performance.now();
      function tick(now) {
        const elapsed = scene.isMotionReduced() ? total : Math.min(total, (now - started) / 1000);
        let remaining = elapsed;
        let current = legs.at(-1);
        if (elapsed < total) {
          for (const leg of legs) {
            current = leg;
            if (remaining <= leg.duration) break;
            remaining -= leg.duration;
          }
        }
        const fraction = elapsed === total ? 1 : Math.max(0, Math.min(1, remaining / current.duration));
        const eased = fraction ** 3 * (10 + fraction * (-15 + 6 * fraction));
        scene.renderFocus(Object.fromEntries(Object.entries(current.to).map(([key, value]) => {
          const from = current.from[key] ?? value;
          return [key, from + (value - from) * eased];
        })));
        if (elapsed < total) frame = requestAnimationFrame(tick);
      }
      if (legs.length) frame = requestAnimationFrame(tick);
    }

    function reset() {
      stop();
      kind = 'vin';
      source = 'document';
      syncButtons();
      scene.setHelpSource(source, kind, 'lcv');
      // The original holds on the back of the card for 1.5 seconds before the flip.
      scene.renderAt(1.5);
    }

    function replay() {
      reset();
      if (scene.isMotionReduced()) {
        animate();
        return;
      }
      appearance = viewport.animate(
        [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }],
        { delay: 140, duration: 280, easing: 'ease-out', fill: 'backwards' }
      );
      startTimer = setTimeout(animate, 420);
    }

    const options = { signal: listeners.signal };
    for (const button of numberButtons) button.addEventListener('click', () => {
      beforeReplay?.();
      kind = button.dataset.number;
      syncButtons();
      animate();
    }, options);
    for (const button of sourceButtons) button.addEventListener('click', () => {
      beforeReplay?.();
      source = button.dataset.source;
      syncButtons();
      scene.setHelpSource(source, kind, 'lcv');
      animate();
    }, options);

    if (autoplay) replay();
    else reset();
    return { replay, reset, destroy() { stop(); listeners.abort(); scene.destroy(); } };
  };
})();

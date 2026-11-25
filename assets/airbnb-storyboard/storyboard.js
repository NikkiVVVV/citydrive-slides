(() => {
  const groups = [
    {
      title: 'Переворот и смена текста',
      y: 233, width: 220, x: [40, 273, 507, 741, 975, 1209, 1443],
      frames: [
        [0, 'Белая карточка и список профиля'],
        [18, 'Белая карточка уходит в перспективу'],
        [22, 'Карточка почти исчезает на ребре'],
        [24, 'Появляется цветная сторона'],
        [32, 'Карта раскрылась. Список бледнеет'],
        [44, 'Старый список почти исчез'],
        [64, 'Пояснение стало чётким'],
      ],
    },
    {
      title: 'Два прохода голографии',
      y: 624, width: 259, x: [40, 312, 585, 858, 1131, 1404],
      frames: [
        [96, 'Цветная карта без заметного блика'],
        [120, 'На фоне проступает узор'],
        [144, 'Узор ярче. Портрет меняет цвет'],
        [216, 'Узор затухает после первого прохода'],
        [252, 'Узор и цветовой перелив возвращаются'],
        [324, 'Блик ушёл. Портрет снова синий'],
      ],
    },
    {
      title: 'Возврат в профиль',
      y: 1015, width: 220, x: [40, 273, 507, 741, 975, 1209, 1443],
      frames: [
        [344, 'Открыт экран проверки'],
        [350, 'Цветная карта начинает закрываться'],
        [353, 'Цветная сторона видна ребром'],
        [354, 'У ребра появляется белая сторона'],
        [364, 'Белая карточка раскрылась'],
        [376, 'Список начинает проявляться'],
        [427, 'Профиль вернулся в исходный вид'],
      ],
    },
  ];

  window.mountDeckStoryboard = root => {
    const viewport = root.querySelector('.frame-storyboard-scroll');
    const surface = root.querySelector('.frame-storyboard-surface');
    const dialog = root.querySelector('dialog');
    const figure = dialog.querySelector('img');
    const stage = dialog.querySelector('.frame-detail-stage');
    const timing = dialog.querySelector('.frame-detail-timing');
    const title = dialog.querySelector('h2');
    const close = dialog.querySelector('button');
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    const listeners = new AbortController();
    const options = { signal: listeners.signal };
    let imageIndex = 0;
    let frame = 0;
    let timer = 0;
    let previousTime;
    let position;

    function pause() {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
    }

    function scroll(time) {
      const max = viewport.scrollHeight - viewport.clientHeight;
      if (viewport.scrollTop >= max) return;
      if (previousTime !== undefined) {
        position = Math.min(max, position + 34 * Math.min(time - previousTime, 50) / 1000);
        viewport.scrollTop = position;
      }
      previousTime = time;
      frame = requestAnimationFrame(scroll);
    }

    function begin(delay) {
      pause();
      if (reducedMotion.matches || dialog.open || document.hidden) return;
      timer = setTimeout(() => {
        previousTime = undefined;
        position = viewport.scrollTop;
        frame = requestAnimationFrame(scroll);
      }, delay);
    }

    for (const group of groups) {
      group.frames.forEach(([number, description], index) => {
        const control = document.createElement('button');
        const image = String(++imageIndex).padStart(2, '0');
        const seconds = (number / 60).toFixed(3).replace('.', ',');
        const timecode = `${seconds}\u00a0с · кадр ${String(number).padStart(3, '0')}`;
        control.type = 'button';
        control.className = 'frame-storyboard-hit';
        control.setAttribute('aria-label', `${timecode}. ${description}`);
        control.style.left = `${group.x[index] / 1704 * 100}%`;
        control.style.top = `${group.y / 1390 * 100}%`;
        control.style.width = `${group.width / 1704 * 100}%`;
        control.style.height = `${228 / 1390 * 100}%`;
        control.addEventListener('click', () => {
          pause();
          figure.src = `assets/airbnb-storyboard/frame-${image}.jpg`;
          stage.textContent = group.title;
          timing.textContent = timecode;
          title.textContent = description;
          dialog.showModal();
        }, options);
        surface.append(control);
      });
    }

    viewport.addEventListener('pointerdown', pause, options);
    viewport.addEventListener('pointerup', () => begin(4200), options);
    viewport.addEventListener('pointercancel', () => begin(4200), options);
    viewport.addEventListener('pointermove', () => begin(3600), { ...options, passive: true });
    viewport.addEventListener('wheel', () => begin(4200), { ...options, passive: true });
    viewport.addEventListener('keydown', event => {
      if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown'].includes(event.code)) {
        event.stopPropagation();
        begin(4200);
      }
    }, options);
    document.addEventListener('visibilitychange', () => begin(1800), options);
    reducedMotion.addEventListener('change', () => begin(1800), options);
    close.addEventListener('click', () => dialog.close(), options);
    dialog.addEventListener('keydown', event => event.stopPropagation(), options);
    dialog.addEventListener('click', event => {
      event.stopPropagation();
      if (event.target === dialog) dialog.close();
    }, options);
    dialog.addEventListener('close', () => begin(4200), options);

    begin(2000);
    return () => {
      listeners.abort();
      pause();
      if (dialog.open) dialog.close();
    };
  };
})();

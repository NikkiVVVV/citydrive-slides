(() => {
  function mountGlare(photo) {
    const controller = new AbortController();
    const { signal } = controller;
    photo.addEventListener('pointermove', event => {
      if (event.pointerType === 'touch') return;
      const bounds = photo.getBoundingClientRect();
      photo.style.setProperty('--glare-x', `${(event.clientX - bounds.left) / bounds.width * 100}%`);
      photo.style.setProperty('--glare-y', `${(event.clientY - bounds.top) / bounds.height * 100}%`);
      photo.dataset.glare = '';
    }, { signal });
    photo.addEventListener('pointerleave', () => { delete photo.dataset.glare; }, { signal });
    return () => controller.abort();
  }

  function mountEyeGaze(root) {
    const pair = root.querySelector('.eye-gaze-pair');
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const controller = new AbortController();
    const { signal } = controller;
    const glances = [[-.86,.04],[.72,-.31],[.18,.73],[-.38,-.68],[0,0]];
    let glance = 0;
    let timer = 0;

    function look(x, y) {
      const distance = Math.max(1, Math.hypot(x, y));
      root.style.setProperty('--look-x', `${39 * x / distance}px`);
      root.style.setProperty('--look-y', `${52 * y / distance}px`);
    }

    function resumeIdle(delay) {
      clearTimeout(timer);
      if (motion.matches) return;
      timer = setTimeout(() => {
        look(...glances[glance]);
        glance = (glance + 1) % glances.length;
        resumeIdle(1420);
      }, delay);
    }

    root.addEventListener('pointermove', event => {
      if (event.pointerType === 'touch') return;
      const stage = root.getBoundingClientRect();
      const eyes = pair.getBoundingClientRect();
      look(
        (event.clientX - eyes.left - eyes.width / 2) / (stage.width * .25),
        (event.clientY - eyes.top - eyes.height / 2) / (stage.height * .28)
      );
      resumeIdle(1800);
    }, { signal });
    root.addEventListener('pointerleave', () => resumeIdle(520), { signal });
    motion.addEventListener('change', () => {
      look(0, 0);
      resumeIdle(720);
    }, { signal });
    resumeIdle(720);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }

  function mountToolIcons(tools) {
    const controller = new AbortController();
    const { signal } = controller;
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    for (const button of tools.querySelectorAll('.intro-tool')) {
      const art = button.querySelector('.intro-tool-art');
      for (let depth = -16; depth <= 16; depth += 2) {
        const slice = document.createElement('span');
        slice.className = 'intro-tool-slice';
        slice.style.setProperty('--slice-depth', `${depth}px`);
        art.append(slice);
      }
      let spin;
      function rotate() {
        if (motion.matches || spin?.playState === 'running') return;
        spin = art.animate(
          [
            { transform: 'rotateX(5deg) rotateY(-10deg)' },
            { transform: 'rotateX(5deg) rotateY(350deg)' },
          ],
          { duration: 700, easing: 'cubic-bezier(.45, .05, .3, 1)', iterations: 1 }
        );
      }
      button.addEventListener('pointerenter', event => {
        if (event.pointerType !== 'touch') rotate();
      }, { signal });
      button.addEventListener('click', rotate, { signal });
      signal.addEventListener('abort', () => spin?.cancel(), { once: true });
    }
    return () => controller.abort();
  }

  function mountParts(scroll, frameCount) {
    const canvas = scroll.querySelector('canvas');
    const context = canvas.getContext('2d', { alpha: false });
    if (!context) return null;

    const controller = new AbortController();
    const { signal } = controller;
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const frames = new Array(frameCount);
    const lastFrame = frameCount - 1;
    let displayed = 0;
    let requested = 0;
    let rendered = -1;
    let previousTime = 0;
    let animation = 0;
    let preloadTimer = 0;
    let nextPreload = 1;

    function queueDraw() {
      if (!animation && !signal.aborted) animation = requestAnimationFrame(draw);
    }

    function loadFrame(index) {
      if (index < 0 || index > lastFrame || frames[index]) return;
      const frame = new Image();
      frame.decoding = 'async';
      frame.addEventListener('load', () => {
        if (Math.abs(index - Math.round(displayed)) <= 2) queueDraw();
      }, { once: true, signal });
      frames[index] = frame;
      frame.src = `assets/slide-05/frames/${String(index).padStart(3, '0')}.webp`;
    }

    function draw(time) {
      animation = 0;
      const elapsed = previousTime ? Math.min(50, time - previousTime) : 16;
      const distance = requested - displayed;
      displayed = motion.matches || Math.abs(distance) < .35
        ? requested
        : displayed + distance * (1 - Math.exp(-elapsed / 80));

      const index = Math.round(displayed);
      loadFrame(index);
      for (let offset = -3; offset <= 10; offset++) loadFrame(index + offset);
      const image = frames[index];
      const ratio = Math.min(devicePixelRatio || 1, 1.5);
      const bounds = canvas.getBoundingClientRect();
      const width = Math.max(1, Math.round(bounds.width * ratio));
      const height = Math.max(1, Math.round(bounds.height * ratio));

      if (image?.naturalWidth && (index !== rendered || canvas.width !== width || canvas.height !== height)) {
        if (canvas.width !== width) canvas.width = width;
        if (canvas.height !== height) canvas.height = height;
        const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
        const imageWidth = image.naturalWidth * scale;
        const imageHeight = image.naturalHeight * scale;
        context.fillStyle = '#010101';
        context.fillRect(0, 0, width, height);
        context.drawImage(image, (width - imageWidth) / 2, (height - imageHeight) / 2, imageWidth, imageHeight);
        canvas.dataset.frame = String(index);
        rendered = index;
      }

      previousTime = displayed === requested ? 0 : time;
      if (previousTime) queueDraw();
    }

    function updateFrame() {
      // The production scene maps scroll progress over .35 of its viewport to the frame range.
      const distance = Math.max(1, scroll.clientHeight * .35);
      const progress = Math.min(1, Math.max(0, scroll.scrollTop / distance));
      requested = Math.round(progress * lastFrame);
      loadFrame(requested);
      queueDraw();
    }

    function preload() {
      const end = Math.min(frameCount, nextPreload + 6);
      for (; nextPreload < end; nextPreload++) loadFrame(nextPreload);
      if (nextPreload < frameCount) preloadTimer = setTimeout(preload, 50);
    }

    scroll.addEventListener('scroll', updateFrame, { passive: true, signal });
    scroll.addEventListener('keydown', event => {
      if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown'].includes(event.code)) event.stopPropagation();
    }, { signal });
    window.addEventListener('resize', queueDraw, { signal });
    scroll.closest('.intro-window').addEventListener('animationend', queueDraw, { signal });
    updateFrame();
    preloadTimer = setTimeout(preload, 50);

    return () => {
      controller.abort();
      cancelAnimationFrame(animation);
      clearTimeout(preloadTimer);
    };
  }

  function stackWindows(front, previousRecordings, existingWindows) {
    const template = document.getElementById('intro-recording-slide');
    for (const [index, recording] of previousRecordings.slice(-2).reverse().entries()) {
      const depth = index + 1;
      const snapshot = existingWindows.get(recording.src);
      const card = snapshot?.element ?? template.content.firstElementChild.cloneNode(true);
      const video = card.querySelector('video');
      card.classList.toggle('is-retreating', Boolean(snapshot && Number(card.dataset.depth) < depth));
      if (snapshot) card.style.setProperty('--old-transform', snapshot.transform);
      card.dataset.depth = String(depth);
      card.dataset.clip = recording.src;
      card.setAttribute('aria-hidden', 'true');
      video.dataset.held = '';
      video.preload = 'none';
      video.poster = recording.poster;
      front.before(card);
    }
    front.dataset.depth = '0';
  }

  function preparePillarDebris(content) {
    const riseTime = 800;
    content.style.setProperty('--pillar-rise-time', `${riseTime}ms`);
    for (const burst of content.querySelectorAll('.context-pillar-debris')) {
      for (let index = 0; index < 18; index++) {
        const phase = index * .618034 % 1;
        const direction = index % 2 === 0 ? -1 : 1;
        const spread = (64 + phase * 178) * direction;
        const delay = 235 + (index % 6) * 43;
        // Match the pillar's cubic ease-out so each rock starts along the moving shaft.
        const riseOffset = 1080 * (1 - delay / riseTime) ** 3;
        const rock = document.createElement('span');
        rock.className = 'context-pillar-rock';
        for (const [property, value] of Object.entries({
          '--rock-size': `${8 + phase * 17}px`,
          '--rock-origin-x': `${(28 + phase * 46) * direction}px`,
          '--rock-origin-y': `${675 + riseOffset + (phase - .5) * 65}px`,
          '--rock-mid-x': `${spread * .57}px`,
          '--rock-end-x': `${spread}px`,
          '--rock-peak': `${-(20 + (index * 7) % 50)}px`,
          '--rock-fall': `${108 + phase * 114}px`,
          '--rock-spin': `${(80 + phase * 180) * direction}deg`,
          '--rock-delay': `${delay}ms`,
          '--rock-time': `${riseTime - delay - (index % 3) * 22}ms`,
        })) rock.style.setProperty(property, value);
        burst.append(rock);
      }
    }
  }

  window.mountDeckIntro = (content, build, previousRecordings, existingWindows) => {
    const gaze = content.querySelector('.eye-gaze');
    if (gaze) return mountEyeGaze(gaze);
    const storyboard = content.querySelector('.frame-storyboard');
    if (storyboard) return window.mountDeckStoryboard(storyboard);
    const pillars = content.querySelector('.context-pillars');
    if (pillars) preparePillarDebris(pillars);
    const photo = content.querySelector('.intro-photo');
    if (photo) return mountGlare(photo);
    const tools = content.querySelector('.intro-tools');
    if (tools) return mountToolIcons(tools);
    const front = content.querySelector('.intro-window');
    if (!front) return null;
    stackWindows(front, previousRecordings, existingWindows);
    const video = front.querySelector('.intro-recording');
    if (video) {
      front.dataset.clip = build.recording.src;
      if (build.recording.raised) front.dataset.raised = '';
      video.muted = true;
      video.poster = build.recording.poster;
      video.src = build.recording.src;
    }
    const parts = front.querySelector('.intro-parts-scroll');
    return parts ? mountParts(parts, build.frameCount) : null;
  };

  function fillTruckEffect(effect) {
    const particles = effect.querySelector('.truck-magic-particles');
    const colors = ['#ffe48b', '#ff9cd8', '#bfabff', '#86f5ff', '#a6ffbf'];

    for (let index = 0; index < 44; index++) {
      const bug = index >= 35;
      const phase = index * .618034 % 1;
      const angle = index * 2.399963;
      const x = 220 + phase * 1480;
      const y = (bug ? 460 : 300) + Math.sin(angle) * (bug ? 104 : 200);
      const length = 112 + phase * 220;
      const particle = document.createElementNS('http://www.w3.org/2000/svg', 'use');
      particle.classList.add('truck-magic-particle');
      particle.setAttribute('href', bug ? '#truck-magic-bug' : index % 3 ? '#truck-magic-star' : '#truck-magic-confetti');
      particle.style.color = bug ? '#ff4a7c' : colors[index % colors.length];
      particle.style.setProperty('--x', `${x}px`);
      particle.style.setProperty('--y', `${y}px`);
      particle.style.setProperty('--end-x', `${x + Math.cos(angle) * length}px`);
      particle.style.setProperty('--end-y', `${y + Math.sin(angle) * length - (bug ? 180 : 0)}px`);
      particle.style.setProperty('--rotation', `${Math.cos(angle) * 180}deg`);
      particle.style.setProperty('--size', String(.55 + phase * 1.6));
      particle.style.setProperty('--particle-time', `${640 + phase * 330}ms`);
      particle.style.setProperty('--particle-delay', `${(bug ? 660 : 140) + phase * 500}ms`);
      particles.append(particle);
    }

  }

  const memeImages = {
    xi: 'xi-claps.png',
    pooh: 'xi-pooh.jpg',
    chad: 'gigachad.jpg',
    portrait: 'gigachad-portrait.jpg',
    panda: 'panda.jpg',
    cena: 'bing-chilling.jpg',
  };

  window.preloadDeckMemes = () => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    for (const image of Object.values(memeImages)) new Image().src = `assets/meme-transition/${image}`;
  };

  function fillMemeEffect(effect) {
    const layer = effect.querySelector('.meme-transition-stickers');
    // Image, width, delay, flight time, start / mid-flight / end, and tilt.
    const flights = [
      ['panda', 245, 0, 1500, [-170, 1000], [280, 715], [2080, -185], -19],
      ['chad', 370, 90, 1610, [-270, 720], [545, 390], [2250, 140], -14],
      ['cena', 240, 150, 1730, [2150, 1000], [1480, 570], [-210, -260], 14],
      ['xi', 540, 125, 1830, [1010, 1470], [968, 531], [1040, -720], -3],
      ['pooh', 475, 235, 1770, [2150, 375], [1460, 235], [-380, -110], 12],
      ['portrait', 270, 285, 1480, [-250, -215], [290, 255], [2240, 1100], -16],
      ['panda', 310, 320, 1510, [1990, -180], [1680, 389], [-280, 1290], 18],
      ['pooh', 340, 370, 1510, [-260, 1230], [491, 837], [2270, 485], -13],
      ['chad', 235, 420, 1530, [1830, 1280], [1600, 885], [1210, -320], 20],
      ['cena', 180, 525, 1310, [-200, 760], [285, 540], [2140, 970], -15],
      ['xi', 315, 610, 1440, [2130, 230], [1490, 750], [620, -390], 13],
      ['panda', 190, 640, 1250, [1210, 1230], [825, 850], [100, -190], -22],
      ['portrait', 330, 690, 1410, [-280, 1050], [515, 745], [2190, 700], 14],
      ['pooh', 274, 770, 1340, [2020, -210], [1325, 210], [-390, 1230], -12],
      ['chad', 200, 885, 1290, [2130, 680], [1655, 530], [-300, 210], 18],
      ['cena', 164, 910, 1240, [320, 1350], [650, 810], [1460, -370], -14],
      ['panda', 220, 960, 1270, [-250, 910], [455, 516], [2180, 400], -17],
      ['xi', 270, 1000, 1230, [1900, 1280], [1515, 720], [715, -450], 11],
    ];

    const translate = ([x, y]) => `translate(${x}px, ${y}px)`;
    for (const [name, width, delay, duration, start, middle, end, tilt] of flights) {
      const sticker = new Image();
      sticker.src = `assets/meme-transition/${memeImages[name]}`;
      sticker.alt = '';
      sticker.draggable = false;
      sticker.className = name === 'xi' ? 'meme-sticker meme-sticker-cutout' : 'meme-sticker';
      for (const [property, value] of Object.entries({
        '--meme-width': `${width}px`,
        '--meme-delay': `${delay}ms`,
        '--meme-duration': `${duration}ms`,
        '--meme-start': translate(start),
        '--meme-middle': translate(middle),
        '--meme-end': translate(end),
        '--meme-tilt': `${tilt}deg`,
      })) sticker.style.setProperty(property, value);
      layer.append(sticker);
    }
  }

  window.playDeckTransition = (camera, templateId, source) => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const template = document.getElementById(templateId);
    const effect = template.content.firstElementChild.cloneNode(true);
    const previous = effect.querySelector('[data-transition-before]');
    if (templateId === 'truck-magic-transition') fillTruckEffect(effect);
    if (templateId === 'meme-transition') fillMemeEffect(effect);
    previous.src = source;
    previous.addEventListener('animationend', () => effect.remove(), { once: true });
    camera.append(effect);
  };
})();

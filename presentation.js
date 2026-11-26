(() => {
  const slides = window.presentationSlides;
  const presentation = document.querySelector('#presentation');
  const frame = document.querySelector('#frame');
  const slide = document.querySelector('#slide');
  const camera = document.querySelector('#camera');
  const buildContent = document.querySelector('#build-content');
  const poster = document.querySelector('#poster');
  const media = document.querySelector('#media');
  const links = document.querySelector('#links');
  const slideNumber = document.querySelector('#slide-number');
  const slideMenu = document.querySelector('.slide-menu');
  const fullscreenButton = document.querySelector('#deck-fullscreen');
  const status = document.querySelector('#status');
  const activeVideos = () => [...slide.querySelectorAll('video:not([data-held])')];
  let index = 0;
  let step = 0;
  let vinDemo = null;
  let vinComparison = null;
  let stopIntro = null;
  let terminalLogTimers = [];
  let autoStepTimer = 0;

  const imageAssets = slides.map(({ image, build }) => {
    const template = build?.templateId ? document.getElementById(build.templateId) : null;
    const images = template?.content.querySelectorAll('img[src], video[poster]') ?? [];
    const backgrounds = template?.dataset.preloadImages?.split(' ') ?? [];
    return [
      image,
      build?.recording?.poster,
      build?.comparison?.poster,
      ...Array.from(images, element => element.getAttribute('src') ?? element.getAttribute('poster')),
      ...backgrounds,
    ].filter(Boolean);
  });
  const warmedImages = new Set();
  let warmRequest = null;
  let warmTimer = 0;

  function scheduleImageWarmup() {
    clearTimeout(warmTimer);
    if (!warmRequest && !document.hidden) warmTimer = setTimeout(warmNextImage, 180);
  }

  function warmNextImage() {
    const lead = navigator.connection?.saveData ? Math.min(2, slides.length - 1) : slides.length - 1;
    for (let offset = 1; offset <= lead; offset++) {
      const urls = imageAssets[(index + offset) % slides.length];
      const url = urls.find(src => !warmedImages.has(src));
      if (!url) continue;
      const image = new Image();
      image.fetchPriority = 'low';
      image.decoding = 'async';
      warmRequest = image;
      warmedImages.add(url);
      const settled = () => {
        warmRequest = null;
        scheduleImageWarmup();
      };
      image.onload = image.onerror = settled;
      image.src = url;
      return;
    }
  }

  function indexFromHash() {
    const match = /^#(\d+)$/.exec(location.hash);
    return match ? Math.max(0, Math.min(slides.length - 1, Number(match[1]) - 1)) : 0;
  }

  function fit() {
    const { width, height } = slides[index];
    const scale = Math.min(presentation.clientWidth / width, presentation.clientHeight / height);
    frame.style.width = `${width * scale}px`;
    frame.style.height = `${height * scale}px`;
    slide.style.width = `${width}px`;
    slide.style.height = `${height}px`;
    slide.style.transform = `scale(${scale})`;
  }

  function position(element, box) {
    element.style.left = `${box.x}px`;
    element.style.top = `${box.y}px`;
    element.style.width = `${box.width}px`;
    element.style.height = `${box.height}px`;
  }

  function makeVideo(clip) {
    const container = document.createElement('div');
    container.className = 'clip';
    position(container, clip);
    if (clip.radii) container.style.borderRadius = clip.radii.map(value => `${value}px`).join(' ');

    const video = document.createElement('video');
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.loop = clip.loop ?? false;
    video.disablePictureInPicture = true;
    video.setAttribute('aria-hidden', 'true');

    if (clip.crop) {
      const [[scaleX, , offsetX], [, scaleY, offsetY]] = clip.crop;
      position(video, {
        x: -clip.width * offsetX / scaleX,
        y: -clip.height * offsetY / scaleY,
        width: clip.width / scaleX,
        height: clip.height / scaleY,
      });
      video.style.objectFit = 'fill';
    } else {
      position(video, { x: 0, y: 0, width: clip.width, height: clip.height });
    }

    video.addEventListener('playing', () => { video.dataset.ready = ''; }, { once: true });
    video.src = clip.src;
    container.append(video);
    return container;
  }

  function makeLink(link) {
    const anchor = document.createElement('a');
    anchor.className = 'resource-link';
    anchor.href = link.url;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    anchor.setAttribute('aria-label', link.label);
    anchor.title = link.label;
    position(anchor, link);
    return anchor;
  }

  function mountResourceBoard(layout, records) {
    const board = buildContent.querySelector('.resource-board');
    board.style.width = `${layout.width}px`;
    const [site, ...cards] = records;
    const siteLabel = document.createElement('p');
    siteLabel.className = 'resource-board-site';
    siteLabel.textContent = site.label;
    board.querySelector('header').append(siteLabel);

    for (const group of layout.groups) {
      const section = document.createElement('section');
      position(section, { x: group.x, y: layout.panelTop, width: group.width, height: layout.panelHeight });
      section.className = 'resource-board-section';
      section.dataset.resourceFocus = group.focus;
      const title = document.createElement('h2');
      title.textContent = group.label;
      section.append(title);
      const members = cards.filter(({ y }) => y >= group.firstRow && y <= group.lastRow);
      members.forEach((resource, index) => {
        const tile = document.createElement('div');
        tile.className = 'resource-board-card';
        tile.setAttribute('role', 'img');
        tile.setAttribute('aria-label', [resource.label, resource.note].filter(Boolean).join('. '));
        position(tile, {
          x: layout.panelPadding + index % group.columns * layout.columnStep,
          y: layout.panelHeader + Math.floor(index / group.columns) * layout.rowStep,
          width: layout.tileWidth,
          height: layout.tileHeight,
        });
        tile.style.backgroundPosition = `-${resource.x - 48}px -${resource.y - 4}px`;
        if (resource.note) {
          const note = document.createElement('p');
          note.className = 'resource-board-card-note';
          note.textContent = resource.note;
          tile.append(note);
        }
        section.append(tile);
      });
      board.append(section);
    }
  }

  function play(video) {
    return video.play().catch(error => {
      if (error.name !== 'AbortError' && video.isConnected) {
        status.textContent = 'Нажмите K, чтобы запустить видео.';
      }
    });
  }

  function replayVideo(video) {
    video.currentTime = 0;
    play(video);
  }

  function mountIterationPrompt(example, { iterationPrompt, typingInterval }) {
    const output = example.querySelector('.iteration-typed-text');
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const characters = Array.from(iterationPrompt);
    let frame = 0;
    let count = 0;

    example.setAttribute('role', 'img');
    example.setAttribute('aria-label', iterationPrompt);

    function finish() {
      output.textContent = iterationPrompt;
      example.classList.add('is-typed');
    }

    if (reducedMotion) {
      finish();
      return null;
    }

    const startsAt = performance.now() + 240;
    function type(now) {
      const next = Math.max(0, Math.floor((now - startsAt) / typingInterval));
      if (next >= characters.length) {
        finish();
        return;
      }
      if (next !== count) {
        output.textContent = characters.slice(0, next).join('');
        count = next;
      }
      frame = requestAnimationFrame(type);
    }

    frame = requestAnimationFrame(type);
    return () => cancelAnimationFrame(frame);
  }

  function prepareBuild(build, resources) {
    terminalLogTimers.forEach(clearTimeout);
    terminalLogTimers = [];
    const existingWindows = new Map(
      [...buildContent.querySelectorAll('.intro-window[data-clip]')].map(window => [
        window.dataset.clip,
        { element: window, transform: getComputedStyle(window).transform },
      ]),
    );
    vinDemo?.destroy();
    vinDemo = null;
    vinComparison = null;
    stopIntro?.();
    stopIntro = null;
    slide.style.backgroundColor = build?.background ?? '';
    const template = build?.templateId ? document.getElementById(build.templateId) : null;
    buildContent.hidden = !template;
    buildContent.replaceChildren();
    if (template) buildContent.append(template.content.cloneNode(true));
    if (build?.resourceBoard) mountResourceBoard(build.resourceBoard, resources);
    const reel = buildContent.querySelector('.iteration-count-reel');
    if (reel) {
      for (let count = 47; count >= 0; count--) {
        const number = document.createElement('span');
        number.textContent = count;
        reel.append(number);
      }
    }
    const example = buildContent.querySelector('.iteration-example');
    if (example) {
      stopIntro = mountIterationPrompt(example, build);
      return;
    }
    const reference = build?.comparison ? buildContent.querySelector('.vin-comparison-reference video') : null;
    if (reference) {
      const { src, poster, description, label, fit } = build.comparison;
      reference.src = src;
      reference.poster = poster;
      reference.setAttribute('aria-label', description);
      if (fit) buildContent.querySelector('.vin-comparison').dataset.referenceFit = fit;
      buildContent.querySelector('.vin-comparison-label-reference').textContent = label;
      buildContent.querySelector('[data-comparison-replay="reference"]').setAttribute('aria-label', `Повторить: ${description}`);
    }
    const vinSlot = buildContent.querySelector('[data-vin-slot]');
    if (vinSlot && window.mountDeckVin) {
      const phone = document.querySelector('#deck-vin-phone').content.firstElementChild.cloneNode(true);
      vinSlot.append(phone);
      if (reference) {
        let startVinOnEnd = true;
        const pauseReference = () => {
          startVinOnEnd = false;
          reference.pause();
        };
        const demo = window.mountDeckVin(phone, { autoplay: false, beforeReplay: pauseReference });
        reference.addEventListener('ended', () => {
          if (startVinOnEnd && reference.isConnected) {
            startVinOnEnd = false;
            demo.replay();
          }
        });
        vinDemo = demo;
        const replayReference = () => {
          startVinOnEnd = true;
          demo.reset();
          replayVideo(reference);
        };
        vinComparison = {
          replayReference,
          resumeReference() {
            if (startVinOnEnd && !reference.ended) play(reference);
            else replayReference();
          },
          replayVin() {
            pauseReference();
            demo.replay();
          },
        };
      } else {
        vinDemo = window.mountDeckVin(phone);
      }
      vinSlot.dataset.live = '';
    }
    if (template) {
      const previousRecordings = (build.recording || build.frameCount)
        ? slides.slice(0, index).flatMap(entry => entry.build?.recording ?? [])
        : [];
      stopIntro = window.mountDeckIntro(buildContent, build, previousRecordings, existingWindows);
    }
  }

  function scheduleAutoStep(delay) {
    clearTimeout(autoStepTimer);
    const { autoStepInterval, steps } = slides[index].build ?? {};
    if (!autoStepInterval || step >= steps.length || document.hidden) return;

    autoStepTimer = setTimeout(() => showStep(step + 1, true), delay ?? autoStepInterval);
  }

  function showStep(next, animate) {
    step = next;
    for (const layer of buildContent.querySelectorAll('[data-reveal-step]')) {
      const visible = step >= Number(layer.dataset.revealStep);
      if (visible === !layer.hidden) continue;
      layer.hidden = !visible;
      layer.classList.toggle('is-entering', visible && animate);
      if (layer.classList.contains('ffmpeg-install')) {
        terminalLogTimers.forEach(clearTimeout);
        const revealLines = visible && animate && !matchMedia('(prefers-reduced-motion: reduce)').matches;
        terminalLogTimers = [];
        for (const line of layer.querySelectorAll('[data-log-delay]')) {
          line.hidden = revealLines;
          if (revealLines) terminalLogTimers.push(setTimeout(() => { line.hidden = false; }, Number(line.dataset.logDelay)));
        }
      }
    }
    const current = slides[index];
    const shot = current.build?.steps[step - 1] ?? current.build?.overview;
    camera.classList.toggle('camera-moving', animate);
    buildContent.dataset.focus = shot?.focus ?? '';
    for (const panel of buildContent.querySelectorAll('[data-resource-focus]')) {
      panel.inert = Boolean(shot?.focus && panel.dataset.resourceFocus !== shot.focus);
    }
    if (shot?.focus === 'vin' && animate) vinDemo?.replay();
    if (shot?.scale) {
      const x = -shot.x * shot.scale;
      const y = current.height / 2 - (shot.centerY ?? current.height / 2) * shot.scale;
      camera.style.transform = `translate(${x}px, ${y}px) scale(${shot.scale})`;
    } else {
      camera.style.removeProperty('transform');
    }
    const detail = shot?.label ? ` ${shot.label}.` : '';
    status.textContent = `${index + 1} из ${slides.length}. ${current.title}.${detail}`;
    scheduleAutoStep(!animate && step === 0 ? 500 : undefined);
  }

  function show(next, fromEnd = false) {
    const previous = slides[index];
    index = (next + slides.length) % slides.length;
    const current = slides[index];
    slideMenu.open = false;
    activeVideos().forEach(video => video.pause());
    media.replaceChildren(...(current.videos ?? []).map(makeVideo));
    links.replaceChildren(...(current.links ?? []).map(makeLink));
    poster.hidden = !current.image;
    if (current.image) poster.src = current.image;
    else poster.removeAttribute('src');
    poster.alt = current.title;
    slide.setAttribute('aria-label', `Слайд ${index + 1} из ${slides.length}`);
    slide.dataset.figmaId = current.figmaId;
    slideNumber.textContent = `${index + 1} / ${slides.length}`;
    prepareBuild(current.build, current.resources);
    showStep(fromEnd ? (current.build?.steps.length ?? 0) : 0, false);
    fit();
    camera.querySelector('[data-slide-transition]')?.remove();
    if (current.transition?.from === previous.figmaId) {
      window.playDeckTransition(camera, current.transition.templateId, previous.image);
    }

    const hash = `#${index + 1}`;
    if (location.hash !== hash) history.replaceState(null, '', hash);

    activeVideos().forEach(video => play(video));
    scheduleImageWarmup();
    if (slides[index + 1]?.transition?.templateId === 'meme-transition') window.preloadDeckMemes();
  }

  function navigate(direction) {
    const next = step + direction;
    const lastStep = slides[index].build?.steps.length ?? 0;
    if (next >= 0 && next <= lastStep) {
      showStep(next, true);
    } else {
      show(index + direction, direction < 0);
    }
  }

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch {
      status.textContent = 'Полноэкранный режим можно включить в браузере.';
    }
  }

  function toggleVideo() {
    const videos = activeVideos();
    if (videos.some(video => !video.paused)) {
      videos.forEach(video => video.pause());
      return;
    }
    if (vinComparison) {
      vinComparison.resumeReference();
      return;
    }
    videos.forEach(video => {
      if (video.ended) video.currentTime = 0;
      play(video);
    });
  }

  for (const restart of document.querySelectorAll('[data-restart-deck]')) {
    restart.addEventListener('click', () => {
      show(0);
      slide.focus({ preventScroll: true });
    });
  }

  fullscreenButton.addEventListener('click', () => {
    slideMenu.open = false;
    slideMenu.querySelector('summary').focus({ preventScroll: true });
    toggleFullscreen();
  });
  document.addEventListener('fullscreenchange', () => {
    fullscreenButton.querySelector('span').textContent = document.fullscreenElement ? 'Выйти из полноэкранного режима' : 'На весь экран';
  });

  presentation.addEventListener('click', event => {
    if (event.button !== 0 || event.target.closest('.slide-controls')) return;
    if (slideMenu.open) {
      slideMenu.open = false;
      return;
    }
    const replay = event.target.closest('[data-comparison-replay]');
    if (replay?.dataset.comparisonReplay === 'reference') {
      if (vinComparison) vinComparison.replayReference();
      else replayVideo(replay.parentElement.querySelector('video'));
    } else if (replay?.dataset.comparisonReplay === 'vin') {
      if (vinComparison) vinComparison.replayVin();
      else vinDemo?.replay();
    } else if (!event.target.closest('a, button')) {
      navigate(1);
    }
  });

  function handleDeckKey(event) {
    if (event.metaKey || event.ctrlKey || event.altKey || event.target?.closest('a')) return;
    if (event.code === 'Escape' && slideMenu.open) {
      slideMenu.open = false;
      slideMenu.querySelector('summary').focus();
      event.preventDefault();
      return;
    }
    if (event.code === 'Space' && event.target?.closest('button, summary')) return;
    switch (event.code) {
      case 'ArrowRight':
      case 'ArrowDown':
      case 'PageDown':
      case 'Space':
        navigate(1);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
      case 'PageUp':
        navigate(-1);
        break;
      case 'Home':
        show(0);
        break;
      case 'End':
        show(slides.length - 1);
        break;
      case 'KeyF':
        toggleFullscreen();
        break;
      case 'KeyK':
        toggleVideo();
        break;
      case 'KeyR':
        if (vinComparison) vinComparison.replayReference();
        else {
          vinDemo?.replay();
          activeVideos().forEach(replayVideo);
        }
        break;
      default:
        return;
    }
    event.preventDefault();
  }

  window.addEventListener('keydown', handleDeckKey);
  window.addEventListener('message', event => {
    const embed = buildContent.querySelector('.deck-motion-dictionary, .deck-vin-player');
    const type = embed?.classList.contains('deck-vin-player') ? 'deck-player-key' : 'deck-dictionary-key';
    if (!embed || embed.contentWindow !== event.source || event.data?.type !== type) return;
    handleDeckKey(new KeyboardEvent('keydown', { code: event.data.code }));
  });
  document.addEventListener('visibilitychange', () => {
    scheduleImageWarmup();
    scheduleAutoStep();
  });
  window.addEventListener('resize', fit);
  window.addEventListener('hashchange', () => show(indexFromHash()));
  show(indexFromHash());
})();

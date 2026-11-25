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
  const status = document.querySelector('#status');
  const activeVideos = () => [...slide.querySelectorAll('video:not([data-held])')];
  let index = 0;
  let step = 0;
  let vinDemo = null;
  let vinComparison = null;
  let stopIntro = null;

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
    return video.play().catch(() => {
      status.textContent = 'Нажмите K, чтобы запустить видео.';
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
    const vinSlot = buildContent.querySelector('[data-vin-slot]');
    if (vinSlot && window.mountDeckVin) {
      const phone = document.querySelector('#deck-vin-phone').content.firstElementChild.cloneNode(true);
      vinSlot.append(phone);
      const reference = build.sequenceVin ? buildContent.querySelector('.vin-comparison-reference video') : null;
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
        vinComparison = {
          replayReference() {
            startVinOnEnd = true;
            demo.reset();
            replayVideo(reference);
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

  function showStep(next, animate) {
    step = next;
    for (const layer of buildContent.querySelectorAll('[data-reveal-step]')) {
      const visible = step >= Number(layer.dataset.revealStep);
      if (visible === !layer.hidden) continue;
      layer.hidden = !visible;
      layer.classList.toggle('is-entering', visible && animate);
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
  }

  function show(next, fromEnd = false) {
    const previous = slides[index];
    index = (next + slides.length) % slides.length;
    const current = slides[index];
    activeVideos().forEach(video => video.pause());
    media.replaceChildren(...(current.videos ?? []).map(makeVideo));
    links.replaceChildren(...(current.links ?? []).map(makeLink));
    poster.hidden = !current.image;
    if (current.image) poster.src = current.image;
    else poster.removeAttribute('src');
    poster.alt = current.title;
    slide.setAttribute('aria-label', `Слайд ${index + 1} из ${slides.length}`);
    slide.dataset.figmaId = current.figmaId;
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
    for (const offset of [-1, 1]) {
      const neighbor = slides[(index + offset + slides.length) % slides.length];
      if (neighbor.image) new Image().src = neighbor.image;
    }
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
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await document.documentElement.requestFullscreen();
    }
  }

  function toggleVideo() {
    const videos = activeVideos();
    if (videos.some(video => !video.paused)) {
      videos.forEach(video => video.pause());
      return;
    }
    videos.forEach(video => {
      if (video.ended) video.currentTime = 0;
      play(video);
    });
  }

  presentation.addEventListener('click', event => {
    if (event.button !== 0) return;
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
    if (event.code === 'Space' && event.target?.closest('button')) return;
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
        toggleFullscreen().catch(() => {
          status.textContent = 'Полноэкранный режим можно включить в браузере.';
        });
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
  window.addEventListener('resize', fit);
  window.addEventListener('hashchange', () => show(indexFromHash()));
  show(indexFromHash());
})();

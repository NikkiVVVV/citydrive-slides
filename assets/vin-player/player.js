(() => {
  const deckLayout = new URLSearchParams(location.search).get('view') === 'deck';
  if (deckLayout) {
    document.documentElement.dataset.layout = 'deck';
    document.querySelector('.player-versions').hidden = false;
  }

  const duration = 15.6;
  const host = document.querySelector('#scene');
  const scene = window.mountDeckVinScene(host, { assetBase: '../slide-10/' });
  const scrub = document.querySelector('#scrub');
  const speed = document.querySelector('#speed');
  const readout = document.querySelector('#time');
  const play = document.querySelector('#play');
  const stage = document.querySelector('.stage');
  const mockup = document.querySelector('.mockup-ui');
  const modes = [...document.querySelectorAll('[data-mode]')];
  const themes = [...document.querySelectorAll('[data-theme-option]')];
  const sources = [...document.querySelectorAll('[data-source]')];
  const scenes = [...document.querySelectorAll('[data-time]')];
  const cuts = [...document.querySelectorAll('.chapters [data-time]')].map(button => Number(button.dataset.time));
  const format = seconds => seconds.toFixed(1).replace('.', ',');
  let timelineTime = 0;
  let source = 'document';
  let kind = 'vin';
  let playing = false;
  let raf = 0;
  let previousTime;
  let activeCut;

  function mark(buttons, selected) {
    for (const button of buttons) button.setAttribute('aria-pressed', String(selected(button)));
  }

  function setMode(mode) {
    stage.dataset.view = mode;
    mockup.hidden = mode !== 'mockup';
    mark(modes, button => button.dataset.mode === mode);
  }

  function render(time) {
    timelineTime = Math.max(0, Math.min(duration, time));
    const cut = cuts.findLastIndex(at => at <= timelineTime);
    if (activeCut !== cut) {
      activeCut = cut;
      kind = ({ 2: 'frame', 3: 'body' })[cut] ?? 'vin';
      scene.setHelpSource(source, kind, 'lcv');
      mark(scenes, button => Number(button.dataset.time) === cuts[cut]);
    }
    scene.renderAt(timelineTime);
    scrub.value = timelineTime;
    readout.textContent = `${format(timelineTime)} / ${format(duration)}\u00a0с`;
  }

  function setPlaying(value) {
    playing = value;
    play.textContent = value ? 'Ⅱ' : '▶';
    play.title = value ? 'Пауза' : 'Воспроизвести';
    play.setAttribute('aria-label', play.title);
    cancelAnimationFrame(raf);
    if (value) {
      previousTime = undefined;
      raf = requestAnimationFrame(tick);
    }
  }

  function tick(time) {
    if (previousTime !== undefined) render(timelineTime + (time - previousTime) / 1000 * Number(speed.value));
    previousTime = time;
    if (timelineTime >= duration) setPlaying(false);
    else if (playing) raf = requestAnimationFrame(tick);
  }

  play.addEventListener('click', () => {
    if (timelineTime >= duration) render(0);
    setPlaying(!playing);
  });
  document.querySelector('#reset').addEventListener('click', () => { setPlaying(false); render(0); });
  scrub.addEventListener('input', () => { setPlaying(false); render(Number(scrub.value)); });
  for (const button of scenes) button.addEventListener('click', () => {
    setPlaying(false);
    render(Number(button.dataset.time));
  });
  for (const button of modes) button.addEventListener('click', () => setMode(button.dataset.mode));
  for (const button of themes) button.addEventListener('click', () => {
    document.documentElement.dataset.theme = button.dataset.themeOption;
    scene.setSceneTheme(button.dataset.themeOption);
    mark(themes, entry => entry === button);
  });
  for (const button of sources) button.addEventListener('click', () => {
    source = button.dataset.source;
    scene.setHelpSource(source, kind, 'lcv');
    scene.renderAt(timelineTime);
    mark(sources, entry => entry === button);
  });

  document.addEventListener('keydown', event => {
    if (parent === window || event.metaKey || event.ctrlKey || event.altKey || event.target.closest('input, select')) return;
    if (['ArrowLeft', 'ArrowRight', 'KeyF'].includes(event.code)) {
      event.preventDefault();
      parent.postMessage({ type: 'deck-player-key', code: event.code }, '*');
    }
  });

  if (deckLayout) setMode('mockup');
  render(0);
})();

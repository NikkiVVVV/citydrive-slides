(() => {
  const lighting = document.querySelector('.slide-lighting');
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl', { alpha: true, antialias: false, depth: false });
  if (!gl) return;

  function compile(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
    gl.deleteShader(shader);
    return null;
  }

  const vertex = compile(gl.VERTEX_SHADER, `
    attribute vec2 position;
    void main() { gl_Position = vec4(position, 0.0, 1.0); }
  `);
  const fragment = compile(gl.FRAGMENT_SHADER, `
    precision highp float;
    uniform vec2 resolution;
    uniform float time;

    float beam(vec2 p, float origin, float angle, float opening) {
      float distance = (p.x - origin - angle * p.y) / (opening + .111 * p.y);
      return exp(-.5 * distance * distance);
    }

    void main() {
      vec2 p = gl_FragCoord.xy / resolution;
      p.y = 1.0 - p.y;
      float falloff = exp(-1.9 * p.y - 1.4 * p.y * p.y) * (1.0 - smoothstep(.48, .94, p.y));
      float left = .113 + .010 * sin(time * .62) + .004 * sin(time * 1.37);
      float right = .097 + .011 * sin(time * .48 + 2.0) + .004 * sin(time * 1.22 + 1.2);
      float light = falloff * (left * beam(p, .17, .155, .056) + right * beam(p, .82, -.145, .058));

      // Keep sub-pixel dither fixed while the light changes, so dark ramps do not posterize.
      float noise = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(.06711056, .00583715)))) - .5;
      float alpha = max(0.0, light + noise * (1.9 / 255.0) * smoothstep(0.0, .012, light));
      gl_FragColor = vec4(vec3(.88, .92, .98) * alpha, alpha);
    }
  `);
  if (!vertex || !fragment) return;

  const program = gl.createProgram();
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
  gl.useProgram(program);
  gl.disable(gl.DITHER);

  const quad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, 'position');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  const resolution = gl.getUniformLocation(program, 'resolution');
  const time = gl.getUniformLocation(program, 'time');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const started = performance.now();
  let frame = 0;
  let lastPaint = 0;

  function resize() {
    const { width, height } = lighting.getBoundingClientRect();
    if (!width || !height || gl.isContextLost()) return;
    const scale = Math.min(devicePixelRatio, 2600 / width);
    const pixelWidth = Math.round(width * scale);
    const pixelHeight = Math.round(height * scale);
    if (!pixelWidth || !pixelHeight) return;
    canvas.width = pixelWidth;
    canvas.height = pixelHeight;
    gl.viewport(0, 0, pixelWidth, pixelHeight);
    gl.uniform2f(resolution, pixelWidth, pixelHeight);
    if (!document.hidden) paint(performance.now());
  }

  function paint(now) {
    gl.uniform1f(time, reducedMotion.matches ? 0 : (now - started) / 1000);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  function tick(now) {
    if (now - lastPaint >= 32) {
      paint(now);
      lastPaint = now;
    }
    frame = requestAnimationFrame(tick);
  }

  function update() {
    cancelAnimationFrame(frame);
    if (document.hidden || gl.isContextLost()) return;
    paint(performance.now());
    if (!reducedMotion.matches) frame = requestAnimationFrame(tick);
  }

  canvas.addEventListener('webglcontextlost', () => {
    cancelAnimationFrame(frame);
    delete lighting.dataset.renderer;
  }, { once: true });
  lighting.append(canvas);
  lighting.dataset.renderer = 'webgl';
  new ResizeObserver(resize).observe(lighting);
  resize();
  reducedMotion.addEventListener('change', update);
  document.addEventListener('visibilitychange', update);
  update();
})();

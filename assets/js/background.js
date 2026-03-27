(function () {
  var canvas = document.getElementById('glcanvas');
  var gl = canvas.getContext('webgl2');
  if (!gl) {
    console.error('WebGL2 not supported');
    return;
  }

  function resize() {
    var dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  window.addEventListener('resize', resize);
  resize();

  function compileShader(type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compile error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  function loadShader(url) {
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error('Failed to load ' + url + ': ' + r.status);
      return r.text();
    });
  }

  Promise.all([
    loadShader('/assets/shaders/fullscreen.vert'),
    loadShader('/assets/shaders/matrix.frag')
  ]).then(function (sources) {
    var vertShader = compileShader(gl.VERTEX_SHADER, sources[0]);
    var fragShader = compileShader(gl.FRAGMENT_SHADER, sources[1]);
    if (!vertShader || !fragShader) return;

    var program = gl.createProgram();
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    var posAttr = gl.getAttribLocation(program, 'aPosition');
    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,  1, -1,  -1, 1,  1, 1
    ]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(posAttr);
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

    var uResolution = gl.getUniformLocation(program, 'iResolution');
    var uTime = gl.getUniformLocation(program, 'iTime');

    var startTime = performance.now();

    function render() {
      var elapsed = (performance.now() - startTime) / 1000.0;
      gl.uniform3f(uResolution, canvas.width, canvas.height, 1.0);
      gl.uniform1f(uTime, elapsed);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
  });
})();

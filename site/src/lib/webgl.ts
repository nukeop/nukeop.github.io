export function compileShader(
	gl: WebGL2RenderingContext,
	type: number,
	source: string,
): WebGLShader | null {
	const shader = gl.createShader(type);
	if (!shader) return null;

	gl.shaderSource(shader, source);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		console.error("Shader compile error:", gl.getShaderInfoLog(shader));
		gl.deleteShader(shader);
		return null;
	}

	return shader;
}

export function createProgram(
	gl: WebGL2RenderingContext,
	vertexShader: WebGLShader,
	fragmentShader: WebGLShader,
): WebGLProgram | null {
	const program = gl.createProgram();
	if (!program) return null;

	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);

	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error("Program link error:", gl.getProgramInfoLog(program));
		gl.deleteProgram(program);
		return null;
	}

	return program;
}

export type GlResources = {
	program: WebGLProgram;
	vertShader: WebGLShader;
	fragShader: WebGLShader;
	vao: WebGLVertexArrayObject | null;
	vbo: WebGLBuffer | null;
};

/**
 * Sets up a fullscreen quad program from shader sources.
 * Returns the GL resources needed for rendering + cleanup, or null if setup fails.
 */
export function setupFullscreenQuad(
	gl: WebGL2RenderingContext,
	vertSource: string,
	fragSource: string,
): GlResources | null {
	const vertShader = compileShader(gl, gl.VERTEX_SHADER, vertSource);
	const fragShader = compileShader(gl, gl.FRAGMENT_SHADER, fragSource);
	if (!vertShader || !fragShader) return null;

	const program = createProgram(gl, vertShader, fragShader);
	if (!program) return null;

	const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
	const vao = gl.createVertexArray();
	const vbo = gl.createBuffer();

	gl.bindVertexArray(vao);
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

	const aPosition = gl.getAttribLocation(program, "aPosition");
	gl.enableVertexAttribArray(aPosition);
	gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

	gl.bindVertexArray(null);

	return { program, vertShader, fragShader, vao, vbo };
}

export function cleanupGlResources(
	gl: WebGL2RenderingContext,
	res: GlResources,
): void {
	gl.deleteProgram(res.program);
	gl.deleteShader(res.vertShader);
	gl.deleteShader(res.fragShader);
	gl.deleteBuffer(res.vbo);
	gl.deleteVertexArray(res.vao);
}

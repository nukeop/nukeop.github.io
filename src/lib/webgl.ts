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

export type FboResources = {
	framebuffer: WebGLFramebuffer;
	texture: WebGLTexture;
};

export function createFbo(
	gl: WebGL2RenderingContext,
	width: number,
	height: number,
): FboResources | null {
	const framebuffer = gl.createFramebuffer();
	const texture = gl.createTexture();
	if (!framebuffer || !texture) return null;

	const useFloat = !!gl.getExtension("EXT_color_buffer_half_float");
	const internalFormat = useFloat ? gl.RGBA16F : gl.RGBA8;
	const type = useFloat ? gl.HALF_FLOAT : gl.UNSIGNED_BYTE;

	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(
		gl.TEXTURE_2D,
		0,
		internalFormat,
		width,
		height,
		0,
		gl.RGBA,
		type,
		null,
	);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

	gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
	gl.framebufferTexture2D(
		gl.FRAMEBUFFER,
		gl.COLOR_ATTACHMENT0,
		gl.TEXTURE_2D,
		texture,
		0,
	);

	const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
	if (status !== gl.FRAMEBUFFER_COMPLETE) {
		console.error("Framebuffer incomplete:", status);
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		gl.deleteFramebuffer(framebuffer);
		gl.deleteTexture(texture);
		return null;
	}

	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	gl.bindTexture(gl.TEXTURE_2D, null);

	return { framebuffer, texture };
}

export function resizeFbo(
	gl: WebGL2RenderingContext,
	fbo: FboResources,
	width: number,
	height: number,
): void {
	const useFloat = !!gl.getExtension("EXT_color_buffer_half_float");
	const internalFormat = useFloat ? gl.RGBA16F : gl.RGBA8;
	const type = useFloat ? gl.HALF_FLOAT : gl.UNSIGNED_BYTE;

	gl.bindTexture(gl.TEXTURE_2D, fbo.texture);
	gl.texImage2D(
		gl.TEXTURE_2D,
		0,
		internalFormat,
		width,
		height,
		0,
		gl.RGBA,
		type,
		null,
	);
	gl.bindTexture(gl.TEXTURE_2D, null);
}

export function cleanupFbo(
	gl: WebGL2RenderingContext,
	fbo: FboResources,
): void {
	gl.deleteFramebuffer(fbo.framebuffer);
	gl.deleteTexture(fbo.texture);
}

export type QuadResources = {
	vao: WebGLVertexArrayObject;
	vbo: WebGLBuffer;
};

export function createFullscreenQuad(
	gl: WebGL2RenderingContext,
): QuadResources | null {
	const vao = gl.createVertexArray();
	const vbo = gl.createBuffer();
	if (!vao || !vbo) return null;

	const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);

	gl.bindVertexArray(vao);
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
	gl.enableVertexAttribArray(0);
	gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
	gl.bindVertexArray(null);

	return { vao, vbo };
}

export type ShaderProgramResources = {
	program: WebGLProgram;
	vertShader: WebGLShader;
	fragShader: WebGLShader;
};

export function createShaderProgram(
	gl: WebGL2RenderingContext,
	vertSource: string,
	fragSource: string,
): ShaderProgramResources | null {
	const vertShader = compileShader(gl, gl.VERTEX_SHADER, vertSource);
	const fragShader = compileShader(gl, gl.FRAGMENT_SHADER, fragSource);
	if (!vertShader || !fragShader) return null;

	const program = createProgram(gl, vertShader, fragShader);
	if (!program) return null;

	return { program, vertShader, fragShader };
}

export function cleanupShaderProgram(
	gl: WebGL2RenderingContext,
	res: ShaderProgramResources,
): void {
	gl.deleteProgram(res.program);
	gl.deleteShader(res.vertShader);
	gl.deleteShader(res.fragShader);
}

export type PassDescriptor = {
	fragSource: string;
	uniforms?: Record<string, "float">;
};

type CompiledPass = {
	program: ShaderProgramResources;
	iResolutionLoc: WebGLUniformLocation | null;
	inputTextureLoc: WebGLUniformLocation | null;
	extraLocs: Record<string, WebGLUniformLocation | null>;
};

export type RenderPipeline = {
	render: (
		width: number,
		height: number,
		uniforms?: Record<string, number>,
	) => void;
	resize: (width: number, height: number) => void;
	cleanup: () => void;
};

export function createPipeline(
	gl: WebGL2RenderingContext,
	vertSource: string,
	passes: PassDescriptor[],
	initialWidth: number,
	initialHeight: number,
): RenderPipeline | null {
	const quad = createFullscreenQuad(gl);
	if (!quad) return null;

	const compiled: CompiledPass[] = [];
	for (const pass of passes) {
		const program = createShaderProgram(gl, vertSource, pass.fragSource);
		if (!program) return null;

		const extraLocs: Record<string, WebGLUniformLocation | null> = {};
		if (pass.uniforms) {
			for (const name of Object.keys(pass.uniforms)) {
				extraLocs[name] = gl.getUniformLocation(program.program, name);
			}
		}

		compiled.push({
			program,
			iResolutionLoc: gl.getUniformLocation(program.program, "iResolution"),
			inputTextureLoc: gl.getUniformLocation(program.program, "uInputTexture"),
			extraLocs,
		});
	}

	const fbos: FboResources[] = [];
	for (let i = 0; i < passes.length - 1; i++) {
		const fbo = createFbo(gl, initialWidth, initialHeight);
		if (!fbo) return null;
		fbos.push(fbo);
	}

	function render(
		width: number,
		height: number,
		uniforms?: Record<string, number>,
	) {
		gl.bindVertexArray(quad.vao);

		for (let i = 0; i < compiled.length; i++) {
			const pass = compiled[i];
			const isLast = i === compiled.length - 1;

			gl.bindFramebuffer(gl.FRAMEBUFFER, isLast ? null : fbos[i].framebuffer);
			gl.viewport(0, 0, width, height);
			// biome-ignore lint/correctness/useHookAtTopLevel: not a hook
			gl.useProgram(pass.program.program);

			if (i > 0) {
				gl.activeTexture(gl.TEXTURE0);
				gl.bindTexture(gl.TEXTURE_2D, fbos[i - 1].texture);
				gl.uniform1i(pass.inputTextureLoc, 0);
			}

			gl.uniform3f(pass.iResolutionLoc, width, height, 1);

			if (uniforms) {
				for (const [name, value] of Object.entries(pass.extraLocs)) {
					if (name in uniforms) {
						gl.uniform1f(value, uniforms[name]);
					}
				}
			}

			gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
		}

		gl.bindVertexArray(null);
	}

	function resize(width: number, height: number) {
		for (const fbo of fbos) {
			resizeFbo(gl, fbo, width, height);
		}
	}

	function cleanup() {
		for (const pass of compiled) {
			cleanupShaderProgram(gl, pass.program);
		}
		for (const fbo of fbos) {
			cleanupFbo(gl, fbo);
		}
		gl.deleteVertexArray(quad.vao);
		gl.deleteBuffer(quad.vbo);
	}

	return { render, resize, cleanup };
}

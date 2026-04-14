import type { FC } from "react";
import { useEffect, useRef } from "react";
import { CRT_FRAGMENT_SHADER, VERTEX_SHADER } from "../lib/shaders";
import { cleanupGlResources, setupFullscreenQuad } from "../lib/webgl";

export const CrtMonitor: FC<{ className?: string }> = ({ className = "" }) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const gl = canvas.getContext("webgl2");
		if (!gl) return;

		const res = setupFullscreenQuad(gl, VERTEX_SHADER, CRT_FRAGMENT_SHADER);
		if (!res) return;

		const iResolutionLoc = gl.getUniformLocation(res.program, "iResolution");
		const iTimeLoc = gl.getUniformLocation(res.program, "iTime");

		let rafId: number;
		const startTime = performance.now();

		function render() {
			if (!gl || !canvas) return;

			gl.viewport(0, 0, canvas.width, canvas.height);
			// biome-ignore lint/correctness/useHookAtTopLevel: not a hook
			gl.useProgram(res.program);

			const elapsed = (performance.now() - startTime) / 1000;
			gl.uniform3f(iResolutionLoc, canvas.width, canvas.height, 1);
			gl.uniform1f(iTimeLoc, elapsed);

			gl.bindVertexArray(res.vao);
			gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
			gl.bindVertexArray(null);

			rafId = requestAnimationFrame(render);
		}

		rafId = requestAnimationFrame(render);

		const observer = new ResizeObserver((entries) => {
			for (const entry of entries) {
				const { width, height } = entry.contentRect;
				const dpr = devicePixelRatio;
				canvas.width = Math.round(width * dpr);
				canvas.height = Math.round(height * dpr);
			}
		});
		if (canvas.parentElement) {
			observer.observe(canvas.parentElement);
		}

		return () => {
			cancelAnimationFrame(rafId);
			observer.disconnect();
			cleanupGlResources(gl, res);
		};
	}, []);

	return (
		<div className={`relative ${className}`}>
			<img
				src="/monitor.png"
				alt=""
				className="relative w-full h-auto pointer-events-none select-none"
				draggable={false}
			/>
			<canvas
				ref={canvasRef}
				className="absolute mix-blend-screen"
				style={{
					left: "8%",
					top: "8%",
					width: "84%",
					height: "65%",
				}}
			/>
		</div>
	);
};

import type { FC } from "react";
import { useEffect, useRef } from "react";
import {
	CRT_LOTTES_SHADER,
	MATRIX_RAIN_SHADER,
	VERTEX_SHADER,
	VHS_DOWNSAMPLE_SHADER,
	VHS_RECONSTRUCT_SHADER,
} from "../lib/shaders";
import { createPipeline } from "../lib/webgl";

export const CrtMonitor: FC<{ className?: string }> = ({ className = "" }) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const gl = canvas.getContext("webgl2");
		if (!gl) return;

		const pipeline = createPipeline(
			gl,
			VERTEX_SHADER,
			[
				{
					fragSource: MATRIX_RAIN_SHADER,
					uniforms: { iTime: "float" },
				},
				{ fragSource: VHS_DOWNSAMPLE_SHADER },
				{ fragSource: VHS_RECONSTRUCT_SHADER },
				{ fragSource: CRT_LOTTES_SHADER },
			],
			canvas.width || 1,
			canvas.height || 1,
		);
		if (!pipeline) return;

		let rafId: number;
		const startTime = performance.now();

		function render() {
			if (!canvas) return;
			const elapsed = (performance.now() - startTime) / 1000;
			pipeline.render(canvas.width, canvas.height, { iTime: elapsed });
			rafId = requestAnimationFrame(render);
		}

		rafId = requestAnimationFrame(render);

		const observer = new ResizeObserver((entries) => {
			for (const entry of entries) {
				const { width, height } = entry.contentRect;
				const dpr = devicePixelRatio;
				const w = Math.round(width * dpr);
				const h = Math.round(height * dpr);
				canvas.width = w;
				canvas.height = h;
				pipeline.resize(w, h);
			}
		});
		if (canvas.parentElement) {
			observer.observe(canvas.parentElement);
		}

		return () => {
			cancelAnimationFrame(rafId);
			observer.disconnect();
			pipeline.cleanup();
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

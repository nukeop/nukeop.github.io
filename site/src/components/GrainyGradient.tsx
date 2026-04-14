import type { CSSProperties, FC, ReactNode } from "react";

const grainSvg = (freq: number) =>
	`url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='250' height='250'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='${freq}' numOctaves='4' stitchTiles='stitch'/></filter><rect width='250' height='250' filter='url(%23n)'/></svg>")`;

type GrainyGradientProps = {
	children?: ReactNode;
	from: string;
	to: string;
	angle?: number;
	grainFrequency?: number;
	grainOpacity?: number;
	className?: string;
};

export const GrainyGradient: FC<GrainyGradientProps> = ({
	children,
	from,
	to,
	angle = 145,
	grainFrequency = 0.85,
	grainOpacity = 0.45,
	className = "",
}) => {
	const style = {
		backgroundImage: `linear-gradient(${angle}deg in oklch, ${from}, ${to})`,
		"--grain-svg": grainSvg(grainFrequency),
		"--grain-opacity": grainOpacity,
	} as CSSProperties;

	return (
		<div className={`grainy rounded-2xl ${className}`} style={style}>
			{children}
		</div>
	);
};

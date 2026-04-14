import type { FC } from "react";

type PanelProps = {
	children: React.ReactNode;
	className?: string;
};

export const Panel: FC<PanelProps> = ({ children, className }) => {
	return (
		<div
			className={`squircle rounded-xl border-[0.5px] border-black/10 bg-linear-to-b from-stone-50 to-stone-200 shadow-plastic-panel p-4 ${className ?? ""}`}
		>
			{children}
		</div>
	);
};

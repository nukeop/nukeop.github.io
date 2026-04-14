import type { FC } from "react";

type PanelProps = {
	children: React.ReactNode;
};
export const Panel: FC<PanelProps> = ({ children }) => {
	return (
		<div className="rounded-md bg-white p-2 shadow-xl border-b-stone-400 border-b-4">
			{children}
		</div>
	);
};

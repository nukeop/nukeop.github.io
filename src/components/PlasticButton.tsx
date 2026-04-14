import type { FC, ReactNode } from "react";

type PlasticButtonProps = {
	children: ReactNode;
	onClick?: () => void;
};

export const PlasticButton: FC<PlasticButtonProps> = ({
	children,
	onClick,
}) => {
	return (
		<button
			type="button"
			onClick={onClick}
			className="squircle cursor-pointer select-none rounded-2xl border-[0.5px] border-black/10 bg-linear-to-b from-stone-50 to-stone-200 px-6 py-2.75 text-sm font-bold tracking-wide text-stone-800 [text-shadow:0_1px_0_theme(--color-white/90%)] shadow-plastic hover:shadow-plastic-hover active:shadow-plastic-active hover:from-white hover:to-stone-100 active:translate-y-1 active:from-stone-100 active:to-stone-200 transition-all duration-70 ease-in"
		>
			{children}
		</button>
	);
};

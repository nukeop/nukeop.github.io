import { type FC, useState } from "react";

export const Toggle: FC = () => {
	const [checked, setChecked] = useState(false);

	return (
		<div className="relative flex items-center justify-center rounded-[0.5em] p-[0.125em] text-[1.5em]">
			<input
				type="checkbox"
				checked={checked}
				onChange={() => setChecked(!checked)}
				className="absolute z-10 h-full w-full cursor-pointer appearance-none rounded-[inherit] font-[inherit] opacity-0"
			/>
			<div
				className={`relative flex items-center rounded-[0.375em] w-[3em] h-[1.5em] shadow-[inset_0_0_0.0625em_0.125em_rgba(255,255,255,0.2),inset_0_0.0625em_0.125em_rgba(0,0,0,0.4)] transition-colors duration-200 ${checked ? "bg-amber-400" : "bg-neutral-200"}`}
			>
				<div
					className={`absolute flex items-center justify-center rounded-[0.3125em] w-[1.375em] h-[1.375em] bg-neutral-200 shadow-[inset_0_-0.0625em_0.0625em_0.125em_rgba(0,0,0,0.1),inset_0_-0.125em_0.0625em_rgba(0,0,0,0.2),inset_0_0.1875em_0.0625em_rgba(255,255,255,0.3),0_0.125em_0.125em_rgba(0,0,0,0.5)] transition-[left] duration-200 ease-out ${checked ? "left-[1.5625em]" : "left-[0.0625em]"}`}
				>
					<div className="absolute grid grid-cols-3 gap-[0.125em]">
						{Array.from({ length: 12 }, (_, i) => (
							<div
								key={i}
								className="h-[0.125em] w-[0.125em] rounded-full bg-[radial-gradient(circle_at_50%_0,var(--color-white),var(--color-neutral-400))]"
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

import { GrainyGradient } from "./GrainyGradient";
import { Panel } from "./Panel";
import { PlasticButton } from "./PlasticButton";
import { Toggle } from "./Toggle";

export const App = () => {
	return (
		<div className="p-4">
			<Toggle />
			<Panel>
				<PlasticButton>Matte Plastic</PlasticButton>
				<Panel>
					<GrainyGradient
						from="oklch(0.48 0.26 290)"
						to="oklch(0.3 0.3 325)"
						className="w-20 h-20"
					></GrainyGradient>
				</Panel>
			</Panel>
		</div>
	);
};

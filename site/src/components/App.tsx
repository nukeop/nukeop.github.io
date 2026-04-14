import { CrtMonitor } from "./CrtMonitor";

export const App = () => {
	return (
		<div className="p-4 flex flex-col gap-4 items-center justify-center h-dvh">
			
			<CrtMonitor className="w-[500px]" />
		</div>
	);
};

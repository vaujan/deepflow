import Profile from "./profile";
import WidgetList from "./widget-list";
import { HelpCircle } from "lucide-react";
import { useOnboarding } from "@/src/contexts/OnboardingContext";

export default function Header() {
	const { startTour } = useOnboarding();

	return (
		<header className="w-full relative flex flex-col gap-4 items-center justify-start">
			<div className="flex w-full h-fit flex-col">
				<div className="max-w-8xl h-fit flex justify-between gap-6 w-full px-8 py-3">
					{/* active widgets count */}
					<WidgetList />
					<div className="flex gap-4 items-center">
						<button
							onClick={startTour}
							className="p-2 rounded-lg hover:bg-gray-4 focus:outline-none focus:ring-2 focus:ring-blue-9 focus:ring-offset-2 focus:ring-offset-gray-2 transition-colors"
							aria-label="Replay tutorial"
							data-tour="help-button"
						>
							<HelpCircle className="w-5 h-5 text-gray-11 hover:text-gray-12" />
						</button>
						<Profile />
					</div>
				</div>
			</div>
		</header>
	);
}

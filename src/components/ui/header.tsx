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
						<div className="tooltip tooltip-bottom">
							<div className="tooltip-content">Help</div>
							<button
								onClick={startTour}
								className="btn btn-sm btn-circle btn-ghost"
								aria-label="Replay tutorial"
								data-tour="help-button"
							>
								<HelpCircle className="size-4 text-base-content/50" />
							</button>
						</div>
						<Profile />
					</div>
				</div>
			</div>
		</header>
	);
}

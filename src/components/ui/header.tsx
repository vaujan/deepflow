import Profile from "./profile";
import WidgetList from "./widget-list";
import { HelpCircle } from "lucide-react";
import { useOnboarding } from "@/src/contexts/OnboardingContext";
import { useAuthUser } from "@/src/hooks/useAuthUser";
import Link from "next/link";

export default function Header() {
	const { startTour } = useOnboarding();
	const { isGuest } = useAuthUser();

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
						{isGuest ? (
							<Link href="/login">
								<button
									className="btn btn-sm btn-primary"
									aria-label="Sign in to save & sync"
								>
									Sign in to save & sync
								</button>
							</Link>
						) : (
							<Profile />
						)}
					</div>
				</div>
			</div>
		</header>
	);
}

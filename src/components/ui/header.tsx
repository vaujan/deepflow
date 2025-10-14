import { AreaChartIcon } from "lucide-react";
import Profile from "./profile";
import WidgetList from "./widget-list";
import SyncStatus from "./sync-status";
import Link from "next/link";

export default function Header() {
	return (
		<header className="w-full relative flex flex-col gap-4 items-center justify-start">
			<div className="flex w-full h-fit flex-col">
				<div className="max-w-8xl h-fit flex justify-between gap-6 w-full px-8 py-3">
					{/* active widgets count */}
					<WidgetList />
					<div className="flex gap-4 items-center">
						<SyncStatus />
						<Profile />
						{/*  window control for when it opened in electron. minim */}
					</div>
				</div>
			</div>
		</header>
	);
}

import React from "react";
import Sidebar from "../components/ui/sidebar";
import LeftCard from "../components/ui/left-card";
import RightCard from "../components/ui/right-card";
import Dock from "../components/ui/dock";
import Stats from "../components/ui/session-table";
import DeepWork from "../components/ui/deepwork";

export default function Page() {
	return (
		<div className="min-h-screen bg-base-300 flex flex-col lg:flex-row">
			<Sidebar />
			<main className="w-full relative flex flex-col gap-6 flex-1 items-center justify-start ">
				{/* Container */}
				<div className="max-w-8xl flex flex-col gap-6 w-full px-8 py-16">
					<div className="w-full gap-8 flex">
						{/* Card */}
						<div className="flex flex-col gap-8">
							<LeftCard />
							<DeepWork />
						</div>
						{/*  Card */}
						<div className="flex flex-col gap-8">
							<Stats />
							<RightCard />
						</div>
					</div>

					<div className="w-full flex">
						{/* Card */}
						<Stats />
					</div>
				</div>

				<div className="font-medium sticky w-32 bottom-10">
					<Dock />
				</div>
			</main>
		</div>
	);
}

import React from "react";
import Sidebar from "../components/ui/sidebar";
import LeftCard from "../components/ui/left-card";
import RightCard from "../components/ui/right-card";
import Dock from "../components/ui/dock";

export default function Page() {
	return (
		<div className="min-h-screen flex flex-col lg:flex-row">
			<Sidebar />
			<main className="w-full relative flex gap-6 flex-1 items-start justify-center ">
				<div className="max-w-8xl flex gap-6 w-full px-8 py-16">
					{/* Card */}
					<LeftCard />
					{/*  Card */}
					<RightCard />
				</div>

				{/* <div className="font-medium absolute w-32 left-10 bottom-10">
					<Dock />
				</div> */}
			</main>
		</div>
	);
}

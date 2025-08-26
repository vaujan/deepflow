import Dock from "@/src/components/ui/dock";
import SessionCard from "@/src/components/ui/session-card";
import Sidebar from "@/src/components/ui/sidebar";
import React from "react";
import { DataTable } from "../components/ui/data-table";

export default function Page() {
	return (
		<div className="min-h-screen bg-base-300 flex flex-col lg:flex-row">
			<Sidebar />
			{/* Container */}
			<main className="w-full relative flex flex-col gap-4 flex-1 items-center justify-start">
				<div className="flex w-full h-full flex-col">
					<div className="max-w-8xl items-start justify-center h-full flex gap-6 w-full px-8 py-8">
						<SessionCard />
						{/* <SessionTable /> */}
						<DataTable />
						{/* <SessionGraph /> */}
					</div>
				</div>

				{/* Widgets layout */}
				<div className="min-h-screen w-full justify-center items-center flex flex-col gap-4 ">
					{/* Kanban widget */}
					{/* <div className="flex flex-col w-full h-fit px-4">
						<div className="w-full h-128 rounded-box bg-base-100 border border-base-100"></div>
					</div> */}

					{/* Notes and tasks widget */}
					{/* <div className="flex w-full gap-4 h-fit px-4">
						<div className="w-full h-128 rounded-box bg-base-100 border border-base-100"></div>
						<div className="w-full h-128 rounded-box bg-base-100 border border-base-100"></div>
					</div> */}
				</div>
				<div className="font-medium sticky w-32 bottom-10">
					<Dock />
				</div>
			</main>
		</div>
	);
}

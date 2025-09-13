"use client";

import SessionCard from "@/src/components/ui/session-card";
import Sidebar from "../components/ui/sidebar";
import React from "react";

import Header from "../components/ui/header";
import { useWidgets } from "../contexts/WidgetContext";
import WidgetNotes from "../components/ui/widget-notes";
import WidgetTask from "../components/ui/widget-task";

export default function Page() {
	const { activeWidgets } = useWidgets();

	return (
		<div className="flex flex-col min-h-screen bg-base-300 lg:flex-row">
			<Sidebar />
			{/* Container */}
			<main className="relative flex flex-col items-start justify-start flex-1 w-full h-full gap-4 overflow-hidden">
				<Header />
				<div className="flex flex-col w-full h-full">
					<div className="w-full h-full overflow-x-auto horizontal-scroll-container">
						<div
							className={`flex flex-col lg:flex-row ${
								activeWidgets.length > 1 ? "justify-start" : "justify-center"
							} w-full items-start gap-8 px-4 lg:px-8 py-4`}
						>
							{/* Session Card - Always visible */}
							<SessionCard />

							{/* Widgets Container */}
							{(activeWidgets.includes("note") ||
								activeWidgets.includes("tasks") ||
								activeWidgets.includes("kanban")) && (
								<div
									className={`flex flex-row rounded-box w-full overflow-x-scroll border-border border p-4 lg:w-fit lg:p-0 lg:border-0 lg:overflow-x-visible gap-8 h-fit`}
								>
									{activeWidgets.includes("note") && <WidgetNotes />}
									{activeWidgets.includes("tasks") && <WidgetTask />}
									{/* {activeWidgets.includes("kanban") && <WidgetKanban />} */}
								</div>
							)}
							{/* <div className="bg-red-500 w-xl h-xl">hello world</div> */}
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}

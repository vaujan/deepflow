"use client";

import SessionCard from "@/src/components/ui/session-card";
import Sidebar from "../components/ui/sidebar";
import React from "react";

import Header from "../components/ui/header";
import { useWidgets } from "../contexts/WidgetContext";
import WidgetKanban from "../components/ui/widget-kanban";
import WidgetNotes from "../components/ui/widget-notes";
import WidgetTask from "../components/ui/widget-task";

export default function Page() {
	const { activeWidgets } = useWidgets();

	return (
		<div className="min-h-screen bg-base-300 flex flex-col lg:flex-row">
			<Sidebar />
			{/* Container */}
			<main className="w-full h-full relative overflow-hidden flex flex-col gap-4 flex-1 items-start justify-start">
				<Header />
				<div className="flex w-full h-full flex-col">
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
									className={`flex flex-row rounded-box w-full border-border border md:bg-pink-500 lg:bg-cyan-500 p-4 md:w-fit md:p-0 md:border-0 overflow-x-auto gap-8 h-fit`}
								>
									{activeWidgets.includes("note") && <WidgetNotes />}
									{activeWidgets.includes("tasks") && <WidgetTask />}
									{/* {activeWidgets.includes("kanban") && <WidgetKanban />} */}
								</div>
							)}
							{/* <div className="w-xl h-xl bg-red-500">hello world</div> */}
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}

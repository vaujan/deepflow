"use client";

import SessionCard from "@/src/components/ui/session-card";
import React from "react";

import { useWidgets } from "../contexts/WidgetContext";
import WidgetNotes from "../components/ui/widget-notes";
import WidgetTask from "../components/ui/widget-task";
import Dock from "../components/ui/dock";
import WidgetTimer from "../components/ui/widget-timer";
import Header from "../components/ui/header";
export default function Page() {
	const { activeWidgets } = useWidgets();

	return (
		<div className="flex bg-base-300 flex-col min-h-screen lg:flex-row">
			{/* Container */}
			<main
				className={`flex flex-col items-start justify-start flex-1 w-full h-full gap-4 pb-20`}
			>
				{/* <Header /> */}
				<div className="flex flex-col w-full h-full">
					<div className="w-full h-full horizontal-scroll-container">
						<div
							className={`flex flex-col  lg:flex-row ${
								activeWidgets.length > 1 ? "justify-start" : "justify-center"
							} w-full items-start gap-8 px-4 lg:px-8 py-24`}
						>
							{/* Session Card - Always visible */}
							<SessionCard />

							{/* Widgets Container - Single widget mode */}
							{activeWidgets.length > 0 && (
								<div className="flex flex-row rounded-box w-full overflow-x-scroll border-border border p-4 lg:w-fit lg:p-0 lg:border-0 lg:overflow-x-visible gap-8 h-fit">
									{activeWidgets.includes("note") && <WidgetNotes />}
									{activeWidgets.includes("tasks") && <WidgetTask />}
									{/* {activeWidgets.includes("kanban") && <WidgetKanban />} */}
								</div>
							)}
						</div>
					</div>
				</div>
				<Dock />

				{/* Dock - Fixed at bottom */}
			</main>
		</div>
	);
}

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
			<main className="w-full relative flex flex-col gap-4 flex-1 items-start justify-start">
				<Header />
				<div className="flex w-full h-full flex-col">
					<div className="w-full h-full overflow-x-auto horizontal-scroll-container">
						<div className="flex flex-col lg:flex-row gap-8 min-w-fit items-start justify-start h-full w-full px-4 lg:px-8 py-4">
							{/* Session Card - Always visible */}
							<SessionCard />

							{/* Widgets Container */}
							{(activeWidgets.includes("note") ||
								activeWidgets.includes("tasks")) && (
								<div className="flex flex-col lg:flex-row gap-8 w-full h-fit min-w-fit">
									{activeWidgets.includes("note") && <WidgetNotes />}
									{activeWidgets.includes("tasks") && <WidgetTask />}
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Widgets layout */}
				{activeWidgets.length > 0 && (
					<div className="min-h-screen w-full justify-center items-center flex flex-col gap-4 px-4">
						{/* Kanban widget */}
						{activeWidgets.includes("kanban") && (
							<div className="flex flex-col w-full h-fit">
								<div className="w-full h-96">
									<WidgetKanban />
								</div>
							</div>
						)}

						{/* Notes and tasks widgets */}
					</div>
				)}
			</main>
		</div>
	);
}

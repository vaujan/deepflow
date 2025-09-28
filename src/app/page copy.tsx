"use client";

import SessionCard from "@/src/components/ui/session-card";
import React from "react";

import { useWidgets } from "../contexts/WidgetContext";
import WidgetsContainer from "../components/ui/widgets-container";
import Dock from "../components/ui/widget-list";
import WidgetTimer from "../components/ui/widget-timer";
import Header from "../components/ui/header";
import Sidebar from "../components/ui/sidebar";
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
					<div className="w-full h-screen">
						<div
							className={`flex flex-col h-full  lg:flex-row ${
								activeWidgets.length > 1 ? "justify-start" : "justify-center"
							} w-full items-start gap-8 px-4 lg:px-8 py-20	`}
						>
							{/* Session Card - Always visible */}
							<div className="bg-card">
								<SessionCard />
							</div>

							{/* Widgets Container - split panes */}

							<div className="h-full">
								<WidgetsContainer />
							</div>
						</div>
					</div>
				</div>
				<Dock />

				{/* Dock - Fixed at bottom */}
			</main>
		</div>
	);
}

"use client";

import React from "react";

import Header from "../components/ui/header";
import WidgetsContainer from "../components/ui/widgets-container";
export default function Page() {
	return (
		<div className="flex flex-col bg-gray-2 h-screen">
			{/* Container */}
			<main
				className={`flex flex-col flex-1 min-h-0 overflow-hidden items-start justify-start`}
			>
				<Header />
				<div className="w-full px-2 pb-2 flex-1 min-h-0">
					<div className="rounded-xl border border-border bg-dots scrollbar-thin overflow-auto h-full">
						{/* Workspace background/div */}
						<div
							className={`flex flex-col lg:flex-row w-full min-h-full items-start gap-8 `}
						>
							{/* Widgets Container respects visibility/enabled state */}
							<div className="flex-1 w-full py-4">
								<WidgetsContainer />
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}

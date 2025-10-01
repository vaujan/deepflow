"use client";

import React from "react";

import Header from "../components/ui/header";
import WidgetsContainer from "../components/ui/widgets-container";
export default function Page() {
	return (
		<div className="flex flex-col bg-gray-2 h-screen overflow-hidden">
			{/* Container */}
			<main
				className={`flex flex-col flex-1 items-start justify-start min-h-0`}
			>
				<Header />
				<div className="min-h-0 w-full h-full p-2">
					<div className="flex-1 overflow-auto min-h-0 flex w-full h-full bg-dots rounded-xl border border-border px-4">
						{/* Workspace background/div */}
						<div
							className={`flex flex-col lg:flex-row w-full h-fit items-start gap-8 `}
						>
							{/* Widgets Container respects visibility/enabled state */}
							<div className="flex-1 min-h-0 h-fit w-full py-4">
								<WidgetsContainer />
							</div>
						</div>
					</div>
				</div>

				{/* <Dock /> */}
			</main>
		</div>
	);
}

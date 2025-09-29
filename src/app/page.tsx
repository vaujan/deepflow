"use client";

import React from "react";

import Header from "../components/ui/header";
import WidgetsContainer from "../components/ui/widgets-container";
export default function Page() {
	return (
		<div className="flex flex-col bg-gray-2 h-screen overflow-hidden lg:flex-row">
			{/* Container */}
			<main
				className={`flex flex-col flex-1 items-start justify-start min-h-0`}
			>
				<Header />
				<div className="flex-1 min-h-0 flex w-full h-full">
					{/* Workspace background/div */}
					<div
						className={`flex flex-col lg:flex-row w-full items-start gap-8 px-4 lg:px-8 py-5`}
					>
						{/* Widgets Container respects visibility/enabled state */}
						<div className="flex-1 min-h-0 h-full w-full">
							<WidgetsContainer />
						</div>
					</div>
				</div>

				{/* <Dock /> */}
			</main>
		</div>
	);
}

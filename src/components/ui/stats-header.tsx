"use client";

import { PanelLeft } from "lucide-react";
import React from "react";
import { useSidebar } from "../../contexts/SidebarContext";
import FontSelector from "./font-selector";
import ThemeCustomizer from "./theme-customizer";
import ExportButton from "./export-button";

export default function StatsHeader() {
	const { isCollapsed, toggleSidebar } = useSidebar();

	return (
		<header className="w-full relative flex flex-col gap-4 flex-1 items-center justify-start">
			<div className="flex w-full h-full flex-col">
				<div className="max-w-8xl items-start h-full flex gap-6 w-full px-8 py-3">
					<nav className="flex gap-2 items-center flex-1">
						<ul className="">
							<li>
								<button
									className="btn btn-sm btn-square btn-ghost opacity-30 hover:opacity-100"
									onClick={toggleSidebar}
									title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
								>
									<PanelLeft className="size-4" />
								</button>
							</li>
						</ul>
					</nav>

					{/* Export + Theme + Font controls */}
					<div className="flex items-center gap-1">
						<ExportButton />
						{/* <ThemeCustomizer /> */}
						{/* <FontSelector /> */}
					</div>
				</div>
			</div>
		</header>
	);
}

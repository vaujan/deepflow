"use client";

import React from "react";
import { useSidebar } from "../../contexts/SidebarContext";

export function SidebarExampleUsage() {
	const { isHidden, toggleSidebar, showSidebar, hideSidebar } = useSidebar();

	return (
		<div className="card bg-base-100 p-4 space-y-4">
			<h3 className="text-lg font-semibold">Sidebar Controls</h3>

			<div className="flex flex-wrap gap-2">
				<button onClick={toggleSidebar} className="btn btn-primary btn-sm">
					{isHidden ? "Show" : "Hide"} Sidebar
				</button>

				<button onClick={hideSidebar} className="btn btn-outline btn-sm">
					Hide Sidebar
				</button>

				<button onClick={showSidebar} className="btn btn-outline btn-sm">
					Show Sidebar
				</button>
			</div>

			<div className="text-sm text-base-content/70">
				Current state:{" "}
				<span className="font-mono">{isHidden ? "Hidden" : "Visible"}</span>
			</div>
		</div>
	);
}

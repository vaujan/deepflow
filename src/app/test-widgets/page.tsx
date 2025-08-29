"use client";

import React from "react";
import { useWidgets } from "../../contexts/WidgetContext";
import WidgetKanban from "../../components/ui/widget-kanban";
import WidgetNotes from "../../components/ui/widget-notes";
import WidgetTask from "../../components/ui/widget-task";

export default function TestWidgetsPage() {
	const { activeWidgets, toggleWidget } = useWidgets();

	return (
		<div className="min-h-screen bg-base-300 p-8">
			<div className="max-w-6xl mx-auto">
				<h1 className="text-3xl font-bold mb-8">Widget Toggle Test</h1>

				{/* Widget Controls */}
				<div className="bg-base-100 p-6 rounded-lg mb-8">
					<h2 className="text-xl font-semibold mb-4">Widget Controls</h2>
					<div className="flex gap-4">
						<button
							className={`btn ${
								activeWidgets.includes("kanban") ? "btn-primary" : "btn-outline"
							}`}
							onClick={() => toggleWidget("kanban")}
						>
							{activeWidgets.includes("kanban") ? "Hide" : "Show"} Kanban
						</button>
						<button
							className={`btn ${
								activeWidgets.includes("note") ? "btn-primary" : "btn-outline"
							}`}
							onClick={() => toggleWidget("note")}
						>
							{activeWidgets.includes("note") ? "Hide" : "Show"} Notes
						</button>
						<button
							className={`btn ${
								activeWidgets.includes("tasks") ? "btn-primary" : "btn-outline"
							}`}
							onClick={() => toggleWidget("tasks")}
						>
							{activeWidgets.includes("tasks") ? "Hide" : "Show"} Tasks
						</button>
					</div>

					<div className="mt-4 p-3 bg-base-200 rounded">
						<strong>Active Widgets:</strong>{" "}
						{activeWidgets.length > 0 ? activeWidgets.join(", ") : "None"}
					</div>
				</div>

				{/* Widget Display */}
				{activeWidgets.length > 0 && (
					<div className="space-y-6">
						{activeWidgets.includes("kanban") && (
							<div className="bg-base-100 p-6 rounded-lg">
								<h3 className="text-lg font-semibold mb-4">Kanban Widget</h3>
								<div className="h-80">
									<WidgetKanban />
								</div>
							</div>
						)}

						{activeWidgets.includes("note") && (
							<div className="bg-base-100 p-6 rounded-lg">
								<h3 className="text-lg font-semibold mb-4">Notes Widget</h3>
								<div className="h-80">
									<WidgetNotes />
								</div>
							</div>
						)}

						{activeWidgets.includes("tasks") && (
							<div className="bg-base-100 p-6 rounded-lg">
								<h3 className="text-lg font-semibold mb-4">Tasks Widget</h3>
								<div className="h-80">
									<WidgetTask />
								</div>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}

"use client";

import React, { useMemo } from "react";
import { useWidgets, Widgets } from "@/src/contexts/WidgetContext";

import WidgetNotes from "./widget-notes";
import WidgetTask from "./widget-task";
import WidgetKanban from "./widget-kanban";
import WidgetTimer from "./widget-timer";

type WidgetComponent = React.ComponentType<unknown>;

const widgetRegistry: Record<Widgets, WidgetComponent> = {
	note: WidgetNotes,
	kanban: WidgetKanban,
	tasks: WidgetTask,
	journal: WidgetNotes, // temporary reuse until a dedicated widget exists
	timer: WidgetTimer,
};

export default function WidgetsContainer() {
	const { visibleWidgets } = useWidgets();

	const widgetsToRender = useMemo(() => {
		const order: Widgets[] = ["timer", "note", "tasks", "kanban", "journal"];
		const sorted = [...visibleWidgets].sort(
			(a, b) => order.indexOf(a) - order.indexOf(b)
		);
		return sorted.map((type) => ({
			type,
			Component: widgetRegistry[type],
		}));
	}, [visibleWidgets]);

	if (widgetsToRender.length === 0) return null;

	// Single widget: render without container border/padding
	if (widgetsToRender.length === 1) {
		const { Component } = widgetsToRender[0];
		return (
			<div className="w-full h-full max-w-full overflow-auto flex justify-center">
				<div className="w-full max-w-2xl">
					<Component />
				</div>
			</div>
		);
	}

	return (
		<div className="w-full h-full rounded-box py-4">
			<div className="flex gap-2 lg:gap-3 justify-center h-full">
				{widgetsToRender.map(({ Component }, index) => (
					<div
						key={`pane-${index}`}
						className="overflow-auto max-w-2xl p-4 border-border border rounded-lg flex-1 min-w-0"
					>
						<div className="h-full w-full justify-center flex">
							<Component />
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

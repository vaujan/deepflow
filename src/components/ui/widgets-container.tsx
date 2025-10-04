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
	const { activeWidgets, visibleWidgets } = useWidgets();

	const widgetsToRender = useMemo(() => {
		const order: Widgets[] = ["timer", "note", "tasks", "kanban", "journal"];
		const sorted = [...activeWidgets].sort(
			(a, b) => order.indexOf(a) - order.indexOf(b)
		);
		return sorted.map((type) => ({
			type,
			Component: widgetRegistry[type],
		}));
	}, [activeWidgets]);

	if (widgetsToRender.length === 0) return null;

	const visibleActiveCount = activeWidgets.filter((w) =>
		visibleWidgets.includes(w)
	).length;
	const isSingleVisible = visibleActiveCount === 1;

	return (
		<div className="w-full h-fit rounded-box py-4">
			<div className={`flex gap-2 lg:gap-3 justify-center h-full`}>
				{widgetsToRender.map(({ type, Component }) => {
					const isVisible = visibleWidgets.includes(type);
					const paneWidthClass =
						isSingleVisible && isVisible ? "max-w-2xl" : "max-w-lg min-w-md";
					return (
						<div
							key={`pane-${type}`}
							className={`${paneWidthClass} w-full ${
								isVisible ? "" : "hidden"
							}`}
							aria-hidden={!isVisible}
						>
							<div className="h-full w-full justify-center flex">
								<Component />
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}

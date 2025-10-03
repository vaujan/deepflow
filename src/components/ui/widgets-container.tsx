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

	// If exactly one active widget is visible, center it and hide others
	const visibleActiveCount = activeWidgets.filter((w) =>
		visibleWidgets.includes(w)
	).length;

	if (visibleActiveCount === 1) {
		const onlyVisible = widgetsToRender.find(({ type }) =>
			visibleWidgets.includes(type)
		);
		return (
			<div className="w-full h-fit max-w-full flex justify-center">
				<div className="w-full max-w-2xl">
					{onlyVisible ? <onlyVisible.Component /> : null}
				</div>
				{widgetsToRender
					.filter(({ type }) => !visibleWidgets.includes(type))
					.map(({ type, Component }) => (
						<div key={`hidden-${type}`} className="hidden" aria-hidden>
							<Component />
						</div>
					))}
			</div>
		);
	}

	return (
		<div className="w-full h-fit rounded-box py-4">
			<div className="flex gap-2 lg:gap-3 justify-center h-full">
				{widgetsToRender.map(({ type, Component }) => {
					const isVisible = visibleWidgets.includes(type);
					return (
						<div
							key={`pane-${type}`}
							className={`max-w-lg min-w-md w-full ${
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

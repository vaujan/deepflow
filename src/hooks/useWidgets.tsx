"use client";

import React from "react";

type Widgets = "note" | "kanban" | "tasks";

/**
 * useWidgets is a custom hook to manage the state of active widgets.
 * It returns the current active widgets and a function to toggle a widget's active state.
 */
export default function useWidgets(): [Widgets[], (widget: Widgets) => void] {
	const [activeWidgets, setActiveWidgets] = React.useState<Widgets[]>([]);

	const toggleWidget = (widget: Widgets) => {
		setActiveWidgets((prev) => {
			if (prev.includes(widget)) {
				// Remove widget if already active
				return prev.filter((w) => w !== widget);
			} else {
				// Add widget if not active
				return [...prev, widget];
			}
		});
	};

	return [activeWidgets, toggleWidget];
}

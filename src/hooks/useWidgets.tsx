"use client";

import React from "react";

type Widgets = "note" | "kanban" | "tasks";

/**
 * useWidgets is a custom hook to manage the state of active widgets.
 * It returns the current active widgets and a function to toggle a widget's active state.
 * Widget states are persisted in localStorage.
 */
export default function useWidgets(): [Widgets[], (widget: Widgets) => void] {
	const [activeWidgets, setActiveWidgets] = React.useState<Widgets[]>(() => {
		// Initialize from localStorage if available
		if (typeof window !== "undefined") {
			const saved = localStorage.getItem("activeWidgets");
			return saved ? JSON.parse(saved) : [];
		}
		return [];
	});

	const toggleWidget = (widget: Widgets) => {
		setActiveWidgets((prev) => {
			const newState = prev.includes(widget)
				? prev.filter((w) => w !== widget)
				: [...prev, widget];

			// Save to localStorage
			if (typeof window !== "undefined") {
				localStorage.setItem("activeWidgets", JSON.stringify(newState));
			}

			return newState;
		});
	};

	return [activeWidgets, toggleWidget];
}

"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Widgets = "note" | "kanban" | "tasks";

interface WidgetContextType {
	activeWidgets: Widgets[];
	toggleWidget: (widget: Widgets) => void;
}

const WidgetContext = createContext<WidgetContextType | undefined>(undefined);

export function WidgetProvider({ children }: { children: React.ReactNode }) {
	const [activeWidgets, setActiveWidgets] = useState<Widgets[]>(() => {
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

	// Sync with localStorage changes from other tabs/windows
	useEffect(() => {
		const handleStorageChange = (e: StorageEvent) => {
			if (e.key === "activeWidgets" && e.newValue) {
				try {
					const newValue = JSON.parse(e.newValue);
					setActiveWidgets(newValue);
				} catch (error) {
					console.error("Error parsing widget state from localStorage:", error);
				}
			}
		};

		window.addEventListener("storage", handleStorageChange);
		return () => window.removeEventListener("storage", handleStorageChange);
	}, []);

	return (
		<WidgetContext.Provider value={{ activeWidgets, toggleWidget }}>
			{children}
		</WidgetContext.Provider>
	);
}

export function useWidgets(): WidgetContextType {
	const context = useContext(WidgetContext);
	if (context === undefined) {
		throw new Error("useWidgets must be used within a WidgetProvider");
	}
	return context;
}

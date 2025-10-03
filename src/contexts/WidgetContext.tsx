"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Widgets = "note" | "kanban" | "tasks" | "journal" | "timer";

interface WidgetContextType {
	activeWidgets: Widgets[];
	toggleWidget: (widget: Widgets) => void;
	setActiveWidget: (widget: Widgets | null) => void;
	clearAllWidgets: () => void;
	visibleWidgets: Widgets[];
	toggleVisibility: (widget: Widgets) => void;
}

const WidgetContext = createContext<WidgetContextType | undefined>(undefined);

export function WidgetProvider({ children }: { children: React.ReactNode }) {
	const [activeWidgets, setActiveWidgets] = useState<Widgets[]>(() => {
		// Initialize from localStorage if available
		if (typeof window !== "undefined") {
			const saved = localStorage.getItem("activeWidgets");
			const parsed: Widgets[] = saved ? JSON.parse(saved) : [];
			// Ensure timer is always active
			return parsed.includes("timer")
				? parsed
				: (["timer", ...parsed] as Widgets[]);
		}
		return [];
	});

	const [visibleWidgets, setVisibleWidgets] = useState<Widgets[]>(() => {
		if (typeof window !== "undefined") {
			try {
				const savedVisible = localStorage.getItem("visibleWidgets");
				if (savedVisible) {
					return JSON.parse(savedVisible) as Widgets[];
				}
				const savedActive = localStorage.getItem("activeWidgets");
				return (savedActive ? JSON.parse(savedActive) : []) as Widgets[];
			} catch {
				return [];
			}
		}
		return [];
	});

	const toggleWidget = (widget: Widgets) => {
		setActiveWidgets((prev) => {
			// Prevent disabling the last active widget
			if (prev.includes(widget) && prev.length === 1) {
				return prev;
			}

			// Timer must always remain active
			if (widget === "timer") return prev;

			const newState = prev.includes(widget)
				? prev.filter((w) => w !== widget)
				: [...prev, widget];

			// Save to localStorage
			if (typeof window !== "undefined") {
				localStorage.setItem("activeWidgets", JSON.stringify(newState));
			}

			// Keep visibleWidgets in sync: enabling adds to visible, disabling removes
			setVisibleWidgets((prevVisible) => {
				// Prevent removing last visible via active disable path
				if (
					!newState.includes(widget) &&
					prevVisible.length === 1 &&
					prevVisible[0] === widget
				) {
					return prevVisible;
				}
				const nextVisible = newState.includes(widget)
					? Array.from(new Set([...prevVisible, widget]))
					: prevVisible.filter((w) => w !== widget);
				if (typeof window !== "undefined") {
					localStorage.setItem("visibleWidgets", JSON.stringify(nextVisible));
				}
				return nextVisible as Widgets[];
			});

			return newState;
		});
	};

	const setActiveWidget = (widget: Widgets | null) => {
		setActiveWidgets((prev) => {
			const candidate: Widgets[] = widget
				? [widget]
				: prev.length
				? [prev[0]]
				: ["note"];
			const nextActive: Widgets[] = candidate.includes("timer")
				? candidate
				: (["timer", ...candidate] as Widgets[]);
			if (typeof window !== "undefined") {
				localStorage.setItem("activeWidgets", JSON.stringify(nextActive));
			}
			// Do not enforce timer visibility; only synchronize visible to active selection
			setVisibleWidgets(nextActive as Widgets[]);
			if (typeof window !== "undefined") {
				localStorage.setItem("visibleWidgets", JSON.stringify(nextActive));
			}
			return nextActive;
		});
	};

	const clearAllWidgets = () => {
		// Keep at least one widget active/visible
		setActiveWidgets((prev) => {
			const fallback: Widgets = "timer";
			const nextActive: Widgets[] = [fallback];
			if (typeof window !== "undefined") {
				localStorage.setItem("activeWidgets", JSON.stringify(nextActive));
			}
			setVisibleWidgets(nextActive);
			if (typeof window !== "undefined") {
				localStorage.setItem("visibleWidgets", JSON.stringify(nextActive));
			}
			return nextActive;
		});
	};

	const toggleVisibility = (widget: Widgets) => {
		// Only affect visibility if the widget is enabled
		setVisibleWidgets((prev) => {
			if (!activeWidgets.includes(widget)) return prev;
			// Prevent hiding the last visible widget
			if (prev.includes(widget) && prev.length === 1) return prev;
			const next = prev.includes(widget)
				? prev.filter((w) => w !== widget)
				: [...prev, widget];
			if (typeof window !== "undefined") {
				localStorage.setItem("visibleWidgets", JSON.stringify(next));
			}
			return next as Widgets[];
		});
	};

	// Sync with localStorage changes from other tabs/windows
	useEffect(() => {
		const handleStorageChange = (e: StorageEvent) => {
			try {
				if (e.key === "activeWidgets" && e.newValue) {
					const newActive = JSON.parse(e.newValue);
					setActiveWidgets(newActive);
				}
				if (e.key === "visibleWidgets" && e.newValue) {
					const newVisible = JSON.parse(e.newValue);
					setVisibleWidgets(newVisible);
				}
			} catch (error) {
				console.error("Error parsing widget state from localStorage:", error);
			}
		};

		window.addEventListener("storage", handleStorageChange);
		return () => window.removeEventListener("storage", handleStorageChange);
	}, []);

	return (
		<WidgetContext.Provider
			value={{
				activeWidgets,
				toggleWidget,
				setActiveWidget,
				clearAllWidgets,
				visibleWidgets,
				toggleVisibility,
			}}
		>
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

"use client";

import React from "react";
import {
	StickyNote,
	CheckSquare,
	Kanban,
	Inbox,
	Calendar,
	LayoutGrid,
	Settings,
	Sun,
	Moon,
	Timer,
	ChartNetworkIcon,
	ChartAreaIcon,
} from "lucide-react";
import { useWidgets, Widgets } from "../../contexts/WidgetContext";
import { useTheme } from "@/src/contexts/ThemeContext";

interface DockItemData {
	id: string;
	label: string;
	icon: React.ComponentType<{ className?: string }>;
	widgetType?: Widgets;
}

interface DockItemProps {
	id: string;
	label: string;
	icon: React.ComponentType<{ className?: string }>;
	widgetType?: Widgets;
	onClick?: () => void;
}

function DockItem({
	id,
	label,
	icon: Icon,
	widgetType,
	onClick,
}: DockItemProps) {
	const { activeWidgets, toggleWidget } = useWidgets();

	const handleClick = (e: React.MouseEvent) => {
		if (widgetType) {
			// Use simple toggle behavior from WidgetContext
			toggleWidget(widgetType);
		}
		onClick?.();
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			handleClick(e as any);
		}
	};

	const isActive = widgetType ? activeWidgets.includes(widgetType) : false;

	return (
		<button
			onClick={handleClick}
			className={`relative inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
				isActive
					? "bg-primary/20 text-primary"
					: "text-base-content/80 hover:bg-base-200/60"
			}`}
			aria-label={`${label} ${isActive ? "(active)" : "(inactive)"}`}
			title={`${label} - Click to toggle`}
		>
			<Icon className="w-5 h-5 text-current" />
			{label}

			{isActive && (
				<span className="absolute -bottom-1 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-primary"></span>
			)}
		</button>
	);
}

const dockItems: DockItemData[] = [
	// {
	// 	id: "timer",
	// 	label: "Timer",
	// 	icon: Timer,
	// },
	{
		id: "notes",
		label: "Notes",
		icon: StickyNote,
		widgetType: "note",
	},
	{
		id: "tasks",
		label: "Tasks",
		icon: CheckSquare,
		widgetType: "tasks",
	},
	// {
	// 	id: "kanban",
	// 	label: "Kanban",
	// 	icon: Kanban,
	// 	widgetType: "kanban",
	// },
	// {
	// 	id: "journal",
	// 	label: "Journal",
	// 	icon: Inbox,
	// 	widgetType: "journal",
	// },
];

export default function Dock() {
	const { activeWidgets, clearAllWidgets } = useWidgets();
	const { toggleTheme, theme } = useTheme();

	return (
		<div className="fixed group bottom-6 left-1/2 transform -translate-x-1/2 z-50">
			<div className="bg-base-200/10 flex-col border-border/50 border backdrop-blur-md flex gap-2 rounded-xl shadow-xl">
				{/* Widget list */}
				<div className="flex gap-2 p-2">
					{dockItems.map((item, index) => (
						<DockItem
							key={item.id}
							id={item.id}
							label={item.label}
							icon={item.icon}
							widgetType={item.widgetType}
						/>
					))}
					<div className="ml-4 pl-4 gap-2 flex border-l border-border">
						<div className="tooltip">
							<div className="tooltip-content">Settings</div>
							<button
								className={`gap-3 text-base-content/50 btn btn-sm btn-ghost btn-square`}
								title="Settings"
								aria-label="Settings"
							>
								<Settings className="size-4" />
							</button>
						</div>

						<div className="tooltip">
							<div className="tooltip-content">Toggle theme</div>
							<button
								onClick={toggleTheme}
								className={`gap-3 btn btn-sm btn-ghost btn-square`}
								title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
							>
								{theme === "dark" ? (
									<Sun className="w-4 h-4 text-base-content/50" />
								) : (
									<Moon className="w-4 h-4 text-base-content/50" />
								)}
							</button>
						</div>

						<div className="tooltip">
							<div className="tooltip-content">Stats</div>
							<button
								className={`gap-3 text-base-content/50 btn btn-sm btn-ghost btn-square`}
								title="Stats"
								aria-label="Stats"
							>
								<ChartAreaIcon className="size-4" />
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Keyboard shortcuts hint */}
			{/* {activeWidgets.length > 0 && (
				<div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-base-100 border border-border rounded-lg px-3 py-2 text-xs text-base-content/70 shadow-lg">
					<span className="font-medium">Keyboard shortcuts:</span> 1-5 to
					toggle, Esc to close all
				</div>
			)} */}
		</div>
	);
}

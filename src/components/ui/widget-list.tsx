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
import WidgetSettingsModal from "./widget-settings-modal";

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
	const { visibleWidgets, toggleVisibility } = useWidgets();

	const handleClick = (e: React.MouseEvent) => {
		if (widgetType) {
			// Toggle only visibility; enabled set is managed by settings modal
			toggleVisibility(widgetType);
		}
		onClick?.();
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			handleClick(e as any);
		}
	};

	const isActive = widgetType ? visibleWidgets.includes(widgetType) : false;

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

const WIDGET_META: Record<
	Widgets,
	{ label: string; icon: React.ComponentType<{ className?: string }> }
> = {
	note: { label: "Notes", icon: StickyNote },
	kanban: { label: "Kanban", icon: Kanban },
	tasks: { label: "Tasks", icon: CheckSquare },
	journal: { label: "Journal", icon: Inbox },
	timer: { label: "Timer", icon: Timer },
};

export default function WidgetList() {
	const { activeWidgets, visibleWidgets, toggleVisibility } = useWidgets();
	const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
	const settingsBtnRef = React.useRef<HTMLButtonElement | null>(null);

	const order: Widgets[] = ["timer", "note", "tasks", "kanban", "journal"];
	const dockItems: DockItemData[] = React.useMemo(() => {
		const sorted = [...activeWidgets].sort(
			(a, b) => order.indexOf(a) - order.indexOf(b)
		);
		return sorted.map((type) => ({
			id: type,
			label: WIDGET_META[type].label,
			icon: WIDGET_META[type].icon,
			widgetType: type,
		}));
	}, [activeWidgets]);

	return (
		<div className="flex items-center gap-2">
			{/* Widget list */}
			<div className="flex gap-2 p-2">
				{dockItems.map((item, index) => {
					const isActive = item.widgetType
						? visibleWidgets.includes(item.widgetType)
						: false;
					return (
						<button
							key={item.id}
							onClick={() => {
								if (item.widgetType) toggleVisibility(item.widgetType);
							}}
							className={`relative inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
								isActive
									? "bg-primary/20 text-primary"
									: "text-base-content/80 hover:bg-base-200/60"
							}`}
							aria-label={`${item.label} ${
								isActive ? "(active)" : "(inactive)"
							}`}
							title={`${item.label} - Click to toggle`}
						>
							<item.icon className="w-5 h-5 text-current" />
							{item.label}
							{isActive && (
								<span className="absolute -bottom-1 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-primary"></span>
							)}
						</button>
					);
				})}
			</div>

			<div className="tooltip tooltip-bottom">
				<div className="tooltip-content">Settings</div>
				<button
					ref={settingsBtnRef}
					className="btn btn-sm btn-circle btn-ghost"
					onClick={() => setIsSettingsOpen(true)}
					aria-haspopup="dialog"
					aria-expanded={isSettingsOpen}
					aria-label="Open settings"
				>
					<Settings className="size-4 text-base-content/50" />
				</button>
			</div>

			<WidgetSettingsModal
				isOpen={isSettingsOpen}
				onClose={() => setIsSettingsOpen(false)}
				returnFocusRef={settingsBtnRef}
			/>
		</div>
	);
}

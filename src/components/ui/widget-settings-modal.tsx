"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { useWidgets, Widgets } from "@/src/contexts/WidgetContext";
import {
	StickyNote,
	CheckSquare,
	Kanban,
	Inbox,
	Timer,
	Lock,
} from "lucide-react";

interface WidgetSettingsModalProps {
	isOpen: boolean;
	onClose: () => void;
	returnFocusRef?:
		| React.RefObject<HTMLElement | null>
		| React.RefObject<HTMLButtonElement | null>;
}

type WidgetMeta = {
	type: Widgets;
	label: string;
	description: string;
	icon: React.ComponentType<{ className?: string }>;
};

const ALL_WIDGETS: WidgetMeta[] = [
	{
		type: "note",
		label: "Notes",
		description: "Capture quick ideas and keep rich text notes organized.",
		icon: StickyNote,
	},
	{
		type: "tasks",
		label: "Tasks",
		description: "Manage to‑dos with simple checklists and priorities.",
		icon: CheckSquare,
	},
	/* {
		type: "kanban",
		label: "Kanban",
		description: "Track work visually across columns for clear flow.",
		icon: Kanban,
	}, */
	{
		type: "journal",
		label: "Journal",
		description: "Log daily progress, thoughts, and learnings.",
		icon: Inbox,
	},
	{
		type: "timer",
		label: "Timer",
		description: "Focus sessions with Pomodoro and time‑boxed modes.",
		icon: Timer,
	},
];

const AVAILABLE: Widgets[] = ["note", "tasks", "timer"];
const COMING_SOON: Widgets[] = ["kanban", "journal"];

export default function WidgetSettingsModal({
	isOpen,
	onClose,
	returnFocusRef,
}: WidgetSettingsModalProps) {
	const { activeWidgets, toggleWidget, clearAllWidgets } = useWidgets();

	// Manage dialog element and focus return
	const dialogRef = useRef<HTMLDialogElement | null>(null);
	const wasOpenRef = useRef<boolean>(false);

	// Sync open state with <dialog>
	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;
		if (isOpen) {
			if (!dialog.open) dialog.showModal();
		} else {
			if (dialog.open) dialog.close();
		}
	}, [isOpen]);

	// Close handler (ESC, backdrop, header close)
	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;
		const handleClose = () => {
			onClose();
		};
		dialog.addEventListener("close", handleClose);
		return () => dialog.removeEventListener("close", handleClose);
	}, [onClose]);

	// Return focus to provided ref after close
	useEffect(() => {
		if (wasOpenRef.current && !isOpen) {
			returnFocusRef?.current?.focus?.();
		}
		wasOpenRef.current = isOpen;
	}, [isOpen, returnFocusRef]);

	const isChecked = useMemo(() => {
		const set = new Set(activeWidgets);
		return (w: Widgets) => set.has(w);
	}, [activeWidgets]);

	return (
		<dialog
			ref={dialogRef}
			className="modal"
			aria-labelledby="widget-settings-title"
		>
			<div className="modal-box bg-base-300 border border-border p-0 w-full max-w-4xl">
				<div className="flex">
					{/* Sidebar */}
					{/* <aside className="col-span-4 lg:col-span-3 border-r bg-sidebar border-border p-4">
						<nav className="menu text-sm w-full">
							<ul className="space-y-1">
								<li>
									<button className="btn btn-ghost btn-sm w-full justify-start text-left">
										General
									</button>
								</li>
								<li>
									<button className="btn btn-ghost btn-sm w-full justify-start text-left">
										Appearance
									</button>
								</li>
								<li>
									<button className="btn btn-ghost btn-sm w-full justify-start text-left btn-active">
										Widgets
									</button>
								</li>
								<li>
									<button className="btn btn-ghost btn-sm w-full justify-start text-left">
										Controls
									</button>
								</li>
								<li>
									<button className="btn btn-ghost btn-sm w-full justify-start text-left">
										About
									</button>
								</li>
							</ul>
						</nav>
					</aside> */}

					{/* Content */}
					<section className="w-full col-span-8 lg:col-span-9 p-5">
						<div className="flex items-start justify-between gap-3 pb-4 mb-4">
							<div>
								<h2 id="widget-settings-title" className="font-medium">
									Widgets
								</h2>
								<p className="text-sm text-base-content/70">
									Pick which widgets to show in your workspace.
								</p>
							</div>
							<form method="dialog">
								<button
									className="btn btn-ghost btn-sm btn-circle"
									aria-label="Close settings"
								>
									✕
								</button>
							</form>
						</div>

						<div className="flex gap-4" role="list">
							{ALL_WIDGETS.filter(({ type }) => type !== "timer").map(
								({ type, label, description, icon: Icon }) => {
									const isComingSoon = COMING_SOON.includes(type);
									const disabled =
										isComingSoon ||
										(isChecked(type) && activeWidgets.length === 1);
									const isActive = isChecked(type);
									return (
										<button
											key={type}
											type="button"
											className={`flex flex-col flex-1 min-h-48 justify-between gap-3 border rounded-box px-3 py-2 text-left transition-all duration-200 ${
												isActive
													? "border-primary bg-primary/10"
													: "border-border hover:border-base-content/20"
											} ${
												disabled
													? "opacity-60 cursor-not-allowed"
													: "cursor-pointer hover:bg-base-content/5"
											}`}
											onClick={() => !disabled && toggleWidget(type)}
											disabled={disabled}
											aria-pressed={isActive}
											aria-label={`Toggle ${label}`}
										>
											<div className="flex w-full items-center justify-between">
												<Icon
													className={`size-6 mt-0.5 ${
														isActive ? "text-primary" : "text-base-content/70"
													}`}
												/>
												{isComingSoon && (
													<span className="badge badge-ghost badge-sm rounded-sm flex items-center gap-1">
														<Lock className="size-3" /> Coming soon
													</span>
												)}
											</div>
											<div className="flex flex-col gap-0.5">
												<div className="flex flex-col gap-2">
													<span
														className={`text-base ${
															isActive ? "text-primary" : ""
														}`}
													>
														{label}
													</span>
												</div>
												<span className="text-sm text-base-content/60">
													{description}
												</span>
											</div>
										</button>
									);
								}
							)}
						</div>

						{/* <div className="mt-4 flex justify-between gap-2">
							<div className="flex gap-2">
								<button
									className="btn btn-ghost"
									onClick={() => {
										AVAILABLE.forEach((type) => {
											if (!activeWidgets.includes(type)) toggleWidget(type);
										});
									}}
								>
									Enable all
								</button>
								<button
									className="btn btn-ghost"
									onClick={() => clearAllWidgets()}
									disabled={activeWidgets.length <= 1}
								>
									Disable all
								</button>
							</div>
							<form method="dialog">
								<button className="btn btn-secondary">Done</button>
							</form>
						</div> */}
					</section>
				</div>
			</div>
			<form method="dialog" className="modal-backdrop">
				<button aria-label="Close modal">close</button>
			</form>
		</dialog>
	);
}

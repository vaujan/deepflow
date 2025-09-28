"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { useWidgets, Widgets } from "@/src/contexts/WidgetContext";
import { StickyNote, CheckSquare, Kanban, Inbox, Timer } from "lucide-react";
import { Dialog, VisuallyHidden } from "radix-ui";

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
	icon: React.ComponentType<{ className?: string }>;
};

const ALL_WIDGETS: WidgetMeta[] = [
	{ type: "note", label: "Notes", icon: StickyNote },
	{ type: "tasks", label: "Tasks", icon: CheckSquare },
	{ type: "kanban", label: "Kanban", icon: Kanban },
	{ type: "journal", label: "Journal", icon: Inbox },
	{ type: "timer", label: "Timer", icon: Timer },
];

export default function WidgetSettingsModal({
	isOpen,
	onClose,
	returnFocusRef,
}: WidgetSettingsModalProps) {
	const { activeWidgets, toggleWidget, clearAllWidgets } = useWidgets();

	// Return focus to provided ref after close (Radix returns to Trigger by default,
	// but we are controlling open state from parent)
	const wasOpenRef = useRef<boolean>(false);
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
		<Dialog.Root open={isOpen} onOpenChange={(v) => !v && onClose()}>
			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out" />
				<Dialog.Content
					className="fixed inset-0 z-[60] flex items-center justify-center p-4"
					aria-describedby={undefined}
				>
					<div className="card bg-base-100 w-full max-w-md rounded-box p-5 shadow-xl outline-none">
						<div className="flex items-center justify-between mb-2">
							<Dialog.Title
								id="widget-settings-title"
								className="font-semibold"
							>
								Widgets
							</Dialog.Title>

							<Dialog.Close asChild>
								<button
									className="btn btn-ghost btn-sm"
									aria-label="Close widgets settings"
								>
									✕
								</button>
							</Dialog.Close>
						</div>

						<div className="mb-3 text-sm text-base-content/70">
							Pick which widgets to show. You can toggle them on or off anytime.
						</div>

						<ul className="space-y-2">
							{ALL_WIDGETS.map(({ type, label, icon: Icon }) => (
								<li key={type} className="form-control">
									<label className="label cursor-pointer justify-between gap-3 px-0">
										<div className="flex items-center gap-3 min-h-10">
											<Icon className="size-4 text-base-content/70" />
											<span className="label-text select-none">{label}</span>
										</div>
										<input
											type="checkbox"
											className="toggle toggle-sm"
											checked={isChecked(type)}
											onChange={() => toggleWidget(type)}
											disabled={
												// prevent deactivating last widget
												isChecked(type) && activeWidgets.length === 1
											}
											aria-checked={isChecked(type)}
											aria-label={`Toggle ${label}`}
										/>
									</label>
								</li>
							))}
						</ul>

						<div className="mt-4 flex justify-between gap-2">
							<div className="flex gap-2">
								<button
									className="btn btn-ghost"
									onClick={() => {
										// Enable all widgets
										ALL_WIDGETS.forEach(({ type }) => {
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
							<Dialog.Close asChild>
								<button className="btn btn-secondary">Done</button>
							</Dialog.Close>
						</div>
					</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}

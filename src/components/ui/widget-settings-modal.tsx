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

const AVAILABLE: Widgets[] = ["note", "tasks", "timer"];
const COMING_SOON: Widgets[] = ["kanban", "journal"];

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
					<div className="card bg-base-100 w-full max-w-4xl rounded-box p-0 shadow-xl outline-none">
						<div className="flex items-center justify-between border-b border-border px-5 py-3">
							<Dialog.Close asChild>
								<button
									className="btn btn-ghost btn-sm btn-circle"
									aria-label="Close settings"
								>
									✕
								</button>
							</Dialog.Close>
						</div>

						<div className="grid grid-cols-12 gap-0">
							{/* Sidebar */}
							<aside className="col-span-4 lg:col-span-3 border-r bg-sidebar border-border p-4">
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
							</aside>

							{/* Content */}
							<section className="col-span-8 lg:col-span-9 p-5">
								<Dialog.Title asChild>
									<h2 className="font-medium mb-2">Widgets</h2>
								</Dialog.Title>
								<p className="text-sm text-base-content/70 mb-4">
									Pick which widgets to show in your workspace.
								</p>

								<div className="space-y-2">
									{ALL_WIDGETS.map(({ type, label, icon: Icon }) => {
										const isComingSoon = COMING_SOON.includes(type);
										const disabled =
											isComingSoon ||
											(isChecked(type) && activeWidgets.length === 1);
										return (
											<div
												key={type}
												className="flex items-center justify-between gap-3 border border-border rounded-box px-3 py-2"
											>
												<div className="flex items-center gap-3 min-h-10">
													<Icon className="size-4 text-base-content/70" />
													<div className="flex items-center gap-2">
														<span className="text-sm">{label}</span>
														{isComingSoon && (
															<span className="badge badge-ghost badge-sm rounded-sm flex items-center gap-1">
																<Lock className="size-3" /> Coming soon
															</span>
														)}
													</div>
												</div>
												<input
													type="checkbox"
													className="toggle toggle-sm"
													checked={isChecked(type)}
													onChange={() => toggleWidget(type)}
													disabled={disabled}
													aria-checked={isChecked(type)}
													aria-label={`Toggle ${label}`}
												/>
											</div>
										);
									})}
								</div>

								<div className="mt-4 flex justify-between gap-2">
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
									<Dialog.Close asChild>
										<button className="btn btn-secondary">Done</button>
									</Dialog.Close>
								</div>
							</section>
						</div>
					</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}

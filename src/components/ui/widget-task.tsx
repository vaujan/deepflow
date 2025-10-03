"use client";

import { Plus, Trash2, ListTodo, Calendar, Edit3 } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import type { Task } from "../../data/mockTasks";
import { toast } from "sonner";
import DatePicker from "./date-picker";

export default function WidgetTask() {
	const [tasks, setTasks] = useState<Task[] | null>(() => {
		if (typeof window !== "undefined") {
			try {
				const cached = localStorage.getItem("tasks-cache");
				if (cached) {
					const parsed = JSON.parse(cached);
					if (Array.isArray(parsed)) return parsed as Task[];
				}
			} catch {}
		}
		return null;
	});
	const [loading, setLoading] = useState(() => tasks === null);
	const [showNewDateMenu, setShowNewDateMenu] = useState(false);
	const [showEditDateMenu, setShowEditDateMenu] = useState(false);
	const [newMenuUp, setNewMenuUp] = useState(false);
	const [editMenuUp, setEditMenuUp] = useState(false);

	const [isAddingNew, setIsAddingNew] = useState(false);
	const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
	const [isSubmittingNew, setIsSubmittingNew] = useState(false);

	// Refs for click-outside detection
	const addTaskRef = useRef<HTMLDivElement>(null);
	const editTaskRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

	// Refs for Pikaday datepickers
	const newDatePickerRef = useRef<HTMLInputElement>(null);
	const editDatePickerRef = useRef<HTMLInputElement>(null);

	const [newTask, setNewTask] = useState({
		title: "",
		description: "",
		dueDate: "",
		project: "Inbox",
	});
	const [editTask, setEditTask] = useState({
		title: "",
		description: "",
		dueDate: "",
		project: "Inbox",
	});

	// Helpers for date formatting and quick selects
	const toYmd = (d: Date) => d.toISOString().split("T")[0];
	const todayStr = toYmd(new Date());
	const tomorrowStr = toYmd(new Date(Date.now() + 24 * 60 * 60 * 1000));
	const nextWeekStr = toYmd(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));

	const formatDateLabel = (yyyyMmDd?: string) => {
		if (!yyyyMmDd) return "Date";
		try {
			const d = new Date(yyyyMmDd);
			if (d.toDateString() === new Date().toDateString()) return "Today";
			if (yyyyMmDd === tomorrowStr) return "Tomorrow";
			return d.toLocaleDateString("en-US", { day: "numeric", month: "short" });
		} catch {
			return "Date";
		}
	};

	const addTask = async () => {
		if (!newTask.title.trim() || isSubmittingNew) return;

		const optimistic = {
			id: Date.now(),
			title: newTask.title,
			completed: false,
			description: newTask.description,
			dueDate: newTask.dueDate || undefined,
			project: newTask.project,
		} as Task;

		// Optimistically add to list using functional update to avoid stale state
		setTasks((prev) => [optimistic, ...(prev ?? [])]);

		// Clear inputs immediately for snappy UX and mark as submitting
		setIsSubmittingNew(true);
		setNewTask({ title: "", description: "", dueDate: "", project: "Inbox" });

		setTimeout(() => {
			const titleInput = document.querySelector(
				'input[placeholder="Task name"]'
			) as HTMLInputElement;
			if (titleInput) titleInput.focus();
		}, 0);

		try {
			const res = await fetch("/api/tasks", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					title: optimistic.title,
					description: optimistic.description || null,
					dueDate: optimistic.dueDate || null,
					project: optimistic.project || null,
				}),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Failed to add task");
			// Replace optimistic with server row
			setTasks((prev) => [
				{ ...data, id: data.id } as Task,
				...(prev ?? []).filter((t) => t.id !== optimistic.id),
			]);
		} catch (e: any) {
			toast.error(e.message || "Failed to add task");
			setTasks((prev) => (prev ?? []).filter((t) => t.id !== optimistic.id));
		} finally {
			setLoading(false);
			setIsSubmittingNew(false);
		}
	};

	const toggleTask = async (id: number) => {
		if (!tasks) return;
		const target = tasks.find((t) => t.id === id);
		if (!target) return;
		const nextCompleted = !target.completed;
		setTasks((prev) =>
			(prev ?? []).map((t) =>
				t.id === id ? { ...t, completed: nextCompleted } : t
			)
		);
		try {
			const res = await fetch(`/api/tasks/${id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ completed: nextCompleted }),
			});
			if (!res.ok) {
				throw new Error((await res.json()).error || "Failed to update task");
			}
		} catch (e: any) {
			toast.error(e.message || "Failed to update task");
			setTasks((prev) =>
				(prev ?? []).map((t) =>
					t.id === id ? { ...t, completed: !nextCompleted } : t
				)
			);
		}
	};

	const deleteTask = async (id: number) => {
		if (!tasks) return;
		const previous = tasks;
		setTasks((prev) => (prev ?? []).filter((task) => task.id !== id));
		try {
			const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
			if (!res.ok)
				throw new Error((await res.json()).error || "Failed to delete task");
		} catch (e: any) {
			toast.error(e.message || "Failed to delete task");
			setTasks(previous);
		}
	};

	const startAddingNew = () => {
		setIsAddingNew(true);
		setNewTask({
			title: "",
			description: "",
			dueDate: "",
			project: "Inbox",
		});
	};

	const cancelAddingNew = () => {
		setIsAddingNew(false);
		setNewTask({
			title: "",
			description: "",
			dueDate: "",
			project: "Inbox",
		});
	};

	const startEditTask = (task: Task) => {
		setEditingTaskId(task.id);
		setEditTask({
			title: task.title,
			description: task.description,
			dueDate: task.dueDate || "",
			project: task.project,
		});
	};

	const saveEditTask = async () => {
		if (!editTask.title.trim() || !editingTaskId || !tasks) return;
		const id = editingTaskId;
		const prev = tasks;
		setTasks((current) =>
			(current ?? []).map((task) =>
				task.id === id
					? {
							...task,
							title: editTask.title,
							description: editTask.description,
							dueDate: editTask.dueDate || undefined,
							project: editTask.project,
					  }
					: task
			)
		);
		setEditingTaskId(null);
		setEditTask({ title: "", description: "", dueDate: "", project: "Inbox" });
		try {
			const res = await fetch(`/api/tasks/${id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					title: editTask.title,
					description: editTask.description || null,
					dueDate: editTask.dueDate || null,
					project: editTask.project || null,
				}),
			});
			if (!res.ok)
				throw new Error((await res.json()).error || "Failed to save");
		} catch (e: any) {
			toast.error(e.message || "Failed to save changes");
			setTasks(prev);
		}
	};

	const cancelEditTask = () => {
		setEditingTaskId(null);
		setEditTask({
			title: "",
			description: "",
			dueDate: "",
			project: "Inbox",
		});
	};

	// Click outside handler
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as Node;

			// Check if clicking outside add task form
			if (
				isAddingNew &&
				addTaskRef.current &&
				!addTaskRef.current.contains(target)
			) {
				cancelAddingNew();
			}

			// Check if clicking outside edit task form
			if (
				editingTaskId !== null &&
				editTaskRefs.current[editingTaskId] &&
				!editTaskRefs.current[editingTaskId]?.contains(target)
			) {
				cancelEditTask();
			}
		};

		// Only add listener when we're in adding or editing mode
		if (isAddingNew || editingTaskId !== null) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isAddingNew, editingTaskId]);

	// (Removed) Separate hydration effect; tasks are initialized from cache in state initializer

	// Persist tasks to cache whenever they change (only when non-null)
	useEffect(() => {
		try {
			if (tasks !== null) {
				localStorage.setItem("tasks-cache", JSON.stringify(tasks));
			}
		} catch {}
	}, [tasks]);

	// Initial fetch
	useEffect(() => {
		(async () => {
			try {
				const res = await fetch("/api/tasks");
				if (!res.ok)
					throw new Error((await res.json()).error || "Failed to load tasks");
				const data = await res.json();
				setTasks(data);
			} catch (e: any) {
				toast.error(e.message || "Failed to load tasks");
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	return (
		<div className="w-full h-full flex flex-col">
			<div className="flex justify-between items-center text-base-content/80 mb-6">
				<span className="font-medium">
					Tasks{" "}
					<span className="badge rounded-box badge-neutral badge-sm">
						{tasks?.length ?? 0}
					</span>
				</span>
				<button
					className="btn btn-circle btn-sm btn-ghost"
					onClick={startAddingNew}
				>
					<Plus className="size-4" />
				</button>
			</div>

			{/* New task form - Todoist style */}
			{isAddingNew && (
				<div
					ref={addTaskRef}
					className="w-full bg-card rounded-lg shadow-sm border border-border mb-4"
				>
					{/* Top section - Task inputs */}
					<div className="p-4">
						<div className="flex flex-col gap-3">
							<input
								type="text"
								placeholder="Task name"
								className="text-base-content placeholder-base-content/50 bg-transparent border-none outline-none text-lg font-medium w-full"
								value={newTask.title}
								onChange={(e) =>
									setNewTask({ ...newTask, title: e.target.value })
								}
								onKeyDown={(e) => {
									if (e.key === "Enter" && e.shiftKey) {
										e.preventDefault();
										addTask();
									} else if (e.key === "Escape") {
										e.preventDefault();
										cancelAddingNew();
									}
								}}
								autoFocus
							/>
							<input
								type="text"
								placeholder="Description"
								className="text-base-content/70 placeholder-base-content/40 bg-transparent border-none outline-none w-full"
								value={newTask.description}
								onChange={(e) =>
									setNewTask({ ...newTask, description: e.target.value })
								}
								onKeyDown={(e) => {
									if (e.key === "Enter" && e.shiftKey) {
										e.preventDefault();
										addTask();
									} else if (e.key === "Escape") {
										e.preventDefault();
										cancelAddingNew();
									}
								}}
							/>
						</div>
					</div>

					{/* Bottom section - Project and actions */}
					<div className="px-4 py-4 flex justify-between items-center">
						<div
							className={`dropdown ${
								newMenuUp ? "dropdown-top" : "dropdown-bottom"
							}`}
						>
							<button
								className="btn btn-sm"
								onClick={(e) => {
									try {
										const rect = (
											e.currentTarget as HTMLButtonElement
										).getBoundingClientRect();
										const spaceBelow = window.innerHeight - rect.bottom;
										const estimated = 360;
										setNewMenuUp(spaceBelow < estimated);
									} catch {}
									setShowNewDateMenu((s) => !s);
								}}
								aria-haspopup="menu"
								aria-expanded={showNewDateMenu}
							>
								<Calendar className="size-4" />
								{formatDateLabel(newTask.dueDate)}
							</button>
							{showNewDateMenu && (
								<div
									className="dropdown-content z-10 mt-2 rounded-lg border border-border bg-base-100 shadow-xl p-2"
									role="menu"
								>
									<DatePicker
										value={newTask.dueDate}
										onChange={(value) => {
											setNewTask({ ...newTask, dueDate: value });
											setShowNewDateMenu(false);
										}}
										className="cally block"
									/>
									<div className="flex gap-2 p-1">
										<button
											className="btn btn-ghost btn-xs"
											onClick={() => {
												setNewTask({ ...newTask, dueDate: todayStr });
												setShowNewDateMenu(false);
											}}
										>
											Today
										</button>
										<button
											className="btn btn-ghost btn-xs"
											onClick={() => {
												setNewTask({ ...newTask, dueDate: tomorrowStr });
												setShowNewDateMenu(false);
											}}
										>
											Tomorrow
										</button>
										<button
											className="btn btn-ghost btn-xs"
											onClick={() => {
												setNewTask({ ...newTask, dueDate: nextWeekStr });
												setShowNewDateMenu(false);
											}}
										>
											Next week
										</button>
										<button
											className="btn btn-ghost btn-xs text-error ml-auto"
											onClick={() => {
												setNewTask({ ...newTask, dueDate: "" });
												setShowNewDateMenu(false);
											}}
										>
											Clear
										</button>
									</div>
								</div>
							)}
						</div>

						{/* Action buttons */}
						<div className="flex gap-2">
							<button
								className="btn-sm btn btn-ghost"
								onClick={cancelAddingNew}
							>
								Cancel
							</button>
							<button
								className="btn-sm btn btn-primary"
								onClick={addTask}
								disabled={!newTask.title.trim()}
							>
								Add task
								<kbd className="kbd kbd-xs text-base-content">shift</kbd>+
								<kbd className="kbd kbd-xs text-base-content">enter</kbd>
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Task list */}
			<div>
				<div className="flex flex-col pr-2">
					{loading && tasks === null ? (
						<div className="flex flex-col gap-3 py-4 ">
							{Array.from({ length: 6 }).map((_, i) => (
								<div key={i} className="flex items-start gap-3 py-3 px-0">
									<div className="skeleton w-5 h-5 rounded-md" />
									<div className="flex-1 min-w-0">
										<div className="skeleton h-4 w-3/5 mb-2" />
										<div className="skeleton h-3 w-2/5" />
									</div>
									<div className="skeleton w-16 h-6 rounded" />
								</div>
							))}
						</div>
					) : (tasks?.length ?? 0) === 0 && !isAddingNew ? (
						// Empty state
						<div className="flex flex-col items-center justify-center py-12 px-6 text-center">
							<div className="size-16 mb-6 rounded-full bg-base-200 flex items-center justify-center">
								<ListTodo className="size-6 text-base-content/35" />
							</div>
							<h3 className="text-lg font-semibold text-base-content/80 mb-2">
								No tasks yet
							</h3>
							<p className="text-base-content/60 mb-6 max-w-sm">
								Start organizing your work and personal life. Create your first
								task to get started.
							</p>
							<button onClick={startAddingNew} className="btn btn-sm gap-2">
								<Plus className="size-4" />
								Create your first task
							</button>
						</div>
					) : (
						(tasks ?? []).map((task, index) => (
							<div key={task.id} className="h-full overflow-visible min-h-0">
								{editingTaskId === task.id ? (
									// Edit task form
									<div
										ref={(el) => {
											if (editingTaskId === task.id) {
												editTaskRefs.current[task.id] = el;
											}
										}}
										className="w-full overflow-visible mt-2 bg-card border-border rounded-lg shadow-sm border mb-4"
									>
										{/* Top section - Task inputs */}
										<div className="p-4">
											<div className="flex flex-col gap-3">
												<input
													type="text"
													placeholder="Task name"
													className="text-base-content placeholder-base-content/50 bg-transparent border-none outline-none text-lg font-medium w-full"
													value={editTask.title}
													onChange={(e) =>
														setEditTask({ ...editTask, title: e.target.value })
													}
													onKeyDown={(e) => {
														if (e.key === "Enter" && e.shiftKey) {
															e.preventDefault();
															saveEditTask();
														} else if (e.key === "Escape") {
															e.preventDefault();
															cancelEditTask();
														}
													}}
													autoFocus
												/>
												<input
													type="text"
													placeholder="Description"
													className="text-base-content/70 placeholder-base-content/40 bg-transparent border-none outline-none w-full"
													value={editTask.description}
													onChange={(e) =>
														setEditTask({
															...editTask,
															description: e.target.value,
														})
													}
													onKeyDown={(e) => {
														if (e.key === "Enter" && e.shiftKey) {
															e.preventDefault();
															saveEditTask();
														} else if (e.key === "Escape") {
															e.preventDefault();
															cancelEditTask();
														}
													}}
												/>
											</div>
										</div>

										{/* Bottom section - Project and actions */}
										<div className="px-4 py-4 flex justify-between items-center">
											<div
												className={`dropdown ${
													editMenuUp ? "dropdown-top" : "dropdown-bottom"
												}`}
											>
												<button
													className="btn btn-sm"
													onClick={(e) => {
														try {
															const rect = (
																e.currentTarget as HTMLButtonElement
															).getBoundingClientRect();
															const spaceBelow =
																window.innerHeight - rect.bottom;
															const estimated = 360;
															setEditMenuUp(spaceBelow < estimated);
														} catch {}
														setShowEditDateMenu((s) => !s);
													}}
													aria-haspopup="menu"
													aria-expanded={showEditDateMenu}
												>
													<Calendar className="size-4" />
													{formatDateLabel(editTask.dueDate)}
												</button>
												{showEditDateMenu && (
													<div
														className="dropdown-content z-10 mt-2 rounded-lg border border-border bg-base-200 shadow-xl p-2"
														role="menu"
													>
														<DatePicker
															value={editTask.dueDate}
															onChange={(value) => {
																setEditTask({
																	...editTask,
																	dueDate: value,
																});
																setShowEditDateMenu(false);
															}}
															className="cally block"
														/>
														<div className="flex gap-2 p-1">
															<button
																className="btn btn-ghost btn-xs"
																onClick={() => {
																	setEditTask({
																		...editTask,
																		dueDate: todayStr,
																	});
																	setShowEditDateMenu(false);
																}}
															>
																Today
															</button>
															<button
																className="btn btn-ghost btn-xs"
																onClick={() => {
																	setEditTask({
																		...editTask,
																		dueDate: tomorrowStr,
																	});
																	setShowEditDateMenu(false);
																}}
															>
																Tomorrow
															</button>
															<button
																className="btn btn-ghost btn-xs"
																onClick={() => {
																	setEditTask({
																		...editTask,
																		dueDate: nextWeekStr,
																	});
																	setShowEditDateMenu(false);
																}}
															>
																Next week
															</button>
															<button
																className="btn btn-ghost btn-xs text-error ml-auto"
																onClick={() => {
																	setEditTask({ ...editTask, dueDate: "" });
																	setShowEditDateMenu(false);
																}}
															>
																Clear
															</button>
														</div>
													</div>
												)}
											</div>

											{/* Action buttons */}
											<div className="flex gap-2">
												<button
													className="btn-sm btn btn-ghost"
													onClick={cancelEditTask}
												>
													Cancel
												</button>
												<button
													className="btn-sm btn btn-primary"
													onClick={saveEditTask}
													disabled={!editTask.title.trim()}
												>
													Save changes
													<kbd className="kbd kbd-xs text-base-content">
														shift
													</kbd>
													+
													<kbd className="kbd kbd-xs text-base-content">
														enter
													</kbd>
												</button>
											</div>
										</div>
									</div>
								) : (
									// Regular task display
									<div
										className={`group w-full py-4 px-0 border-b border-border transition-all ease-out cursor-pointer hover:bg-base-50 ${
											task.completed ? "opacity-75" : ""
										} ${index === 0 ? "border-t border-base-300" : ""}`}
										onClick={() => toggleTask(task.id)}
									>
										<div className="flex items-start gap-3">
											<label className="mt-0.5 flex-shrink-0 cursor-pointer">
												<input
													type="checkbox"
													className="checkbox checkbox-sm"
													checked={task.completed}
													onChange={(e) => {
														e.stopPropagation();
														toggleTask(task.id);
													}}
												/>
											</label>

											<div className="flex-1 min-w-0 overflow-hidden">
												<div className="flex flex-col gap-1">
													<span
														className={`font-medium text-base-content break-words ${
															task.completed
																? "line-through text-base-content/50"
																: ""
														}`}
													>
														{task.title}
													</span>

													{task.description && (
														<span className="text-sm text-base-content/60 break-words">
															{task.description}
														</span>
													)}

													{task.dueDate && (
														<div className="flex items-center gap-1 mt-1">
															<Calendar
																className={`size-3 ${
																	new Date(task.dueDate).toDateString() ===
																	new Date().toDateString()
																		? "text-success"
																		: "text-base-content/50"
																}`}
															/>
															<span
																className={`text-xs ${
																	new Date(task.dueDate).toDateString() ===
																	new Date().toDateString()
																		? "text-success"
																		: "text-base-content/50"
																}`}
															>
																{new Date(task.dueDate).toDateString() ===
																new Date().toDateString()
																	? "Today"
																	: new Date(task.dueDate).toLocaleDateString(
																			"en-US",
																			{ day: "numeric", month: "short" }
																	  )}
															</span>
														</div>
													)}
												</div>
											</div>

											{/* Actions buttons */}
											<div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
												<button
													className="btn btn-sm btn-square btn-ghost"
													onClick={(e) => {
														e.stopPropagation();
														startEditTask(task);
													}}
													title="Edit task"
												>
													<Edit3 className="size-3" />
												</button>
												<button
													className="btn btn-sm btn-square btn-ghost text-error hover:bg-error/20"
													onClick={(e) => {
														e.stopPropagation();
														deleteTask(task.id);
													}}
													title="Delete task"
												>
													<Trash2 className="size-3" />
												</button>
											</div>
										</div>
									</div>
								)}
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
}

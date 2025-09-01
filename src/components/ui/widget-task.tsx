"use client";

import {
	Plus,
	CheckCircle,
	Circle,
	Trash2,
	Edit3,
	Save,
	X,
	Calendar,
	Tag,
	ListTodo,
} from "lucide-react";
import React, { useState, useCallback } from "react";

interface Task {
	id: number;
	title: string;
	description: string;
	completed: boolean;
	category: string;
	dueDate: string | null;
	priority: "low" | "medium" | "high";
	timestamp: string;
}

const PRIORITY_COLORS = {
	low: "badge-success",
	medium: "badge-warning",
	high: "badge-error",
};

const PRIORITY_LABELS = {
	low: "Low",
	medium: "Medium",
	high: "High",
};

export default function WidgetTask() {
	const [tasks, setTasks] = useState<Task[]>([
		{
			id: 1,
			title: "Complete project documentation",
			description: "Write comprehensive documentation for the new feature",
			completed: false,
			category: "Work",
			dueDate: "2024-01-15",
			priority: "high",
			timestamp: "2 hours ago",
		},
		{
			id: 2,
			title: "Review code changes",
			description: "Review pull request #123 for the authentication module",
			completed: true,
			category: "Development",
			dueDate: null,
			priority: "medium",
			timestamp: "1 day ago",
		},
		{
			id: 3,
			title: "Setup development environment",
			description: "Install and configure all required tools and dependencies",
			completed: false,
			category: "Setup",
			dueDate: "2024-01-10",
			priority: "low",
			timestamp: "3 days ago",
		},
	]);
	const [editingTask, setEditingTask] = useState<number | null>(null);
	const [isAddingNew, setIsAddingNew] = useState(false);
	const [newTask, setNewTask] = useState({
		title: "",
		description: "",
		category: "",
		dueDate: "",
		priority: "medium" as const,
	});

	// Debounced update for smoother experience
	const debouncedUpdate = useCallback(
		(() => {
			let timeoutId: NodeJS.Timeout;
			return (id: number, updates: Partial<Task>) => {
				clearTimeout(timeoutId);
				timeoutId = setTimeout(() => {
					setTasks(
						tasks.map((task) =>
							task.id === id
								? { ...task, ...updates, timestamp: "Just now" }
								: task
						)
					);
				}, 150);
			};
		})(),
		[tasks]
	);

	const addTask = () => {
		if (newTask.title.trim()) {
			const task: Task = {
				id: Date.now(),
				title: newTask.title,
				description: newTask.description,
				completed: false,
				category: newTask.category,
				dueDate: newTask.dueDate || null,
				priority: newTask.priority,
				timestamp: "Just now",
			};
			setTasks([task, ...tasks]);
			setNewTask({
				title: "",
				description: "",
				category: "",
				dueDate: "",
				priority: "medium",
			});
			setIsAddingNew(false);
		}
	};

	const toggleTask = (id: number) => {
		setTasks(
			tasks.map((task) =>
				task.id === id ? { ...task, completed: !task.completed } : task
			)
		);
	};

	const deleteTask = (id: number) => {
		setTasks(tasks.filter((task) => task.id !== id));
		if (editingTask === id) {
			setEditingTask(null);
		}
	};

	const updateTask = (id: number, updates: Partial<Task>) => {
		// Immediate update for UI responsiveness
		setTasks(
			tasks.map((task) =>
				task.id === id ? { ...task, ...updates, timestamp: "Just now" } : task
			)
		);
		// Debounced update for smoother experience
		debouncedUpdate(id, updates);
	};

	const startEditing = (id: number) => {
		setEditingTask(id);
	};

	const stopEditing = () => {
		if (editingTask) {
			setEditingTask(null);
		}
	};

	const startAddingNew = () => {
		setIsAddingNew(true);
		setEditingTask(null);
		setNewTask({
			title: "New Task",
			description: "",
			category: "",
			dueDate: "",
			priority: "medium",
		});
	};

	const cancelAddingNew = () => {
		setIsAddingNew(false);
		setNewTask({
			title: "",
			description: "",
			category: "",
			dueDate: "",
			priority: "medium",
		});
	};

	const formatDueDate = (dateString: string | null) => {
		if (!dateString) return null;
		const date = new Date(dateString);
		const today = new Date();
		const tomorrow = new Date(today);
		tomorrow.setDate(tomorrow.getDate() + 1);

		if (date.toDateString() === today.toDateString()) return "Today";
		if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
		return date.toLocaleDateString();
	};

	const isOverdue = (dateString: string | null) => {
		if (!dateString) return false;
		const date = new Date(dateString);
		const today = new Date();
		return date < today && date.toDateString() !== today.toDateString();
	};

	return (
		<div className="w-full max-w-xl group flex flex-col gap-2 min-w-[550px]">
			<div className="flex justify-between items-center text-base-content/80">
				<span className="font-medium text-lg">Tasks</span>
				<button
					className="btn btn-circle btn-sm btn-ghost"
					onClick={startAddingNew}
				>
					<Plus className="size-4" />
				</button>
			</div>

			{/* New task form */}
			{isAddingNew && (
				<div className="w-full card text-base-content/90 overflow-hidden bg-base-100 shadow-xl transition-all ease-out mb-4">
					<div className="flex justify-between p-4">
						<div className="flex items-center gap-2">
							<input
								type="text"
								placeholder="Task title..."
								className="border-b-1 border-base-content/50 outline-base-content/10 focus:outline-0 w-32"
								value={newTask.title}
								onChange={(e) =>
									setNewTask({ ...newTask, title: e.target.value })
								}
								onKeyDown={(e) => {
									if (e.key === "Enter" && e.shiftKey) {
										e.preventDefault();
										addTask();
									}
								}}
							/>
						</div>
						<div className="flex gap-2">
							<button
								className="btn btn-sm btn-ghost"
								onClick={addTask}
								disabled={!newTask.title.trim()}
							>
								Add
								<kbd className="ml-2 kbd kbd-xs">shift</kbd>+
								<kbd className="kbd kbd-xs">enter</kbd>
							</button>
							<button
								className="btn btn-ghost btn-sm btn-circle"
								onClick={cancelAddingNew}
							>
								<X className="size-3" />
							</button>
						</div>
					</div>

					<div className="p-4 pt-0 space-y-3">
						{/* Description */}
						<input
							type="text"
							placeholder="Description (optional)"
							className="input input-sm input-bordered w-full"
							value={newTask.description}
							onChange={(e) =>
								setNewTask({ ...newTask, description: e.target.value })
							}
						/>

						{/* Category and Priority */}
						<div className="flex gap-2">
							<input
								type="text"
								placeholder="Category"
								className="input input-sm input-bordered flex-1"
								value={newTask.category}
								onChange={(e) =>
									setNewTask({ ...newTask, category: e.target.value })
								}
							/>
							<select
								className="select select-sm select-bordered"
								value={newTask.priority}
								onChange={(e) =>
									setNewTask({ ...newTask, priority: e.target.value as any })
								}
							>
								<option value="low">Low</option>
								<option value="medium">Medium</option>
								<option value="high">High</option>
							</select>
						</div>

						{/* Due Date */}
						<input
							type="date"
							className="input input-sm input-bordered w-full"
							value={newTask.dueDate}
							onChange={(e) =>
								setNewTask({ ...newTask, dueDate: e.target.value })
							}
						/>
					</div>
				</div>
			)}

			{/* Task list */}
			<div className="flex flex-col gap-4 rounded-box max-h-[900px] overflow-y-auto">
				{tasks.length === 0 && !isAddingNew ? (
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
					tasks.map((task) => (
						<div
							key={task.id}
							className={`w-full card text-base-content/90 bg-base-100 p-4 transition-all ease-out group ${
								editingTask === task.id ? "shadow-xs" : "cursor-pointer"
							} ${task.completed ? "opacity-75" : ""}`}
						>
							{editingTask === task.id ? (
								// Editing mode
								<>
									<div className="flex justify-between p-4 -m-4 mb-4">
										<div className="flex items-center gap-2">
											<input
												type="text"
												placeholder="Task title..."
												className="border-b-1 border-base-content/50 outline-base-content/10 focus:outline-0 w-32"
												value={task.title}
												onChange={(e) =>
													updateTask(task.id, { title: e.target.value })
												}
												onKeyDown={(e) => {
													if (e.key === "Enter" && e.shiftKey) {
														e.preventDefault();
														stopEditing();
													}
												}}
											/>
										</div>
										<div className="flex gap-2">
											<button
												className="btn btn-sm btn-ghost"
												onClick={stopEditing}
												disabled={!task.title.trim()}
											>
												Save
												<kbd className="ml-2 kbd kbd-xs">shift</kbd>+
												<kbd className="kbd kbd-xs">enter</kbd>
											</button>
											<button
												className="btn btn-ghost btn-sm btn-circle"
												onClick={() => setEditingTask(null)}
											>
												<X className="size-3" />
											</button>
										</div>
									</div>

									<div className="p-4 -m-4 space-y-3">
										<input
											type="text"
											placeholder="Description (optional)"
											className="input input-sm input-bordered w-full"
											value={task.description}
											onChange={(e) =>
												updateTask(task.id, { description: e.target.value })
											}
										/>

										<div className="flex gap-2">
											<input
												type="text"
												placeholder="Category"
												className="input input-sm input-bordered flex-1"
												value={task.category}
												onChange={(e) =>
													updateTask(task.id, { category: e.target.value })
												}
											/>
											<select
												className="select select-sm select-bordered"
												value={task.priority}
												onChange={(e) =>
													updateTask(task.id, {
														priority: e.target.value as any,
													})
												}
											>
												<option value="low">Low</option>
												<option value="medium">Medium</option>
												<option value="high">High</option>
											</select>
										</div>

										<input
											type="date"
											className="input input-sm input-bordered w-full"
											value={task.dueDate || ""}
											onChange={(e) =>
												updateTask(task.id, { dueDate: e.target.value || null })
											}
										/>
									</div>
								</>
							) : (
								// Read mode
								<>
									{/* Task header with title, priority, and actions */}
									<div className="flex justify-between items-center mb-3">
										<div className="flex items-center gap-2">
											<button
												onClick={() => toggleTask(task.id)}
												className="btn btn-ghost btn-sm p-0"
											>
												{task.completed ? (
													<CheckCircle className="size-4 text-success" />
												) : (
													<Circle className="size-4 text-base-content/50" />
												)}
											</button>
											<span
												className={`font-medium ${
													task.completed
														? "line-through text-base-content/50"
														: ""
												}`}
											>
												{task.title}
											</span>
											<span
												className={`badge badge-sm ${
													PRIORITY_COLORS[task.priority]
												}`}
											>
												{PRIORITY_LABELS[task.priority]}
											</span>
										</div>
										<div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
											<p className="text-xs text-base-content/50">
												{task.timestamp}
											</p>
											<button
												className="btn btn-sm btn-ghost btn-circle"
												onClick={(e) => {
													e.stopPropagation();
													startEditing(task.id);
												}}
												title="Edit task"
											>
												<Edit3 className="size-3" />
											</button>
											<button
												className="btn btn-sm btn-ghost btn-circle text-error hover:bg-error/20"
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

									{/* Task details */}
									{task.description && (
										<p className="text-sm text-base-content/70 mb-3">
											{task.description}
										</p>
									)}

									{/* Task metadata */}
									<div className="flex items-center gap-3 text-xs text-base-content/50">
										{task.category && (
											<div className="flex items-center gap-1">
												<Tag className="size-3" />
												<span>{task.category}</span>
											</div>
										)}
										{task.dueDate && (
											<div
												className={`flex items-center gap-1 ${
													isOverdue(task.dueDate) ? "text-error" : ""
												}`}
											>
												<Calendar className="size-3" />
												<span>
													{formatDueDate(task.dueDate)}
													{isOverdue(task.dueDate) && " (Overdue)"}
												</span>
											</div>
										)}
									</div>
								</>
							)}
						</div>
					))
				)}
			</div>
		</div>
	);
}

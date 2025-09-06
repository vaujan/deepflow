"use client";

import {
	Plus,
	CheckCircle,
	Circle,
	Trash2,
	ListTodo,
	Calendar,
	Edit3,
} from "lucide-react";
import React, { useState } from "react";
import { mockTasks, type Task } from "../../data/mockTasks";

export default function WidgetTask() {
	const [tasks, setTasks] = useState<Task[]>(mockTasks);

	const [isAddingNew, setIsAddingNew] = useState(false);
	const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
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

	const addTask = () => {
		if (newTask.title.trim()) {
			const task: Task = {
				id: Date.now(),
				title: newTask.title,
				completed: false,
				description: newTask.description,
				dueDate: newTask.dueDate || undefined,
				project: newTask.project,
			};
			setTasks([task, ...tasks]);
			setNewTask({
				title: "",
				description: "",
				dueDate: "",
				project: "Inbox",
			});
			// Keep the form open and refocus on the title input
			setTimeout(() => {
				const titleInput = document.querySelector(
					'input[placeholder="Task name"]'
				) as HTMLInputElement;
				if (titleInput) {
					titleInput.focus();
				}
			}, 0);
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

	const saveEditTask = () => {
		if (editTask.title.trim() && editingTaskId) {
			setTasks(
				tasks.map((task) =>
					task.id === editingTaskId
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
			setEditTask({
				title: "",
				description: "",
				dueDate: "",
				project: "Inbox",
			});
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

	return (
		<div className="w-full h-full min-w-lg max-w-xl  group flex flex-col overflow-hidden">
			<div className="flex justify-between items-center text-base-content/80 mb-6">
				<span className="font-medium text-lg">
					Tasks{" "}
					<span className="badge rounded-box badge-neutral badge-sm">
						{tasks.length}
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
				<div className="w-full bg-card rounded-lg shadow-sm border border-border mb-4">
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
						<button
							className="btn btn-sm"
							onClick={() => {
								const today = new Date().toISOString().split("T")[0];
								setNewTask({ ...newTask, dueDate: today });
							}}
						>
							<Calendar className="size-4" />
							Date
						</button>

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
			<div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
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
					tasks.map((task, index) => (
						<div key={task.id}>
							{editingTaskId === task.id ? (
								// Edit task form
								<div className="w-full mt-2 bg-card border-border rounded-lg shadow-sm border mb-4">
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
										<button
											className="btn btn-sm"
											onClick={() => {
												const today = new Date().toISOString().split("T")[0];
												setEditTask({ ...editTask, dueDate: today });
											}}
										>
											<Calendar className="size-4" />
											Date
										</button>

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
									className={`w-full py-4 px-0 border-b border-base-content/10 transition-all ease-out cursor-pointer hover:bg-base-50 ${
										task.completed ? "opacity-75" : ""
									} ${index === 0 ? "border-t border-base-300" : ""}`}
								>
									<div className="flex items-start gap-3">
										<button
											onClick={() => toggleTask(task.id)}
											className="mt-0.5 flex-shrink-0"
										>
											{task.completed ? (
												<CheckCircle className="size-5 text-success" />
											) : (
												<Circle className="size-5 text-base-content/40" />
											)}
										</button>

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
	);
}

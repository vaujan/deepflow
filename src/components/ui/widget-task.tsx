"use client";

import {
	Plus,
	CheckCircle,
	Circle,
	Trash2,
	X,
	ListTodo,
	Calendar,
	ChevronDown,
	Inbox,
	Flag,
	Bell,
	MoreHorizontal,
} from "lucide-react";
import React, { useState } from "react";

interface Task {
	id: number;
	title: string;
	description: string;
	completed: boolean;
	dueDate?: string;
	project: string;
}

export default function WidgetTask() {
	const [tasks, setTasks] = useState<Task[]>(() => [
		{
			id: 1,
			title: "Complete project documentation",
			description: "Complete the current project this noon",
			completed: false,
			project: "Inbox",
		},
		{
			id: 2,
			title: "Review pull requests",
			description: "Check and review all open PRs before EOD",
			completed: false,
			project: "Inbox",
		},
		{
			id: 3,
			title: "Setup development environment",
			description: "Install dependencies and configure environment variables",
			completed: false,
			project: "Inbox",
		},
		{
			id: 4,
			title: "Team standup meeting",
			description: "Daily sync with the team at 10:00 AM",
			completed: false,
			project: "Inbox",
		},
	]);

	const [isAddingNew, setIsAddingNew] = useState(false);
	const [newTask, setNewTask] = useState({
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

	return (
		<div className="w-full max-w-xl group flex flex-col min-w-[550px]">
			<div className="flex justify-between items-center text-base-content/80 mb-6">
				<span className="font-medium text-lg">Tasks</span>
				<button
					className="btn btn-circle btn-sm btn-ghost"
					onClick={startAddingNew}
				>
					<Plus className="size-4" />
				</button>
			</div>

			{/* New task form - Todoist style */}
			{isAddingNew && (
				<div className="w-full bg-base-200 rounded-lg shadow-sm border border-base-300 mb-4">
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
							/>
						</div>
					</div>

					{/* Bottom section - Project and actions */}
					<div className="px-4 py-4 flex justify-between items-center">
						<div className="flex gap-2 mt-3">
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
								<kbd className="kbd kbd-xs">ctrl</kbd>+
								<kbd className="kbd kbd-xs">enter</kbd>
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Task list */}
			<div className="flex flex-col max-h-[900px] overflow-y-auto">
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
						<div
							key={task.id}
							className={`w-full py-4 px-0 border-b border-base-content/10/ transition-all ease-out cursor-pointer hover:bg-base-50 ${
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

								<div className="flex-1 min-w-0">
									<div className="flex flex-col gap-1">
										<span
											className={`font-medium text-base-content ${
												task.completed
													? "line-through text-base-content/50"
													: ""
											}`}
										>
											{task.title}
										</span>

										{task.description && (
											<span className="text-sm text-base-content/60">
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
										className="p-1 text-base-content/60 hover:text-base-content hover:bg-base-200 rounded transition-colors"
										onClick={(e) => {
											e.stopPropagation();
											// TODO: Add edit functionality
										}}
										title="Edit task"
									>
										<svg
											className="size-4"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
											/>
										</svg>
									</button>
									<button
										className="p-1 text-error  hover:bg-error/10 rounded transition-colors"
										onClick={(e) => {
											e.stopPropagation();
											deleteTask(task.id);
										}}
										title="Delete task"
									>
										<Trash2 className="size-4" />
									</button>
								</div>
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
}

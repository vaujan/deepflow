"use client";

import { Plus, CheckCircle, Circle, Trash2 } from "lucide-react";
import React, { useState } from "react";

interface Task {
	id: number;
	text: string;
	completed: boolean;
}

export default function WidgetTask() {
	const [tasks, setTasks] = useState<Task[]>([
		{
			id: 1,
			text: "Complete project documentation",
			completed: false,
		},
		{ id: 2, text: "Review code changes", completed: true },
		{
			id: 3,
			text: "Setup development environment",
			completed: false,
		},
	]);
	const [newTask, setNewTask] = useState("");

	const addTask = () => {
		if (newTask.trim()) {
			const task: Task = {
				id: Date.now(),
				text: newTask,
				completed: false,
			};
			setTasks([...tasks, task]);
			setNewTask("");
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

	return (
		<div className="card bg-base-300 w-full h-full gap-3 border border-base-100 p-4">
			<div className="flex items-center justify-between">
				<h3 className="text-md font-bold">Tasks</h3>
				<button className="btn btn-sm btn-circle" onClick={addTask}>
					<Plus className="size-4" />
				</button>
			</div>

			<div className="flex gap-2">
				<input
					type="text"
					placeholder="Add a new task..."
					className="input input-sm input-bordered flex-1"
					value={newTask}
					onChange={(e) => setNewTask(e.target.value)}
					onKeyPress={(e) => e.key === "Enter" && addTask()}
				/>
			</div>

			{/* Tasks list */}
			<div className="space-y-2 max-h-64 overflow-y-auto">
				{tasks.map((task) => (
					<div
						key={task.id}
						className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
							task.completed ? "bg-base-200/50" : "bg-base-200"
						}`}
					>
						<button
							onClick={() => toggleTask(task.id)}
							className="btn btn-ghost btn-xs p-0"
						>
							{task.completed ? (
								<CheckCircle className="size-4 text-success" />
							) : (
								<Circle className="size-4 text-base-content/50" />
							)}
						</button>
						<span
							className={`flex-1 text-sm ${
								task.completed ? "line-through text-base-content/50" : ""
							}`}
						>
							{task.text}
						</span>
						<button
							onClick={() => deleteTask(task.id)}
							className="btn btn-ghost btn-xs text-error p-0"
						>
							<Trash2 className="size-3" />
						</button>
					</div>
				))}
				ear{" "}
			</div>
		</div>
	);
}

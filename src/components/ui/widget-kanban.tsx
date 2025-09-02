import { Plus, Move } from "lucide-react";
import React from "react";

export default function WidgetKanban() {
	return (
		<div className="card bg-base-300 h-full w-fit gap-3 border border-base-100 p-4">
			<div className="flex items-center justify-between">
				<h3 className="text-md font-bold">Kanban Board</h3>
				<button className="btn btn-sm btn-secondary">
					<Plus className="size-4 text-secondary-content" />
				</button>
			</div>
			<div className="grid grid-cols-3 gap-4 w-full h-full">
				{/* List */}
				<div className="bg-base-200 w-[350px] p-3 rounded-lg">
					<h4 className="font-semibold mb-2 text-sm">To Do</h4>
					<div className="space-y-2">
						<div className="bg-base-100 p-2 rounded cursor-move hover:bg-base-200 transition-colors">
							<div className="flex items-center gap-2">
								<Move className="size-3 text-base-content/50" />
								<span className="text-sm">Task 1</span>
							</div>
						</div>
					</div>
				</div>
				<div className="bg-base-200 p-3 rounded-lg">
					<h4 className="font-semibold mb-2 text-sm">In Progress</h4>
					<div className="space-y-2">
						<div className="bg-base-100 p-2 rounded cursor-move hover:bg-base-200 transition-colors">
							<div className="flex items-center gap-2">
								<Move className="size-3 text-base-content/50" />
								<span className="text-sm">Task 2</span>
							</div>
						</div>
					</div>
				</div>
				<div className="bg-base-200 p-3 rounded-lg">
					<h4 className="font-semibold mb-2 text-sm">Done</h4>
					<div className="space-y-2">
						<div className="bg-base-100 p-2 rounded cursor-move hover:bg-base-200 transition-colors">
							<div className="flex items-center gap-2">
								<Move className="size-3 text-base-content/50" />
								<span className="text-sm">Task 3</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

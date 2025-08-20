import React from "react";
import { ActivityIcon, Kanban, Table2 } from "lucide-react";

export default function Dock() {
	return (
		<div className="p-2 rounded-box w-fit  bg-base-300/50 backdrop-blur-sm flex gap-2">
			<div className="tooltip">
				<div className="tooltip-content">
					<div className="card p-2 gap-3">
						<span>Note</span>
					</div>
				</div>
				<button className="btn btn-ghost btn-square">
					<Kanban className="w-4 h-4" />
				</button>
			</div>

			<div className="tooltip">
				<div className="tooltip-content">
					<span>Kanban Board</span>
				</div>
				<button className="relative btn btn-ghost btn-square">
					<Table2 className="w-4 h-4" />
					{/* Active indicator */}
					<div className="w-[14px] hover:animate-pulse absolute bottom-0.5 rounded-box h-1 bg-primary"></div>
				</button>
			</div>

			<div className="tooltip">
				<div className="tooltip-content">
					<span>Tasks</span>
				</div>
				<button className="btn btn-ghost btn-square">
					<ActivityIcon className="w-4 h-4" />
				</button>
			</div>
		</div>
	);
}

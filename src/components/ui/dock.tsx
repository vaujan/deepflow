import React from "react";
import { ActivityIcon, Kanban, Table2 } from "lucide-react";

export default function Dock() {
	return (
		<div className="p-2 rounded-box w-fit bg-base-300 flex gap-3">
			<button className="btn btn-ghost btn-square">
				<Kanban />
			</button>

			<button className="btn btn-ghost btn-square">
				<Table2 />
			</button>

			<button className="btn btn-ghost btn-square">
				<ActivityIcon />
			</button>
		</div>
	);
}

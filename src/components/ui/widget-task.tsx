import { Plus } from "lucide-react";
import React from "react";

export default function WidgetTask() {
	return (
		<div className="card bg-base-300 w-full h-full/ gap-3 border border-base-100 p-4">
			<div className="">
				<h3 className="text-md font-bold">Tasks</h3>
				<p className="text-base-content/50">
					Lorem ipsum dolor sit, amet consectetur adipisicing elit. At illo
					temporibus fuga.
				</p>
			</div>
			<div className="w-full h-full bg-base-200"></div>
			<div className="card-actions">
				<button className="btn btn-sm btn-secondary">
					{" "}
					<Plus className="size-4 text-secondary-content" /> Add task
				</button>
			</div>
		</div>
	);
}

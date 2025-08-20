import { Play } from "lucide-react";
import React from "react";

export default function DeepWork() {
	return (
		<div className="card bg-base-200 p-6 gap-8">
			<div className="flex flex-col">
				<h1 className="card-title">Ready to focus?</h1>
				<p className="text-base-content/50">
					Choose duration and start a focus session
				</p>
			</div>

			<div className=""></div>
			<div className="flex flex-col gap-1">
				<div className="flex text-sm justify-between">
					<p>Duration: 10 min.</p>
					<p className="badge bg-base-300 rounded-md">ends at 10.00PM</p>
				</div>
				<input type="range" className="range range-sm w-full" />
			</div>

			<select defaultValue="Pick a color" className="select w-full">
				<option disabled={true}>Your focus level</option>
				<option>1</option>
				<option>2</option>
				<option>3</option>
			</select>

			<div className="card-actions">
				<button className="btn btn-block btn-neutral">
					<Play className="size-4 text-primary" /> Start Session
				</button>
			</div>
		</div>
	);
}

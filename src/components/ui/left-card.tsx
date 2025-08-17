"use client";

import { Ellipsis } from "lucide-react";
import React from "react";

export default function LeftCard() {
	const [count, setCount] = React.useState(0);

	return (
		<div className="card p-6 gap-8 bg-base-200 max-w-[550px] w-full h-full">
			<div className="flex flex-col gap-4">
				<div className="card-title flex justify-between">
					<h1>Hello</h1>
					<details className="dropdown">
						<summary className="btn btn-circle text-base-content/50 btn-ghost btn-sm">
							<Ellipsis className="w-4 h-4" />
						</summary>
						<div className="card bg-base-200 border-base-300 dropdown-content z-1 w-52 p-2 shadow-sm">
							<h1>Hello world</h1>
						</div>
					</details>
				</div>
				<p className="text-sm text-base-content/50">
					Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus
					tempore deserunt laboriosam sunt cum eos itaque natus! Et error
					nostrum sint explicabo asperiores, in voluptas sit dolores quisquam
					harum impedit.
				</p>
			</div>
			<div className="flex flex-col gap-6">
				<input
					type="range"
					min={0}
					max={100}
					className="range range-sm w-full"
				/>

				<select defaultValue="Pick a color" className="select w-full">
					<option disabled={true}>Your focus level</option>
					<option>1</option>
					<option>2</option>
					<option>3</option>
				</select>

				<fieldset className="fieldset">
					<textarea
						className="textarea h-24 w-full"
						placeholder="Bio"
					></textarea>
				</fieldset>
				<div className="card-actions">
					<button className="btn btn-block btn-primary">Start</button>
				</div>
			</div>
		</div>
	);
}

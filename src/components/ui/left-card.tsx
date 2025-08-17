"use client";

import React from "react";

export default function LeftCard() {
	const [count, setCount] = React.useState(0);

	return (
		<div className="card p-6 gap-3 bg-base-200 w-full h-full">
			<h1 className="text-xl font-medium">Helo</h1>
			<p className="text-sm text-base-content/50">
				Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus
				tempore deserunt laboriosam sunt cum eos itaque natus! Et error nostrum
				sint explicabo asperiores, in voluptas sit dolores quisquam harum
				impedit.
			</p>
			<input type="range" min={0} max={100} className="range w-full range-sm" />
		</div>
	);
}

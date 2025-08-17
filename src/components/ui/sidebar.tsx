import React from "react";

export default function Sidebar() {
	return (
		<div className="lg:drawer-open">
			<input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
			<div className="drawer-content flex px-8 border-b border-base-300 justify-between">
				{/* Page content here */}
				<label
					htmlFor="my-drawer-2"
					className="btn btn-primary drawer-button lg:hidden"
				>
					Open drawer
				</label>
			</div>
			<div className="drawer-side">
				<label
					htmlFor="my-drawer-2"
					aria-label="close sidebar"
					className="drawer-overlay"
				></label>
				<ul className="menu menu-lg bg-base-200 text-base-content min-h-full w-80 p-4">
					{/* Sidebar content here */}
					<li>
						<a>Sidebar Item 1</a>
					</li>
					<li>
						<a>Sidebar Item 2</a>
					</li>
				</ul>
			</div>
		</div>
	);
}

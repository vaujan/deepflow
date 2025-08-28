"use client";

import {
	Home,
	Kanban,
	Notebook,
	PanelLeft,
	SquareArrowOutUpRightIcon,
} from "lucide-react";
import React from "react";
import { useSidebar } from "../../contexts/SidebarContext";

export default function Header() {
	const { isCollapsed, toggleSidebar } = useSidebar();

	return (
		<header className="w-full relative flex flex-col gap-4 flex-1 items-center justify-start">
			<div className="flex w-full h-full flex-col">
				<div className="max-w-8xl items-start h-full flex gap-6 w-full px-8 py-3">
					<nav className="flex gap-2 items-center">
						<ul>
							{/* List goes here */}
							<li>
								<button
									className="btn btn-sm btn-square btn-ghost"
									onClick={toggleSidebar}
									title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
								>
									<PanelLeft className="size-4" />
								</button>
							</li>
						</ul>
						<ul className="flex gap-1 p-2 rounded-box bg-base-100">
							{/* widgets maybe? */}
							<li>
								<button className="btn btn-sm btn-square btn-ghost">
									<Kanban className="size-4" />
								</button>
							</li>

							<li>
								<button className="btn btn-sm btn-square btn-ghost">
									<Notebook className="size-4" />
								</button>
							</li>

							<li>
								<button className="btn btn-sm btn-square btn-ghost">
									<SquareArrowOutUpRightIcon className="size-4" />
								</button>
							</li>
						</ul>
					</nav>
				</div>
			</div>
		</header>
	);
}

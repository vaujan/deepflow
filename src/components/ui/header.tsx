"use client";

import {
	Brush,
	Home,
	Kanban,
	Notebook,
	PanelLeft,
	SquareArrowOutUpRightIcon,
} from "lucide-react";
import React from "react";
import { useSidebar } from "../../contexts/SidebarContext";
import useWidgets from "../../hooks/useWidgets";

export default function Header() {
	const { isCollapsed, toggleSidebar } = useSidebar();
	const [activeWidgets, toggleWidget] = useWidgets();

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

						{/* Widgets toggle */}
						<ul className="flex gap-1 p-2 rounded-box bg-base-100">
							<li>
								<button
									className={`btn relative btn-sm btn-square ${
										activeWidgets.includes("kanban")
											? "btn-primary"
											: "btn-ghost"
									}`}
									onClick={() => toggleWidget("kanban")}
									title="Toggle Kanban widget"
								>
									<Kanban className="size-4" />
									{/* Active indicator */}
									{activeWidgets.includes("kanban") && (
										<div className="w-4 absolute bg-primary h-0.5 rounded-full -bottom-2" />
									)}
								</button>
							</li>

							<li>
								<button
									className={`btn relative btn-sm btn-square ${
										activeWidgets.includes("note") ? "btn-primary" : "btn-ghost"
									}`}
									onClick={() => toggleWidget("note")}
									title="Toggle Notes widget"
								>
									<Notebook className="size-4" />
									{/* Active indicator */}
									{activeWidgets.includes("note") && (
										<div className="w-4 absolute bg-primary h-0.5 rounded-full -bottom-2" />
									)}
								</button>
							</li>

							<li>
								<button
									className={`btn relative btn-sm btn-square ${
										activeWidgets.includes("tasks")
											? "btn-primary"
											: "btn-ghost"
									}`}
									onClick={() => toggleWidget("tasks")}
									title="Toggle Tasks widget"
								>
									<Brush className="size-4" />
									{/* Active indicator */}
									{activeWidgets.includes("tasks") && (
										<div className="w-4 absolute bg-primary h-0.5 rounded-full -bottom-2" />
									)}
								</button>
							</li>
						</ul>
					</nav>
				</div>
			</div>
		</header>
	);
}

"use client";

import React from "react";
import {
	Home,
	Mail,
	Lightbulb,
	ChevronLeft,
	ChevronRight,
	X,
	Sun,
	Moon,
	Folder,
	GraduationCap,
	Code,
	Plus,
	ChartAreaIcon,
	SquareAsterisk,
} from "lucide-react";
import { useTips, deepWorkTips } from "../../hooks/useTips";
import Profile from "./profile";
import { useTheme } from "../../contexts/ThemeContext";
import { useSidebar } from "../../contexts/SidebarContext";

interface SidebarItem {
	label: string;
	href: string;
	icon: React.ComponentType<{ className?: string }>;
}

interface WorkspaceItem {
	id: string;
	name: string;
	icon: React.ComponentType<{ className?: string }>;
}

const navigationItems: SidebarItem[] = [
	{ label: "Home", href: "/", icon: Home },
	{ label: "Stats", href: "/stats", icon: ChartAreaIcon },
	{ label: "Widgets", href: "/test-widgets", icon: SquareAsterisk },
	// { label: "Editable Table", href: "/editable-data-table-demo", icon: Edit3 },
];

const workspaceItems: WorkspaceItem[] = [
	{
		id: "master-degree",
		name: "master degree prep 2026 yessir fjaslkfjsdlkafjldksa",
		icon: GraduationCap,
	},
	{ id: "deepflow-dev", name: "deepflow dev", icon: Code },
	{ id: "ai-python", name: "python ai study", icon: Folder },
];

export default function Sidebar() {
	const { isCollapsed } = useSidebar();
	const {
		currentTipIndex,
		isAnimating,
		showTipsCard,
		currentTip,
		nextTip,
		previousTip,
		hideTipsCard,
		showTipsCardHandler,
		totalTips,
	} = useTips(deepWorkTips, 60000);

	const { theme, toggleTheme } = useTheme();

	return (
		<div className="lg:drawer-open">
			<input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

			{/* Sidebar */}
			<div className="drawer-side">
				<label
					htmlFor="my-drawer-2"
					aria-label="close sidebar"
					className="drawer-overlay"
				></label>

				<div
					className={`text-base-content min-h-full transition-all duration-300 ease-in-out ${
						isCollapsed ? "w-16" : "bg-base-200/50 w-74"
					} flex flex-col`}
				>
					{/* Navigation Menu */}
					<nav className="flex p-2">
						<ul className="menu space-y-2 w-full">
							{navigationItems.map((item) => (
								<li key={item.href}>
									<a
										href={item.href}
										className={`gap-3 ${
											isCollapsed ? "btn btn-sm btn-ghost btn-square" : ""
										}`}
										title={isCollapsed ? item.label : undefined}
									>
										<item.icon className="w-4 h-4 text-base-content/50" />
										{!isCollapsed && <span>{item.label}</span>}
									</a>
								</li>
							))}
						</ul>
					</nav>

					{/* Workspaces Section */}
					<nav className="flex-1 p-2">
						{!isCollapsed && (
							<div className="flex justify-between items-center p-2 rounded-b-none -mb-2 rounded-lg bg-base-100">
								<span className="bg-base-300 inline-flex w-fit py-1 px-2 text-xs rounded-sm text-base-content/50 font-medium">
									Workspaces
								</span>
								<button className="btn-square btn-ghost btn btn-xs">
									<Plus className="size-3 text-base-content/50" />
								</button>
							</div>
						)}
						<ul className="menu bg-base-100 rounded-box h-full w-full">
							{workspaceItems.map((item) => (
								<li key={item.id}>
									<a
										href={`/workspaces/${item.id}`}
										className={`btn btn-sm btn-ghost gap-3 text-left ${
											isCollapsed ? "btn-square" : "justify-start"
										}`}
										title={isCollapsed ? item.name : undefined}
									>
										<item.icon className="size-4 text-base-content/50" />
										{!isCollapsed && (
											<span className="line-clamp-1 ">{item.name}</span>
										)}
									</a>
								</li>
							))}
						</ul>
					</nav>

					{/* Card bottom content */}
					<div className="flex flex-col h-full p-2 gap-2">
						{/* Tips card */}
						{showTipsCard && !isCollapsed && (
							<div className="card items-start group justify-start flex text-left p-4 gap-6 bg-base-100">
								<div className="flex w-full justify-between">
									<div className="h-full badge-soft border p-2 rounded-lg flex">
										<Lightbulb className="size-4 text-accent transition-all ease-out animate-pulse" />
									</div>

									<button
										onClick={hideTipsCard}
										className="btn-ghost group-hover:visible invisible btn btn-sm btn-square"
									>
										<X className="size-4 text-base-content/50" />
									</button>
								</div>

								<div className="flex gap-6 w-full h-full flex-col">
									{/* Tips for deep work */}
									<div className="flex flex-col gap-2 overflow-hidden">
										<div
											className={`transition-all duration-150 ease-out ${
												isAnimating
													? "opacity-0 -translate-y-1"
													: "opacity-100 translate-y-0"
											}`}
										>
											<span className="font-semibold text-base-content">
												{currentTip.title}
											</span>
										</div>
										<div
											className={`transition-all duration-150 ease-out delay-75 ${
												isAnimating
													? "opacity-0 translate-y-1"
													: "opacity-100 translate-y-0"
											}`}
										>
											<p className="text-base-content/80 text-sm leading-relaxed">
												{currentTip.description}
											</p>
										</div>
									</div>
									<div className="w-full justify-between flex items-center">
										<button
											onClick={previousTip}
											className="btn btn-ghost btn-sm btn-square"
											title="Previous tip"
										>
											<ChevronLeft className="size-4" />
										</button>

										<div className="text-xs text-base-content/50 flex items-center gap-1">
											<span>{currentTipIndex + 1}</span>
											<span className="text-base-content/30">of</span>
											<span>{totalTips}</span>
										</div>

										<button
											onClick={nextTip}
											className="btn btn-ghost btn-sm btn-square "
											title="Next tip"
										>
											<ChevronRight className="size-4" />
										</button>
									</div>
								</div>
							</div>
						)}

						{/* Footer navigation */}
						<ul className="menu w-full space-y-2">
							{!showTipsCard && !isCollapsed && (
								<li>
									<button
										className={`gap-3 ${
											isCollapsed ? "btn btn-sm btn-ghost btn-square" : ""
										}`}
										onClick={showTipsCardHandler}
										title={isCollapsed ? "Tips" : undefined}
									>
										<Lightbulb className="w-4 h-4 text-base-content/50" />
										{!isCollapsed && <span className="text-sm">Tips</span>}
									</button>
								</li>
							)}

							<li>
								<a
									href="#feedback"
									className={`gap-3 ${
										isCollapsed ? "btn btn-sm btn-ghost btn-square" : ""
									}`}
									title={isCollapsed ? "Feedback" : undefined}
								>
									<Mail className="w-4 h-4 text-base-content/50" />
									{!isCollapsed && <span>Feedback</span>}
								</a>
							</li>

							{/* Theme Toggle */}
							<li>
								<button
									onClick={toggleTheme}
									className={`gap-3 ${
										isCollapsed ? "btn btn-sm btn-ghost btn-square" : ""
									}`}
									title={
										isCollapsed
											? `Switch to ${theme === "dark" ? "light" : "dark"} theme`
											: `Switch to ${theme === "dark" ? "light" : "dark"} theme`
									}
								>
									{theme === "dark" ? (
										<Sun className="w-4 h-4 text-base-content/50" />
									) : (
										<Moon className="w-4 h-4 text-base-content/50" />
									)}
									{!isCollapsed && (
										<span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
									)}
								</button>
							</li>
						</ul>

						{/* Profile bottom */}
						<Profile isCollapsed={isCollapsed} />
					</div>
				</div>
			</div>
		</div>
	);
}

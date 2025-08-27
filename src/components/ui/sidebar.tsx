"use client";

import React from "react";
import {
	Home,
	Mail,
	Search,
	Lightbulb,
	ChevronLeft,
	ChevronRight,
	X,
	TestTube2,
	Sun,
	Moon,
	Table,
	Edit3,
	Menu,
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

const navigationItems: SidebarItem[] = [
	{ label: "Home", href: "/", icon: Home },
	{ label: "Test Page", href: "/test", icon: TestTube2 },
	{ label: "Data Table", href: "/data-table-demo", icon: Table },
	{ label: "Editable Table", href: "/editable-data-table-demo", icon: Edit3 },
	// { label: "About", href: "/about", icon: User },
	// { label: "Experience", href: "/experience", icon: Briefcase },
	// { label: "Projects", href: "/projects", icon: Code2 },
	// { label: "Education", href: "/education", icon: GraduationCap },
	// { label: "Resume", href: "/resume", icon: FileText },
	// { label: "Contact", href: "/contact", icon: Mail },
];

export default function Sidebar() {
	const { isHidden, toggleSidebar } = useSidebar();
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
	} = useTips(deepWorkTips, 60000); // 60000ms = 1 minute

	const { theme, toggleTheme } = useTheme();

	return (
		<div className="lg:drawer-open ">
			<input id="my-drawer-2" type="checkbox" className="drawer-toggle " />

			{/* Sidebar */}
			<div className="drawer-side w-full">
				<label
					htmlFor="my-drawer-2"
					aria-label="close sidebar"
					className="drawer-overlay"
				></label>

				<div
					className={`bg-base-200 text-base-content min-h-full w-74 flex flex-col transition-all duration-500 ease-in-out transform ${
						isHidden
							? "translate-x-[-100%] opacity-0 scale-95"
							: "translate-x-0 opacity-100 scale-100"
					}`}
				>
					{/* Toggle Button */}
					<div className="flex justify-end p-2">
						<button
							onClick={toggleSidebar}
							className="btn btn-ghost btn-sm btn-square transition-transform duration-300 hover:rotate-90"
							title="Hide sidebar"
						>
							<X className="w-4 h-4" />
						</button>
					</div>

					{/* Navigation Menu */}
					<nav className="flex-1 p-2">
						<ul className="menu space-y-2 h-full w-full">
							<label
								className={`input mb-6 bg-base-100 hover:bg-base-200 border-1 transition-all duration-300 ease-out transform ${
									isHidden
										? "opacity-0 translate-y-2"
										: "opacity-100 translate-y-0"
								}`}
							>
								<Search />
								<input type="search" className="grow" placeholder="Search" />
								<kbd className="kbd kbd-sm rounded-sm px-3">ctrl</kbd>
								<kbd className="kbd kbd-sm rounded-sm">K</kbd>
							</label>

							{navigationItems.map((item, index) => (
								<li
									key={item.href}
									className={`transition-all duration-300 ease-out transform ${
										isHidden
											? "opacity-0 translate-x-4"
											: "opacity-100 translate-x-0"
									}`}
									style={{ transitionDelay: `${index * 50}ms` }}
								>
									<a
										href={item.href}
										className="flex border border-base-200 items-center gap-3 transition-colors duration-200"
									>
										<item.icon className="w-4 h-4 text-base-content/50" />
										<span>{item.label}</span>
									</a>
								</li>
							))}
						</ul>
					</nav>

					{/* Card bottom content */}
					<div className="flex flex-col h-full p-2 gap-2">
						{/* Tips card */}
						{showTipsCard && (
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
							{!showTipsCard && (
								<li>
									<button className="gap-3" onClick={showTipsCardHandler}>
										<Lightbulb className="w-4 h-4 text-base-content/50" />
										<span className="text-sm">Tips</span>
									</button>
								</li>
							)}

							<li>
								<a href="#feedback" className="gap-3">
									<Mail className="w-4 h-4 text-base-content/50" />
									<span>Feedback</span>
								</a>
							</li>

							{/* Theme Toggle */}
							<li>
								<button
									onClick={toggleTheme}
									className="gap-3 transition-colors duration-200 hover:bg-base-100"
									title={`Switch to ${
										theme === "dark" ? "light" : "dark"
									} theme`}
								>
									{theme === "dark" ? (
										<Sun className="w-4 h-4 text-base-content/50" />
									) : (
										<Moon className="w-4 h-4 text-base-content/50" />
									)}
									<span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
								</button>
							</li>
						</ul>

						{/* Profile bottom */}
						<div
							className={`transition-all duration-300 ease-out transform ${
								isHidden
									? "opacity-0 translate-y-2"
									: "opacity-100 translate-y-0"
							}`}
						>
							<Profile />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

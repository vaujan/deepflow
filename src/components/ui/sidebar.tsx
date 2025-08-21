"use client";

import React, { useState } from "react";
import {
	Home,
	User,
	Briefcase,
	FileText,
	Mail,
	Code2,
	GraduationCap,
	Globe,
	Menu,
	Search,
	LogOut,
	Settings,
	BadgeInfo,
	Kanban,
	Lightbulb,
	ChevronLeft,
	ChevronRight,
	X,
} from "lucide-react";

interface SidebarItem {
	label: string;
	href: string;
	icon: React.ComponentType<{ className?: string }>;
}

interface DeepWorkTip {
	title: string;
	description: string;
}

const deepWorkTips: DeepWorkTip[] = [
	{
		title: "Time Blocking",
		description:
			"Schedule dedicated 90-minute blocks for deep work. Protect these times from meetings and interruptions.",
	},
	{
		title: "Environment Setup",
		description:
			"Create a distraction-free workspace. Remove notifications, close unnecessary tabs, and use noise-canceling if needed.",
	},
	{
		title: "The 20-Minute Rule",
		description:
			"If you're struggling to focus, commit to just 20 minutes. Often, momentum builds and you'll want to continue.",
	},
	{
		title: "Energy Management",
		description:
			"Schedule deep work during your peak energy hours. Most people are most focused in the morning.",
	},
	{
		title: "Single Task Focus",
		description:
			"Work on one task at a time. Multitasking reduces quality and increases time to completion.",
	},
	{
		title: "Break Strategy",
		description:
			"Take 5-10 minute breaks every 90 minutes. Use this time to stretch, walk, or do something completely different.",
	},
	{
		title: "Goal Clarity",
		description:
			"Define what 'done' looks like before starting. Clear objectives help maintain focus and motivation.",
	},
	{
		title: "Digital Minimalism",
		description:
			"Use apps and tools that support deep work, not distract from it. Consider website blockers during focus sessions.",
	},
];

const navigationItems: SidebarItem[] = [
	{ label: "Home", href: "/home", icon: Home },
	{ label: "Placeholder", href: "/", icon: Kanban },
	// { label: "About", href: "/about", icon: User },
	// { label: "Experience", href: "/experience", icon: Briefcase },
	// { label: "Projects", href: "/projects", icon: Code2 },
	// { label: "Education", href: "/education", icon: GraduationCap },
	// { label: "Resume", href: "/resume", icon: FileText },
	// { label: "Contact", href: "/contact", icon: Mail },
];

export default function Sidebar() {
	const [currentTipIndex, setCurrentTipIndex] = useState(0);
	const [isAnimating, setIsAnimating] = useState(false);

	const nextTip = () => {
		if (isAnimating) return;
		setIsAnimating(true);
		setCurrentTipIndex((prev) => (prev + 1) % deepWorkTips.length);
		setTimeout(() => setIsAnimating(false), 150);
	};

	const previousTip = () => {
		if (isAnimating) return;
		setIsAnimating(true);
		setCurrentTipIndex(
			(prev) => (prev - 1 + deepWorkTips.length) % deepWorkTips.length
		);
		setTimeout(() => setIsAnimating(false), 150);
	};

	const currentTip = deepWorkTips[currentTipIndex];

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

				<div className="bg-base-200 text-base-content min-h-full w-80 flex flex-col">
					{/* Navigation Menu */}
					<nav className="flex-1 p-2">
						<ul className="menu space-y-2  h-full w-full ">
							<label className="input mb-6 bg-base-100 hover:bg-base-200 border-1">
								<Search />
								<input type="search" className="grow" placeholder="Search" />
								<kbd className="kbd kbd-sm rounded-sm px-3">ctrl</kbd>
								<kbd className="kbd kbd-sm rounded-sm">K</kbd>
							</label>

							{navigationItems.map((item) => (
								<li key={item.href}>
									<a
										href={item.href}
										className="flex border border-base-200  items-center gap-3 transition-colors duration-200"
									>
										<item.icon className="w-4 h-4 text-base-content/50" />
										<span>{item.label}</span>
									</a>
								</li>
							))}
						</ul>
					</nav>
					{/* Card bottom content */}
					<div className="flex flex-col h-full p-4 gap-2">
						{/* Tips card */}
						<div className="card items-start group justify-start flex text-left p-4 gap-6 bg-base-100">
							{/* badge */}
							<div className="flex w-full justify-between">
								<div className="h-full badge-soft border p-2 rounded-lg flex">
									<Lightbulb className="size-4 text-accent transition-all ease-out animate-pulse" />
								</div>

								<button className="btn-ghost group-hover:visible invisible btn btn-sm btn-square ">
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
										<span>{deepWorkTips.length}</span>
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
						{/* Helper and widget */}
						{/* <div className="w-full border-dashed flex justify-between items-center gap-4">
							<button className="btn btn-sm btn-circle btn-ghost">
								<Settings className="w-4 h-4" />
							</button>

							<button className="btn-sm btn rounded-full btn-soft">
								Add Widget
							</button>

							<button className="btn btn-sm btn-circle btn-ghost">
								<BadgeInfo className="w-4 h-4" />
							</button>
						</div> */}
						{/* Profile bottom */}
						<div className="transition-all hover:bg-base-100 rounded-box w-full items-center px-4 py-4 border-1 border-base-200 flex gap-3 relative">
							<div className="avatar avatar-online">
								<div className="w-10 rounded-full">
									<img src="https://img.daisyui.com/images/profile/demo/gordon@192.webp" />
								</div>
							</div>
							<div className="flex flex-col text-sm">
								<span className="font-medium text-base-content">
									Ahmad Fauzan
								</span>
								<p className="text-base-content/50">buildfrombed@gmail.com</p>
							</div>
							<button className="btn btn-sm btn-square btn-ghost  absolute right-2">
								<LogOut className="w-4 h-4" />
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

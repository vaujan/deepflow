import React from "react";
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
} from "lucide-react";

interface SidebarItem {
	label: string;
	href: string;
	icon: React.ComponentType<{ className?: string }>;
}

const navigationItems: SidebarItem[] = [
	{ label: "Placeholder", href: "/", icon: Kanban },
	// { label: "About", href: "/about", icon: User },
	// { label: "Experience", href: "/experience", icon: Briefcase },
	// { label: "Projects", href: "/projects", icon: Code2 },
	// { label: "Education", href: "/education", icon: GraduationCap },
	// { label: "Resume", href: "/resume", icon: FileText },
	// { label: "Contact", href: "/contact", icon: Mail },
];

export default function Sidebar() {
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
					<div className="flex flex-col h-full p-2 ">
						<div className="alert items-start justify-start flex flex-col alert-vertical text-left bg-base-100">
							<div className="badge bg-white text-primary px-2 py-4 gap-1 rounded-lg ">
								<Lightbulb className="size-6" />
								<span className="text-left w-full font-semibold">Tips</span>
							</div>
							<div className="flex flex-col gap-2">
								<p className="text-base-content/80 ">
									Lorem, ipsum dolor sit amet consectetur adipisicing elit.
									Voluptas aspernatur ab quibusdam quos minus facere, totam
									sequi, laboriosam optio nostrum ullam sed velit.
								</p>
							</div>
							<div className="w-full justify-between flex">
								<button className="btn btn-ghost btn-sm btn-circle btn-info">
									<ChevronLeft className="size-4" />
								</button>
								<button className="btn btn-ghost btn-circle btn-sm btn-info">
									<ChevronRight className="size-4" />
								</button>
							</div>
						</div>{" "}
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

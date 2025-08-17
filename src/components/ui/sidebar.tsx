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
} from "lucide-react";

interface SidebarItem {
	label: string;
	href: string;
	icon: React.ComponentType<{ className?: string }>;
}

const navigationItems: SidebarItem[] = [
	{ label: "Home", href: "/", icon: Home },
	{ label: "About", href: "/about", icon: User },
	{ label: "Experience", href: "/experience", icon: Briefcase },
	{ label: "Projects", href: "/projects", icon: Code2 },
	{ label: "Education", href: "/education", icon: GraduationCap },
	{ label: "Resume", href: "/resume", icon: FileText },
	{ label: "Contact", href: "/contact", icon: Mail },
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
					<nav className="flex-1 p-4">
						<ul className="menu space-y-2  w-full ">
							<label className="input mb-6 bg-base-100 hover:bg-base-200 border-1">
								<Search />
								<input type="search" className="grow" placeholder="Search" />
								<kbd className="kbd kbd-sm rounded-sm">ctrl</kbd>
								<kbd className="kbd kbd-sm rounded-sm">K</kbd>
							</label>

							{navigationItems.map((item) => (
								<li key={item.href}>
									<a
										href={item.href}
										className="flex items-center gap-3 transition-colors duration-200"
									>
										<item.icon className="w-4 h-4 text-base-content/50" />
										<span>{item.label}</span>
									</a>
								</li>
							))}
						</ul>
					</nav>
				</div>
			</div>
		</div>
	);
}

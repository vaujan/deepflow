"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
	BarChart3,
	LogOut,
	SunMoon,
	User as UserIcon,
	ChevronDown,
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { toast } from "sonner";

type IconType = React.ComponentType<{ size?: number; className?: string }>;

type MenuItem =
	| { type: "link"; label: string; href: string; icon?: IconType }
	| {
			type: "action";
			label: string;
			onSelect: () => void;
			icon?: IconType;
			tone?: "default" | "danger";
	  }
	| { type: "separator" };

interface ProfileProps {
	isCollapsed?: boolean;
	name?: string;
	email?: string;
	avatarUrl?: string;
	items?: MenuItem[];
	onLogout?: () => void;
}

export default function Profile({
	isCollapsed = false,
	name = "Ahmad Fauzan",
	email = "buildfrombed@gmail.com",
	avatarUrl = "https://img.daisyui.com/images/profile/demo/gordon@192.webp",
	items,
	onLogout,
}: ProfileProps) {
	const router = useRouter();
	const { toggleTheme, theme } = useTheme();

	const handleToggleTheme = () => {
		toggleTheme();
		toast.success(`Switched to ${theme === "dark" ? "light" : "dark"} theme`);
	};

	const handleLogout = () => {
		if (onLogout) {
			onLogout();
			return;
		}
		// Placeholder logout action
		toast.success("Logged out");
		router.push("/");
	};

	const defaultItems: MenuItem[] = [
		{ type: "link", label: "Stats", href: "/stats", icon: BarChart3 },
		{
			type: "action",
			label: "Toggle theme",
			onSelect: handleToggleTheme,
			icon: SunMoon,
		},
		{ type: "link", label: "Profile", href: "/profile", icon: UserIcon },
		{ type: "separator" },
		{
			type: "action",
			label: "Log out",
			onSelect: handleLogout,
			icon: LogOut,
			tone: "danger",
		},
	];

	const menuItems = items ?? defaultItems;

	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild>
				<button
					className={`transition-all group hover:bg-base-100 rounded-box items-center flex gap-3 relative cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
						isCollapsed
							? "btn btn-ghost btn-square justify-center px-2 py-2"
							: "px-2 py-2"
					}`}
					aria-label="Open profile menu"
				>
					<div className="avatar avatar-online">
						<div
							className={`rounded-full ${
								isCollapsed ? "w-8 h-8" : "w-10 h-10"
							}`}
						>
							<img
								src={avatarUrl}
								alt="Profile"
								className="w-full h-full object-cover"
							/>
						</div>
					</div>

					{!isCollapsed && (
						<div className="flex flex-col text-sm text-left">
							<span className="font-medium text-base-content w-full">
								{name}
							</span>
							<p className="text-base-content/50">{email}</p>
						</div>
					)}

					{!isCollapsed && (
						<ChevronDown
							size={16}
							className="ml-1 text-base-content/70 transition-transform duration-200 group-data-[state=open]:rotate-180"
							aria-hidden="true"
						/>
					)}
				</button>
			</DropdownMenu.Trigger>

			<DropdownMenu.Portal>
				<DropdownMenu.Content
					align="end"
					sideOffset={8}
					className="rounded-box bg-base-100 text-base-content shadow-xl p-2 min-w-56 focus:outline-none"
				>
					{menuItems.map((item, index) => {
						if (item.type === "separator") {
							return (
								<DropdownMenu.Separator
									key={`sep-${index}`}
									className="my-1 h-px bg-base-200"
								/>
							);
						}

						if (item.type === "link") {
							const Icon = item.icon as IconType | undefined;
							return (
								<DropdownMenu.Item asChild key={`link-${item.href}-${index}`}>
									<Link
										href={item.href}
										className="flex items-center gap-2 rounded-md px-2 py-2 hover:bg-base-200 focus:bg-base-200 focus:outline-none"
									>
										{Icon ? <Icon size={16} /> : null}
										<span>{item.label}</span>
									</Link>
								</DropdownMenu.Item>
							);
						}

						const Icon = item.icon as IconType | undefined;
						const danger = item.tone === "danger";
						return (
							<DropdownMenu.Item
								key={`action-${item.label}-${index}`}
								onSelect={(e) => {
									e.preventDefault();
									item.onSelect();
								}}
								className={`flex items-center gap-2 rounded-md px-2 py-2 hover:bg-base-200 focus:bg-base-200 focus:outline-none cursor-pointer ${
									danger ? "text-error" : ""
								}`}
							>
								{Icon ? <Icon size={16} /> : null}
								<span>{item.label}</span>
							</DropdownMenu.Item>
						);
					})}

					<DropdownMenu.Arrow className="fill-base-100" />
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	);
}

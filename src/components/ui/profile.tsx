"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
	BarChart3,
	LogOut,
	SunMoon,
	User as UserIcon,
	ChevronDown,
	LogIn,
	MessageSquare,
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { toast } from "sonner";
import { supabase } from "../../lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import FeedbackModal from "./feedback-modal";

type IconType = React.ComponentType<{ size?: number; className?: string }>;

type MenuItem =
	| {
			type: "link";
			label: string;
			href: string;
			icon?: IconType;
			badge?: string;
	  }
	| {
			type: "action";
			label: string;
			onSelect: () => void;
			icon?: IconType;
			tone?: "default" | "danger";
			badge?: string;
	  }
	| { type: "separator" };

interface ProfileProps {
	isCollapsed?: boolean;
	items?: MenuItem[];
	onLogout?: () => void;
}

export default function Profile({
	isCollapsed = false,
	items,
	onLogout,
}: ProfileProps) {
	const router = useRouter();
	const { toggleTheme, theme } = useTheme();
	const [menuOpen, setMenuOpen] = useState(false);
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [imageError, setImageError] = useState(false);
	const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
	const triggerRef = useRef<HTMLButtonElement | null>(null);

	const displayName =
		user?.user_metadata?.full_name ||
		user?.user_metadata?.name ||
		user?.email?.split("@")[0] ||
		"User";

	const avatarUrl =
		user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null;

	const getInitials = (name?: string, email?: string) => {
		const base =
			(name && name.trim()) || (email ? email.split("@")[0] : "") || "User";
		const parts = base.split(/\s+/).filter(Boolean);
		const initials = (parts[0]?.[0] || "") + (parts[1]?.[0] || "");
		return (initials || base[0] || "U").toUpperCase();
	};

	useEffect(() => {
		// Reset image error when avatar URL changes
		setImageError(false);
	}, [avatarUrl]);

	useEffect(() => {
		// Get initial session
		const getSession = async () => {
			try {
				const { getSupabaseBrowserClient } = await import(
					"../../lib/supabase/client"
				);
				const supabase = getSupabaseBrowserClient();

				const {
					data: { session },
				} = await supabase.auth.getSession();
				setUser(session?.user ?? null);
				setLoading(false);

				// Listen for auth changes
				const {
					data: { subscription },
				} = supabase.auth.onAuthStateChange((event, session) => {
					setUser(session?.user ?? null);
					setLoading(false);
				});

				return () => subscription.unsubscribe();
			} catch (error) {
				console.error("Failed to initialize Supabase client:", error);
				setLoading(false);
			}
		};

		getSession();
	}, []);

	const handleToggleTheme = () => {
		toggleTheme();
		toast.success(`Switched to ${theme === "dark" ? "light" : "dark"} theme`);
	};

	const handleLogout = async () => {
		if (onLogout) {
			onLogout();
			return;
		}

		try {
			const { getSupabaseBrowserClient } = await import(
				"../../lib/supabase/client"
			);
			const supabase = getSupabaseBrowserClient();

			const { error } = await supabase.auth.signOut();
			if (error) {
				toast.error("Failed to log out");
			} else {
				toast.success("Logged out successfully");
				router.push("/login");
			}
		} catch (err) {
			toast.error("An unexpected error occurred");
		}
	};

	const handleLogin = () => {
		router.push("/login");
	};

	const badgeText = (process.env.NEXT_PUBLIC_APP_VERSION || "beta")
		.toLowerCase()
		.includes("beta")
		? "We're in Beta!"
		: "Help us improve";

	const defaultItems: MenuItem[] = user
		? [
				{ type: "link", label: "Stats", href: "/stats", icon: BarChart3 },
				{
					type: "action",
					label: "Give feedback",
					onSelect: () => {
						setIsFeedbackOpen(true);
					},
					icon: MessageSquare,
					badge: badgeText,
				},
				{
					type: "action",
					label: "Toggle theme",
					onSelect: handleToggleTheme,
					icon: SunMoon,
				},
				{ type: "separator" },
				{
					type: "action",
					label: "Log out",
					onSelect: handleLogout,
					icon: LogOut,
					tone: "danger",
				},
		  ]
		: [
				{
					type: "action",
					label: "Give feedback",
					onSelect: () => {
						setIsFeedbackOpen(true);
					},
					icon: MessageSquare,
					badge: badgeText,
				},
				{
					type: "action",
					label: "Log in",
					onSelect: handleLogin,
					icon: LogIn,
				},
				{
					type: "action",
					label: "Toggle theme",
					onSelect: handleToggleTheme,
					icon: SunMoon,
				},
		  ];

	const menuItems = items ?? defaultItems;

	return (
		<>
			<DropdownMenu.Root
				open={menuItems.length > 0 ? menuOpen : undefined}
				onOpenChange={setMenuOpen}
			>
				<DropdownMenu.Trigger asChild>
					<button
						className={`transition-all group hover:bg-base-100 rounded-box items-center flex gap-3 relative cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
							isCollapsed
								? "btn btn-ghost btn-square justify-center px-2 py-2"
								: "px-2 py-2"
						}`}
						aria-label="Open profile menu"
						ref={triggerRef}
					>
						<div className="avatar">
							<div
								className={`rounded-full ${
									isCollapsed ? "w-8 h-8" : "w-10 h-10"
								}`}
							>
								{avatarUrl && !imageError ? (
									<img
										src={avatarUrl}
										alt={displayName}
										className="w-full h-full object-cover"
										onError={() => setImageError(true)}
									/>
								) : (
									<div
										className="w-full h-full flex items-center justify-center bg-base-200 text-base-content/80"
										aria-label={`Avatar fallback for ${displayName}`}
									>
										<span
											className={`${
												isCollapsed ? "text-xs" : "text-sm"
											} font-medium`}
										>
											{getInitials(displayName, user?.email || undefined)}
										</span>
									</div>
								)}
							</div>
						</div>

						{!isCollapsed && (
							<div className="flex flex-col text-sm text-left">
								<span className="font-medium text-base-content w-full">
									{displayName}
								</span>
								<p className="text-base-content/50">{user?.email || ""}</p>
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
											target={item.href === "/stats" ? "_blank" : undefined}
											rel={
												item.href === "/stats"
													? "noopener noreferrer"
													: undefined
											}
										>
											{Icon ? <Icon size={16} /> : null}
											<span className="flex-1">{item.label}</span>
											{"badge" in item && item.badge ? (
												<span className="badge badge-sm badge-soft rounded-sm badge-accent">
													{item.badge}
												</span>
											) : null}
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
										setMenuOpen(false);
									}}
									className={`flex items-center gap-2 rounded-md px-2 py-2 hover:bg-base-200 focus:bg-base-200 focus:outline-none cursor-pointer ${
										danger ? "text-error" : ""
									}`}
								>
									{Icon ? <Icon size={16} /> : null}
									<span className="flex-1">{item.label}</span>
									{"badge" in item && (item as any).badge ? (
										<span className="badge badge-sm badge-soft rounded-sm badge-accent">
											{(item as any).badge}
										</span>
									) : null}
								</DropdownMenu.Item>
							);
						})}

						<DropdownMenu.Arrow className="fill-base-100" />
					</DropdownMenu.Content>
				</DropdownMenu.Portal>
			</DropdownMenu.Root>
			<FeedbackModal
				isOpen={isFeedbackOpen}
				onClose={() => setIsFeedbackOpen(false)}
				returnFocusRef={triggerRef}
			/>
		</>
	);
}

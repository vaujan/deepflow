"use client";

import { User } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";

interface ProfileProps {
	isCollapsed?: boolean;
}

export default function Profile({ isCollapsed = false }: ProfileProps) {
	const router = useRouter();

	const navigateToProfile = () => {
		router.push("/profile");
	};

	return (
		<button
			onClick={navigateToProfile}
			className={`transition-all group hover:bg-base-100 rounded-box w-full items-center border-1 border-base-200 flex gap-3 relative cursor-pointer ${
				isCollapsed
					? "btn btn-sm btn-ghost btn-square justify-center px-2 py-2"
					: "px-4 py-4"
			}`}
			title={isCollapsed ? "Profile" : undefined}
		>
			<div className="avatar avatar-online">
				<div
					className={`rounded-full ${isCollapsed ? "w-8 h-8" : "w-10 h-10"}`}
				>
					<img
						src="https://img.daisyui.com/images/profile/demo/gordon@192.webp"
						alt="Profile"
						className="w-full h-full object-cover"
					/>
				</div>
			</div>
			{!isCollapsed && (
				<div className="flex flex-col text-sm text-left">
					<span className="font-medium text-base-content w-full">
						Ahmad Fauzan
					</span>
					<p className="text-base-content/50">buildfrombed@gmail.com</p>
				</div>
			)}
		</button>
	);
}

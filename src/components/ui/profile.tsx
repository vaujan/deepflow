"use client";

import { User } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";

export default function Profile() {
	const router = useRouter();

	const navigateToProfile = () => {
		router.push("/profile");
	};

	return (
		<button
			onClick={navigateToProfile}
			className="transition-all group hover:bg-base-100 rounded-box w-full items-center px-4 py-4 border-1 border-base-200 flex gap-3 relative cursor-pointer"
		>
			<div className="avatar avatar-online">
				<div className="w-10 rounded-full">
					<img
						src="https://img.daisyui.com/images/profile/demo/gordon@192.webp"
						alt="Profile"
					/>
				</div>
			</div>
			<div className="flex flex-col text-sm text-left">
				<span className="font-medium text-base-content w-full">
					Ahmad Fauzan
				</span>
				<p className="text-base-content/50">buildfrombed@gmail.com</p>
			</div>
		</button>
	);
}

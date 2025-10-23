"use client";

import { Home } from "lucide-react";
import React from "react";
import Profile from "./profile";
import Link from "next/link";
import { useAuthUser } from "@/src/hooks/useAuthUser";

export default function Header() {
	const { isGuest } = useAuthUser();
	return (
		<header className="w-full relative border-b border-border/50 flex flex-col gap-4 items-center justify-start">
			<div className="flex w-full h-fit justify-center items-center flex-col">
				<div className="max-w-[1440px] items-center h-fit flex justify-between gap-6 w-full px-8 py-3">
					{/* active widgets count */}
					<Link href={"/"}>
						<button className="btn btn-md btn-ghost ">
							<Home className="text-base-content/50 size-4" />
							Home
						</button>
					</Link>
					{isGuest ? (
						<Link href="/login">
							<button
								className="btn btn-sm btn-primary"
								aria-label="Sign in to save & sync"
							>
								Sign in to save & sync
							</button>
						</Link>
					) : (
						<Profile />
					)}
				</div>
			</div>
		</header>
	);
}

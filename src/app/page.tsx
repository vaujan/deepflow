"use client";

import Dock from "@/src/components/ui/dock";
import SessionCard from "@/src/components/ui/session-card";
import Sidebar from "@/src/components/ui/sidebar";
import { SidebarToggle } from "@/src/components/ui/sidebar-toggle";
import { SidebarExampleUsage } from "@/src/components/ui/sidebar-example-usage";
import { useSidebar } from "@/src/contexts/SidebarContext";
import React from "react";
import { DataTable } from "../components/ui/data-table";

export default function Page() {
	const { isHidden } = useSidebar();

	return (
		<div className="min-h-screen bg-base-300 w-full flex flex-col lg:flex-row">
			<Sidebar />
			{/* Container */}
			<main
				className={`w-full relative  flex flex-col gap-4 flex-1items-center justify-start transition-all duration-500 ease-in-out transform ${
					isHidden ? "lg:ml-0" : "lg:ml-74"
				}`}
			>
				{/* Header with sidebar toggle */}
				<div className="w-full flex-1 px-8 py-4 border-b border-base-200 bg-base-100">
					<div className="flex items-center gap-4">
						<SidebarToggle variant="ghost" size="sm" />
						<h1 className="text-xl font-semibold text-base-content">
							Dashboard
						</h1>
					</div>
				</div>

				<div className="flex w-full h-full flex-col">
					<div className="max-w-8xl items-start justify-center h-full flex gap-6 w-full px-8 py-8">
						<SessionCard />
						{/* <SessionTable /> */}
						{/* <DataTable /> */}
						{/* <SessionGraph /> */}
					</div>
				</div>

				{/* Widgets layout */}
				<div className="min-h-screen w-full justify-center items-center flex flex-col gap-4 ">
					{/* Sidebar Controls Demo */}
					<div className="w-full px-4">
						<SidebarExampleUsage />
					</div>

					{/* Kanban widget */}
					{/* <div className="flex flex-col w-full h-fit px-4">
						<div className="w-full h-128 rounded-box bg-base-100 border border-base-100"></div>
					</div> */}

					{/* Notes and tasks widget */}
					{/* <div className="flex w-full gap-4 h-fit px-4">
						<div className="w-full h-128 rounded-box bg-base-100 border border-base-100"></div>
						<div className="w-full h-128 rounded-box bg-base-100 border border-base-100"></div>
					</div> */}
				</div>
				<div className="font-medium sticky w-32 bottom-10">
					<Dock />
				</div>
			</main>
		</div>
	);
}

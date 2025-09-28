"use client";

import { Kanban, ListTodo, Notebook, PanelLeft, Timer } from "lucide-react";
import React from "react";
import { useSidebar } from "../../contexts/SidebarContext";
import { useWidgets } from "../../contexts/WidgetContext";
import FontSelector from "./font-selector";
import ThemeCustomizer from "./theme-customizer";
import Profile from "./profile";
import Dock from "./widget-list";

export default function Header() {
	return (
		<header className="w-full relative border-b border-border/50 flex flex-col gap-4 items-center justify-start">
			<div className="flex w-full h-fit flex-col">
				<div className="max-w-8xl h-fit flex justify-between gap-6 w-full px-8 py-3">
					{/* active widgets count */}
					<Dock />
					<Profile />
				</div>
			</div>
		</header>
	);
}

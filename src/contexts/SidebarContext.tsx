"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface SidebarContextType {
	isCollapsed: boolean;
	toggleSidebar: () => void;
	setCollapsed: (collapsed: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
	const [isCollapsed, setIsCollapsed] = useState(false);

	const toggleSidebar = () => {
		setIsCollapsed(!isCollapsed);
	};

	const setCollapsed = (collapsed: boolean) => {
		setIsCollapsed(collapsed);
	};

	return (
		<SidebarContext.Provider
			value={{ isCollapsed, toggleSidebar, setCollapsed }}
		>
			{children}
		</SidebarContext.Provider>
	);
}

export function useSidebar() {
	const context = useContext(SidebarContext);
	if (context === undefined) {
		throw new Error("useSidebar must be used within a SidebarProvider");
	}
	return context;
}

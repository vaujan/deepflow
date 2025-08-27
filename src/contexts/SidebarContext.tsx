"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface SidebarContextType {
	isHidden: boolean;
	toggleSidebar: () => void;
	showSidebar: () => void;
	hideSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
	const [isHidden, setIsHidden] = useState(false);

	const toggleSidebar = () => {
		setIsHidden(!isHidden);
	};

	const showSidebar = () => {
		setIsHidden(false);
	};

	const hideSidebar = () => {
		setIsHidden(true);
	};

	return (
		<SidebarContext.Provider
			value={{ isHidden, toggleSidebar, showSidebar, hideSidebar }}
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
